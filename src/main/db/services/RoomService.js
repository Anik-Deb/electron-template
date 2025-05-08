import { client } from '../Client';

const RoomService = {
  // Retrieve all rooms data only

  // Version: 2
  getAll: async () => {
    try {
    //   const query = `
    //   SELECT 
    //       r.id AS room_id,
    //       r.room_number,
    //       r.status AS room_status,
    //       r.type_name,
    //       r.base_price,
    //       r.capacity,
    //       b.id AS booking_id,
    //       b.status AS booking_status,
    //       b.check_in_date,
    //       b.check_out_date,
    //       u.first_name AS first_name,
    //       u.last_name AS last_name,
    //       u.email AS user_email,
    //       u.phone AS phone
    //   FROM 
    //       Rooms r
    //   LEFT JOIN 
    //       Bookings b ON r.id = b.room_id
    //   LEFT JOIN 
    //       Users u ON b.user_id = u.id
    //   ORDER BY 
    //       r.id, b.check_in_date DESC;
    // `;

    const query = `
    SELECT 
        r.id AS room_id,
        r.room_number,
        r.status AS room_status,
        r.type_name,
        r.base_price,
        r.capacity,
        b.id AS booking_id,
        b.status AS booking_status,
        b.check_in_date,
        b.check_out_date,
        u.first_name AS first_name,
        u.last_name AS last_name,
        u.email AS user_email,
        u.phone AS phone
    FROM 
        Rooms r
    LEFT JOIN 
        Bookings b ON r.id = b.room_id AND b.status IN ('booked', 'checked')
    LEFT JOIN 
        Users u ON b.user_id = u.id
    ORDER BY 
        r.id, b.check_in_date DESC;
  `;

      const result = await client.query(query);
      const roomsMap = new Map();

      result.rows.forEach((row) => {
        const roomId = row.room_id;
        if (!roomsMap.has(roomId)) {
          roomsMap.set(roomId, {
            id: roomId,
            room_number: row.room_number,
            status: row.room_status,
            type_name: row.type_name,
            base_price: row?.base_price,
            capacity: row?.capacity,
            booking: null,
          });
        }

        if (row.booking_id) {
          const booking = {
            id: row.booking_id,
            status: row.booking_status,
            check_in_date: row.check_in_date,
            check_out_date: row.check_out_date,
            user: {
              first_name: row.first_name,
              last_name: row.last_name,
              email: row.user_email,
              phone: row.phone
            },
          };

          roomsMap.get(roomId).booking = booking;
        }
      });

      return Array.from(roomsMap.values());
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw new Error('Failed to fetch rooms');
    }
  },

  // Retrieve a specific room by ID with related amenities
  get: async (id) => {
    try {
      const query = `
      SELECT 
        r.*, 
        COALESCE(
          json_agg(
            jsonb_build_object('amenity_id', ra.amenity_id)
          ) FILTER (WHERE ra.amenity_id IS NOT NULL), '[]'
        ) AS amenities
      FROM rooms r
      LEFT JOIN room_amenities ra ON r.id = ra.room_id
      WHERE r.id = $1
      GROUP BY r.id;
    `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Room not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching room:', error);
      throw new Error('Failed to fetch room');
    }
  },

  // Add a new room with amenities
  add: async (room) => {
    try {
      // Validate required fields
      if (!room.room_number || !room.base_price || !room.capacity) {
        throw new Error('Missing required fields');
      }

      // Check if room_number already exists
      const checkQuery = `
        SELECT id FROM rooms WHERE room_number = $1;
      `;
      const checkResult = await client.query(checkQuery, [room.room_number]);

      if (checkResult.rows.length > 0) {
        throw new Error(`Room number ${room.room_number} already exists.`);
      }

      // Insert room into the rooms table
      const roomQuery = `
        INSERT INTO rooms (
          room_number, type_name, description, status, base_price, capacity
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id;
      `;

      const roomValues = [
        room.room_number,
        room.type_name || 'standard',
        room.description || null,
        room.status || 'available',
        room.base_price,
        room.capacity,
      ];

      const roomResult = await client.query(roomQuery, roomValues);
      const roomId = roomResult.rows[0].id;

      // If amenities exist, insert them into the room_amenities table
      if (room.amenities && room.amenities.length > 0) {
        // Ensure all amenities are integers
        const amenityIds = room.amenities
          .map(Number)
          .filter((id) => !isNaN(id));

        if (amenityIds.length !== room.amenities.length) {
          throw new Error('Invalid amenity IDs');
        }

        const amenityQuery = `
          INSERT INTO room_amenities (room_id, amenity_id)
          VALUES ${amenityIds.map((_, index) => `($1, $${index + 2})`).join(', ')};
        `;

        const amenityValues = [roomId, ...amenityIds];
        await client.query(amenityQuery, amenityValues);
      }

      return { id: roomId, ...room };
    } catch (error) {
      console.error('Error creating room:', error);
      throw new Error(error.message); // Forward the error message to the front end
    }
  },

  // Update a specific room by ID
  update: async ({ id, updates }) => {
    try {
      // Check if the room exists
      const room = await RoomService.get(id);
      if (!room) {
        throw new Error('Room not found');
      }

      // Separate amenities from other updates
      const { amenities, ...roomUpdates } = updates;

      // Build the dynamic query for fields to update
      const setClause = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(roomUpdates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }

      // Add the room ID as the last value for the WHERE clause
      values.push(id);

      // Update the room details if there are any updates
      if (setClause.length > 0) {
        const query = `
        UPDATE rooms 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
          throw new Error('Room update failed');
        }
      }

      // Handle updating amenities if provided
      if (amenities && Array.isArray(amenities)) {
        // Remove existing amenities for this room
        await client.query(`DELETE FROM room_amenities WHERE room_id = $1;`, [
          id,
        ]);

        if (amenities.length > 0) {
          // Insert new amenities
          const amenityQuery = `
          INSERT INTO room_amenities (room_id, amenity_id)
          VALUES ${amenities.map((_, i) => `($1, $${i + 2})`).join(', ')};
        `;
          await client.query(amenityQuery, [id, ...amenities]);
        }
      }

      // Return the updated room
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating room:', error);
      throw new Error('Failed to update room');
    }
  },

  // Delete a specific room by ID along with its related room_amenities
  delete: async (id) => {
    try {
      await client.query('BEGIN');

      // Check if the room is referenced in bookings
      const bookingCheck = await client.query(
        `SELECT 1 FROM bookings WHERE room_id = $1 LIMIT 1;`,
        [id]
      );

      if (bookingCheck.rows.length > 0) {
        throw new Error(
          'Cannot delete room: Active bookings exist for this room.'
        );
      }

      // Delete related amenities first
      await client.query(`DELETE FROM room_amenities WHERE room_id = $1;`, [
        id,
      ]);

      // Delete the room
      const query = `DELETE FROM Rooms WHERE id = $1 RETURNING *;`;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Room not found');
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting room:', error);
      throw new Error(error.message);
    }
  },

  // Delete multiple rooms by IDs along with their related room_amenities
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No room IDs provided');
      }

      await client.query('BEGIN');

      // Check if any rooms have active bookings
      const bookedRooms = await client.query(
        `SELECT DISTINCT room_id FROM bookings WHERE room_id = ANY($1::INT[]);`,
        [ids]
      );

      if (bookedRooms.rows.length > 0) {
        await client.query('ROLLBACK'); // Rollback transaction if we can't proceed
        throw new Error(
          `Cannot delete rooms with active bookings: ${bookedRooms.rows
            .map((r) => r.room_id)
            .join(', ')}`
        );
      }

      // Delete related amenities first
      await client.query(
        `DELETE FROM room_amenities WHERE room_id = ANY($1::INT[]);`,
        [ids]
      );

      // Delete the rooms
      const query = `
        DELETE FROM Rooms 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        await client.query('ROLLBACK'); // Rollback transaction if no rooms were deleted
        throw new Error('No rooms found for deletion');
      }

      await client.query('COMMIT');
      return { success: true, deletedRooms: result.rows };
    } catch (error) {
      await client.query('ROLLBACK'); // Ensure rollback on error
      console.error('Error deleting multiple rooms:', error);
      throw new Error(error || 'Failed to delete rooms');
    }
  },
};

export default RoomService;

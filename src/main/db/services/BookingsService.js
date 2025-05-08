import { client } from '../Client';

const BookingsService = {
  // Retrieve all bookings
  // getAll: async () => {
  //   try {
  //     const query = `
  //       SELECT *
  //       FROM Bookings
  //       ORDER BY created_at DESC ;
  //     `;

  //     const result = await client.query(query);
  //     return result.rows;
  //   } catch (error) {
  //     console.error('Error fetching bookings:', error);
  //     throw new Error('Failed to fetch bookings');
  //   }
  // },

  // Retrieve a specific booking by ID
  // get: async (id) => {
  //   try {
  //     const query = `
  //       SELECT *
  //       FROM Bookings
  //       WHERE id = $1;
  //     `;

  //     const result = await client.query(query, [id]);

  //     if (result.rows.length === 0) {
  //       throw new Error('Booking not found');
  //     }

  //     return result.rows[0];
  //   } catch (error) {
  //     console.error('Error fetching booking:', error);
  //     throw new Error('Failed to fetch booking');
  //   }
  // },

  // Retrieve a specific booking by ID with user details
  getAll: async () => {
    try {
      const query = `
       SELECT 
         Bookings.*,
          Users.first_name, 
          Users.last_name , 
          Users.email, 
          Users.phone, 
          Users.emergency_contact_phone, 
          Users.address_1, 
          Users.address_2, 
          Users.date_of_birth, 
          Users.profile_picture_url, 
          Users.role,  
          Guest.passport_or_national_number,  
          Guest.nationality , 
          Guest.secondary_contact, 
          Guest.relation, 
          Guest.job_title, 
          Guest.company_name, 
          Rooms.room_number
        FROM Bookings
      INNER JOIN Users ON Bookings.user_id = Users.id
      INNER JOIN Guest ON Bookings.user_id = Guest.user_id
      INNER JOIN Rooms ON Bookings.room_id = Rooms.id
      WHERE Bookings.id = $1;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  },

  get: async (id) => {
    try {
      const query = `
       SELECT 
         Bookings.*,
          Users.first_name, 
          Users.last_name , 
          Users.email, 
          Users.phone, 
          Users.emergency_contact_phone, 
          Users.address_1, 
          Users.address_2, 
          Users.date_of_birth, 
          Users.profile_picture_url, 
          Users.role,  
          Guest.passport_or_national_number,  
          Guest.nationality , 
          Guest.secondary_contact, 
          Guest.relation, 
          Guest.job_title, 
          Guest.company_name, 
          Rooms.room_number
        FROM Bookings
      INNER JOIN Users ON Bookings.user_id = Users.id
      INNER JOIN Guest ON Bookings.user_id = Guest.user_id
      INNER JOIN Rooms ON Bookings.room_id = Rooms.id
      WHERE Bookings.id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Booking not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error('Failed to fetch booking');
    }
  },

  // Create a new booking
  add: async (booking) => {
    console.log('booking:', booking);
    try {
      // Validate required fields
      if (
        !booking.user_id ||
        !booking.room_id ||
        !booking.check_in_date ||
        !booking.check_out_date ||
        !booking.total_price
      ) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Bookings (
          user_id, room_id, status ,check_in_date, check_out_date, total_price
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;

      const values = [
        booking.user_id,
        booking.room_id,
        booking.status || 'booked',
        booking.check_in_date,
        booking.check_out_date,
        booking.total_price,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  },

  // Update a specific booking by ID
  // update: async ({ id, updates }) => {
  //   try {
  //     console.log('updates:', updates);
  //     // Check if the booking exists
  //     const booking = await BookingsService.get(id);
  //     if (!booking) {
  //       throw new Error('Booking not found');
  //     }

  //     // Build the dynamic query for fields to update
  //     const setClause = [];
  //     const values = [];
  //     let index = 1;

  //     for (const [key, value] of Object.entries(updates)) {
  //       setClause.push(`${key} = $${index}`);
  //       values.push(value);
  //       index++;
  //     }

  //     // Add the id as the last value for the WHERE clause
  //     values.push(id);

  //     const query = `
  //       UPDATE Bookings
  //       SET ${setClause.join(', ')}
  //       WHERE id = $${index}
  //       RETURNING *;
  //     `;

  //     const result = await client.query(query, values);

  //     if (result.rows.length === 0) {
  //       throw new Error('Booking not found');
  //     }

  //     return result.rows[0];
  //   } catch (error) {
  //     console.error('Error updating booking:', error);
  //     throw new Error('Failed to update booking');
  //   }
  // },

  // Update a specific booking by ID
  update: async ({ id, updates }) => {
    try {
      console.log('updates:', updates);

      // Check if the booking exists first
      const booking = await BookingsService.get(id);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Check if updates is empty
      if (Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
      }

      // Build the dynamic query for fields to update
      const setClause = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined or null values to prevent invalid updates
        if (value !== undefined && value !== null) {
          setClause.push(`${key} = $${index}`);
          values.push(value);
          index++;
        }
      }

      // If no valid fields to update, throw an error
      if (setClause.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Add the id as the last value for the WHERE clause
      values.push(id);

      const query = `
      UPDATE Bookings
      SET ${setClause.join(', ')}
      WHERE id = $${index}
      RETURNING *;
    `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Booking not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error('Failed to update booking');
    }
  },

  // Delete a booking by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Bookings 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Booking not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error('Failed to delete booking');
    }
  },

  // Delete multiple bookings by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No booking IDs provided');
      }

      const query = `
        DELETE FROM Bookings 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error('No bookings found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple bookings:', error);
      throw new Error('Failed to delete bookings');
    }
  },
};

export default BookingsService;

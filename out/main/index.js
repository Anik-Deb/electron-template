"use strict";
const utils = require("@electron-toolkit/utils");
const dotenv = require("dotenv");
const electron = require("electron");
const path = require("path");
const pg = require("pg");
const fs = require("fs");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const configPath$2 = path.join(electron.app.getPath("userData"), "db.json");
const defaultConfigFilePath = path.resolve(
  electron.app.getAppPath(),
  "config/config.json"
);
function getConfig() {
  try {
    const configDir = path.dirname(configPath$2);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    if (fs.existsSync(configPath$2) && fs.lstatSync(configPath$2).isDirectory()) {
      fs.rmdirSync(configPath$2);
    }
    if (fs.existsSync(configPath$2) && fs.lstatSync(configPath$2).isFile()) {
      const data = fs.readFileSync(configPath$2, "utf8");
      return JSON.parse(data);
    } else {
      const defaultData = fs.readFileSync(defaultConfigFilePath, "utf8");
      fs.writeFileSync(configPath$2, defaultData, "utf8");
      return JSON.parse(defaultData);
    }
  } catch (error) {
    console.error("Error handling config file:", error);
  }
}
const configData = getConfig();
let client;
if (configData.serverCredential) {
  client = new pg.Client(configData.serverCredential);
}
const AmenityService = {
  // Retrieve all amenities
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Amenities;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching amenities:", error);
      throw new Error("Failed to fetch amenities");
    }
  },
  // Retrieve a specific amenity by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Amenities 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Amenity not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching amenity:", error);
      throw new Error("Failed to fetch amenity");
    }
  },
  // Add a new amenity
  add: async (amenity) => {
    try {
      if (!amenity.amenity_name) {
        throw new Error("Amenity name is required");
      }
      const query = `
        INSERT INTO Amenities (
          amenity_name, description
        ) 
        VALUES ($1, $2) 
        RETURNING *;
      `;
      const values = [
        amenity.amenity_name,
        amenity.description || null
        // Default to null if not provided
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating amenity:", error);
      throw new Error("Failed to create amenity");
    }
  },
  // Update a specific amenity by ID
  update: async ({ id, updates }) => {
    try {
      const room = await AmenityService.get(id);
      if (!room) {
        throw new Error("Amenity not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Amenities 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Amenity not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating amenity:", error);
      throw new Error("Failed to update amenity");
    }
  },
  // Delete a specific amenity by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Amenities 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Amenity not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting amenity:", error);
      throw new Error("Failed to delete amenity");
    }
  },
  // Delete multiple amenities by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No amenity IDs provided");
      }
      const query = `
      DELETE FROM Amenities 
      WHERE id = ANY($1::INT[]) 
      RETURNING *;
    `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No amenity found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple amenities:", error);
      throw new Error("Failed to delete amenities");
    }
  }
};
const AttendanceService = {
  // Retrieve all attendance records for a specific employee
  getAll: async (employee_id = {}) => {
    try {
      const query = `
        SELECT * 
        FROM Attendance 
        WHERE employee_id = $1 
        ORDER BY clock_in DESC ;
      `;
      const result = await client.query(query, [employee_id]);
      return result.rows;
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      throw new Error("Failed to fetch attendance records");
    }
  },
  // Retrieve a specific attendance record by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Attendance 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Attendance record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching attendance record:", error);
      throw new Error("Failed to fetch attendance record");
    }
  },
  // Add a new attendance record
  add: async (attendance) => {
    try {
      if (!attendance.employee_id || !attendance.clock_in) {
        throw new Error("Missing required fields: employee_id, clock_in");
      }
      const query = `
        INSERT INTO Attendance (
          employee_id, clock_in, clock_out, hours_worked
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `;
      const params = [
        attendance.employee_id,
        attendance.clock_in,
        attendance.clock_out || null,
        attendance.hours_worked || null
      ];
      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error("Error adding attendance record:", error);
      throw new Error("Failed to add attendance record");
    }
  },
  // Update an existing attendance record
  update: async (id, updates) => {
    try {
      const attendance = await AttendanceService.get(id);
      if (!attendance) {
        throw new Error("Attendance record not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Attendance 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Attendance record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating attendance record:", error);
      throw new Error("Failed to update attendance record");
    }
  },
  // Delete an attendance record by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Attendance 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Attendance record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      throw new Error("Failed to delete attendance record");
    }
  },
  // Delete multiple attendance records by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No attendance record IDs provided");
      }
      const query = `
        DELETE FROM Attendance 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No attendance records found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple attendance records:", error);
      throw new Error("Failed to delete attendance records");
    }
  }
};
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
      console.error("Error fetching bookings:", error);
      throw new Error("Failed to fetch bookings");
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
        throw new Error("Booking not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw new Error("Failed to fetch booking");
    }
  },
  // Create a new booking
  add: async (booking) => {
    console.log("booking:", booking);
    try {
      if (!booking.user_id || !booking.room_id || !booking.check_in_date || !booking.check_out_date || !booking.total_price) {
        throw new Error("Missing required fields");
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
        booking.status || "booked",
        booking.check_in_date,
        booking.check_out_date,
        booking.total_price
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating booking:", error);
      throw new Error("Failed to create booking");
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
      console.log("updates:", updates);
      const booking = await BookingsService.get(id);
      if (!booking) {
        throw new Error("Booking not found");
      }
      if (Object.keys(updates).length === 0) {
        throw new Error("No updates provided");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        if (value !== void 0 && value !== null) {
          setClause.push(`${key} = $${index}`);
          values.push(value);
          index++;
        }
      }
      if (setClause.length === 0) {
        throw new Error("No valid fields to update");
      }
      values.push(id);
      const query = `
      UPDATE Bookings
      SET ${setClause.join(", ")}
      WHERE id = $${index}
      RETURNING *;
    `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Booking not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating booking:", error);
      throw new Error("Failed to update booking");
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
        throw new Error("Booking not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw new Error("Failed to delete booking");
    }
  },
  // Delete multiple bookings by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No booking IDs provided");
      }
      const query = `
        DELETE FROM Bookings 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No bookings found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple bookings:", error);
      throw new Error("Failed to delete bookings");
    }
  }
};
const CashFlowService = {
  // Retrieve all cash flow entries
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Cash_Flow 
        ORDER BY date DESC;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching cash flow entries:", error);
      throw new Error("Failed to fetch cash flow entries");
    }
  },
  // Retrieve cash flow entry for a specific date
  get: async (date) => {
    try {
      const query = `
        SELECT * 
        FROM Cash_Flow 
        WHERE date = $1;
      `;
      const result = await client.query(query, [date]);
      if (result.rows.length === 0) {
        throw new Error("Cash flow entry for the given date not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching cash flow entry:", error);
      throw new Error("Failed to fetch cash flow entry");
    }
  },
  // Add a new cash flow entry
  add: async (cashFlow) => {
    try {
      if (!cashFlow.date || !cashFlow.opening_balance || !cashFlow.total_income || !cashFlow.total_expenses || !cashFlow.closing_balance) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Cash_Flow (
          date, opening_balance, total_income, total_expenses, closing_balance
        ) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
      `;
      const values = [
        cashFlow.date,
        cashFlow.opening_balance,
        cashFlow.total_income,
        cashFlow.total_expenses,
        cashFlow.closing_balance
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating cash flow entry:", error);
      throw new Error("Failed to create cash flow entry");
    }
  },
  // Update cash flow entry for a specific date
  update: async (date, updates) => {
    try {
      const cashFlow = await CashFlowService.get(date);
      if (!cashFlow) {
        throw new Error("Cash flow entry for the given date not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(date);
      const query = `
        UPDATE Cash_Flow 
        SET ${setClause.join(", ")} 
        WHERE date = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Cash flow entry for the given date not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating cash flow entry:", error);
      throw new Error("Failed to update cash flow entry");
    }
  },
  // Delete cash flow entry for a specific date
  delete: async (date) => {
    try {
      const query = `
        DELETE FROM Cash_Flow 
        WHERE date = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [date]);
      if (result.rows.length === 0) {
        throw new Error("Cash flow entry for the given date not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting cash flow entry:", error);
      throw new Error("Failed to delete cash flow entry");
    }
  },
  // Delete all cash flow entries
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Cash_Flow;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error deleting all cash flow entries:", error);
      throw new Error("Failed to delete all cash flow entries");
    }
  }
};
const DutyScheduleService = {
  // Retrieve all duty schedules
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Duty_Schedules;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching duty schedules:", error);
      throw new Error("Failed to fetch duty schedules");
    }
  },
  // Retrieve a specific duty schedule by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Duty_Schedules 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Duty schedule not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching duty schedule:", error);
      throw new Error("Failed to fetch duty schedule");
    }
  },
  // Add a new duty schedule
  add: async (schedule) => {
    try {
      if (!schedule.employee_id || !schedule.shift_id || !schedule.duty_date) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Duty_Schedules (
          employee_id, shift_id, duty_date, status 
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `;
      const values = [
        schedule.employee_id,
        schedule.shift_id,
        schedule.duty_date,
        schedule.status || "scheduled"
        // Default to 'scheduled' if not provided
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating duty schedule:", error);
      throw new Error("Failed to create duty schedule");
    }
  },
  // Update a specific duty schedule by ID
  update: async (id, updates) => {
    try {
      const schedule = await DutyScheduleService.get(id);
      if (!schedule) {
        throw new Error("Duty schedule not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Duty_Schedules 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Duty schedule not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating duty schedule:", error);
      throw new Error("Failed to update duty schedule");
    }
  },
  // Delete a duty schedule by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Duty_Schedules 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Duty schedule not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting duty schedule:", error);
      throw new Error("Failed to delete duty schedule");
    }
  },
  // Delete multiple duty schedules by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No duty schedule IDs provided");
      }
      const query = `
        DELETE FROM Duty_Schedules 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No duty schedules found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple duty schedules:", error);
      throw new Error("Failed to delete duty schedules");
    }
  }
};
async function verifySMTPAccount(smtpConfig) {
  let transporter = nodemailer.createTransport(smtpConfig);
  try {
    await transporter.verify();
    return { success: true };
  } catch (error) {
    return error;
  }
}
const EmailConfigurationService = {
  getAll: async () => {
    try {
      const result = await client.query("SELECT * FROM email_configurations");
      return result.rows;
    } catch (error) {
      console.log("Error fetching email configurations:", error);
      throw error;
    }
  },
  get: async (id) => {
    try {
      const result = await client.query(
        "SELECT * FROM email_configurations WHERE id = $1",
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error fetching email configuration:", error);
      throw error;
    }
  },
  add: async (config) => {
    const smtpConfig = {
      host: config.smtp_post,
      port: 587,
      secure: false,
      auth: {
        user: config.smtp_user_email,
        pass: config.smtp_password
      }
    };
    console.log("config for email account action:", config);
    try {
      const verificationResult = await verifySMTPAccount(smtpConfig);
      if (!verificationResult.success) {
        return { success: false, message: "SMTP verification failed." };
      }
      const checkQuery = `
        SELECT id FROM email_configurations WHERE smtp_user_email = $1;
      `;
      const checkResult = await client.query(checkQuery, [
        config.smtp_user_email
      ]);
      let result;
      if (checkResult.rows.length > 0) {
        const updateQuery = `
          UPDATE email_configurations
          SET 
            smtp_password = $2,
            smtp_server = $3,
            imap_user_email = $4,
            imap_password = $5,
            imap_server = $6
          WHERE smtp_user_email = $1
          RETURNING *;
        `;
        result = await client.query(updateQuery, [
          config.smtp_user_email,
          config.smtp_password,
          config.smtp_server,
          config.imap_user_email,
          config.imap_password,
          config.imap_server
        ]);
      } else {
        const insertQuery = `
          INSERT INTO email_configurations (
            smtp_user_email, smtp_password, smtp_server, 
            imap_user_email, imap_password, imap_server
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        result = await client.query(insertQuery, [
          config.smtp_user_email,
          config.smtp_password,
          config.smtp_server,
          config.imap_user_email,
          config.imap_password,
          config.imap_server
        ]);
      }
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log("Error adding/updating email configuration:", error);
      throw error;
    }
  },
  update: async (config) => {
    const { id, ...updates } = config;
    try {
      const result = await client.query(
        `UPDATE email_configurations 
         SET smtp_user_email = $1, smtp_password = $2, smtp_server = $3, 
             imap_user_email = $4, imap_password = $5, imap_server = $6 
         WHERE id = $7 
         RETURNING *`,
        [
          updates.smtp_user_email,
          updates.smtp_password,
          updates.smtp_server,
          updates.imap_user_email,
          updates.imap_password,
          updates.imap_server,
          id
        ]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error updating email configuration:", error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const result = await client.query(
        "DELETE FROM email_configurations WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error deleting email configuration:", error);
      throw error;
    }
  },
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        return 0;
      }
      const query = `
        DELETE FROM email_configurations
        WHERE id = ANY($1::int[])
        RETURNING *
      `;
      const result = await client.query(query, [ids]);
      return result.rowCount;
    } catch (error) {
      console.log("Error deleting email configurations:", error);
      throw error;
    }
  }
};
const EmailTemplateService = {
  getAll: async () => {
    try {
      const result = await client.query("SELECT * FROM email_templates");
      return result.rows;
    } catch (error) {
      console.log("Error fetching email templates:", error);
      throw error;
    }
  },
  get: async (id) => {
    try {
      const result = await client.query(
        "SELECT * FROM email_templates WHERE id = $1",
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error fetching email template:", error);
      throw error;
    }
  },
  add: async (template) => {
    try {
      const result = await client.query(
        `INSERT INTO email_templates 
         (name, subject, body) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [template.name, template.subject, template.body]
      );
      return result.rows[0];
    } catch (error) {
      console.log("Error adding email template:", error);
      throw error;
    }
  },
  update: async (template) => {
    const { id, ...updates } = template;
    try {
      const result = await client.query(
        `UPDATE email_templates 
         SET name = $1, subject = $2, body = $3 
         WHERE id = $4 
         RETURNING *`,
        [updates.name, updates.subject, updates.body, id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error updating email template:", error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const result = await client.query(
        "DELETE FROM email_templates WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error deleting email template:", error);
      throw error;
    }
  },
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        return 0;
      }
      const query = `
        DELETE FROM email_templates
        WHERE id = ANY($1::int[])
        RETURNING *
      `;
      const result = await client.query(query, [ids]);
      return result.rowCount;
    } catch (error) {
      console.log("Error deleting email templates:", error);
      throw error;
    }
  }
};
const EmployeesService = {
  // Retrieve all employees
  getAll: async ({ department, role } = {}) => {
    try {
      let query = `
        SELECT 
          Employees.*, 
          Users.first_name, 
          Users.last_name, 
          Users.email, 
          Users.phone, 
          Users.emergency_contact_phone,
          Users.address_1,
          Users.date_of_birth, 
          Users.profile_picture_url,
          Users.role 
        FROM Employees 
        INNER JOIN Users ON Employees.user_id = Users.id
      `;
      const params = [];
      const conditions = [];
      if (department) {
        conditions.push(`Employees.department = $${params.length + 1}`);
        params.push(department);
      }
      if (role) {
        conditions.push(`TRIM(Users.role) = $${params.length + 1}`);
        params.push(role);
      }
      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
      }
      query += ` ORDER BY Employees.hire_date DESC`;
      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },
  // Retrieve a specific employee by ID
  get: async (id) => {
    try {
      const query = `
      SELECT 
        Employees.*, 
            Users.first_name, 
            Users.last_name, 
            Users.email, 
            Users.phone, 
            Users.emergency_contact_phone,
            Users.address_1,
            Users.address_2,
            Users.date_of_birth, 
            Users.profile_picture_url,
            Users.role 
      FROM Employees 
      INNER JOIN Users ON Employees.user_id = Users.id 
      WHERE Employees.id = $1;
    `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Employee not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching employee:", error);
      throw error;
    }
  },
  // Add a new employee
  add: async (employee) => {
    try {
      if (!employee.user_id || !employee.position || !employee.salary || !employee.hire_date) {
        throw new Error(
          "Missing required fields: user_id, position, salary, hire_date"
        );
      }
      const query = `
        INSERT INTO Employees (
          user_id, position, salary, hire_date, termination_date, department, nid, certifications
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *;
      `;
      const params = [
        employee.user_id,
        employee.position,
        employee.salary,
        employee.hire_date,
        employee.termination_date || null,
        employee.department || null,
        employee.nid || null,
        employee.certifications || []
        // Default to an empty array if not provided
      ];
      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error("Error adding employee:", error);
      throw error;
    }
  },
  // Update an existing employee
  update: async ({ id, updates }) => {
    try {
      const employee = await EmployeesService.get(id);
      if (!employee) {
        throw new Error("Employee not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Employees 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Employee not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },
  // Delete an employee by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Employees 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Employee not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },
  // Delete multiple employees by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No employee IDs provided");
      }
      const query = `
        DELETE FROM Employees 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No employees found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple employees:", error);
      throw error;
    }
  }
};
const GuestService = {
  // Retrieve all guest records
  getAll: async () => {
    try {
      const query = `
        SELECT 
          Guest.*, 
          Users.first_name, 
          Users.last_name, 
          Users.email, 
          Users.phone, 
          Users.emergency_contact_phone,
          Users.address_1,
          Users.address_2,
          Users.date_of_birth, 
          Users.profile_picture_url,
          Users.role 
        FROM Guest 
        INNER JOIN Users ON Guest.user_id = Users.id;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching guest records:", error);
      throw error;
    }
  },
  // Retrieve a specific guest record by ID
  get: async (id) => {
    try {
      const query = `
      SELECT 
        Guest.*, 
            Users.first_name, 
            Users.last_name, 
            Users.email, 
            Users.phone, 
            Users.emergency_contact_phone,
            Users.address_1,
            Users.address_2,
            Users.date_of_birth, 
            Users.profile_picture_url,
            Users.role 
      FROM Guest 
      INNER JOIN Users ON Guest.user_id = Users.id 
      WHERE Guest.id = $1;
    `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Guest not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching guest:", error);
      throw error;
    }
  },
  // Add a new guest record
  add: async (guest) => {
    try {
      if (!guest.user_id || !guest.secondary_contact) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Guest (
          user_id, passport_or_national_number, nid, nationality, secondary_contact, relation, job_title, company_name
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *;
      `;
      const values = [
        guest.user_id,
        guest.passport_or_national_number || null,
        // Fixed field name
        guest.nid || null,
        guest.nationality || null,
        guest.secondary_contact,
        guest.relation || null,
        guest.job_title || null,
        guest.company_name || null
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating guest record:", error);
      throw error;
    }
  },
  // Update a specific guest record by ID
  update: async ({ id, updates }) => {
    try {
      const guest = await GuestService.get(id);
      if (!guest) {
        throw new Error("Guest record not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Guest 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Guest record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating guest record:", error);
      throw error;
    }
  },
  // Delete a specific guest record by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Guest 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Guest record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting guest record:", error);
      throw error;
    }
  },
  // Delete all guest records
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No Guest IDs provided");
      }
      const query = `
        DELETE FROM Guest 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No guests found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple guests:", error);
      throw error;
    }
  }
};
const InvoiceItemService = {
  // Retrieve all invoice items
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Invoice_Items;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.log("Error fetching invoice items:", error);
      throw error;
    }
  },
  // Retrieve a specific invoice item by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Invoice_Items 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Invoice item not found");
      }
      return result.rows[0];
    } catch (error) {
      console.log("Error fetching invoice item:", error);
      throw error;
    }
  },
  // Add a new invoice item
  add: async (invoiceItem) => {
    try {
      if (!invoiceItem.invoice_id || !invoiceItem.service_type || !invoiceItem.service_id || !invoiceItem.quantity || !invoiceItem.unit_price || !invoiceItem.total_price) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Invoice_Items (
          invoice_id, service_type, service_id, quantity, unit_price, total_price
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;
      const values = [
        invoiceItem.invoice_id,
        invoiceItem.service_type,
        invoiceItem.service_id,
        invoiceItem.quantity,
        invoiceItem.unit_price,
        invoiceItem.total_price
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.log("Error creating invoice item:", error);
      throw error;
    }
  },
  // Update a specific invoice item by ID
  update: async (id, updates) => {
    try {
      const invoiceItem = await InvoiceItemService.get(id);
      if (!invoiceItem) {
        throw new Error("Invoice item not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Invoice_Items 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Invoice item not found");
      }
      return result.rows[0];
    } catch (error) {
      console.log("Error updating invoice item:", error);
      throw error;
    }
  },
  // Delete a specific invoice item by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Invoice_Items 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Invoice item not found");
      }
      return result.rows[0];
    } catch (error) {
      console.log("Error deleting invoice item:", error);
      throw error;
    }
  },
  // Delete all invoice items
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Invoice_Items;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.log("Error deleting all invoice items:", error);
      throw error;
    }
  }
};
const InvoiceService = {
  // Retrieve all invoices
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Invoices;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.log("Error fetching invoices:", error);
      throw new Error("Failed to fetch invoices");
    }
  },
  // Retrieve a specific invoice by ID\
  get: async (id) => {
    try {
      if (!id) {
        throw new Error("ID is required");
      }
      const column = id.booking_id ? "booking_id" : "id";
      const value = id.booking_id || id;
      const invoiceQuery = `SELECT * FROM Invoices WHERE ${column} = $1;`;
      const invoiceResult = await client.query(invoiceQuery, [value]);
      if (invoiceResult.rows.length === 0) {
        throw new Error("Invoice not found");
      }
      const invoice = invoiceResult.rows[0];
      const invoiceItemsQuery = `
          SELECT * FROM Invoice_Items 
          WHERE invoice_id = $1;
        `;
      const invoiceItemsResult = await client.query(invoiceItemsQuery, [
        invoice.id
      ]);
      invoice.invoiceItems = invoiceItemsResult.rows;
      return invoice;
    } catch (error) {
      console.log("Error fetching invoice:", error.message);
      throw error;
    }
  },
  // Version:2
  // get: async (id) => {
  //   try {
  //     if (!id) {
  //       throw new Error('ID is required');
  //     }
  //     const column = id.booking_id ? 'booking_id' : 'id';
  //     const value = id.booking_id || id;
  //     const query = `SELECT * FROM Invoices WHERE ${column} = $1;`;
  //     const result = await client.query(query, [value]);
  //     if (result.rows.length === 0) {
  //       throw new Error('Invoice not found');
  //     }
  //     return result.rows[0];
  //   } catch (error) {
  //     console.log('Error fetching invoice:', error.message);
  //     throw error;
  //   }
  // },
  // Add a new invoice
  add: async (invoice) => {
    try {
      console.log("invoice:", invoice);
      if (!invoice.booking_id || !invoice.total_amount) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Invoices (
          booking_id, total_amount, discount, net_amount, amount_paid, balance_due, 
          status
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *;
      `;
      const values = [
        invoice.booking_id,
        invoice.total_amount,
        invoice.discount || 0,
        // Use default discount if not provided
        invoice.net_amount || 0,
        invoice.amount_paid || 0,
        // Use default amount_paid if not provided
        invoice.balance_due,
        invoice.status || "pending"
        // Use default status if not provided
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.log("Error creating invoice:", error);
      throw error;
    }
  },
  // Update a specific invoice by ID
  update: async ({ id, updates }) => {
    console.log("updates:", updates);
    try {
      const invoice = await InvoiceService.get(id);
      if (!invoice) {
        throw new Error("Invoice not found");
      }
      if (updates?.total_amount !== void 0) {
        updates.total_amount = parseFloat(invoice?.total_amount) + parseFloat(updates?.total_amount);
        if (updates?.total_amount < 0) {
          throw new Error("Total amount cannot be negative");
        }
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Invoices 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Invoice not found");
      }
      return result.rows[0];
    } catch (error) {
      console.log("Error updating invoice:", error);
      throw error;
    }
  },
  // Delete a specific invoice by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Invoices 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Invoice not found");
      }
      return result.rows[0];
    } catch (error) {
      console.log("Error deleting invoice:", error);
      throw error;
    }
  },
  // Delete all invoices
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Invoices;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.log("Error deleting all invoices:", error);
      throw error;
    }
  }
};
const LeaveRequestService = {
  // Retrieve all leave requests
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Leave_Requests;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      throw new Error("Failed to fetch leave requests");
    }
  },
  // Retrieve a specific leave request by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Leave_Requests 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Leave request not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching leave request:", error);
      throw new Error("Failed to fetch leave request");
    }
  },
  // Add a new leave request
  add: async (leaveRequest) => {
    try {
      if (!leaveRequest.employee_id || !leaveRequest.leave_type || !leaveRequest.start_date || !leaveRequest.end_date) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Leave_Requests (
          employee_id, leave_type, start_date, end_date, status, reason 
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;
      const values = [
        leaveRequest.employee_id,
        leaveRequest.leave_type,
        leaveRequest.start_date,
        leaveRequest.end_date,
        leaveRequest.status || "pending",
        // Default to 'pending' if not provided
        leaveRequest.reason
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating leave request:", error);
      throw new Error("Failed to create leave request");
    }
  },
  // Update a specific leave request by ID
  update: async (id, updates) => {
    try {
      const leaveRequest = await LeaveRequestService.get(id);
      if (!leaveRequest) {
        throw new Error("Leave request not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Leave_Requests 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Leave request not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating leave request:", error);
      throw new Error("Failed to update leave request");
    }
  },
  // Delete a specific leave request by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Leave_Requests 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Leave request not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting leave request:", error);
      throw new Error("Failed to delete leave request");
    }
  },
  // Delete all leave requests
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Leave_Requests;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error deleting all leave requests:", error);
      throw new Error("Failed to delete all leave requests");
    }
  }
};
const LoyaltyProgramService = {
  // Retrieve all loyalty programs (for all users)
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Loyalty_Program;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching loyalty programs:", error);
      throw new Error("Failed to fetch loyalty programs");
    }
  },
  // Retrieve a specific loyalty program by user ID
  get: async (user_id) => {
    try {
      const query = `
        SELECT * 
        FROM Loyalty_Program 
        WHERE user_id = $1;
      `;
      const result = await client.query(query, [user_id]);
      if (result.rows.length === 0) {
        throw new Error("Loyalty program for the user not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching loyalty program for user:", error);
      throw new Error("Failed to fetch loyalty program for user");
    }
  },
  // Add a new loyalty program for a user
  add: async (loyaltyProgram) => {
    try {
      if (!loyaltyProgram.user_id) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Loyalty_Program (
          user_id, points_balance, tier, join_date 
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `;
      const values = [
        loyaltyProgram.user_id,
        loyaltyProgram.points_balance || 0,
        // Default to 0 points
        loyaltyProgram.tier || "bronze",
        // Default to 'bronze' tier
        loyaltyProgram.join_date || /* @__PURE__ */ new Date()
        // Use current timestamp as default join date
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating loyalty program:", error);
      throw new Error("Failed to create loyalty program");
    }
  },
  // Update a specific loyalty program by user ID
  update: async (user_id, updates) => {
    try {
      const loyaltyProgram = await LoyaltyProgramService.get(user_id);
      if (!loyaltyProgram) {
        throw new Error("Loyalty program for the user not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(user_id);
      const query = `
        UPDATE Loyalty_Program 
        SET ${setClause.join(", ")} 
        WHERE user_id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Loyalty program for the user not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating loyalty program:", error);
      throw new Error("Failed to update loyalty program");
    }
  },
  // Delete a specific loyalty program by user ID
  delete: async (user_id) => {
    try {
      const query = `
        DELETE FROM Loyalty_Program 
        WHERE user_id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [user_id]);
      if (result.rows.length === 0) {
        throw new Error("Loyalty program for the user not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting loyalty program:", error);
      throw new Error("Failed to delete loyalty program");
    }
  },
  // Delete all loyalty programs 
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Loyalty_Program;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error deleting all loyalty programs:", error);
      throw new Error("Failed to delete all loyalty programs");
    }
  }
};
const PartnerPaymentsService = {
  // Retrieve all partner payments with pagination
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Partner_Payments 
        ORDER BY id;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching partner payments:", error);
      throw new Error("Failed to fetch partner payments");
    }
  },
  // Retrieve a specific partner payment by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Partner_Payments 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Partner payment not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching partner payment:", error);
      throw new Error("Failed to fetch partner payment");
    }
  },
  // Add a new partner payment
  add: async (partnerPayment) => {
    try {
      if (!partnerPayment.service_provider_id || !partnerPayment.payment_method_id || !partnerPayment.payment_date || !partnerPayment.payment_amount) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Partner_Payments (
          service_provider_id, payment_method_id, payment_date, payment_amount
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `;
      const params = [
        partnerPayment.service_provider_id,
        partnerPayment.payment_method_id,
        partnerPayment.payment_date,
        partnerPayment.payment_amount
      ];
      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error("Error adding partner payment:", error);
      throw new Error("Failed to add partner payment");
    }
  },
  // Update an existing partner payment
  update: async ({ id, updates }) => {
    try {
      const partnerPayment = await PartnerPaymentsService.get(id);
      if (!partnerPayment) {
        throw new Error("Partner payment not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Partner_Payments 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Partner payment not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating partner payment:", error);
      throw new Error("Failed to update partner payment");
    }
  },
  // Permanently delete a partner payment
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Partner_Payments 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Partner payment not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting partner payment:", error);
      throw new Error("Failed to delete partner payment");
    }
  },
  // Delete multiple partner payments by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No partner payment IDs provided");
      }
      const query = `
        DELETE FROM Partner_Payments 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No partner payments found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple partner payments:", error);
      throw new Error("Failed to delete partner payments");
    }
  }
};
const PaymentMethodsService = {
  // Retrieve all payment methods with pagination
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Payment_Methods 
        ORDER BY id ;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw new Error("Failed to fetch payment methods");
    }
  },
  // Retrieve a specific payment method by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Payment_Methods 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Payment method not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching payment method:", error);
      throw new Error("Failed to fetch payment method");
    }
  },
  // Add a new payment method
  add: async (paymentMethod) => {
    try {
      if (!paymentMethod.invoice_id || !paymentMethod.service_name || !paymentMethod.amount) {
        throw new Error(
          "Missing required fields: invoice_id, service_name, or amount"
        );
      }
      const query = `
        INSERT INTO Payment_Methods (
          partner_id, invoice_id, service_name, amount, payment_type, payment_status, payment_date, description
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *;
      `;
      const params = [
        paymentMethod.partner_id || null,
        paymentMethod.invoice_id,
        paymentMethod.service_name,
        paymentMethod.amount,
        paymentMethod.payment_type || null,
        paymentMethod.payment_status || "pending",
        paymentMethod.payment_date || /* @__PURE__ */ new Date(),
        paymentMethod.description || null
      ];
      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error("Error adding payment method:", error);
      throw new Error("Failed to add payment method");
    }
  },
  // Update an existing payment method
  update: async ({ id, updates }) => {
    try {
      const paymentMethod = await PaymentMethodsService.get(id);
      if (!paymentMethod) {
        throw new Error("Payment method not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Payment_Methods 
        SET ${setClause.join(", ")}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Payment method not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating payment method:", error);
      throw new Error("Failed to update payment method");
    }
  },
  // Permanently delete a payment method
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Payment_Methods 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Payment method not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting payment method:", error);
      throw new Error("Failed to delete payment method");
    }
  },
  // Delete multiple payment methods by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No payment method IDs provided");
      }
      const query = `
        DELETE FROM Payment_Methods 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No payment methods found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple payment methods:", error);
      throw new Error("Failed to delete payment methods");
    }
  }
};
const PayrollService = {
  // Retrieve all payroll records
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Payroll;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching payroll records:", error);
      throw new Error("Failed to fetch payroll records");
    }
  },
  // Retrieve a specific payroll record by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Payroll 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Payroll record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching payroll record:", error);
      throw new Error("Failed to fetch payroll record");
    }
  },
  // Add a new payroll record
  add: async (payroll) => {
    try {
      if (!payroll.employee_id || !payroll.pay_period_start || !payroll.pay_period_end || !payroll.gross_salary || !payroll.deductions || !payroll.payment_date) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Payroll (
          employee_id, pay_period_start, pay_period_end, gross_salary, deductions, payment_date
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;
      const values = [
        payroll.employee_id,
        payroll.pay_period_start,
        payroll.pay_period_end,
        payroll.gross_salary,
        payroll.deductions,
        payroll.payment_date
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating payroll record:", error);
      throw new Error("Failed to create payroll record");
    }
  },
  // Update a specific payroll record by ID
  update: async (id, updates) => {
    try {
      const payroll = await PayrollService.get(id);
      if (!payroll) {
        throw new Error("Payroll record not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Payroll 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Payroll record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating payroll record:", error);
      throw new Error("Failed to update payroll record");
    }
  },
  // Delete a specific payroll record by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Payroll 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Payroll record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting payroll record:", error);
      throw new Error("Failed to delete payroll record");
    }
  },
  // Delete all payroll records
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Payroll;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error deleting all payroll records:", error);
      throw new Error("Failed to delete all payroll records");
    }
  }
};
const PerformanceReviewService = {
  // Retrieve all performance reviews
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Performance_Reviews;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching performance reviews:", error);
      throw new Error("Failed to fetch performance reviews");
    }
  },
  // Retrieve a specific performance review by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Performance_Reviews 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Performance review not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching performance review:", error);
      throw new Error("Failed to fetch performance review");
    }
  },
  // Add a new performance review
  add: async (review) => {
    try {
      if (!review.employee_id || !review.review_date || !review.rating || !review.reviewer_id) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Performance_Reviews (
          employee_id, review_date, rating, comments, reviewer_id
        ) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
      `;
      const values = [
        review.employee_id,
        review.review_date,
        review.rating,
        review.comments,
        review.reviewer_id
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating performance review:", error);
      throw new Error("Failed to create performance review");
    }
  },
  // Update a specific performance review by ID
  update: async (id, updates) => {
    try {
      const review = await PerformanceReviewService.get(id);
      if (!review) {
        throw new Error("Performance review not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Performance_Reviews 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Performance review not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating performance review:", error);
      throw new Error("Failed to update performance review");
    }
  },
  // Delete a specific performance review by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Performance_Reviews 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Performance review not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting performance review:", error);
      throw new Error("Failed to delete performance review");
    }
  },
  // Delete all performance reviews
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Performance_Reviews;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error deleting all performance reviews:", error);
      throw new Error("Failed to delete all performance reviews");
    }
  }
};
const PosMachineService = {
  // Retrieve all POS machines
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Pos_Machine;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching POS machines:", error);
      throw error;
    }
  },
  // Retrieve a specific POS machine by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Pos_Machine 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("POS machine not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching POS machine:", error);
      throw error;
    }
  },
  // Add a new POS machine
  add: async (posMachine) => {
    try {
      if (!posMachine.name) {
        throw new Error("POS machine name is required");
      }
      const query = `
        INSERT INTO Pos_Machine (
          name, location, is_active
        ) 
        VALUES ($1, $2, $3) 
        RETURNING *;
      `;
      const values = [
        posMachine.name,
        posMachine.location || null,
        // Default to null if not provided
        posMachine.is_active || true
        // Default to true if not provided
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating POS machine:", error);
      throw error;
    }
  },
  // Update a specific POS machine by ID
  update: async ({ id, updates }) => {
    try {
      const posMachine = await PosMachineService.get(id);
      if (!posMachine) {
        throw new Error("POS machine not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Pos_Machine 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("POS machine not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating POS machine:", error);
      throw error;
    }
  },
  // Delete a specific POS machine by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Pos_Machine 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("POS machine not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting POS machine:", error);
      throw error;
    }
  },
  // Delete multiple POS machines by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No POS machine IDs provided");
      }
      const query = `
        DELETE FROM Pos_Machine 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No POS machines found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple POS machines:", error);
      throw error;
    }
  }
};
const RoomMaintenanceService = {
  // Retrieve all room maintenance records
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Room_Maintenance;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching room maintenance records:", error);
      throw new Error("Failed to fetch room maintenance records");
    }
  },
  // Retrieve a specific room maintenance record by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Room_Maintenance 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Room maintenance record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching room maintenance record:", error);
      throw new Error("Failed to fetch room maintenance record");
    }
  },
  // Add a new room maintenance record
  add: async (maintenance) => {
    try {
      if (!maintenance.room_id || !maintenance.maintenance_type || !maintenance.start_date) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Room_Maintenance (
          room_id, maintenance_type, start_date, end_date, status, description
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;
      const values = [
        maintenance.room_id,
        maintenance.maintenance_type,
        maintenance.start_date,
        maintenance.end_date,
        maintenance.status || "scheduled",
        // Default to 'scheduled' if not provided
        maintenance.description
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating room maintenance record:", error);
      throw new Error("Failed to create room maintenance record");
    }
  },
  // Update a specific room maintenance record by ID
  update: async (id, updates) => {
    try {
      const maintenance = await RoomMaintenanceService.get(id);
      if (!maintenance) {
        throw new Error("Room maintenance record not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Room_Maintenance 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Room maintenance record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating room maintenance record:", error);
      throw new Error("Failed to update room maintenance record");
    }
  },
  // Delete a specific room maintenance record by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Room_Maintenance 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Room maintenance record not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting room maintenance record:", error);
      throw new Error("Failed to delete room maintenance record");
    }
  },
  // Delete all room maintenance records
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Room_Maintenance;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error deleting all room maintenance records:", error);
      throw new Error("Failed to delete all room maintenance records");
    }
  }
};
const RoomService = {
  // Retrieve all rooms data only
  // Version: 2
  getAll: async () => {
    try {
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
      const roomsMap = /* @__PURE__ */ new Map();
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
            booking: null
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
            }
          };
          roomsMap.get(roomId).booking = booking;
        }
      });
      return Array.from(roomsMap.values());
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw new Error("Failed to fetch rooms");
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
        throw new Error("Room not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching room:", error);
      throw new Error("Failed to fetch room");
    }
  },
  // Add a new room with amenities
  add: async (room) => {
    try {
      if (!room.room_number || !room.base_price || !room.capacity) {
        throw new Error("Missing required fields");
      }
      const checkQuery = `
        SELECT id FROM rooms WHERE room_number = $1;
      `;
      const checkResult = await client.query(checkQuery, [room.room_number]);
      if (checkResult.rows.length > 0) {
        throw new Error(`Room number ${room.room_number} already exists.`);
      }
      const roomQuery = `
        INSERT INTO rooms (
          room_number, type_name, description, status, base_price, capacity
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id;
      `;
      const roomValues = [
        room.room_number,
        room.type_name || "standard",
        room.description || null,
        room.status || "available",
        room.base_price,
        room.capacity
      ];
      const roomResult = await client.query(roomQuery, roomValues);
      const roomId = roomResult.rows[0].id;
      if (room.amenities && room.amenities.length > 0) {
        const amenityIds = room.amenities.map(Number).filter((id) => !isNaN(id));
        if (amenityIds.length !== room.amenities.length) {
          throw new Error("Invalid amenity IDs");
        }
        const amenityQuery = `
          INSERT INTO room_amenities (room_id, amenity_id)
          VALUES ${amenityIds.map((_, index) => `($1, $${index + 2})`).join(", ")};
        `;
        const amenityValues = [roomId, ...amenityIds];
        await client.query(amenityQuery, amenityValues);
      }
      return { id: roomId, ...room };
    } catch (error) {
      console.error("Error creating room:", error);
      throw new Error(error.message);
    }
  },
  // Update a specific room by ID
  update: async ({ id, updates }) => {
    try {
      const room = await RoomService.get(id);
      if (!room) {
        throw new Error("Room not found");
      }
      const { amenities, ...roomUpdates } = updates;
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(roomUpdates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      if (setClause.length > 0) {
        const query = `
        UPDATE rooms 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
          throw new Error("Room update failed");
        }
      }
      if (amenities && Array.isArray(amenities)) {
        await client.query(`DELETE FROM room_amenities WHERE room_id = $1;`, [
          id
        ]);
        if (amenities.length > 0) {
          const amenityQuery = `
          INSERT INTO room_amenities (room_id, amenity_id)
          VALUES ${amenities.map((_, i) => `($1, $${i + 2})`).join(", ")};
        `;
          await client.query(amenityQuery, [id, ...amenities]);
        }
      }
      return { id, ...updates };
    } catch (error) {
      console.error("Error updating room:", error);
      throw new Error("Failed to update room");
    }
  },
  // Delete a specific room by ID along with its related room_amenities
  delete: async (id) => {
    try {
      await client.query("BEGIN");
      const bookingCheck = await client.query(
        `SELECT 1 FROM bookings WHERE room_id = $1 LIMIT 1;`,
        [id]
      );
      if (bookingCheck.rows.length > 0) {
        throw new Error(
          "Cannot delete room: Active bookings exist for this room."
        );
      }
      await client.query(`DELETE FROM room_amenities WHERE room_id = $1;`, [
        id
      ]);
      const query = `DELETE FROM Rooms WHERE id = $1 RETURNING *;`;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Room not found");
      }
      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting room:", error);
      throw new Error(error.message);
    }
  },
  // Delete multiple rooms by IDs along with their related room_amenities
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No room IDs provided");
      }
      await client.query("BEGIN");
      const bookedRooms = await client.query(
        `SELECT DISTINCT room_id FROM bookings WHERE room_id = ANY($1::INT[]);`,
        [ids]
      );
      if (bookedRooms.rows.length > 0) {
        await client.query("ROLLBACK");
        throw new Error(
          `Cannot delete rooms with active bookings: ${bookedRooms.rows.map((r) => r.room_id).join(", ")}`
        );
      }
      await client.query(
        `DELETE FROM room_amenities WHERE room_id = ANY($1::INT[]);`,
        [ids]
      );
      const query = `
        DELETE FROM Rooms 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        throw new Error("No rooms found for deletion");
      }
      await client.query("COMMIT");
      return { success: true, deletedRooms: result.rows };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting multiple rooms:", error);
      throw new Error(error || "Failed to delete rooms");
    }
  }
};
const RoomServicesService = {
  getAll: async () => {
    try {
      const query = `
      SELECT * 
      FROM Services;
    `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching services with providers:", error);
      throw error;
    }
  },
  // Retrieve a specific room service by ID along with the provider's details
  get: async (id) => {
    try {
      const query = `SELECT * FROM Services WHERE id = $1;`;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Service is not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching room service:", error);
      throw error;
    }
  },
  // Add a new room service
  // add: async (service) => {
  //   try {
  //     // Validate required fields
  //     if (!service.service_name || !service.default_price) {
  //       throw new Error('Missing required fields');
  //     }
  //     if (service.default_price < 0) {
  //       throw new Error('Default price cannot be negative');
  //     }
  //     // Optional field validation for provider_rate and hotel_rate
  //     if (service.provider_rate && service.provider_rate < 0) {
  //       throw new Error('Provider rate cannot be negative');
  //     }
  //     if (service.hotel_rate && service.hotel_rate < 0) {
  //       throw new Error('Hotel rate cannot be negative');
  //     }
  //     const query = `
  //       INSERT INTO Services (
  //         service_name, service_provider_id, default_price, provider_rate, hotel_rate
  //       )
  //       VALUES ($1, $2, $3, $4, $5)
  //       RETURNING *;
  //     `;
  //     const values = [
  //       service.service_name,
  //       service.service_provider_id || null,
  //       service.default_price || 0,
  //       service.provider_rate || null,
  //       service.hotel_rate || null,
  //     ];
  //     const result = await client.query(query, values);
  //     return result.rows[0]; // Return the inserted service
  //   } catch (error) {
  //     console.error('Error creating room service:', error);
  //     throw new Error('Failed to create room service');
  //   }
  // },
  //  add: async (service) => {  (Adjusted Database Interaction)
  add: async (service) => {
    try {
      if (!service.service_name || !service.default_price) {
        throw new Error("Missing required fields");
      }
      if (service.default_price < 0) {
        throw new Error("Default price cannot be negative");
      }
      const query = `
        INSERT INTO Services (
          service_name, service_provider_id, default_price, provider_rate, hotel_rate
        ) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [
        service.service_name,
        service.service_provider_id || null,
        // Optional service provider
        service.default_price || 0,
        service.provider_rate || 0,
        // Optional field
        service.hotel_rate || 0
        // Optional field
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating room service:", error);
      throw error;
    }
  },
  update: async ({ id, updates }) => {
    try {
      const existingService = await client.query(
        "SELECT * FROM Services WHERE id = $1",
        [id]
      );
      if (existingService.rows.length === 0) {
        throw new Error("Service not found");
      }
      if (updates.service_name !== void 0 && !updates.service_name) {
        throw new Error("Service name cannot be empty");
      }
      if (updates.default_price !== void 0 && updates.default_price < 0) {
        throw new Error("Default price cannot be negative");
      }
      if (updates.provider_rate !== void 0 && updates.provider_rate < 0) {
        throw new Error("Provider rate cannot be negative");
      }
      if (updates.hotel_rate !== void 0 && updates.hotel_rate < 0) {
        throw new Error("Hotel rate cannot be negative");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Services 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Service not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating service:", error);
      throw new Error("Failed to update service");
    }
  },
  // Delete a specific room service by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Services 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Services not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting room service:", error);
      throw new Error("Failed to delete room service");
    }
  },
  // Delete multiple room services by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No Room Services IDs provided");
      }
      const query = `
      DELETE FROM Services 
      WHERE id = ANY($1::INT[]) 
      RETURNING *;
    `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No Room Services found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple room service:", error);
      throw new Error("Failed to delete room services");
    }
  }
};
const SMSConfigurationsService = {
  /**
   * Fetch all SMS configurations from the database.
   * @returns {Promise<Array>} - Array of SMS configurations.
   */
  getAll: async () => {
    try {
      const result = await client.query("SELECT * FROM SMS_Configurations");
      return result.rows;
    } catch (error) {
      console.log("Error fetching SMS configurations:", error);
      throw error;
    }
  },
  /**
   * Fetch a specific SMS configuration by its ID.
   * @param {number} id - The ID of the SMS configuration.
   * @returns {Promise<Object|null>} - The SMS configuration object or null if not found.
   */
  get: async (id) => {
    try {
      const result = await client.query(
        "SELECT * FROM SMS_Configurations WHERE id = $1",
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error fetching SMS configuration:", error);
      throw error;
    }
  },
  /**
   * Add a new SMS configuration to the database.
   * @param {Object} smsConfig - The SMS configuration object.
   * @param {string} smsConfig.api_key - The API key.
   * @param {string} smsConfig.senderid - The sender id.
   * @returns {Promise<Object>} - The newly created SMS configuration.
   */
  add: async (smsConfig) => {
    try {
      const result = await client.query(
        `INSERT INTO SMS_Configurations 
         (api_key, senderid) 
         VALUES ($1, $2) 
         RETURNING *`,
        [smsConfig.api_key, smsConfig.senderid]
        // Corrected parameters
      );
      return result.rows[0];
    } catch (error) {
      console.log("Error adding SMS configuration:", error);
      throw new Error(error);
    }
  },
  /**
   * Update an existing SMS configuration.
   * @param {Object} smsConfig - The SMS configuration object.
   * @param {number} smsConfig.id - The ID of the SMS configuration to update.
   * @param {string} smsConfig.api_key - The updated API key.
   * @param {string} smsConfig.senderid - The updated sender id.
   * @returns {Promise<Object|null>} - The updated SMS configuration or null if not found.
   */
  update: async (smsConfig) => {
    const { id, ...updates } = smsConfig;
    try {
      console.log("update:", updates);
      const result = await client.query(
        `UPDATE SMS_Configurations 
         SET api_key = $1, senderid = $2 
         WHERE id = $3 
         RETURNING *`,
        [updates.api_key, updates.senderid, id]
        // Corrected parameters
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error updating SMS configuration:", error);
      throw error;
    }
  },
  /**
   * Delete a specific SMS configuration by its ID.
   * @param {number} id - The ID of the SMS configuration to delete.
   * @returns {Promise<Object|null>} - The deleted SMS configuration or null if not found.
   */
  delete: async (id) => {
    try {
      const result = await client.query(
        "DELETE FROM SMS_Configurations WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error deleting SMS configuration:", error);
      throw error;
    }
  },
  /**
   * Delete multiple SMS configurations by their IDs.
   * @param {Array<number>} ids - Array of IDs to delete.
   * @returns {Promise<number>} - The number of deleted SMS configurations.
   */
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        console.log("No IDs provided for deletion.");
        return 0;
      }
      const result = await client.query(
        `DELETE FROM SMS_Configurations 
         WHERE id = ANY($1::int[]) 
         RETURNING *`,
        [ids]
      );
      return result.rowCount;
    } catch (error) {
      console.log("Error deleting SMS configurations:", error);
      throw error;
    }
  }
};
const configPath$1 = path.join(electron.app.getPath("userData"), "db.json");
const ServerConfigService = {
  getAll: async () => {
    try {
      const configData2 = fs.existsSync(configPath$1) ? JSON.parse(fs.readFileSync(configPath$1, "utf-8")) : {};
      if (typeof configData2.serverCredential !== "object") {
        throw new Error("Invalid config format: expected an object.");
      }
      return configData2.serverCredential || null;
    } catch (error) {
    }
  },
  get: async () => {
    try {
      const configData2 = fs.existsSync(configPath$1) ? JSON.parse(fs.readFileSync(configPath$1, "utf-8")) : {};
      if (typeof configData2.serverCredential !== "object") {
        throw new Error("Invalid config format: expected an object.");
      }
      return configData2.serverCredential || null;
    } catch (error) {
    }
  },
  add: async (config) => {
    try {
      if (config.url) {
        const client2 = new pg.Client({
          connectionString: config.url
        });
        try {
          await client2.connect();
          await client2.end();
          const configData3 = fs.existsSync(configPath$1) ? JSON.parse(fs.readFileSync(configPath$1, "utf-8")) : {};
          if (typeof configData3 !== "object") {
            throw new Error("Invalid config format: expected an object.");
          }
          configData3.databaseUrl = { url: config.url };
          fs.writeFileSync(configPath$1, JSON.stringify(configData3, null, 2));
          return {
            status: 200,
            message: "Database URL validated and configuration updated successfully!"
          };
        } catch (error) {
          console.error("Error validating database URL:", error);
          return {
            status: 400,
            message: "Invalid database URL!"
          };
        }
      }
      const newConfig = {
        user: config?.user,
        host: config?.host,
        database: config?.database,
        password: config?.password,
        port: config?.port
      };
      const serverClient = new pg.Client({
        user: newConfig.user,
        host: newConfig.host,
        database: "postgres",
        // Use the default 'postgres' database to connect
        password: newConfig.password,
        port: newConfig.port
      });
      await serverClient.connect();
      const res = await serverClient.query(
        `SELECT 1 FROM pg_database WHERE datname = '${newConfig.database}'`
      );
      if (res.rows.length > 0) {
        serverClient.end();
        const dbClient = new pg.Client(newConfig);
        await dbClient.connect();
      } else {
        await serverClient.query(`CREATE DATABASE "${newConfig.database}"`);
        serverClient.end();
        const dbClient = new pg.Client(newConfig);
        await dbClient.connect();
      }
      const configData2 = fs.existsSync(configPath$1) ? JSON.parse(fs.readFileSync(configPath$1, "utf-8")) : {};
      if (typeof configData2 !== "object") {
        throw new Error("Invalid config format: expected an object.");
      }
      configData2.serverCredential = newConfig;
      fs.writeFileSync(configPath$1, JSON.stringify(configData2, null, 2));
      serverClient.end();
      return {
        status: 200,
        message: "Server configuration updated successfully!"
      };
    } catch (error) {
      console.error("Error handling database connection:", error);
      return { message: "Connection Failed!" };
    }
  },
  update: async (config) => {
    try {
      console.log("config url:", config?.url);
      if (config.url) {
        const client2 = new pg.Client({
          connectionString: config.url
        });
        try {
          await client2.connect();
          await client2.end();
          const configData3 = fs.existsSync(configPath$1) ? JSON.parse(fs.readFileSync(configPath$1, "utf-8")) : {};
          if (typeof configData3 !== "object") {
            throw new Error("Invalid config format: expected an object.");
          }
          configData3.databaseUrl = { url: config.url };
          fs.writeFileSync(configPath$1, JSON.stringify(configData3, null, 2));
          return {
            status: 200,
            message: "Database URL validated and configuration updated successfully!"
          };
        } catch (error) {
          console.error("Error validating database URL:", error);
          return {
            status: 400,
            message: "Invalid database URL!"
          };
        }
      }
      const newConfig = {
        user: config?.user,
        host: config?.host,
        database: config?.database,
        password: config?.password,
        port: config?.port
      };
      const serverClient = new pg.Client({
        user: newConfig.user,
        host: newConfig.host,
        database: "postgres",
        // Use the default 'postgres' database to connect
        password: newConfig.password,
        port: newConfig.port
      });
      await serverClient.connect();
      const res = await serverClient.query(
        `SELECT 1 FROM pg_database WHERE datname = '${newConfig.database}'`
      );
      if (res.rows.length > 0) {
        serverClient.end();
        const dbClient = new pg.Client(newConfig);
        await dbClient.connect();
      } else {
        await serverClient.query(`CREATE DATABASE "${newConfig.database}"`);
        serverClient.end();
        const dbClient = new pg.Client(newConfig);
        await dbClient.connect();
      }
      const configData2 = fs.existsSync(configPath$1) ? JSON.parse(fs.readFileSync(configPath$1, "utf-8")) : {};
      if (typeof configData2 !== "object") {
        throw new Error("Invalid config format: expected an object.");
      }
      configData2.serverCredential = newConfig;
      fs.writeFileSync(configPath$1, JSON.stringify(configData2, null, 2));
      serverClient.end();
      return {
        status: 200,
        message: "Server configuration updated successfully!"
      };
    } catch (error) {
      console.error("Error handling database connection:", error);
      return { status: 400, message: "Connection Failed!" };
    }
  },
  delete: () => {
    try {
      const configData2 = fs.existsSync(configPath$1) ? JSON.parse(fs.readFileSync(configPath$1, "utf-8")) : {};
      if (typeof configData2 !== "object") {
        throw new Error("Invalid config format: expected an object.");
      }
      delete configData2.serverCredential;
      fs.writeFileSync(configPath$1, JSON.stringify(configData2, null, 2));
      client.end();
      const newClient = new pg.Client({});
      newClient.connect().then(() => {
      }).catch((err) => {
        console.error("Error reconnecting to database:", err.stack);
      });
      return true;
    } catch (error) {
      console.error("Error resetting config.json:", error);
    }
  }
};
const ServiceProvidersService = {
  // Retrieve all service providers with pagination
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Service_Providers 
        ORDER BY id ;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching service providers:", error);
      throw error;
    }
  },
  // Retrieve a specific service provider by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Service_Providers 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Service provider not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching service provider:", error);
      throw error;
    }
  },
  // Add a new service provider
  add: async (serviceProvider) => {
    try {
      if (!serviceProvider.service_provider_name) {
        throw new Error("Missing required field: service_provider_name");
      }
      const query = `
        INSERT INTO Service_Providers (
          service_provider_name, contact_person, contact_phone, contact_email, address, current_balance
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;
      const params = [
        serviceProvider.service_provider_name,
        serviceProvider.contact_person || null,
        serviceProvider.contact_phone || null,
        serviceProvider.contact_email || null,
        serviceProvider.address || null,
        serviceProvider.current_balance || 0
      ];
      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error("Error adding service provider:", error);
      throw error;
    }
  },
  // Update an existing service provider
  update: async ({ id, updates }) => {
    try {
      const serviceProvider = await ServiceProvidersService.get(id);
      if (!serviceProvider) {
        throw new Error("Service provider not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Service_Providers 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Service provider not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating service provider:", error);
      throw error;
    }
  },
  // Permanently delete a service provider
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Service_Providers 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Service provider not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting service provider:", error);
      throw error;
    }
  },
  // Delete multiple service providers by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No service provider IDs provided");
      }
      const query = `
        DELETE FROM Service_Providers 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No service providers found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple service providers:", error);
      throw error;
    }
  }
};
const ShiftService = {
  // Retrieve all shifts
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Shifts;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching shifts:", error);
      throw new Error("Failed to fetch shifts");
    }
  },
  // Retrieve a specific shift by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Shifts 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Shift not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching shift:", error);
      throw new Error("Failed to fetch shift");
    }
  },
  // Add a new shift
  add: async (shift) => {
    try {
      if (!shift.shift_name || !shift.start_time || !shift.end_time) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Shifts (
          shift_name, start_time, end_time
        ) 
        VALUES ($1, $2, $3) 
        RETURNING *;
      `;
      const values = [
        shift.shift_name,
        shift.start_time,
        shift.end_time
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating shift:", error);
      throw new Error("Failed to create shift");
    }
  },
  // Update a specific shift by ID
  update: async (id, updates) => {
    try {
      const shift = await ShiftService.get(id);
      if (!shift) {
        throw new Error("Shift not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Shifts 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Shift not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating shift:", error);
      throw new Error("Failed to update shift");
    }
  },
  // Delete a specific shift by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Shifts 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Shift not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting shift:", error);
      throw new Error("Failed to delete shift");
    }
  },
  // Delete all shifts
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Shifts;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error deleting all shifts:", error);
      throw new Error("Failed to delete all shifts");
    }
  }
};
const TaskService = {
  // Retrieve all tasks
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Task;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks");
    }
  },
  // Retrieve a specific task by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Task 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Task not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching task:", error);
      throw new Error("Failed to fetch task");
    }
  },
  // Add a new task
  add: async (task) => {
    try {
      if (!task.title || !task.assigned_to) {
        throw new Error("Missing required fields");
      }
      const query = `
        INSERT INTO Task (
          title, description, status, priority, due_date, assigned_to
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;
      const values = [
        task.title,
        task.description,
        task.status || "pending",
        // Default to 'pending' if not provided
        task.priority || "medium",
        // Default to 'medium' if not provided
        task.due_date,
        task.assigned_to
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
    }
  },
  // Update a specific task by ID
  update: async (id, updates) => {
    try {
      const task = await TaskService.get(id);
      if (!task) {
        throw new Error("Task not found");
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Task 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Task not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  },
  // Delete a specific task by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Task 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Task not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  },
  // Delete all tasks
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Task;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error deleting all tasks:", error);
      throw new Error("Failed to delete all tasks");
    }
  }
};
const SALT_ROUNDS = 10;
const UsersService = {
  // Retrieve all users with pagination and optional role filter
  getAll: async ({ role } = {}) => {
    try {
      let query = `SELECT * FROM Users WHERE is_deleted = FALSE`;
      const params = [];
      if (role) {
        query += ` AND role = $1`;
        params.push(role);
      }
      query += ` ORDER BY created_at DESC`;
      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
  // Retrieve a specific user by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Users 
        WHERE id = $1 AND is_deleted = FALSE;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }
      const user = result.rows[0];
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },
  // Add a new user
  add: async (user) => {
    try {
      if (!user.first_name || !user.last_name || !user.email || !user.phone) {
        throw new Error("Missing required fields: first_name, last_name, email, phone");
      }
      let hashedPassword = user.password ? await bcrypt.hash(user.password, SALT_ROUNDS) : null;
      const query = `
        INSERT INTO Users (
          first_name, last_name, email, password, phone, emergency_contact_phone, 
          address_1, address_2, date_of_birth, profile_picture_url, role, updated_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP) 
        RETURNING *;
      `;
      const params = [
        user.first_name,
        user.last_name,
        user.email,
        hashedPassword,
        user.phone,
        user.emergency_contact_phone || null,
        user.address_1 || null,
        user.address_2 || null,
        user.date_of_birth || null,
        user.profile_picture_url || null,
        user.role?.toLowerCase() || "guest"
      ];
      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  },
  // Update an existing user
  update: async ({ id, updates }) => {
    try {
      const user = await UsersService.get(id);
      if (!user) {
        throw new Error("User not found");
      }
      if (updates?.password) {
        updates.password = await bcrypt.hash(updates?.password, SALT_ROUNDS);
      }
      const setClause = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      values.push(id);
      const query = `
        UPDATE Users 
        SET ${setClause.join(", ")} 
        WHERE id = $${index} AND is_deleted = FALSE 
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("User not found ord already deleted");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
  // Permanently delete a user
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Users 
        WHERE id = $1 
        RETURNING *;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
  // Delete multiple users by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error("No user IDs provided");
      }
      const query = `
        DELETE FROM Users 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;
      const result = await client.query(query, [ids]);
      if (result.rows.length === 0) {
        throw new Error("No users found for deletion");
      }
      return result.rows;
    } catch (error) {
      console.error("Error deleting multiple users:", error);
      throw error;
    }
  }
};
const InventoryService = {
  getAll: async () => {
    try {
      const result = await client.query("SELECT * FROM Inventory");
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  get: async (id) => {
    try {
      if (!id) {
        throw new Error("Invalid ID provided");
      }
      const result = await client.query(
        "SELECT * FROM Inventory WHERE id = $1",
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      throw error;
    }
  },
  add: async (item) => {
    try {
      const result = await client.query(
        "INSERT INTO Inventory (name, type, quantity) VALUES ($1, $2, $3) RETURNING *",
        [item.name, item.type, item.quantity]
      );
      return result.rows[0];
    } catch (error) {
      console.log("Error adding Inventory item:", error);
      throw error;
    }
  },
  update: async (item) => {
    const { id, quantity, ...updates } = item;
    if (!id) {
      throw new Error("ID is required for updating an Inventory item");
    }
    try {
      const fetchQuery = `
            SELECT quantity 
            FROM Inventory 
            WHERE id = $1
        `;
      const fetchResult = await client.query(fetchQuery, [id]);
      if (fetchResult.rows.length === 0) {
        throw new Error("Inventory item not found");
      }
      const currentQuantity = fetchResult.rows[0].quantity;
      let newQuantity;
      if (!quantity) {
        newQuantity = currentQuantity - 1;
      } else {
        newQuantity = quantity;
      }
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative");
      }
      updates.quantity = newQuantity;
      const setClauses = [];
      const values = [];
      let index = 1;
      for (const [key, value] of Object.entries(updates)) {
        setClauses.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
      if (setClauses.length === 0) {
        throw new Error("No fields provided to update");
      }
      values.push(id);
      const updateQuery = `
            UPDATE Inventory 
            SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $${index} 
            RETURNING *
        `;
      const result = await client.query(updateQuery, values);
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error updating Inventory item:", error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const result = await client.query(
        "DELETE FROM Inventory WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length > 0) {
        return `Deleted Item id ${result.rows[0].id}`;
      } else {
        throw new Error("Inventory item not found");
      }
    } catch (error) {
      console.log("Error deleting Inventory item:", error);
      throw error;
    }
  },
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        return 0;
      }
      const query = `
        DELETE FROM Inventory
        WHERE id = ANY($1::int[])
      `;
      const result = await client.query(query, [ids]);
      return result.rowCount;
    } catch (error) {
      console.log("Error deleting Inventory items:", error);
      throw error;
    }
  }
};
const sendEmail = async ({ emailTo, emailSubject, emailHTML, emailListId }) => {
  try {
    const configQuery = `
      SELECT smtp_user_email, smtp_password 
      FROM email_configurations 
      LIMIT 1;
    `;
    const configResult = await client.query(configQuery);
    if (configResult.rows.length === 0) {
      throw new Error("No email configuration found");
    }
    const { smtp_user_email, smtp_password } = configResult.rows[0];
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtp_user_email,
        pass: smtp_password
      }
    });
    const mailOptions = {
      from: smtp_user_email,
      to: emailTo,
      subject: emailSubject,
      html: emailHTML
    };
    const info = await transporter.sendMail(mailOptions);
    const updateQuery = `
      UPDATE email_lists
      SET status = $1
      WHERE id = $2;
    `;
    const updateValues = ["sent", emailListId];
    await client.query(updateQuery, updateValues);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
function generateOTP() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
const resetEmailSend = async ({
  emailFrom,
  emailPass,
  emailTo,
  emailSubject,
  emailHTML
}) => {
  try {
    const configQuery = `
     SELECT smtp_user_email, smtp_password 
     FROM email_configurations 
     LIMIT 1;
    `;
    const configResult = await client.query(configQuery);
    if (configResult.rows.length === 0) {
      throw new Error("No email configuration found");
    }
    if (!emailTo) {
      return { success: false, error: "Recipient email is required." };
    }
    const userQuery = `
      SELECT * 
      FROM users 
      WHERE email = $1 
      LIMIT 1;
    `;
    const userResult = await client.query(userQuery, [emailTo]);
    if (userResult.rows.length === 0) {
      return { success: false, error: "User not found." };
    }
    const user = userResult.rows[0];
    const otpCode = generateOTP();
    const updateOtpQuery = `
      UPDATE users 
      SET otp_code = $1, otp_used = $2 
      WHERE email = $3;
    `;
    await client.query(updateOtpQuery, [otpCode, true, emailTo]);
    const { smtp_user_email, smtp_password } = configResult.rows[0];
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtp_user_email,
        pass: smtp_password
      }
    });
    const mailOptions = {
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      html: `<p>${otpCode}</p>`
      // Include OTP in the email content
    };
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending reset email:", error);
    return { success: false, error };
  }
};
const appQuit = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    electron.app.quit();
    return { success: true };
  } catch (error) {
    console.error("Error application quit:", error);
    return { success: false, error };
  }
};
const configPath = path.join(electron.app.getPath("userData"), "db.json");
const ensureConfigDirectoryExists = () => {
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
};
const readConfigFile = () => {
  if (fs.existsSync(configPath) && fs.lstatSync(configPath).isFile()) {
    const configData2 = fs.readFileSync(configPath, "utf8");
    return JSON.parse(configData2);
  }
  return null;
};
const authenticateWithLocalFile = (config, data) => {
  if (config.userCredential && config.userCredential.email === data.email && config.userCredential.password === data.password) {
    return {
      email: data.email,
      role: "superAdmin",
      redirectURL: "/server-configuration"
    };
  }
  return false;
};
const authenticateWithDatabase = async (config, data) => {
  const client2 = new pg.Client({
    host: config.serverCredential.host,
    user: config.serverCredential.user,
    password: config.serverCredential.password,
    database: config.serverCredential.database,
    port: config.serverCredential.port
  });
  try {
    await client2.connect();
    const res = await client2.query(
      `SELECT password, role FROM Users WHERE email = $1`,
      [data.email]
    );
    if (res.rows.length > 0) {
      const dbPassword = res.rows[0].password;
      const isMatch = await bcrypt.compare(data.password, dbPassword);
      if (isMatch) {
        return {
          email: data.email,
          role: res.rows[0]?.role,
          redirectURL: "/"
        };
      }
    }
    return false;
  } catch (dbError) {
    console.error("Database error:", dbError);
    return false;
  } finally {
    await client2.end();
  }
};
const Login = async (data) => {
  try {
    ensureConfigDirectoryExists();
    const config = readConfigFile();
    if (!config) {
      return false;
    }
    if (!config.serverCredential) {
      return authenticateWithLocalFile(config, data);
    } else {
      return await authenticateWithDatabase(config, data);
    }
  } catch (error) {
    console.error("Error during login process:", error);
    return false;
  }
};
const serviceMap = {
  user: UsersService,
  guest: GuestService,
  employee: EmployeesService,
  serverConfig: ServerConfigService,
  attendance: AttendanceService,
  booking: BookingsService,
  cashFlow: CashFlowService,
  dutySchedule: DutyScheduleService,
  invoiceItem: InvoiceItemService,
  invoice: InvoiceService,
  leaveRequest: LeaveRequestService,
  loyaltyProgram: LoyaltyProgramService,
  payroll: PayrollService,
  performanceReview: PerformanceReviewService,
  roomMaintenance: RoomMaintenanceService,
  room: RoomService,
  // room
  service: RoomServicesService,
  // room services
  shift: ShiftService,
  task: TaskService,
  amenity: AmenityService,
  // room amenity
  posMachine: PosMachineService,
  emailConfiguration: EmailConfigurationService,
  emailTemplate: EmailTemplateService,
  serviceProvider: ServiceProvidersService,
  paymentMethods: PaymentMethodsService,
  partnerPayments: PartnerPaymentsService,
  SMSConfiguration: SMSConfigurationsService,
  inventory: InventoryService
};
let handlersRegistered = false;
const registerAllHandlers = () => {
  if (handlersRegistered) return;
  handlersRegistered = true;
  Object.keys(serviceMap).forEach((entity) => {
    const service = serviceMap[entity];
    electron.ipcMain.handle(`get-${entity}s`, async (event, item) => {
      try {
        return await service.getAll(item);
      } catch (error) {
        console.error(`Error occurred in handler for 'get-${entity}s':`, error);
        throw error;
      }
    });
    electron.ipcMain.handle(`get-${entity}`, async (event, id) => {
      try {
        return await service.get(id);
      } catch (error) {
        console.error(`Error occurred in handler for 'get-${entity}':`, error);
        throw error;
      }
    });
    electron.ipcMain.handle(`add-${entity}`, async (event, item) => {
      try {
        return await service.add(item);
      } catch (error) {
        console.error(`Error occurred in handler for 'add-${entity}':`, error);
        throw error;
      }
    });
    electron.ipcMain.handle(`update-${entity}`, async (event, item) => {
      try {
        return await service.update(item);
      } catch (error) {
        console.error(
          `Error occurred in handler for 'update-${entity}':`,
          error
        );
        throw error;
      }
    });
    electron.ipcMain.handle(`delete-${entity}`, async (event, id) => {
      try {
        return await service.delete(id);
      } catch (error) {
        console.error(
          `Error occurred in handler for 'delete-${entity}':`,
          error
        );
        throw error;
      }
    });
    electron.ipcMain.handle(`delete-all-${entity}`, async (event, ids) => {
      try {
        return await service.deleteAll(ids);
      } catch (error) {
        console.error(
          `Error occurred in handler for 'delete-all-${entity}':`,
          error
        );
        throw error;
      }
    });
  });
  electron.ipcMain.handle(
    "send-email",
    async (event, { emailFrom, emailTo, emailSubject, emailHTML, emailListId }) => {
      const { emailFrom: emailAddress, emailPass } = emailFrom;
      return await sendEmail({
        emailFrom: emailAddress,
        emailPass,
        emailTo,
        emailSubject,
        emailHTML,
        emailListId
      });
    }
  );
  electron.ipcMain.handle(
    "reset-password-email",
    // use consistent naming here
    async (event, { emailFrom, emailTo, emailSubject, emailHTML }) => {
      const { emailFrom: emailAddress, emailPass } = emailFrom;
      return await resetEmailSend({
        emailFrom: emailAddress,
        emailPass,
        emailTo,
        emailSubject,
        emailHTML
      });
    }
  );
  electron.ipcMain.handle(
    "app-quit",
    // use consistent naming here
    async (event) => {
      return await appQuit();
    }
  );
  electron.ipcMain.handle(
    "login",
    // use consistent naming here
    async (event, data) => {
      return await Login(data);
    }
  );
};
async function createAmenitiesTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Amenities (
            id SERIAL PRIMARY KEY, -- Unique identifier for each amenity (auto-incremented).
            amenity_name VARCHAR(100) NOT NULL UNIQUE, -- Name of the amenity (e.g., Free Wi-Fi, Air Conditioning).
            description TEXT, -- Additional details about the amenity.
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created.
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the record was last updated.
          );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Room table:", error);
  }
}
async function createAttendanceTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Attendance (
            id SERIAL PRIMARY KEY,
            employee_id INT NOT NULL,
            clock_in TIMESTAMP NOT NULL,
            clock_out TIMESTAMP,
            hours_worked DECIMAL(5, 2),
            FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Attendance table:", error);
  }
}
async function createBookingsTable() {
  const createTableQuery = `
       CREATE TABLE IF NOT EXISTS Bookings (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            room_id INT NOT NULL,
            check_in_date DATE NOT NULL,
            check_out_date DATE,
            total_price DECIMAL(15, 2) NOT NULL CHECK (total_price >= 0),
            status VARCHAR(20) DEFAULT 'booked' CHECK (status IN ('booked', 'checked', 'canceled', 'checked_out')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (room_id) REFERENCES Rooms(id),
            CHECK (check_out_date > check_in_date)
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Bookings table:", error);
  }
}
async function createCashFlowServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Cash_Flow (
              id SERIAL PRIMARY KEY,
              date DATE NOT NULL UNIQUE, -- Ensures only one entry per day
              opening_balance DECIMAL(15, 2) NOT NULL CHECK (opening_balance >= 0), -- Positive or zero
              total_income DECIMAL(15, 2) NOT NULL CHECK (total_income >= 0), -- Positive or zero
              total_expenses DECIMAL(15, 2) NOT NULL CHECK (total_expenses >= 0), -- Positive or zero
              closing_balance DECIMAL(15, 2) NOT NULL CHECK (closing_balance >= 0), -- Positive or zero
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the record was last updated
          );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Cash Flow Item table:", error);
  }
}
async function createDutyScheduleTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Duty_Schedules (
              id SERIAL PRIMARY KEY,
              employee_id INT NOT NULL,
              shift_id INT NOT NULL,
              duty_date DATE NOT NULL,
              status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
              FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE,
              FOREIGN KEY (shift_id) REFERENCES Shifts(id)
          );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Duty Schedule table:", error);
  }
}
async function createEmailConfigurationTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Email_Configurations (
          id SERIAL PRIMARY KEY, -- Auto-incrementing ID for each email configuration
          smtp_user_email VARCHAR(255) NOT NULL, -- SMTP user email
          smtp_password VARCHAR(255) NOT NULL, -- SMTP password
          smtp_server INT NOT NULL, -- SMTP server port or identifier
          imap_user_email VARCHAR(255) NOT NULL, -- IMAP user email
          imap_password VARCHAR(255) NOT NULL, -- IMAP password
          imap_server INT NOT NULL -- IMAP server port or identifier
      );
  `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.log("Error creating email configuration table:", error);
  }
}
async function createEmailTemplateTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Email_Templates (
          id SERIAL PRIMARY KEY, -- Auto-incrementing ID for each email template
          name VARCHAR(255) NOT NULL, -- Name of the email template
          subject VARCHAR(255), -- Subject line of the email template
          body TEXT -- Body content of the email template
      );
  `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.log("Error creating email template table:", error);
  }
}
async function createEmployeesTable() {
  const createTableQuery = `
       CREATE TABLE IF NOT EXISTS Employees (
                id SERIAL PRIMARY KEY,
                user_id INT,
                position VARCHAR(50) NOT NULL,
                salary DECIMAL(10, 2) NOT NULL,
                hire_date DATE NOT NULL,
                termination_date DATE,
                department VARCHAR(50),
                nid TEXT,
                certifications TEXT[], -- Array of certifications
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
            );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Employee table:", error);
  }
}
async function createGuestTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Guest (
            id SERIAL PRIMARY KEY,
            user_id INT,
            passport_or_national_number VARCHAR(50),
            nid TEXT,
            nationality VARCHAR(50),
            secondary_contact VARCHAR(20) NOT NULL,
            relation VARCHAR(50),
            job_title VARCHAR(50),
            company_name VARCHAR(100),
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Guest table:", error);
  }
}
async function createInventoryTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Inventory (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            type VARCHAR(50) NOT NULL, -- Renamed column
            quantity INTEGER NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.log("Error creating Inventory table:", error);
  }
}
async function createInvoiceItemServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Invoice_Items (
              id SERIAL PRIMARY KEY,
              invoice_id INT NOT NULL,
              service_type VARCHAR(20) CHECK (service_type IN ('room', 'service')) NOT NULL,
              service_id INT NOT NULL,  -- Which service is consumed or Room id
              quantity INT NOT NULL CHECK (quantity > 0), -- How many services are consumed
              unit_price DECIMAL(15, 2) NOT NULL CHECK (unit_price >= 0),
              total_price DECIMAL(15, 2) NOT NULL CHECK (total_price >= 0),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL,
              FOREIGN KEY (invoice_id) REFERENCES Invoices(id) ON DELETE CASCADE
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Invoice Item table:", error);
  }
}
async function createInvoiceServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Invoices (
                id SERIAL PRIMARY KEY,
                booking_id INT NOT NULL,
                total_amount DECIMAL(15, 2) NOT NULL CHECK (total_amount >= 0),
                vat_amount DECIMAL(15, 2) DEFAULT 0.00 CHECK (vat_amount >= 0), -- VAT amount as a fixed value
                discount DECIMAL(15, 2) DEFAULT 0.00 CHECK (discount >= 0),
                net_amount DECIMAL(15, 2) DEFAULT 0.00 CHECK (net_amount >= 0),
                amount_paid DECIMAL(15, 2) DEFAULT 0.00 CHECK (amount_paid >= 0),
                balance_due DECIMAL(15, 2) DEFAULT 0.00 CHECK (balance_due >= 0),
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP DEFAULT NULL,
                FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE
            );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Invoice Item table:", error);
  }
}
async function createLeaveRequestTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Leave_Requests (
            id SERIAL PRIMARY KEY, -- SERIAL for auto-increment in PostgreSQL
            employee_id INT NOT NULL,
            leave_type VARCHAR(20) NOT NULL CHECK (leave_type IN ('vacation', 'sick', 'personal')), -- Use CHECK instead of ENUM
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')), -- Use CHECK instead of ENUM
            reason TEXT,
            FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Leave Request table:", error);
  }
}
async function createLoyaltyProgramServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Loyalty_Program (
              id SERIAL PRIMARY KEY,
              user_id INT NOT NULL UNIQUE, -- Ensures one-to-one relationship
              points_balance INT DEFAULT 0 CHECK (points_balance >= 0), -- Loyalty points balance
              tier VARCHAR(20) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
              join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date the user joined the loyalty program
              last_activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Last activity date
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL,
              FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE -- Links to the User table
          );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Loyalty Program Item table:", error);
  }
}
async function createPartnerPaymentsTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Partner_Payments (
              id SERIAL PRIMARY KEY,
              service_provider_id INT,
              payment_method_id INT,
              payment_date DATE,
              payment_amount DECIMAL(10, 2),

              FOREIGN KEY (service_provider_id) REFERENCES Service_Providers(id),
              FOREIGN KEY (payment_method_id) REFERENCES Payment_Methods(id)

          );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Partner Payment Item table:", error);
  }
}
async function createPaymentMethodsTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Payment_Methods (
              id SERIAL PRIMARY KEY,
              partner_id INT,
              invoice_id INT NOT NULL,
              service_name VARCHAR(100) NOT NULL, -- 
              amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
              payment_type VARCHAR(20), --(pos machine name, cash)
              payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) NOT NULL,
              payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              description TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (invoice_id) REFERENCES Invoices(id) ON DELETE CASCADE
          );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating payment methods table:", error);
  }
}
async function createPayrollTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Payroll (
            id SERIAL PRIMARY KEY,
            employee_id INT NOT NULL,
            pay_period_start DATE NOT NULL,
            pay_period_end DATE NOT NULL,
            gross_salary DECIMAL(15, 2) NOT NULL,
            deductions DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
            net_salary DECIMAL(15, 2) GENERATED ALWAYS AS (gross_salary - deductions) STORED,
            payment_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE,
            CHECK (pay_period_end >= pay_period_start)
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Payroll table:", error);
  }
}
async function createPerformanceReviewsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Performance_Reviews (
      id SERIAL PRIMARY KEY,
      employee_id INT NOT NULL,
      review_date DATE NOT NULL,
      rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comments TEXT,
      reviewer_id INT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES Employees(id) ON DELETE NO ACTION
    );
  `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Performance Reviews table:", error.message);
    throw error;
  }
}
async function createPosMachineTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Pos_Machine  (
            id SERIAL PRIMARY KEY,  -- Unique identifier for the POS machine
            name VARCHAR(50) NOT NULL,  -- Name or identifier of the POS machine
            location VARCHAR(255),  -- Location where the POS machine is installed
            is_active BOOLEAN DEFAULT TRUE,  -- Whether the POS machine is active
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the POS machine was added
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the POS machine was last updated
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Room table:", error);
  }
}
async function createRoomMaintenanceTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Room_Maintenance (
            id SERIAL PRIMARY KEY,
            room_id INT NOT NULL,
            maintenance_type VARCHAR(20) CHECK (maintenance_type IN ('cleaning', 'repair', 'renovation')) NOT NULL,
            start_date TIMESTAMP NOT NULL,
            end_date TIMESTAMP,
            status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES Rooms(id) ON DELETE CASCADE
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Room Maintenance table:", error);
  }
}
async function createRoomsTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS rooms (
          id SERIAL PRIMARY KEY, -- Unique identifier for each room (auto-incremented).
          room_number VARCHAR(10) NOT NULL UNIQUE, -- Room number (e.g., 101, 102). Must be unique.
          type_name VARCHAR(50) NOT NULL, -- Name of the room type (e.g., Standard, Deluxe).
          description TEXT, -- Additional details about the room.
          status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'checked', 'maintenance')), -- Current status of the room.
          base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0), -- Base price per night.
          capacity INT NOT NULL CHECK (capacity > 0), -- Maximum number of guests the room can accommodate.
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created.
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the record was last updated.
      );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Room table:", error);
  }
}
async function createRooms_AmenitiesTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS room_amenities (
            room_id INT NOT NULL, -- Foreign key referencing the 'rooms' table.
            amenity_id INT NOT NULL, -- Foreign key referencing the 'Amenities' table.
            PRIMARY KEY (room_id, amenity_id), -- Composite primary key to ensure uniqueness.
            FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE, -- Ensures referential integrity. If a room is deleted, associated amenities are also deleted.
            FOREIGN KEY (amenity_id) REFERENCES Amenities(id) ON DELETE CASCADE -- Ensures referential integrity. If an amenity is deleted, associated rooms are also deleted.
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Room table:", error);
  }
}
async function createServiceProvidersTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Service_Providers (
              id SERIAL PRIMARY KEY,
              service_provider_name VARCHAR(50) NOT NULL, -- Name of the service provider
              contact_person VARCHAR(60), -- Contact person at the service provider
              contact_phone VARCHAR(15), -- Contact phone number
              contact_email VARCHAR(255), -- Contact email address
              address TEXT, -- Address of the service provider
              current_balance DECIMAL(15, 2) -- The current balance owed to the service provider
          );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Service Providers table:", error);
  }
}
async function createServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Services (
                id SERIAL PRIMARY KEY, -- Auto-increment unique identifier
                service_name VARCHAR(255) NOT NULL, -- Name of the service
                service_provider_id INT, -- Links the service to the provider who offers it
                default_price DECIMAL(15, 2) NOT NULL, -- The standard price for this service
                provider_rate DECIMAL(15, 2) NULL,  -- Nullable column
                hotel_rate DECIMAL(15, 2) NULL,     -- Nullable column  
                is_active BOOLEAN DEFAULT true,
                CONSTRAINT fk_service_provider
                FOREIGN KEY (service_provider_id)
                REFERENCES Service_Providers(id)
                ON DELETE SET NULL -- Optional: Set to NULL if the referenced provider is deleted
              );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Service table:", error);
  }
}
async function createShiftTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Shifts (
            id SERIAL PRIMARY KEY,
            shift_name VARCHAR(50) NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Shift table:", error);
  }
}
async function createSMSConfigurationTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS SMS_Configurations (
          id SERIAL PRIMARY KEY,
          api_key VARCHAR(100) NOT NULL, -- Adjusted for fixed-length API keys
          senderid VARCHAR(50) NOT NULL -- Sender ID for SMS
      );
  `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.log("Error creating SMS Configurations table:", error);
  }
}
async function createTasksTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Task (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT,
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),  -- Custom ENUM type for role
                priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),  -- Custom ENUM type for role
                due_date TIMESTAMP,
                assigned_to INT NOT NULL, -- Employee responsible
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                -- Relationships
                FOREIGN KEY (assigned_to) REFERENCES Employees(id) ON DELETE CASCADE
            );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Tasks table:", error);
  }
}
async function createUsersTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Users (
              id SERIAL PRIMARY KEY,
              first_name VARCHAR(50) NOT NULL,                -- User's first name
              last_name VARCHAR(50) NOT NULL,                 -- User's last name
              email VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255),         -- Hashed password
              phone VARCHAR(20) UNIQUE NOT NULL,
              emergency_contact_phone VARCHAR(15),    -- Emergency contact phone (for employees)
              address_1 TEXT,                           -- User's address 1
              address_2 TEXT,                           -- User's address 2
              date_of_birth DATE,                     -- Date of birth (for employees and customers)
              profile_picture_url TEXT,               -- URL to user's profile picture
              role VARCHAR(20) DEFAULT 'guest' CHECK (role IN ('guest','receptionist', 'staff', 'employee', 'hr', 'admin')),  -- Custom ENUM type for role
              is_deleted BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
  try {
    await client.query(createTableQuery);
  } catch (error) {
    console.error("Error creating Users table:", error);
  }
}
async function createDBTables() {
  await Promise.all([
    createUsersTable(),
    createGuestTable(),
    createEmployeesTable(),
    createTasksTable(),
    createAttendanceTable(),
    createLeaveRequestTable(),
    createShiftTable(),
    createDutyScheduleTable(),
    createPerformanceReviewsTable(),
    createPayrollTable(),
    createServiceProvidersTable(),
    createServiceTable(),
    //
    createRoomsTable(),
    createAmenitiesTable(),
    createRooms_AmenitiesTable(),
    createBookingsTable(),
    createRoomMaintenanceTable(),
    //
    createInvoiceServiceTable(),
    createInvoiceItemServiceTable(),
    //
    createPaymentMethodsTable(),
    createPartnerPaymentsTable(),
    createCashFlowServiceTable(),
    createInventoryTable(),
    //
    createLoyaltyProgramServiceTable(),
    createPosMachineTable(),
    //
    createSMSConfigurationTable(),
    createEmailConfigurationTable(),
    createEmailTemplateTable()
  ]);
}
const users = [
  {
    first_name: "admin",
    last_name: "admin",
    email: "admin@gmail.com",
    password: "123456",
    phone: "01111111112",
    role: "admin"
  }
];
async function seedUserItems() {
  try {
    for (const user of users) {
      const result = await client.query(
        "SELECT id FROM users WHERE email = $1 OR phone = $2",
        [user.email, user.phone]
      );
      const hashedPassword = await bcrypt.hash(user.password, 10);
      if (result.rows.length === 0) {
        await client.query(
          "INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            user.first_name,
            user.last_name,
            user.email,
            hashedPassword,
            user.phone,
            user.role
          ]
        );
        console.log(`User ${user.email} seeded successfully.`);
      } else {
      }
    }
  } catch (error) {
    console.error("Failed to seed User:", error);
  }
}
async function dbConnect() {
  if (client) {
    client.connect().then(() => console.log("Connected to PostgreSQL database.")).catch((err) => console.error("Connection error", err.stack));
    await createDBTables();
    try {
      const seed = async () => {
        await seedUserItems();
      };
      seed();
    } catch (error) {
      console.log("Error: from database seed:", error);
    }
  } else {
    console.log("Server configuration not available");
  }
}
dotenv.config();
function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new electron.BrowserWindow({
    width,
    height,
    show: false,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    icon: path.join(__dirname, "../../resources/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  const startUrl = utils.is.dev && process.env["NODE_ENV"] === "development" ? "http://localhost:5173" : `file://${path.join(__dirname, "../renderer/index.html")}`;
  mainWindow.loadURL(startUrl).catch((err) => {
    console.error("Failed to load URL:", err);
  });
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}
electron.app.whenReady().then(async () => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  await dbConnect();
  createWindow();
  registerAllHandlers();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});

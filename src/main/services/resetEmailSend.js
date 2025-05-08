import nodemailer from 'nodemailer';
import { client } from '../db/Client';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send a reset password email
const resetEmailSend = async ({
  emailFrom,
  emailPass,
  emailTo,
  emailSubject,
  emailHTML,
}) => {
  try {
    // Step 1: Retrieve the email configuration
    const configQuery = `
     SELECT smtp_user_email, smtp_password 
     FROM email_configurations 
     LIMIT 1;
    `;
    const configResult = await client.query(configQuery);

    if (configResult.rows.length === 0) {
      throw new Error('No email configuration found');
    }

    if (!emailTo) {
      return { success: false, error: 'Recipient email is required.' };
    }

    // Step 2: Fetch the user from PostgreSQL
    const userQuery = `
      SELECT * 
      FROM users 
      WHERE email = $1 
      LIMIT 1;
    `;
    const userResult = await client.query(userQuery, [emailTo]);

    if (userResult.rows.length === 0) {
      return { success: false, error: 'User not found.' };
    }

    const user = userResult.rows[0];

    // Step 3: Generate a reset token for the user
    const otpCode = generateOTP();

    // Step 4: Update the user's OTP in PostgreSQL
    const updateOtpQuery = `
      UPDATE users 
      SET otp_code = $1, otp_used = $2 
      WHERE email = $3;
    `;
    await client.query(updateOtpQuery, [otpCode, true, emailTo]);

    const { smtp_user_email, smtp_password } = configResult.rows[0];

    // Step 5: Configure the nodemailer transporter dynamically
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtp_user_email,
        pass: smtp_password,
      },
    });

    // Email configuration
    const mailOptions = {
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      html: `<p>${otpCode}</p>`, // Include OTP in the email content
    };

    // Step 6: Send the email
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending reset email:', error);
    return { success: false, error };
  }
};

export default resetEmailSend;

/*version: 2*/
// import nodemailer from 'nodemailer';
// import realm from '../db/database';
// import { client } from '../db/Client';

// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Function to send a reset password email
// const resetEmailSend = async ({
//   emailFrom,
//   emailPass,
//   emailTo,
//   emailSubject,
//   emailHTML,
// }) => {
//   try {
//     // Step 1: Retrieve the email configuration
//     const configQuery = `
//      SELECT smtp_user_email, smtp_password
//      FROM email_configurations
//      LIMIT 1;
//     `;
//     const configResult = await client.query(configQuery);

//     if (configResult.rows.length === 0) {
//       throw new Error('No email configuration found');
//     }
//     if (!emailTo) {
//       return { success: false, error: 'Recipient email is required.' };
//     }

//     // Fetch the user from Realm
//     const users = realm.objects('User');
//     const user = users.find((user) => user.email === emailTo);
//     if (!user) {
//       return { success: false, error: 'User not found.' };
//     }

//     // Generate a reset token for the user
//     const otpCode = generateOTP();
//     // Update the user in Realm with the reset token
//     realm.write(() => {
//       user.otpCode = otpCode;
//       user.otpUsed = true;
//     });

//     const { smtp_user_email, smtp_password } = configResult.rows[0];

//     // Step 2: Configure the nodemailer transporter dynamically
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: smtp_user_email,
//         pass: smtp_password,
//       },
//     });

//     // // Set up Nodemailer transporter
//     // const transporter = nodemailer.createTransport({
//     //   service: 'gmail',
//     //   auth: {
//     //     /* TODO: This will come from client end */
//     //     user: 'mokhles.xponent@gmail.com',
//     //     pass: 'gkughsjtagzszlwl', // Make email password dynamic or use an environment variable
//     //   },
//     // });

//     // Email configuration
//     const mailOptions = {
//       from: emailFrom,
//       to: emailTo,
//       subject: emailSubject,
//       html: `<p>${otpCode}</p>`,
//     };

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);
//     return { success: true, info };
//   } catch (error) {
//     console.error('Error sending reset email:', error);
//     return { success: false, error };
//   }
// };
// export default resetEmailSend;

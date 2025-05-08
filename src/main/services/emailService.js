import nodemailer from 'nodemailer';
import { client } from '../db/Client';

// Function to send an email
const sendEmail = async ({ emailTo, emailSubject, emailHTML, emailListId }) => {
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

    const { smtp_user_email, smtp_password } = configResult.rows[0];

    // Step 2: Configure the nodemailer transporter dynamically
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtp_user_email,
        pass: smtp_password,
      },
    });

    const mailOptions = {
      from: smtp_user_email,
      to: emailTo,
      subject: emailSubject,
      html: emailHTML,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent:', info);

    // Step 3: Update the email list status
    const updateQuery = `
      UPDATE email_lists
      SET status = $1
      WHERE id = $2;
    `;
    const updateValues = ['sent', emailListId];

    await client.query(updateQuery, updateValues);
    // console.log(`Email list status updated for ID: ${emailListId}`);

    return { success: true, info };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

export default sendEmail;


/* Version: 2*/
// import nodemailer from 'nodemailer';
// import realm from '../db/database';
// import Realm from 'realm';

// // Function to send an email
// const sendEmail = async ({
//   emailFrom,
//   emailPass,
//   emailTo,
//   emailSubject,
//   emailHTML,
//   emailListId,
// }) => {
//   try {


//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: emailFrom,
//         pass: emailPass, // TODO Email password need to dynamic
//       },
//     });

//     const mailOptions = {
//       from: emailFrom,
//       to: emailTo,
//       subject: emailSubject,
//       html: emailHTML,
//     };

//     // const info = await transporter.sendMail(mailOptions);
//     // // console.log('email send info:', info);
//     const emailList = realm.objectForPrimaryKey(
//       'EmailList',
//       new Realm.BSON.ObjectId(emailListId)
//     );
//     // // console.log('email list:', { emailList, emailListId });
//     if (emailList) {
//       realm.write(() => {
//         emailList.status = 'send';
//       });
//     }
//     return { success: true, info };
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return { success: false, error };
//   }
// };
// export default sendEmail;

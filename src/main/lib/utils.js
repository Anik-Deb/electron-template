import { Client } from 'pg';
import nodemailer from 'nodemailer'

export async function dbConnectionChecker(config) {
  const client = new Client(config);

  try {
    await client.connect();
    // console.log('Reconnected to the database with new settings.');
    return true;
  } catch (err) {
    console.error('Error reconnecting to database:', err.stack);
    return false;
  } finally {
    await client.end();
  }
}

// verify SMTP Account
export async function verifySMTPAccount(smtpConfig) {
  // Create a transporter object using the provided SMTP configuration
  let transporter = nodemailer.createTransport(smtpConfig)

  try {
    // Verify connection configuration
    await transporter.verify()
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
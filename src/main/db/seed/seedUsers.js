import { client } from '../Client';
import bcrypt from 'bcrypt';
export const users = [
  {
    first_name: 'admin',
    last_name: 'admin',
    email: 'admin@gmail.com',
    password: '123456',
    phone: '01111111112',
    role: 'admin',
  },
];
export async function seedUserItems() {
  try {
    for (const user of users) {
      // Check if the user already exists
      const result = await client.query(
        'SELECT id FROM users WHERE email = $1 OR phone = $2',
        [user.email, user.phone]
      );
      const hashedPassword = await bcrypt.hash(user.password, 10);
      // If no existing user is found, insert the new user
      if (result.rows.length === 0) {
        await client.query(
          'INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            user.first_name,
            user.last_name,
            user.email,
            hashedPassword,
            user.phone,
            user.role,
          ]
        );
        console.log(`User ${user.email} seeded successfully.`);
      } else {
        // console.log(`User with email ${user.email} or phone ${user.phone} already exists. Skipping...`);
      }
    }
  } catch (error) {
    console.error('Failed to seed User:', error);
  }
}

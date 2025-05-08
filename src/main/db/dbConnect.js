import { client } from './Client';
import { createDBTables } from './dbTables';
import { seedUserItems } from './seed/seedUsers';

export default async function dbConnect() {
  /* DB Connect*/
  // console.log('client:', client);
  if (client) {
    // Connect to PostgreSQL
    client
      .connect()
      .then(() => console.log('Connected to PostgreSQL database.'))
      .catch((err) => console.error('Connection error', err.stack));
    await createDBTables(); // Create the schema when the application starts
    // Call the function to seed the database
    try {
      // Seed database
      const seed = async () => {
        await seedUserItems()
      };
      seed();
    } catch (error) {
      console.log('Error: from database seed:', error);
    }
  } else {
    console.log('Server configuration not available');
  }
}
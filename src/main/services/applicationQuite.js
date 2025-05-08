import { app } from 'electron';

// Function to send an email
const appQuit = async () => {
  // console.log('app quit hit..');
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for 2 seconds
    // Schedule the app to relaunch after quitting
    app.quit();
    return { success: true };
  } catch (error) {
    console.error('Error application quit:', error);
    return { success: false, error };
  }
};
export default appQuit;

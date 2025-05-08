export const createUserAndGuest = async (data) => {
  const newUser = await window.api.addUser(data);
  if (!newUser?.id) {
    throw new Error('User not created!');
  }

  await window.api.addGuest({ user_id: newUser.id, ...data });
  return newUser.id; // Return the new user ID for further use
};

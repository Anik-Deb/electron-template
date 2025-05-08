export const updateUserAndGuest = async (searchedGuest, data) => {
  const updateUserData = {
    first_name: data?.first_name,
    last_name: data?.last_name,
    email: data?.email,
    phone: data?.phone,
    emergency_contact_phone: data?.emergency_contact_phone,
    role: data?.role,
    date_of_birth: data?.date_of_birth,
    address_1: data?.address_1,
    address_2: data?.address_2,
    profile_picture_url: data?.profile_picture_url,
  };
  const updateGuestData = {
    user_id: searchedGuest?.user_id,
    passport_or_national_number: data?.passport_or_national_number,
    nationality: data?.nationality,
    secondary_contact: data?.secondary_contact,
    relation: data?.relation,
    job_title: data?.job_title,
    company_name: data?.company_name,
  };

  const [resultUser, resultGuest] = await Promise.all([
    window.api.updateUser({
      id: searchedGuest?.user_id,
      updates: updateUserData,
    }),
    window.api.updateGuest({ id: searchedGuest?.id, updates: updateGuestData }),
  ]);

  if (resultUser?.error || resultGuest?.error) {
    throw new Error('Failed to update user or guest');
  }

  return searchedGuest?.user_id; // Return the user ID for further use
};

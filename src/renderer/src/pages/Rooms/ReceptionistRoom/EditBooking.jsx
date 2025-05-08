import Loading from '@/components/Common/Loading';
import PageTitle from '@/components/Common/PageTitle';
import React from 'react';
import { useParams } from 'react-router-dom';
import { addDays } from 'date-fns';
import emptyAvatar from '../../../assets/empty-avatar.png';
import BookingForm from './components/BookingForm/BookingForm';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';
import { showToast } from '@/utils/toastHelper';

export default function EditBooking() {
  const { id } = useParams();
  const [date, setDate] = React.useState({
    from: new Date(),
    to: addDays(new Date(), 2),
  });
  const [profilePreview, setProfilePreview] = React.useState(emptyAvatar);
  const [guests, setGuests] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [prevData, setPrevData] = React.useState();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const booking = await window.api.getBooking(id);
        setPrevData(booking);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching booking:', error);
        setIsLoading(false); // Also set loading to false if there is an error
        showToast('error', 'Failed to fetch booking data');
      }
    };

    fetchData(); // Call the fetchData function
  }, [id]); // Dependency array added to re-fetch when `id` changes

  const onSubmit = async (data) => {
    try {
      // console.log('Form submitted:', { ...data });
      // Update user details
      const updates = {
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
      // const resultUser = await window.api.updateUser({
      //   id: prevData?.user_id,
      //   updates,
      // });
      console.log('update users', updates);
      // if (resultUser?.error) {
      //   return { error: 'User not updated!' };
      // }
      // Update guest details
      const updateGuest = {
        user_id: prevData?.user_id, // Keep the same user_id
        passport_or_national_number: data?.passport_or_national_number, // Use new data or fallback to prevData
        nationality: data?.nationality,
        secondary_contact: data?.secondary_contact,
        relation: data?.relation,
        job_title: data?.job_title,
        company_name: data?.company_name,
      };
      // await window.api.updateGuest({
      //   id,
      //   updates: updateGuest,
      // });

      console.log('update guest', updateGuest);
      const bookingUpdates = {
        user_id: data.user_id,
        room_id: id,
        check_in_date: date.from,
        check_out_date: date.to,
        total_price: data.total_price,
        status: data.status,
      };

      // Call the update function from BookingsService (you can import it if necessary)
      // const updatedBooking = await window.api.updateBooking({
      //   id,
      //   updates: bookingUpdates,
      // });
      console.log('bookingUpdates', bookingUpdates);
      // showToast('success', 'Booking updated successfully');
      // setPrevData(updatedBooking);
    } catch (error) {
      const error_message = errorMessage(error);
      showToast('error', error_message);
      console.log('error from edit booking:', error);
    }
  };

  return !isLoading ? (
    <>
      <PageTitle title={`Edit Booking`} />
      <div className="mt-8">
        <BookingForm
          // setData={setData}
          isLoading={isLoading}
          date={date}
          guests={guests}
          setDate={setDate}
          prevData={prevData}
          setProfilePreview={setProfilePreview}
          profilePreview={profilePreview}
          onSubmit={onSubmit}
        />
      </div>
    </>
  ) : (
    <Loading />
  );
}

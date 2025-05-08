/* eslint-disable no-unused-vars */
import PageTitle from '@/components/Common/PageTitle';
import { showToast } from '@/utils/toastHelper';
import { addDays } from 'date-fns';
import React from 'react';
import emptyAvatar from '../../../assets/input-empty.png';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUserAndGuest } from './action/updateUserAndGuest';
import { createUserAndGuest } from './action/createUserAndGuest';
import { calculateTotalPrice } from './action/calculateTotalPrice';
import { createBookingAndUpdateRoom } from './action/createBookingAndUpdateRoom';
import { createInvoice } from './action/createInvoice';
import BookingForm from './components/BookingForm/BookingForm';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';

export default function AddCheckedIn() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchedGuest, setSearchedGuest] = React.useState({});
  const [date, setDate] = React.useState({
    from: new Date(),
    to: addDays(new Date(), 2),
  });
  const [profilePreview, setProfilePreview] = React.useState(emptyAvatar);
  const [guests, setGuests] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [room, setRoom] = React.useState({});

  /* fetch member and membership plan */
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [guests, room] = await Promise.all([
          window.api.getGuests(),
          window.api.getRoom(roomId),
        ]);

        // Only update state if the component is still mounted
        setRoom(room);
        setGuests(guests);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false); // Ensure loading state is reset even if there's an error
    };

    fetchData();
  }, []);

  // Submit function for the form
  /**
   * Create a booking entry
   * Create invoice
   * Create a invoice item name room rent
   * Update room status booked
   */
  const onSubmit = async (data) => {
    try {
      console.log('data:', { ...data, ...date });
      let user_id;

      if (searchedGuest?.email) {
        // Update existing user and guest
        user_id = await updateUserAndGuest(searchedGuest, data);
      } else {
        // Create new user and guest
        user_id = await createUserAndGuest(data);
      }
      // Calculate total price for booking
      const totalPrice = calculateTotalPrice(room, date);

      // Create booking and update room status
      const booking = await createBookingAndUpdateRoom(
        user_id,
        roomId,
        date,
        totalPrice,
        'checked'
      );
      console.log('booking:', booking);
      // Create invoice and invoice item
      const invoice = await createInvoice(booking, room, totalPrice);
      console.log('invoice:', invoice);
      // Handle success
      showToast('success', 'Booking Successful!');
      navigate('/rooms');
    } catch (error) {
      const error_message = errorMessage(error);
      showToast('error', error_message);
    }
  };

  return (
    <>
      <PageTitle title={`Room Checked In`} />
      <div className="mt-8">
        <BookingForm
          // setData={setData}
          isLoading={isLoading}
          date={date}
          guests={guests}
          setDate={setDate}
          setProfilePreview={setProfilePreview}
          profilePreview={profilePreview}
          onSubmit={onSubmit}
          searchedGuest={searchedGuest}
          setSearchedGuest={setSearchedGuest}
        />
      </div>
    </>
  );
}

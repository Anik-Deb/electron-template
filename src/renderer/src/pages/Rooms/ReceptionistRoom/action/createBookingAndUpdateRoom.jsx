import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';
import { showToast } from '@/utils/toastHelper';

export const createBookingAndUpdateRoom = async (
  user_id,
  roomId,
  date,
  totalPrice,
  status
) => {
  try {
    console.log('booking date:', date);
    const [booking, updatedRoom] = await Promise.all([
      window.api.addBooking({
        user_id,
        room_id: roomId,
        check_in_date: date?.from,
        check_out_date: date?.to,
        total_price: totalPrice,
        status: status || 'booked',
      }),
      window.api.updateRoom({
        id: roomId,
        updates: { status: status || 'booked' },
      }),
    ]);
    return booking; // Return the booking for further use
  } catch (error) {
    console.log('error from add booking:', error);
    const error_message = errorMessage(error);
    showToast('error', error_message);
  }
};

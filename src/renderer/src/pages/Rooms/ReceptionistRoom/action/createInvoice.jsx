import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';
import calculateVAT from '@/utils/calculateVAT';
import { showToast } from '@/utils/toastHelper';

export const createInvoice = async (booking, room, totalPrice) => {
  try {
    console.log('booking:', booking);
    const invoice = await window.api.addInvoice({
      booking_id: booking?.id,
      total_amount: totalPrice,
      net_amount: Number(totalPrice) + calculateVAT(totalPrice),
    });
    console.log('room:', room);
    const invoiceItem = await window.api.addInvoiceItem({
      invoice_id: invoice.id,
      service_type: 'room',
      service_id: room?.id,
      quantity: 1,
      unit_price: room?.base_price,
      total_price: totalPrice,
    });
    return { invoice, invoiceItem };
  } catch (error) {
    console.log('error:', error);
    const error_message = errorMessage(error);
    showToast('error', error_message);
    return;
  }
};

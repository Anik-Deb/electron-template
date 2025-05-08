/* eslint-disable react/prop-types */
import DrawerBody from '@/components/Common/Drawer/DrawerBody';
import TriggerDrawer from '@/components/Common/Drawer/TriggerDrawer';
import { Drawer } from '@/components/ui/drawer';
import fetchInvoice from '@/utils/fetchInvoice';
import React from 'react';
import CheckoutFooter from './components/CheckoutFooter';
import Invoice from './components/Invoice';
import PaymentMethods from './components/PaymentMethod';
import SummarySection from './components/SummarySection';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';
import { showToast } from '@/utils/toastHelper';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ room }) {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [paymentDetails, setPaymentDetails] = React.useState(null);
  const [invoice, setInvoice] = React.useState({});
  const [paymentMethods, setPaymentMethods] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // const invoice = await window.api.getInvoice({
        //   booking_id: room?.booking?.id,
        // });
        const invoice = await fetchInvoice({ booking_id: room?.booking?.id });
        setInvoice(invoice);
      } catch (error) {
        console.log(`Room ${room?.room_number} has no active booking`);
      }
    };
    fetchData();
  }, []);

  // calculation
  const { invoiceItems = [], vat_amount = 0, discount = 0 } = invoice || {};
  const subtotal = invoiceItems.reduce(
    (acc, { total_price = 0 }) => acc + parseFloat(total_price),
    0
  );
  // invoice summary
  const invoiceSummary = {
    invoiceItems,
    subtotal,
    discountAmount: parseFloat(discount),
    vatAmount: parseFloat(vat_amount),
    netAmount: subtotal - parseFloat(discount) + parseFloat(vat_amount),
  };
  // payment success
  const handlePaymentSuccess = (details) => {
    setPaymentDetails(details);
    setPaymentSuccess(true);
    setIsDrawerOpen(false);
  };

  /**
   * This function responsible for
   * 1. Room Status ('available')
   * 2. Booking status ('checked_out')
   * 3. Update booking checkout_date to Today
   * 4. Invoice Status ('paid')
   * 
   * 5. Update pos machine payment amount
   * 6. Add Vat + Tax entry against this booking user
   * 
   */
  const handleConfirmPayment = async () => {
    try {
      const roomData = {
        id: room?.id,
        updates: {
          status: 'available',
        },
      };
      const bookingData = {
        id: room?.booking?.id,
        updates: {
          status: 'checked_out',
          check_out_date: new Date(),
        },
      };
      const invoiceData = {
        id: invoice?.id,
        updates: {
          status: 'paid',
        },
      };

      const updateRoomPromise = window.api.updateRoom(roomData);
      const updateBookingPromise = window.api.updateBooking(bookingData);
      const updateInvoicePromise = window.api.updateInvoice(invoiceData);

      const result = await Promise.all([
        updateRoomPromise,
        updateBookingPromise,
        updateInvoicePromise,
      ]);

      console.log('result:', result);

      const details = { paymentMethods };
      handlePaymentSuccess(details);
    } catch (error) {
      const error_message = errorMessage(error);
      showToast('error', error_message);
    }
  };

  const handleCloseInvoice = () => {
    setPaymentSuccess(false);
  };

  return (
    <Drawer direction="right">
      <TriggerDrawer
        onClick={() => setIsDrawerOpen(true)}
        className="border text-center border-gray-100 hover:bg-gray-100 h-9 "
      >
        Checkout
      </TriggerDrawer>
      {isDrawerOpen && (
        <DrawerBody
          onClick={(e) => e.stopPropagation()}
          title={
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-lg font-semibold text-gray-700">
                Checkout (Room: {room?.room_number})
              </div>
            </div>
          }
        >
          {/* Scrollable Content */}
          <div className="flex flex-col gap-4">
            <SummarySection invoiceSummary={invoiceSummary} />
            <PaymentMethods
              paymentMethods={paymentMethods}
              setPaymentMethods={setPaymentMethods}
            />
            <CheckoutFooter
              setIsDrawerOpen={setIsDrawerOpen}
              handleConfirmPayment={handleConfirmPayment}
            />
          </div>
        </DrawerBody>
      )}
      {/* Invoice Dialog */}
      {paymentSuccess && (
        <Invoice
          invoiceSummary={invoiceSummary}
          paymentDetails={paymentDetails}
          onClose={handleCloseInvoice}
        />
      )}
    </Drawer>
  );
}

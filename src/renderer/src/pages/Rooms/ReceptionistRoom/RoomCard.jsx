import { DatePickerWithRange } from '@/components/Common/DatePickerWithRange/DatePickerWithRange';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays } from 'date-fns';
import { PencilLine } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import Checkout from './Checkout/Checkout';
import CheckedIn from './components/RoomStatusChanged/CheckedIn';
import BookingCancel from './components/RoomStatusChanged/BookingCancel';
import RoomMaintenance from './components/RoomStatusChanged/RoomMaintenance';
import RoomAvailable from './components/RoomStatusChanged/RoomAvailable';

const RoomCard = ({ room }) => {
  console.log('room:', room);
  // State to manage the selected date range for booking
  const [date, setDate] = React.useState({
    from: new Date(room?.booking?.check_in_date || new Date()),
    to: new Date(room?.booking?.check_out_date || addDays(new Date(), 2)),
  });
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  // Define styles for different room statuses
  const statusStyles = {
    available: 'secondary',
    checked: 'bg-light-green text-green',
    maintenance: 'bg-destructive-foreground text-destructive border-none',
    booked: 'bg-light-yellow text-yellow border-none',
  };

  const statusTextStyles = {
    checked: 'text-green',
    maintenance: 'text-destructive',
    booked: 'text-yellow',
  };

  // Component to display room status as a badge
  const StatusBadge = ({ status }) => (
    <Badge
      variant={status === 'available' ? statusStyles[status] : undefined}
      className={cn(statusStyles[status], 'rounded capitalize')}
    >
      {status}
    </Badge>
  );

  // Component to display booking information, including the user's name and booking dates
  const BookingInfo = () => (
    <div className="flex flex-col items-center gap-0.5 text-sm text-gray-600">
      <div className="capitalize font-semibold flex items-center gap-1">
        <span>
          {room?.booking?.user?.first_name} {room?.booking?.user?.last_name}
        </span>
        <Link
          to={`/rooms/edit-booking/${room?.id}`}
          className="p-0 size-fit hover:bg-transparent"
        >
          <PencilLine className="size-3" />
        </Link>
      </div>
      <DatePickerWithRange
        date={date}
        setDate={setDate}
        popoverOpen={popoverOpen}
        setPopoverOpen={setPopoverOpen}
        buttonClassName="w-auto hover:bg-transparent h-fit p-0 text-xs"
        buttonVariant="transparent"
      />
    </div>
  );

  return (
    <Card className="flex-1 border border-gray-100 rounded-lg shadow-none hover:shadow-sm">
      <div className="p-4 space-y-5">
        {/* Room type and status display */}
        <div className="flex justify-between text-sm text-gray-500">
          <span className="capitalize">{room?.type_name}</span>
          <StatusBadge status={room?.status} />
        </div>
        {/* Room number display */}
        <div
          className={cn(
            'text-[32px] font-bold text-center text-gray-800 my-2',
            statusTextStyles[room?.status]
          )}
        >
          {room?.room_number}
        </div>
      </div>
      {/* Card content for room actions based on status */}
      <CardContent className="space-y-2 border-t p-4">
        {room?.status === 'available' && (
          <>
            <Link to={`/rooms/add-booking/${room?.id}`}>
              <Button
                variant="outline"
                className="w-full flex justify-center hover:bg-gray-50 hover:border-gray-50 gap-1"
              >
                <CalendarIcon className="w-4 h-4" /> Add Booking
              </Button>
            </Link>
            <div className="flex flex-col lg:flex-col xl:flex-row gap-2">
              <RoomMaintenance room={room} />
              <Link to={`/rooms/add-checkedin/${room?.id}`}>
                <Button
                  variant="outline"
                  className="w-full flex justify-center hover:bg-gray-50 hover:border-gray-50 gap-1"
                >
                  Checked In
                </Button>
              </Link>
            </div>
          </>
        )}
        {room?.status === 'checked' && (
          <>
            <BookingInfo />
            <div className="flex flex-col lg:flex-col xl:flex-row gap-2">
              {/* <UseService room={room} /> */}
              <Link to={`/rooms/${room?.id}/add-service`}>
                <Button
                  variant="outline"
                  className="w-full flex justify-center hover:bg-gray-50 hover:border-gray-50 gap-1"
                >
                  Add Service
                </Button>
              </Link>
              {/* Checkout  */}
              <Checkout room={room} booking={room?.booking} />
            </div>
            {/* <ActionButtons
              buttons={[{ label: 'Add Service' }, { label: 'Checkout' }]}
            /> */}
          </>
        )}
        {room?.status === 'booked' && (
          <>
            <BookingInfo />
            <div className="flex flex-col lg:flex-col xl:flex-row gap-2">
              <BookingCancel room={room} />
              <CheckedIn room={room} />
            </div>
          </>
        )}
        {room?.status === 'maintenance' && (
          <>
            <p className="text-gray-400 text-[14px] text-center">
              Room is under maintenance.
            </p>
            <RoomAvailable className="w-full" room={room} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RoomCard;

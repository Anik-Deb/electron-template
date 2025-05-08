import React from 'react';
import RoomList from './components/RoomList';
import { columns } from './components/Columns';
import { useAuth } from '@/Context/AuthProvider';
import ReceptionistRoom from './ReceptionistRoom/ReceptionistRoom';
import Loading from '@/components/Common/Loading';
const dami_room = [
  {
    id: 1,
    room_number: 501,
    status: 'available',
    type_name: 'standard',
  },
  {
    id: 2,
    room_number: 506,
    status: 'checked',
    type_name: 'standard',
    booking: {
      id: 1,
      status: 'checked',
      check_in_date: '20-10-25',
      check_out_date: '22-10-25',
      user: {
        first_name: 'mokhlesur',
        last_name: 'Rahman',
        email: 'mokhles.xponent@gmail.com',
      },
    },
  },
  {
    id: 3,
    room_number: 507,
    status: 'booked',
    type_name: 'standard',
    booking: {
      id: 2,
      status: 'booked',
      check_in_date: '20-10-25',
      check_out_date: '22-10-25',
      user: {
        first_name: 'Anik',
        last_name: 'Nath',
        email: 'anik.xponent@gmail.com',
      },
    },
  },
  {
    id: 4,
    room_number: 605,
    status: 'maintenance',
    type_name: 'standard',
  },
  {
    id: 5,
    room_number: 606,
    status: 'available',
    type_name: 'standard',
  },
  {
    id: 6,
    room_number: 505,
    status: 'available',
    type_name: 'standard',
  },
  {
    id: 7,
    room_number: 705,
    status: 'available',
    type_name: 'standard',
  },
  {
    id: 8,
    room_number: 405,
    status: 'available',
    type_name: 'standard',
  },
];
const Rooms = () => {
  const { authState } = useAuth();
  // const [rooms, setRooms] = React.useState(dami_room||[]);
  const [rooms, setRooms] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const rooms = await window.api.getRooms();
        setRooms(rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  // Is Admin checked
  const isAdmin = authState?.user?.role == 'admin';

  // if (isLoading) {
  //   return <Loading />; // You can replace this with a proper loading spinner
  // }

  // return isAdmin ? (
  //   <RoomList columns={columns} data={rooms}/>
  // ) : (
  //   <ReceptionistRoom data={rooms} />
  // );
  return <ReceptionistRoom data={rooms} />;
};

export default Rooms;

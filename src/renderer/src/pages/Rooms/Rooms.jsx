import React from 'react';
import ReceptionistRoom from './ReceptionistRoom/ReceptionistRoom';

const Rooms = () => {
  const [rooms, setRooms] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const rooms = await window.api.getRooms();
        setRooms(rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchData();
  }, []);
  // Is Admin checked
  return <ReceptionistRoom data={rooms} />;
};

export default Rooms;

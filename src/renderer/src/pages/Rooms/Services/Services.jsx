import React, { useEffect, useState } from 'react';
import ServicesList from './components/ServicesList';
import { columns } from './components/Columns';

export default function Services() {
  const [roomServices, setRoomServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomServices = await window.api.getServices();
        // console.log(roomServices)
        setRoomServices(roomServices);
      } catch (error) {
        console.error('Error fetching room services:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <ServicesList
      setRoomServices={setRoomServices}
      columns={columns}
      data={roomServices}
    />
  );
}

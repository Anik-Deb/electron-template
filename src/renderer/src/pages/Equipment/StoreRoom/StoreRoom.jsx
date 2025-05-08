import React from 'react';
import StoreRoomList from './components/StoreRoomList';
import { columns } from './components/Columns';

const StoreRoom = () => {
  const [storeRoomData, setStoreRoomData] = React.useState([]);

  const dummyData = [
    {
      id: 1,
      itemName: 'Laundry Detergent',
      category: 'Cleaning Supplies',
      quantity: 20,
      unitPrice: 15.0,
      totalValue: 300.0,
      supplier: 'Clean Solutions Co.',
      location: 'Shelf A1',
      dateReceived: '2025-01-01',
      expirationDate: '2026-01-01',
      notes: 'Store in a cool, dry place.',
    },
    {
      id: 2,
      itemName: 'Towels (Set of 2)',
      category: 'Room Supplies',
      quantity: 50,
      unitPrice: 25.0,
      totalValue: 1250.0,
      supplier: 'Hotel Essentials',
      location: 'Shelf B3',
      dateReceived: '2025-01-10',
      expirationDate: 'N/A',
      notes: 'Check for wear and tear monthly.',
    },
  ];

  // const fetchStoreRoomData = async () => {
  //   try {
  //     // Assuming there's a backend API to get the equipment data
  //     const data = await window.api.getStoreRoomData();
  //     setStoreRoomData(data);
  //   } catch (error) {
  //     console.error('Error fetching equipment data:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchStoreRoomData();
  // }, []); 
  return (
    <div>
      <StoreRoomList
        data={dummyData}
        columns={columns}
        setStoreRoomData={setStoreRoomData} // Optional, for dynamic updates to the list
      />
    </div>
  );
};

export default StoreRoom;

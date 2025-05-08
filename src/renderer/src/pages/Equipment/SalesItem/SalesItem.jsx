import React from 'react';
import SalesList from './Components/SalesList';
import { columns } from './Components/Columns';

const SalesItem = () => {
  const [salesItemData, setSalesItemData] = React.useState([]);

  const dummyData = [
    {
      id: 1,
      itemName: 'Deluxe Room Booking',
      category: 'Room Services',
      quantitySold: 2,
      unitPrice: 150.0,
      totalSales: 300.0,
      dateSold: '2025-02-14',
      customer: 'John Doe',
      paymentMethod: 'Credit Card',
      status: 'Completed',
      notes: 'Paid in full, stay from Feb 14 to Feb 16',
    },
    {
      id: 3,
      itemName: 'Buffet Dinner for 2',
      category: 'Restaurant Services',
      quantitySold: 1,
      unitPrice: 50.0,
      totalSales: 50.0,
      dateSold: '2025-02-15',
      customer: 'Robert Brown',
      paymentMethod: 'Credit Card',
      status: 'Completed',
      notes: 'Dinner reservation for Feb 15, table 5',
    },
  ];

  // const fetchSalesItemData = async () => {
  //   try {
  //     // Assuming there's a backend API to get the equipment data
  //     const data = await window.api.getSalesItemData();
  //     setSalesItemData(data);
  //   } catch (error) {
  //     console.error('Error fetching equipment data:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchSalesItemData();
  // }, []);
  return (
    <div>
      <SalesList
        data={dummyData}
        columns={columns}
        setSalesItemData={setSalesItemData} // Optional, for dynamic updates to the list
      />
    </div>
  );
};

export default SalesItem;

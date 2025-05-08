import { useState } from 'react';
import { columns } from './components/Columns';
import InventoryList from './components/InventoryList';
import React from 'react';

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState([]);

  const dummyData = [
    {
      id: 1,
      name: 'Room 101 Bed Linen Set',
      category: 'Room Supplies',
      quantity: 10,
      unitPrice: 25.5,
      lastRestocked: '2025-02-01',
      supplier: 'Hotel Supplies Co.',
    },
    {
      id: 2,
      name: 'Towels - Set of 4',
      category: 'Bathroom Supplies',
      quantity: 50,
      unitPrice: 15.0,
      lastRestocked: '2025-02-05',
      supplier: 'CleanTowel Suppliers',
    },
    {
      id: 3,
      name: 'Mini Fridge - 100L',
      category: 'Room Equipment',
      quantity: 15,
      unitPrice: 150.0,
      lastRestocked: '2025-01-25',
      supplier: 'Electro Appliances Ltd.',
    },
    {
      id: 6,
      name: 'Hotel Key Cards',
      category: 'Guest Services',
      quantity: 500,
      unitPrice: 1.0,
      lastRestocked: '2025-02-07',
      supplier: 'KeyCard Systems',
    },
  ];

  const fetchInventoryData = async () => {
    try {
      const data = await window.api.getInventorys();
      setInventoryData(data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  React.useEffect(() => {
    fetchInventoryData();
  }, []);

  console.log('Inventory Data:', inventoryData);

  return (
    <div className="inventory-container">
      <InventoryList
        data={inventoryData}
        columns={columns}
        setInventoryData={setInventoryData}
      />
    </div>
  );
}

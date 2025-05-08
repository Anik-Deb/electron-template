import React, { useEffect, useState } from 'react';
import EquipmentList from './components/EquipmentList';
import { columns } from './components/Columns';

export default function Equipments() {
  const [equipmentData, setEquipmentData] = useState([]);

  const dummyData = [
    {
      id: 1,
      name: 'High-Efficiency Washing Machine',
      category: 'Laundry Equipment',
      quantity: 5,
      unitPrice: 1200.0,
      lastMaintained: '2025-01-10',
      supplier: 'Laundry Tech Solutions',
    },
    {
      id: 2,
      name: 'Commercial Vacuum Cleaner',
      category: 'Cleaning Equipment',
      quantity: 8,
      unitPrice: 350.0,
      lastMaintained: '2025-02-01',
      supplier: 'CleanMaster Supplies',
    },
    {
      id: 3,
      name: 'Portable Projector for Conferences',
      category: 'Audio-Visual Equipment',
      quantity: 4,
      unitPrice: 800.0,
      lastMaintained: '2025-01-25',
      supplier: 'AV Systems Inc.',
    },
  ];

  // const fetchEquipmentData = async () => {
  //   try {
  //     // Assuming there's a backend API to get the equipment data
  //     const data = await window.api.getEquipmentData();
  //     setEquipmentData(data);
  //   } catch (error) {
  //     console.error('Error fetching equipment data:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchEquipmentData();
  // }, []); // Empty dependency array ensures this runs once on mount.

  return (
    <div className="equipment-container">
      <EquipmentList
        data={dummyData}
        columns={columns}
        setEquipmentData={setEquipmentData} // Optional, for dynamic updates to the list
      />
    </div>
  );
}

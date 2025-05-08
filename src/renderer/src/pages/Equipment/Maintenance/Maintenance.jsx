import React from 'react';
import MaintenanceList from './components/MaintenanceList';
import { columns } from './components/Columns';

const Maintenance = () => {
  const [maintenanceData, setMaintenanceData] = React.useState([]);

  const dummyData = [
    {
      id: 1,
      equipmentId: 1, // Refers to 'High-Efficiency Washing Machine'
      equipmentName: 'High-Efficiency Washing Machine',
      maintenanceDate: '2025-01-10',
      maintenanceType: 'General Servicing',
      technician: 'John Doe',
      nextMaintenanceDue: '2025-07-10',
      cost: 150.0,
      notes: 'Replaced water filter and checked drum for wear.',
    },
    {
      id: 2,
      equipmentId: 2, // Refers to 'Commercial Vacuum Cleaner'
      equipmentName: 'Commercial Vacuum Cleaner',
      maintenanceDate: '2025-02-01',
      maintenanceType: 'Filter Replacement',
      technician: 'Jane Smith',
      nextMaintenanceDue: '2025-08-01',
      cost: 50.0,
      notes: 'Replaced HEPA filter and cleaned motor housing.',
    },
    {
      id: 3,
      equipmentId: 3, // Refers to 'Portable Projector for Conferences'
      equipmentName: 'Portable Projector for Conferences',
      maintenanceDate: '2025-01-25',
      maintenanceType: 'Lens Cleaning',
      technician: 'Michael Brown',
      nextMaintenanceDue: '2025-07-25',
      cost: 30.0,
      notes: 'Cleaned lens and checked projector alignment.',
    },
  ];

  // const fetchMaintenanceData = async () => {
  //   try {
  //     // Assuming there's a backend API to get the equipment data
  //     const data = await window.api.getMaintenanceData();
  //     setMaintenanceData(data);
  //   } catch (error) {
  //     console.error('Error fetching equipment data:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchMaintenanceData();
  // }, []); // Empty dependency array ensures this runs once on mount.
  return (
    <div>
      <MaintenanceList
        data={dummyData}
        columns={columns}
        setMaintenanceData={setMaintenanceData} // Optional, for dynamic updates to the list
      />
    </div>
  );
};

export default Maintenance;

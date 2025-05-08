import React from 'react';
import { columns } from './components/Columns';
import StaffList from './components/StaffList';

const Staff = () => {
  const [user, setUser] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const employee = await window.api.getEmployees({ role: 'staff' });
        setUser(employee);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);
  return <StaffList columns={columns} data={user}></StaffList>;
};

export default Staff;

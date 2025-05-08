import React from 'react';
import { columns } from './components/Columns';
import EmployeesList from './components/EmployeesList';

const Employees = () => {
  const [user, setUser] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const employee = await window.api.getEmployees({ role: 'employee' });
        setUser(employee);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  return <EmployeesList columns={columns} data={user}></EmployeesList>;
};

export default Employees;
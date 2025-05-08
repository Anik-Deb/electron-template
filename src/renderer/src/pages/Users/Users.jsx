import React, { useEffect, useState } from 'react';
import UserList from './components/UserList';
import { columns } from './components/Columns';

export default function Users() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await window.api.getUsers();
        setUser(users?.filter((user) => user.password));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);
  return <UserList setUser={setUser} columns={columns} data={user} />;
}

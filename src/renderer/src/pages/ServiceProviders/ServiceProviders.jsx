import React, { useEffect, useState } from 'react';
import ServiceProviderList from './components/ServiceProviderList';
import { columns } from './components/Columns';

export default function ServiceProviders() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const providers = await window.api.getServiceProviders();
        // console.log(providers)
        setProviders(providers);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <ServiceProviderList
      setProviders={setProviders}
      columns={columns}
      data={providers}
    />
  );
}

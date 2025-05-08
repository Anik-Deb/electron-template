import React from 'react';
import DashboardHeader from './component/Dashboard-header';
import OverviewCard from './component/Overview-card';

export default function Dashboard() {
  const [classes, setClasses] = React.useState([]);

  React.useEffect(() => {
    // Fetch Data
    const fetchData = async () => {
    };
    fetchData();
  }, []);
  return (
    <>
      <DashboardHeader />
      <OverviewCard />
    </>
  );
}

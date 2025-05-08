import Loading from '@/components/Common/Loading';
import { Users, Wallet } from 'lucide-react';
import React from 'react';
import Card from './card';
import { Link } from 'react-router-dom';
export default function OverviewCard() {
  const [totalStaff, setTotalStaff] = React.useState([]);
  const [totalMembers, setTotalMembers] = React.useState([]);
  const [duePayment, setDuePayment] = React.useState([]);
  const [totalEarn, setTotalEarn] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      const users = await window.api.getUsers();
      setLoading(false);
    };
    fetchData();
  }, []);

  const summaryData = [
    {
      title: 'Total Earnings',
      count: {
        number: totalEarn,
        isBalance: true,
      },
      redirectUrl: "#",
      analytics: {
        percentage: '',
        description: 'Since last month',
      },
      icon: Wallet,
    },
    {
      title: 'Guest',
      count: {
        number: totalMembers?.length || 0,
        isBalance: false,
      },
      redirectUrl: '#',
      analytics: {
        percentage: '',
        description: 'Since last month',
      },
      icon: Users,
    },
    {
      title: 'Bookings',
      count: {
        number: totalStaff?.length || 0,
        isBalance: false,
      },
      redirectUrl: '#',
      analytics: {
        percentage: '',
        description: 'Since last month',
      },
      icon: Users,
    },
    {
      title: 'Due Payment',
      redirectUrl: '#',
      count: {
        number: duePayment?.length || 0,
        isBalance: false,
      },
      analytics: {
        percentage: '',
        description: 'Since last month',
      },
      icon: '',
    },
  ];

  return !loading ? (
    <div className="flex gap-4 flex-wrap mt-6">
      {summaryData.map((item, index) =>
        item?.redirectUrl ? (
          <Link className="flex-1" to={item?.redirectUrl} key={index}>
            <Card key={index} item={item} />
          </Link>
        ) : (
          <Card key={index} item={item} />
        )
      )}
    </div>
  ) : (
    <Loading />
  );
}

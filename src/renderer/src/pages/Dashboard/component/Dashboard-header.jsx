import React from 'react';
import { RefreshCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageTitle from '@/components/Common/PageTitle';
export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-end pb-2">
      <div className="flex flex-col gap-[0.35em]">
        <PageTitle title="Dashboard" />
        <span className="text-primary-700 text-[15px]">Welcome back</span>
      </div>
    </div>
  );
}

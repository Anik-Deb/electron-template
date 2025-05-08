/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';

export default function RoomInfoCard({ room }) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0 pb-2">
        <p className="text-lg font-semibold">Room Info</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-gray-900">
              Room Number
            </span>
            <span className="text-sm text-gray-500">{room?.room_number}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-gray-900">Status</span>
            <span className="text-sm text-gray-500">{room?.status}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-gray-900">
              Booking Name
            </span>
            <span className="text-sm text-gray-500 capitalize">
              {room?.booking?.user?.first_name} {room?.booking?.user?.last_name}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-gray-900">Phone</span>
            <span className="text-sm text-gray-500">
              {room?.booking?.user?.phone}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

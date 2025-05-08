/* eslint-disable react/prop-types */
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Mail, Phone, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { ModalContent } from '@/components/Common/Modal/ModalContent';

const ViewDetails = ({ details }) => {
  return (
    <ModalContent className="max-w-lg" title="User Details">
      <div className="w-full max-w-md border-0 py-2">
        <CardContent className="space-y-6 p-1">
          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex flex-col col-span-2">
              <span className="text-gray-800 font-semibold text-sm mb-2">
                Email
              </span>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 break-words max-w-full">
                {details.email}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col ">
              <span className="text-gray-800 font-semibold text-sm mb-2">
                Address
              </span>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 break-words max-w-full">
                  {details.address || 'N/A'}
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <span className="text-gray-800 font-semibold text-sm mb-2">
                Phone
              </span>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 break-words max-w-full">
                  {details.phone || 'N/A'}
                </span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="flex flex-col">
              <span className="text-gray-800 font-semibold text-sm mb-2">
                Emergency Contact
              </span>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 break-words max-w-full">
                  {details.emergency_contact_phone || 'N/A'}
                </span>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <span className="text-gray-800 font-semibold text-sm mb-2">
                Date of Birth
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 break-words max-w-full">
                  {details.date_of_birth
                    ? new Date(details.date_of_birth).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            {/* Account Created Date */}
            <div className="flex flex-col">
              <span className="text-gray-800 font-semibold text-sm mb-2">
                Account Created On
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 break-words max-w-full">
                  {new Date(details.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Last Updated Date */}
            <div className="flex flex-col">
              <span className="text-gray-800 font-semibold text-sm mb-2">
                Last Updated On
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 break-words max-w-full">
                  {new Date(details.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </ModalContent>
  );
};

export default ViewDetails;

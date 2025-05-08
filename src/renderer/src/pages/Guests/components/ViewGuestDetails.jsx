/* eslint-disable react/prop-types */
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Phone,
  AlertCircle,
  MapPin,
  Calendar,
  Image,
  Briefcase,
  Globe,
  CreditCard,
} from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import TriggerDrawer from '@/components/Common/Drawer/TriggerDrawer';
import DrawerBody from '@/components/Common/Drawer/DrawerBody';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  DetailItem,
  formatDate,
} from '@/pages/Employees/components/DetailItem';

const ViewGuestDetails = ({ details }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  return (
    <Drawer direction="right" onChange={() => setIsDrawerOpen((prev) => !prev)}>
      <TriggerDrawer
        onClick={() => setIsDrawerOpen(true)}
        className="hover:bg-gray-200 pl-4 h-9"
      >
        View
      </TriggerDrawer>
      {isDrawerOpen && (
        <DropdownMenuItem>
          <DrawerBody
            title={
              <div className="flex items-center gap-3">
                <div className="flex flex-col">Profile</div>
              </div>
            }
          >
            <div className="w-full max-w-md border-0 py-2">
              <CardContent className="space-y-6 p-1">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-2">
                  {details.profile_picture_url ? (
                    <img
                      src={details.profile_picture_url}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 border">
                      <Image className="h-10 w-10 text-gray-500" />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-gray-800">
                    {details.first_name} {details.last_name}
                  </h2>
                  <span className="border rounded-full px-2 text-xs text-gray-500 capitalize">
                    {details.role}
                  </span>
                </div>
                <Separator />

                {/* User Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Email */}
                  <DetailItem icon={Mail} label="Email" value={details.email} />
                  {/* Phone */}
                  <DetailItem
                    icon={Phone}
                    label="Phone"
                    value={details.phone}
                  />
                  {/* Emergency Contact */}
                  <DetailItem
                    icon={AlertCircle}
                    label="Emergency Contact"
                    value={details.emergency_contact_phone}
                  />
                  {/* Address */}
                  <DetailItem
                    icon={MapPin}
                    label="Primary Address"
                    value={details.address}
                  />
                  <DetailItem
                    icon={Phone}
                    label="Secondary Contact"
                    value={details.secondary_contact}
                  />
                  {/* Date of Birth */}
                  <DetailItem
                    icon={Calendar}
                    label="Date of Birth"
                    value={formatDate(details.date_of_birth)}
                  />
                </div>

                {/* Company and Nationality */}
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem
                    icon={Globe} // Assuming a globe icon for nationality
                    label="Nationality"
                    value={details.nationality}
                  />

                  <DetailItem
                    icon={Briefcase} // Assuming a briefcase icon is appropriate for the company
                    label="Company Name"
                    value={details.company_name}
                  />
                  <DetailItem
                    icon={CreditCard} // Assuming an info icon for the bio
                    label="Passport ID"
                    value={details.passportid}
                  />
                </div>

                {/* NID and Passport ID */}
                {/* <div className="space-y-4">
                  {details.nid && (
                    <>
                      <Separator />
                      <h3 className="text-md font-semibold text-gray-800">
                        NID
                      </h3>
                      <img
                        src={details.nid}
                        alt="NID"
                        className="w-full rounded-lg border"
                      />
                    </>
                  )}
                </div> */}
              </CardContent>
            </div>
          </DrawerBody>
        </DropdownMenuItem>
      )}
    </Drawer>
  );
};

export default ViewGuestDetails;

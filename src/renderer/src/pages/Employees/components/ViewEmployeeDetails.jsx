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
  DollarSign,
  Briefcase,
  IdCard,
} from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import TriggerDrawer from '@/components/Common/Drawer/TriggerDrawer';
import DrawerBody from '@/components/Common/Drawer/DrawerBody';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DetailItem, formatDate } from './DetailItem';

const ViewEmployeeDetails = ({ details }) => {
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
                  <h2 className="text-lg font-semibold text-gray-800 capitalize">
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
                    label="Address"
                    value={details.address}
                  />
                  {/* Date of Birth */}
                  <DetailItem
                    icon={Calendar}
                    label="Date of Birth"
                    value={formatDate(details.pass)}
                  />
                  {/* Passport or nid */}
                  <DetailItem
                    icon={IdCard}
                    label="Passport / NID"
                    value={details.nid}
                  />
                  {/* Hire Date */}
                  <DetailItem
                    icon={Calendar}
                    label="Hire Date"
                    value={formatDate(details.hire_date)}
                  />
                  {/* Termination Date */}
                  <DetailItem
                    icon={Calendar}
                    label="Termination Date"
                    value={formatDate(details.termination_date)}
                  />
                  {/* Salary */}
                  <DetailItem label="Salary" value={`TK ${details.salary}`} />
                  {/* Position */}
                  <DetailItem
                    icon={Briefcase}
                    label="Position"
                    value={details.position}
                  />
                  {/* Department */}
                  <DetailItem
                    icon={Briefcase}
                    label="Department"
                    value={details.department}
                  />
                </div>

                <Separator />

                {/* Certifications */}
                <div className="space-y-4">
                  {details.certifications &&
                  details.certifications.length > 0 ? (
                    <>
                      <h3 className="text-md font-semibold text-gray-800">
                        Certifications
                      </h3>
                      {details.certifications.map((cert, index) => (
                        <img
                          key={index}
                          src={cert}
                          alt={`Certification ${index + 1}`}
                          className="w-full rounded-lg border"
                        />
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-500">No certifications found.</p>
                  )}
                </div>
              </CardContent>
            </div>
          </DrawerBody>
        </DropdownMenuItem>
      )}
    </Drawer>
  );
};

export default ViewEmployeeDetails;

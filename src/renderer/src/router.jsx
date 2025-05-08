import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import React from 'react';
import AuthLayout from './AuthLayout';
import MainLayout from './MainLayout';
import AddServerConfiguration from './pages/Auth/AddServerConfiguration/ServerConfiguration';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import Signin from './pages/Auth/Signin/Signin';
import Verify from './pages/Auth/Verify/Verify';
import CreateEmailAccount from './pages/Configure/EmailAccounts/components/CreateEmailAccount';
import EmailAccounts from './pages/Configure/EmailAccounts/EmailAccounts';
import SMSConfigure from './pages/Configure/SMSConfigure/SMSConfigure';
import Dashboard from './pages/Dashboard/Dashboard';
import AddEmployee from './pages/Employees/Employee/AddEmployee';
import EditEmployee from './pages/Employees/Employee/EditEmployee';
import Employees from './pages/Employees/Employee/Employees';
import AddStaff from './pages/Employees/staff/components/AddStaff';
import EditStaff from './pages/Employees/staff/components/EditStaff';
import Staff from './pages/Employees/staff/Staff';
import Equipments from './pages/Equipment/Equipment/Equipments';
import Maintenance from './pages/Equipment/Maintenance/Maintenance';
import SalesItem from './pages/Equipment/SalesItem/SalesItem';
import StoreRoom from './pages/Equipment/StoreRoom/StoreRoom';
import AddGuest from './pages/Guests/AddGuest';
import EditGuest from './pages/Guests/EditGuest';
import Guests from './pages/Guests/Guests';
import Inventory from './pages/Inventory/Inventory';
import AddPosMachine from './pages/PosMachine/AddPosMachine';
import EditPosMachine from './pages/PosMachine/EditPosMachine';
import PosMachine from './pages/PosMachine/PosMachine';
import AddRoom from './pages/Rooms/AddRoom';
import AddAmenities from './pages/Rooms/Amenities/AddAmenities';
import Amenities from './pages/Rooms/Amenities/Amenities';
import EditAmenities from './pages/Rooms/Amenities/EditAmenities';
import EditRoom from './pages/Rooms/EditRoom';
import AddBooking from './pages/Rooms/ReceptionistRoom/AddBooking';
import AddCheckedIn from './pages/Rooms/ReceptionistRoom/AddCheckedIn';
import EditBooking from './pages/Rooms/ReceptionistRoom/EditBooking';
import Rooms from './pages/Rooms/Rooms';
import AddServices from './pages/Rooms/Services/AddServices';
import EditServices from './pages/Rooms/Services/EditServices';
import Services from './pages/Rooms/Services/Services';
import AddServiceProvider from './pages/ServiceProviders/AddServiceProvider';
import EditServiceProvider from './pages/ServiceProviders/EditServiceProvider';
import ServiceProviders from './pages/ServiceProviders/ServiceProviders';
import AddUser from './pages/Users/AddUser';
import EditUser from './pages/Users/EditUser';
import Users from './pages/Users/Users';
import RoomUseService from './pages/Rooms/ReceptionistRoom/UseService/RoomUseService';

export function MainRouter() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Signin Route */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="signin" element={<Signin />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify/:email" element={<Verify />} />
          <Route
            path="server-configuration"
            element={<AddServerConfiguration />}
          />
        </Route>

        {/* Dashboard Route */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/settings" element={<Users />} />

          {/* Users */}
          <Route path="/users" element={<Users />} />
          <Route path="/users/add-user" element={<AddUser />} />
          <Route path="/users/edit-user/:id" element={<EditUser />} />
          {/* Service Providers */}
          <Route path="/providers" element={<ServiceProviders />} />
          <Route
            path="/providers/add-provider"
            element={<AddServiceProvider />}
          />
          <Route
            path="/providers/edit-provider/:id"
            element={<EditServiceProvider />}
          />

          {/* Employees */}
          <Route path="/employees/employees" element={<Employees />} />
          <Route
            path="/employees/employee/add-employee"
            element={<AddEmployee />}
          />
          <Route
            path="/employees/employee/edit-employee/:id"
            element={<EditEmployee />}
          />
          {/* staffs */}
          <Route path="/employees/staffs" element={<Staff />} />
          <Route path="/employees/employee/add-staff" element={<AddStaff />} />
          <Route
            path="/employees/employee/edit-staff/:id"
            element={<EditStaff />}
          />
          {/* Guests */}
          <Route path="/guests" element={<Guests />} />
          <Route path="/guests/add-guest" element={<AddGuest />} />
          <Route path="/guests/edit-guest/:id" element={<EditGuest />} />
          {/* Rooms */}
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/add-room" element={<AddRoom />} />
          <Route path="/rooms/edit-room/:id" element={<EditRoom />} />
          <Route
            path="/rooms/:roomId/add-service"
            element={<RoomUseService />}
          />
          {/* Bookings */}
          <Route path="/rooms/add-booking/:roomId" element={<AddBooking />} />
          <Route path="/rooms/edit-booking/:id" element={<EditBooking />} />
          {/* Checked in */}
          <Route
            path="/rooms/add-checkedin/:roomId"
            element={<AddCheckedIn />}
          />
          {/* Room Amenities */}
          <Route path="/rooms/amenities" element={<Amenities />} />
          <Route
            path="/rooms/amenities/add-amenities"
            element={<AddAmenities />}
          />
          <Route
            path="/rooms/amenities/edit-amenities/:id"
            element={<EditAmenities />}
          />
          {/* Room Services */}
          <Route path="/rooms/services" element={<Services />} />
          <Route
            path="/rooms/services/add-services"
            element={<AddServices />}
          />
          <Route
            path="/rooms/services/edit-services/:id"
            element={<EditServices />}
          />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/add-inventory" element={<Inventory />} />
          <Route path="/inventory/edit-inventory/:id" element={<Inventory />} />
          {/* Equipment */}
          <Route path="/equipment/equipment" element={<Equipments />} />
          <Route
            path="/equipment/equipment/add-equipment"
            element={<Equipments />}
          />
          <Route
            path="/equipment/equipment/edit-equipment/:id"
            element={<Equipments />}
          />
          <Route path="/equipment/maintenance" element={<Maintenance />} />
          <Route path="/equipment/store-room" element={<StoreRoom />} />
          <Route path="/equipment/sales-item" element={<SalesItem />} />
          {/* pos Machine */}
          <Route path="/pos-machine" element={<PosMachine />} />
          <Route path="/pos-machine/add" element={<AddPosMachine />} />
          <Route path="/pos-machine/edit/:id" element={<EditPosMachine />} />
          {/* checkout */}

          {/* SMS Configuration */}
          <Route path="/email-accounts" element={<EmailAccounts />} />
          <Route
            path="/email-accounts/add-email-accounts"
            element={<CreateEmailAccount />}
          />
          <Route path="/sms-configurations" element={<SMSConfigure />} />
        </Route>
      </Routes>
    </Router>
  );
}

import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import React from 'react';
import AuthLayout from './AuthLayout';
import MainLayout from './MainLayout';
import AddServerConfiguration from './pages/Auth/AddServerConfiguration/ServerConfiguration';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import Signin from './pages/Auth/Signin/Signin';
import Verify from './pages/Auth/Verify/Verify';
import Dashboard from './pages/Dashboard/Dashboard';
import AddRoom from './pages/Rooms/AddRoom';
import EditRoom from './pages/Rooms/EditRoom';
import Rooms from './pages/Rooms/Rooms';
import AddServices from './pages/Rooms/Services/AddServices';
import EditServices from './pages/Rooms/Services/EditServices';
import Services from './pages/Rooms/Services/Services';
import AddUser from './pages/Users/AddUser';
import EditUser from './pages/Users/EditUser';
import Users from './pages/Users/Users';

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
          {/* Rooms */}
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/add-room" element={<AddRoom />} />
          <Route path="/rooms/edit-room/:id" element={<EditRoom />} />
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
        </Route>
      </Routes>
    </Router>
  );
}

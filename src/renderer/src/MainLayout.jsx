import { DraggableTopBar } from '@/components';
import {  UserRoundCog, Warehouse } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Common/Headers';
import Sidebar from './components/Common/Sidebar/Sidebar';
import DocumentTextIcon from './components/Icons/DocumentTextIcon';
import { useAuth } from './Context/AuthProvider';
import React from 'react';

const navigation = [
  {
    name: 'Dashboard',
    icon: DocumentTextIcon,
    href: '/',
    current: true,
  },
  {
    name: 'Admin',
    href: '#',
    icon: UserRoundCog,
    current: true,
    dropdown: [
      { name: 'Users', href: '/users', current: false },
      { name: 'Server Configuration', href: '#', current: false },
    ],
  },
  {
    name: 'Rooms',
    href: '#',
    icon: Warehouse,
    current: false,
    dropdown: [
      { name: 'Services', href: '/rooms/services', current: false },
      { name: 'Room', href: '/rooms' },
    ],
  },
];

export default function MainLayout() {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const userNavigation = [{ name: 'Your profile', href: '#' }];
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);
  const [isCollapseClicked, setIsCollapseClicked] = useState(false);

  useEffect(() => {
    if (!authState?.isLoggedIn) {
      navigate('/signin');
    }
  }, [authState?.isLoggedIn]);

  return (
    <>
      <DraggableTopBar />
      <div>
        <Sidebar
          isCollapse={isCollapse}
          setIsCollapse={setIsCollapse}
          isCollapseClicked={isCollapseClicked}
          setIsCollapseClicked={setIsCollapseClicked}
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
          authState={authState}
          navigation={navigation}
        />

        <div className={isCollapse ? 'sm:pl-11' : 'sm:pl-[17rem]'}>
          <Header
            isOpenSidebar={isOpenSidebar}
            setIsOpenSidebar={setIsOpenSidebar}
            isOpenUserMenu={isOpenUserMenu}
            setIsOpenUserMenu={setIsOpenUserMenu}
            userNavigation={userNavigation}
            authState={authState}
          />

          <main className="min-h-[93vh] overflow-hidden bg-background p-5">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

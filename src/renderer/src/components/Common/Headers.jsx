import { useAuth } from '@/Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import avatar from '../../assets/user.jpg';
import emptyUser from '../../assets/empty-avatar.png';
import Bar3Icon from '../Icons/Bar3Icon';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const notifications = {
  today: [
    {
      title: 'Notification title goes here',
      subTitle: 'Subtitle goes here in a line to describe',
      status: 'done',
    },
    {
      title: 'Notification title goes here',
      subTitle: 'Subtitle goes here in a line to describe',
      status: 'info',
    },
    {
      title: 'Notification title goes here',
      subTitle: 'Subtitle goes here in a line to describe',
      status: 'warning',
    },
  ],
  yesterday: [
    {
      title: 'Notification title goes here',
      subTitle: 'Subtitle goes here in a line to describe',
      status: 'warning',
    },
    {
      title: 'Notification title goes here',
      subTitle: 'Subtitle goes here in a line to describe',
      status: 'done',
    },
  ],
};

export default function Header({
  isOpenSidebar,
  setIsOpenSidebar,
  isOpenUserMenu,
  setIsOpenUserMenu,
  userNavigation,
  //   user
}) {
  const { logout, authState } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = () => {
    try {
      logout();
      navigate('/signin');
    } catch (error) {
      // // console.log('error from logout time:', error);
    }
  };
  // console.log('user state:', authState);
  return (
    <div className="border-b px-4 sm:px-4 lg:px-5">
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 sm:gap-x-6">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => {
            setIsOpenSidebar(!isOpenSidebar);
          }}
        >
          <span className="sr-only">Open sidebar</span>
          <Bar3Icon className="size-6" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-muted lg:hidden" aria-hidden="true" />
        <div className="flex flex-1 justify-end gap-x-4 lg:gap-x-6">
          <div className="relative flex items-center gap-x-4 lg:gap-x-5">
            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="-m-1.5 flex items-center p-1.5 cursor-pointer">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex gap-2 items-center">
                    <figure className="h-10 w-10 rounded-full border">
                      <img
                        className="size-full rounded-full"
                        src={emptyUser} // Replace with your avatar source
                        alt="avatar"
                      />
                    </figure>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32">
                {/* Dropdown menu items */}
                <DropdownMenuItem
                  onClick={logoutHandler}
                  className="cursor-pointer text-dark opacity-85 hover:bg-gray-100 px-3 py-1 text-[13px] leading-6"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

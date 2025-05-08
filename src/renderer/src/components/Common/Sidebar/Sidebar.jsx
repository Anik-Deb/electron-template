/* eslint-disable react/prop-types */
import React from 'react';
import { PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import MobileDropdown from './MobileDropdown';
import Dropdown from './Dropdown';
import { cn } from '@/utils';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
export default function Sidebar({
  isOpenSidebar,
  setIsOpenSidebar,
  navigation,
  authState,
  isCollapse,
  setIsCollapse,
  setIsCollapseClicked,
}) {
  const { pathname } = useLocation();

  return (
    <>
      {/* /////////////// sidebar for mobile ////////////////// */}
      <div className={!isOpenSidebar ? 'block' : 'hidden'}>
        <div className="relative z-50 overflow-y-auto sm:hidden text-white-text">
          <div className="fixed inset-0 flex">
            {/* <div className="w-full max-w-[280px] "> */}

            <div className="w-full flex flex-col bg-white">
              <div className="relative mr-16 flex grow w-full">
                {/* Sidebar component */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto pb-4">
                  <nav className="flex flex-1 flex-col">
                    <div
                      // className={`font-semibold text-lg border-b h-16 pt-5 pb-2 flex items-center px-4  gap-6 justify-between`}
                      className={`font-semibold h-16 border-b text-lg flex items-center mx-3 gap-6 justify-between`}
                    >
                      {/* Logo */}
                      <div className="text-xl font-semibold text-center">
                        Logo
                      </div>
                      {/* collapsebar */}
                      <div
                        onClick={() => setIsOpenSidebar(!isOpenSidebar)}
                        className={`${isCollapse && ''} cursor-pointer group`}
                      >
                        {isCollapse ? (
                          <div>
                            <PanelLeftOpen className="size-4 lg:size-5 stroke-primary-600 relative top-[2px]" />
                          </div>
                        ) : (
                          <PanelLeftClose className="size-4 lg:size-5 stroke-primary-600 relative top-[2px]" />
                        )}
                      </div>
                    </div>
                    <ul
                      role="list"
                      className={`flex flex-1 mt-5 flex-col gap-y-7 text-sm`}
                    >
                      <li>
                        <ul role="list" className="space-y-1 px-2">
                          {navigation.map((item) =>
                            !item.accessibleRole ||
                            item.accessibleRole === authState?.user?.role ? (
                              <li key={item.name}>
                                {!item.dropdown ? (
                                  <NavLink
                                    onClick={() => setIsCollapseClicked(false)}
                                    title={item.name}
                                    to={item.href}
                                    className={cn(`border border-transparent ${pathname === item.href ? `bg-primary-50 border-border text-primary-600 font-bold` : 'text-colorVariant-heading'}
                          group flex rounded items-center py-2 text-[13px] leading-6 focus-visible:outline-none ${isCollapse ? 'px-2 justify-center' : 'pl-1.5 pr-2'}
                        `)}
                                  >
                                    {!item.dropdown && item.icon && (
                                      <>
                                        <item.icon
                                          className={`${pathname === item.href ? 'stroke-primary-600' : 'stroke-colorVariant-heading'} stroke-[1px] shrink-0 size-4 lg:size-5`}
                                        />
                                        <span className="ml-2 flex-1">
                                          {item.name}
                                        </span>
                                      </>
                                    )}
                                  </NavLink>
                                ) : (
                                  /* Drop Down Item */
                                  <MobileDropdown
                                    item={item}
                                    pathname={pathname}
                                    setIsCollapse={setIsCollapse}
                                    isCollapse={isCollapse}
                                  />
                                )}
                              </li>
                            ) : null
                          )}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              {/* Setting Mobile */}
              <ul className="list-none p-3.5">
                <li>
                  <NavLink
                    onClick={() => setIsCollapseClicked(false)}
                    to={'/settings'}
                    className={cn(`border border-transparent ${pathname === '/settings' ? `${!isCollapse && 'bg-primary-50 border-border'} text-primary-600 font-bold` : 'text-colorVariant-heading'}
        group flex items-center gap-2 text-sm rounded py-2 text-[13px] leading-6 focus-visible:outline-none ${isCollapse ? 'px-2 justify-center' : 'pl-1.5 pr-2'}
      `)}
                  >
                    <Settings
                      className={`${pathname === '/settings' ? 'stroke-primary-600' : 'stroke-colorVariant-heading'} stroke-[1px] shrink-0 size-4 lg:size-5`}
                    />
                    {!isCollapse && <span>Settings</span>}
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* /////////////// Static sidebar for desktop /////////////// */}
      <div
        className={`hidden sm:fixed sm:inset-y-0 sm:z-40 sm:flex sm:flex-col border-r border-border ${isCollapse ? 'sm:w-11' : 'sm:w-[17rem]'}`}
        // style={{ boxShadow: 'inset -3px 0 10px -5px rgba(0, 0, 0, 0.1)' }}
      >
        {/* Sidebar component */}
        <div className="flex grow flex-col overflow-y-auto gap-y-5">
          <nav
            className={`nav-y-auto flex flex-1 flex-col text-white-text ${isCollapse && 'mx-1'} `}
          >
            <div
              className={`font-semibold h-16 border-b text-lg flex items-center ${isCollapse ? 'mx-1 justify-center' : 'mx-3.5 gap-6 justify-between'}`}
            >
              {/* Logo */}
              {!isCollapse && (
                <span className="text-xl font-semibold text-center">
                  Logo
                  {/* <img className="w-[8rem] h-auto" src={logo} alt="main logo" /> */}
                </span>
              )}

              {/* collapsebar */}
              <div
                onClick={() => {
                  setIsCollapseClicked(true);
                  setIsCollapse(!isCollapse);
                }}
                className={`${isCollapse && ''} cursor-pointer group`}
              >
                {isCollapse ? (
                  <div>
                    <PanelLeftOpen className="size-4 lg:size-5 stroke-primary-600 relative top-[2px]" />
                  </div>
                ) : (
                  <PanelLeftClose className="size-4 lg:size-5 stroke-primary-600 relative top-[2px]" />
                )}
              </div>
            </div>
            <ul
              role="list"
              className={`flex flex-1 mt-5 flex-col gap-y-7 text-sm`}
            >
              <li>
                <ul role="list" className="space-y-1 mx-3.5">
                  {navigation.map((item) =>
                    !item.accessibleRole ||
                    item.accessibleRole === authState?.user?.role ? (
                      <li key={item.name}>
                        {!item.dropdown ? (
                          /* Without Dropdown Item */
                          <NavLink
                            onClick={() => setIsCollapseClicked(false)}
                            title={item.name}
                            to={item.href}
                            className={cn(`border border-transparent ${pathname === item.href ? `${!isCollapse && 'bg-primary-50 border-border'} text-primary-600 font-bold` : 'text-colorVariant-heading'}
        group flex items-center rounded py-2 text-[13px] leading-6 focus-visible:outline-none ${isCollapse ? 'px-2 justify-center' : 'pl-1.5 pr-2'}
      `)}
                          >
                            {!item.dropdown && item.icon && (
                              <>
                                <item.icon
                                  className={`${pathname === item.href ? 'stroke-primary-600' : 'stroke-colorVariant-heading'} stroke-[1px] shrink-0 size-4 lg:size-5`}
                                />
                                {!isCollapse && (
                                  <span className="ml-2 flex-1">
                                    {item.name}
                                  </span>
                                )}
                              </>
                            )}
                          </NavLink>
                        ) : (
                          /* Drop Down Item */
                          <Dropdown
                            item={item}
                            pathname={pathname}
                            setIsCollapse={setIsCollapse}
                            isCollapse={isCollapse}
                          />
                        )}
                      </li>
                    ) : null
                  )}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
        {/* Setting Desktop */}
        <ul className="list-none p-3.5">
          <li>
            <NavLink
              onClick={() => setIsCollapseClicked(false)}
              to={'/settings'}
              className={cn(`border border-transparent ${pathname === '/settings' ? `${!isCollapse && 'bg-primary-50 border-border'} text-primary-600 font-bold` : 'text-colorVariant-heading'}
        group flex items-center gap-2 text-sm rounded py-2 text-[13px] leading-6 focus-visible:outline-none ${isCollapse ? 'px-2 justify-center' : 'pl-1.5 pr-2'}
      `)}
            >
              <Settings
                className={`${pathname === '/settings' ? 'stroke-primary-600' : 'stroke-colorVariant-heading'} stroke-[1px] shrink-0 size-4 lg:size-5`}
              />
              {!isCollapse && <span>Settings</span>}
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

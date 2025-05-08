import { cn } from '@/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Dropdown({
  item,
  className,
  dropdownClassName,
  setIsCollapse,
  isCollapse,
  pathname,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const dropdownHandler = () => {
    setIsCollapse(false);
    setIsDropdownOpen((prev) => !prev);
  };


  const isActive = (item) =>
    pathname === item.href || item.dropdown?.some(({ href }) => pathname === href);

  return (
    <>
      <NavLink
        onClick={() => dropdownHandler()}
        title={item.name}
        to={item.href}
        className={cn(
          `${isActive(item) ? `border border-transparent ${!isCollapse && 'bg-primary-50 border-border'} text-primary-600 font-bold` : 'text-colorVariant-heading'}
        group flex items-center rounded py-2 text-[13px] leading-6 focus-visible:outline-none ${isCollapse ? 'px-2 justify-center' : 'pl-1.5 pr-2'}
      `,
          className
        )}
      >
        <item.icon
          className={`${isActive(item) ? 'stroke-primary-600' : 'stroke-colorVariant-heading'} stroke-[1px] shrink-0 size-4 lg:size-5`}
          aria-hidden="true"
        />
        {!isCollapse && (
          <div className="flex-1 flex items-center">
            <span className="ml-2 flex-1">{isCollapse || item.name}</span>
            <div className="w-4 ">
              {!isDropdownOpen && !isCollapse && (
                <ChevronRight
                  className={cn(
                    'size-4 ',
                    isActive(item)
                      ? 'stroke-text-primary-600'
                      : 'stroke-colorVariant-heading'
                  )}
                />
              )}
              {isDropdownOpen && !isCollapse && (
                <ChevronDown className={cn(
                  'size-4 ',
                  isActive(item)
                    ? 'stroke-text-primary-600'
                    : 'stroke-colorVariant-heading'
                )} />
              )}
            </div>
          </div>
        )}
      </NavLink>

      {/* Dropdown items */}
      {isDropdownOpen &&
        !isCollapse &&
        item.dropdown?.map((dropdownItem, index) => (
          <div key={index}>
            <NavLink
              to={dropdownItem.href}
              className={cn(
                `${
                  pathname === dropdownItem.href
                    ? `text-primary-600 font-bold`
                    : 'text-colorVariant-heading'
                } group flex items-center rounded gap-x-2 py-1 text-[13px] leading-6 focus-visible:outline-none ${isCollapse ? 'px-2 justify-center' : 'pl-[2.25rem] pr-2'}`,
                dropdownClassName
              )}
            >
              {dropdownItem.name}
            </NavLink>
          </div>
        ))}
    </>
  );
}

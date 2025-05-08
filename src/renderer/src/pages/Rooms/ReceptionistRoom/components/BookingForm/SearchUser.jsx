import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils';
import { LoaderCircle, Plus, Search } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const SearchUser = ({
  searchedGuest,
  isLoading,
  handleSearch,
  setSearchingNumber,
  setPopoverOpen,
  handleGuest,
}) => (
  <Popover>
    <div className="flex-1 flex p-4 border-b">
      <div className="flex-1 flex flex-col gap-0">
        <Input
          onChange={(e) => setSearchingNumber(e.target.value)}
          type="number"
          className={cn(
            !searchedGuest && 'border-destructive-600',
            'h-9 block bg-transparent text-xs font-normal text-gray-600 hover:border-paragraph focus:border-primary focus-visible:ring-0 rounded-r-none'
          )}
          placeholder="Search a Guest with number"
        />
      </div>
      <PopoverTrigger asChild>
        <div
          onClick={handleSearch}
          className="h-9 px-3 cursor-pointer bg-primary hover:bg-primary-600 flex items-center"
        >
          <Search className="w-4 h-4 stroke-gray-300" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(searchedGuest ? 'w-80' : 'w-fit', 'bg-white p-4')}
      >
        {!isLoading ? (
          searchedGuest ? (
            <UserInfo
              searchedGuest={searchedGuest}
              setPopoverOpen={setPopoverOpen}
              handleGuest={handleGuest}
            />
          ) : (
            <p className="mt-2 text-paragraph text-sm text-center">
              There is no Staff with this number
            </p>
          )
        ) : (
          <LoaderCircle className="animate-spin" />
        )}
      </PopoverContent>
      <AddGuestButton />
    </div>
  </Popover>
);

const UserInfo = ({ searchedGuest, setPopoverOpen, handleGuest }) => (
  <div className="flex flex-col gap-4 mt-4">
    <UserDetail
      label="Guest"
      value={`${searchedGuest.first_name} ${searchedGuest.last_name}`}
    />
    <UserDetail label="Email" value={searchedGuest.email} />
    <div className="flex justify-end gap-3">
      <Button
        onClick={() => setPopoverOpen(false)}
        variant="cancel"
        className="h-9"
      >
        Cancel
      </Button>
      <Button
        onClick={handleGuest}
        variant="default"
        className="h-9 hover:bg-primary-600"
      >
        Select
      </Button>
    </div>
  </div>
);

const UserDetail = ({ label, value }) => (
  <div className="flex items-center gap-8">
    <p className="w-8 text-[13px] text-subHeading">{label}</p>
    <div className="flex-1 border rounded px-2 py-1">
      <span className="text-[13px] text-paragraph">{value}</span>
    </div>
  </div>
);

const AddGuestButton = () => (
  <div className="sm:w-[40px] ml-2">
    <Link to="/guests/add-guest">
      <div className="h-9 px-3 flex items-center justify-center bg-primary-500 hover:bg-primary-600 rounded text-white">
        <Plus className="size-4 stroke-gray hover:stroke-gray-600" />
      </div>
    </Link>
  </div>
);

export default SearchUser;

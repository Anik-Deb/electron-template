import PageTitle from '@/components/Common/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCcw, Search } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import RoomCard from './RoomCard';
import FilterRooms from './FilterRooms';
import EmptyComponent from '@/pages/Users/components/empty';
// import { ReloadIcon } from '@radix-ui/react-icons';

export default function ReceptionistRoom({ data }) {
  const [filterData, setFilterData] = React.useState([]);
  React.useEffect(() => {
    setFilterData(data); // Update filterData when data changes
  }, [data]);
  return (
    <div className="w-full">
      <div className={`flex justify-between items-end`}>
        <PageTitle title="All Rooms" />
        <div className="flex items-center gap-4">
          <div>
            <Link to="/rooms/add-room">
              <Button variant="primary" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> New Room
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Room body */}
      <div className="mt-6 rounded-lg bg-white">
        <div className="flex justify-between p-4 items-center shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-md h-8 px-2">
              <>
                <Search className="w-4 h-4 stroke-gray-300" />
                <Input
                  placeholder="Find by room number..."
                  type="number"
                  onChange={(event) => {
                    const value = event.target.value;
                    setFilterData(
                      data.filter((room) =>
                        room.room_number.toString().includes(value)
                      )
                    );
                  }}
                  className="max-w-[320px] placeholder:text-placeholder bg-transparent border-0 py-0 pl-2 shadow-none focus-visible:ring-0 focus:ring-0
                  focus-visible:ring-offset-0 h-8 text-xs text-paragraph"
                />
              </>
            </div>
            {/* Filter room by status */}
            <FilterRooms data={data} setFilterData={setFilterData} />
            {/* <Button className="h-8 text-white">Apply</Button> */}
          </div>
          <RefreshCcw className="size-4 text-gray-700" />
        </div>
        {/* Room list */}

        {filterData?.length > 0 ? (
          <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4 flex-grow">
            {filterData.map((room, index) => (
              <RoomCard key={index} room={room} />
            ))}
          </div>
        ) : (
          <div className="mt-4 min-h-[60vh] bg-white rounded flex justify-center items-center">
            <EmptyComponent
              title="No Room Found!"
              description="Add new room to get started."
              ctaText="New Room"
              ctaUrl="/rooms/add-room"
            />
          </div>
        )}

        {/* pagination */}
        {/* <Pagination table={table} /> */}
      </div>
    </div>
  );
}

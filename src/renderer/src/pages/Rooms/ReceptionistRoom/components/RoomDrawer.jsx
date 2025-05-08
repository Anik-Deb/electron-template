import DrawerBody from '@/components/Common/Drawer/DrawerBody';
import TriggerDrawer from '@/components/Common/Drawer/TriggerDrawer';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerDescription } from '@/components/ui/drawer';
import { cn } from '@/utils';
import { MessageSquareText, Printer } from 'lucide-react';
import React from 'react';
import { Label } from '@/components/ui/label';

export default function RoomDrawer({ title, className, room }) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  return (
    <Drawer direction="right" onChange={() => setIsDrawerOpen((prev) => !prev)}>
      <TriggerDrawer
        className={cn(
          'p-0 px-2 text-[13px] hover:bg-accent hover:text-accent-foreground w-full capitalize',
          className
        )}
        onClick={() => setIsDrawerOpen(true)}
      >
        {title || 'View'}
      </TriggerDrawer>
      {isDrawerOpen && (
        <DrawerBody
          title={
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="capitalize">{room?.room_number}</div>
              </div>
              <Button
                // onClick={() => handlePrint(componentRef)}
                className="h-8 bg-transparent hover:bg-transparent w-fit pl-3"
              >
                <Printer className="stroke-gray-500 size-3.5" />
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-2"></div>
        </DrawerBody>
      )}
    </Drawer>
  );
}

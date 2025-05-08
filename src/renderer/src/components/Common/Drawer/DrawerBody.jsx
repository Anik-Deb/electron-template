/* eslint-disable react/react-in-jsx-scope */
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@/components/ui/dialog';
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils';
import { Cross1Icon } from '@radix-ui/react-icons';

export default function DrawerBody({ className, title, subTitle, children }) {
  return (
    <DrawerContent
      className={cn(
        `left-auto right-0 bg-white top-0 mt-0 w-screen rounded-none sm:h-screen sm:w-[350px] lg:w-[450px] overflow-y-scroll overflow-x-hidden`,
        className
      )}
    >
      <DrawerHeader className="flex justify-between items-center px-6 py-0 pb-2">
        {/* Admin information */}
        <div className="flex gap-2">
          <DrawerTitle className="flex flex-col gap-1">
            <div className="capitalize">{title}</div>
            <div className="text-[13px] font-normal text-paragraph">
              {subTitle}
            </div>
          </DrawerTitle>
        </div>
        {/* Drawer close button */}
        <DrawerClose asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Close Drawer</span>
            <Cross1Icon className="size-[14px] stroke-colorVariant-heading stroke-[0.5px]" />
          </Button>
        </DrawerClose>
      </DrawerHeader>
      <Separator className="my-2" />
      <div className="px-6 py-4">{children}</div>
      <DrawerDescription />
    </DrawerContent>
  );
}

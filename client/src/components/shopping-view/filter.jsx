import React, { Fragment, useState } from 'react';
import { filter } from '@/config';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

function ProductFilter({ filters, handleFilter }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filterContent = (
    <div className='p-4 space-y-4'>
      {
        Object.keys(filter).map(keyItem =>
          <Fragment key={keyItem}>
            <div>
              <h3 className='text-base font-bold'>{keyItem}</h3>
              <div className='grid gap-2 mt-2'>
                {
                  filter[keyItem].map(option =>
                    <Label key={option.id} className='flex items-center gap-2 font-medium'>
                      <Checkbox
                        checked={
                          filters &&
                          filters[keyItem] &&
                          filters[keyItem].includes(option.id)
                        }
                        onCheckedChange={() => handleFilter(keyItem, option.id)}
                      />
                      {option.label}
                    </Label>
                  )
                }
              </div>
            </div>
            <Separator />
          </Fragment>
        )
      }
    </div>
  );

  return (
    <>
      {/* Show only on small screens */}
      <div className="md:hidden mb-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className='flex items-center gap-2'>
              <SlidersHorizontal size={16} />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            {filterContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Always visible on md+ screens */}
      <div className='hidden md:block bg-background rounded-lg shadow-sm'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Filters</h2>
        </div>
        {filterContent}
      </div>
    </>
  );
}

export default ProductFilter;

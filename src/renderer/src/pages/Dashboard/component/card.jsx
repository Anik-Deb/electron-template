import { Badge } from 'lucide-react'
import React from 'react'

export default function Card({item}) {
  return (
    <div className="flex-1 p-4 bg-white rounded-md shadow-sm">
        <div className="flex mb-4 justify-between items-center">
          <h3 className="text-primary-1000  text-base font-medium">
            {item?.title}
          </h3>
          {
            item?.icon && (
                < item.icon className="size-4 stroke-1 stroke-primary-600" />
            )
          }
        </div>
        <div className="text-lg text-heading font-medium mb-3">
          {/* {
          item?.count?.isBalance ? 
          isNaN(item?.count?.number) ? 0 : item?.count?.number?.toFixed(2) : 
          item?.count?.number
          } */}
        </div>

        {
            item?.analytics?.percentage && (
                <div className="flex gap-3">
                    <Badge className="text-success-600 text-[13px] bg-success-100 hover:bg-success-100 rounded p-[1px]">
                        +18%
                    </Badge>
                    <p className="text-[13px] font-medium text-primary-900">
                        Since last month
                    </p>
                </div>
            )
        }
        
      </div>
  )
}

import { cn } from '@/utils'
import { Input } from '../input'
import React from 'react'

const TransparentInput = React.forwardRef(
  ({ form, className, onChange, type, errors, ...props }, ref) => {
    // Handle on Change
    const handleOnChange = (event) => {
      if (!onChange && type === 'number') {
        const value = parseInt(event.target.value)
        value >= 0 ? form.setValue(props.name, event?.target?.value) : form.setValue(props.name, '')
      } else {
        return onChange && onChange(event)
      }
    }
    return (
      <Input
        ref={ref}
        onChange={handleOnChange}
        type={type}
        className={cn(
          errors && 'border-destructive-600',
          'h-9 block bg-transparent text-xs placeholder:text-gray-400 font-normal text-gray-600 hover:border-paragraph focus:border-primary focus-visible:border-dark-900 focus-visible:ring-0 focus-visible:ring-offset-0',
          className
        )}
        {...props}
      />
    )
  }
)
TransparentInput.displayName = 'TransparentInput'
export default TransparentInput

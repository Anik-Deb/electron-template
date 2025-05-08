import React from 'react'
import SearchDropdownInput from '.'
import { cn } from '@/utils'

export default function SearchDropdown({
  users,
  setQuery,
  className,
  placeholder,
  dropdownClassName,
  itemClassName,
  ...props
}) {
  const [inputValue, setInputValue] = React.useState('')
  const [filteredItems, setFilteredItems] = React.useState([])
  // BookedBy user handler
  const handleBookedBySearch = (e) => {
    const value = e.target.value
    setInputValue(value)
    if (value.length > 0) {
      setFilteredItems(users.filter((user) => user.phone.toString().includes(value)))
    } else {
      setFilteredItems([])
    }
  }
  return (
    <SearchDropdownInput
      className={cn(className)}
      placeholder={placeholder}
      inputValue={inputValue}
      setInputValue={setInputValue}
      setQuery={setQuery}
      props={props}
      dropdownClassName={dropdownClassName}
      itemClassName={itemClassName}
      filteredItems={filteredItems}
      setFilteredItems={setFilteredItems}
      handleSearch={handleBookedBySearch}
    />
  )
}

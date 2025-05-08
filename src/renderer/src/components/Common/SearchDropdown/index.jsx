import { cn } from '@/utils'
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput'

export default function SearchDropdownInput({
  inputValue,
  setInputValue,
  filteredItems,
  setFilteredItems,
  setQuery,
  handleSearch,
  className,
  dropdownClassName,
  itemClassName,
  placeholder,
  ...props
}) {
  const handleSelectItem = (item) => {
    setQuery(item) // Set the select value
    setInputValue(item.name) // Set the input value
    setFilteredItems([]) // Clear the filtered items to close the dropdown
  }

  return (
    <div className="relative">
      <TransparentInput
        type="text"
        value={inputValue}
        onChange={handleSearch}
        className={cn(className)}
        placeholder={placeholder}
        {...props}
      />
      {filteredItems.length > 0 && (
        <ul
          className={cn(
            dropdownClassName,
            'absolute left-0 right-0 mt-0 bg-white border border-accent rounded shadow-md z-10'
          )}
        >
          {filteredItems.map((item, index) => (
            <li
              key={index}
              className={cn(
                itemClassName,
                'w-full px-4 py-2 text-[13px] text-subHeading hover:text-accent-foreground hover:bg-accent cursor-pointer'
              )}
              onClick={() => handleSelectItem(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

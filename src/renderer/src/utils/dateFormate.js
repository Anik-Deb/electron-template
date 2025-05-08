export default function dateFormate(isoDate) {
  const date = new Date(isoDate)

  // Array of month names for mapping
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  // Get day, month, and year in local time
  const day = String(date.getDate()).padStart(2, '0')
  const month = monthNames[date.getMonth()] // No need to add 1 since the month index matches the array
  const year = date.getFullYear()

  // Format as "DD, MMM, YYYY"
  const formattedDate = `${day}, ${month}, ${year}`
  return formattedDate
}



/*UTC TIME*/
// export default function dateFormate(isoDate) {
//   const date = new Date(isoDate)

//   // Array of month names for mapping
//   const monthNames = [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'Jun',
//     'Jul',
//     'Aug',
//     'Sep',
//     'Oct',
//     'Nov',
//     'Dec'
//   ]

//   // Get day, month, and year
//   const day = String(date.getUTCDate()).padStart(2, '0')
//   const month = monthNames[date.getUTCMonth()] // No need to add 1 since the month index matches the array
//   const year = date.getUTCFullYear()

//   // Format as "DD, MMM, YYYY"
//   const formattedDate = `${day}, ${month}, ${year}`
//   return formattedDate
// }

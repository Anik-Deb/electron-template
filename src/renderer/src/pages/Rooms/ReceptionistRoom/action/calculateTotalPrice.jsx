export const calculateTotalPrice = (room, date) => {
  const timeDifference = date.to - date.from;
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return room?.base_price ? Number(room.base_price) * daysDifference : 0;
};

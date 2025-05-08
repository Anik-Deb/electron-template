export function CheckIsNaN(intNum) {
  const number = Number(intNum)
  return isNaN(number) || number < 0 ? 0 : number
}

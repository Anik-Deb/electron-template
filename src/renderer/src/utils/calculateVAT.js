export default function calculateVAT(amount) {
  // VAT Will came from config file
  const vatRate = 10; // VAT rate in percentage
  if (isNaN(amount) || amount < 0) return 0; // Handle invalid inputs
  return (amount * vatRate) / 100;
}

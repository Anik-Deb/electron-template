export default async function fetchInvoice({ booking_id }) {
  try {
    const invoice = await window.api.getInvoice({
      booking_id,
    });

    if (invoice?.invoiceItems?.length) {
      const serviceIds = invoice.invoiceItems
        .filter(({ service_type }) => service_type === 'service')
        .map(({ service_id }) => service_id)
        .filter(Boolean); // Removes undefined/null values

      if (serviceIds.length) {
        const services = await window.api.getServices(serviceIds);
        const serviceMap = new Map(services.map((s) => [s.id, s])); // Create a map for quick lookup

        invoice.invoiceItems.forEach((item) => {
          if (item.service_type === 'service') {
            item.service = serviceMap.get(item.service_id) || null; // Attach service details
          }
        });
      }
    }
    return invoice;
  } catch (error) {
    return error;
  }
}

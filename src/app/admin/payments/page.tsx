import { paymentColumns, Payment } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id_payment: "PAY-2025-001",
      id_order: "ORD-2025-001",
      nama_client: "Dika Dmr",
      paket: "Professional",
      metode_pembayaran: "Transfer Bank",
      jumlah_bayar: 7500000,
      tanggal_bayar: "2025-11-01",
      status_pembayaran: "Lunas",
      bukti_pembayaran: "https://app.com/uploads/bukti/pay-001.jpg",
      aksi: "",
    },
    {
      id_payment: "PAY-2025-002",
      id_order: "ORD-2025-002",
      nama_client: "Andi Pratama",
      paket: "Enterprise",
      metode_pembayaran: "Virtual Account",
      jumlah_bayar: 15000000,
      tanggal_bayar: "2025-11-02",
      status_pembayaran: "Menunggu Verifikasi",
      bukti_pembayaran: "https://app.com/uploads/bukti/pay-002.jpg",
      aksi: "",
    },
    {
      id_payment: "PAY-2025-003",
      id_order: "ORD-2025-003",
      nama_client: "Siti Rahma",
      paket: "Basic",
      metode_pembayaran: "Transfer Bank",
      jumlah_bayar: 3000000,
      tanggal_bayar: "2025-11-03",
      status_pembayaran: "Lunas",
      bukti_pembayaran: "https://app.com/uploads/bukti/pay-003.jpg",
      aksi: "",
    },
  ];
}

export default async function Payments() {
  const data = await getData();

  return (
    <div className="px-5 py-10 w-full overflow-hidden">
      <DataTable columns={paymentColumns} data={data} />
    </div>
  );
}

import { DataTable } from "./data-table";

export default function Orders() {
  return (
    <div className="px-5 py-10 w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Kelola semua pesanan website dari client
          </p>
        </div>
      </div>

      <DataTable />
    </div>
  );
}

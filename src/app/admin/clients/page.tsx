import { DataTable } from "./data-table";

export default function ClientsPage() {
  return (
    <div className="px-5 py-10 w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
        </div>
      </div>

      <DataTable />
    </div>
  );
}

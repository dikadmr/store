import { ProductsDataTable } from "./data-table";

export default function ProductsPage() {
  return (
    <div className="px-5 py-10 w-full overflow-hidden">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-5">Daftar Tipe Website</h1>
      </div>

      <div className="overflow-x-auto">
        <ProductsDataTable />
      </div>
    </div>
  );
}

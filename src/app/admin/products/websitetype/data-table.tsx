"use client";

import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { webtypeServices } from "@/services/product/webtype";
import { Webtype, webtypeColumns } from "./columns";
import { AddWebsitesDialog } from "@/components/views/admin/products/websitetype/add-websites-dialog";
import { packageServices } from "@/services/product/package";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Package = {
  id: string;
  name: string;
};

function getPackageOrder(
  packageName?: string,
  packageList: Package[] = [],
) {
  const index = packageList.findIndex(
    (item) => item.name.toLowerCase() === packageName?.toLowerCase(),
  );

  return index === -1 ? 999 : index;
}

export function ProductsDataTable() {
  "use no memo";
  const [data, setData] = useState<Webtype[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getWebTypes = async (packageList?: Package[]) => {
    try {
      setIsLoading(true);

      const result = await webtypeServices.getAllWebTypes();
      const webtypes: Webtype[] = result.data.data || [];
      const currentPackages = packageList ?? packages;

      const sortedData = [...webtypes].sort((a, b) => {
        const packageSort =
          getPackageOrder(a.package?.name, currentPackages) -
          getPackageOrder(b.package?.name, currentPackages);

        if (packageSort !== 0) return packageSort;

        return a.name.localeCompare(b.name);
      });

      setData(sortedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPackages = async () => {
    try {
      const result = await packageServices.getAllPackages();
      const packageData: Package[] = result.data.data || [];

      setPackages(packageData);
      await getWebTypes(packageData);
    } catch (error) {
      console.log(error);
      await getWebTypes([]);
    }
  };

   
  useEffect(() => {
    void getPackages();
  }, []);

  const columns = useMemo(
    () => webtypeColumns(() => { void getWebTypes(); }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            placeholder="Cari nama tipe website..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          <Select
            value={
              (table.getColumn("package")?.getFilterValue() as string) || "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("package")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Paket" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Semua Paket</SelectItem>

              {packages.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AddWebsitesDialog onRefresh={() => getWebTypes()} />
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

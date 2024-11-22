import Button from "@/ui/Button";

import { ArrowUpDown } from "lucide-react";
import Spinner from "@/ui/Spinner";
import Menus from "@/ui/Menus";
import DataTable from "@/ui/DataTable";
import useStorage from "./useStorage";
import StorageRow from "./StorageRow";
import { capitalize } from "lodash";

function StorageTable() {
  const { storage, isLoading } = useStorage();
  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "product",
      accessorFn: (row) => capitalize(row.p_attribute.name),
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "quantity",
      accessorFn: (row) => `${row.quantity} ${row.p_attribute.unit}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "branch",
      accessorFn: (row) => `${row.locator.name} `,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Branch
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "status",
      accessorFn: (row) => `${row.is_active} `,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return <StorageRow storage={data} />;
      },
    },
  ];
  if (isLoading) return <Spinner />;
  return (
    <Menus>
      <DataTable data={storage} columns={columns} />
    </Menus>
  );
}

export default StorageTable;

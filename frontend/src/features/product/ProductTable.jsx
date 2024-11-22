import Button from "@/ui/Button";
import ProductRow from "./ProductRow";
import useProduct from "./useProduct";
import { ArrowUpDown } from "lucide-react";

import Menus from "@/ui/Menus";
import DataTable from "@/ui/DataTable";
import SpinnerMini from "@/ui/SpinningMini";
import { capitalize } from "lodash";

function ProductTable() {
  const { products, isLoading } = useProduct();
  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "product",
      accessorFn: (row) => capitalize(row.name),
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
      id: "unit",
      accessorFn: (row) => `${row.unit}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            unit
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

        return <ProductRow product={product} />;
      },
    },
  ];
  if (isLoading) return <SpinnerMini />;
  return (
    <Menus>
      <DataTable data={products} columns={columns} />
    </Menus>
  );
}

export default ProductTable;

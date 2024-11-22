import DataTable from "@/ui/DataTable";
import Menus from "@/ui/Menus";
import Spinner from "@/ui/Spinner";
import Button from "@/ui/Button";
import { HiArrowsUpDown } from "react-icons/hi2";
import useAttribute from "./useAttribute";
import AttributeRow from "./AttributeRow";
import { formatCurrency } from "@/util";
import { capitalize } from "lodash";

function AttributeTable() {
  const { isLoading, attribute } = useAttribute();

  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "product",
      accessorFn: (row) => capitalize(row.product.name),
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "product-variation",
      accessorFn: (row) => {
        return row.instance.map((item) => item.name);
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Variation
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "sellingUnitPrice",
      accessorFn: (row) => `${formatCurrency(row.sellingUnitPrice)}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sell unit price
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "buyingUnitPrice",
      accessorFn: (row) => `${formatCurrency(row.buyingUnitPrice)}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Purchase unit price
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "quantity",
      accessorFn: (row) => `${row.storage.quantity} ${row.product.unit}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Unit
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "branch",
      accessorFn: (row) => `${row.storage.locator.name}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Branch
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "created_by",
      accessorFn: (row) => `${row.created_by.username}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created By
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "updated_by",
      accessorFn: (row) => (row.updated_by ? row.updated_by.username : ""),
      header: ({ column }) => {
        return (
          <Button
            className="text-xs md:text-sm font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Updated By
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const attribute_set = row.original;

        return <AttributeRow attribute={attribute_set} />;
      },
    },
  ];

  if (isLoading) return <Spinner />;
  return (
    <Menus>
      <DataTable data={attribute} columns={columns} />
    </Menus>
  );
}

export default AttributeTable;

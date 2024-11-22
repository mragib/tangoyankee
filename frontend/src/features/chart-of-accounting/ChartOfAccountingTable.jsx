import DataTable from "@/ui/DataTable";
import Menus from "@/ui/Menus";
import Spinner from "@/ui/Spinner";
import useChartOfAccounting from "./useChartOfAccounting";
import Button from "@/ui/Button";
import { HiArrowsUpDown } from "react-icons/hi2";
import ChartOfAccountingRow from "./ChartOfAccountingRow";
import { formatCurrency } from "@/util";

function ChartOfAccountingTable() {
  const { chartOfAccounting, isLoading } = useChartOfAccounting();
  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "id",
      accessorFn: (row) => `${row.code}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Code
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "name",
      accessorFn: (row) => `${row.name}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ledger name
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "gl_type",
      accessorFn: (row) => `${row.gl_type}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "is_leaf",
      accessorFn: (row) => `${row.is_leaf}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Is Leaf
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "dr_amount",
      accessorFn: (row) => `${formatCurrency(row.dr_amount)}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Debit amount
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "cr_amount",
      accessorFn: (row) => `${formatCurrency(row.cr_amount)}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Credit amount
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "parent",
      accessorFn: (row) => `${row.parent ? row.parent.name : ""}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Parent
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return <ChartOfAccountingRow chartOfAccount={data} />;
      },
    },
  ];
  if (isLoading) return <Spinner />;
  return (
    <Menus>
      <DataTable data={chartOfAccounting} columns={columns} />
    </Menus>
  );
}

export default ChartOfAccountingTable;

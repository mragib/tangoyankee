import Spinner from "@/ui/Spinner";
import useExpenses from "./useExpenses";
import Menus from "@/ui/Menus";
import DataTable from "@/ui/DataTable";
import { format } from "date-fns";
import Button from "@/ui/Button";
import { HiArrowsUpDown } from "react-icons/hi2";

const COLUMN = [
  {
    id: "debit",
    accessorFn: (row) => {
      const debit = row.transaction.journal.find((item) => item.dr_amount);
      return debit.gl.name;
    },
    header: ({ column }) => {
      return (
        <Button
          className="text-sm md:text-md font-bold uppercase"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expense
          <HiArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "credit",
    accessorFn: (row) => {
      const credit = row.transaction.journal.find((item) => item.cr_amount);
      return credit.gl.name;
    },
    header: ({ column }) => {
      return (
        <Button
          className="text-sm md:text-md font-bold uppercase"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paid From
          <HiArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    header: "Date",
    accessorFn: (row) => format(row.expenseDate, "MMM dd yyyy"),
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
];

function ExpenseTable() {
  const { expenses, isLoading } = useExpenses();
  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <DataTable columns={COLUMN} data={expenses} />
    </Menus>
  );
}

export default ExpenseTable;

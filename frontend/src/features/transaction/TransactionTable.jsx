import Button from "@/ui/Button";
import useTransaction from "./useTransaction";
import { HiArrowsUpDown } from "react-icons/hi2";

import TransactionRow from "./TransactionRow";
import Spinner from "@/ui/Spinner";
import Menus from "@/ui/Menus";
import DataTable from "@/ui/DataTable";
import Empty from "@/ui/Empty";
import { formatDate } from "date-fns";
import { formatCurrency } from "@/util";

function TransactionTable() {
  const { transactions, isLoading } = useTransaction();

  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "Date",
      accessorFn: (row) => `${formatDate(row.transaction_date, "dd MMM yyyy")}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Transaction Date
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "description",
      accessorFn: (row) => `${row.description}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "debit",
      accessorFn: (row) => {
        return row.journal.map((item) =>
          item.dr_amount > 0 ? item.gl.name : ""
        );
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Debit
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "credit",
      accessorFn: (row) => {
        return row.journal.map((item) =>
          item.cr_amount > 0 ? item.gl.name : ""
        );
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Credit
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "amount",
      accessorFn: (row) => `${formatCurrency(row.total_amount)}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return <TransactionRow transaction={data} />;
      },
    },
  ];

  if (isLoading) return <Spinner />;
  if (!transactions.length) return <Empty resource="Transaction" />;
  return (
    <Menus>
      <DataTable data={transactions} columns={columns} />
    </Menus>
  );
}

export default TransactionTable;

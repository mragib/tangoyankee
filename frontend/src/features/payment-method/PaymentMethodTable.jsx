import Button from "@/ui/Button";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";

import usePaymentMethod from "./usePaymentMethod";
import { HiArrowsUpDown } from "react-icons/hi2";
import DataTable from "@/ui/DataTable";
import PaymentMethodRow from "./PaymentMethodRow";
import { formatCurrency } from "@/util";

function PaymentMethodTable() {
  const { paymentMethods, isLoading } = usePaymentMethod();

  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "name",
      accessorFn: (row) => `${row.name}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase flex items-center justify-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            name
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "account_number",
      accessorFn: (row) => `${row.account_number}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account Number
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "code",
      accessorFn: (row) => `${row.code}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account Code
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "status",
      accessorFn: (row) => `${row.is_active}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "type",
      accessorFn: (row) => `${row.type}`,
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
      id: "balance",
      accessorFn: (row) => `${formatCurrency(row.balance)}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Balance
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return <PaymentMethodRow paymentMethod={data} />;
      },
    },
  ];
  if (isLoading) return <Spinner />;
  return (
    <Menus>
      <DataTable data={paymentMethods} columns={columns} />
    </Menus>
  );
}

export default PaymentMethodTable;

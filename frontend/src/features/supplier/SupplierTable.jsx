import DataTable from "@/ui/DataTable";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import SupplierRow from "./SupplierRow";
import useSuppliers from "./useSuppliers";
import Tag from "@/ui/Tag";
import styled from "styled-components";
import Button from "@/ui/Button";
import { ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/util";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;

  & span:first-child {
    font-weight: 500;
  }
`;

function SupplierTable() {
  const { suppliers, isLoading } = useSuppliers();

  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      //   header: "Name",

      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "phone",
    },
    {
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "address",
    },
    {
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "email",
    },
    {
      id: "account",
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorFn: (row) => {
        const { totalAmount, payment } = row;
        const paid = payment.reduce((acc, cur) => acc + cur.amountPaid, 0);
        return +totalAmount - paid;
      },

      cell: ({ row }) => {
        const { purchase, payment } = row.original;
        const totalAmount = purchase.reduce(
          (acc, curr) => curr.totalAmount + acc,
          0
        );
        const paid = payment.reduce((acc, curr) => curr.amountPaid + acc, 0);
        const due = totalAmount - paid;
        return (
          <Stacked>
            <p>{`Total:${formatCurrency(totalAmount)}`}</p>
            <p>{`Paid: ${formatCurrency(paid)}`}</p>
            <Tag
              type={totalAmount - paid <= 0 ? "green" : "red"}
            >{`Due: ${formatCurrency(due.toFixed(2))}`}</Tag>
          </Stacked>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Tag type={row.original.status ? "green" : "red"}>
          {row.original.status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;
        return <SupplierRow supplier={customer} />;
      },
    },
  ];

  if (isLoading) return <Spinner />;
  return (
    <Menus>
      <DataTable data={suppliers} columns={columns} />
    </Menus>
  );
}

export default SupplierTable;

import Menus from "@/ui/Menus";
import useCustomers from "./useCustomers";
import DataTable from "@/ui/DataTable";
import Spinner from "@/ui/Spinner";

import { ArrowUpDown } from "lucide-react";

import CustomerRow from "./CustomerRow";
import Tag from "@/ui/Tag";
import styled from "styled-components";
import Button from "@/ui/Button";
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
const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function CustomerTable() {
  const { customers, isLoading } = useCustomers();
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
        const { totalAmount, saleRevenue } = row;
        const paid = saleRevenue.reduce((acc, cur) => acc + cur.amountPaid, 0);
        return +totalAmount - paid;
      },

      cell: ({ row }) => {
        const { sale, saleRevenue } = row.original;
        const totalAmount = sale.reduce(
          (acc, curr) => curr.totalAmount + acc,
          0
        );
        const paid = saleRevenue.reduce(
          (acc, curr) => curr.amountPaid + acc,
          0
        );
        const due = totalAmount - paid;
        return (
          <Stacked>
            <Amount>{`Total:${formatCurrency(Math.ceil(totalAmount))}`}</Amount>
            <Amount>{`Paid: ${formatCurrency(Math.ceil(paid))}`}</Amount>
            <Tag type={due <= 0 ? "green" : "red"}>{`Due: ${formatCurrency(
              Math.ceil(due)
            )}`}</Tag>
          </Stacked>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: ({ row }) => (
        <Tag type={row.original.is_active ? "green" : "red"}>
          {row.original.is_active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;
        return <CustomerRow customer={customer} />;
      },
    },
  ];
  if (isLoading) return <Spinner />;
  return (
    <Menus>
      <DataTable data={customers} columns={columns} />
    </Menus>
  );
}

export default CustomerTable;

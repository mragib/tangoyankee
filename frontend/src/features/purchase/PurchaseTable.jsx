import DataTable from "@/ui/DataTable";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import PurchaseRow from "./PurchaseRow";

import usePurchase from "./usePurchases";
import { HiArrowsUpDown } from "react-icons/hi2";
import Button from "@/ui/Button";
import styled from "styled-components";
import { formatDate } from "date-fns";
import { formatCurrency } from "@/util";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;

  & span:first-child {
    font-size: 1.1rem;
    font-weight: 500;
  }

  & span:last-child {
    font-size: 1.2rem;
  }
`;

const HeadingText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const SmallText = styled.div`
  font-weight: 300;
`;

function PurchaseTable() {
  const { purchases, isLoading } = usePurchase();
  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      // header: "Product",
      id: "invoice",
      accessorFn: (row) => `${row.invoiceNumber}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Invoice
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const { invoiceNumber, purchaseDate } = row.original;
        return (
          <Stacked>
            <p className="text-md font-medium">{invoiceNumber}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(purchaseDate, "MMM dd yyyy")}
            </p>
          </Stacked>
        );
      },
    },
    {
      // header: "Product",
      id: "amount",
      accessorFn: (row) => {
        const { totalAmount, payment } = row;
        const paid = payment.reduce((acc, cur) => acc + cur.amountPaid, 0);
        return +totalAmount - paid;
      },
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
      cell: ({ row }) => {
        const { totalAmount, payment } = row.original;
        const paid = payment.reduce((acc, cur) => acc + cur.amountPaid, 0);
        const payable = totalAmount - paid;
        return (
          <Stacked>
            <p>{`Total: ${formatCurrency(Math.ceil(totalAmount))}`}</p>

            <p>{`Paid: ${formatCurrency(Math.ceil(paid))}`}</p>
            <p
              className={`uppercase text-sm px-5 py-2 w-fit font-medium rounded-full ${
                payable > 0
                  ? "text-red-700 bg-red-100"
                  : "text-green-700 bg-green-100"
              }`}
            >{`Due: ${formatCurrency(Math.ceil(payable))}`}</p>
          </Stacked>
        );
      },
    },
    {
      // header: "Product",
      id: "supplier",
      accessorFn: (row) => {
        return `${row.supplier.name} ${row.supplier.phone}`;
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Supplier
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const { supplier } = row.original;
        return (
          <Stacked>
            <HeadingText>{supplier.name}</HeadingText>
            <SmallText>{supplier.owner}</SmallText>
            <SmallText>{supplier.phone}</SmallText>
          </Stacked>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const purchase = row.original;

        return <PurchaseRow purchase={purchase} />;
      },
    },
  ];

  if (isLoading) return <Spinner />;
  return (
    <Menus>
      <DataTable data={purchases} columns={columns} />
    </Menus>
  );
}

export default PurchaseTable;

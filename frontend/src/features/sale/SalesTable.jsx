import DataTable from "@/ui/DataTable";
import Menus from "@/ui/Menus";
import useSales from "./useSales";
import Spinner from "@/ui/Spinner";
import Tag from "@/ui/Tag";

import { ArrowUpDown } from "lucide-react";

import styled from "styled-components";
import { formatDate } from "date-fns";
import ButtonIcon from "@/ui/ButtonIcon";
import { useNavigate } from "react-router-dom";
import { HiEye, HiPencil } from "react-icons/hi2";
import Button from "@/ui/Button";
import { useSelector } from "react-redux";
import useUserSales from "../reports/useUserSales";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    font-size: 1.2rem;
  }
`;
const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function SalesTable() {
  const { user } = useSelector((state) => state.auth);
  const IsSaleman = user?.role.name === "sales";
  const { sales, isLoading } = useSales();
  const { isLoading: usersSalesLoading, salesReportOfUser } = useUserSales();
  const navigate = useNavigate();
  const isWorking = isLoading | usersSalesLoading;
  if (isWorking) return <Spinner />;
  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "customer",
      cell: ({ row }) => {
        return <Customer customer={row.original.customer} />;
      },
      accessorFn: (row) => {
        return row.customer.phone;
      },

      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "invoiceNumber",
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Invoice
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <Stacked>
            <p className="text-md font-medium">{invoice.invoiceNumber}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(invoice.salesDate, "MMM dd yyyy")}
            </p>
          </Stacked>
        );
      },
      accessorKey: "invoiceNumber",
    },

    {
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Discount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "discount",
    },
    {
      id: "total",
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
      accessorFn: (row) => {
        const { totalAmount, saleRevenue } = row;
        const paid = saleRevenue.reduce((acc, cur) => acc + cur.amountPaid, 0);
        const payable = (totalAmount - paid).toFixed(2);
        return payable;
      },

      cell: ({ row }) => {
        const { totalAmount, saleRevenue } = row.original;
        const paid = saleRevenue.reduce((acc, cur) => acc + cur.amountPaid, 0);

        return (
          <Stacked>
            <Amount>{`Total:${totalAmount}`}</Amount>
            <Amount>{`Paid: ${paid}`}</Amount>
            <Tag type={totalAmount - paid <= 0 ? "green" : "red"}>{`Due: ${(
              totalAmount - paid
            ).toFixed(2)}`}</Tag>
          </Stacked>
        );
      },
    },
    {
      id: "delivery",
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Delivery
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorFn: (row) => {
        return row.delivery.deliveryStatus;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const sale = row.original;

        return (
          <div>
            <ButtonIcon onClick={() => navigate(`/sales/${sale.id}`)}>
              <HiEye />
            </ButtonIcon>
            {sale.delivery.deliveryStatus !== "Delivered" && (
              <ButtonIcon onClick={() => navigate(`/sales/edit/${sale.id}`)}>
                <HiPencil />
              </ButtonIcon>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Menus>
      <DataTable
        data={IsSaleman ? salesReportOfUser : sales}
        columns={columns}
      />
    </Menus>
  );
}

export default SalesTable;

function Customer({ customer }) {
  return (
    <Stacked>
      <p className="text-md">{customer.phone}</p>
      <p className="text-md">{customer.name}</p>
    </Stacked>
  );
}

import styled from "styled-components";
import { useMoveBack } from "../../hooks/useMoveBack";
import ButtonText from "../../ui/ButtonText";
import Empty from "../../ui/Empty";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import Spinner from "../../ui/Spinner";
import useSupplier from "./useSupplier";
import Tag from "../../ui/Tag";
import { capitalizeFirstLetter, formatCurrency } from "../../util";

import { format } from "date-fns";

import { HiEye } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import ButtonIcon from "../../ui/ButtonIcon";
import SupplierPayment from "./SupplierPayment";

import Ledger from "@/components/Ledger";
import DataTable from "@/ui/DataTable";
import Button from "@/ui/Button";
import { ArrowUpDown } from "lucide-react";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 0.2fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Box = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 3.2rem;
  padding: 4.8rem 0;
`;

function SupplierDetails() {
  const { supplier, isLoading } = useSupplier();
  const navigate = useNavigate();

  const moveBack = useMoveBack();
  if (isLoading) return <Spinner />;
  if (!supplier) return <Empty resource="Supplier" />;

  const { purchase, payment, name, address, phone, email, status, owner } =
    supplier;
  const Column = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      accessorKey: "purchaseDate",
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Purchase Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return format(row.original.purchaseDate, "MMM dd yyyy");
      },
    },
    {
      accessorKey: "invoiceNumber",
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
      cell: ({ row }) => row.original.invoiceNumber,
    },
    {
      accessorKey: "Amount",
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const paid = payment
          .filter((item) => item.purchaseId === row.original.id)
          .reduce((acc, curr) => curr.amountPaid + acc, 0);

        const payable = row.original.totalAmount - paid;

        return (
          <div className="flex items-center flex-col gap-2">
            <p className="text-blue-800 bg-blue-200 px-2 py-1 rounded-full hidden md:block">
              Total Amount:{" "}
              {formatCurrency(Math.ceil(row.original.totalAmount))}
            </p>
            <p className="text-green-800 bg-green-200 px-2 py-1 rounded-full hidden md:block">
              Toatl Paid: {formatCurrency(Math.ceil(paid))}
            </p>
            <p
              className={`flex px-2 py-1 rounded-sm md:rounded-full ${
                payable > 0
                  ? "text-red-800 bg-red-200 "
                  : "text-green-800 bg-green-200"
              }`}
            >
              <span className="text-sm hidden md:block">Total Due:</span>
              {formatCurrency(Math.ceil(payable))}
            </p>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const purchase = row.original;

        return (
          <ButtonIcon onClick={() => navigate(`/purchases/${purchase.id}`)}>
            <HiEye />
          </ButtonIcon>
        );
      },
    },
  ];

  return (
    <>
      <Row type="horizontal">
        <div className="flex items-center gap-10">
          <h1 className="text-xl md:text-2xl font-bold leading-4 pb-2 md:pb-4">
            Supplier #{name}
          </h1>
          <Tag type={status ? "green" : "red"}>
            {status ? "Active" : "Inactive"}
          </Tag>
        </div>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="grid">
          <p>Supplier Phone: {phone}</p>
          <p>Supplier Address: {address}</p>
          <p>Supplier Email: {email}</p>
          <p>Owner: {capitalizeFirstLetter(owner)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 pt-10">
        <div>
          <Ledger payment={payment} data={purchase} />
        </div>
        <SupplierPayment
          payment={payment}
          purchase={purchase}
          supplier={supplier}
        />
      </div>
      <DataTable columns={Column} data={purchase} />
    </>
  );
}

export default SupplierDetails;

import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";

import ButtonText from "../../ui/ButtonText";
import usePurchase from "./usePurchase";
import { useMoveBack } from "../../hooks/useMoveBack";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

import { format } from "date-fns";
import PaymentForm from "./PaymentForm";
import { HiArrowsUpDown } from "react-icons/hi2";
import DataTable from "@/ui/DataTable";
import Card from "@/ui/Card";

function PurchaseDetails() {
  const { isLoading, purchase } = usePurchase();

  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;

  if (!purchase) return <Empty resource="Purchase" />;

  const {
    invoiceNumber,
    purchaseItems,
    payment,
    totalAmount,
    supplier,
    purchaseDate,
  } = purchase;

  const paid = payment.reduce((acc, cur) => acc + cur.amountPaid, 0);
  const payable = totalAmount - paid;

  const PurchaseItemscolumns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "product",
      accessorFn: (row) => `${row.attribute.product.name}`,
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
      id: "quantity",
      accessorFn: (row) => row.quantity,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "unitPrice",
      accessorFn: (row) => {
        return `${row.buyingUnitPrice}`;
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Buying Price
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "totalPrice",
      accessorFn: (row) => {
        return `${row.buyingUnitPrice * row.quantity}`;
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];
  const paymentcolumns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "paymentDate",
      accessorFn: (row) =>
        `${format(new Date(row.created_at), "do LLLL RRRR")}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Payment Date
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "amount",
      accessorFn: (row) => row.amountPaid,
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
      id: "Payment_Method",
      accessorFn: (row) => {
        return `${row.account.name}`;
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Payment Method
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "cheque_number",
      accessorFn: (row) => {
        return `${row.cheque_number || ""}`;
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cheque Number
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "account_number",
      accessorFn: (row) => {
        return `${row.account.account_number || ""}`;
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Row type="horizontal">
        <div className="flex items-center gap-10">
          <h1 className="text-xl md:text-2xl font-bold leading-4 pb-2 md:pb-4">
            Invoice #{invoiceNumber}
          </h1>
        </div>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="grid">
          <p>Purchase Date: {format(new Date(purchaseDate), "MMM dd yyyy")}</p>
          <p>Supplier Name: {supplier.name}</p>
          <p>Supplier Phone: {supplier.phone}</p>
          <p>Supplier Address: {supplier.address}</p>
          <p>Supplier Email: {supplier.email}</p>
        </div>
        <div className="flex item-center justify-center">
          {/* <div className="flex-1">
            <Button
              onClick={() => {
                handlePrint(() => componentRef.current);
              }}
            >
              Print Invoice
            </Button>
          </div> */}
          <div className="flex-1">
            {payable > 0 && (
              <Modal>
                <Modal.Open opens="delete">
                  <Button variation="danger">Make Payment</Button>
                </Modal.Open>
                <Modal.Window name="delete">
                  {/* <ConfirmDelete
              resource="Booking"
              disabled={isDeleting}
              onConfirm={() =>
                deleteBooking(bookingId, { onSettled: () => navigate(-1) })
              }
            /> */}
                  <PaymentForm paymentToMake={purchase} />
                </Modal.Window>
              </Modal>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-2 items-start justify-center ">
        <Card heading="Products">
          <DataTable data={purchaseItems} columns={PurchaseItemscolumns} />
        </Card>
        <Card heading="Payments">
          <DataTable data={payment} columns={paymentcolumns} />
        </Card>
      </div>
    </>
  );
}

export default PurchaseDetails;

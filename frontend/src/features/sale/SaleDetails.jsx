import { useMoveBack } from "@/hooks/useMoveBack";
import Empty from "@/ui/Empty";

import useSale from "./useSale";
import Row from "@/ui/Row";

import ButtonText from "@/ui/ButtonText";
import { format } from "date-fns";

import Modal from "@/ui/Modal";
import Button from "@/ui/Button";
import SalePaymentForm from "./SalePaymentForm";
import { HiArrowsUpDown } from "react-icons/hi2";
import DataTable from "@/ui/DataTable";
import Card from "@/ui/Card";
import SalesInvoice from "./SalesInvoice";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { capitalizeFirstLetter, formatCurrency } from "@/util";
import SalesProductList from "./SalesProductList";
import SpinnerMini from "@/ui/SpinningMini";

function SaleDetails() {
  const { isLoading, sale } = useSale();
  const moveBack = useMoveBack();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (isLoading) return <SpinnerMini />;

  if (!sale) return <Empty resource="Sale" />;

  const {
    invoiceNumber,
    saleItems,
    saleRevenue,
    totalAmount,
    salesDate,
    customer,
    discount,
    created_by,
    delivery,
  } = sale;

  const paid = saleRevenue.reduce((acc, cur) => acc + cur.amountPaid, 0);
  const payable = totalAmount - paid;
  const SalesItemscolumns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "product",
      accessorFn: (row) => {
        const productInstances = row.attribute.instance.map(
          (item) => item.name
        );

        return `${capitalizeFirstLetter(
          row.attribute.product.name
        )}--${productInstances}`;
      },
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
        return `${row.sellingUnitPrice}`;
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Unit Price
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "totalPrice",
      accessorFn: (row) => {
        return `${Math.ceil(row.sellingUnitPrice * row.quantity)}`;
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
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
  const revenuecolumns = [
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
        return `${row.account?.name}`;
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
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
            className="text-sm md:text-md font-bold uppercase"
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
        return `${row.account?.account_number || ""}`;
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
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
          <p>Purchase Date: {format(new Date(salesDate), "MMM dd yyyy")}</p>
          <p>Customar Name: {customer.name}</p>
          <p>Customar Phone: {customer.phone}</p>
          <p>Customar Address: {customer.address}</p>
          <p>Customar Email: {customer.email}</p>
          <p>Sold by: {capitalizeFirstLetter(created_by?.username)}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_.6fr_.7fr] gap-2">
          <div className="grid grid-cols-[1fr_.1fr_.7fr] ">
            <p>Total Bill </p>
            <p>:</p>
            <p>{formatCurrency(totalAmount + discount)}</p>
            <p>Discount </p>
            <p>:</p>
            <p>{formatCurrency(discount)}</p>
            <p>Total Paid </p>
            <p>:</p>
            <p className="font-semibold text-green-800">
              {formatCurrency(paid)}
            </p>
            <p>Total Due </p>
            <p>:</p>
            <p className="font-semibold text-red-900">
              {formatCurrency(payable)}
            </p>
          </div>

          <div>
            <Button
              onClick={() => {
                handlePrint(() => componentRef.current);
              }}
            >
              Print Invoice
            </Button>
          </div>
          <div>
            {payable > 0 && (
              <Modal>
                <Modal.Open opens="delete">
                  <Button variation="tertiary">Collect Payment</Button>
                </Modal.Open>

                <Modal.Window name="delete">
                  <SalePaymentForm paymentToMake={sale} />
                </Modal.Window>
              </Modal>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-2 items-start justify-center ">
        <SalesProductList
          saleItems={saleItems}
          SalesItemscolumns={SalesItemscolumns}
        />
        <Card heading="Payments">
          <DataTable data={saleRevenue} columns={revenuecolumns} />
        </Card>
      </div>
      <SalesInvoice
        ref={componentRef}
        data={saleItems}
        columns={SalesItemscolumns}
        customer={customer}
        totalAmount={totalAmount}
        discount={discount}
        invoiceNumber={invoiceNumber}
        delivery={delivery}
        soldBy={created_by}
      />
    </>
  );
}

export default SaleDetails;

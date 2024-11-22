import useCustomer from "./useCustomer";

import { useMoveBack } from "@/hooks/useMoveBack";
import Empty from "@/ui/Empty";
import Row from "@/ui/Row";

import Tag from "@/ui/Tag";
import ButtonText from "@/ui/ButtonText";

// import SupplierLedger from "../supplier/SupplierLedger";

import { ArrowUpDown } from "lucide-react";
import DataTable from "@/ui/DataTable";
import { format } from "date-fns";
import ButtonIcon from "@/ui/ButtonIcon";
import { HiEye } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Ledger from "@/components/Ledger";
import CustomerPayment from "./CustomerPayment";
import Spinner from "@/ui/Spinner";
import Button from "@/ui/Button";
import { formatCurrency } from "@/util";

function CustomerDetails() {
  const { customer, isLoading: customerLoading } = useCustomer();
  const navigate = useNavigate();
  const moveBack = useMoveBack();
  if (customerLoading) return <Spinner />;
  if (!customer) return <Empty resource="Customer" />;
  const { sale, saleRevenue, name, address, phone, email, is_active } =
    customer;

  const Column = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      accessorKey: "salesDate",
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sales Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => format(row.original.salesDate, "MMM dd yyyy"),
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
        const paid = saleRevenue
          .filter((item) => item.saleId === row.original.id)
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
        const sale = row.original;

        return (
          <ButtonIcon onClick={() => navigate(`/sales/${sale.id}`)}>
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
            Customer #{name}
          </h1>
          <Tag type={is_active ? "green" : "red"}>
            {is_active ? "Active" : "Inactive"}
          </Tag>
        </div>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="grid">
          <p>Customar Phone: {phone}</p>
          <p>Customar Address: {address}</p>
          <p>Customar Email: {email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 pt-10">
        <div>
          <Ledger payment={saleRevenue} data={sale} />.
        </div>
        <div>
          <CustomerPayment
            saleRevenue={saleRevenue}
            sale={sale}
            customer={customer}
          />
        </div>
      </div>

      <DataTable columns={Column} data={sale} />
    </>
  );
}

export default CustomerDetails;

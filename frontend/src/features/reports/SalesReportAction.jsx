import Menus from "@/ui/Menus";
import Modal from "@/ui/Modal";
import { HiEye, HiPencil } from "react-icons/hi";
import { HiArrowsUpDown, HiPrinter } from "react-icons/hi2";
import { Link } from "react-router-dom";
import SalesInvoice from "../sale/SalesInvoice";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Button from "@/ui/Button";
import UpdateDeliveryForm from "../delivery/UpdateDeliveryForm";

function SalesReportAction({ sale }) {
  const {
    id: saleId,
    invoiceNumber,
    saleItems,
    totalAmount,
    customer,
    discount,
    delivery,
    created_by,
  } = sale;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const SalesItemscolumns = [
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
  return (
    <div>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={saleId} lower={true} />
          <Menus.List id={saleId}>
            {delivery.deliveryStatus !== "Delivered" && (
              <Modal.Open opens="edit-sale">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>
            )}
            <Modal.Open opens="view-sale">
              <Link to={`/sales/${saleId}`}>
                <Menus.Button icon={<HiEye />}>Detials</Menus.Button>
              </Link>
            </Modal.Open>

            <Menus.Button
              icon={<HiPrinter />}
              onClick={() => {
                handlePrint(() => componentRef.current);
              }}
            >
              Print Invoice
            </Menus.Button>
          </Menus.List>
          <Modal.Window name="edit-sale">
            <UpdateDeliveryForm deliveryToEdit={sale.delivery} />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
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
    </div>
  );
}

export default SalesReportAction;

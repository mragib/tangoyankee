import Spinner from "@/ui/Spinner";
import useDeliveries from "./useDeliveries";
import { format } from "date-fns";
import { capitalizeFirstLetter, formatCurrency } from "@/util";
import { Separator } from "@/components/ui/separator";

import Modal from "@/ui/Modal";
import DeliveryAccordian from "../delivery/DeliveryAccordian";
import UpdateDeliveryForm from "../delivery/UpdateDeliveryForm";
import { HiArrowsUpDown, HiPencil } from "react-icons/hi2";
import SalesInvoice from "../sale/SalesInvoice";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Button from "@/ui/Button";
import { HiPrinter, HiTrash } from "react-icons/hi";
import ConfirmDelete from "@/ui/ConfirmDelete";
import useDeleteSale from "../sale/useDeleteSale";
import SpinnerMini from "@/ui/SpinningMini";

function ProductDeliveryStatus() {
  const { deliveries, isLoading } = useDeliveries();
  const { isDeleting, deleteSale } = useDeleteSale();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const isWorking = isLoading | isDeleting;
  if (isWorking) return <SpinnerMini />;

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

  return (
    <div className="w-full">
      <h5 className="">Recent Deliveries</h5>
      {deliveries
        .filter((item) => item.action === "SALE")
        .map((item) => {
          const { invoiceNumber, saleItems, customer, totalAmount, discount } =
            item.sale;
          return (
            <div key={item.id}>
              <div className="grid grid-cols-[.7fr_.5fr_1.5fr] md:grid-cols-[.7fr_.5fr_1.3fr_.3fr_.3fr_.7fr_.1fr_.1fr_.1fr] text-sm gap-6 items-center">
                <p>
                  {item.action === "SALE" ? (
                    <DeliveryAccordian
                      invoice={item.sale?.invoiceNumber}
                      productList={item.sale?.saleItems}
                      action="SALE"
                    />
                  ) : (
                    <DeliveryAccordian
                      invoice={item.purchase?.invoiceNumber}
                      productList={item.purchase?.purchaseItems}
                      action="PURCHASE"
                    />
                  )}
                </p>

                <p>
                  {item.action === "SALE"
                    ? item.sale?.customer.name
                    : item.purchase?.supplier.name}
                </p>
                <p>{item.deliveryAddress}</p>

                <p>
                  {item.action === "SALE"
                    ? formatCurrency(Math.ceil(item.sale?.totalAmount))
                    : formatCurrency(Math.ceil(item.purchase?.totalAmount))}
                </p>

                <p className="text-red-800">
                  {format(item.deliveryDate, "dd MMM")}
                </p>
                <p
                  className={`py-2 px-1 text-center rounded-md cursor-pointer ${
                    item.deliveryStatus === "Order Received"
                      ? "bg-red-200 text-red-900 hover:text-whiter hover:bg-red-400"
                      : item.deliveryStatus === "Delivered"
                      ? "bg-green-200 text-green-900 hover:text-whiter hover:bg-green-400"
                      : item.deliveryStatus === "Returned"
                      ? "bg-violet-200 text-violet-900 hover:text-whiter hover:bg-violet-400"
                      : "bg-yellow-200 text-yellow-900 hover:text-whiter hover:bg-yellow-400"
                  }`}
                >
                  {item.deliveryStatus}
                </p>
                <Modal>
                  <Modal.Open opens="form">
                    <button className="hover:bg-slate-400 px-2 py-1 rounded-md hover:text-whiter">
                      <HiPencil />
                    </button>
                  </Modal.Open>
                  <Modal.Open opens="delete-sale">
                    <button className="hover:bg-red-400 px-2 py-1 rounded-md hover:text-whiter">
                      <HiTrash />
                    </button>
                  </Modal.Open>

                  <Modal.Window name="form">
                    <UpdateDeliveryForm deliveryToEdit={item} />
                  </Modal.Window>
                  <Modal.Window name="delete-sale">
                    <ConfirmDelete
                      resource="Sale"
                      disabled={isDeleting}
                      onConfirm={() => deleteSale(item.sale?.id)}
                    />
                  </Modal.Window>
                </Modal>
                <button className="hover:bg-purple-400 px-2 py-1 rounded-md hover:text-whiter">
                  <HiPrinter
                    onClick={() => {
                      handlePrint(() => componentRef.current);
                    }}
                  />
                </button>

                {/* <p>{formatCurrency(Math.ceil(item.customer.customer_due))}</p> */}
                <SalesInvoice
                  ref={componentRef}
                  data={saleItems}
                  columns={SalesItemscolumns}
                  customer={customer}
                  totalAmount={totalAmount}
                  discount={discount}
                  invoiceNumber={invoiceNumber}
                  delivery={item}
                  soldBy={item.sale.created_by}
                />
              </div>
              <Separator className="my-2" />
            </div>
          );
        })}
    </div>
  );
}

export default ProductDeliveryStatus;

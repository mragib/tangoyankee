import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/util";
import React from "react";

const Invoice = (props, ref) => {
  const {
    data,
    customer,
    totalAmount,
    invoiceNumber,
    discount,
    delivery,
    soldBy,
  } = props;

  return (
    <div className="px-10 mt-5 hidden-print" ref={ref}>
      <div className="w-auto ">
        <div className="flex flex-col items-center mb-5">
          <h1 className="text-3xl text-center font-bold">
            {soldBy.page_name ? soldBy.page_name : "Fatema Steel Corporation"}
          </h1>
          <h2 className="text-md font-medium">
            {soldBy.business_address
              ? soldBy.business_address
              : "Beribadh, Mohammadpur, Dhaka, Cell-01711 548748"}
          </h2>
          <h4 className="text-lg font-medium">Sales Invoice</h4>
          <hr />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-[1fr_.2fr_6fr] justify-start">
            <p>Invoice Number</p>
            <p>:</p>
            <p>{invoiceNumber}</p>
          </div>
          <div className="grid grid-cols-[1fr_.2fr_6fr]">
            <p>Customer Name</p>
            <p>:</p>
            <p>{customer.name}</p>
          </div>
          <div className="grid grid-cols-[1fr_.2fr_6fr]">
            <p>Bill to Address</p>
            <p>:</p>
            <p>{customer.address}</p>
          </div>
          <div className="grid grid-cols-[1fr_.2fr_6fr]">
            <p>Phone Number</p>
            <p>:</p>
            <p>{customer.phone}</p>
          </div>
          <div className="grid grid-cols-[1fr_.2fr_6fr]">
            <p>Email</p>
            <p>:</p>
            <p>{customer.email}</p>
          </div>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-left">Unit Price</TableHead>
              <TableHead className="text-left">Quantity</TableHead>

              <TableHead className="text-left">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((invoice, index) => (
              <SalesInvoiceItem
                items={invoice}
                index={index + 1}
                key={invoice.id}
              />
            ))}
            <TableRow>
              <TableCell colSpan={4}>Discount</TableCell>
              <TableCell className="font-bold">
                - {formatCurrency(discount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>Delivery Charge</TableCell>
              <TableCell className="font-bold">
                {formatCurrency(delivery.deliveryCharge)}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="font-bold">
                {formatCurrency(totalAmount + delivery.deliveryCharge)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

const SalesInvoiceItem = ({ items, index }) => {
  const { attribute } = items;

  const productName = attribute.instance.reduce(
    (acc, curr) => `${acc + curr.name} `,
    `${attribute.product.name}-`
  );
  return (
    <TableRow key={items.id}>
      <TableCell className="font-medium">{index}</TableCell>
      <TableCell className="text-left">{productName}</TableCell>
      <TableCell className="text-left">
        {formatCurrency(items.sellingUnitPrice)}
      </TableCell>
      <TableCell className="text-left px-4">{items.quantity}</TableCell>
      <TableCell className="text-left">
        {formatCurrency(items.quantity * items.sellingUnitPrice)}
      </TableCell>
    </TableRow>
  );
};

const SalesInvoice = React.forwardRef(Invoice);
export default SalesInvoice;

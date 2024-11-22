import Button from "@/ui/Button";
import DataTable from "@/ui/DataTable";
import { capitalizeFirstLetter } from "@/util";
import { useState } from "react";
import { HiArrowDown, HiArrowsUpDown, HiArrowUp } from "react-icons/hi2";

function DeliveryAccordian({ invoice, productList, action }) {
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
        return `${
          action === "SALE" ? row.sellingUnitPrice : row.buyingUnitPrice
        }`;
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
        return `${Math.ceil(
          action === "SALE"
            ? row.sellingUnitPrice * row.quantity
            : row.buyingUnitPrice * row.quantity
        )}`;
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
  const [isActive, setIsActive] = useState(false);
  return (
    <div>
      <div
        className="flex items-center gap-2"
        onClick={() => setIsActive(!isActive)}
      >
        <div>{invoice}</div>
        <div className="cursor-pointer">
          {isActive ? <HiArrowUp /> : <HiArrowDown />}
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out `}
      >
        <div className="transition-opacity duration-300 ease-in-out   ">
          {isActive && (
            <DataTable
              search={false}
              paginate={false}
              data={productList}
              columns={SalesItemscolumns}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryAccordian;

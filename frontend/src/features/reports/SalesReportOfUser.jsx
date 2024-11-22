import Spinner from "@/ui/Spinner";
import useUserSales from "./useUserSales";
import { capitalizeFirstLetter, formatCurrency } from "@/util";
import {
  endOfDay,
  format,
  isAfter,
  isBefore,
  isEqual,
  isWithinInterval,
} from "date-fns";
import SalesReportAction from "./SalesReportAction";
import Menus from "@/ui/Menus";

import SalesReportOperation from "./SalesReportOperation";
import { useSearchParams } from "react-router-dom";

function SalesReportOfUser() {
  const [searchParam] = useSearchParams();
  const startDate = searchParam.get("startDate") || null;
  const endDate = searchParam.get("endDate") || null;
  const status = searchParam.get("status") || null;
  const { isLoading, salesReportOfUser } = useUserSales();
  if (isLoading) return <Spinner />;

  let filterData = salesReportOfUser;
  // if (startDate && endDate && status)
  //   filterData = salesReportOfUser.filter((item) => item.status);

  if (startDate && endDate && status)
    filterData = salesReportOfUser.filter(
      (item) =>
        isWithinInterval(item.salesDate, {
          start: startDate,
          end: endOfDay(endDate),
        }) && item.delivery.deliveryStatus === status
    );
  else if (startDate && status) {
    filterData = salesReportOfUser.filter(
      (item) =>
        (isAfter(item.salesDate, startDate) ||
          isEqual(item.salesDate, startDate)) &&
        item.delivery.deliveryStatus === status
    );
  } else if (endDate && status)
    filterData = salesReportOfUser.filter(
      (item) =>
        (isBefore(item.salesDate, endOfDay(endDate)) ||
          isEqual(item.salesDate, endDate)) &&
        item.delivery.deliveryStatus === status
    );
  else if (startDate && endDate)
    filterData = salesReportOfUser.filter((item) =>
      isWithinInterval(item.salesDate, {
        start: startDate,
        end: endOfDay(endDate),
      })
    );
  else if (startDate)
    filterData = salesReportOfUser.filter(
      (item) =>
        isAfter(item.salesDate, startDate) || isEqual(item.salesDate, startDate)
    );
  else if (endDate)
    filterData = salesReportOfUser.filter(
      (item) =>
        isBefore(item.salesDate, endOfDay(endDate)) ||
        isEqual(item.salesDate, endDate)
    );
  else if (status)
    filterData = salesReportOfUser.filter(
      (item) => item.delivery.deliveryStatus === status
    );

  return (
    <div className="flex flex-col gap-2">
      <SalesReportOperation />
      <div className="md:grid hidden  grid-cols-[1fr_1fr_.5fr_.7fr_1fr_.5fr] py-2 px-4 ">
        <p className="text-title-sm uppercase ">Customer</p>
        <p className="text-title-sm uppercase">Invoice</p>
        <p className="text-title-sm uppercase">Amount</p>
        <p className="text-title-sm uppercase text-center">Status</p>
        <p className="text-title-sm uppercase">Address</p>
        <p className="text-title-sm uppercase">Action</p>
      </div>
      {filterData.map((sale) => {
        return (
          <div
            key={sale.id}
            className="grid md:grid-cols-[1fr_1fr_.5fr_.7fr_1fr_.5fr] grid-cols-1 gap-2 py-2 px-4 items-center border border-green-700  rounded-sm bg-white shadow-sm hover:shadow-lg hover:border-green-400"
          >
            <div>
              <p>{capitalizeFirstLetter(sale.customer.name)}</p>
              <p>{sale.customer.phone}</p>
            </div>
            <div>
              <p>{sale.invoiceNumber}</p>
              <p>{format(sale.salesDate, "MMM dd yyyy")}</p>
            </div>
            <p>{formatCurrency(sale.totalAmount)}</p>

            <p
              className={`py-2 text-center rounded-md cursor-pointer ${
                sale.delivery.deliveryStatus === "Order Received"
                  ? "bg-red-200 text-red-900 hover:text-whiter hover:bg-red-400"
                  : sale.delivery.deliveryStatus === "Delivered"
                  ? "bg-green-200 text-green-900 hover:text-whiter hover:bg-green-400"
                  : sale.delivery.deliveryStatus === "Returned"
                  ? "bg-violet-200 text-violet-900 hover:text-whiter hover:bg-violet-400"
                  : "bg-yellow-200 text-yellow-900 hover:text-whiter hover:bg-yellow-400"
              }`}
            >
              {sale.delivery.deliveryStatus}
            </p>

            <p>{sale.delivery.deliveryAddress}</p>
            <Menus>
              <SalesReportAction sale={sale} />
            </Menus>
          </div>
        );
      })}
    </div>
  );
}

export default SalesReportOfUser;

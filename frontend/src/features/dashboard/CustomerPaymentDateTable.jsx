import SpinnerMini from "@/ui/SpinningMini";
import useCustomerPaymentPlan from "./useCustomerPaymentPlan";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { formatCurrency } from "@/util";
import Empty from "@/ui/Empty";

function CustomerPaymentDateTable() {
  const { customerPaymentPlans, isLoading } = useCustomerPaymentPlan();
  if (isLoading) return <SpinnerMini />;
  if (!customerPaymentPlans.length)
    return <Empty resource="customer due date" />;
  return (
    <ScrollArea className="h-72 w-full rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-md font-bold text-center leading-none">
          Customer Payment Date
        </h4>
        {customerPaymentPlans.map((item) => (
          <div key={item.id}>
            <div className="grid grid-cols-[1fr_1fr_.5fr_1fr] text-sm gap-6">
              <p>{item.customer.name}</p>
              <p>{item.customer.phone}</p>

              <p className="text-red-800">
                {format(item.next_payment_date, "dd MMM")}
              </p>
              <p>{formatCurrency(Math.ceil(item.customer.customer_due))}</p>
            </div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default CustomerPaymentDateTable;

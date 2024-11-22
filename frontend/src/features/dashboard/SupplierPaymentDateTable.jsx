import SpinnerMini from "@/ui/SpinningMini";
import useSupplierPaymentPlan from "./useSupplierPaymentPlan";
import Empty from "@/ui/Empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { formatCurrency } from "@/util";
import { Separator } from "@radix-ui/react-separator";

function SupplierPaymentDateTable() {
  const { supplierPaymentPlans, isLoading } = useSupplierPaymentPlan();
  if (isLoading) return <SpinnerMini />;
  if (!supplierPaymentPlans.length)
    return <Empty resource="supplier due date" />;
  return (
    <ScrollArea className="h-72 w-full rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-md font-bold text-center leading-none">
          Supplier Payment Date
        </h4>
        {supplierPaymentPlans.map((item) => (
          <div key={item.id}>
            <div className="grid grid-cols-[1fr_1fr_.5fr_1fr] text-sm gap-6">
              <p>{item.supplier.name}</p>
              <p>{item.supplier.phone}</p>

              <p className="text-red-800">
                {format(item.next_payment_date, "dd MMM")}
              </p>
              <p>{formatCurrency(Math.ceil(item.supplier.supplier_due))}</p>
            </div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default SupplierPaymentDateTable;

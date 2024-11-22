import Spinner from "@/ui/Spinner";
import GeneralLedgerStats from "./GeneralLedgerStats";
import PaymentPlanLayout from "./PaymentPlanLayout";
import ProductDeliveryStatus from "./ProductDeliveryStatus";
import PurchaseChart from "./PurchaseChart";
import SalesChart from "./SalesChart";
import useAccountingReport from "./useAccountingReport";
import { useSelector } from "react-redux";

function DashboardLayout() {
  const { assets, isLoading } = useAccountingReport();
  const { user } = useSelector((state) => state.auth);

  if (isLoading) return <Spinner />;
  return assets.length ? (
    <div className="grid grid-col-5  gap-10">
      {(user?.role.name === "admin" || user?.role.name === "owner") && (
        <GeneralLedgerStats assets={assets} isLoading={isLoading} />
      )}
      {(user?.role.name === "admin" || user?.role.name === "owner") && (
        <SalesChart />
      )}

      <PurchaseChart />
      <ProductDeliveryStatus />
      <PaymentPlanLayout />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-title-xl">Welcome to new inventory system.</h1>
      <ol>
        <li>
          Start with insert all Chart of Accounting. (Contact Developer for
          upload General Ledger Heads)
        </li>
        <li>Add new branch</li>
        <li>
          Add new payment methods. cash acc code : 1310, bank accounts will be
          start from 1321, 1322....
        </li>
        <li>Add attribute sets. like brand, color,size</li>
        <li>
          Add product instance. like Nokia-- brand, samsung--brand, yellow --
          color, red-- color
        </li>
        <li>Add product. Mobile, Full sleave shirt, cargo Pant</li>
        <li>initial product storage. in manage product</li>
      </ol>
    </div>
  );
}

export default DashboardLayout;

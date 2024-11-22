import SalesReport from "@/features/reports/SalesReportOfUser";

function UserSalesReport() {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
        Sales report
      </h1>
      <SalesReport />
    </div>
  );
}

export default UserSalesReport;

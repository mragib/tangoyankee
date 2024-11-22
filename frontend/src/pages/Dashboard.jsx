import DashboardFilter from "@/features/dashboard/DashboardFilter";
import DashboardLayout from "@/features/dashboard/DashboardLayout";
import Row from "@/ui/Row";

function Dashboard() {
  return (
    <div className="min-h-screen">
      <Row type="horizontal" className="pb-2 md:pb-4">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 ">
          Dashboard
        </h1>
        <DashboardFilter />
      </Row>

      <DashboardLayout />
    </div>
  );
}

export default Dashboard;

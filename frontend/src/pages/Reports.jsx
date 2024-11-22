import DailyReport from "@/features/reports/DailyReport";
import FilterDate from "@/ui/FilterDate";

function Reports() {
  return (
    <div>
      <FilterDate />
      <DailyReport />
    </div>
  );
}

export default Reports;

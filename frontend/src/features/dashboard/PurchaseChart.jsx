import Spinner from "@/ui/Spinner";
import usePurchaseAndSalesReport from "./usePurchaseAndSalesReport";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Empty from "@/ui/Empty";

function PurchaseChart() {
  const { purchaseSalesReport, isLoading } = usePurchaseAndSalesReport();
  if (isLoading) return <Spinner />;
  const { purchases } = purchaseSalesReport;

  if (!purchases.length) return <Empty resource="Purchases" />;

  const productKeys = Array.from(
    new Set(purchases.flatMap(Object.keys))
  ).filter((key) => key !== "date");

  return (
    <div>
      <h2 className="text-title-sm text-center py-4">
        Purchases from {format(purchases.at(0).date, "MMM dd yyyy")} &mdash;
        {format(purchases.at(-1).date, "MMM dd yyyy")}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        {/* <AreaChart
          data={sales}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <Tooltip />
          <CartesianGrid />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(date, "MMM dd yyyy")}
          />

          <YAxis />
          {productKeys.map((key, index) => (
            <Area
              key={index}
              dataKey={key}
              type="monotone"
              fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
            />
          ))}
        </AreaChart> */}
        {/* <LineChart width={600} height={300} data={sales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {productKeys.map((key, index) => (
            <Line
              key={index}
              dataKey={key}
              type="monotone"
              fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
            />
          ))}
        </LineChart> */}
        <BarChart width="100%" height={400} data={purchases}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Replace with dynamic product names  */}
          {productKeys.map((key, index) => (
            <Bar
              key={index}
              dataKey={key}
              type="monotone"
              fill={`hsla(${Math.random() * 360}, 100%, 50%, .7)`}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PurchaseChart;

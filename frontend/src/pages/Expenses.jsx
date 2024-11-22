import ExpenseTable from "@/features/expense/ExpenseTable";
import ExpenseTableOperation from "@/features/expense/ExpenseTableOperation";

import Row from "@/ui/Row";

function Expenses() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Expenses
        </h1>
        <ExpenseTableOperation />
      </Row>
      <Row>
        <ExpenseTable />
      </Row>
    </>
  );
}

export default Expenses;

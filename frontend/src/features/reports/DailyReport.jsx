import Spinner from "@/ui/Spinner";
import useDailyReport from "./useDailyReport";
import { format } from "date-fns";
import Empty from "@/ui/Empty";
import { formatCurrency } from "@/util";
import { useSearchParams } from "react-router-dom";

function DailyReport() {
  const { isLoading, statement } = useDailyReport();
  const [searchParam] = useSearchParams();

  const startDate = searchParam.get("startDate") || null;
  const endDate = searchParam.get("endDate") || null;

  if (isLoading) return <Spinner />;

  if (!statement) return <Empty resource="Transactions" />;

  const { openingBalance, allTransactions, closingBalance, journal } =
    statement;

  const expense = allTransactions
    .filter((item) => item.transaction_type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.total_amount, 0);
  const payment = allTransactions
    .filter((item) => item.transaction_type === "PAYMENT")
    .reduce((acc, curr) => acc + curr.total_amount, 0);
  const total_sales = allTransactions
    .filter((item) => item.transaction_type === "RECEIPT")
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  const profit = total_sales - expense - payment;

  const accountPayable = journal.filter((item) => item.gl.code === 2100);
  const accountReceivable = journal.filter((item) => item.gl.code === 1200);

  const totalPayableAmount = accountPayable.reduce(
    (totals, journal) => {
      totals.dr_total += Number(journal.dr_amount);
      totals.cr_total += Number(journal.cr_amount);
      return totals;
    },
    { dr_total: 0, cr_total: 0 }
  );
  const totalReceivableAmount = accountReceivable.reduce(
    (totals, journal) => {
      totals.dr_total += Number(journal.dr_amount);
      totals.cr_total += Number(journal.cr_amount);
      return totals;
    },
    { dr_total: 0, cr_total: 0 }
  );

  return (
    <div>
      <h1 className="text-lg font-bold text-center pt-3 pb-2">
        {startDate && endDate
          ? `Statement of ${format(startDate, "MMM dd yyyy")} to ${format(
              endDate,
              "MMM dd yyyy"
            )}`
          : `Statement of ${startDate}`}
      </h1>
      <div className="grid grid-cols-[1fr_5fr_1fr] md:grid-cols-[1fr_.5fr_5fr_1fr]  border border-x-2 border-blue-400">
        <p className="text-lg font-bold p-1">Date</p>
        <p className="text-lg hidden md:block font-bold p-1">Code</p>
        <p className="text-lg font-bold p-1">Description</p>
        <p className="text-lg font-bold p-1">Amount</p>
      </div>
      {openingBalance.map((item) => (
        <div
          key={`openingBalance-${item.id}`}
          className="grid grid-cols-[1fr_5fr_1fr] md:grid-cols-[1fr_.5fr_5fr_1fr] border border-x-2 border-blue-400"
        >
          <p className="p-1">{format(item.date, "dd MMM yyyy")}</p>
          <p className="hidden md:block p-1">{item.chartOfAccounting.code}</p>
          <p className="p-1">
            Opening Balance of {item.chartOfAccounting.name}
          </p>
          <p className="p-1">{formatCurrency(item.opening_balance)}</p>
        </div>
      ))}
      {allTransactions.map((item) => {
        let classes = "p-1 ";
        let amount;
        const { transaction_type, journal } = item;
        if (
          transaction_type === "PAYMENT" ||
          transaction_type === "EXPENSE" ||
          transaction_type === "WITHDRAW"
        ) {
          amount = -item.total_amount;
          classes += "text-red-800 bg-red-100";
        } else if (
          transaction_type === "RECEIPT" ||
          transaction_type === "DEPOSIT"
        ) {
          amount = +item.total_amount;
          classes += "text-green-800 bg-green-100";
        } else if (transaction_type === "TRANSFER") {
          amount = +item.total_amount;
          classes += "text-green-800 bg-green-100";
        } else if (transaction_type === "ADJUSTMENT") {
          const status = item.description.includes("increase");
          amount = status ? +item.total_amount : -item.total_amount;
          status
            ? (classes += "text-green-800 bg-green-100")
            : (classes += "text-red-800 bg-red-100");
        } else {
          amount = +item.total_amount;
        }

        return transaction_type === "TRANSFER" ||
          transaction_type === "WITHDRAW" ||
          transaction_type === "DEPOSIT" ? (
          journal.map((jou) => {
            if (jou.dr_amount) {
              return (
                <div
                  key={`TRANSFER-${item.id}`}
                  className="grid grid-cols-[1fr_5fr_1fr] md:grid-cols-[1fr_.5fr_5fr_1fr] border border-x-2 border-blue-400"
                >
                  <p className="p-1">
                    {format(item.transaction_date, "dd MMM yyyy")}
                  </p>
                  <p className="hidden md:block p-1">{jou.gl.code}</p>
                  <p className="p-1">{item.description}</p>
                  <p className="text-green-800 bg-green-100 p-1">
                    {formatCurrency(jou.dr_amount)}
                  </p>
                </div>
              );
            }
            if (jou.cr_amount) {
              return (
                <div
                  key={`WITHDRAW-${item.id}`}
                  className="grid grid-cols-[1fr_5fr_1fr] md:grid-cols-[1fr_.5fr_5fr_1fr] border border-x-2 border-blue-400"
                >
                  <p className="p-1">
                    {format(item.transaction_date, "dd MMM yyyy")}
                  </p>
                  <p className="hidden md:block p-1">{jou.gl.code}</p>
                  <p className="p-1">{item.description}</p>
                  <p className="text-red-800 bg-red-100 p-1">
                    {formatCurrency(-jou.cr_amount)}
                  </p>
                </div>
              );
            }
          })
        ) : (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_5fr_1fr] md:grid-cols-[1fr_.5fr_5fr_1fr] border border-x-2 border-blue-400"
          >
            <p className="p-1">
              {format(item.transaction_date, "dd MMM yyyy")}
            </p>
            <AccountCode transaction={item} />
            <p className="p-1">
              {item.transaction_type === "EXPENSE"
                ? `${item.journal.map((ex) =>
                    ex.dr_amount > 0 ? ex.gl.name : ""
                  )} --- ${item.description}`
                : item.description}
            </p>

            <p className={`${classes}`}>{formatCurrency(amount)}</p>
          </div>
        );
      })}

      {closingBalance.map((item) => (
        <div
          key={`closingBalance-${item.code}`}
          className="grid grid-cols-[1fr_5fr_1fr] md:grid-cols-[1fr_.5fr_5fr_1fr] border border-x-2 border-blue-400"
        >
          <p className="p-1">{format(item.date, "dd MMM yyyy")}</p>
          <p className="hidden md:block p-1">{item.code}</p>
          <p className="p-1">Closing Balance of {item.account}</p>
          <p className="p-1">{formatCurrency(item.amount)}</p>
        </div>
      ))}

      <p
        className={`text-xl font-extrabold py-4 rounded ${
          profit < 0 ? "text-red-800 bg-red-100" : "text-green-800 bg-green-100"
        }`}
      >
        {`${profit < 0 ? "Loss" : "Profit"}  `} ={" "}
        {formatCurrency(Math.abs(profit))}
      </p>
      <p className={`text-xl font-extrabold py-4 rounded`}>
        Payable Amount ={" "}
        {formatCurrency(
          Math.abs(totalPayableAmount.dr_total - totalPayableAmount.cr_total)
        )}
      </p>
      <p className={`text-xl font-extrabold py-4 rounded`}>
        Receiable Amount =
        {formatCurrency(
          Math.abs(
            totalReceivableAmount.dr_total - totalReceivableAmount.cr_total
          )
        )}
      </p>
    </div>
  );
}

function AccountCode({ transaction }) {
  if (
    transaction.transaction_type === "PAYMENT" ||
    transaction.transaction_type === "EXPENSE" ||
    transaction.transaction_type === "WITHDRAW"
  ) {
    const item = transaction.journal.find((gl) => gl.cr_amount > 0);
    return <p className="hidden md:block p-1">{item.gl.code}</p>;
  } else if (
    transaction.transaction_type === "RECEIPT" ||
    transaction.transaction_type === "DEPOSIT"
  ) {
    const item = transaction.journal.find((gl) => gl.dr_amount > 0);
    return <p className="hidden md:block p-1">{item.gl.code}</p>;
  } else if (transaction.transaction_type === "TRANSFER") {
    const item1 = transaction.journal.find((gl) => gl.dr_amount > 0);
    const item2 = transaction.journal.find((gl) => gl.cr_amount > 0);
    return (
      <div>
        <p className="hidden md:block p-1">{item1.gl.code}</p>
        <p className="hidden md:block p-1">{item2.gl.code}</p>
      </div>
    );
  } else if (transaction.transaction_type === "SALE") {
    const item = transaction.journal.find((gl) => gl.dr_amount > 0);
    return <p className="hidden md:block p-1">{item.gl.code}</p>;
  } else if (transaction.transaction_type === "PURCHASE") {
    const item = transaction.journal.find((gl) => gl.dr_amount > 0);
    return <p className="hidden md:block p-1">{item.gl.code}</p>;
  } else if (transaction.transaction_type === "ADJUSTMENT") {
    const item = transaction.journal.find((gl) => gl.cr_amount > 0);
    return <p className="hidden md:block p-1">{item.gl.code}</p>;
  } else if (transaction.transaction_type === "OPENING_BALANCE") {
    const item = transaction.journal.find((gl) => gl.dr_amount > 0);
    return <p className="hidden md:block p-1">{item.gl.code}</p>;
  }
}

export default DailyReport;

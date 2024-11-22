import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import DefaultLayout from "./layout/DefaultLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./interceptors/axios.js";
import { Toaster } from "react-hot-toast";
import AttributeSet from "./pages/AttributeSet.jsx";
import Instances from "./pages/Instances";
import Product from "./pages/Product";
import Attribute from "./pages/Attribute";
import Storage from "./pages/Storage";
import Customers from "./pages/Customers";
import Customer from "./pages/Customer";
import Supplier from "./pages/Supplier";
import Suppliers from "./pages/Suppliers";
import Purchases from "./pages/Purchases";
import Purchase from "./pages/Purchase";
import PurchaseForm from "./features/purchase/PurchaseForm";
import Sales from "./pages/Sales";
import Sale from "./pages/Sale";
import CreateSaleForm from "./features/sale/CreateSaleForm";
import Users from "./pages/Users";
import RegistrationForm from "./features/authentication/RegistrationForm";
import ChartOfAccount from "./pages/ChartOfAccount";
import CreateChartofAccountingForm from "./features/chart-of-accounting/CreateChartofAccountingForm";
import BankAccount from "./pages/BankAccount";
import Expenses from "./pages/Expenses";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Branches from "./pages/Branches";
import UserProfile from "./pages/UserProfile";
import UserSalesReport from "./pages/UserSalesReport";

import EditSale from "./pages/EditSale";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 0 } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoutes>
                <DefaultLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products">
              <Route path="attribute-set" element={<AttributeSet />} />
              <Route path="allProducts" element={<Product />} />
              <Route path="instance" element={<Instances />}></Route>
              <Route path="attribute" element={<Attribute />} />
            </Route>
            <Route path="people">
              <Route path="customers" element={<Customers />} />
              <Route path="customer/:id" element={<Customer />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="supplier/:id" element={<Supplier />} />
            </Route>
            <Route path="storage" element={<Storage />} />
            <Route path="purchases">
              <Route index element={<Purchases />} />
              <Route path="create" element={<PurchaseForm />} />
              <Route path=":id" element={<Purchase />} />
            </Route>
            <Route path="sales">
              <Route index element={<Sales />} />
              <Route path="create" element={<CreateSaleForm />} />
              <Route path="edit/:id" element={<EditSale />} />
              <Route path=":id" element={<Sale />} />
            </Route>
            <Route path="users">
              <Route index element={<Users />} />
              <Route path="create" element={<RegistrationForm />} />
            </Route>
            <Route path="chart-of-accounting">
              <Route index element={<ChartOfAccount />} />
              <Route path="create" element={<CreateChartofAccountingForm />} />
            </Route>
            <Route path="bank-accounts">
              <Route index element={<BankAccount />} />
              {/* <Route path="create" element={<CreateChartofAccountingForm />} /> */}
            </Route>
            <Route path="transactions">
              <Route index element={<Transactions />} />
            </Route>
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/incomeStatement" element={<Reports />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/mysales" element={<UserSalesReport />} />
          </Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        className="bg-white text-['#374151'] dark: text-['#e5e7eb'] dark:bg-['#18212f']"
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "18px",
            maxWidth: "500px",
            padding: "16px 24px",
            // backgroundColor: "var(--color-grey-0)",
            // color: "var(--color-grey-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;

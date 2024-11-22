import { Controller, useFieldArray, useForm } from "react-hook-form";
import { HiOutlineTrash } from "react-icons/hi2";

import CreatableSelect from "../../ui/CreatableSelect";
import useSuppliers from "../supplier/useSuppliers";

import Spinner from "../../ui/Spinner";
import Input from "../../ui/Input";

import Button from "../../ui/Button";
import Select from "react-select";

import { useEffect, useState } from "react";
// import { useLocalStorageState } from "../../hooks/useLocalStorageState";

import useCreatePurchase from "./useCreatePurchase";
import usePaymentMethod from "../payment-method/usePaymentMethod";
import useLocalStorage from "@/hooks/useLocalStorage";
import { changeForDatabaseObject, formatCurrency } from "@/util";
import useAttribute from "../attribute/useAttribute";
import { format, formatDate, isAfter, parseISO, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import InputFloating from "@/ui/FloatingInput";
import {
  COMPANY_ADDRESS,
  DeliveryAction,
  deliveryStatusForSelect,
  PURCHASE_EXPENSE_CODE,
} from "@/static";
import { isEqual } from "lodash";
import useProductBuyingUnitPrice from "../sale/useProductBuyingUnitPrice";
import FormRow from "@/ui/FormRow";

const initialState = {
  totalAmount: 0,
  products: [{ quantity: "", unitPrice: "", netAmount: "" }],
  purchaseDate: new Date().toISOString().split("T")[0],
  totalPaid: 0,
};

function getTotalAmount(array) {
  return array.reduce((acc, { quantity, unitPrice }) => {
    const quantityValue = parseFloat(quantity || 0);
    const unitPriceValue = parseFloat(unitPrice || 0);
    let x = quantityValue * unitPriceValue;
    return acc + x;
  }, 0);
}

const today = format(new Date(), "yyyy-MM-dd");

function PurchaseForm({ onCloseModal }) {
  const [purchaseData, setPurchaseData] = useLocalStorage(
    "purchaseData",
    initialState
  );
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(purchaseData.products);
  const [isPaying, setIsPaying] = useState(false);
  const [isBank, setIsBank] = useState(false);
  const [isDue, setIsDue] = useState(false);
  const {
    register,
    handleSubmit,
    formState,
    control,
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: purchaseData ? { ...purchaseData } : { ...initialState },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });
  const { errors } = formState;

  useEffect(
    function () {
      const updatedTotalAmount = getTotalAmount(productDetails);

      // setTotalAmount(updatedTotalAmount);
      setValue("totalAmount", updatedTotalAmount.toFixed(2));
      const x = updatedTotalAmount.toFixed(2) - getValues().totalPaid;
      setValue("totalPayable", x.toFixed(2));
    },
    [productDetails, setValue, getValues]
  );

  const { suppliers, isLoading: supplierLoading } = useSuppliers();
  // const { products: productList, isLoading: productLoading } = useProduct();
  const { attribute: productList, isLoading: productLoading } = useAttribute();
  const { createPurchase, isCreating } = useCreatePurchase();
  const { paymentMethods, isLoading: paymentMethodLoading } =
    usePaymentMethod();

  const {
    buyingUnitPrice: buyingUnitPriceDB,
    isLoading: productBuyingUnitPriceLoading,
  } = useProductBuyingUnitPrice();

  const isWorking =
    supplierLoading |
    productLoading |
    isCreating |
    paymentMethodLoading |
    productBuyingUnitPriceLoading;
  if (isWorking) return <Spinner />;

  const remapped = productList
    .filter((product) => product.storage.is_active)
    .map((product) => {
      const productInstances = product.instance.map((item) => item.name);

      return {
        name: `${product.product.name}--${productInstances}`,
        id: product.id,
      };
    });
  const filterSuppliers = suppliers.filter((item) => item.status === true);
  const filterPaymentMethods = paymentMethods.filter(
    (item) => item.is_active === true
  );

  function calculateNetAmount(index) {
    const newQuantity =
      parseFloat(getValues(`products[${index}].quantity`)) || 0;
    const newUnitPrice =
      parseFloat(getValues(`products[${index}].unitPrice`)) || 0;

    const netAmount = newQuantity * newUnitPrice;
    setValue(`products[${index}].netAmount`, netAmount.toFixed(2));
    setProductDetails((prev) => {
      const updatedDetails = [...prev];
      updatedDetails[index] = {
        quantity: newQuantity,
        unitPrice: newUnitPrice,
      };

      return updatedDetails;
    });
  }

  function saveOnStore(index) {
    const newProduct = getValues(`products[${index - 1}].product`);
    const newQuantity =
      parseFloat(getValues(`products[${index - 1}].quantity`)) || 0;
    const newUnitPrice =
      parseFloat(getValues(`products[${index - 1}].unitPrice`)) || 0;

    if (newQuantity && newUnitPrice) {
      const product = purchaseData.products.filter(
        (item) => item.netAmount !== "" || item.index === index - 1
      );

      const updateProduct = [
        ...product,
        {
          index: index - 1,
          product: newProduct,
          quantity: newQuantity,
          unitPrice: newUnitPrice,
          netAmount: (newQuantity * newUnitPrice).toFixed(2),
        },
      ];

      const updateData = {
        ...initialState,
        products: updateProduct,
        totalAmount: getTotalAmount(updateProduct),
      };

      setPurchaseData(updateData);

      return append({
        product: "",
        unitPrice: "",
        quantity: "",
        netAmount: "",
      });
    }
  }

  function onChangeProductHandler(e, index) {
    const product = productList.find((item) => item.id === e.value);

    const lastPrice = buyingUnitPriceDB.find(
      (item) => item.attributeId === e.value
    );

    setValue(
      `products[${index}].lastBuyingPrice`,
      lastPrice.lastBuyingUnitPrice
    );
    setValue(
      `products[${index}].maxQuantity`,
      `${product.storage.quantity} ${product.product.unit}`
    );
  }

  const onsubmit = (data) => {
    const {
      supplier,
      products,
      totalPaid,
      purchaseDate,
      paymentMethod,
      cheque_number,
      next_payment_date,
      deliveryAddress,
      deliveryDate,
      deliveryStatus,
    } = data;

    const newSupplier = changeForDatabaseObject(supplier);

    const newPaymentMethod = changeForDatabaseObject(paymentMethod);

    const totalAmount = getTotalAmount(products);
    // const totalPayable = totalAmount - totalPaid;
    const invoiceNumber = `${formatDate(Date.now(), "yyyyMMdd")}-${Math.round(
      Math.random() * 1000000
    )} `;

    const purchaseItems = products.map((item) => {
      const { product } = item;

      const updatedProduct = changeForDatabaseObject(product);
      return {
        ...item,
        quantity: +item.quantity,
        buyingUnitPrice: item.unitPrice.toString(),
        attribute: updatedProduct,
        lot_quantity: +item.quantity,
      };
    });
    const newData = {
      supplier: newSupplier,
      totalAmount: Math.ceil(totalAmount).toString(),
      invoiceNumber,
      purchaseItems,
      purchaseDate,
      payment: [
        {
          paymentDate: purchaseDate,
          amountPaid: totalPaid,
          // amountPayable: totalPayable,
          supplier: newSupplier,
          account: newPaymentMethod,
          cheque_number,
        },
      ],
      supplierPaymentPlan: isDue
        ? {
            next_payment_date,
          }
        : null,
      delivery: {
        deliveryAddress,
        deliveryDate,
        deliveryStatus: deliveryStatus.label,
        action: DeliveryAction.PURCHASE,
      },
      // purchaseExpense: {
      //   credit_account: newPaymentMethod,
      //   debit_account: PURCHASE_EXPENSE_CODE,
      //   amount: Number(data.expenseAmount),
      //   description: `Purchase Expenses ${formatCurrency(
      //     data.expenseAmount
      //   )} of invoice${invoiceNumber}`,
      //   expenseDate: purchaseDate,
      // },
    };
    setPurchaseData(initialState);
    createPurchase(
      { ...newData },
      {
        onSuccess: () => {
          reset;
          navigate("/purchases", { replace: true });
          onCloseModal?.();
        },
      }
    );
  };

  const onError = (e) => {
    console.error(e);
  };

  return (
    <form onSubmit={handleSubmit(onsubmit, onError)}>
      <h1 className="text-4xl flex items-center justify-center pb-4">
        Purchase Form
      </h1>
      <div className="grid grid-col-1 md:grid-col-2 gap-4">
        <div className="bg-transparent border border-primary shadow-md p-4 rounded-md hover:shadow-2xl transition-all delay-75">
          <h5 className="text-lg font-semibold text-center">
            Supplier Information
          </h5>
          <FormRow
            label="Supplier"
            error={errors?.supplier?.message}
            orientation="purchase"
          >
            <Controller
              name="supplier"
              control={control}
              rules={{ required: true }}
              render={({ field: { ref, ...field } }) => (
                <CreatableSelect
                  {...field}
                  data={filterSuppliers}
                  refs={ref}
                  multiple={false}
                  error={errors?.supplier}
                />
              )}
            />
          </FormRow>
          <FormRow
            label="Delivery Address"
            error={errors?.deliveryAddress?.message}
          >
            <textarea
              id="deliveryAddress"
              defaultValue={COMPANY_ADDRESS}
              className={` p-1 h-20 w-full mt-0 good resize-none ${
                errors?.deliveryAddress ? "border-red-300" : "bg-gray-200"
              }`}
              {...register("deliveryAddress", {
                required: "This field is required",
              })}
            />
          </FormRow>
          <FormRow label="Delivery Date" error={errors?.deliveryDate?.message}>
            <Controller
              name="deliveryDate"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, ...field } }) => (
                <Input
                  {...field}
                  id="deliveryDate"
                  type="date"
                  error={errors?.deliveryDate}
                  min={today}
                  onChange={(e) => {
                    onChange(e);

                    const today = startOfDay(new Date());
                    const inputDate = startOfDay(parseISO(e.target.value));

                    const isToday = isEqual(inputDate, today);
                    const isFutureDate = isAfter(inputDate, today);

                    // Set delivery status based on the date selected
                    if (isToday) {
                      setValue("deliveryStatus", {
                        value: "Delivered",
                        label: "Delivered",
                      });
                    } else if (isFutureDate) {
                      setValue("deliveryStatus", {
                        value: "OrderReceived",
                        label: "Order Received",
                      });
                    }
                  }}
                />
              )}
            />
          </FormRow>
          <FormRow
            label="Delivery Status"
            error={errors?.deliveryStatus?.message}
          >
            <Controller
              name="deliveryStatus"
              control={control}
              rules={{ required: "This is required" }}
              render={({ field: { ref, ...field } }) => (
                <Select
                  {...field}
                  options={deliveryStatusForSelect}
                  refs={ref}
                  multiple={false}
                />
              )}
            />
          </FormRow>
        </div>
        {/* payment information */}
        <div className="bg-transparent border border-danger shadow-md p-4 rounded-md hover:shadow-2xl transition-all delay-75">
          <FormRow label="Purchase Date" error={errors?.purchaseDate?.message}>
            <Input
              type="date"
              id="purchaseDate"
              {...register("purchaseDate", {
                required: true,
              })}
              error={errors?.purchaseDate}
            />
          </FormRow>
          <FormRow label="Total Amount" error={errors?.totalAmount?.message}>
            <Controller
              name="totalAmount"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Total Amount"
                  readOnly
                  // value={totalAmount}
                />
              )}
            />
          </FormRow>
          <FormRow label="Total Paid" error={errors?.totalPaid?.message}>
            <Controller
              name="totalPaid"
              control={control}
              rules={{
                validate: (value) => {
                  return (
                    +value <= +Math.ceil(getValues().totalAmount) ||
                    `You can not pay more  than ${getValues().totalAmount} bill`
                  );
                },
                min: { value: 1 },
              }}
              render={({ field: { onChange, ...field } }) => (
                <Input
                  {...field}
                  type="number"
                  error={errors?.totalPaid}
                  placeholder="Total Paid"
                  onChange={(e) => {
                    onChange(e);
                    const payable = getValues().totalAmount - e.target.value;
                    setValue("totalPayable", Math.ceil(payable));
                    e.target.value > 0 ? setIsPaying(true) : setIsPaying(false);

                    payable > 0 ? setIsDue(true) : setIsDue(false);
                  }}
                />
              )}
            />
          </FormRow>
          <FormRow label="Total Payable" error={errors?.payable?.message}>
            <Controller
              name="totalPayable"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Total Payable"
                  readOnly
                />
              )}
            />
          </FormRow>
          {/* <FormRow
            label="Purchase Expense Amount"
            error={errors?.expenseAmount?.message}
          >
            <Controller
              name="expenseAmount"
              control={control}
              render={({ field }) => (
                <Input {...field} type="number" placeholder="Expense Amount" />
              )}
            />
          </FormRow> */}

          {isPaying && (
            <FormRow
              label="Payment Method"
              error={errors?.paymentMethod?.message}
            >
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field: { onChange, ref, ...field } }) => (
                  <CreatableSelect
                    {...field}
                    data={filterPaymentMethods}
                    refs={ref}
                    multiple={false}
                    onChange={(e) => {
                      onChange(e);
                      const bank = paymentMethods.find(
                        (item) => item.name === e.label
                      );
                      bank.type === "bank" ? setIsBank(true) : setIsBank(false);
                    }}
                  />
                )}
              />
            </FormRow>
          )}
          {isBank && (
            <FormRow>
              <Controller
                name="cheque_number"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="text" placeholder="Cheque number" />
                )}
              />
            </FormRow>
          )}
          {isDue > 0 && (
            <FormRow
              label="Next Payment Date"
              error={errors?.next_payment_date?.message}
            >
              <Input
                type="date"
                id="next_payment_date"
                {...register("next_payment_date", {
                  required: "This field is required",
                })}
              />
            </FormRow>
          )}
        </div>

        {/* <ProductItem /> */}
        <div className="bg-zinc-300 p-4 border col-span-1 lg:col-span-2 border-primary shadow-md rounded-md hover:shadow-2xl transition-all delay-75">
          <h5 className="text-lg font-semibold text-center py-2">Products</h5>
          {fields.map((field, index) => (
            <div
              className={`grid my-2 md:my-0 border md:border-none md:p-0 rounded-lg p-6 border-lime-700 hover:shadow-lg transition-all delay-75 gap-x-7 gap-y-5 items-center grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_1fr_.5fr]`}
              key={field.id}
            >
              <Controller
                name={`products[${index}].product`}
                control={control}
                placeholder="Product"
                rules={{ required: true }}
                render={({ field: { ref, onChange, ...field } }) => (
                  <CreatableSelect
                    {...field}
                    error={
                      !!errors.products &&
                      errors.products[index] &&
                      errors.products[index].product
                    }
                    refs={ref}
                    data={remapped}
                    multiple={false}
                    onChange={(e) => {
                      const obj = getValues("products");

                      // const products = obj.map((item) => item.product);
                      // setSelectedProducts((prev) => [...products]);
                      onChange(e);
                      onChangeProductHandler(e, index);
                    }}
                  />
                )}
              />

              {/* <Controller
              name={`products[${index}].quantity`}
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value, ...field } }) => (
                <InputFloating
                  {...field}
                  type="number"
                  placeholder="quantity"
                  error={
                    !!errors.products &&
                    errors.products[index] &&
                    errors.products[index].quantity
                  }
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    calculateNetAmount(index);
                    // You may want to keep the following line if you still want the default behavior
                  }}
                />
              )}
            /> */}
              <div className="relative py-3">
                <Controller
                  name={`products[${index}].quantity`}
                  control={control}
                  rules={{
                    required: { value: true },
                  }}
                  render={({ field: { ref, onChange, ...field } }) => (
                    <InputFloating
                      {...field}
                      className="pl-4 pr-16 py-2 border border-gray-300 rounded-md w-full"
                      type="number"
                      placeholder="quantity"
                      error={
                        !!errors.products &&
                        errors.products[index] &&
                        errors.products[index].quantity
                      }
                      onChange={(e) => {
                        onChange(e);
                        calculateNetAmount(index);
                        // You may want to keep the following line if you still want the default behavior
                      }}
                    />
                  )}
                />

                <Controller
                  name={`products[${index}].maxQuantity`}
                  control={control}
                  render={({ field: { ref, value, ...field } }) => (
                    <span
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 ${
                        getValues(`products[${index}].product`)
                          ? "block"
                          : "hidden"
                      } ${
                        errors?.products?.[index]?.quantity && " text-red-700"
                      }`}
                      {...field}
                    >
                      {value}
                    </span>
                  )}
                />
              </div>
              <div className="relative py-3">
                <Controller
                  name={`products[${index}].unitPrice`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value, ...field } }) => (
                    <InputFloating
                      {...field}
                      type="number"
                      className="pl-4 pr-16 py-2 border border-gray-300 rounded-md w-full"
                      placeholder="Unit Price"
                      step=".01"
                      error={
                        !!errors.products &&
                        errors.products[index] &&
                        errors.products[index].unitPrice
                      }
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                        calculateNetAmount(index);
                      }}
                    />
                  )}
                />
                <Controller
                  name={`products[${index}].lastBuyingPrice`}
                  control={control}
                  render={({ field: { ref, value, ...field } }) => (
                    <span
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 ${
                        getValues(`products[${index}].product`)
                          ? "block"
                          : "hidden"
                      } ${
                        errors?.products?.[index]?.quantity && " text-red-700"
                      }`}
                      {...field}
                    >
                      {value}
                    </span>
                  )}
                />
              </div>
              <Controller
                name={`products[${index}].netAmount`}
                control={control}
                render={({ field }) => (
                  <InputFloating
                    {...field}
                    type="number"
                    placeholder="Net Amount"
                    readOnly
                  />
                )}
              />

              {fields.length > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variation="danger"
                    sizes="small"
                    onClick={() => {
                      setProductDetails((prev) => {
                        const updatedDetails = [...prev];
                        updatedDetails.splice(index, 1);
                        return updatedDetails;
                      });

                      return remove(index);
                    }}
                  >
                    <HiOutlineTrash />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              saveOnStore(fields.length);
            }}
          >
            Add Product
          </Button>
          <Button variation="danger" type="submit">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}

export default PurchaseForm;

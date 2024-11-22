import useSale from "./useSale";
import Spinner from "@/ui/Spinner";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import CreatableSelect from "@/ui/CreatableSelect";
import InputFloating from "@/ui/FloatingInput";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import { HiOutlineTrash } from "react-icons/hi2";
import FormRow from "@/ui/FormRow";
import { format } from "date-fns";
import Select from "react-select";
import CustomerCreatableSelect from "react-select/creatable";
import {
  DeliveryAction,
  DeliveryCharge,
  deliveryStatusForSelect,
} from "@/static";
import {
  capitalizeFirstLetter,
  changeCustomerDatabaseObject,
  changeForDatabaseObject,
  changeForSelectObject,
  getTotalAmount,
} from "@/util";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import useEditSale from "./useEditSale";
import SpinnerMini from "@/ui/SpinningMini";

const initialState = {
  totalAmount: 0,
  products: [{ quantity: "", netAmount: "" }],
  salesDate: new Date().toISOString().split("T")[0],
  totalPaid: 0,
  phone_number: { label: "", value: "" },
  customer_name: "",
  address: "",
};

function EditSaleForm({ sale, productList, paymentMethods }) {
  const { delivery, customer, salesDate, saleRevenue, saleItems } = sale;
  const { editSale, isEditing: saleEditing } = useEditSale();

  const [isPaying, setIsPaying] = useState(true);
  const [isBank, setIsBank] = useState(
    saleRevenue.at(0).account.type === "bank"
  );
  const [isDue, setIsDue] = useState(false);

  const customerObject = {
    label: customer.phone,
    value: customer.id,
  };

  const editiablePaymentMethod = changeForSelectObject(
    saleRevenue.at(0).account
  );

  const totalPaidEditiable = saleRevenue.reduce(
    (acc, curr) => acc + curr.amountPaid,
    0
  );

  const editiableTotalAmount = sale.totalAmount + sale.discount;

  const totalReceiableEditiable =
    editiableTotalAmount - totalPaidEditiable - sale.discount;

  const editiableProduct = saleItems.map((item) => {
    const attributeInstances = item.attribute.instance;
    const productLabel = [
      item.attribute.product.name,
      ...attributeInstances.map((instance) => instance.name),
    ].join(", ");
    const max = productList.find((prod) => prod.id === item.attribute.id);
    return {
      quantity: item.quantity.toString(),
      netAmount: (item.quantity * item.sellingUnitPrice).toFixed(2),
      product: {
        label: capitalizeFirstLetter(productLabel),
        value: item.attribute.id,
      },
      maxQuantity: `${max.storage.quantity} ${max.product.unit}`,
      unitPrice: item.sellingUnitPrice,
    };
  });

  const [salesData, setSalesData] = useLocalStorage("saleData", initialState);
  const [productDetails, setProductDetails] = useState(editiableProduct);

  const {
    register,
    handleSubmit,
    formState,
    control,
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      totalAmount: editiableTotalAmount,
      discount: sale.discount,
      products: editiableProduct,
      customer: customerObject,
      salesDate: format(salesDate, "yyyy-MM-dd"),
      address: customer.address,
      customer_name: customer.name,
      sameAddress: delivery.deliveryAddress === customer.address,
      deliveryAddress: delivery.deliveryAddress,
      deliveryStatus: deliveryStatusForSelect.find(
        (item) => item.value === delivery.deliveryStatus
      ),
      deliveryDate: format(delivery.deliveryDate, "yyyy-MM-dd"),
      deliveryCharge: DeliveryCharge.find(
        (item) => item.value == delivery.deliveryCharge
      ),
      totalPaid: totalPaidEditiable,
      totalPayable: totalReceiableEditiable,
      paymentMethod: editiablePaymentMethod,
      cheque_number: saleRevenue.at(0).cheque_number,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });
  const today = format(new Date(), "yyyy-MM-dd");
  const { errors } = formState;

  const remapped = productList.map((product) => {
    const productInstances = product.instance.map((item) => item.name);

    return {
      name: `${product.product.name}--${productInstances}`,
      id: product.id,
    };
  });

  function onChangeProductHandler(e, index) {
    const product = productList.find((item) => item.id === e.value);

    setValue(`products[${index}].unitPrice`, product.sellingUnitPrice);
    setValue(
      `products[${index}].maxQuantity`,
      `${product.storage.quantity} ${product.product.unit}`
    );
    calculateNetAmount(index);
  }

  function calculateNetAmount(index) {
    const newQuantity =
      parseFloat(getValues(`products[${index}].quantity`)) || 0;
    const newUnitPrice =
      parseFloat(getValues(`products[${index}].unitPrice`)) || 0;

    const netAmount = (newQuantity * newUnitPrice).toFixed(2);

    setValue(`products[${index}].netAmount`, netAmount);
    setProductDetails((prev) => {
      const updatedDetails = [...prev];
      updatedDetails[index] = {
        quantity: newQuantity,
        unitPrice: newUnitPrice,
      };

      return updatedDetails;
    });
  }

  useEffect(
    function () {
      const updatedTotalAmount = getTotalAmount(productDetails);

      setValue("totalAmount", updatedTotalAmount.toFixed(2));
      setValue(
        "totalPayable",
        (updatedTotalAmount - getValues().totalPaid).toFixed(2)
      );
    },
    [productDetails, setValue, getValues]
  );

  const isWorking = saleEditing;
  if (isWorking) return <SpinnerMini />;

  function saveOnStore(index) {
    const newProduct = getValues(`products[${index - 1}].product`);

    const newQuantity =
      parseFloat(getValues(`products[${index - 1}].quantity`)) || 0;
    const newUnitPrice =
      parseFloat(getValues(`products[${index - 1}].unitPrice`)) || 0;

    if (newQuantity && newUnitPrice) {
      const product = salesData.products.filter(
        (item) => item.netAmount !== "" || item.index === index - 1
      );

      // setSelectedProducts((prev) => [...prev, newProduct]);

      const updateProduct = [
        ...product,
        {
          index: index - 1,
          product: newProduct,
          quantity: newQuantity,
          unitPrice: newUnitPrice,
          netAmount: newQuantity * newUnitPrice,
        },
      ];

      const updateData = {
        ...initialState,
        phone_number: getValues("phone_number"),
        address: getValues("address"),
        customer_name: getValues("customer_name"),
        products: updateProduct,
        totalAmount: getTotalAmount(updateProduct),
      };

      setSalesData(updateData);

      return append({
        product: "",
        unitPrice: "",
        quantity: "",
        netAmount: "",
      });
    }
  }

  function onsubmit(data) {
    const {
      customer: saleCustomer,
      products,
      totalPaid,
      discount,
      salesDate,
      paymentMethod,
      cheque_number,
      address,
      next_payment_date,
      deliveryAddress,
      deliveryDate,
      deliveryStatus,
      deliveryCharge,
    } = data;

    const newCustomer = changeCustomerDatabaseObject(saleCustomer);
    const newPaymentMethod = changeForDatabaseObject(paymentMethod);
    const totalAmount = getTotalAmount(products) - discount;

    const saleItems = products.map((item) => {
      const { product } = item;

      const updatedProduct = changeForDatabaseObject(product);

      return {
        ...item,
        sellingUnitPrice: item.unitPrice,
        attribute: updatedProduct,
      };
    });
    const updatingData = {
      customer: { id: newCustomer.id },
      totalAmount: totalAmount.toString(),
      discount: discount.toString(),
      saleItems,
      saleRevenue: [
        {
          paymentDate: salesDate,
          amountPaid: totalPaid,
          account: newPaymentMethod,
          customer: { id: newCustomer.id },
          cheque_number,
        },
      ],
      customerPaymentPlan: isDue
        ? {
            next_payment_date,
          }
        : null,
      delivery: {
        deliveryAddress,
        deliveryDate,
        deliveryStatus: deliveryStatus.label,
        action: DeliveryAction.SALE,
        deliveryCharge: deliveryCharge.value,
      },
    };
    editSale({
      updatedSale: updatingData,
      id: sale.id,
    });
  }

  const filterPaymentMethods = paymentMethods.filter(
    (item) => item.is_active === true
  );

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <h1 className="text-4xl flex items-center justify-center pb-4">
        Sales Form
      </h1>

      <div className="grid  md:grid-col-2 gap-4">
        {/* product information */}
        <div className="bg-zinc-300 p-4 border col-span-1 lg:col-span-2 border-primary shadow-md rounded-md hover:shadow-2xl transition-all delay-75">
          <h5 className="text-lg font-semibold text-center py-2">Products</h5>
          {fields.map((field, index) => (
            <div
              className={`grid my-2 md:my-0 border md:border-none md:p-0 rounded-lg p-6 border-lime-700 hover:shadow-lg transition-all delay-75 gap-x-7 gap-y-5 items-center grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_.5fr]`}
              key={field.id}
            >
              <Controller
                name={`products[${index}].product`}
                control={control}
                placeholder="Product"
                rules={{ required: "This is required" }}
                render={({ field: { ref, onChange, ...field } }) => (
                  <CreatableSelect
                    {...field}
                    refs={ref}
                    data={remapped}
                    multiple={false}
                    className={
                      errors?.product
                        ? `transition-all delay-75 invalid`
                        : "transition-all delay-75"
                    }
                    onChange={(e) => {
                      //   const obj = getValues("products");

                      //   const products = obj.map((item) => item.product);
                      //   setSelectedProducts((prev) => [...products]);
                      onChange(e);
                      onChangeProductHandler(e, index);
                    }}
                  />
                )}
              />

              <div className="relative py-3">
                <Controller
                  name={`products[${index}].quantity`}
                  control={control}
                  rules={{
                    required: { value: true },
                    validate: (value) => {
                      let maxValue = getValues(
                        `products[${index}].maxQuantity`
                      );
                      maxValue = maxValue.split(" ")[0];

                      return (
                        +value <= +maxValue ||
                        "Quantity can not be greater than Inventory"
                      );
                    },
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

              <Controller
                name={`products[${index}].unitPrice`}
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field: { ref, onChange, value, ...field } }) => (
                  <InputFloating
                    {...field}
                    type="number"
                    placeholder="Unit Price"
                    value={value}
                    error={
                      !!errors.products &&
                      errors.products[index] &&
                      errors.products[index].unitPrice
                    }
                    step=".01"
                    onChange={(e) => {
                      onChange(e);
                      calculateNetAmount(index);
                    }}
                  />
                )}
              />

              <Controller
                name={`products[${index}].netAmount`}
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Input
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
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                saveOnStore(fields.length);
              }}
            >
              Add Product
            </Button>
            <Button
              variation="danger"
              onClick={() => {
                // setSalesData(initialState), reset;
              }}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* customer information */}
        <div className="bg-transparent border border-primary shadow-md p-4 rounded-md hover:shadow-2xl transition-all delay-75">
          <h5 className="text-lg font-semibold text-center">
            Customar Information
          </h5>

          <FormRow label="Customer Phone" error={errors?.customer?.message}>
            <Controller
              name="customer"
              control={control}
              rules={{ required: "This is required" }}
              render={({ field: { ref, onChange, ...field } }) => (
                <CustomerCreatableSelect
                  {...field}
                  ref={ref}
                  isClearable
                  isDisabled={true}
                  onChange={(e) => {
                    onChange(e);
                    // if (e) {
                    //   const foundCustomer = customers.find(
                    //     (customer) => customer.phone === e.label
                    //   );

                    //   foundCustomer
                    //     ? setValue("address", foundCustomer.address)
                    //     : setValue("address", "");
                    //   foundCustomer
                    //     ? setValue("customer_name", foundCustomer.name)
                    //     : setValue("customer_name", "");
                    // }
                  }}
                />
              )}
            />
          </FormRow>
          <FormRow label="Customer Name" error={errors?.customer_name?.message}>
            <Controller
              name="customer_name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="customer_name"
                  type="text"
                  placeholder="Customer Name"
                />
              )}
            />
          </FormRow>
          <FormRow label="Address" error={errors?.address?.message}>
            <textarea
              id="address"
              className={` p-1 h-20 w-full mt-0 good resize-none ${
                errors?.address ? "border-red-300" : "bg-gray-200"
              }`}
              {...register("address", {
                required: "This field is required",
              })}
            />
          </FormRow>
          <div className="flex items-center gap-4 ">
            <p>Same as address</p>
            <Controller
              name="sameAddress"
              defaultValue={false}
              control={control}
              render={({ field: { onChange, ...field } }) => (
                <input
                  {...field}
                  type="checkbox"
                  id="sameAddress"
                  onChange={(e) => {
                    onChange(e);
                    if (e.target.checked)
                      setValue("deliveryAddress", getValues().address);
                    else setValue("deliveryAddress", null);
                  }}
                />
              )}
            />
          </div>
          <FormRow
            label="Delivery Address"
            error={errors?.deliveryAddress?.message}
          >
            <textarea
              id="deliveryAddress"
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
                    setValue("deliveryStatus", {
                      value: "OrderReceived",
                      label: "Order Received",
                    });

                    // const today = startOfDay(new Date());
                    // const inputDate = startOfDay(parseISO(e.target.value));

                    // const isToday = isEqual(inputDate, today);
                    // const isFutureDate = isAfter(inputDate, today);

                    // // Set delivery status based on the date selected
                    // if (isToday) {
                    //   setValue("deliveryStatus", {
                    //     value: "Delivered",
                    //     label: "Delivered",
                    //   });
                    // } else if (isFutureDate) {
                    //   setValue("deliveryStatus", {
                    //     value: "OrderReceived",
                    //     label: "Order Received",
                    //   });
                    // }
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
          <FormRow
            label="Delivery Charge"
            error={errors?.deliveryCharge?.message}
          >
            <Controller
              name="deliveryCharge"
              control={control}
              rules={{ required: true }}
              render={({ field: { ref, ...field } }) => (
                <Select
                  {...field}
                  options={DeliveryCharge}
                  refs={ref}
                  multiple={false}
                />
              )}
            />
          </FormRow>
        </div>
        {/* payment information */}
        <div className="bg-transparent border border-danger shadow-md p-4 rounded-md hover:shadow-2xl transition-all delay-75">
          <h5 className="text-lg font-semibold text-center py-3">
            Payment Information
          </h5>
          <div>
            <FormRow label="Sales Date" error={errors?.salesDate?.message}>
              <Input
                type="date"
                id="salesDate"
                {...register("salesDate", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow label="Total Amount" error={errors?.totalAmount?.message}>
              <Controller
                name="totalAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="totalAmount"
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
                  min: { value: 1 },
                  validate: (value) =>
                    +value <= +getValues().totalAmount ||
                    `You can not pay more  than ${
                      getValues().totalAmount
                    } bill`,
                }}
                render={({ field: { onChange, ...field } }) => (
                  <Input
                    {...field}
                    id="totalPaid"
                    type="number"
                    placeholder="Total Paid"
                    error={errors?.totalPaid}
                    onChange={(e) => {
                      onChange(e);
                      const payable =
                        getValues().totalAmount -
                        getValues().discount -
                        e.target.value;
                      setValue("totalPayable", Math.ceil(payable));
                      e.target.value > 0
                        ? setIsPaying(true)
                        : setIsPaying(false);

                      payable > 0 ? setIsDue(true) : setIsDue(false);
                    }}
                  />
                )}
              />
            </FormRow>

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

                        bank.type === "bank"
                          ? setIsBank(true)
                          : setIsBank(false);
                      }}
                    />
                  )}
                />
              </FormRow>
            )}
            {isBank && (
              <FormRow
                label="Cheque number"
                error={errors?.cheque_number?.message}
              >
                <Controller
                  name="cheque_number"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="text" placeholder="Cheque number" />
                  )}
                />
              </FormRow>
            )}

            <FormRow label="Discount" error={errors?.discount?.message}>
              <Controller
                name="discount"
                control={control}
                defaultValue={0}
                render={({ field: { onChange, ...field } }) => (
                  <Input
                    {...field}
                    id="discount"
                    type="number"
                    placeholder="Discount"
                    error={errors?.discount}
                    onChange={(e) => {
                      onChange(e);
                      const payable =
                        getValues().totalAmount -
                        getValues().totalPaid -
                        e.target.value;
                      setValue("totalPayable", Math.ceil(payable));

                      //   payable > 0 ? setIsDue(true) : setIsDue(false);
                    }}
                  />
                )}
              />
            </FormRow>
          </div>
          <FormRow label="Total Receivable" error={errors?.payable?.message}>
            <Controller
              name="totalPayable"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="totalPayable"
                  type="number"
                  placeholder="Total Payable"
                  readOnly
                />
              )}
            />
          </FormRow>
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
        <div className="flex items-center gap-2">
          <Button variation="tertiary" type="submit">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EditSaleForm;

import { Controller, useForm } from "react-hook-form";
import Form from "../../ui/Form";

import FormRow from "../../ui/FormRow";
import CreatableSelect from "../../ui/CreatableSelect";
import useSuppliers from "../supplier/useSuppliers";

import Input from "../../ui/Input";

import Button from "../../ui/Button";
import usePayPurchaseAmount from "./usePayPurchaseAmount";
import { useState } from "react";
import usePaymentMethod from "../payment-method/usePaymentMethod";
import {
  changeForDatabaseObject,
  changeForSelectObject,
  getIsoDate,
} from "@/util";
import Spinner from "@/ui/Spinner";

function PaymentForm({ paymentToMake = {}, onCloseModal }) {
  const [isDue, setIsDue] = useState(false);
  const [isBank, setIsBank] = useState(false);

  const { paymentMethods, isLoading: paymentMethodLoading } =
    usePaymentMethod();
  const { id: editId, payment, ...editData } = paymentToMake;

  const isEditSession = Boolean(editId);
  const {
    register,
    handleSubmit,
    reset,
    formState,
    control,
    setValue,
    getValues,
  } = useForm({
    defaultValues: isEditSession
      ? {
          ...editData,
          supplier: changeForSelectObject(editData.supplier),
          purchaseDate: getIsoDate(editData.purchaseDate),
        }
      : {},
  });
  const { suppliers, isLoading: supplierLoading } = useSuppliers();
  const { createPayment, isCreating } = usePayPurchaseAmount();

  //   const payable = payment.reduce((acc, cur) => acc + cur.amountPayable, 0);
  const paid = payment.reduce((acc, cur) => acc + cur.amountPaid, 0);
  const payable = editData.totalAmount - paid;

  const isWorking = supplierLoading || isCreating || paymentMethodLoading;
  if (isWorking) return <Spinner />;

  const filterSupplier = suppliers.filter((item) => item.status === true);
  const filterPaymentMethods = paymentMethods.filter(
    (item) => item.is_active === true
  );

  const { errors } = formState;

  function onsubmit(data) {
    const {
      supplier,
      amountPaid,
      cheque_number,
      paymentMethod,
      next_payment_date,
    } = data;

    const newPayment = {
      supplier: changeForDatabaseObject(supplier),
      purchase: paymentToMake,
      amountPaid: amountPaid,
      paymentDate: new Date(editData.purchaseDate),
      cheque_number,
      account: changeForDatabaseObject(paymentMethod),
      supplierPaymentPlan: isDue
        ? {
            next_payment_date,
          }
        : null,
    };
    createPayment(
      { ...newPayment },
      {
        onSettled: () => {
          onCloseModal?.();
          reset();
        },
      }
    );
  }
  function onError(errors) {
    console.log(errors);
  }
  return (
    <Form onSubmit={handleSubmit(onsubmit, onError)}>
      <FormRow
        label="Supplier"
        error={errors?.supplier?.message}
        orientation="purchase"
      >
        <Controller
          name="supplier"
          control={control}
          rules={{ required: "This is required" }}
          render={({ field: { ref, ...field } }) => (
            <CreatableSelect
              {...field}
              data={filterSupplier}
              isDisabled={isEditSession}
              refs={ref}
              multiple={false}
            />
          )}
        />
      </FormRow>

      <FormRow label="Purchase Date" error={errors?.purchaseDate?.message}>
        <Input
          type="date"
          id="purchaseDate"
          readOnly={isEditSession}
          {...register("purchaseDate", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Total Amount" error={errors?.totalAmount?.message}>
        <Controller
          name="totalAmount"
          control={control}
          readOnly={isEditSession}
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
          defaultValue={paid}
          render={({ field }) => (
            <Input {...field} type="number" placeholder="Total Paid" readOnly />
          )}
        />
      </FormRow>
      <FormRow label="Total Payable" error={errors?.totalPayable?.message}>
        <Controller
          name="totalPayable"
          control={control}
          defaultValue={payable}
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
      <FormRow
        label="Amount i want to pay now"
        error={errors?.totalPayable?.message}
      >
        <Controller
          name="amountPaid"
          control={control}
          rules={{
            required: { value: true },
            validate: (value) =>
              +value <= +payable ||
              `You can not pay more  than ${payable} bill`,
          }}
          render={({ field: { onChange, ...field } }) => (
            <Input
              {...field}
              id="amountPaid"
              type="number"
              placeholder="Amount"
              error={errors?.amountPaid}
              onChange={(e) => {
                onChange(e);
                setValue(
                  "totalPayable",
                  (
                    getValues().totalAmount -
                    getValues().totalPaid -
                    e.target.value
                  ).toFixed(2)
                );
                payable - e.target.value > 0 ? setIsDue(true) : setIsDue(false);
              }}
            />
          )}
        />
      </FormRow>

      <FormRow label="Payment Method" error={errors?.paymentMethod?.message}>
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

      {isBank && (
        <Controller
          name="cheque_number"
          control={control}
          render={({ field }) => (
            <Input {...field} type="text" placeholder="Cheque number" />
          )}
        />
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

      <Button type="submit">Submit</Button>
    </Form>
  );
}

export default PaymentForm;

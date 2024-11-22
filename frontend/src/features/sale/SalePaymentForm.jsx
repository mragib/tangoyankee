import Button from "@/ui/Button";
import CreatableSelect from "@/ui/CreatableSelect";
import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";
import { Controller, useForm } from "react-hook-form";

import usePayCustomerAmount from "./usePayCustomerAmount";
import Spinner from "@/ui/Spinner";
import {
  changeCustomerDatabaseObject,
  changeCustomerSelectObject,
  changeForDatabaseObject,
  getIsoDate,
} from "@/util";
import { useState } from "react";
import usePaymentMethod from "../payment-method/usePaymentMethod";

function SalePaymentForm({ paymentToMake = {}, onCloseModal }) {
  const [isBank, setIsBank] = useState(false);
  const [isDue, setIsDue] = useState(false);

  const { paymentMethods, isLoading: paymentMethodLoading } =
    usePaymentMethod();

  const { id: editId, saleRevenue, ...editData } = paymentToMake;
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
          customer: changeCustomerSelectObject(editData.customer),
          salesDate: getIsoDate(editData.salesDate),
        }
      : {},
  });
  const { createCustomerPayment, isCreating } = usePayCustomerAmount();

  const paid = saleRevenue.reduce((acc, cur) => acc + cur.amountPaid, 0);
  const payable = editData.totalAmount - paid;

  const isWorking = isCreating | paymentMethodLoading;
  if (isWorking) return <Spinner />;

  const filterPaymentMethods = paymentMethods.filter(
    (item) => item.is_active === true
  );

  const { errors } = formState;

  function onsubmit(data) {
    const {
      customer,
      amountPaid,
      paymentMethod,
      cheque_number,
      next_payment_date,
    } = data;

    const newPayment = {
      customer: changeCustomerDatabaseObject(customer),
      sale: paymentToMake,
      amountPaid: +amountPaid,
      paymentDate: new Date(editData.salesDate),
      account: changeForDatabaseObject(paymentMethod),
      cheque_number,
      customerPaymentPlan: isDue
        ? {
            next_payment_date,
          }
        : null,
    };
    createCustomerPayment(
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
        label="Customer"
        error={errors?.customer?.message}
        orientation="purchase"
      >
        <Controller
          name="customer"
          control={control}
          rules={{ required: "This is required" }}
          render={({ field: { ref, ...field } }) => (
            <CreatableSelect
              {...field}
              data={[]}
              isDisabled={isEditSession}
              refs={ref}
              multiple={false}
            />
          )}
        />
      </FormRow>

      <FormRow label="Sales Date" error={errors?.salesDate?.message}>
        <Input
          type="date"
          id="salesDate"
          disable={isEditSession}
          readOnly={isEditSession}
          {...register("salesDate", {
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
      <FormRow label="Total Due" error={errors?.totalPayable?.message}>
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
        label="Amount customer want to pay now"
        error={errors?.amountPaid?.message}
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
              placeholder="Total Paid"
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

export default SalePaymentForm;

import Button from "@/ui/Button";
import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";

import { Controller, useForm } from "react-hook-form";
import useCreateCustomerPayment from "./useCreateCustomerPayment";
import SpinnerMini from "@/ui/SpinningMini";
import usePaymentMethod from "../payment-method/usePaymentMethod";
import CreatableSelect from "@/ui/CreatableSelect";
import { useState } from "react";
import { changeForDatabaseObject } from "@/util";
import Spinner from "@/ui/Spinner";

function CustomerPayment({ saleRevenue, sale, customer }) {
  const { isPaying, payCustomerDue } = useCreateCustomerPayment();
  const [isBank, setIsBank] = useState(false);

  const totalAmount = sale.reduce((acc, curr) => curr.totalAmount + acc, 0);
  const totalPaid = saleRevenue.reduce((acc, curr) => curr.amountPaid + acc, 0);
  const payable = Math.ceil(totalAmount - totalPaid);

  const { register, handleSubmit, formState, control, getValues } = useForm({
    defaultValues: { payable, remainingDue: Math.ceil(payable) },
  });
  const { errors } = formState;
  const { paymentMethods, isLoading: paymentMethodLoading } =
    usePaymentMethod();
  const [isDue, setIsDue] = useState(false);

  const isWorking = isPaying | paymentMethodLoading;

  if (isWorking) return <Spinner />;

  const saleTotals = sale.reduce((totals, saleItem) => {
    const { totalAmount, id, salesDate, invoiceNumber } = saleItem;
    totals[id] = { totalAmount, amountPaid: 0, salesDate, invoiceNumber };
    return totals;
  }, {});

  const filterPaymentMethods = paymentMethods.filter(
    (item) => item.is_active === true
  );

  // Add amountPaid to purchaseTotals
  saleRevenue.forEach((paymentItem) => {
    const { saleId, amountPaid } = paymentItem;
    if (saleTotals[saleId]) {
      saleTotals[saleId].amountPaid += amountPaid;
    }
  });

  const saleWithDues = Object.keys(saleTotals)
    .filter((saleId) => {
      const { totalAmount, amountPaid } = saleTotals[saleId];
      return amountPaid < totalAmount;
    })
    .map((saleId) => {
      const { totalAmount, amountPaid, salesDate, invoiceNumber } =
        saleTotals[saleId];
      return {
        saleId,
        totalAmount,
        amountPaid,
        salesDate,
        invoiceNumber,
      };
    });

  function onsubmit(data) {
    const { payable, next_payment_date } = data;

    payCustomerDue({
      saleWithDues,
      payable,
      account: changeForDatabaseObject(data.paymentMethod),
      cheque_number: data.cheque_number,
      customer,
      customerPaymentPlan: isDue
        ? {
            next_payment_date,
          }
        : null,
    });
  }
  function onError(errors) {
    console.error(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onsubmit, onError)}>
      <FormRow label="Customer will pay now" error={errors?.payable?.message}>
        <Controller
          name="payable"
          control={control}
          disabled={isWorking}
          defaultValue="1"
          rules={{
            min: { value: 1 },
            validate: (value) =>
              +value <= +payable || "You can not pay more than you due amount",
          }}
          render={({ field: { onChange, ...field } }) => (
            <Input
              {...field}
              id="payable"
              type="number"
              error={errors?.payable}
              onChange={(e) => {
                onChange(e);

                getValues().remainingDue - e.target.value > 0
                  ? setIsDue(true)
                  : setIsDue(false);
              }}
            />
          )}
        />
      </FormRow>

      <Controller
        name="remainingDue"
        control={control}
        disabled={isWorking}
        render={({ field }) => (
          <Input
            {...field}
            id="remainingDue"
            className="hidden"
            type="number"
            error={errors?.remainingDue}
            readOnly
          />
        )}
      />

      <FormRow label="Payment Method" error={errors?.paymentMethod?.message}>
        <Controller
          name="paymentMethod"
          control={control}
          rules={{ required: { value: true } }}
          render={({ field: { onChange, ref, ...field } }) => (
            <CreatableSelect
              {...field}
              data={filterPaymentMethods}
              refs={ref}
              error={errors?.paymentMethod}
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
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button variation="tertiary" disabled={isWorking}>
          {isWorking ? <SpinnerMini /> : "Collect Money"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CustomerPayment;

import { Controller, useForm } from "react-hook-form";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

import useCreatePayment from "./useCreatePayment";
import SpinnerMini from "@/ui/SpinningMini";
import usePaymentMethod from "../payment-method/usePaymentMethod";
import Spinner from "@/ui/Spinner";
import { changeForDatabaseObject } from "@/util";
import CreatableSelect from "@/ui/CreatableSelect";
import { useState } from "react";

function SupplierPayment({ payment, purchase, supplier }) {
  const { isPaying, makePayment } = useCreatePayment();
  const [isBank, setIsBank] = useState(false);
  const [isDue, setIsDue] = useState(false);

  const { paymentMethods, isLoading: paymentMethodLoading } =
    usePaymentMethod();

  const totalAmount = purchase.reduce((acc, curr) => curr.totalAmount + acc, 0);
  const totalPaid = payment.reduce((acc, curr) => curr.amountPaid + acc, 0);
  const payable = Math.ceil(totalAmount - totalPaid);

  const { register, handleSubmit, formState, control, getValues } = useForm({
    defaultValues: { payable, remainingDue: payable },
  });
  const { errors } = formState;

  const isWorking = isPaying | paymentMethodLoading;

  if (isWorking) return <Spinner />;

  const purchaseTotals = purchase.reduce((totals, purchaseItem) => {
    const { totalAmount, id, purchaseDate, invoiceNumber } = purchaseItem;
    totals[id] = { totalAmount, amountPaid: 0, purchaseDate, invoiceNumber };
    return totals;
  }, {});

  const filterPaymentMethods = paymentMethods.filter(
    (item) => item.is_active === true
  );

  // Add amountPaid to purchaseTotals
  payment.forEach((paymentItem) => {
    const { purchaseId, amountPaid } = paymentItem;
    if (purchaseTotals[purchaseId]) {
      purchaseTotals[purchaseId].amountPaid += amountPaid;
    }
  });

  // Determine purchases with dues
  const purchasesWithDues = Object.keys(purchaseTotals)
    .filter((purchaseId) => {
      const { totalAmount, amountPaid } = purchaseTotals[purchaseId];
      return amountPaid < totalAmount;
    })
    .map((purchaseId) => {
      const { totalAmount, amountPaid, purchaseDate, invoiceNumber } =
        purchaseTotals[purchaseId];
      return {
        purchaseId,
        totalAmount,
        amountPaid,
        purchaseDate,
        invoiceNumber,
      };
    });

  function onsubmit(data) {
    const { payable, next_payment_date } = data;

    makePayment({
      purchasesWithDues,
      payable,
      account: changeForDatabaseObject(data.paymentMethod),
      cheque_number: data.cheque_number,
      supplier,
      supplierPaymentPlan: isDue
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
      <FormRow label="I want to pay now" error={errors?.payable?.message}>
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

        <Button variation="danger" disabled={isWorking}>
          {isWorking ? <SpinnerMini /> : "Make Payment"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default SupplierPayment;

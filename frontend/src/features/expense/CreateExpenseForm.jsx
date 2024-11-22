import Button from "@/ui/Button";
import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";

import { Controller, useForm } from "react-hook-form";
import useCreateExpense from "./useCreateExpense";
import SpinnerMini from "@/ui/SpinningMini";
import useChartOfAccounting from "../chart-of-accounting/useChartOfAccounting";
import CreatableSelect from "@/ui/CreatableSelect";
import usePaymentMethod from "../payment-method/usePaymentMethod";
import { changeForDatabaseObject } from "@/util";

function CreateExpenseForm({ onCloseModal }) {
  const { register, handleSubmit, reset, formState, control } = useForm();

  const { chartOfAccounting, isLoading: chartOfAccountingLoading } =
    useChartOfAccounting();
  const { paymentMethods, isLoading: paymentMethodsLoading } =
    usePaymentMethod();
  const { createExpense, isCreating } = useCreateExpense();

  const isWorking =
    isCreating | chartOfAccountingLoading | paymentMethodsLoading;

  if (isWorking) return <SpinnerMini />;

  const { errors } = formState;

  const filterExpenses = chartOfAccounting.filter(
    (item) => item.gl_type === "Expense" && item.is_leaf === true
  );

  function onsubmit(data) {
    const debit = filterExpenses.find(
      (item) => item.id === data.debit_account.value
    );

    createExpense(
      {
        ...data,
        amount: +data.amount,
        debit_account: debit.code,
        credit_account: changeForDatabaseObject(data.credit_account),
      },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }
  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onsubmit, onError)}>
      <FormRow label="Expense type" error={errors?.debit_account?.message}>
        <Controller
          name="debit_account"
          control={control}
          render={({ field: { ref, ...field } }) => {
            return (
              <CreatableSelect
                // isDisabled={isEditSession}
                {...field}
                data={filterExpenses}
                multiple={false}
              />
            );
          }}
        />
      </FormRow>
      <FormRow label="Payment Method" error={errors?.expense?.message}>
        <Controller
          name="credit_account"
          control={control}
          render={({ field: { ref, ...field } }) => {
            return (
              <CreatableSelect
                // isDisabled={isEditSession}
                {...field}
                data={paymentMethods}
                multiple={false}
              />
            );
          }}
        />
      </FormRow>
      <FormRow label="Descrition" error={errors?.description?.message}>
        <Input
          type="text"
          id="description"
          disabled={isWorking}
          {...register("description", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Amount" error={errors?.amount?.message}>
        <Input
          type="number"
          id="amount"
          disabled={isWorking}
          {...register("amount", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Date" error={errors?.expenseDate?.message}>
        <Input
          type="date"
          id="expenseDate"
          disabled={isWorking}
          {...register("expenseDate", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {isWorking ? <SpinnerMini /> : "Add Expense"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateExpenseForm;

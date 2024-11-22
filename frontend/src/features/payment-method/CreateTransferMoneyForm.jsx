import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";
import useCreateFundsTransfer from "./useCreateFundsTransfer";
import { Controller, useForm } from "react-hook-form";
import SpinnerMini from "@/ui/SpinningMini";
import CreatableSelect from "@/ui/CreatableSelect";
import Button from "@/ui/Button";
import usePaymentMethod from "./usePaymentMethod";
import { changeForDatabaseObject, changeForSelectObject } from "@/util";

function CreateTransferMoneyForm({ activity, onCloseModal }) {
  const { createTransferFund, isCreating } = useCreateFundsTransfer(activity);
  const { paymentMethods: accounts, isLoading: accountsLoading } =
    usePaymentMethod();

  const isWorking = isCreating | accountsLoading;

  const { register, handleSubmit, reset, formState, control } = useForm();
  if (isWorking) return <SpinnerMini />;

  const { errors } = formState;
  function onsubmit(data) {
    createTransferFund(
      {
        ...data,
        fromAccount: changeForDatabaseObject(data.fromAccount),
        toAccount: changeForDatabaseObject(data.toAccount),
        transaction_type: activity,
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
    console.error(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onsubmit, onError)}>
      <FormRow label="From Account" error={errors?.fromAccount?.message}>
        <Controller
          name="fromAccount"
          control={control}
          rules={{ required: true }}
          defaultValue={
            activity === "DEPOSIT"
              ? changeForSelectObject(
                  accounts.find((item) => item.code === 1310)
                )
              : null
          }
          render={({ field: { ref, ...field } }) => {
            return (
              <CreatableSelect
                isDisabled={activity === "DEPOSIT" ? true : false}
                {...field}
                error={errors?.fromAccount}
                data={
                  activity === "WITHDRAW"
                    ? accounts.filter((item) => item.code !== 1310)
                    : accounts
                }
                multiple={false}
              />
            );
          }}
        />
      </FormRow>
      <FormRow label="To Account" error={errors?.toAccount?.message}>
        <Controller
          name="toAccount"
          control={control}
          rules={{ required: true }}
          defaultValue={
            activity === "WITHDRAW"
              ? changeForSelectObject(
                  accounts.find((item) => item.code === 1310)
                )
              : null
          }
          render={({ field: { ref, ...field } }) => {
            return (
              <CreatableSelect
                isDisabled={activity === "WITHDRAW" ? true : false}
                {...field}
                error={errors?.toAccount}
                data={
                  activity === "DEPOSIT"
                    ? accounts.filter((item) => item.code !== 1310)
                    : accounts
                }
                multiple={false}
              />
            );
          }}
        />
      </FormRow>
      <FormRow label="Amount" error={errors?.amount?.message}>
        <Input
          type="number"
          id="amount"
          step=".01"
          error={errors?.amount}
          disabled={isWorking}
          {...register("amount", {
            required: true,
          })}
        />
      </FormRow>
      <FormRow label="Transfer Date" error={errors?.transfer_date?.message}>
        <Input
          type="date"
          id="transfer_date"
          disabled={isWorking}
          {...register("transfer_date", {
            required: true,
          })}
          error={errors?.transfer_date}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {isWorking ? <SpinnerMini /> : `${activity} FUND`}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateTransferMoneyForm;

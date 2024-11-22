import { Controller, useForm } from "react-hook-form";

import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import useCreatePaymentMethod from "./useCreatePaymentMethod";
import useEditPaymentMethod from "./useEditPaymentMethod";
import Select from "react-select";
import SpinnerMini from "@/ui/SpinningMini";
import useChartOfAccounting from "../chart-of-accounting/useChartOfAccounting";
import CreatableSelect from "@/ui/CreatableSelect";
import { changeForDatabaseObject, changeForSelectObject } from "@/util";

const paymentTypeForSelect = [
  { value: "in-hand", label: "Offline" },
  { value: "bank", label: "Bank" },
  {
    value: "digital-wallet",
    label: "Digital Wallet",
  },
];

function CreatePaymentMethodForm({ paymentMethodToEdit = {}, onCloseModal }) {
  const { id: editId, ...editData } = paymentMethodToEdit;

  const isEditSession = Boolean(editId);
  const { chartOfAccounting, isLoading: chartOfAccountingLoading } =
    useChartOfAccounting();
  const { isCreating, createPaymentMethod } = useCreatePaymentMethod();
  const { isEditing, editPaymentMethod } = useEditPaymentMethod();

  if (isEditSession) {
    editData.type = paymentTypeForSelect.find(
      (item) => item.value === editData.type
    );

    editData.chart_of_account = changeForSelectObject(
      editData.chartOfAccounting.parent
    );
    editData.amount = editData.balance;
  }

  const isWorking = isCreating || isEditing | chartOfAccountingLoading;
  const { register, handleSubmit, reset, formState, control } = useForm({
    defaultValues: isEditSession ? editData : {},
  });

  if (isWorking) return <SpinnerMini />;

  const { errors } = formState;

  const filteredChartofAccounting = chartOfAccounting.filter(
    (item) =>
      (item.parent?.code === 1300 && !item.is_leaf) || item.code === 1300
  );

  function onsubmit(data) {
    const { type } = data;
    const parent = changeForDatabaseObject(data.chart_of_account);

    if (isEditSession) {
      const { chartOfAccounting, chart_of_account, ...remainingData } = data;
      editPaymentMethod(
        {
          newPaymentMethodData: {
            ...remainingData,
            type: type.value,
            parent,
            code: +data.code,
            balance: data.amount,
          },
          id: editId,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createPaymentMethod(
        {
          ...data,
          type: type.value,
          balance: data.amount,
          parent,
          code: +data.code,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    }
  }
  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onsubmit, onError)}>
      <FormRow label="Payment Method name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
            maxLength: 80,
          })}
        />
      </FormRow>

      <FormRow label="Account Number" error={errors?.account_number?.message}>
        <Input
          type="text"
          id="account_number"
          disabled={isWorking}
          {...register("account_number", { maxLength: 50 })}
        />
      </FormRow>
      <FormRow label="Account Code" error={errors?.code?.message}>
        <Input
          type="number"
          id="code"
          disabled={isWorking}
          {...register("code", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Active" error={errors?.account_number?.message}>
        <Input
          type="checkbox"
          id="is_active"
          disabled={isWorking}
          {...register("is_active")}
        />
      </FormRow>
      <FormRow label="Account Type" error={errors?.type?.message}>
        {/* <Input
          type="checkbox"
          id="is_active"
          disabled={isWorking}
          {...register("is_active")}
        /> */}

        <Controller
          name="type"
          control={control}
          rules={{ required: "This is required" }}
          render={({ field: { ref, ...field } }) => (
            <Select
              {...field}
              options={paymentTypeForSelect}
              refs={ref}
              multiple={false}
            />
          )}
        />
      </FormRow>
      <FormRow
        label="Chart of Account"
        error={errors?.chart_of_account?.message}
      >
        <Controller
          name="chart_of_account"
          control={control}
          render={({ field: { ref, ...field } }) => {
            return (
              <CreatableSelect
                {...field}
                data={filteredChartofAccounting}
                multiple={false}
              />
            );
          }}
        />

        {/* <CreatableSelect
          data={brands}
          id="brand"
          creatingData={createBrand}
          isCreatingData={isCreatingBrand}
          {...register("brand")}
        /> */}
      </FormRow>
      <FormRow label="Balance" error={errors?.amount?.message}>
        <Input
          type="number"
          id="amount"
          step=".01"
          disabled={isWorking}
          {...register("amount")}
        />
      </FormRow>

      <FormRow className="row-span-2">
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {isWorking ? (
            <SpinnerMini />
          ) : isEditSession ? (
            "Edit Payment Method"
          ) : (
            "Add Payment Method"
          )}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreatePaymentMethodForm;

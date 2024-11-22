import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import SpinnerMini from "@/ui/SpinningMini";
import { Controller, useForm } from "react-hook-form";
import useCreateChartOfAccouting from "./useCreateChartOfAccouting";
import Button from "@/ui/Button";
import CreatableSelect from "@/ui/CreatableSelect";
import Input from "@/ui/Input";
import Select from "react-select";
import useChartOfAccounting from "./useChartOfAccounting";
import { changeForDatabaseObject, changeForSelectObject } from "@/util";
import useEditChartOfAccounting from "./useEditChartOfAccounting";

const accountTypeForSelect = [
  { value: "Asset", label: "Asset" },
  { value: "Liability", label: "Liability" },
  {
    value: "Equity",
    label: "Equity",
  },
  {
    value: "Revenue",
    label: "Revenue",
  },
  {
    value: "Expense",
    label: "Expense",
  },
];

function CreateChartofAccountingForm({
  chartOfAccountingToEdit = {},
  onCloseModal,
}) {
  const {
    id: editId,
    parent: editiableParent,
    is_leaf: editiableStatus,
    ...editData
  } = chartOfAccountingToEdit;

  const isEditSession = Boolean(editId);

  if (isEditSession) {
    editData.id = editId;
    editData.gl_type = accountTypeForSelect.find(
      (item) => item.value === editData.gl_type
    );
  }

  const { register, handleSubmit, reset, formState, control } = useForm({
    defaultValues: isEditSession
      ? {
          ...editData,
          id: editId,
          parent: editiableParent
            ? changeForSelectObject(editiableParent)
            : null,
          status: editiableStatus,
        }
      : {},
  });
  const { errors } = formState;
  const { createChartOfAccounting, isCreating: chartOfAccountingCreating } =
    useCreateChartOfAccouting();
  const { chartOfAccounting, isLoading: chartOfAccountingLoading } =
    useChartOfAccounting();
  const { editChartOfAccounting, isEditing: chartOfAccountingEditing } =
    useEditChartOfAccounting();
  // const {, isEditing: chartOfAccountingEditing } = useEditChartOfAccounting;
  const isWorking =
    chartOfAccountingLoading |
    chartOfAccountingCreating |
    chartOfAccountingEditing;

  if (isWorking) return <SpinnerMini />;

  const filteredChartofAccounting = chartOfAccounting.filter(
    (item) => !item.is_leaf
  );

  function onsubmit(data) {
    const { status, ...remainingData } = data;

    if (isEditSession) {
      editChartOfAccounting(
        {
          newChartOfAccountingData: {
            ...remainingData,
            gl_type: data.gl_type.value,
            cr_amount: data.cr_amount?.toString(),
            dr_amount: data.dr_amount?.toString(),
            balance: data.dr_amount?.toString(),
            parent: data.parent ? changeForDatabaseObject(data.parent) : null,
            is_leaf: status,
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
      createChartOfAccounting(
        {
          ...remainingData,
          code: +data.code,
          gl_type: data.gl_type.value,
          cr_amount: data.cr_amount?.toString(),
          dr_amount: data.dr_amount?.toString(),
          balance: data.dr_amount?.toString(),
          parent: data.parent ? changeForDatabaseObject(data.parent) : null,
          is_leaf: status ? status : false,
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
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-x-2 gap-y-1 w-80 justify-center md:w-full">
        <FormRow label="Code" error={errors?.code?.message}>
          <Input
            type="number"
            id="code"
            disabled={isWorking}
            {...register("code", {
              required: "This field is required",
            })}
          />
        </FormRow>
        <FormRow label="Ledger Name" error={errors?.name?.message}>
          <Input
            type="text"
            id="name"
            disabled={isWorking}
            {...register("name", {
              required: "This field is required",
            })}
          />
        </FormRow>
        <FormRow label="Type" error={errors?.gl_type?.message}>
          <Controller
            name="gl_type"
            control={control}
            rules={{ required: { value: true, message: "This is required" } }}
            render={({ field: { ref, ...field } }) => {
              return (
                <Select
                  {...field}
                  options={accountTypeForSelect}
                  refs={ref}
                  multiple={false}
                  error={errors?.gl_type}
                />
              );
            }}
          />
        </FormRow>
        <FormRow label="Parent" error={errors?.parent?.message}>
          <Controller
            name="parent"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <CreatableSelect
                {...field}
                data={filteredChartofAccounting}
                refs={ref}
                multiple={false}
              />
            )}
          />
        </FormRow>
        <FormRow label="Leaf" error={errors?.status?.message}>
          {/* <Input type="checkbox" id="status" disabled={isWorking} /> */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Input
                type="checkbox"
                id="status"
                disabled={isWorking}
                {...field}
                checked={field.value}
              />
            )}
          />
        </FormRow>
        <FormRow label="Debit" error={errors?.dr_amount?.message}>
          <Input
            type="number"
            step=".01"
            id="id"
            disabled={isWorking}
            {...register("dr_amount")}
          />
        </FormRow>
        <FormRow label="Credit" error={errors?.cr_amount?.message}>
          <Input
            type="number"
            step=".01"
            id="cr_amount"
            disabled={isWorking}
            {...register("cr_amount")}
          />
        </FormRow>
      </div>
      <div className="flex gap-2">
        {/* type is an HTML attribute! */}
        <Button variation="danger" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {isWorking ? (
            <SpinnerMini />
          ) : isEditSession ? (
            "Edit ledger"
          ) : (
            "Add ledger"
          )}
        </Button>
      </div>
    </Form>
  );
}

export default CreateChartofAccountingForm;

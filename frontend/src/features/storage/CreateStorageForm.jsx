import { Controller, useForm } from "react-hook-form";
import useEditStorage from "./useEditStorage";
import SpinnerMini from "@/ui/SpinningMini";
import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";
import CreatableSelect from "@/ui/CreatableSelect";
import useStorage from "./useStorage";
import Button from "@/ui/Button";
import { changeForDatabaseObject, changeForSelectObject } from "@/util";
import useBranch from "../branch/useBranch";

function CreateStorageForm({ storageToEdit = {}, onCloseModal }) {
  const {
    id: editId,
    locator: editiableLocator,
    is_active: editiableStatus,
    ...editData
  } = storageToEdit;
  const isEditSession = Boolean(editId);

  const { handleSubmit, formState, control, reset, register } = useForm({
    defaultValues: isEditSession
      ? {
          ...editData,
          product: changeForSelectObject(storageToEdit),
          locator: changeForSelectObject(editiableLocator),
          status: editiableStatus,
        }
      : {},
  });
  const { errors } = formState;

  const { storage, isLoading: storageLoading } = useStorage();
  const { editStorage, isEditing } = useEditStorage();
  const { isLoading: branchLoading, branch } = useBranch();
  const isWorking = storageLoading | isEditing | branchLoading;
  if (isWorking) return <SpinnerMini />;

  function onsubmit(data) {
    const { quantity, locator, status } = data;

    if (isEditSession) {
      editStorage(
        {
          newStorageData: {
            quantity: +quantity,
            locator: changeForDatabaseObject(locator),
            is_active: status,
          },
          id: editId,
        },
        {
          onSuccess: () => {
            reset;
            onCloseModal?.();
          },
          onError: (e) => {
            console.log(e);
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
      <FormRow label="Product" error={errors?.product?.message}>
        <Controller
          name="product"
          control={control}
          render={({ field }) => (
            <CreatableSelect {...field} data={storage} multiple={false} />
          )}
        />
      </FormRow>
      <FormRow label="Quantity" error={errors?.quantity?.message}>
        <Input
          type="number"
          id="quantity"
          step=".01"
          disabled={isWorking}
          {...register("quantity", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Branch" error={errors?.locator?.message}>
        <Controller
          name="locator"
          control={control}
          render={({ field }) => (
            <CreatableSelect {...field} data={branch} multiple={false} />
          )}
        />
      </FormRow>
      <FormRow label="Status" error={errors?.status?.message}>
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

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {isWorking ? (
            <SpinnerMini />
          ) : isEditSession ? (
            "Edit Storage"
          ) : (
            "Add Storage"
          )}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateStorageForm;

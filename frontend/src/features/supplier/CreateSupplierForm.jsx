import { useForm } from "react-hook-form";
import Form from "../../ui/Form";
import useCreateSuppler from "./useCreateSuppler";

import useEditSupplier from "./useEditSupplier";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import SpinnerMini from "@/ui/SpinningMini";

function CreateSupplierForm({ supplierToEdit = {}, onCloseModal }) {
  const { id: editId, ...editData } = supplierToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editData : {},
  });

  const { errors } = formState;

  const { isCreating, createSupplier } = useCreateSuppler();
  const { isEditing, editSupplier } = useEditSupplier();

  const isWorking = isCreating || isEditing;

  function onsubmit(data) {
    if (isEditSession) {
      editSupplier(
        {
          newCategoryData: {
            ...data,
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
      createSupplier(
        { ...data },
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
      <FormRow label="Supplier name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
            min: { value: 3, message: "Atleast 3 letters or more" },
          })}
        />
      </FormRow>

      <FormRow label="Supplier Address" error={errors?.address?.message}>
        <Input
          type="text"
          id="address"
          disabled={isWorking}
          {...register("address", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Phone" error={errors?.phone?.message}>
        <Input
          type="text"
          id="phone"
          disabled={isWorking}
          {...register("phone", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking}
          {...register("email")}
        />
      </FormRow>
      <FormRow label="Owner" error={errors?.owner?.message}>
        <Input
          type="text"
          id="owner"
          disabled={isWorking}
          {...register("owner")}
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
            "Edit Supplier"
          ) : (
            "Add Supplier"
          )}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateSupplierForm;

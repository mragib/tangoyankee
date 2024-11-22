import { useForm } from "react-hook-form";
import useCreateCustomer from "./useCreateCustomer";
import FormRow from "@/ui/FormRow";
import Button from "../../ui/Button";
import Form from "@/ui/Form";
import Input from "@/ui/Input";
import useEditCustomer from "./useEditCustomer";
import SpinnerMini from "@/ui/SpinningMini";

function CreateCustomerForm({ customerToEdit = {}, onCloseModal }) {
  const { id: editId, ...editData } = customerToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editData : {},
  });

  const { errors } = formState;
  const { isCreating, createCustomer } = useCreateCustomer();
  const { isEditing, editCustomer } = useEditCustomer();

  const isWorking = isCreating || isEditing;

  function onsubmit(data) {
    if (isEditSession) {
      editCustomer(
        {
          newCustomerData: {
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
      createCustomer(
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
      <FormRow label="Customer name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
            min: { value: 5, message: "Must be 5 letters or more" },
          })}
        />
      </FormRow>

      <FormRow label="Phone" error={errors?.phone?.message}>
        <Input
          type="text"
          id="phone"
          disabled={isWorking}
          {...register("phone", {
            required: "This field is required",
          })}
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
      <FormRow label="Customer Address" error={errors?.address?.message}>
        <Input
          type="text"
          id="address"
          disabled={isWorking}
          {...register("address", { required: "This field is required" })}
        />
      </FormRow>
      <Button disabled={isWorking}>
        {isWorking ? (
          <SpinnerMini />
        ) : isEditSession ? (
          "Edit Customer"
        ) : (
          "Add Customer"
        )}
      </Button>
    </Form>
  );
}

export default CreateCustomerForm;

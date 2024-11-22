import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";
import { Controller, useForm } from "react-hook-form";
import useCreateBranch from "./useCreateBranch";
import useEditBranch from "./useEditBranch";
import Button from "@/ui/Button";
import SpinnerMini from "@/ui/SpinningMini";

function CreateBranchForm({ branchToEdit = {}, onCloseModal }) {
  const { id: editId, ...editData } = branchToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState, control } = useForm({
    defaultValues: isEditSession ? editData : {},
  });

  const { errors } = formState;

  const { isCreating, createBranch } = useCreateBranch();
  const { isEditing, editBranch } = useEditBranch();

  const isWorking = isCreating || isEditing;

  function onsubmit(data) {
    if (isEditSession) {
      editBranch(
        {
          newBranchData: {
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
      createBranch(
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
      <FormRow label="Branch Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          name="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
          })}
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
        <Button variation="danger" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {isWorking ? (
            <SpinnerMini />
          ) : isEditSession ? (
            "Edit Branch"
          ) : (
            "Add Branch"
          )}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateBranchForm;

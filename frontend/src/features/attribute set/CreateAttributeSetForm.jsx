import { useForm } from "react-hook-form";
import useCreateAttributeSet from "./useCreateAttributeSet";
import useEditAttributeSet from "./useEditAttributeSet";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import SpinnerMini from "../../ui/SpinningMini";

function CreateAttributeSetForm({ attributeSetToEdit = {}, onCloseModal }) {
  const { id: editId, ...editData } = attributeSetToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editData : {},
  });

  const { errors } = formState;

  const { isCreating, createAttributeSet } = useCreateAttributeSet();
  const { isEditing, editAttributeSet } = useEditAttributeSet();

  const isWorking = isCreating || isEditing;

  function onsubmit(data) {
    if (isEditSession) {
      editAttributeSet(
        {
          newAttributeSetData: {
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
      createAttributeSet(
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
      <FormRow label="Attribute set name" error={errors?.name?.message}>
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

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="danger" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {isWorking ? (
            <SpinnerMini />
          ) : isEditSession ? (
            "Edit Attribute set"
          ) : (
            "Add Attribute set"
          )}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateAttributeSetForm;

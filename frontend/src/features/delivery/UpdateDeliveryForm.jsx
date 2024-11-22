import Button from "@/ui/Button";

import FormRow from "@/ui/FormRow";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import useUpdateDelivery from "./useUpdateDelivery";
import SpinnerMini from "@/ui/SpinningMini";
import { deliveryStatusForSelect } from "@/static";

function UpdateDeliveryForm({ deliveryToEdit, onCloseModal }) {
  const { id: editId, deliveryStatus } = deliveryToEdit;
  const isEditSession = Boolean(editId);
  const selectedStatus = deliveryStatusForSelect.find(
    (item) => item.label === deliveryStatus
  );
  const { handleSubmit, reset, formState, control } = useForm({
    defaultValues: isEditSession ? { deliveryStatus: selectedStatus } : {},
  });
  const { editDelivery, isEditing } = useUpdateDelivery();
  const { errors } = formState;

  if (isEditing) return <SpinnerMini />;

  function onsubmit(data) {
    editDelivery(
      {
        newDeliveryData: {
          deliveryStatus: data.deliveryStatus.label,
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
  }
  function onError(errors) {
    console.log(errors);
  }
  return (
    <form className="" onSubmit={handleSubmit(onsubmit, onError)}>
      <FormRow label="Delivery Status" error={errors?.deliveryStatus?.message}>
        <Controller
          name="deliveryStatus"
          control={control}
          rules={{ required: "This is required" }}
          render={({ field: { ref, ...field } }) => (
            <Select
              {...field}
              options={deliveryStatusForSelect}
              refs={ref}
              multiple={false}
            />
          )}
        />
      </FormRow>
      <div className="flex items-center gap-2">
        <Button variation="secondary" onClick={() => onCloseModal()}>
          Cancel
        </Button>
        <Button variation="tertiary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}

export default UpdateDeliveryForm;

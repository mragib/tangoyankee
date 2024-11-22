import { Controller, useForm } from "react-hook-form";
import useCreateInstance from "./useCreateInstance";
import useEditInstance from "./useEditInstance";
import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import SpinnerMini from "@/ui/SpinningMini";
import CreatableSelect from "@/ui/CreatableSelect";
import useAttributeSets from "../attribute set/useAttributeSets";

import { changeForDatabaseObject, changeForSelectObject } from "@/util";

function CreateInstanceForm({ insatnceToEdit = {}, onCloseModal }) {
  const {
    id: editId,
    attribute_set: editiableAttributeSets,
    ...editData
  } = insatnceToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState, control } = useForm({
    defaultValues: isEditSession
      ? {
          ...editData,
          attribute_set: changeForSelectObject(editiableAttributeSets),
        }
      : {},
  });

  const { errors } = formState;

  const { isCreating, createInstance } = useCreateInstance();
  const { isEditing, editInstance } = useEditInstance();
  const { isLoading: fetchingAttributeSets, attribute_sets } =
    useAttributeSets();

  const isWorking = isCreating || isEditing || fetchingAttributeSets;

  if (isWorking) return <SpinnerMini />;

  function onsubmit(data) {
    const { attribute_set } = data;
    if (isEditSession) {
      editInstance(
        {
          newInstanceData: {
            ...data,
            attribute_set: changeForDatabaseObject(attribute_set),
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
      createInstance(
        { ...data, attribute_set: changeForDatabaseObject(attribute_set) },
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
      <FormRow label="Instance name" error={errors?.name?.message}>
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
      <FormRow label="Attribute Sets" error={errors?.attribute_set?.message}>
        <Controller
          name="attribute_set"
          control={control}
          render={({ field: { ref, ...field } }) => {
            return (
              <CreatableSelect
                {...field}
                data={attribute_sets}
                multiple={false}
                ref={ref}
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

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="danger" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {isWorking ? (
            <SpinnerMini />
          ) : isEditSession ? (
            "Edit Instance"
          ) : (
            "Add Instance"
          )}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateInstanceForm;

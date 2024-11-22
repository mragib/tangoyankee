import { Controller, useForm } from "react-hook-form";

import useCreateProduct from "./useCreateProduct";
import Input from "@/ui/Input";
import useEditProduct from "./useEditProduct";
import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Button from "@/ui/Button";
import CreatableSelect from "@/ui/CreatableSelect";
import SpinnerMini from "@/ui/SpinningMini";
import { changeForSelectObject } from "@/util";

const unitOptions = [
  {
    name: "Kilogram",
    id: "kg",
  },
  {
    name: "Ton",
    id: "ton",
  },
  {
    name: "Bag",
    id: "bag",
  },
  {
    name: "Pieces",
    id: "pieces",
  },
];

function CreateProductForm({ productToEdit = {}, onCloseModal }) {
  const { id: editId, ...editData } = productToEdit;

  const isEditSession = Boolean(editId);
  const editiableUnit =
    isEditSession && unitOptions.find((item) => item.id === editData.unit);

  const { handleSubmit, formState, control, reset, register } = useForm({
    defaultValues: isEditSession
      ? {
          ...editData,
          unit: changeForSelectObject(editiableUnit),
        }
      : {},
  });

  const { errors } = formState;

  const { createProduct, isCreating } = useCreateProduct();
  const { editProduct, isEditing } = useEditProduct();

  const isWorking = isCreating | isEditing;

  if (isWorking) return <SpinnerMini />;

  function onsubmit(data) {
    if (isEditSession) {
      editProduct(
        {
          newProductData: {
            ...data,
            unit: data.unit.value,
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
    } else {
      createProduct(
        {
          ...data,
          unit: data.unit.value,
        },
        {
          onSuccess: () => {
            reset;
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
      <FormRow label="Product name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Unit" error={errors?.unit?.message}>
        <Controller
          name="unit"
          control={control}
          render={({ field }) => (
            <CreatableSelect {...field} data={unitOptions} multiple={false} />
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
            "Edit Product"
          ) : (
            "Add Product"
          )}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateProductForm;

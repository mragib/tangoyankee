import { Controller, useForm } from "react-hook-form";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import SpinnerMini from "../../ui/SpinningMini";
import useCreateAttribute from "./useCreateAttribute";
import useEditAttribute from "./useEditAttribute";
import useProduct from "../product/useProduct";
import CreatableSelect from "@/ui/CreatableSelect";
import useInstance from "../instance/useInstance";
import useBranch from "../branch/useBranch";
import {
  changeForDatabaseArray,
  changeForDatabaseObject,
  changeForSelectArray,
  changeForSelectObject,
} from "@/util";

function CreateAttributeForm({ attributeToEdit = {}, onCloseModal }) {
  const {
    id: editId,
    product: editiableProduct,
    storage: editiableStorage,
    instance: editiableInstance,
    ...editData
  } = attributeToEdit;
  const isEditSession = Boolean(editId);

  const { isLoading: productLoading, products } = useProduct();
  const { isLoading: instanceLoading, instances } = useInstance();
  const { isLoading: branchLoading, branch } = useBranch();

  const { register, handleSubmit, reset, formState, control } = useForm({
    defaultValues: isEditSession
      ? {
          ...editData,
          product: changeForSelectObject(editiableProduct),
          instance: changeForSelectArray(editiableInstance),
          quantity: editiableStorage.quantity,
          branch: changeForSelectObject(editiableStorage.locator),
        }
      : {},
  });

  const { errors } = formState;

  const { isCreating, createAttribute } = useCreateAttribute();
  const { isEditing, editAttribute } = useEditAttribute();

  const isWorking =
    isCreating ||
    isEditing ||
    productLoading ||
    instanceLoading ||
    branchLoading;

  if (isWorking) return <SpinnerMini />;

  function onsubmit(data) {
    const {
      product,
      instance,
      branch,
      quantity,
      sellingUnitPrice,
      buyingUnitPrice,
    } = data;

    if (isEditSession) {
      editAttribute(
        {
          newAttributeData: {
            sellingUnitPrice: sellingUnitPrice.toString(),
            buyingUnitPrice: buyingUnitPrice.toString(),
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
      createAttribute(
        {
          ...data,
          product: changeForDatabaseObject(product),
          instance: changeForDatabaseArray(instance),
          sellingUnitPrice: sellingUnitPrice.toString(),
          storage: {
            quantity,
            locator: changeForDatabaseObject(branch),
            lot_quantity: quantity,
          },
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
      <FormRow label="Product" error={errors?.product?.message}>
        <Controller
          name="product"
          control={control}
          render={({ field: { ref, ...field } }) => {
            return (
              <CreatableSelect
                isDisabled={isEditSession}
                {...field}
                data={products}
                multiple={false}
              />
            );
          }}
        />
      </FormRow>
      <FormRow label="Instance" error={errors?.instance?.message}>
        <Controller
          name="instance"
          control={control}
          disabled={isEditSession}
          render={({ field: { ref, ...field } }) => {
            return (
              <CreatableSelect
                {...field}
                isDisabled={isEditSession}
                data={instances}
                multiple={true}
              />
            );
          }}
        />
      </FormRow>
      {!isEditSession && (
        <FormRow label="quantity" error={errors?.quantity?.message}>
          <Input
            type="number"
            id="quantity"
            disabled={isWorking || isEditSession}
            {...register("quantity", {
              required: "This field is required",
            })}
          />
        </FormRow>
      )}
      <FormRow
        label="Unit Selling Price"
        error={errors?.sellingUnitPrice?.message}
      >
        <Input
          type="number"
          id="sellingUnitPrice"
          step=".01"
          disabled={isWorking}
          {...register("sellingUnitPrice", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow
        label="Unit Buying Price"
        error={errors?.buyingUnitPrice?.message}
      >
        <Input
          type="number"
          id="buyingUnitPrice"
          step=".01"
          disabled={isWorking}
          {...register("buyingUnitPrice", {
            required: "This field is required",
          })}
        />
      </FormRow>
      {!isEditSession && (
        <FormRow label="Branch" error={errors?.branch?.message}>
          <Controller
            name="branch"
            control={control}
            render={({ field: { ref, ...field } }) => {
              return (
                <CreatableSelect
                  {...field}
                  data={branch}
                  multiple={false}
                  disabled={isEditSession}
                />
              );
            }}
          />
        </FormRow>
      )}
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="danger" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {isWorking ? (
            <SpinnerMini />
          ) : isEditSession ? (
            "Edit Attribute"
          ) : (
            "Add Attribute"
          )}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateAttributeForm;

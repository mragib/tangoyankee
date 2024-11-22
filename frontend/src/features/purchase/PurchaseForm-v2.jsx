import { Controller, useFieldArray, useForm } from "react-hook-form";
import { HiOutlineTrash } from "react-icons/hi2";

import CreatableSelect from "../../ui/CreatableSelect";
import useSupplier from "../supplier/useSupplier";

import Spinner from "../../ui/Spinner";
import Input from "../../ui/Input";

import useProduct from "../product/useProduct";
import styled from "styled-components";
import Button from "../../ui/Button";

import { useEffect, useState } from "react";

const padding = {
  padding: "4.2rem 0 1rem 0",
};
const deleteButton = {
  width: "4rem",
  height: "4rem",
  borderRadius: "50%",
  fill: "#fff",
  padding: 0,
};

const sideByside = {
  display: "flex",
  alignItem: "center",
  gap: ".5rem",
};

const FlexDivColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const GridDivRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 4.2rem;
  align-items: center;
  row-gap: 3.2rem;
`;

const ProductItemRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
  column-gap: 1.8rem;
  align-items: center;
  row-gap: 1.2rem;
`;

const StyledFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

const initialState = {
  totalAmount: 0,
  products: [{ quantity: "", unitPrice: "", netAmount: "" }],
  purchaseDate: new Date().toISOString().split("T")[0],
};

function PurchaseForm() {
  const [productDetails, setProductDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const { register, handleSubmit, formState, control, setValue, getValues } =
    useForm({
      defaultValues: { ...initialState },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });
  const { errors } = formState;

  const { suppliers, isLoading: supplierLoading } = useSupplier();
  const { products: productList, isLoading: productLoading } = useProduct();

  useEffect(
    function () {
      const updatedTotalAmount = productDetails.reduce(
        (acc, { quantity, unitPrice }) => {
          const quantityValue = parseFloat(quantity || 0);
          const unitPriceValue = parseFloat(unitPrice || 0);
          let x = quantityValue * unitPriceValue;
          return acc + x;
        },
        0
      );

      setTotalAmount(updatedTotalAmount);
    },
    [productDetails]
  );

  const isWorking = supplierLoading | productLoading;
  if (isWorking) return <Spinner />;

  const remapped = productList.map((item) => ({
    name: `${item.catagory.name}-${item.brand.name}`,
    id: item.id,
  }));

  function calculateNetAmount(index) {
    const newQuantity =
      parseFloat(getValues(`products[${index}].quantity`)) || 0;
    const newUnitPrice =
      parseFloat(getValues(`products[${index}].unitPrice`)) || 0;

    const netAmount = newQuantity * newUnitPrice;

    setValue(`products[${index}].netAmount`, netAmount);
    setProductDetails((prev) => {
      const updatedDetails = [...prev];
      updatedDetails[index] = {
        quantity: newQuantity,
        unitPrice: newUnitPrice,
      };

      return updatedDetails;
    });
  }

  function saveOnStore(index) {
    const newQuantity =
      parseFloat(getValues(`products[${index - 1}].quantity`)) || 0;
    const newUnitPrice =
      parseFloat(getValues(`products[${index - 1}].unitPrice`)) || 0;

    if (newQuantity && newUnitPrice) {
      return append({
        product: "",
        unitPrice: "",
        quantity: "",
        netAmount: "",
      });
    }
  }

  const onsubmit = (data) => {
    console.log(data);
  };

  const onError = (e) => {
    console.error(e);
  };

  return (
    <form onSubmit={handleSubmit(onsubmit, onError)}>
      <GridDivRow>
        <FormRow
          label="Supplier"
          error={errors?.supplier?.message}
          orientation="purchase"
        >
          <Controller
            name="supplier"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <CreatableSelect
                {...field}
                data={suppliers}
                refs={ref}
                multiple={false}
              />
            )}
          />
        </FormRow>

        <FormRow label="Purchase Date" error={errors?.purchaseDate?.message}>
          <Input
            type="date"
            id="purchaseDate"
            className={errors?.purchaseDate ? "is-invalid" : ""}
            {...register("purchaseDate", {
              required: "This field is required",
            })}
          />
        </FormRow>
        <FormRow label="Total Amount" error={errors?.totalAmount?.message}>
          <Controller
            name="totalAmount"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="Total Amount"
                readOnly
                value={totalAmount}
              />
            )}
          />
        </FormRow>
      </GridDivRow>

      {/* <ProductItem /> */}
      <FlexDivColumn style={padding}>
        {fields.map((field, index) => (
          <ProductItemRow key={field.id}>
            <Controller
              name={`products[${index}].product`}
              control={control}
              placeholder="Product"
              render={({ field: { ref, ...field } }) => (
                <CreatableSelect
                  {...field}
                  refs={ref}
                  data={remapped}
                  multiple={false}
                />
              )}
            />

            <Controller
              name={`products[${index}].quantity`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="quantity"
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    calculateNetAmount(index);
                    // You may want to keep the following line if you still want the default behavior
                  }}
                />
              )}
            />

            <Controller
              name={`products[${index}].unitPrice`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Unit Price"
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    calculateNetAmount(index);
                  }}
                />
              )}
            />

            <Controller
              name={`products[${index}].netAmount`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Net Amount"
                  readOnly
                />
              )}
            />

            {fields.length > 1 && (
              <div style={sideByside}>
                <Button
                  variation="danger"
                  style={deleteButton}
                  onClick={() => {
                    setProductDetails((prev) => {
                      const updatedDetails = [...prev];
                      updatedDetails.splice(index, 1);
                      return updatedDetails;
                    });
                    return remove(index);
                  }}
                >
                  <HiOutlineTrash />
                </Button>
              </div>
            )}
          </ProductItemRow>
        ))}
      </FlexDivColumn>
      <div style={sideByside}>
        <Button
          variation="tertiary"
          onClick={() => {
            saveOnStore(fields.length);
          }}
        >
          Add Product
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}

export default PurchaseForm;

function FormRow({ label, error, children, orientation }) {
  return (
    <StyledFormRow orientation={orientation}>
      {label && <Label htmlFor={children.props.id}>{label}</Label>}
      <FlexDivColumn>{children}</FlexDivColumn>
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

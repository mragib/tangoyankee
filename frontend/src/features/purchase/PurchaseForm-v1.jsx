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

function PurchaseForm() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [productDetails, setProductDetails] = useState([]);

  const { register, handleSubmit, formState, control, setValue, getValues } =
    useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });
  const { errors } = formState;

  const { suppliers, isLoading: supplierLoading } = useSupplier();
  const { products: productList, isLoading: productLoading } = useProduct();

  useEffect(
    function () {
      const quantityUpdated =
        parseFloat(getValues(`products[${selectedIndex}].quantity`)) || 0;
      const unitPriceUpdated =
        parseFloat(getValues(`products[${selectedIndex}].unitPrice`)) || 0;
      const netAmount = quantityUpdated * unitPriceUpdated;
      setProductDetails((prev) => {
        const updatedDetails = [...prev];
        updatedDetails[selectedIndex] = {
          quantity: quantityUpdated,
          unitPrice: unitPriceUpdated,
        };

        return updatedDetails;
      });

      setValue(`products[${selectedIndex}].netAmount`, netAmount);
    },
    [selectedIndex, getValues, setValue, quantity, unitPrice]
  );

  const isWorking = supplierLoading | productLoading;
  if (isWorking) return <Spinner />;

  const remaped = productList.map((item) => {
    return {
      name: `${item.catagory.name}-${item.brand.name}`,
      id: item.id,
    };
  });

  const calculateNetAmount = (index) => {
    const quantity = parseFloat(getValues(`products[${index}].quantity`)) || 0;
    const unitPrice =
      parseFloat(getValues(`products[${index}].unitPrice`)) || 0;

    setSelectedIndex(index);
    setQuantity(quantity);
    setUnitPrice(unitPrice);
  };

  const totalAmount = productDetails.reduce((acc, { quantity, unitPrice }) => {
    const quantityValue = parseFloat(quantity || 0);
    const unitPriceValue = parseFloat(unitPrice || 0);
    let x = quantityValue * unitPriceValue;
    return acc + x;
  }, 0);

  setValue("totalAmount", totalAmount);

  function onsubmit(data) {
    console.log(data);
  }

  function onError(e) {
    console.error(e);
  }

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
                  data={remaped}
                  multiple={false}
                />
              )}
            />

            <Controller
              name={`products[${index}].quantity`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, ...field } }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="quantity"
                  onChange={(e) => {
                    calculateNetAmount(index);
                    // You may want to keep the following line if you still want the default behavior
                    onChange(e);
                  }}
                />
              )}
            />

            <Controller
              name={`products[${index}].unitPrice`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, ...field } }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Unit Price"
                  onChange={(e) => {
                    calculateNetAmount(index);
                    // You may want to keep the following line if you still want the default behavior
                    onChange(e);
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
                      prev.splice(index, 1);
                      return prev;
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
            return append({
              product: "",
              unitPrice: "",
              quantity: "",
              netAmount: "",
            });
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

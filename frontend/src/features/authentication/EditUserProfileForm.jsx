import Button from "@/ui/Button";

import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";
import { Controller, useForm } from "react-hook-form";
import useEditUserProfile from "./useEditUserProfile";

function EditUserProfileForm({ user, setImagePreview, setShowForm }) {
  const { id: editId, ...editData } = user;
  const isEditSession = Boolean(editId);
  const { register, handleSubmit, reset, formState, control } = useForm({
    defaultValues: isEditSession ? editData : {},
  });
  const { editUserProfile, isEditing } = useEditUserProfile();

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setImagePreview(URL.createObjectURL(file)); // Preview the image before upload
  };

  const { errors } = formState;

  function onsubmit(data) {
    editUserProfile(
      {
        ...data,
        image: typeof data.image === "string" ? data.image : data.image[0],
      },
      {
        onSuccess: () => {
          reset;
          setShowForm(false);
        },
      }
    );
  }
  function onError(errors) {
    console.log(errors);
  }

  return (
    <form
      className="grid grid-cols-2"
      onSubmit={handleSubmit(onsubmit, onError)}
    >
      <FormRow label="First Name" error={errors?.first_name?.message}>
        <Input
          type="text"
          id="first_name"
          {...register("first_name", {
            required: true,
          })}
          error={errors && errors?.first_name}
        />
      </FormRow>
      <FormRow label="Last Name" error={errors?.last_name?.message}>
        <Input
          type="text"
          id="last_name"
          {...register("last_name", {
            required: true,
          })}
          error={errors && errors?.last_name}
        />
      </FormRow>
      <FormRow label="Phone" error={errors?.phone?.message}>
        <Input
          type="text"
          id="phone"
          {...register("phone", {
            required: true,
          })}
          error={errors && errors?.phone}
        />
      </FormRow>
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="text"
          id="email"
          {...register("email", {
            required: true,
          })}
          error={errors && errors?.email}
        />
      </FormRow>
      <FormRow label="Address" error={errors?.address?.message}>
        <textarea
          className="border rounded-sm p-1"
          id="address"
          {...register("address", {
            required: true,
          })}
        />
      </FormRow>
      <FormRow label="Profile Image" error={errors?.image?.message}>
        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, ref, ...field } }) => (
            <input
              {...field}
              type="file"
              {...register("image")}
              accept="image/*"
              id="image"
              onChange={(e) => {
                onChange(e);
                handleFileChange(e);
              }}
            />
          )}
        />
      </FormRow>

      <FormRow label="Page Name" error={errors?.page_name?.message}>
        <Input type="text" id="page_name" {...register("page_name")} />
      </FormRow>
      <FormRow
        label="Business Address"
        error={errors?.business_address?.message}
      >
        <textarea
          className="border rounded-sm p-1"
          type="text"
          id="business_address"
          {...register("business_address")}
        />
      </FormRow>
      <div className="py-4 flex gap-4">
        <Button type="submit" variation="tertiary" disabled={isEditing}>
          Submit
        </Button>
        <Button type="reset" variation="secondary" disabled={isEditing}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default EditUserProfileForm;

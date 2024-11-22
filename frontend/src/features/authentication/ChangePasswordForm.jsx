import Button from "@/ui/Button";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";
import { useForm } from "react-hook-form";
import useChangePassword from "./useChangePassword";

function ChangePasswordForm({ onCloseModal }) {
  const { register, handleSubmit, reset, formState, getValues } = useForm();

  const { errors } = formState;

  const { changeUserPassword, isEditing } = useChangePassword();

  function onsubmit(data) {
    changeUserPassword(
      {
        ...data,
      },
      {
        onSuccess: () => {
          reset;
          onCloseModal?.();
        },
      }
    );
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <form onSubmit={handleSubmit(onsubmit, onError)}>
      <FormRow label="Old Password" error={errors?.old_password?.message}>
        <Input
          type="password"
          id="old_password"
          {...register("old_password", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="New Password" error={errors?.new_password?.message}>
        <Input
          type="password"
          id="new_password"
          {...register("new_password", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow
        label="Confirm Password"
        error={errors?.confirm_password?.message}
      >
        <Input
          type="password"
          id="confirm_password"
          error={errors && errors.confirm_password}
          {...register("confirm_password", {
            required: "This field is required",
            validate: (e) => {
              return (
                getValues().new_password === e || "Password does not match"
              );
            },
          })}
        />
      </FormRow>
      <div className="py-4 flex gap-4">
        <Button type="submit" variation="tertiary" disable={isEditing}>
          Submit
        </Button>
        <Button type="reset" variation="secondary" disable={isEditing}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;

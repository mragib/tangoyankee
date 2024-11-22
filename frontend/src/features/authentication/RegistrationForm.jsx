import { Controller, useForm } from "react-hook-form";
import { useRegister } from "./useRegister";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";

import Button from "@/ui/Button";
import SpinnerMini from "@/ui/SpinningMini";
import { useNavigate } from "react-router-dom";
import useRoles from "../role/useRoles";
import Spinner from "@/ui/Spinner";

import { changeForDatabaseObject, changeForSelectArray } from "@/util";
import CreatableSelect from "@/ui/CreatableSelect";

function RegistrationForm({ onCloseModal }) {
  const { register, handleSubmit, reset, formState, getValues, control } =
    useForm();
  const { isLoading: rolesLoading, roles } = useRoles();
  const navigation = useNavigate();

  const { errors } = formState;

  const { isLoading: registrationLoaing, signUp } = useRegister();

  const isWorking = rolesLoading | registrationLoaing;

  if (isWorking) return <Spinner />;

  const options = roles.filter((item) => item.name !== "admin");
  function onsubmit(data) {
    const role = changeForDatabaseObject(data.role);
    signUp(
      { ...data, role },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
          navigation("/users");
        },
        // onError: () => {
        //   onCloseModal?.();
        // },
      }
    );
  }
  function onError(errors) {
    console.log(errors);
  }
  return (
    <form
      onSubmit={handleSubmit(onsubmit, onError)}
      className="grid md:grid-cols-2"
    >
      <FormRow label="First name" error={errors?.first_name?.message}>
        <Input
          type="text"
          id="first_name"
          disabled={isWorking}
          {...register("first_name", {
            required: true,
            maxLength: {
              length: 100,
              message: "First name can not be more than 30 Characters",
            },
          })}
          error={errors && errors?.first_name}
        />
      </FormRow>

      <FormRow label="Last name" error={errors?.last_name?.message}>
        <Input
          type="text"
          id="last_name"
          disabled={isWorking}
          error={errors && errors?.last_name}
          {...register("last_name", {
            required: true,
            maxLength: {
              length: 70,
              message: "Last name can not be more than 30 Characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Address" error={errors?.address?.message}>
        <Input
          type="text"
          id="address"
          disabled={isWorking}
          {...register("address", { required: true })}
          error={errors && errors?.address}
        />
      </FormRow>

      <FormRow label="Username" error={errors?.username?.message}>
        <Input
          type="text"
          id="username"
          disabled={isWorking}
          {...register("username", {
            required: true,
            maxLength: {
              length: 30,
              message: "User name can not be more than 30 Characters",
            },
          })}
          error={errors && errors?.username}
        />
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking}
          {...register("email", { required: true })}
          error={errors && errors?.email}
        />
      </FormRow>
      <FormRow label="Phone number" error={errors?.phone?.message}>
        <Input
          type="text"
          id="phone"
          {...register("phone", {
            required: true,
          })}
          disabled={isWorking}
          error={errors && errors?.phone}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          {...register("password", {
            required: true,
          })}
          disabled={isWorking}
          error={errors && errors?.password}
        />
      </FormRow>

      <FormRow
        label="Repeat password"
        error={errors?.confirm_password?.message}
      >
        <Input
          type="password"
          id="confirm_password"
          {...register("confirm_password", {
            required: true,
            validate: (value) =>
              value === getValues().password || "Password is not matched",
          })}
          disabled={isWorking}
          error={errors && errors?.confirm_password}
        />
      </FormRow>

      <FormRow label="Role" error={errors?.role?.message}>
        <Controller
          name="role"
          control={control}
          render={({ field: { ref, ...field } }) => {
            return (
              <CreatableSelect
                {...field}
                data={options}
                multiple={false}
                ref={ref}
              />
            );
          }}
        />
      </FormRow>
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isWorking}>
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {isWorking ? <SpinnerMini /> : "Add User"}
        </Button>
      </FormRow>
    </form>
  );
}

export default RegistrationForm;

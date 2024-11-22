import { useState } from "react";
import { useLogin } from "./useLogin";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import SpinnerMini from "../../ui/SpinningMini";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) return;
    login(
      { username, password },
      {
        onSettled: () => {
          setPassword("");
        },
      }
    );
  }
  return (
    <Form onSubmit={handleSubmit}>
      <FormRow orientation="vertical" label="User Name">
        <Input
          type="text"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
      </FormRow>
      <FormRow orientation="vertical" label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </FormRow>
      <FormRow>
        <Button size="large" disabled={isLoading}>
          {isLoading ? <SpinnerMini /> : "Log in"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default LoginForm;

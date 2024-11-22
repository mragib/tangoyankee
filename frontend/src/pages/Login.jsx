import LoginForm from "../features/authentication/LoginForm";

const Login = () => {
  return (
    <main className="min-h-screen grid place-content-center bg-gray-50 max-w-full px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <h4 className="flex justify-center items-center text-title-md">
          Log in to your account
        </h4>
        <LoginForm />
      </div>
    </main>
  );
};

export default Login;

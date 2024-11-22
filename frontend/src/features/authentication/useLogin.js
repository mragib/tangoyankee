import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiUser";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login as loginSlice } from "../../redux/authSlice";

export function useLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      dispatch(loginSlice(data));
      navigate("/", { replace: true });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Invalid credentials");
    },
  });

  return { login, isLoading };
}

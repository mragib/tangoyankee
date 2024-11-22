import { addAndEditPaymentMethod as addAndEditPaymentMethodApi } from "@/services/apiPaymentMethod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useEditPaymentMethod() {
  const queryClient = useQueryClient();

  const { mutate: editPaymentMethod, isPending: isEditing } = useMutation({
    mutationFn: ({ newPaymentMethodData, id }) =>
      addAndEditPaymentMethodApi(newPaymentMethodData, id),
    onSuccess: () => {
      toast.success("The Payment method has been updated");
      queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editPaymentMethod };
}

export default useEditPaymentMethod;

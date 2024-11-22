import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { addAndEditPaymentMethod } from "@/services/apiPaymentMethod";

function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  const { mutate: createPaymentMethod, isPending: isCreating } = useMutation({
    mutationFn: addAndEditPaymentMethod,
    onSuccess: () => {
      toast.success("New payment method has been created");
      queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createPaymentMethod };
}

export default useCreatePaymentMethod;

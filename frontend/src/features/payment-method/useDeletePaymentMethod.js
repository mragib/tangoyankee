import { deletePaymentMethod as deletePaymentMethodApi } from "@/services/apiPaymentMethod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deletePaymentMethod } = useMutation({
    mutationFn: (id) => deletePaymentMethodApi(id),
    onSuccess: () => {
      toast.success("Payment method has been deleted");
      queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deletePaymentMethod };
}

export default useDeletePaymentMethod;

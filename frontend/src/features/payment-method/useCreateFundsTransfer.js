import { transferFunds } from "@/services/apiPaymentMethod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateFundsTransfer(method) {
  const queryClient = useQueryClient();
  const { mutate: createTransferFund, isPending: isCreating } = useMutation({
    mutationFn: transferFunds,
    onSuccess: () => {
      toast.success(`Money has been ${method}`);
      queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createTransferFund };
}

export default useCreateFundsTransfer;

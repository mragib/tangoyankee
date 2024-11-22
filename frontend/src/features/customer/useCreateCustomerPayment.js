import { payBills as payBillsApi } from "@/services/apiCustomer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function useCreateCustomerPayment() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { mutate: payCustomerDue, isPending: isPaying } = useMutation({
    mutationFn: payBillsApi,
    onSuccess: () => {
      toast.success("Customer has made a payment");
      queryClient.invalidateQueries({
        queryKey: ["customer", id],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isPaying, payCustomerDue };
}

export default useCreateCustomerPayment;

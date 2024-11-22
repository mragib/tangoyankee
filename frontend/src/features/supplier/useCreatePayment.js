import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { makePayment as makePaymentApi } from "../../services/apiSupplier";

function useCreatePayment() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { mutate: makePayment, isPending: isPaying } = useMutation({
    mutationFn: (data) => makePaymentApi({ ...data, supplierId: id }),
    onSuccess: () => {
      toast.success("A new payment has been created");
      queryClient.invalidateQueries({
        queryKey: ["supplier", id],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isPaying, makePayment };
}

export default useCreatePayment;

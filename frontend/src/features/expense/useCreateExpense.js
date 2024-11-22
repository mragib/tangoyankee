import { createExpense as createExpenseApi } from "@/services/apiExpense";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateExpense() {
  const queryClient = useQueryClient();
  const { mutate: createExpense, isPending: isCreating } = useMutation({
    mutationFn: createExpenseApi,
    onSuccess: () => {
      toast.success("You made an expense");
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createExpense };
}

export default useCreateExpense;

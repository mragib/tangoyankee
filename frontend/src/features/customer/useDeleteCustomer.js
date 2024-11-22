import { deleteCustomer as deleteCustomerApi } from "@/services/apiCustomer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useDeleteCustomer() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteCustomers } = useMutation({
    mutationFn: (id) => deleteCustomerApi(id),
    onSuccess: () => {
      toast.success("Customer has been deleted");
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteCustomers };
}

export default useDeleteCustomer;

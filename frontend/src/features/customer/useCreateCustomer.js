import { addAndEditCustomer } from "@/services/apiCustomer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { mutate: createCustomer, isPending: isCreating } = useMutation({
    mutationFn: addAndEditCustomer,
    onSuccess: () => {
      toast.success("A new customer has been created");
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createCustomer };
}

export default useCreateCustomer;

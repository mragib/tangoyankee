import { addAndEditCustomer } from "@/services/apiCustomer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useEditCustomer() {
  const queryClient = useQueryClient();

  const { mutate: editCustomer, isPending: isEditing } = useMutation({
    mutationFn: ({ newCustomerData, id }) =>
      addAndEditCustomer(newCustomerData, id),
    onSuccess: () => {
      toast.success("The customer has been updated");
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editCustomer };
}

export default useEditCustomer;

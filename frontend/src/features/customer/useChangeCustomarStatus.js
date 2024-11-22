import { changeCustomerStatus } from "@/services/apiCustomer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useChangeCustomarStatus() {
  const queryClient = useQueryClient();

  const { mutate: changeStatus, isPending: isChanging } = useMutation({
    mutationFn: ({ newStatus, id }) => changeCustomerStatus(newStatus, id),
    onSuccess: () => {
      toast.success("The customer has been update");
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isChanging, changeStatus };
}

export default useChangeCustomarStatus;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { changeSupplierStatus } from "../../services/apiSupplier";

function useChangeStatusSupplier() {
  const queryClient = useQueryClient();

  const { mutate: changeStatus, isPending: isChanging } = useMutation({
    mutationFn: ({ newStatus, id }) => changeSupplierStatus(newStatus, id),
    onSuccess: () => {
      toast.success("The supplier has been update");
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isChanging, changeStatus };
}

export default useChangeStatusSupplier;

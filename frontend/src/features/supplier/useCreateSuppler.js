import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addAndEditSupplier } from "../../services/apiSupplier";

function useCreateSuppler() {
  const queryClient = useQueryClient();
  const { mutate: createSupplier, isPending: isCreating } = useMutation({
    mutationFn: addAndEditSupplier,
    onSuccess: () => {
      toast.success("New Supplier has been created");
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createSupplier };
}

export default useCreateSuppler;

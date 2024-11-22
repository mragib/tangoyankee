import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAndEditSupplier } from "../../services/apiSupplier";
import toast from "react-hot-toast";

function useEditSupplier() {
  const queryClient = useQueryClient();

  const { mutate: editSupplier, isPending: isEditing } = useMutation({
    mutationFn: ({ newCategoryData, id }) =>
      addAndEditSupplier(newCategoryData, id),
    onSuccess: () => {
      toast.success("The supplier has been updated");
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editSupplier };
}

export default useEditSupplier;

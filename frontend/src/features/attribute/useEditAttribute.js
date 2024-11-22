import { addAndEditAttribute } from "@/services/apiAttribute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useEditAttribute() {
  const queryClient = useQueryClient();

  const { mutate: editAttribute, isPending: isEditing } = useMutation({
    mutationFn: ({ newAttributeData, id }) =>
      addAndEditAttribute(newAttributeData, id),
    onSuccess: () => {
      toast.success("The attribute has been updated");
      queryClient.invalidateQueries({
        queryKey: ["attributes"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editAttribute };
}

export default useEditAttribute;

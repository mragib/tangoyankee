import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addAndEditAttributeSet as addAndEditAttributeSetApi } from "../../services/apiAttributeSet";

function useEditAttributeSet() {
  const queryClient = useQueryClient();

  const { mutate: editAttributeSet, isPending: isEditing } = useMutation({
    mutationFn: ({ newAttributeSetData, id }) =>
      addAndEditAttributeSetApi(newAttributeSetData, id),
    onSuccess: () => {
      toast.success("The attribute set has been updated");
      queryClient.invalidateQueries({
        queryKey: ["attribute-sets"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editAttributeSet };
}

export default useEditAttributeSet;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addAndEditAttributeSet as addAndEditAttributeSetApi } from "../../services/apiAttributeSet";

function useCreateAttributeSet() {
  const queryClient = useQueryClient();
  const { mutate: createAttributeSet, isPending: isCreating } = useMutation({
    mutationFn: addAndEditAttributeSetApi,
    onSuccess: () => {
      toast.success("New Attribute Set has been created");
      queryClient.invalidateQueries({
        queryKey: ["attribute-sets"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createAttributeSet };
}

export default useCreateAttributeSet;

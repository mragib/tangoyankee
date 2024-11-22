import { addAndEditInstance } from "@/services/apiInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useEditInstance() {
  const queryClient = useQueryClient();

  const { mutate: editInstance, isPending: isEditing } = useMutation({
    mutationFn: ({ newInstanceData, id }) =>
      addAndEditInstance(newInstanceData, id),
    onSuccess: () => {
      toast.success("The instance has been updated");
      queryClient.invalidateQueries({
        queryKey: ["instances"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editInstance };
}

export default useEditInstance;

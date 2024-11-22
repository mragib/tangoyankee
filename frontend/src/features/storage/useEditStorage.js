import { addAndEditStorage } from "@/services/apiStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useEditStorage() {
  const queryClient = useQueryClient();

  const { mutate: editStorage, isPending: isEditing } = useMutation({
    mutationFn: ({ newStorageData, id }) =>
      addAndEditStorage(newStorageData, id),
    onSuccess: () => {
      toast.success("The product stoke has been updated");
      queryClient.invalidateQueries({
        queryKey: ["storage"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editStorage };
}

export default useEditStorage;

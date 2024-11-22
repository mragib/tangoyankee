import { addAndEditBranch } from "@/services/apiBranch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useEditBranch() {
  const queryClient = useQueryClient();

  const { mutate: editBranch, isPending: isEditing } = useMutation({
    mutationFn: ({ newBranchData, id }) => addAndEditBranch(newBranchData, id),
    onSuccess: () => {
      toast.success("The branch has been updated");
      queryClient.invalidateQueries({
        queryKey: ["branches"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editBranch };
}

export default useEditBranch;

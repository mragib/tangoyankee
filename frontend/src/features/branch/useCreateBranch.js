import { addAndEditBranch } from "@/services/apiBranch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateBranch() {
  const queryClient = useQueryClient();
  const { mutate: createBranch, isPending: isCreating } = useMutation({
    mutationFn: addAndEditBranch,
    onSuccess: () => {
      toast.success("New Branch Set has been created");
      queryClient.invalidateQueries({
        queryKey: ["branches"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createBranch };
}

export default useCreateBranch;

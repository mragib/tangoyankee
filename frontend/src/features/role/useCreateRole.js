import { addAndEditRole } from "@/services/apiRole";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateRole() {
  const queryClient = useQueryClient();
  const { mutate: createRole, isPending: isCreating } = useMutation({
    mutationFn: addAndEditRole,
    onSuccess: () => {
      toast.success("A new role has been created");
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createRole };
}

export default useCreateRole;

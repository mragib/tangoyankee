import { addAndEditAttribute } from "@/services/apiAttribute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateAttribute() {
  const queryClient = useQueryClient();
  const { mutate: createAttribute, isPending: isCreating } = useMutation({
    mutationFn: addAndEditAttribute,
    onSuccess: () => {
      toast.success("New Attribute has been created");
      queryClient.invalidateQueries({
        queryKey: ["attributes"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createAttribute };
}

export default useCreateAttribute;

import { addAndEditInstance as addAndEditInstanceApi } from "@/services/apiInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateInstance() {
  const queryClient = useQueryClient();
  const { mutate: createInstance, isPending: isCreating } = useMutation({
    mutationFn: addAndEditInstanceApi,
    onSuccess: () => {
      toast.success("New Instance has been created");
      queryClient.invalidateQueries({
        queryKey: ["instances"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createInstance };
}

export default useCreateInstance;

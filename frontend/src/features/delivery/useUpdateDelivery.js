import { updateDelivery } from "@/services/apiDelivery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useUpdateDelivery() {
  const queryClient = useQueryClient();

  const { mutate: editDelivery, isPending: isEditing } = useMutation({
    mutationFn: ({ newDeliveryData, id }) =>
      updateDelivery(newDeliveryData, id),
    onSuccess: () => {
      toast.success("The delivery has been updated");
      queryClient.invalidateQueries({
        queryKey: ["deliveries"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editDelivery };
}

export default useUpdateDelivery;

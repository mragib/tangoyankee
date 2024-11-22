import { editSale as editSaleApi } from "@/services/apiSales";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function useEditSale() {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { mutate: editSale, isPending: isEditing } = useMutation({
    mutationFn: ({ updatedSale, id }) => editSaleApi(updatedSale, id),
    onSuccess: () => {
      toast.success("The sale has been updated");
      queryClient.invalidateQueries({
        queryKey: ["sale", id],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editSale };
}

export default useEditSale;

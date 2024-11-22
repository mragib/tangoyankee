import { addAndEditChartOfAccounting } from "@/services/apiChartOfAccounting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useEditChartOfAccounting() {
  const queryClient = useQueryClient();

  const { mutate: editChartOfAccounting, isPending: isEditing } = useMutation({
    mutationFn: ({ newChartOfAccountingData, id }) =>
      addAndEditChartOfAccounting(newChartOfAccountingData, id),
    onSuccess: () => {
      toast.success("The ledger has been updated");
      queryClient.invalidateQueries({
        queryKey: ["chartOfAccounting"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editChartOfAccounting };
}

export default useEditChartOfAccounting;

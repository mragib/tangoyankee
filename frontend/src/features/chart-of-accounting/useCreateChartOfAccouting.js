import { addAndEditChartOfAccounting } from "@/services/apiChartOfAccounting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateChartOfAccouting() {
  const queryClient = useQueryClient();
  const { mutate: createChartOfAccounting, isPending: isCreating } =
    useMutation({
      mutationFn: addAndEditChartOfAccounting,
      onSuccess: () => {
        toast.success("New Chart of accounting has been created");
        queryClient.invalidateQueries({
          queryKey: ["chartOfAccounting"],
        });
      },
      onError: (err) => toast.error(err.message),
    });
  return { isCreating, createChartOfAccounting };
}

export default useCreateChartOfAccouting;

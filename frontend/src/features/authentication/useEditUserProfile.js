import { editUserProfile as editUserProfileApi } from "@/services/apiUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useEditUserProfile() {
  const queryClient = useQueryClient();

  const { mutate: editUserProfile, isPending: isEditing } = useMutation({
    mutationFn: editUserProfileApi,
    onSuccess: () => {
      toast.success("User profile has been updated");
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editUserProfile };
}

export default useEditUserProfile;

import { allDataInsert } from "@/services/apiChartOfAccounting";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

function InsertInitialDataForm({ onCloseModal }) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    const data = await allDataInsert(formData);

    if (data.status) {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["chartOfAccounting"],
      });
      onCloseModal?.();
    } else {
      toast.error(data.message);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button type="submit">Upload CSV</button>
    </form>
  );
}

export default InsertInitialDataForm;

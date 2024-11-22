import Button from "@/ui/Button";
import useBranch from "./useBranch";
import { HiArrowsUpDown } from "react-icons/hi2";
import Spinner from "@/ui/Spinner";
import Menus from "@/ui/Menus";
import DataTable from "@/ui/DataTable";
import BranchRow from "./BranchRow";

function BranchTable() {
  const { branch, isLoading } = useBranch();
  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "name",
      accessorFn: (row) => `${row.name}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Branch
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "status",
      accessorFn: (row) => `${row.status}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return <BranchRow branch={data} />;
      },
    },
  ];

  if (isLoading) return <Spinner />;
  return (
    <Menus>
      <DataTable data={branch} columns={columns} />
    </Menus>
  );
}

export default BranchTable;

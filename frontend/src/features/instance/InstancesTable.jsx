import Button from "@/ui/Button";
import useInstance from "./useInstance";
import { HiArrowsUpDown } from "react-icons/hi2";
import InstanceRow from "./InstanceRow";
import Spinner from "@/ui/Spinner";
import Menus from "@/ui/Menus";
import DataTable from "@/ui/DataTable";
import SpinnerMini from "@/ui/SpinningMini";

function InstancesTable() {
  const { isLoading, instances } = useInstance();

  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      // header: "Product",
      id: "name",
      accessorFn: (row) => `${row.name}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Instance
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "attribute",
      accessorFn: (row) => `${row.attribute_set.name}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Attribute set
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return <InstanceRow instance={data} />;
      },
    },
  ];

  if (isLoading) return <SpinnerMini />;
  return (
    <Menus>
      <DataTable data={instances} columns={columns} />
    </Menus>
  );
}

export default InstancesTable;

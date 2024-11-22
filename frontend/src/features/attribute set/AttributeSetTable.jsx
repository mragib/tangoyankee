import DataTable from "@/ui/DataTable";
import Menus from "@/ui/Menus";
import useAttributeSets from "./useAttributeSets";
import Button from "@/ui/Button";
import { HiArrowsUpDown } from "react-icons/hi2";
import AttributeSetRow from "./AttributeSetRow";
import SpinnerMini from "@/ui/SpinningMini";
import Empty from "@/ui/Empty";

function AttributeSetTable() {
  const { isLoading, attribute_sets, error } = useAttributeSets();

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
            Attribute set
            <HiArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const attribute_set = row.original;

        return <AttributeSetRow attributeSet={attribute_set} />;
      },
    },
  ];

  // if (isLoading) return <Spinner />;
  if (isLoading) return <SpinnerMini />;
  if (error) return <p>{error.message}</p>;

  return (
    <Menus>
      <DataTable data={attribute_sets} columns={columns} />
    </Menus>
  );
}

export default AttributeSetTable;

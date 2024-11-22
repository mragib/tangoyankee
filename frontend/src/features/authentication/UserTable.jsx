import { ArrowUpDown } from "lucide-react";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";

import UserRow from "./UserRow";
import useUsers from "./useUsers";
import Button from "@/ui/Button";
import DataTable from "@/ui/DataTable";
import { capitalize } from "lodash";

function UserTable() {
  const { users, isLoading } = useUsers();
  const columns = [
    {
      header: "#",
      accessorFn: (row, index) => `${index + 1}`,
    },
    {
      id: "first_name",
      accessorFn: (row) => `${row.first_name}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            First Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "last_name",
      accessorFn: (row) => `${row.last_name}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "email",
      accessorFn: (row) => `${row.email}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "phone",
      accessorFn: (row) => `${row.phone}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "address",
      accessorFn: (row) => `${row.address}`,
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "role",
      accessorFn: (row) => capitalize(row.role.name),
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "block",
      accessorFn: (row) => (!row.isBlocked ? "✔ " : "❌"),
      header: ({ column }) => {
        return (
          <Button
            className="text-sm md:text-md font-bold uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Active
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return <UserRow user={data} />;
      },
    },
  ];
  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <DataTable data={users} columns={columns} />
    </Menus>
  );
}

export default UserTable;

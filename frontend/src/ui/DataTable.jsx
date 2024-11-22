import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import styled from "styled-components";
import Input from "./Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
  color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 400;
  font-size: 1.2rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

function DataTable({ data, columns, search = true, paginate = true }) {
  const [sorting, setSorting] = useState([]);
  const [filter, setFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
  });
  return (
    <div>
      <div className="mb-6">
        {search && (
          <Input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search"
          />
        )}
      </div>
      <Table className="overflow-hidden">
        <TableHeader>
          {table.getHeaderGroups().map((headergroup) => (
            <TableRow key={headergroup.id}>
              {headergroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="text-sm md:text-md uppercase text-center"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  {/* {
                    { asc: "🔼", desc: "🔽" }[
                      header.column.getIsSorted() ?? null
                    ]
                  } */}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="text-sm md:text-md text-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <tr>
            <td></td>
          </tr>
        </TableBody>
      </Table>
      {paginate && (
        <StyledPagination>
          <p className="font-light text-lg ml-2">
            Showing <span>{table.getPaginationRowModel().rows.length}</span> to{" "}
            <span>{}</span> of <span>{data.length}</span> results
          </p>
          <Buttons>
            <PaginationButton
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <HiChevronLeft />
              Prev
            </PaginationButton>
            <PaginationButton
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
              <HiChevronRight />
            </PaginationButton>
          </Buttons>
        </StyledPagination>
      )}
    </div>
  );
}

export default DataTable;

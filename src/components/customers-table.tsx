"use client"
 
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
 
type Customer = {
  id: string
  email: string | null
  name: string | null,
  created: number
  subscriptions?: {
    data: Array<{
      status: string
      current_period_end: number
    }>
  }
}

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div>{row.getValue("name") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email") || "N/A"}</div>,
  },
  {
    accessorKey: "subscriptions",
    header: "Status",
    cell: ({ row }) => {
      const subscriptions = row.original.subscriptions?.data || []
      const status = subscriptions[0]?.status || "none"
      
      return (
        <Badge className={
          status === "active" ? "bg-green-800 text-white capitalize" :
          status === "trialing" ? "bg-blue-800 text-white capitalize" :
          status === "none" ? "bg-gray-500 text-white capitalize" :
          "bg-red-800 text-white capitalize"
        }>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => {
      const timestamp = row.getValue("created") as number
      const date = new Date(timestamp * 1000).toLocaleDateString()
      return <div>{date}</div>
    },
  },
]
 
export function CustomersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Fetch customers using TanStack Query
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await fetch('/api/stripe', {
        headers: {
          'stripe-key': 'rk_test_51Q8i8fD7ZmEIkoWk4C6uB1OQYvonteH9BItlmpQ8GZ7Ku6XIVDN4AwL4pKWKy2WTZALvpryviaOneddOthQLj2rD00TNsr60GW'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }
      return response.json()
    }
  })

  const table = useReactTable({
    data: customers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center h-48">Loading customers...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-48 text-red-500">Error loading customers</div>
  }
 
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const header = typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : column.id
                
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {header}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
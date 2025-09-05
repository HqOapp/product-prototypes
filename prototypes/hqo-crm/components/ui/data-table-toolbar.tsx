import { Table } from "@tanstack/react-table"
import { X, Trash2, Mail, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  searchPlaceholder?: string
  onBulkDelete?: (selectedRows: TData[]) => void
  onBulkEmail?: (selectedRows: TData[]) => void
  onBulkInvite?: (selectedRows: TData[]) => void
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
  onBulkDelete,
  onBulkEmail,
  onBulkInvite,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows = table.getFilteredSelectedRowModel().rows

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      {selectedRows.length > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} selected
          </span>
          {onBulkEmail && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkEmail(selectedRows.map(row => row.original))}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          )}
          {onBulkInvite && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkInvite(selectedRows.map(row => row.original))}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          )}
          {onBulkDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkDelete(selectedRows.map(row => row.original))}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 
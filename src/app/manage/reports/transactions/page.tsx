'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/common/data-table';
import { SearchField } from '~/components/common/search-field';
import { Pagination } from '~/components/common/pagination';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { DatePicker } from '~/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { ArrowUpDown, Download, X } from 'lucide-react';
import { useReportTransactions } from './use-report-transactions';
import { useFetchCategory } from '../../category/use-fetch-category';
import { useFetchSupplier } from '../../supplier/use-fetch-supplier';
import { SelectCategory } from '../../category/schema';
import { SelectSupplier } from '../../supplier/schema';
import { formatRp } from '~/utils/rupiah';
import { SelectReportTransactions } from './schema';
import { formatDate } from '~/utils/date';

const MAX_NAME_LENGTH = 28;
const MAX_CODE_LENGTH = 8;
const MAX_NAME_SUPPLIER_LENGTH = 14;

export default function TransactionsReportPage() {
  const {
    data,
    meta,
    isLoading,
    mutate,
    setType,
    type,
    setSort,
    setSortBy,
    setKeyword,
    setPage,
    setStartDate,
    setEndDate,
    setCategoryId,
    setSupplierId,
    setUserId,
    keyword,
    sort,
    sortBy,
    startDate,
    endDate,
    categoryId,
    supplierId,
    userId
  } = useReportTransactions();

  // Fetch data for filter dropdowns
  const { categories } = useFetchCategory();
  const { suppliers } = useFetchSupplier();

  const columns = useMemo<ColumnDef<SelectReportTransactions>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: () => (
          <Button variant="ghost" size="sm" onClick={() => toggleSort('createdAt')}>
            Date
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => formatDate(row.original.createdAt)
      },
      {
        accessorKey: 'sku.skuCode',
        header: 'SKU',
        cell: ({ row }) => {
          const skuCode = row.original.sku.skuCode;
          return (
            <span className="font-medium" title={skuCode}>
              {skuCode.length > MAX_CODE_LENGTH ? `${skuCode.substring(0, MAX_CODE_LENGTH)}...` : skuCode}
            </span>
          );
        }
      },
      {
        accessorKey: 'sku.name',
        header: 'Name',
        cell: ({ row }) => {
          const skuName = row.original.sku.name;
          const categoryName = row.original.category?.name ?? '-';
          return (
            <>
              <span className="font-medium" title={skuName}>
                {skuName.length > MAX_NAME_LENGTH ? `${skuName.substring(0, MAX_NAME_LENGTH)}...` : skuName}
              </span>

              <div className="text-muted-foreground" title={categoryName}>
                {categoryName.length > MAX_NAME_LENGTH
                  ? `${categoryName.substring(0, MAX_NAME_LENGTH)}...`
                  : categoryName}
              </div>
            </>
          );
        }
      },
      {
        accessorKey: 'supplier.name',
        header: 'Supplier',
        cell: ({ row }) => {
          const supplierName = row.original.supplier?.name ?? '-';
          return (
            <span title={supplierName}>
              {supplierName.length > MAX_NAME_SUPPLIER_LENGTH
                ? `${supplierName.substring(0, MAX_NAME_SUPPLIER_LENGTH)}...`
                : supplierName}
            </span>
          );
        }
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.original.type;
          return (
            <Badge variant={type === 'IN' ? 'success' : 'destructive'} size="sm">
              {type}
            </Badge>
          );
        }
      },
      {
        accessorKey: 'quantity',
        header: () => (
          <Button variant="ghost" size="sm" onClick={() => toggleSort('quantity')}>
            Qty
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <span className="tabular-nums">{row.original.quantity}</span>
      },
      {
        accessorKey: 'unitPrice',
        header: 'Unit Price',
        cell: ({ row }) => formatRp(row.original.unitPrice)
      },
      {
        accessorKey: 'totalPrice',
        header: 'Total',
        cell: ({ row }) => formatRp(row.original.totalPrice)
      },
      {
        accessorKey: 'documentNumber',
        header: 'Doc #',
        cell: ({ row }) => {
          const docNumber = row.original.documentNumber ?? '-';
          return (
            <span title={docNumber}>
              {docNumber.length > MAX_CODE_LENGTH
                ? `${docNumber.substring(0, MAX_CODE_LENGTH)}...`
                : docNumber}
            </span>
          );
        }
      },
      {
        accessorKey: 'createdBy.name',
        header: 'By',
        cell: ({ row }) => {
          const createdByName = row.original.createdBy?.name ?? '-';
          return (
            <span title={createdByName}>
              {createdByName.length > MAX_NAME_LENGTH
                ? `${createdByName.substring(0, MAX_NAME_LENGTH)}...`
                : createdByName}
            </span>
          );
        }
      }
    ],
    [sort, sortBy]
  );

  const toggleSort = (field: 'createdAt' | 'updatedAt' | 'quantity') => {
    if (sortBy === field) {
      setSort((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSort('desc');
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const clearFilters = () => {
    setKeyword('');
    setType('');
    setStartDate('');
    setEndDate('');
    setCategoryId('');
    setSupplierId('');
    setUserId('');
    setPage(1);
  };

  const hasActiveFilters = keyword || type || startDate || endDate || categoryId || supplierId || userId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions Report</h1>
          <p className="text-muted-foreground">Riwayat transaksi stock IN/OUT</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => mutate()}>
            Refresh
          </Button>

          <Button variant="outline">
            <Download /> Export
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchField
            placeholder="Cari nama SKU..."
            value={keyword}
            onChange={handleSearch}
            className="min-w-[200px]"
          />

          <Select
            value={type}
            onValueChange={(value: '' | 'IN' | 'OUT') => {
              setType(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="IN">IN</SelectItem>
              <SelectItem value="OUT">OUT</SelectItem>
            </SelectContent>
          </Select>

          <DatePicker
            value={startDate ? new Date(startDate) : undefined}
            onChange={(date) => {
              setStartDate(date ? date.toISOString().split('T')[0] : '');
              setPage(1);
            }}
            placeholder="Start Date"
            dateFormat="dd/MM/yyyy"
            className="w-[140px]"
          />

          <DatePicker
            value={endDate ? new Date(endDate) : undefined}
            onChange={(date) => {
              setEndDate(date ? date.toISOString().split('T')[0] : '');
              setPage(1);
            }}
            placeholder="End Date"
            dateFormat="dd/MM/yyyy"
            className="w-[140px]"
          />

          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories?.map((category: SelectCategory) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={supplierId}
            onValueChange={(value) => {
              setSupplierId(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Suppliers</SelectItem>
              {suppliers?.map((supplier: SelectSupplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {keyword && (
              <Badge variant="secondary" className="text-xs">
                Search: {keyword}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setKeyword('');
                    setPage(1);
                  }}
                />
              </Badge>
            )}
            {type && (
              <Badge variant="secondary" className="text-xs">
                Type: {type}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setType('');
                    setPage(1);
                  }}
                />
              </Badge>
            )}
            {startDate && (
              <Badge variant="secondary" className="text-xs">
                From: {formatDate(new Date(startDate))}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setStartDate('');
                    setPage(1);
                  }}
                />
              </Badge>
            )}
            {endDate && (
              <Badge variant="secondary" className="text-xs">
                To: {formatDate(new Date(endDate))}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setEndDate('');
                    setPage(1);
                  }}
                />
              </Badge>
            )}
            {categoryId && (
              <Badge variant="secondary" className="text-xs">
                Category: {categories?.find((c: SelectCategory) => c.id === categoryId)?.name || categoryId}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setCategoryId('');
                    setPage(1);
                  }}
                />
              </Badge>
            )}
            {supplierId && (
              <Badge variant="secondary" className="text-xs">
                Supplier: {suppliers?.find((s: SelectSupplier) => s.id === supplierId)?.name || supplierId}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setSupplierId('');
                    setPage(1);
                  }}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} />

      <Pagination meta={meta} onPageChange={(p) => setPage(p)} className="mt-4" />
    </div>
  );
}

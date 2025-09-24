export type RequestOption = {
  keyword?: string;
  limit: string;
  sort: 'asc' | 'desc';
  sortBy: 'createdAt' | 'updatedAt';
  page: string;
};

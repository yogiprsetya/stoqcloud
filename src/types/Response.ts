export type HttpMeta = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export type HttpResponse<T> = {
  success: boolean;
  meta?: HttpMeta;
  data: T;
};

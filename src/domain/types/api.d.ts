interface Pagination {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}
interface ResponseApi<T> {
  message: string;
  data: T;
  pagination: Pagination;
}

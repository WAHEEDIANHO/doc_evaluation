export class PaginatedResultDto {
  data: any[];
  nextCursor: string;
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  previousCursor: string;
}
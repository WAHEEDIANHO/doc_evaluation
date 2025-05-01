export class PaginatedResultDto {
  data: any[];
  nextCursor: string;
  hasNextPage: boolean;
  previousCursor: string;
}
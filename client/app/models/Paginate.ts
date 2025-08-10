
export interface Paginate<Type> {
    docs: Type[],
    hasNextPage: boolean,
    hasPrevPage: boolean,
    limit: number,
    offset: number,
    page: number,
    pagingCounter: number,
    nextPage: number | null,
    prevPage: number | null,
    totalDocs: number,
    totalPages: number,
}
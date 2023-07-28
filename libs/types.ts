// types:
export interface PaginationArgs {
    page    ?: number
    perPage ?: number
}
export interface Pagination<TEntry> {
    total    : number
    entities : TEntry[]
}

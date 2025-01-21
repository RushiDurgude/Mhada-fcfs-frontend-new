export class Page<T> {
    constructor(
        public content: T[],
        public pageable: Pageable,
        public last: boolean,
        public totalPages: number,
        public totalElements: number,
        public sort: Sort,
        public first: boolean,
        public numberOfElements: number,
        public size: number,
        public number: number,
        public empty: boolean
    ) { }
}

class Pageable {
    constructor(
        public sort: Sort,
        public pageNumber: number,
        public pageSize: number,
        public offset: number,
        public paged: boolean,
        public unpaged: boolean
    ) { }
}

class Sort {
    constructor(
        public unsorted: boolean,
        public sorted: boolean,
        public empty: boolean
    ) { }
}
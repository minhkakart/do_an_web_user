export interface PropsPagination {
	total: number;
	page: number;
	onSetPage: (page: number) => void;
	pageSize: number;
	onSetPageSize: (pageSize: number) => void;
	dependencies?: any[];
}

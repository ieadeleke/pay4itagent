import ReactPaginate, { ReactPaginateProps } from "react-paginate";

type TablePaginationProps = ReactPaginateProps & {
    currentPage?: number
}

export function TablePagination({ currentPage, ...props }: TablePaginationProps) {

    return <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        pageRangeDisplayed={5}
        forcePage={currentPage}
        className="flex gap-4"
        nextClassName="text-gray-500"
        previousClassName="text-gray-500"
        pageClassName="flex w-8 h-7 bg-white justify-center items-center text-sm text-gray-500 rounded-sm outline outline-2 outline-gray-100 text-center"
        activeClassName="!bg-primary text-white !outline-none"
        previousLabel="<"
        renderOnZeroPageCount={null}
        {...props}
    />
}
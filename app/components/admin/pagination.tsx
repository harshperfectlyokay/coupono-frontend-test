import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  entryCount: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  entryCount,
  onPageChange,
}) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(currentPage - 3, 1);
    let endPage = Math.min(currentPage + 3, totalPages);

    if (currentPage <= 4) {
      endPage = Math.min(7, totalPages - 1);
    } else if (currentPage >= totalPages - 3) {
      startPage = Math.max(totalPages - 6, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`sm:px-4 sm:py-2 px-2 py-1 mx-1 rounded-lg dark:text-black ${
            currentPage === i
              ? 'bg-blue-500 text-white font-bold'
              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push(<span key="ellipsis" className="mx-2">...</span>);
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className={`sm:px-4 sm:py-2 px-2 py-1 mx-1 rounded-lg dark:text-black ${
            currentPage === totalPages
              ? 'bg-blue-500 text-white font-bold'
              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center sm:w-[90%] w-full my-3 mx-auto p-2">
      <button
        className={`sm:px-4 sm:py-2 px-2 py-1 bg-white rounded-lg dark:text-black ${
          currentPage === 1 ? 'cursor-not-allowed text-gray-400' : ''
        }`}
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        &lt; 
      </button>
      <div className="flex flex-wrap items-center justify-center mx-2">
        {renderPageNumbers()}
      </div>
      <button
        className={`sm:px-4 sm:py-2 px-2 py-1 bg-white rounded-lg dark:text-black ${
          currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : ''
        }`}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
         &gt;
      </button>
    </div>
  );
};

export default Pagination;

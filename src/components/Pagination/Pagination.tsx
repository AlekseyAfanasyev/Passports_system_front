import React, { FC } from 'react';
import "./Pagination.styles.css"

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  paginate: (pageNumber: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  pageCount,
  goToNextPage,
  goToPrevPage,
  paginate,
}) => {

  const displayPageCount = Math.min(pageCount, 2);

  return (
    <div style={{ margin: '0 auto' }}>
        <ul className="pagination">
            {currentPage !== 1 && (
                <>
                    <li>
                        <button
                            onClick={goToPrevPage}
                        >
                            &lt;
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => paginate(1)}
                        >
                            1
                        </button>
                    </li>
                    {currentPage > 2 && (<li>...</li>)}
                </>
            )}
            {Array.from({ length: displayPageCount }).map((_, index) => {
                const pageNumber = currentPage - 1 + index;
                return (
                    <li key={pageNumber}>
                        {currentPage !== pageCount && (
                            <button 
                                onClick={() => paginate(pageNumber + 1)}
                                className={pageNumber + 1 === currentPage ? 'active' : ''}
                            >
                                {pageNumber + 1}
                            </button>
                        )}
                        {currentPage === pageCount && (
                            <button 
                                onClick={() => paginate(pageNumber)}
                                className={pageNumber === currentPage ? 'active' : ''}
                            >
                                {pageNumber}
                            </button>
                        )}
                    </li>
                );
            })}
            {currentPage !== pageCount && (
                <>
                    {currentPage < pageCount - 1 && (<li>...</li>)}
                    <li>
                        <button
                            onClick={goToNextPage}
                        >
                            &gt;
                        </button>
                    </li>
                </>
            )}
        </ul>
    </div>
  );
};

export default Pagination;
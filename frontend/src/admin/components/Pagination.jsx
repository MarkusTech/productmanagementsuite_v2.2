import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevNext = (direction) => {
    const newPage = currentPage + direction;
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="table__pagination">
      <button
        className={`pagination__button ${currentPage === 0 ? "disabled" : ""}`}
        onClick={() => handlePrevNext(-1)}
        disabled={currentPage === 0}
      >
        &lt; Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <div
          key={index}
          className={`table__pagination-item ${
            currentPage === index ? "active" : ""
          }`}
          onClick={() => onPageChange(index)}
        >
          {index + 1}
        </div>
      ))}

      <button
        className={`pagination__button ${
          currentPage === totalPages - 1 ? "disabled" : ""
        }`}
        onClick={() => handlePrevNext(1)}
        disabled={currentPage === totalPages - 1}
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;

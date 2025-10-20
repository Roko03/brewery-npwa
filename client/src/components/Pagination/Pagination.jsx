import Button from "@/components/Button";
import styles from "./Pagination.module.scss";

const Pagination = ({ currentPage, totalPages, pageSize, totalCount, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(0, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);

      if (startPage > 0) {
        pages.push(0);
        if (startPage > 1) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) pages.push("...");
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Prikazano {startItem}-{endItem} od {totalCount} rezultata
      </div>
      <div className={styles.controls}>
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentPage === 0}
        >
          Prethodna
        </Button>

        <div className={styles.pages}>
          {getPageNumbers().map((page, index) => (
            page === "..." ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`${styles.pageButton} ${
                  currentPage === page ? styles.active : ""
                }`}
              >
                {page + 1}
              </button>
            )
          ))}
        </div>

        <Button
          variant="secondary"
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
        >
          Sljedeća
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

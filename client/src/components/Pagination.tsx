import ChevronLeftIcon from "../assets/icons/chevrons/chevron-left.svg?react";
import ChevronRightIcon from "../assets/icons/chevrons/chevron-right.svg?react";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (newPage: number) => void;
};

const buttonClassName =
  "grid size-11 place-items-center rounded-xl border border-base-300 bg-base-200 font-semibold transition-colors hover:border-base-content/40 disabled:cursor-not-allowed disabled:opacity-40";

const chevronClassName =
  "grid size-11 place-items-center rounded-xl border border-base-300 bg-base-200 text-secondary transition-colors hover:border-base-content/40 disabled:cursor-not-allowed disabled:text-base-content disabled:opacity-40";

const Pagination = ({ page, pageCount, onPageChange }: PaginationProps) => {
  if (pageCount <= 1) {
    return null;
  }

  const goToPage = (newPage: number) => {
    onPageChange(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        aria-label="Page précédente"
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        className={chevronClassName}
      >
        <ChevronLeftIcon aria-hidden="true" className="size-4" />
      </button>

      {page > 1 && (
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          className={buttonClassName}
        >
          {page - 1}
        </button>
      )}

      <button
        type="button"
        aria-current="page"
        className="grid size-11 place-items-center rounded-xl bg-secondary font-semibold text-secondary-content"
      >
        {page}
      </button>

      {page < pageCount && (
        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          className={buttonClassName}
        >
          {page + 1}
        </button>
      )}

      <button
        type="button"
        aria-label="Page suivante"
        onClick={() => goToPage(page + 1)}
        disabled={page === pageCount}
        className={chevronClassName}
      >
        <ChevronRightIcon aria-hidden="true" className="size-4" />
      </button>
    </nav>
  );
};

export default Pagination;

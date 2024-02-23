export default function Pagination({
  page,
  pageCount,
  onNextPage,
  onPrevPage,
}) {
  return (
    <div className="pagination">
      <button
        className={`btn-page ${page === 1 ? 'btn-page__hidden' : null}`}
        onClick={onPrevPage}
      >
        Prev
      </button>
      <span>{page}</span>
      <button
        className={`btn-page ${page === pageCount ? 'btn-page__hidden' : null}`}
        onClick={onNextPage}
      >
        Next
      </button>
    </div>
  );
}

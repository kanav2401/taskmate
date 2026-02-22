import "./pagination.css";

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  setPage,
  setLimit,
}) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="pagination-wrapper">

      {/* Showing Info */}
      <div className="pagination-info">
        Showing <strong>{start}–{end}</strong> of{" "}
        <strong>{total}</strong> results
      </div>

      {/* Page Size Selector */}
      <div className="page-size-container">
        <span>Show:</span>
        <select
          value={limit}
          onChange={(e) => {
            setPage(1);
            setLimit(Number(e.target.value));
          }}
        >
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Page Buttons */}
      <div className="page-buttons">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setPage(index + 1)}
            className={`page-btn ${page === index + 1 ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, total, limit, setPage, setLimit }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = () => {
    let pages = [];
    let startPage = Math.max(1, page - 1);
    let endPage = Math.min(totalPages, startPage + 2);

    if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 w-full">
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left">
        <div className="bg-secondary/50 px-4 py-2 rounded-xl border border-border">
            Showing <strong className="text-foreground">{start}–{end}</strong> of <strong className="text-foreground">{total}</strong> results
        </div>

        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-1.5 rounded-xl border border-border">
          <span className="font-medium">Show:</span>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="bg-transparent text-foreground font-bold focus:outline-none focus:ring-0 cursor-pointer p-1"
          >
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-secondary/30 p-1.5 rounded-2xl border border-border">

        <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer transition-colors border-none bg-transparent"
        >
            <ChevronLeft className="w-5 h-5" />
        </button>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border-none flex items-center justify-center ${
                page === num 
                ? "brand-gradient text-white shadow-md shadow-primary/20" 
                : "bg-transparent text-muted-foreground hover:bg-background hover:text-foreground"
            }`}
          >
            {num}
          </button>
        ))}

        <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer transition-colors border-none bg-transparent"
        >
            <ChevronRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}

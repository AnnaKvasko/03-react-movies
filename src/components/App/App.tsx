import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { searchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  function handleSearch(q: string) {
    setQuery(q);
    setMovies([]);
    setPage(1);
    setTotalPages(null);
    setError(null);
    setSelectedMovie(null);
  }

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchMovies(query, page, controller.signal)
      .then((data) => {
        if (page === 1 && data.results.length === 0) {
          toast.error("No movies found for your request.");
        }
        setMovies((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setTotalPages(data.total_pages);
      })
      .catch((e: any) => {
        if (e?.name !== "AbortError" && e?.name !== "CanceledError") {
          setError(e?.message ?? "Something went wrong");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query, page]);

  const canLoadMore = totalPages !== null && page < totalPages;

  return (
    <>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      <main style={{ maxWidth: 1200, margin: "20px auto", padding: "0 16px" }}>
        {error ? (
          <ErrorMessage />
        ) : loading && movies.length === 0 ? (
          <Loader />
        ) : (
          <>
            <MovieGrid
              movies={movies}
              onSelect={(movie) => setSelectedMovie(movie)}
            />

            {movies.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 16,
                }}
              >
                <button
                  onClick={() => setPage((p) => (canLoadMore ? p + 1 : p))}
                  disabled={loading || !canLoadMore}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    cursor: loading || !canLoadMore ? "not-allowed" : "pointer",
                  }}
                >
                  {loading && canLoadMore
                    ? "Loading…"
                    : canLoadMore
                    ? "Load more"
                    : "No more results"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}

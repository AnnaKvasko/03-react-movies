import type { Movie } from "../../types/movie";
import css from "./MovieGrid.module.css";

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <ul className={css.grid}>
      {movies.map((m) => {
        const poster = m.poster_path
          ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
          : null;

        return (
          <li key={m.id}>
            <div className={css.card}>
              {poster ? (
                <img
                  className={css.image}
                  src={poster}
                  alt={m.title}
                  loading="lazy"
                  onClick={() => onSelect(m)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(m);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open movie ${m.title}`}
                />
              ) : (
                <div
                  className={css.imageFallback}
                  onClick={() => onSelect(m)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open movie ${m.title}`}
                >
                  No image
                </div>
              )}

              <h2 className={css.title}>{m.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";

type Props = {
  movie: Movie;
  onClose: () => void;
};

export default function MovieModal({ movie, onClose }: Props) {
  const modalRoot = document.getElementById("modal-root");

  useEffect(() => {
    document.body.classList.add("modal-open");

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  if (!modalRoot) return null;

  const imgPath = movie.backdrop_path ?? movie.poster_path ?? null;
  const imgSrc = imgPath
    ? `https://image.tmdb.org/t/p/original${imgPath}`
    : null;

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={movie.title}
      onClick={onBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>

        {imgSrc ? (
          <img src={imgSrc} alt={movie.title} className={css.image} />
        ) : (
          <div className={css.imageFallback} aria-hidden>
            No image
          </div>
        )}

        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview || "—"}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || "—"}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average?.toFixed?.(1) ?? "—"}
            /10
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}

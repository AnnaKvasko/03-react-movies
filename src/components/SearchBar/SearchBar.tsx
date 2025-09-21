import toast from "react-hot-toast";
import styles from "./SearchBar.module.css";

type SearchBarProps = {
  onSubmit: (query: string) => void;
};

export default function SearchBar({ onSubmit }: SearchBarProps) {
  async function searchAction(formData: FormData) {
    const raw = (formData.get("query") ?? "").toString().trim();

    if (!raw) {
      toast.error("Please enter your search query.");
      return;
    }

    onSubmit(raw);
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form className={styles.form} action={searchAction}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type { TmdbPaginatedResponse } from "../types/tmdb";
import type { Movie } from "../types/movie";

export type MoviesResponse = TmdbPaginatedResponse<Movie>;

const tmdb: AxiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

function authHeaders(): AxiosRequestConfig["headers"] {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  if (!token) throw new Error("VITE_TMDB_TOKEN is missing.");
  return { Authorization: `Bearer ${token}` };
}

export async function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal
): Promise<MoviesResponse> {
  const { data }: AxiosResponse<MoviesResponse> =
    await tmdb.get<MoviesResponse>("/search/movie", {
      headers: authHeaders(),
      signal,
      params: { query, page, language: "en-US", include_adult: false },
    });

  return data;
}

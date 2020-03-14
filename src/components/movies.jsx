import React, { Component } from "react";
import Pagination from "./common/pagination";
import Paginate from "../utils/paginate";
import ListGroup from "./common/listGroup";
import MovieTable from "../components/movieTable";
import _ from "lodash";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";

class Movies extends Component {
  state = {
    movies: [],
    genre: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "title", order: "asc" }
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genre: genres });
  }

  handleDelete = movie => {
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  render() {
    const {
      pageSize,
      currentPage,
      movies: allmovies,
      selectedGenre,
      sortColumn
    } = this.state;
    const { length: count } = this.state.movies;

    const filtered =
      selectedGenre && selectedGenre._id
        ? allmovies.filter(m => m.genre._id === selectedGenre._id)
        : allmovies;
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const movies = Paginate(sorted, currentPage, pageSize);

    if (count === 0)
      return (
        <p>
          <strong>There are no movies in the database!</strong>
        </p>
      );
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genre}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <p>
            Showing <strong> {filtered.length} </strong> movies from the
            database
          </p>
          <MovieTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;

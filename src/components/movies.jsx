import React, { Component } from "react";
import Pagination from "./common/pagination";
import Paginate from "../utils/paginate";
import ListGroup from "./common/listGroup";
import Like from "./common/like";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";

class Movies extends Component {
  state = {
    movies: [],
    genre: [],
    pageSize: 4,
    currentPage: 1
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  componentDidMount() {
    const genres = [{ name: "All Genres" }, ...getGenres()];
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
  render() {
    const {
      pageSize,
      currentPage,
      movies: allmovies,
      selectedGenre
    } = this.state;
    const { length: count } = this.state.movies;
    const filtered =
      selectedGenre && selectedGenre._id
        ? allmovies.filter(m => m.genre._id === selectedGenre._id)
        : allmovies;
    const movies = Paginate(filtered, currentPage, pageSize);

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
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Stock</th>
                <th>Rate</th>
                <th></th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre.name}</td>
                  <td>{movie.numberInStock}</td>
                  <td>{movie.dailyRentalRate}</td>
                  <td>
                    <Like
                      liked={movie.liked}
                      onClick={() => this.handleLike(movie)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => this.handleDelete(movie)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

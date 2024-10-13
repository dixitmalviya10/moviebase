import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Movies from './pages/movies/Movies';
import MovieDetails from './pages/movies/movie-details/MovieDetails';
import TvDetails from './pages/tv/tv-details/TvDetails';
import PersonDetails from './pages/person/person-details/PersonDetails';
// import Search from './pages/search/Search';
import TVShows from './pages/tv/TVShows';
import Person from './pages/person/Person';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TvDetails />} />
            <Route path="/movie" element={<Movies />} />
            <Route path="/movie/now-playing" element={<Movies />} />
            <Route path="/movie/upcoming" element={<Movies />} />
            <Route path="/movie/top-rated" element={<Movies />} />
            <Route path="/person" element={<Person />} />
            <Route path="/person/:id" element={<PersonDetails />} />
            {/* <Route path="/search" element={<Search />} /> */}
            <Route path="/tv" element={<TVShows />} />
            <Route path="/tv/airing-today" element={<TVShows />} />
            <Route path="/tv/on-the-air" element={<TVShows />} />
            <Route path="/tv/top-rated" element={<TVShows />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

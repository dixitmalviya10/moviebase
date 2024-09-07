import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Movies from "./pages/movies/Movies";
import MovieDetails from "./pages/movies/movie-details/MovieDetails";
import TvDetails from "./pages/tv/tv-details/TvDetails";
import CastDetails from "./pages/person/cast-details/CastDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TvDetails />} />
            <Route path="/popular-movies" element={<Movies />} />
            <Route path="/movie/:id/cast" element={<CastDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

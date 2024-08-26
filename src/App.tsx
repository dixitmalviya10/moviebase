import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Movies from "./pages/movies/Movies";
import MovieDetails from "./pages/movie-details/MovieDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/popular-movies" element={<Movies />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

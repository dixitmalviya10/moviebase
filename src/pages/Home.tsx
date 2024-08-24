import Banner from "../components/home/Banner";
import LatestTrailers from "../components/home/LatestTrailers";
import Trending from "../components/home/Trending";
import WatchFree from "../components/home/WatchFree";

const Home = () => {
  return (
    <>
      <section className="home-banner space-bottom">
        <Banner />
      </section>

      <section className="space-bottom">
        <Trending />
      </section>

      <section className="latest-trailers">
        <LatestTrailers />
      </section>

      <section>
        <WatchFree />
      </section>
    </>
  );
};

export default Home;

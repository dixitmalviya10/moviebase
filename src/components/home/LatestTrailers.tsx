import Heading from "rsuite/Heading";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Tabs from "rsuite/Tabs";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import Panel from "rsuite/Panel";
import Placeholder from "rsuite/Placeholder";
import Modal from "rsuite/Modal";
import config from "../../configs/configs.json";
import { CirclePlay } from "lucide-react";
import { swiperConfig } from "../../lib/swiperConfig";

interface TrailerDataArray {
  readonly id: number;
  name: string;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
}

interface TrailerData {
  results: TrailerDataArray[];
}

interface TrailerObjInterface {
  title: string;
  url: string;
}

interface Data {
  name: string;
  id: number;
  title: string;
  original_language: string;
}

const LatestTrailers = () => {
  const [isLoading, setIsLoading] = useState<{
    video: boolean;
    videos: boolean;
  }>({
    video: false,
    videos: false,
  });
  const [activeKey, setActiveKey] = useState("movie/popular");
  const [open, setOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<TrailerObjInterface>({
    title: "",
    url: "",
  });
  const [trailerData, setTrailerData] = useState<TrailerData>({
    results: [],
  });
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const handleTrailerData = async () => {
      setIsLoading((prev) => ({ ...prev, videos: true }));
      try {
        const response = await axiosInstance.get(activeKey);
        setTrailerData(response?.data);
        setBackgroundImage(response?.data?.results[0]?.backdrop_path);
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading((prev) => ({ ...prev, videos: false }));
      }
    };
    handleTrailerData();
  }, [activeKey]);

  const fetchMovie = async (data: Data) => {
    setIsLoading((prev) => ({ ...prev, video: true }));
    try {
      const response = await axiosInstance.get(`movie/${data.id}/videos`);
      const trailers = response.data.results.filter(
        (video: { type: string; site: string }) =>
          video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailers.length > 0) {
        setTrailerUrl((prev) => ({
          ...prev,
          title: data.title,
          url: `https://www.youtube.com/embed/${trailers[0].key}`,
        }));
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, video: false }));
    }
  };

  const fetchTvShow = async (data: Data) => {
    setIsLoading((prev) => ({ ...prev, video: true }));
    try {
      const response = await axiosInstance.get(`tv/${data.id}/videos`, {
        params: { include_video_language: data?.original_language },
      });
      const trailers = response.data.results.filter(
        (video: { type: string; site: string }) =>
          video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailers.length > 0) {
        setTrailerUrl((prev) => ({
          ...prev,
          title: data.name,
          url: `https://www.youtube.com/embed/${trailers[0].key}`,
        }));
      } else {
        setTrailerUrl((prev) => ({
          ...prev,
          title: "N.A",
          url: "N.A",
        }));
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, video: false }));
    }
  };

  const handleOpen = (data: Data) => {
    if (data?.title) {
      fetchMovie(data);
    } else {
      fetchTvShow(data);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${config["med2-res-image-path"]}${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgba(255, 0, 150, 0.3)",
          backgroundBlendMode: "overlay",
          color: "white",
          padding: "2rem 1rem 0 1rem",
        }}>
        <Heading>Latest Trailers</Heading>
        <Tabs
          defaultActiveKey="movie/popular"
          appearance="pills"
          onSelect={(value: any) => setActiveKey(value)}>
          <Tabs.Tab eventKey="movie/popular" title="Popular">
            <Swiper {...swiperConfig}>
              {isLoading.videos ? (
                <Placeholder.Graph active />
              ) : (
                trailerData?.results.map((data) => (
                  <SwiperSlide
                    key={data?.id}
                    style={{ height: "auto" }}
                    onClick={() => handleOpen(data)}>
                    <Panel
                      title={data?.title}
                      className="latest-trailer-panel"
                      shaded
                      bodyFill
                      style={{ height: "100%", cursor: "pointer" }}
                      onMouseEnter={() =>
                        setBackgroundImage(data?.backdrop_path)
                      }>
                      <img
                        src={config["low-res-image-path"] + data?.backdrop_path}
                        width="100%"
                      />
                      <CirclePlay className="circleplay" size={60} />
                    </Panel>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </Tabs.Tab>
          <Tabs.Tab eventKey="movie/now_playing" title="Streaming">
            <Swiper {...swiperConfig}>
              {isLoading.videos ? (
                <Placeholder.Graph active />
              ) : (
                trailerData?.results.map((data) => (
                  <SwiperSlide
                    key={data?.id}
                    style={{ height: "auto" }}
                    onClick={() => handleOpen(data)}>
                    <Panel
                      title={data?.title}
                      className="latest-trailer-panel"
                      shaded
                      bodyFill
                      style={{ height: "100%", cursor: "pointer" }}
                      onMouseEnter={() =>
                        setBackgroundImage(data?.backdrop_path)
                      }>
                      <img
                        src={config["low-res-image-path"] + data?.backdrop_path}
                        width="100%"
                      />
                      <CirclePlay className="circleplay" size={60} />
                    </Panel>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </Tabs.Tab>

          <Tabs.Tab eventKey="tv/on_the_air" title="On TV">
            <Swiper {...swiperConfig}>
              {isLoading.videos ? (
                <Placeholder.Graph active />
              ) : (
                trailerData?.results.map((data) => (
                  <SwiperSlide
                    key={data?.id}
                    style={{ height: "auto" }}
                    onClick={() => handleOpen(data)}>
                    <Panel
                      title={data.name}
                      className="latest-trailer-panel"
                      shaded
                      bodyFill
                      style={{ height: "100%", cursor: "pointer" }}
                      onMouseEnter={() =>
                        setBackgroundImage(data?.backdrop_path)
                      }>
                      <img
                        src={config["low-res-image-path"] + data?.backdrop_path}
                        width="100%"
                      />
                      <CirclePlay className="circleplay" size={60} />
                    </Panel>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </Tabs.Tab>
        </Tabs>
      </div>
      <Modal
        size="lg"
        backdrop={true}
        keyboard={false}
        open={open}
        onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>{trailerUrl.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowX: "hidden", paddingBottom: 0 }}>
          {isLoading.video ? (
            <Placeholder.Graph active />
          ) : trailerUrl.url === "N.A" ? (
            <Heading>Trailer Not Available</Heading>
          ) : (
            <iframe
              width="100%"
              height={500}
              src={trailerUrl.url}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen></iframe>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LatestTrailers;

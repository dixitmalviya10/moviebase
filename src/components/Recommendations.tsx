import { useEffect, useState } from "react";
import Heading from "rsuite/Heading";
import Panel from "rsuite/Panel";
import Placeholder from "rsuite/Placeholder";
import { Swiper, SwiperSlide } from "swiper/react";
import { swiperConfig } from "../lib/swiperConfig";
import { configs } from "../configs/constants";
import axiosInstance from "../lib/axiosInstance";
import { Tag } from "rsuite";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface RecommendationData {
  results: {
    id: number;
    backdrop_path: string;
    title: string;
    vote_average: number;
    name: string;
  }[];
}

const Recommendations = ({ params, reloader, handleReloader }: any) => {
  const swiperConf = { ...swiperConfig, slidesPerView: 3.5 };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reccomData, setReccomData] = useState<RecommendationData>({
    results: [],
  });

  useEffect(() => {
    const mediaID = params.id?.split("-")[0];
    setIsLoading(true);
    const handleTrendingData = async () => {
      try {
        const response = await axiosInstance.get(
          `/movie/${mediaID}/recommendations`
        );
        setReccomData(response?.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };
    handleTrendingData();
  }, [reloader]);

  console.log("isLoading==", isLoading, "reLoader", reloader);
  return (
    <>
      <Heading level={4}>Recommendations</Heading>
      <Swiper {...swiperConf}>
        {isLoading ? (
          <Placeholder.Graph active height={250} />
        ) : (
          reccomData.results.map((data) => {
            const path = data?.title
              ? `/movie/${data?.id}-${data?.title
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")}`
              : data?.name
              ? `/tv/${data?.id}-${data?.name
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")}`
              : "/";
            return (
              <SwiperSlide key={data.id}>
                <Link to={path} onClick={() => handleReloader(!reloader)}>
                  <Panel shaded bordered bodyFill>
                    <img
                      src={
                        data.backdrop_path
                          ? configs["low-res-image-path"] + data.backdrop_path
                          : configs["no-image2"]
                      }
                      alt={data.title}
                      width="100%"
                      height={150}
                    />
                    <Panel>
                      <div className="margin-bottom-sm">{data.title}</div>

                      <Tag
                        title="Ratings"
                        size="sm"
                        color="blue"
                        className="rating-star-center">
                        <Star size={15} />
                        {data.vote_average
                          ? `${data.vote_average.toFixed(1)}/10`
                          : "Not Available"}
                      </Tag>
                    </Panel>
                  </Panel>
                </Link>
              </SwiperSlide>
            );
          })
        )}
      </Swiper>
    </>
  );
};

export default Recommendations;

import Heading from "rsuite/Heading";
import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axiosInstance";
import Tabs from "rsuite/Tabs";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import Panel from "rsuite/Panel";
import Placeholder from "rsuite/Placeholder";
import config from "../../configs/configs.json";
import { swiperConfig } from "../../lib/swiperConfig";
import { Link } from "react-router-dom";

interface TrendingDataArray {
  readonly id: number;
  name: string;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string;
}

interface TrendingData {
  results: TrendingDataArray[];
}

const Trending = () => {
  const swiperConf = { ...swiperConfig, slidesPerView: 7.5 };
  const [activeKey, setActiveKey] = useState<string>("day");
  const [trendingData, setTrendingData] = useState<TrendingData>({
    results: [],
  });

  useEffect(() => {
    const handleTrendingData = async () => {
      try {
        const response = await axiosInstance.get(`/trending/all/${activeKey}`);
        setTrendingData(response?.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    handleTrendingData();
  }, [activeKey]);

  return (
    <>
      <Heading>Trending</Heading>
      <Tabs
        defaultActiveKey="day"
        appearance="pills"
        onSelect={(value: any) => setActiveKey(value)}>
        <Tabs.Tab eventKey="day" title="Today">
          <Swiper {...swiperConf}>
            {!trendingData?.results ? (
              <Placeholder.Graph active />
            ) : (
              trendingData?.results.map((data) => {
                const path = data?.title
                  ? `/movie/${data?.id}-${data?.title
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")}`
                  : "/";
                return (
                  <SwiperSlide key={data?.id} style={{ height: "auto" }}>
                    <Link to={path}>
                      <Panel
                        shaded
                        bordered
                        bodyFill
                        style={{ height: "100%" }}>
                        <img
                          src={config["low-res-image-path"] + data?.poster_path}
                          width="100%"
                          height={250}
                          style={{ objectFit: "cover" }}
                        />
                        <Panel
                          header={data?.title || data?.original_title || "N.A"}>
                          <div>{data?.release_date || "N.A"}</div>
                        </Panel>
                      </Panel>
                    </Link>
                  </SwiperSlide>
                );
              })
            )}
          </Swiper>
        </Tabs.Tab>
        <Tabs.Tab eventKey="week" title="This Week">
          <Swiper {...swiperConf}>
            {!trendingData?.results ? (
              <Placeholder.Graph active />
            ) : (
              trendingData?.results.map((data) => (
                <SwiperSlide key={data?.id} style={{ height: "auto" }}>
                  <Panel shaded bordered bodyFill style={{ height: "100%" }}>
                    <img
                      src={config["low-res-image-path"] + data?.poster_path}
                      width="100%"
                      height={250}
                      style={{ objectFit: "cover" }}
                    />
                    <Panel
                      header={data?.title || data?.original_title || "N.A"}>
                      <div>{data?.release_date || "N.A"}</div>
                    </Panel>
                  </Panel>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </Tabs.Tab>
      </Tabs>
    </>
  );
};

export default Trending;

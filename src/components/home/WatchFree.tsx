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
import config from "../../configs/configs.json";
import { swiperConfig } from "../../lib/swiperConfig";

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

const WatchFree = () => {
  const swiperConf = { ...swiperConfig, slidesPerView: 7.5 };
  const [activeKey, setActiveKey] = useState<string>("movie");
  const [countryCode, setCountryCode] = useState("");
  const [trendingData, setTrendingData] = useState<TrendingData>({
    results: [],
  });

  useEffect(() => {
    const handleTrendingData = async () => {
      try {
        const response = await axiosInstance.get(`/discover/${activeKey}`, {
          params: {
            with_watch_monetization_types: "free|ads",
            watch_region: "IN",
          },
        });
        setTrendingData(response?.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    handleTrendingData();
  }, [activeKey]);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await fetch(
          `https://ipinfo.io/json?token=YOUR_API_KEY`
        );
        const data = await response.json();
        setCountryCode(data.country);
      } catch (error) {
        console.error("Error fetching country code:", error);
      }
    };

    fetchCountryCode();
  }, []);
  return (
    <>
      <Heading>Free To Watch</Heading>
      <Tabs
        defaultActiveKey="movie"
        appearance="pills"
        onSelect={(value: any) => setActiveKey(value)}>
        <Tabs.Tab eventKey="movie" title="Movie">
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
        <Tabs.Tab eventKey="tv" title="TV">
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

export default WatchFree;

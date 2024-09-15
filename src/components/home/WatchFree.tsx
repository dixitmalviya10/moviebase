import Heading from 'rsuite/Heading';
import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import Tabs from 'rsuite/Tabs';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import Panel from 'rsuite/Panel';
import Placeholder from 'rsuite/Placeholder';
import config from '../../configs/configs.json';
import { swiperConfig } from '../../lib/swiperConfig';
import { formatDate } from '../../lib/formatDate';
import { Link } from 'react-router-dom';

interface TrendingDataArray {
  readonly id: number;
  name: string;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string;
  first_air_date: string;
}

interface TrendingData {
  results: TrendingDataArray[];
}

const WatchFree = () => {
  const swiperConf = { ...swiperConfig, slidesPerView: 7.5 };
  const [activeKey, setActiveKey] = useState<string>('movie');
  const [trendingData, setTrendingData] = useState<TrendingData>({
    results: [],
  });

  useEffect(() => {
    const handleTrendingData = async () => {
      try {
        const response = await axiosInstance.get(`/discover/${activeKey}`, {
          params: {
            with_watch_monetization_types: 'free|ads',
            watch_region: 'IN',
          },
        });
        setTrendingData(response?.data);
      } catch (error) {
        console.log('error', error);
      }
    };
    handleTrendingData();
  }, [activeKey]);

  return (
    <>
      <Heading>Free To Watch</Heading>
      <Tabs
        defaultActiveKey="movie"
        appearance="pills"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSelect={(value: any) => setActiveKey(value)}
      >
        <Tabs.Tab eventKey="movie" title="Movie">
          <Swiper {...swiperConf}>
            {!trendingData?.results ? (
              <Placeholder.Graph active />
            ) : (
              trendingData?.results.map((data) => {
                const path = data?.title
                  ? `/movie/${data?.id}-${data?.title
                      ?.toLowerCase()
                      .replace(/\s+/g, '-')}`
                  : data?.name
                    ? `/tv/${data?.id}-${data?.name
                        ?.toLowerCase()
                        .replace(/\s+/g, '-')}`
                    : '/';
                return (
                  <SwiperSlide key={data?.id}>
                    <Link to={path}>
                      <Panel shaded bordered bodyFill>
                        <img
                          loading="lazy"
                          src={config['low-res-image-path'] + data?.poster_path}
                          width="100%"
                          height={250}
                        />
                        <Panel header={data?.title || 'Not Available'}>
                          <div>
                            {formatDate(data?.release_date) || 'Not Available'}
                          </div>
                        </Panel>
                      </Panel>
                    </Link>
                  </SwiperSlide>
                );
              })
            )}
          </Swiper>
        </Tabs.Tab>
        <Tabs.Tab eventKey="tv" title="TV">
          <Swiper {...swiperConf}>
            {!trendingData?.results ? (
              <Placeholder.Graph active />
            ) : (
              trendingData?.results.map((data) => {
                const path = data?.title
                  ? `/movie/${data?.id}-${data?.title
                      ?.toLowerCase()
                      .replace(/\s+/g, '-')}`
                  : data?.name
                    ? `/tv/${data?.id}-${data?.name
                        ?.toLowerCase()
                        .replace(/\s+/g, '-')}`
                    : '/';
                return (
                  <SwiperSlide key={data?.id}>
                    <Link to={path}>
                      <Panel shaded bordered bodyFill>
                        <img
                          loading="lazy"
                          src={config['low-res-image-path'] + data?.poster_path}
                          width="100%"
                          height={250}
                        />
                        <Panel
                          header={data?.title || data?.name || 'Not Available'}
                        >
                          <div>
                            {formatDate(
                              data?.release_date || data?.first_air_date,
                            ) || 'Not Available'}
                          </div>
                        </Panel>
                      </Panel>
                    </Link>
                  </SwiperSlide>
                );
              })
            )}
          </Swiper>
        </Tabs.Tab>
      </Tabs>
    </>
  );
};

export default WatchFree;

import { useEffect, useState } from 'react';
import Heading from 'rsuite/Heading';
import Tabs from 'rsuite/Tabs';
import Panel from 'rsuite/Panel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperConfig } from '../lib/swiperConfig';
import { configs } from '../configs/constants';
import axiosInstance from '../lib/axiosInstance';
import Modal from 'rsuite/Modal';
import { CirclePlay } from 'lucide-react';

interface MediaData {
  results: { id: string; key: string }[];
}
interface ImageData {
  backdrops: { file_path: string }[];
}
const Media = ({
  params,
  reloader,
}: {
  params: { id: string };
  reloader: boolean;
}) => {
  const swiperConf = { ...swiperConfig, slidesPerView: 2.3 };
  const [open, setOpen] = useState<boolean>(false);
  const [videoKey, setVideoKey] = useState<string>('');
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>('videos');
  const [mediaData, setMediaData] = useState<MediaData>({
    results: [],
  });
  const [imageData, setImageData] = useState<ImageData>({
    backdrops: [],
  });

  useEffect(() => {
    const mediaID = params.id?.split('-')[0];
    // setIsLoading(true);
    const handleTrendingData = async () => {
      try {
        const response = await axiosInstance.get(
          `/movie/${mediaID}/${activeKey}`,
        );
        if (activeKey === 'videos') {
          setMediaData(response?.data);
        } else {
          setImageData(response?.data);
        }
      } catch (error) {
        console.log('error', error);
      }
      // finally {
      //   setIsLoading(false);
      // }
    };
    handleTrendingData();
  }, [activeKey, reloader]);

  const handleOpen = (data: { key: string }) => {
    setVideoKey(data.key);
    setOpen(true);
  };

  return (
    <>
      <Heading>Media</Heading>
      <Tabs
        defaultActiveKey="videos"
        appearance="pills"
        onSelect={(value: any) => setActiveKey(value)}
      >
        <Tabs.Tab eventKey="videos" title="Videos">
          <Swiper {...swiperConf}>
            {mediaData.results.map((data) => (
              <SwiperSlide key={data.id}>
                <Panel shaded bordered bodyFill>
                  {/* <iframe
                    width="100%"
                    height={280}
                    src={`https://www.youtube.com/embed/${data.key}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen></iframe> */}
                  <div onClick={() => handleOpen(data)} className="thumbnail">
                    <img
                      src={`https://img.youtube.com/vi/${data.key}/hqdefault.jpg`}
                      alt="thumbnail"
                      width="100%"
                      height={280}
                    />
                    <CirclePlay className="circleplay" size={80} />
                  </div>
                </Panel>
              </SwiperSlide>
            ))}
          </Swiper>
        </Tabs.Tab>
        <Tabs.Tab eventKey="images" title="Images">
          <Swiper {...swiperConf}>
            {imageData.backdrops.map((data) => (
              <SwiperSlide key={data.file_path}>
                <Panel shaded bordered bodyFill>
                  <img
                    src={configs['low-res-image-path'] + data.file_path}
                    alt={data.file_path}
                    width="100%"
                    height={280}
                  />
                </Panel>
              </SwiperSlide>
            ))}
          </Swiper>
        </Tabs.Tab>
      </Tabs>
      <Modal
        size="lg"
        backdrop={true}
        keyboard={false}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Modal.Body style={{ margin: 0 }}>
          <iframe
            width="100%"
            height={500}
            src={`https://www.youtube.com/embed/${videoKey}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Media;

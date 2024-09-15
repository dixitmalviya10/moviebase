import { useEffect, useState } from 'react';
import Heading from 'rsuite/Heading';
import Tabs from 'rsuite/Tabs';
import Panel from 'rsuite/Panel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperConfig } from '../../lib/swiperConfig';
import { configs } from '../../configs/constants';
import axiosInstance from '../../lib/axiosInstance';
import Modal from 'rsuite/Modal';
import { CirclePlay } from 'lucide-react';

interface MediaData {
  results: { id: string; key: string }[];
}
interface ImageData {
  backdrops: { file_path: string }[];
}

const SeriesMedia = ({
  params,
  reloader,
}: {
  params: { id: string };
  reloader: boolean;
}) => {
  const swiperConf = { ...swiperConfig, slidesPerView: 2.3 };
  const [open, setOpen] = useState<boolean>(false);
  const [videoKey, setVideoKey] = useState<string>('');
  const [activeKey, setActiveKey] = useState<string>('videos');
  const [mediaData, setMediaData] = useState<MediaData>({
    results: [],
  });
  const [imageData, setImageData] = useState<ImageData>({
    backdrops: [],
  });

  useEffect(() => {
    const mediaID = params.id?.split('-')[0];
    const handleTrendingData = async () => {
      try {
        const response = await axiosInstance.get(`/tv/${mediaID}/${activeKey}`);
        if (activeKey === 'videos') {
          setMediaData(response?.data);
        } else {
          setImageData(response?.data);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    handleTrendingData();
  }, [activeKey, reloader, params.id]);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSelect={(value: any) => setActiveKey(value)}
      >
        <Tabs.Tab eventKey="videos" title="Videos">
          <Swiper {...swiperConf}>
            {mediaData.results.length > 0 ? (
              mediaData.results.map((data) => (
                <SwiperSlide key={data.id}>
                  <Panel shaded bordered bodyFill>
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
              ))
            ) : (
              <div className="media-not-available">
                <Heading level={2}>Videos Not Available</Heading>
              </div>
            )}
          </Swiper>
        </Tabs.Tab>

        <Tabs.Tab eventKey="images" title="Images">
          <Swiper {...swiperConf}>
            {imageData.backdrops.length > 0 ? (
              imageData.backdrops.map((data) => (
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
              ))
            ) : (
              <div className="media-not-available">
                <Heading level={2}>Images Not Available</Heading>
              </div>
            )}
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

export default SeriesMedia;

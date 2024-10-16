import Heading from 'rsuite/Heading';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import Panel from 'rsuite/Panel';
import Placeholder from 'rsuite/Placeholder';
import config from '../../configs/configs.json';
import { swiperConfig } from '../../lib/swiperConfig';
import { Link } from 'react-router-dom';
import { configs } from '../../configs/constants';

interface CastMember {
  id: number;
  character: string;
  original_name: string;
  profile_path: string;
}

interface SeriesCastProps {
  castData: CastMember[];
  params: { id: string };
}

const Cast: React.FC<SeriesCastProps> = ({ castData }) => {
  const swiperConf = { ...swiperConfig, slidesPerView: 6.5 };
  return (
    <div>
      <Heading>Top Billed Cast</Heading>

      <Swiper {...swiperConf}>
        {!castData ? (
          <Placeholder.Graph active />
        ) : (
          castData?.map((data) => {
            const path = `/person/${data?.id}-${data?.original_name
              ?.toLowerCase()
              .replace(/\s+/g, '-')}`;

            return (
              <SwiperSlide key={data?.id}>
                <Link to={path}>
                  <Panel shaded bordered bodyFill>
                    <img
                      src={
                        data?.profile_path
                          ? config['low-res-image-path'] + data?.profile_path
                          : configs['no-image3']
                      }
                      width="100%"
                      height={200}
                      loading="lazy"
                    />
                    <Panel header={data?.original_name || 'Not Available'}>
                      <div>{data?.character || 'Not Available'}</div>
                    </Panel>
                  </Panel>
                </Link>
              </SwiperSlide>
            );
          })
        )}
      </Swiper>
      {/* <Text
        style={{ textDecoration: 'underline' }}
        size={18}
        weight="semibold"
        as={Link}
        to={`/movie/${params.id}/cast`}
      >
        Full Cast & Crew
      </Text> */}
    </div>
  );
};

export default Cast;

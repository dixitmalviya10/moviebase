import { configs } from '../../configs/constants';
import { Swiper, SwiperSlide } from 'swiper/react';
import Heading from 'rsuite/Heading';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation, Mousewheel, Keyboard } from 'swiper/modules';
import { Star } from 'lucide-react';
import { Avatar, Panel, Tag, Text } from 'rsuite';
import { formatDate } from '../../lib/formatDate';
import React from 'react';
import { Reviews } from '../../types/types';

const SeriesReviews: React.FC<{ reviewDetails: Reviews }> = ({
  reviewDetails,
}) => {
  return (
    <>
      <Heading>Reviews</Heading>
      <Swiper
        keyboard={true}
        cssMode={true}
        slidesPerView={1}
        spaceBetween={30}
        // loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Mousewheel, Keyboard]}
        className="mySwiper"
      >
        {reviewDetails?.results.map((rev) => (
          <SwiperSlide key={rev.id}>
            <Panel shaded bordered style={{ marginInline: '1px' }}>
              <div className="flex gap-md margin-bottom-md review-panel">
                <Avatar
                  src={
                    configs['low-res-image-path'] +
                    rev?.author_details.avatar_path
                  }
                  size="lg"
                  circle
                />

                <div>
                  <Heading level={5}>
                    A review by {rev?.author_details.name || 'Anonymous'}
                  </Heading>
                  <div className="flex gap-sm">
                    <Tag
                      title="Ratings"
                      size="sm"
                      color="blue"
                      className="rating-star-center"
                    >
                      <Star size={15} />
                      {rev?.author_details.rating
                        ? `${rev?.author_details.rating}/10`
                        : 'Not Available'}
                    </Tag>
                    <Text weight="thin">
                      Written by{' '}
                      <strong>{rev?.author_details.name || 'Anonymous'}</strong>{' '}
                      on {formatDate(rev?.created_at)}
                    </Text>
                  </div>
                </div>
              </div>
              <Text
                align="justify"
                className="review-panel overflow-y-scroller padding-sm"
              >
                {rev?.content}
              </Text>
            </Panel>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SeriesReviews;

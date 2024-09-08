import Panel from "rsuite/Panel";
import Heading from "rsuite/Heading";
import Avatar from "rsuite/Avatar";
import Tag from "rsuite/Tag";
import { configs } from "../configs/constants";
import { Text } from "rsuite";
import { formatDate } from "../lib/formatDate";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation, Mousewheel, Keyboard } from "swiper/modules";
import { Star } from "lucide-react";
const Review = ({
  reviews,
}: {
  type: string;
  reviews: {
    results: {
      id: string;
      author_details: { avatar_path: string; name: string; rating: number };
      content: string;
      created_at: string;
    }[];
  };
}) => {
  const authorData = reviews.results.find(
    (rev) =>
      rev.author_details.name &&
      rev.content &&
      rev.author_details.avatar_path &&
      rev.author_details.rating
  );

  console.log("authorData---", authorData);
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
        className="mySwiper">
        {reviews.results.map((rev) => (
          <SwiperSlide key={rev.id}>
            <Panel shaded bordered style={{ marginInline: "1px" }}>
              <div className="flex gap-md margin-bottom-md review-panel">
                <Avatar
                  src={
                    configs["low-res-image-path"] +
                    rev?.author_details.avatar_path
                  }
                  size="lg"
                  circle
                />

                <div>
                  <Heading level={5}>
                    A review by {rev?.author_details.name || "Anonymous"}
                  </Heading>
                  <div className="flex gap-sm">
                    <Tag
                      title="Ratings"
                      size="sm"
                      color="blue"
                      className="rating-star-center">
                      <Star size={15} />
                      {rev?.author_details.rating
                        ? `${rev?.author_details.rating}/10`
                        : "Not Available"}
                    </Tag>
                    <Text weight="thin">
                      Written by{" "}
                      <strong>{rev?.author_details.name || "Anonymous"}</strong>{" "}
                      on {formatDate(rev?.created_at)}
                    </Text>
                  </div>
                </div>
              </div>
              <Text
                align="justify"
                className="review-panel overflow-y-scroller padding-sm">
                {rev?.content}
              </Text>
            </Panel>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Review;

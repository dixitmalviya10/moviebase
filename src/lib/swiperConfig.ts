import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";

export const swiperConfig = {
  scrollbar: {
    hide: true,
  },
  slidesPerView: 4.5,
  spaceBetween: 10,
  cssMode: true,
  freeMode: true,
  modules: [Mousewheel, FreeMode, Scrollbar],
};

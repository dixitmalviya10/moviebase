export const configs = {
  MOVIE: 'MOVIE',
  TV: 'TV',
  PERSON: 'PERSON',
  logo: '',
  'home-banner': '/assets/images/movie-banner.jpg',
  'low-res-image-path': 'https://image.tmdb.org/t/p/w500',
  'med-res-image-path': 'https://image.tmdb.org/t/p/w780',
  'med2-res-image-path': 'https://image.tmdb.org/t/p/w1280',
  'high-res-image-path': 'https://image.tmdb.org/t/p/original',
  'no-image': '/assets/images/no-image.png',
  'no-image2': '/public/assets/images/Image_not_available.png',
  'no-image3': '/public/assets/images/no-image-icon-23500.jpg',
  'no-photo': '/public/assets/images/no-photo.jpg',
};

export const movieSortList = [
  { label: 'Popularity Descending', value: 'popularity.desc' },
  { label: 'Popularity Ascending', value: 'popularity.asc' },
  { label: 'Rating Descending', value: 'vote_average.desc' },
  { label: 'Rating Ascending', value: 'vote_average.asc' },
  { label: 'Revenue Descending', value: 'revenue.desc' },
  { label: 'Revenue Ascending', value: 'revenue.asc' },
  { label: 'Release Date Descending', value: 'primary_release_date.desc' },
  { label: 'Release Date Ascending', value: 'primary_release_date.asc' },
  { label: 'Title (A-Z)', value: 'title.asc' },
  { label: 'Title (Z-A)', value: 'title.desc' },
];

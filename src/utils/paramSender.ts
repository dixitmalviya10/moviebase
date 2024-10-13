import moment from 'moment';

export const paramSender = (path: { pathname: string }, pathType: string) => {
  const pathName = path.pathname;
  const currentDate = moment().toDate();
  switch (pathName) {
    case '/movie/now-playing':
      switch (pathType) {
        case 'gte':
          return moment().subtract(2, 'months').toDate();
        case 'lte':
          return currentDate;
        case 'paramgte':
          return moment().subtract(2, 'months').format('YYYY-MM-DD');
        case 'paramlte':
          return moment().format('YYYY-MM-DD');
        default:
          return null;
      }
    case '/movie/upcoming':
      switch (pathType) {
        case 'gte':
          return currentDate;
        case 'lte':
          return moment().add(1, 'year').toDate();
        case 'paramgte':
          return moment().format('YYYY-MM-DD');
        case 'paramlte':
          return moment().add(1, 'year').format('YYYY-MM-DD');
        default:
          return null;
      }
    case '/tv/airing-today':
      switch (pathType) {
        case 'gte':
          return currentDate;
        case 'lte':
          return currentDate;
        case 'paramgte':
          return moment().format('YYYY-MM-DD');
        case 'paramlte':
          return moment().format('YYYY-MM-DD');
        default:
          return null;
      }
    case '/tv/on-the-air':
      switch (pathType) {
        case 'gte':
          return currentDate;
        case 'lte':
          return moment().add(8, 'days').toDate();
        case 'paramgte':
          return moment().format('YYYY-MM-DD');
        case 'paramlte':
          return moment().add(8, 'days').format('YYYY-MM-DD');
        default:
          return null;
      }
    default:
      return null;
  }
};

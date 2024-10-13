import {
  Button,
  ButtonToolbar,
  DatePicker,
  FlexboxGrid,
  Heading,
  IconButton,
  Pagination,
  Panel,
  PanelGroup,
  RangeSlider,
  SelectPicker,
  Text,
  Tooltip,
  VStack,
  Whisper,
} from 'rsuite';
import axiosInstance from '../../lib/axiosInstance';
import { useEffect, useState } from 'react';
import { formatDate } from '../../lib/formatDate';
import { configs, movieSortList } from '../../configs/constants';
import { MoviesInterface } from '../../types/types';
import { Link, useLocation } from 'react-router-dom';
import { Check, RotateCcw } from 'lucide-react';
import moment from 'moment';
import { paramSender } from '../../utils/paramSender';

interface ProviderList {
  logo_path: string;
  provider_id: number;
  provider_name: string;
}
interface GenreList {
  id: number;
  name: string;
}

interface FilterList {
  providerResults: ProviderList[];
  genreResults: GenreList[];
}

interface Filters {
  certification: string[];
  'release_date.gte': Date | null;
  'release_date.lte': Date | null;
  with_genres: number[];
  // with_original_language: string;
  'vote_average.gte': number;
  'vote_average.lte': number;
}

const Movies = () => {
  const location = useLocation();
  const [activePage, setActivePage] = useState<number>(1);
  const [movies, setMovies] = useState<MoviesInterface>();
  const [sortBy, setSortBy] = useState<string | null>('popularity.desc');
  const [filterList, setFilterList] = useState<FilterList>({
    providerResults: [],
    genreResults: [],
  });
  const [updated, setUpdated] = useState(true);
  const [filterParams, setFilterParams] = useState<{
    sort_by: string | null;
    with_watch_providers: string;
    'release_date.gte': Date | null | string;
    'release_date.lte': Date | null | string;
    with_genres: string;
    certification: string;
    'vote_average.gte': number;
    'vote_average.lte': number;
  }>({
    sort_by: 'popularity.desc',
    with_watch_providers: '',
    'release_date.gte': null,
    'release_date.lte': null,
    with_genres: '',
    certification: '',
    'vote_average.gte': 0,
    'vote_average.lte': 10,
  });
  const [watchProviders, setWatchProviders] = useState<number[]>([]);
  // console.log('location---', new Date('2024-10-09'));

  const [filters, setFilters] = useState<Filters>({
    certification: [],
    'release_date.gte': null,
    'release_date.lte': null,
    with_genres: [], // Genres can be filtered later
    'vote_average.gte': 0,
    'vote_average.lte': 10, // Max rating
  });

  useEffect(() => {
    const handleWatchProvidersData = async () => {
      try {
        const genreResponse = await axiosInstance.get('genre/movie/list');
        const providerResponse = await axiosInstance.get(
          'watch/providers/movie',
          {
            params: {
              watch_region: 'IN',
            },
          },
        );
        setFilterList({
          genreResults: genreResponse?.data?.genres,
          providerResults: providerResponse?.data?.results,
        });
      } catch (error) {
        console.log('error', error);
      }
    };
    handleWatchProvidersData();
  }, []);

  useEffect(() => {
    const gte = paramSender(location, 'gte') as Date | null;
    const lte = paramSender(location, 'lte') as Date | null;
    const paramgte = paramSender(location, 'paramgte');
    const paramlte = paramSender(location, 'paramlte');
    setFilters((prev) => ({
      ...prev,
      'release_date.gte': gte,
      'release_date.lte': lte,
      'vote_average.gte': location.pathname === '/movie/top-rated' ? 8 : 0,
    }));
    setFilterParams((prev) => ({
      ...prev,
      'release_date.gte': paramgte,
      'release_date.lte': paramlte,
      'vote_average.gte': location.pathname === '/movie/top-rated' ? 8 : 0,
    }));
  }, [location]);

  useEffect(() => {
    const handleMoviesData = async () => {
      try {
        const common = {
          include_adult: false,
          include_video: false,
          language: 'en-US',
          page: activePage,
        };
        const additionalParams =
          location.pathname === '/movie/now-playing' ||
          location.pathname === '/movie/upcoming'
            ? { with_release_type: 2 | 3 }
            : location.pathname === '/movie/top-rated'
              ? { without_genres: '99,10755', 'vote_count.gte': 200 }
              : null;
        const response = await axiosInstance.get('discover/movie', {
          params: { ...filterParams, ...common, ...additionalParams },
        });
        setMovies(response?.data);
      } catch (error) {
        console.log('error', error);
      }
    };
    handleMoviesData();
  }, [filterParams, activePage, location.pathname]);

  const handleSubmitFilters = () => {
    setFilterParams({
      sort_by: sortBy,
      with_watch_providers: watchProviders.join('|'),
      'release_date.gte': moment(filters['release_date.gte']).format(
        'YYYY-MM-DD',
      ),
      'release_date.lte': moment(filters['release_date.lte']).format(
        'YYYY-MM-DD',
      ),
      with_genres: filters.with_genres.join(','),
      certification: filters.certification.join('|'),
      'vote_average.gte': filters['vote_average.gte'],
      'vote_average.lte': filters['vote_average.lte'],
    });
    setUpdated(true);
  };

  const handleResetFilters = () => {
    setSortBy('popularity.desc');
    setWatchProviders([]);
    setFilters({
      certification: [],
      'release_date.gte': moment().subtract(2, 'months').toDate(),
      'release_date.lte': moment().toDate(),
      with_genres: [],
      // with_original_language: '',
      'vote_average.gte': 0,
      'vote_average.lte': 10,
    });
    setFilterParams({
      sort_by: '',
      with_watch_providers: '',
      'release_date.gte': moment().subtract(2, 'months').format('YYYY-MM-DD'),
      'release_date.lte': moment().format('YYYY-MM-DD'),
      with_genres: '',
      certification: '',
      'vote_average.gte': 0,
      'vote_average.lte': 10,
    });
    setUpdated(true);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <Heading className="margin-bottom-sm">Popular Movies</Heading>
      <FlexboxGrid justify="space-between">
        <FlexboxGrid.Item colspan={5}>
          <VStack spacing={20} style={{ alignItems: 'normal' }}>
            <PanelGroup accordion bordered>
              <Panel header="Sort" defaultExpanded>
                <Text muted className="margin-bottom-sm">
                  Sort Results By
                </Text>
                <SelectPicker
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    setUpdated(false);
                  }}
                  data={movieSortList}
                  searchable={false}
                  cleanable={false}
                  style={{ width: '100%' }}
                />
              </Panel>
            </PanelGroup>

            <PanelGroup accordion bordered>
              <Panel
                header={`Where to Watch ${filterList.providerResults.length}`}
              >
                <div
                  style={{
                    paddingTop: '1rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem ',
                    justifyContent: 'space-between',
                  }}
                >
                  {filterList.providerResults.map((data) => (
                    <Whisper
                      key={data.provider_id}
                      placement="top"
                      controlId={data.provider_name}
                      trigger="hover"
                      speaker={<Tooltip>{data.provider_name}</Tooltip>}
                    >
                      <div className="position-relative">
                        <img
                          width={50}
                          src={configs['low-res-image-path'] + data?.logo_path}
                          alt={data.provider_name}
                          className="rounded-border-sm watch-providers"
                          onClick={() => {
                            setWatchProviders((prev) =>
                              prev.includes(data.provider_id)
                                ? prev
                                : [...prev, data.provider_id],
                            );
                            setUpdated(false);
                          }}
                        />
                        {watchProviders.includes(data.provider_id) && (
                          <Check
                            className="watch-provider-check"
                            onClick={() => {
                              setWatchProviders(
                                watchProviders.filter(
                                  (id) => id !== data.provider_id,
                                ),
                              );
                              setUpdated(false);
                            }}
                          />
                        )}
                      </div>
                    </Whisper>
                  ))}
                </div>
              </Panel>
            </PanelGroup>
            <PanelGroup accordion bordered>
              <Panel header="Filters" defaultExpanded>
                <VStack spacing={20} style={{ alignItems: 'normal' }}>
                  <div>
                    <Text muted className="margin-bottom-sm">
                      Release Dates
                    </Text>

                    <div className="flex justify-between margin-bottom-sm">
                      <label htmlFor="from">From</label>
                      <DatePicker
                        style={{ maxWidth: 150 }}
                        format="MMM dd, yyyy"
                        value={filters['release_date.gte']}
                        onChange={(value) => {
                          console.log('value==', value);
                          setFilters((prev) => ({
                            ...prev,
                            'release_date.gte': value,
                          }));
                          setUpdated(false);
                        }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="to">To</label>
                      <DatePicker
                        style={{ maxWidth: 150 }}
                        format="MMM dd, yyyy"
                        value={filters['release_date.lte']}
                        onChange={(value) => {
                          setFilters((prev) => ({
                            ...prev,
                            'release_date.lte': value,
                          }));
                          setUpdated(false);
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Text muted className="margin-bottom-sm">
                      Genres
                    </Text>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        columnGap: '0.2rem',
                        rowGap: '0.7rem',
                      }}
                    >
                      {filterList.genreResults.map((data) => {
                        const isActive = filters.with_genres.includes(data.id);

                        return (
                          <button
                            className={`genre-btn ${isActive ? 'genre-btn-active' : ''}`}
                            key={data?.id}
                            onClick={() => {
                              setFilters((prev) => {
                                const updatedGenres = isActive
                                  ? prev.with_genres.filter(
                                      (id) => id !== data.id,
                                    )
                                  : [...prev.with_genres, data.id];
                                setUpdated(false);
                                return { ...prev, with_genres: updatedGenres };
                              });
                            }}
                          >
                            {data.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Text muted className="margin-bottom-sm">
                      Certification
                    </Text>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        columnGap: '0.2rem',
                        rowGap: '0.7rem',
                      }}
                    >
                      {['U', 'UA', 'A'].map((data) => {
                        const isActive = filters.certification.includes(data);
                        return (
                          <button
                            className={`genre-btn ${isActive ? 'genre-btn-active' : ''}`}
                            key={data}
                            onClick={() => {
                              setFilters((prev) => {
                                const updatedGenres = isActive
                                  ? prev.certification.filter(
                                      (id) => id !== data,
                                    )
                                  : [...prev.certification, data];
                                return {
                                  ...prev,
                                  certification: updatedGenres,
                                };
                              });
                              setUpdated(false);
                            }}
                          >
                            {data}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Text muted className="margin-bottom-sm">
                      User Score
                    </Text>
                    <RangeSlider
                      min={0}
                      max={10}
                      progress
                      style={{ marginTop: 16 }}
                      value={[
                        filters['vote_average.gte'],
                        filters['vote_average.lte'],
                      ]}
                      onChange={(value) => {
                        const [start, end] = value;
                        setFilters((prev) => ({
                          ...prev,
                          'vote_average.gte': start,
                          'vote_average.lte': end,
                        }));
                        setUpdated(false);
                      }}
                    />
                  </div>
                  <ButtonToolbar>
                    <Button
                      disabled={updated}
                      onClick={handleSubmitFilters}
                      appearance="primary"
                    >
                      Search
                    </Button>
                    <IconButton
                      size="xs"
                      icon={<RotateCcw />}
                      appearance="primary"
                      onClick={handleResetFilters}
                    />
                  </ButtonToolbar>
                </VStack>
              </Panel>
            </PanelGroup>
          </VStack>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={18}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem ',
            }}
          >
            {movies?.results.map((data) => {
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
                <Link to={path} key={data?.id}>
                  <Panel shaded bordered bodyFill style={{ width: 180 }}>
                    <img
                      loading="lazy"
                      src={
                        data?.poster_path
                          ? configs['low-res-image-path'] + data?.poster_path
                          : configs['no-image']
                      }
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
              );
            })}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '2rem',
            }}
          >
            <Pagination
              size="md"
              // first
              // last
              prev
              next
              activePage={activePage}
              onChangePage={setActivePage}
              ellipsis
              total={movies?.total_pages || 1}
              maxButtons={8}
            />
          </div>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
};

export default Movies;

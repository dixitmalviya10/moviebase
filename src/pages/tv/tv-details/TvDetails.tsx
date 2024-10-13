import { useEffect, useState } from 'react';
// import axiosInstance from "../../lib/axiosInstance";
import Heading from 'rsuite/Heading';
import { useParams } from 'react-router-dom';
import Text from 'rsuite/Text';
import Stack from 'rsuite/Stack';
import HStack from 'rsuite/HStack';
import VStack from 'rsuite/VStack';
import config from '../../../configs/configs.json';
// import { formatDate } from "../../lib/formatDate";
import Progress from 'rsuite/Progress';
import Panel from 'rsuite/Panel';
import { Facebook, Instagram, LucideLink, Play, Twitter } from 'lucide-react';
import {
  Button,
  Col,
  Divider,
  Grid,
  Message,
  Modal,
  Row,
  Tooltip,
  Whisper,
} from 'rsuite';
import FlexboxGrid from 'rsuite/FlexboxGrid';
import axiosInstance from '../../../lib/axiosInstance';
import { formatDate } from '../../../lib/formatDate';
import SeriesCast from '../../../components/tv-details/SeriesCast';
import CurrentSeason from '../../../components/tv-details/CurrentSeason';
import SeriesReviews from '../../../components/tv-details/SeriesReviews';
import SeriesMedia from '../../../components/tv-details/SeriesMedia';
import Recommendations from '../../../components/movie-details/Recommendations';
import { TrailerInfoInterface, TVDataInterface } from '../../../types/types';

const TvDetails = () => {
  const [reloader, setReloader] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams() as { id: string };
  const [trailerUrl, setTrailerUrl] = useState<TrailerInfoInterface>({
    title: '',
    url: '',
  });
  const [tvData, setTvData] = useState<TVDataInterface>({
    id: 0,
    name: '',
    backdrop_path: '',
    budget: 0,
    poster_path: '',
    release_date: '',
    content_ratings: {
      iso_3166_1: '',
      rating: '',
    },
    genres: [{ id: 0, name: '' }],
    runtime: 0,
    vote_average: 0,
    tagline: '',
    overview: '',
    credits: { cast: [], crew: [] },
    created_by: [{ id: 0, name: '' }],
    networks: [{ id: 0, logo_path: '', name: '' }],
    'watch/providers': {
      results: {
        IN: {
          flatrate: [{ provider_id: 0, name: '', logo_path: '' }],
          link: '',
        },
      },
    },
    last_episode_to_air: {
      air_date: '',
      episode_number: 0,
      episode_type: '',
      id: 0,
      name: '',
      overview: '',
      runtime: 0,
      season_number: 0,
      still_path: '',
      vote_average: '',
      vote_count: 0,
    },
    seasons: [
      {
        air_date: '',
        episode_count: 0,
        id: 0,
        name: '',
        overview: '',
        poster_path: '',
        season_number: 0,
        vote_average: 0,
      },
    ],
    number_of_seasons: 0,
    reviews: {
      results: [
        {
          id: '',
          author_details: { avatar_path: '', name: '', rating: 0 },
          content: '',
          created_at: '',
        },
      ],
    },
    external_ids: {
      facebook_id: '',
      imdb_id: '',
      instagram_id: '',
      twitter_id: '',
    },
    homepage: '',
    status: '',
    original_language: '',
    revenue: 0,
    type: '',
    keywords: { results: [{ name: '', id: null }] },
  });

  const userScore = Math.round((tvData.vote_average * 100) / 10);
  useEffect(() => {
    const tvID = params.id?.split('-')[0];
    const handleTrendingData = async () => {
      try {
        const response = await axiosInstance.get(`/tv/${tvID}`, {
          params: {
            append_to_response:
              'content_ratings,credits,watch/providers,reviews,videos,external_ids,keywords',
          },
        });
        const filteredData = {
          ...response?.data,
          content_ratings: response?.data?.content_ratings?.results.find(
            (data: { iso_3166_1: string }) =>
              data?.iso_3166_1 === 'IN' || data?.iso_3166_1 === 'US',
          ),
        };
        setTvData(filteredData);
        const trailers = response.data?.videos?.results.filter(
          (video: { type: string; site: string }) =>
            video.type === 'Trailer' && video.site === 'YouTube',
        );
        if (trailers.length > 0) {
          setTrailerUrl((prev) => ({
            ...prev,
            title: response.data?.name,
            url: `https://www.youtube.com/embed/${trailers[0].key}`,
          }));
        }
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } catch (error) {
        console.log('error', error);
      }
    };
    handleTrendingData();
  }, [params.id, reloader]);

  const handleReloader = (value: boolean) => {
    setReloader(value);
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${config['med2-res-image-path']}${tvData.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backgroundBlendMode: 'overlay',
          padding: '3rem 2rem',
          marginBottom: '1rem',
        }}
      >
        <Stack spacing={50} alignItems="flex-start">
          {/* <img
            src={config["med-res-image-path"] + tvData.poster_path}
            width={300}
          /> */}
          <Panel
            shaded
            bodyFill
            bordered
            style={{ display: 'inline-block', width: 250 }}
          >
            <img
              loading="lazy"
              src={config['med-res-image-path'] + tvData.poster_path}
              width={'100%'}
            />
            {tvData?.['watch/providers']?.results?.IN?.flatrate?.map((data) => (
              <div className="flex-center" key={data?.provider_id}>
                <img
                  loading="lazy"
                  src={config['med-res-image-path'] + data.logo_path}
                  width={40}
                  style={{ margin: 5, borderRadius: 3 }}
                  alt={data?.name}
                />
                <div>
                  <Text weight="bold" style={{ color: 'lightgray' }}>
                    Now Streaming
                  </Text>
                  <Text
                    // as={Link}
                    // to={tvData?.['watch/providers']?.results?.IN?.link}
                    // target="_blank"
                    weight="bold"
                    style={{ color: 'white' }}
                  >
                    Watch Now
                  </Text>
                </div>
              </div>
            ))}
          </Panel>
          <VStack spacing={30} style={{ color: 'white' }}>
            <div>
              <Heading level={2}>
                {tvData?.name}
                {tvData?.release_date
                  ? ` (${tvData?.release_date.split('-')[0]})`
                  : ''}
              </Heading>

              <HStack spacing={10}>
                <Text
                  style={{
                    color: 'white',
                    border: '1px solid white',
                    display: 'inline-block',
                    paddingInline: 3,
                  }}
                  weight="thin"
                  size="md"
                >
                  {tvData?.content_ratings?.rating}{' '}
                </Text>
                <Text style={{ display: 'inline-block', color: 'white' }}>
                  {formatDate(tvData?.release_date)}{' '}
                  {tvData?.content_ratings &&
                    `(${tvData?.content_ratings?.iso_3166_1})`}
                </Text>
                <Text style={{ display: 'inline-block', color: 'white' }}>
                  •
                </Text>
                <Text style={{ display: 'inline-block', color: 'white' }}>
                  {tvData?.genres.map((genre) => genre?.name).join(', ')}
                </Text>
              </HStack>
            </div>

            <HStack spacing={20}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 60,
                    display: 'inline-block',
                  }}
                >
                  <Progress.Circle
                    trailColor="#ffff0075"
                    percent={userScore}
                    strokeColor="yellow"
                    trailWidth={15}
                    strokeWidth={15}
                  />
                </div>
                <Heading level={5}>
                  User <br /> Score
                </Heading>
              </div>
              <Button
                onClick={() => setOpen(true)}
                size="xs"
                active
                className="play-trailer-btn"
              >
                <Play size={20} style={{ marginRight: 3 }} />
                Play Trailer
              </Button>
            </HStack>

            <VStack spacing={15}>
              <Text
                size={15}
                as="i"
                style={{
                  color: 'wheat',
                }}
                weight="semibold"
              >
                {tvData.tagline}
              </Text>
              <div>
                <Heading level={4}>Overview</Heading>
                <Text
                  style={{
                    color: 'white',
                  }}
                >
                  {tvData.overview}
                </Text>
              </div>
              <FlexboxGrid
                style={{
                  width: '100%',
                  rowGap: '1.5rem',
                }}
              >
                {tvData?.created_by?.map(
                  (detail: { id: number; name: string }) => (
                    <FlexboxGrid.Item key={detail.id} colspan={8}>
                      <Heading level={6}>{detail.name}</Heading>
                      Creator
                    </FlexboxGrid.Item>
                  ),
                )}
              </FlexboxGrid>
            </VStack>
          </VStack>
        </Stack>
      </div>
      <Grid fluid>
        <Row gutter={40}>
          <Col xs={18}>
            <SeriesCast castData={tvData.credits.cast} params={params} />

            <Divider />
            <CurrentSeason
              numberOfEpisodes={tvData?.number_of_seasons}
              currentSeasonData={tvData?.seasons}
            />

            {tvData?.reviews?.results.length > 0 && (
              <>
                <Divider />
                <SeriesReviews reviewDetails={tvData?.reviews} />
              </>
            )}

            <Divider />
            <SeriesMedia params={params} reloader={reloader} />

            <Recommendations
              params={params}
              reloader={reloader}
              handleReloader={handleReloader}
            />
          </Col>
          <Col xs={6}>
            <VStack spacing={25}>
              <Heading>&nbsp;</Heading>
              {(tvData.external_ids?.facebook_id ||
                tvData.external_ids?.twitter_id ||
                tvData.external_ids?.instagram_id ||
                tvData.homepage) && (
                <div className="flex">
                  {(tvData.external_ids?.facebook_id ||
                    tvData.external_ids?.twitter_id ||
                    tvData.external_ids?.instagram_id) && (
                    <>
                      <div className="flex gap-md">
                        {tvData.external_ids?.facebook_id && (
                          <Whisper
                            placement="top"
                            controlId="control-id-facebook"
                            trigger="hover"
                            speaker={
                              <Tooltip>
                                Visit <i>Facebook</i>
                              </Tooltip>
                            }
                          >
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`https://www.facebook.com/${tvData.external_ids.facebook_id}`}
                            >
                              <Facebook size={30} />
                            </a>
                          </Whisper>
                        )}
                        {tvData.external_ids?.twitter_id && (
                          <Whisper
                            placement="top"
                            controlId="control-id-twitter"
                            trigger="hover"
                            speaker={
                              <Tooltip>
                                Visit <i>Twitter</i>
                              </Tooltip>
                            }
                          >
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`https://www.twitter.com/${tvData.external_ids?.twitter_id}`}
                            >
                              <Twitter size={30} />
                            </a>
                          </Whisper>
                        )}
                        {tvData.external_ids?.instagram_id && (
                          <Whisper
                            placement="top"
                            controlId="control-id-instagram"
                            trigger="hover"
                            speaker={
                              <Tooltip>
                                Visit <i>Instagram</i>
                              </Tooltip>
                            }
                          >
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`https://www.instagram.com/${tvData.external_ids.instagram_id}`}
                            >
                              <Instagram size={30} />
                            </a>
                          </Whisper>
                        )}
                      </div>
                      <Divider vertical />
                    </>
                  )}
                  {tvData?.homepage && (
                    <Whisper
                      placement="top"
                      controlId="control-id-homepage"
                      trigger="hover"
                      speaker={
                        <Tooltip>
                          Visit <i>Homepage</i>
                        </Tooltip>
                      }
                    >
                      <a
                        href={tvData?.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LucideLink size={30} />
                      </a>
                    </Whisper>
                  )}
                </div>
              )}

              <div>
                <Text size={17} weight="semibold">
                  Status
                </Text>
                <Text size={16}>{tvData?.status || 'Not Available'}</Text>
              </div>

              <div>
                <Text size={17} weight="semibold">
                  Network
                </Text>
                <img
                  loading="lazy"
                  title={tvData?.networks[0]?.name}
                  src={
                    config['low-res-image-path'] +
                    tvData?.networks[0]?.logo_path
                  }
                  alt={tvData?.networks[0]?.name}
                  width={100}
                />
              </div>

              <div>
                <Text size={17} weight="semibold">
                  Type
                </Text>
                <Text size={16}>{tvData?.type || 'Not Available'}</Text>
              </div>
              <div>
                <Text size={17} weight="semibold">
                  Original Language
                </Text>
                <Text size={16}>
                  {tvData?.original_language || 'Not Available'}
                </Text>
              </div>

              <div>
                <Text size={17} weight="semibold">
                  Keywords
                </Text>
                <div>
                  {tvData?.keywords?.results.map((keyword) => (
                    // <Link key={keyword?.id} to="/">
                    <Button
                      key={keyword?.id}
                      className="margin-keywords-xs"
                      size="sm"
                    >
                      {keyword?.name}
                    </Button>
                    // </Link>
                  ))}
                </div>
              </div>
              <div>
                <Message>
                  <strong>
                    Vote Average:{' '}
                    {userScore ? userScore + '%' : 'Not Available'}
                  </strong>
                </Message>
              </div>
            </VStack>
          </Col>
        </Row>
      </Grid>
      <Modal
        size="lg"
        backdrop={true}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Modal.Header>
          <Modal.Title>{trailerUrl.title || 'Not Available'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {trailerUrl.url ? (
            <iframe
              width="100%"
              height={500}
              src={trailerUrl.url}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <Heading>Not Available</Heading>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TvDetails;

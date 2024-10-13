import { useEffect, useState } from 'react';
import axiosInstance from '../../../lib/axiosInstance';
import Heading from 'rsuite/Heading';
import { useParams } from 'react-router-dom';
import Text from 'rsuite/Text';
import Modal from 'rsuite/Modal';
import Stack from 'rsuite/Stack';
import HStack from 'rsuite/HStack';
import VStack from 'rsuite/VStack';
import config from '../../../configs/configs.json';
import Tooltip from 'rsuite/Tooltip';
import Whisper from 'rsuite/Whisper';
import Progress from 'rsuite/Progress';
// import Placeholder from 'rsuite/Placeholder';
import Panel from 'rsuite/Panel';
import {
  Facebook,
  Instagram,
  Play,
  Twitter,
  Link as LucideLink,
} from 'lucide-react';
import { Button, Message } from 'rsuite';
import Divider from 'rsuite/Divider';
import FlexboxGrid from 'rsuite/FlexboxGrid';
import Cast from '../../../components/movie-details/Cast';
import { formatDate } from '../../../lib/formatDate';
import Grid from 'rsuite/Grid';
import Row from 'rsuite/Row';
import Col from 'rsuite/Col';
import { formatRuntime } from '../../../lib/formatRuntime';
import Review from '../../../components/movie-details/Review';
import Media from '../../../components/movie-details/Media';
import Recommendations from '../../../components/movie-details/Recommendations';
import intlNumberFormatter from '../../../utils/intlNumberFormatter';
import { MovieDataInterface } from '../../../types/types';

// import ImageBackgroundDetector from "../../components/ImageBackgroundDetector";

// type Params = { id: string };

interface CrewMember {
  id: number;
  job: string | string[];
  name: string;
}

interface TrailerObjInterface {
  title: string;
  url: string;
}

type FilteredCrewMember = Omit<CrewMember, 'job'> & {
  job: string[];
  name: string;
};

const MovieDetails = () => {
  const initialMovieData: MovieDataInterface = {
    id: 0,
    title: '',
    backdrop_path: '',
    budget: 0,
    poster_path: '',
    release_date: '',
    release_dates: {
      iso_3166_1: 'IN',
      release_dates: [{ certification: '', iso_639_1: '', release_date: '' }],
    },
    genres: [],
    runtime: 0,
    vote_average: 0,
    tagline: '',
    overview: '',
    credits: { cast: [], crew: [] },
    'watch/providers': {
      results: {
        IN: {
          flatrate: [{ provider_id: 0, name: '', logo_path: '' }],
          link: '',
        },
      },
    },
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
    keywords: { keywords: [{ name: '', id: null }] },
  };
  const [movieData, setMovieData] =
    useState<MovieDataInterface>(initialMovieData);
  const [reloader, setReloader] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams() as { id: string };
  const [trailerUrl, setTrailerUrl] = useState<TrailerObjInterface>({
    title: '',
    url: '',
  });

  const userScore = Math.round((movieData.vote_average * 100) / 10);

  useEffect(() => {
    const movieID = params.id?.split('-')[0];
    const handleTrendingData = async () => {
      try {
        const response = await axiosInstance.get(`/movie/${movieID}`, {
          params: {
            append_to_response:
              'release_dates,credits,watch/providers,reviews,external_ids,keywords,videos',
          },
        });
        const filteredData = {
          ...response?.data,
          release_dates: response?.data?.release_dates?.results.find(
            (data: { iso_3166_1: string }) =>
              data?.iso_3166_1 === 'IN' || data?.iso_3166_1 === 'US',
          ),
        };
        setMovieData(filteredData);
        const trailers = response.data?.videos?.results.filter(
          (video: { type: string; site: string }) =>
            video.type === 'Trailer' && video.site === 'YouTube',
        );
        if (trailers.length > 0) {
          setTrailerUrl((prev) => ({
            ...prev,
            title: response.data?.title,
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
  }, [reloader, params.id]);

  const crewData: FilteredCrewMember[] = movieData?.credits?.crew
    ?.filter(
      (detail: CrewMember) =>
        detail?.job === 'Writer' ||
        detail?.job === 'Director' ||
        detail?.job === 'Story' ||
        detail?.job === 'Screenplay' ||
        detail?.job === 'Characters' ||
        detail?.job === 'Creator',
    )
    .reduce((acc: FilteredCrewMember[], current: CrewMember) => {
      const existing = acc.find((item) => item.id === current.id);
      if (existing) {
        existing.job = Array.isArray(existing.job)
          ? existing.job
          : [existing.job];
        if (!existing.job.includes(current.job as string)) {
          existing.job.push(current.job as string);
        }
      } else {
        acc.push({ ...current, job: [current.job as string] });
      }

      return acc;
    }, []);

  const handleReloader = (value: boolean) => {
    setReloader(value);
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${config['med2-res-image-path']}${movieData.backdrop_path})`,
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
          <Panel
            shaded
            bodyFill
            bordered
            style={{ display: 'inline-block', width: 250 }}
          >
            <img
              loading="lazy"
              src={config['med-res-image-path'] + movieData.poster_path}
              width={'100%'}
            />
            {/* {console.log(
              "movieData?.['watch/providers']?.results?.IN?.flatrate==",
              movieData?.['watch/providers']?.results?.IN?.flatrate,
            )} */}
            {movieData?.['watch/providers']?.results?.IN?.flatrate?.map(
              (data) => (
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
                    <Text weight="bold" style={{ color: 'white' }}>
                      {/* <a
                        href={
                          movieData?.['watch/providers']?.results?.IN?.link ||
                          '/'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      > */}
                      Watch Now
                      {/* </a> */}
                    </Text>
                  </div>
                </div>
              ),
            )}
          </Panel>
          <VStack spacing={30} style={{ color: 'white' }}>
            <div>
              <Heading level={2}>
                {movieData?.title}
                {movieData?.release_date
                  ? ` (${movieData?.release_date.split('-')[0]})`
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
                  {movieData?.release_dates?.release_dates[0]?.certification}{' '}
                </Text>
                <Text style={{ display: 'inline-block', color: 'white' }}>
                  {formatDate(
                    movieData?.release_dates?.release_dates[0]?.release_date,
                  )}{' '}
                  {movieData?.release_dates &&
                    `(${movieData?.release_dates?.iso_3166_1})`}
                </Text>
                <Text style={{ display: 'inline-block', color: 'white' }}>
                  •
                </Text>
                {/* <Text style={{ display: 'inline-block', color: 'white' }}>
                  {movieData?.genres.map((genre) => genre.name).join(', ')}
                </Text> */}
                <Text style={{ display: 'inline-block', color: 'white' }}>
                  {movieData?.genres.map((genre, index) => (
                    <span key={genre.id || index}>
                      {genre.name}
                      {index < movieData.genres.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </Text>

                <Text style={{ display: 'inline-block', color: 'white' }}>
                  •
                </Text>
                <Text style={{ display: 'inline-block', color: 'white' }}>
                  {formatRuntime(movieData.runtime)}
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
                active
                size="xs"
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
                {movieData.tagline}
              </Text>
              <div>
                <Heading level={4}>Overview</Heading>
                <Text
                  style={{
                    color: 'white',
                  }}
                >
                  {movieData.overview}
                </Text>
              </div>
              <FlexboxGrid
                style={{
                  width: '100%',
                  rowGap: '1.5rem',
                }}
              >
                {crewData?.map((detail, index) => (
                  <FlexboxGrid.Item key={index} colspan={8}>
                    <Heading level={6}>{detail.name}</Heading>
                    {detail.job.join(', ')}
                  </FlexboxGrid.Item>
                ))}
              </FlexboxGrid>
            </VStack>
          </VStack>
        </Stack>
      </div>

      <Grid fluid>
        <Row gutter={40}>
          <Col xs={18}>
            <Cast castData={movieData.credits.cast} params={params} />
            {movieData?.reviews.results.length > 0 && (
              <>
                <Divider />
                <Review reviews={movieData.reviews} />
              </>
            )}

            <Divider />
            <Media params={params} reloader={reloader} />

            <Recommendations
              resultType="movie"
              params={params}
              reloader={reloader}
              handleReloader={handleReloader}
            />
          </Col>

          <Col xs={6}>
            <VStack spacing={25}>
              <Heading>&nbsp;</Heading>
              {(movieData.external_ids.facebook_id ||
                movieData.external_ids.twitter_id ||
                movieData.external_ids.instagram_id ||
                movieData.homepage) && (
                <div className="flex">
                  {(movieData.external_ids.facebook_id ||
                    movieData.external_ids.twitter_id ||
                    movieData.external_ids.instagram_id) && (
                    <>
                      <div className="flex gap-md">
                        {movieData.external_ids.facebook_id && (
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
                              href={`https://www.facebook.com/${movieData.external_ids.facebook_id}`}
                            >
                              <Facebook size={30} />
                            </a>
                          </Whisper>
                        )}
                        {movieData.external_ids.twitter_id && (
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
                              href={`https://www.twitter.com/${movieData.external_ids.twitter_id}`}
                            >
                              <Twitter size={30} />
                            </a>
                          </Whisper>
                        )}
                        {movieData.external_ids.instagram_id && (
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
                              href={`https://www.instagram.com/${movieData.external_ids.instagram_id}`}
                            >
                              <Instagram size={30} />
                            </a>
                          </Whisper>
                        )}
                      </div>
                      <Divider vertical />
                    </>
                  )}
                  {movieData.homepage && (
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
                        href={movieData.homepage}
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
                <Text size={16}>{movieData?.status || 'Not Available'}</Text>
              </div>
              <div>
                <Text size={17} weight="semibold">
                  Original Language
                </Text>
                <Text size={16}>
                  {movieData?.original_language || 'Not Available'}
                </Text>
              </div>
              <div>
                <Text size={17} weight="semibold">
                  Budget
                </Text>
                <Text size={16}>
                  {movieData?.budget
                    ? '$' + intlNumberFormatter(movieData?.budget)
                    : 'Not Available'}
                </Text>
              </div>
              <div>
                <Text size={17} weight="semibold">
                  Revenue
                </Text>
                <Text size={16}>
                  {movieData?.budget
                    ? '$' + intlNumberFormatter(movieData?.revenue)
                    : 'Not Available'}
                </Text>
              </div>
              <div>
                <Text size={17} weight="semibold">
                  Keywords
                </Text>
                <div>
                  {movieData?.keywords?.keywords.map((keyword) => (
                    // <Link key={keyword.id} to="/">
                    <Button
                      key={keyword?.id}
                      className="margin-keywords-xs"
                      size="sm"
                    >
                      {keyword.name}
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

export default MovieDetails;

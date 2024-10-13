import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  FlexboxGrid,
  Heading,
  Panel,
  Text,
  Tooltip,
  VStack,
  Whisper,
} from 'rsuite';
import axiosInstance from '../../../lib/axiosInstance';
import { configs } from '../../../configs/constants';
import {
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from 'lucide-react';
import { formatDate } from '../../../lib/formatDate';
import moment from 'moment';
import { swiperConfig } from '../../../lib/swiperConfig';
import { Swiper, SwiperSlide } from 'swiper/react';

interface ExternalIds {
  facebook_id: string;
  instagram_id: string;
  twitter_id: string;
  youtube_id: string;
}

interface CombinedCredit {
  id: number;
  department?: string;
  title?: string;
  name?: string;
  character?: string;
  job?: string;
  release_date?: string;
  first_air_date: string;
  media_type: 'movie' | 'tv';
}

interface PersonDetails {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string | null;
  gender: number | null;
  homepage: string;
  id: number | null;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number | null;
  profile_path: string;
  external_ids: ExternalIds;
  movies: {
    id: number | null;
    title: string;
    image: string;
    name: string;
    media_type: string;
  }[];
  knownCredits: number | null;
  departmentCredits: Record<string, CombinedCredit[]>;
}

const PersonDetails = () => {
  const params = useParams<{ id: string }>();
  const [readMore, setReadMore] = useState<boolean>(false);
  const [personDetails, setPersonDetails] = useState<PersonDetails>({
    adult: false,
    also_known_as: [],
    biography: '',
    birthday: '',
    deathday: null,
    gender: null,
    homepage: '',
    id: null,
    imdb_id: '',
    known_for_department: '',
    name: '',
    place_of_birth: '',
    popularity: null,
    profile_path: '',
    external_ids: {
      facebook_id: '',
      instagram_id: '',
      twitter_id: '',
      youtube_id: '',
    },
    movies: [
      {
        id: null,
        title: '',
        image: '',
        name: '',
        media_type: '',
      },
    ],
    knownCredits: null,
    departmentCredits: {},
  });

  useEffect(() => {
    const personId = params.id?.split('-')[0];
    const handlePersonDetails = async () => {
      const response = await axiosInstance.get(`/person/${personId}`, {
        params: { append_to_response: 'external_ids,combined_credits' },
      });

      // Extract and process the movie/TV credits
      const castMovies = response.data.combined_credits?.cast || [];
      const crewMovies = response.data.combined_credits?.crew || [];

      // Combine cast and crew movies
      const allCredits = [...castMovies, ...crewMovies];

      // Remove duplicate entries
      const uniqueCredits = Array.from(
        new Map(allCredits.map((credit) => [credit.id, credit])).values(),
      );

      // Process each department
      const departmentCredits = uniqueCredits.reduce((acc, credit) => {
        const dept = credit.department || 'Others';
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(credit);
        return acc;
      }, {});

      // Sort by release date within each department
      Object.keys(departmentCredits).forEach((department) => {
        departmentCredits[department].sort(
          (
            a: { release_date: string; first_air_date: string },
            b: { release_date: string; first_air_date: string },
          ) => {
            const dateA = new Date(
              a.release_date || a.first_air_date,
            ).getTime();
            const dateB = new Date(
              b.release_date || b.first_air_date,
            ).getTime();
            return dateB - dateA;
          },
        );
      });

      // Extract movies with valid images
      const movies = uniqueCredits
        .filter((credit) => credit.poster_path && credit.media_type === 'movie')
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 10)
        .map((credit) => {
          return {
            id: credit.id,
            title: credit.title || credit.name || 'Untitled',
            image: credit.poster_path,
            name: credit.name,
            media_type: credit.media_type,
          };
        });

      setPersonDetails({
        ...response.data,
        movies,
        knownCredits: uniqueCredits.length,
        gender:
          response.data.gender === 1
            ? 'Female'
            : response.data.gender === 2
              ? 'Male'
              : 'Not specified',
        departmentCredits,
      });
    };

    handlePersonDetails();
  }, [params.id]);

  console.log('first===', params);

  return (
    <>
      <FlexboxGrid justify="center" style={{ marginTop: '2rem', gap: '2rem' }}>
        <FlexboxGrid.Item colspan={5}>
          <VStack spacing={30}>
            <img
              src={configs['low-res-image-path'] + personDetails.profile_path}
              width={'100%'}
              alt={personDetails.name}
              className="rounded-border-md"
            />
            <div className="flex gap-md">
              {personDetails.external_ids.facebook_id && (
                <Whisper
                  placement="top"
                  controlId="control-id-instagram"
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
                    href={`https://www.instagram.com/${personDetails.external_ids.facebook_id}`}
                  >
                    <Facebook size={28} />
                  </a>
                </Whisper>
              )}

              {personDetails.external_ids.instagram_id && (
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
                    href={`https://www.instagram.com/${personDetails.external_ids.instagram_id}`}
                  >
                    <Instagram size={28} />
                  </a>
                </Whisper>
              )}

              {personDetails.external_ids.twitter_id && (
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
                    href={`https://www.twitter.com/${personDetails.external_ids.twitter_id}`}
                  >
                    <Twitter size={28} />
                  </a>
                </Whisper>
              )}

              {personDetails.external_ids.youtube_id && (
                <Whisper
                  placement="top"
                  controlId="control-id-youtube"
                  trigger="hover"
                  speaker={
                    <Tooltip>
                      Visit <i>Youtube</i>
                    </Tooltip>
                  }
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.youtube.com/${personDetails.external_ids.youtube_id}`}
                  >
                    <Youtube size={28} />
                  </a>
                </Whisper>
              )}
            </div>
            <div>
              <Heading level={4} className="margin-bottom-sm">
                Personal Info
              </Heading>
              <Text size={17} weight="semibold">
                Known For
              </Text>
              <Text size={17}>
                {personDetails.known_for_department || 'Not Available'}
              </Text>
            </div>
            <div>
              <Text size={17} weight="semibold">
                Known Credits
              </Text>
              <Text size={17}>{personDetails.knownCredits}</Text>
            </div>
            <div>
              <Text size={17} weight="semibold">
                Gender
              </Text>
              <Text size={17}>{personDetails.gender}</Text>
            </div>
            <div>
              <Text size={17} weight="semibold">
                Birthday
              </Text>
              <Text size={17}>
                {`${formatDate(personDetails.birthday)} (${moment(personDetails.birthday, 'YYYYMMDD').fromNow(true)} old)`}
              </Text>
            </div>
            <div>
              <Text size={17} weight="semibold">
                Place of Birth
              </Text>
              <Text size={17}>{personDetails.place_of_birth}</Text>
            </div>
            <div>
              <Text className="margin-bottom-sm" size={17} weight="semibold">
                Also Known As
              </Text>
              {personDetails.also_known_as.map((name, index) => (
                <Text className="margin-bottom-sm" key={index} size={17}>
                  {name}
                </Text>
              ))}
            </div>
          </VStack>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={17}>
          <Heading className="margin-bottom-md" level={2}>
            {personDetails.name}
          </Heading>
          <div className="margin-bottom-md">
            <Heading level={4}>Biography</Heading>
            <Text
              maxLines={readMore ? 0 : 7}
              size={14}
              style={{ whiteSpace: 'pre-line' }}
            >
              {personDetails.biography}
            </Text>
            {!readMore && (
              <div style={{ textAlign: 'right' }}>
                <Button
                  size="sm"
                  appearance="link"
                  endIcon={<ChevronRight />}
                  onClick={() => setReadMore(true)}
                >
                  Read More
                </Button>
              </div>
            )}
          </div>

          <div className="margin-bottom-md">
            <Heading level={4}>Known For</Heading>
            <Swiper {...swiperConfig}>
              {personDetails.movies?.map((data) => (
                <SwiperSlide key={data?.id}>
                  <Link
                    to={`/${data.media_type}/${data.id}-${
                      data.title?.toLowerCase().replace(/ /g, '-') ||
                      data.name?.toLowerCase().replace(/ /g, '-')
                    }`}
                  >
                    <Panel shaded bordered bodyFill style={{ width: 200 }}>
                      <img
                        src={configs['low-res-image-path'] + data?.image}
                        alt={personDetails.name}
                        width="100%"
                        loading="lazy"
                      />

                      <Panel>
                        <Text weight="semibold">
                          {data?.title || 'Not Available'}
                        </Text>
                      </Panel>
                    </Panel>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div>
            {Object.keys(personDetails.departmentCredits || {}).map(
              (department) => (
                <div key={department} className="margin-bottom-md">
                  <Heading level={4}>{department}</Heading>
                  <Panel shaded bordered bodyFill>
                    {personDetails.departmentCredits[department].map((data) => (
                      <Panel key={data.id}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <Heading level={6}>
                            {data?.release_date || data?.first_air_date
                              ? new Date(
                                  data?.release_date || data?.first_air_date,
                                ).getFullYear()
                              : 'N/A'}
                          </Heading>
                          <div>
                            <Link
                              to={`/${data.media_type}/${data.id}-${
                                data.title?.toLowerCase().replace(/ /g, '-') ||
                                data.name?.toLowerCase().replace(/ /g, '-')
                              }`}
                              className="data-list"
                            >
                              <Heading level={5}>
                                {data.title || data.name}
                              </Heading>
                            </Link>
                            <div>
                              {data.character && <div>as {data.character}</div>}
                              {data.job && <div>Role: {data.job}</div>}
                            </div>
                          </div>
                        </div>
                      </Panel>
                    ))}
                  </Panel>
                </div>
              ),
            )}
          </div>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  );
};

export default PersonDetails;

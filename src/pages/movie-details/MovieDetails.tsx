import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axiosInstance";
import Heading from "rsuite/Heading";
import { useParams } from "react-router-dom";
import Text from "rsuite/Text";
import Stack from "rsuite/Stack";
import HStack from "rsuite/HStack";
import VStack from "rsuite/VStack";
import config from "../../configs/configs.json";
import { formatDate } from "../../lib/formatDate";
import Progress from "rsuite/Progress";
import { formatRuntime } from "../../lib/formatRuntime";
import { Play } from "lucide-react";
import { Button } from "rsuite";
import FlexboxGrid from "rsuite/FlexboxGrid";

interface MovieDataInterface {
  id: number;
  title: string;
  backdrop_path: string;
  budget: number;
  poster_path: string;
  release_date: string;
  release_dates: {
    iso_3166_1: string;
    release_dates: { certification: string; iso_639_1: string }[];
  };
  genres: { id: number; name: string }[];
  runtime: number;
  vote_average: number;
  tagline: string;
  overview: string;
  credits: { cast: []; crew: [] };
}

interface CrewMember {
  id: number;
  job: string | string[];
  name: string;
}

type FilteredCrewMember = Omit<CrewMember, "job"> & {
  job: string[];
  name: string;
};

const MovieDetails = () => {
  const params = useParams();
  const [movieData, setMovieData] = useState<MovieDataInterface>({
    id: 0,
    title: "",
    backdrop_path: "",
    budget: 0,
    poster_path: "",
    release_date: "",
    release_dates: {
      iso_3166_1: "IN",
      release_dates: [{ certification: "", iso_639_1: "" }],
    },
    genres: [{ id: 0, name: "" }],
    runtime: 0,
    vote_average: 0,
    tagline: "",
    overview: "",
    credits: { cast: [], crew: [] },
  });

  const userScore = Math.round((movieData.vote_average * 100) / 10);
  useEffect(() => {
    const movieID = params.id?.split("-")[0];
    const handleTrendingData = async () => {
      try {
        const response = await axiosInstance.get(`/movie/${movieID}`, {
          params: { append_to_response: "release_dates,credits" },
        });
        const filteredData = {
          ...response?.data,
          release_dates: response?.data?.release_dates?.results.find(
            (data: { iso_3166_1: string }) => data?.iso_3166_1 === "IN"
          ),
        };
        setMovieData(filteredData);
      } catch (error) {
        console.log("error", error);
      }
    };
    handleTrendingData();
  }, []);

  const crewData: FilteredCrewMember[] = movieData?.credits?.crew
    ?.filter(
      (detail: CrewMember) =>
        detail?.job === "Writer" ||
        detail?.job === "Director" ||
        detail?.job === "Story" ||
        detail?.job === "Screenplay" ||
        detail?.job === "Characters" ||
        detail?.job === "Creator"
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

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${config["med2-res-image-path"]}${movieData.backdrop_path})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backgroundBlendMode: "overlay",
          padding: "3rem 2rem",
        }}>
        <Stack spacing={50} alignItems="flex-start">
          <img
            src={config["med-res-image-path"] + movieData.poster_path}
            width={300}
          />
          <VStack spacing={30} style={{ color: "white" }}>
            <div>
              <Heading level={2}>
                {movieData?.title}
                {movieData?.release_date
                  ? ` (${movieData?.release_date.split("-")[0]})`
                  : ""}
              </Heading>

              <HStack spacing={10}>
                <Text
                  style={{
                    color: "white",
                    border: "1px solid white",
                    display: "inline-block",
                    paddingInline: 3,
                  }}
                  weight="thin"
                  size="md">
                  {movieData?.release_dates?.release_dates[0]?.certification}{" "}
                </Text>
                <Text style={{ display: "inline-block", color: "white" }}>
                  {formatDate(movieData?.release_date)}{" "}
                  {movieData?.release_dates &&
                    `(${movieData?.release_dates?.iso_3166_1})`}
                </Text>
                <Text style={{ display: "inline-block", color: "white" }}>
                  •
                </Text>
                <Text style={{ display: "inline-block", color: "white" }}>
                  {movieData?.genres.map((genre) => genre.name).join(", ")}
                </Text>
                <Text style={{ display: "inline-block", color: "white" }}>
                  •
                </Text>
                <Text style={{ display: "inline-block", color: "white" }}>
                  {formatRuntime(movieData.runtime)}
                </Text>
              </HStack>
            </div>

            <HStack spacing={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 60,
                    display: "inline-block",
                  }}>
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
              <Button size="xs" className="play-trailer-btn">
                <Play size={20} style={{ marginRight: 3 }} />
                Play Trailer
              </Button>
            </HStack>

            <VStack spacing={15}>
              <Text
                size={15}
                as="i"
                style={{
                  color: "wheat",
                }}
                weight="semibold">
                {movieData.tagline}
              </Text>
              <div>
                <Heading level={4}>Overview</Heading>
                <Text
                  style={{
                    color: "white",
                  }}>
                  {movieData.overview}
                </Text>
              </div>
              <FlexboxGrid
                style={{
                  width: "100%",
                  rowGap: "1.5rem",
                }}>
                {crewData?.map((detail, index) => (
                  <FlexboxGrid.Item key={index} colspan={8}>
                    <Heading level={6}>{detail.name}</Heading>
                    {detail.job.join(", ")}
                  </FlexboxGrid.Item>
                ))}
              </FlexboxGrid>
              {/* <Grid>
                <Row>
                  <Col></Col>
                </Row>
              </Grid> */}
            </VStack>
          </VStack>
        </Stack>
      </div>
    </>
  );
};

export default MovieDetails;

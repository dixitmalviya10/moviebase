import { useEffect, useState } from "react";
// import axiosInstance from "../../lib/axiosInstance";
import Heading from "rsuite/Heading";
import { Link, useParams } from "react-router-dom";
import Text from "rsuite/Text";
import Stack from "rsuite/Stack";
import HStack from "rsuite/HStack";
import VStack from "rsuite/VStack";
import config from "../../../configs/configs.json";
// import { formatDate } from "../../lib/formatDate";
import Progress from "rsuite/Progress";
import Panel from "rsuite/Panel";
import { Play } from "lucide-react";
import { Button } from "rsuite";
import FlexboxGrid from "rsuite/FlexboxGrid";
import axiosInstance from "../../../lib/axiosInstance";
import { formatDate } from "../../../lib/formatDate";

interface MovieDataInterface {
  id: number;
  title: string;
  backdrop_path: string;
  budget: number;
  poster_path: string;
  release_date: string;
  content_ratings: {
    iso_3166_1: string;
    rating: string;
  };
  genres: { id: number; name: string }[];
  runtime: number;
  vote_average: number;
  tagline: string;
  overview: string;
  credits: { cast: []; crew: [] };
  created_by: { id: number; name: string }[];
  networks: { id: number; logo_path: string; name: string }[];
  "watch/providers": {
    results: {
      IN: {
        flatrate: { id: number; name: string; logo_path: string }[];
        link: string;
      };
    };
  };
}

// interface CrewMember {
//   id: number;
//   job: string | string[];
//   name: string;
// }

// type FilteredCrewMember = Omit<CrewMember, "job"> & {
//   job: string[];
//   name: string;
// };

const TvDetails = () => {
  const params = useParams();
  const [tvData, setTvData] = useState<MovieDataInterface>({
    id: 0,
    title: "",
    backdrop_path: "",
    budget: 0,
    poster_path: "",
    release_date: "",
    content_ratings: {
      iso_3166_1: "",
      rating: "",
    },
    genres: [{ id: 0, name: "" }],
    runtime: 0,
    vote_average: 0,
    tagline: "",
    overview: "",
    credits: { cast: [], crew: [] },
    created_by: [{ id: 0, name: "" }],
    networks: [{ id: 0, logo_path: "", name: "" }],
    "watch/providers": {
      results: {
        IN: {
          flatrate: [{ id: 0, name: "", logo_path: "" }],
          link: "",
        },
      },
    },
  });

  const userScore = Math.round((tvData.vote_average * 100) / 10);
  useEffect(() => {
    const tvID = params.id?.split("-")[0];
    const handleTrendingData = async () => {
      try {
        const response = await axiosInstance.get(`/tv/${tvID}`, {
          params: {
            append_to_response: "content_ratings,credits,watch/providers",
          },
        });
        const filteredData = {
          ...response?.data,
          content_ratings: response?.data?.content_ratings?.results.find(
            (data: { iso_3166_1: string }) =>
              data?.iso_3166_1 === "IN" || data?.iso_3166_1 === "US"
          ),
        };
        setTvData(filteredData);
      } catch (error) {
        console.log("error", error);
      }
    };
    handleTrendingData();
  }, []);

  //   const crewData: FilteredCrewMember[] = tvData?.credits?.crew
  //     ?.filter(
  //       (detail: CrewMember) =>
  //         detail?.job === "Writer" ||
  //         detail?.job === "Director" ||
  //         detail?.job === "Story" ||
  //         detail?.job === "Screenplay" ||
  //         detail?.job === "Characters" ||
  //         detail?.job === "Creator"
  //     )
  //     .reduce((acc: FilteredCrewMember[], current: CrewMember) => {
  //       const existing = acc.find((item) => item.id === current.id);

  //       if (existing) {
  //         existing.job = Array.isArray(existing.job)
  //           ? existing.job
  //           : [existing.job];
  //         if (!existing.job.includes(current.job as string)) {
  //           existing.job.push(current.job as string);
  //         }
  //       } else {
  //         acc.push({ ...current, job: [current.job as string] });
  //       }

  //       return acc;
  //     }, []);

  console.log("first======", tvData);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${config["med2-res-image-path"]}${tvData.backdrop_path})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backgroundBlendMode: "overlay",
          padding: "3rem 2rem",
        }}>
        <Stack spacing={50} alignItems="flex-start">
          {/* <img
            src={config["med-res-image-path"] + tvData.poster_path}
            width={300}
          /> */}
          <Panel
            shaded
            bodyFill
            bordered
            style={{ display: "inline-block", width: 250 }}>
            <img
              src={config["med-res-image-path"] + tvData.poster_path}
              width={"100%"}
            />
            {tvData?.["watch/providers"]?.results?.IN?.flatrate?.map((data) => (
              <div className="flex-center" key={data.id}>
                <img
                  src={config["med-res-image-path"] + data.logo_path}
                  width={40}
                  style={{ margin: 5, borderRadius: 3 }}
                  alt={data?.name}
                />
                <div>
                  <Text weight="bold" style={{ color: "lightgray" }}>
                    Now Streaming
                  </Text>
                  <Text
                    as={Link}
                    to={tvData?.["watch/providers"]?.results?.IN?.link}
                    target="_blank"
                    weight="bold"
                    style={{ color: "white" }}>
                    Watch Now
                  </Text>
                </div>
              </div>
            ))}
          </Panel>
          <VStack spacing={30} style={{ color: "white" }}>
            <div>
              <Heading level={2}>
                {tvData?.title}
                {tvData?.release_date
                  ? ` (${tvData?.release_date.split("-")[0]})`
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
                  {tvData?.content_ratings.rating}{" "}
                </Text>
                <Text style={{ display: "inline-block", color: "white" }}>
                  {formatDate(tvData?.release_date)}{" "}
                  {tvData?.content_ratings &&
                    `(${tvData?.content_ratings?.iso_3166_1})`}
                </Text>
                <Text style={{ display: "inline-block", color: "white" }}>
                  •
                </Text>
                <Text style={{ display: "inline-block", color: "white" }}>
                  {tvData?.genres.map((genre) => genre.name).join(", ")}
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
                {tvData.tagline}
              </Text>
              <div>
                <Heading level={4}>Overview</Heading>
                <Text
                  style={{
                    color: "white",
                  }}>
                  {tvData.overview}
                </Text>
              </div>
              <FlexboxGrid
                style={{
                  width: "100%",
                  rowGap: "1.5rem",
                }}>
                {tvData?.created_by?.map(
                  (detail: { id: number; name: string }) => (
                    <FlexboxGrid.Item key={detail.id} colspan={8}>
                      <Heading level={6}>{detail.name}</Heading>
                      Creator
                    </FlexboxGrid.Item>
                  )
                )}
              </FlexboxGrid>
            </VStack>
          </VStack>
        </Stack>
      </div>
    </>
  );
};

export default TvDetails;

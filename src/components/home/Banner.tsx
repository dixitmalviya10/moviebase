import Heading from "rsuite/Heading";
import AutoComplete from "rsuite/AutoComplete";
import { useState } from "react";
import axiosInstance from "../../lib/axiosInstance";

interface FilteredDataArray {
  readonly id: number;
  name: string;
}

interface FilteredData {
  results: FilteredDataArray[];
}

const Banner = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchedData, setSearchedData] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<FilteredData>({
    results: [],
  });

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    try {
      const response = await axiosInstance.get("/search/multi?", {
        params: { query: value },
      });
      setSearchedData(
        response?.data?.results
          .filter((data: { title: string }) => data?.title)
          .map((data: { title: string }) => data?.title)
      );
      setFilteredData(response?.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("filteredData===", filteredData);
  return (
    <>
      <Heading level={1}>Welcome</Heading>
      <Heading>
        Millions of movies, TV shows and people to discover. Explore now.
      </Heading>
      <AutoComplete
        data={searchedData}
        value={searchValue}
        onChange={handleSearch}
        placeholder="Search for a movie, tv show, person..."
        size="lg"
      />
    </>
  );
};

export default Banner;

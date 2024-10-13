import Heading from 'rsuite/Heading';
import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { configs } from '../../configs/constants';
import noImageIcon from '../../../public/assets/images/no-image-icon-23500.jpg';
import { useNavigate } from 'react-router-dom';

interface FilteredDataArray {
  readonly id: number;
  title?: string;
  name?: string;
  media_type?: string;
  poster_path?: string;
  profile_path?: string;
}

interface FilteredData {
  results: FilteredDataArray[];
}

interface SearchItem {
  name: string;
  id: number;
  poster_path?: string | null;
  media_type: string;
}

const Banner = () => {
  // const [searchValue, setSearchValue] = useState<string>('');
  const [searchedData, setSearchedData] = useState<SearchItem[]>([]);
  const [filteredData, setFilteredData] = useState<FilteredData>({
    results: [],
  });
  const navigate = useNavigate();

  const handleSearch = useCallback(async (value: string) => {
    // setSearchValue(value);
    try {
      const response = await axiosInstance.get('/search/multi', {
        params: { query: value },
      });
      setFilteredData(response?.data);
    } catch (error) {
      console.error('error', error);
    }
  }, []);

  // Optimize useEffect to avoid triggering multiple updates unnecessarily
  useEffect(() => {
    if (filteredData.results.length > 0) {
      const filteredTitles = filteredData.results
        .filter((data: FilteredDataArray) => data.title || data.name)
        .map((data: FilteredDataArray) => ({
          name: data.title || data.name || '',
          id: data.id,
          poster_path: data.poster_path || data.profile_path || null,
          media_type: data.media_type || '',
        }));

      setSearchedData((prevSearchedData) => {
        if (
          filteredTitles.length !== prevSearchedData.length ||
          !filteredTitles.every(
            (item, index) => item.id === prevSearchedData[index]?.id,
          )
        ) {
          return filteredTitles; // Update state only if content is different
        }
        return prevSearchedData; // No update if it's the same
      });
    }
  }, [filteredData]);

  const handleOnSelect = (item: SearchItem) => {
    let path = '';
    if (item.name && item.media_type === 'movie') {
      path = `/movie/${item.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`;
    } else if (item.name && item.media_type === 'tv') {
      path = `/tv/${item.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`;
    } else if (item.name && item.media_type === 'person') {
      path = `/person/${item.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`;
    }
    navigate(path);
  };

  const formatResult = (item: SearchItem) => {
    const imageUrl = item.poster_path
      ? `${configs['low-res-image-path']}${item.poster_path}`
      : noImageIcon;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          width={50}
          height={60}
          style={{ objectFit: 'contain', borderRadius: '0.3rem' }}
          src={imageUrl}
          alt={`${item.name || 'media'}-poster`}
        />
        <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
      </div>
    );
  };

  const handleEnterKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && searchedData.length > 0) {
        handleOnSelect(searchedData[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchedData],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEnterKeyPress);
    return () => {
      window.removeEventListener('keydown', handleEnterKeyPress);
    };
  }, [handleEnterKeyPress]);

  return (
    <>
      <Heading level={1}>Welcome</Heading>
      <Heading>
        Millions of movies, TV shows and people to discover. Explore now.
      </Heading>

      <ReactSearchAutocomplete
        items={searchedData}
        onSearch={handleSearch}
        inputDebounce={500}
        onSelect={handleOnSelect}
        showItemsOnFocus
        formatResult={formatResult}
        styling={{ zIndex: 10 }}
        placeholder="Search for a movie, tv show, person...."
      />
    </>
  );
};

export default Banner;

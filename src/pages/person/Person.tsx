import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { Link } from 'react-router-dom';
import { Heading, Pagination, Panel } from 'rsuite';
import { configs } from '../../configs/constants';

interface PersonInterface {
  page: number | null;
  results: {
    id: number | null;
    name: string;
    profile_path: string;
    known_for: { title?: string; name?: string }[];
  }[];
  total_pages: number | null;
}
const Person = () => {
  const [activePage, setActivePage] = useState<number>(1);
  const [personData, setPersonData] = useState<PersonInterface>({
    page: null,
    results: [
      {
        id: null,
        name: '',
        profile_path: '',
        known_for: [{ title: '', name: '' }],
      },
    ],
    total_pages: null,
  });

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const response = await axiosInstance.get('person/popular', {
          params: { page: activePage },
        });
        setPersonData(response?.data);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchPersonData();
  }, [activePage]);

  console.log('personData====', personData);
  return (
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      <Heading style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        Popular People
      </Heading>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem ',
          justifyContent: 'space-between',
        }}
      >
        {personData?.results.map((data) => {
          const path = `/person/${data?.id}-${data?.name
            ?.toLowerCase()
            .replace(/\s+/g, '-')}`;

          return (
            <Link to={path} key={data?.id}>
              <Panel shaded bordered bodyFill style={{ width: 220 }}>
                <img
                  loading="lazy"
                  src={
                    data?.profile_path
                      ? configs['low-res-image-path'] + data?.profile_path
                      : configs['no-image3']
                  }
                  width="100%"
                />
                <Panel header={data?.name || 'Not Available'}>
                  <div>
                    {data?.known_for
                      .map(
                        (val: { title?: string; name?: string }) =>
                          val?.title || val?.name,
                      )
                      .join(', ')}
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
          //   first
          //   last
          prev
          next
          activePage={activePage}
          onChangePage={setActivePage}
          ellipsis
          total={personData?.total_pages || 1}
          maxButtons={8}
        />
      </div>
    </div>
  );
};

export default Person;

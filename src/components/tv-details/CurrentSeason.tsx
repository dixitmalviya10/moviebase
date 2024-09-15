import { Col, Grid, Heading, Panel, Row, Tag, Text, VStack } from 'rsuite';
import { configs } from '../../configs/constants';
import { Star } from 'lucide-react';
import { formatDate } from '../../lib/formatDate';
import React from 'react';
import { CurrentSeasonData } from '../../types/types';

const CurrentSeason: React.FC<{
  numberOfEpisodes: number;
  currentSeasonData: CurrentSeasonData[];
}> = ({ numberOfEpisodes, currentSeasonData }) => {
  // console.log('currentSeasonData===', currentSeasonData);
  const lastSeason = currentSeasonData.find(
    (data: { season_number: number }) =>
      data.season_number === numberOfEpisodes,
  );
  return (
    <>
      <div>
        <Heading>Current Season</Heading>
        <Panel shaded bordered bodyFill>
          <Grid fluid>
            <Row style={{ display: 'flex', alignItems: 'center' }}>
              <Col xs={4} style={{ paddingLeft: 0 }}>
                <img
                  loading="lazy"
                  width={150}
                  src={
                    lastSeason?.poster_path
                      ? configs['low-res-image-path'] + lastSeason?.poster_path
                      : configs['no-image3']
                  }
                />
              </Col>
              <Col xs={20}>
                <VStack spacing={20} justifyContent="center">
                  <div>
                    <Heading level={4}>{lastSeason?.name}</Heading>
                    <div className="flex items-center gap-sm">
                      <Tag
                        title="Ratings"
                        size="sm"
                        color="blue"
                        className="rating-star-center"
                      >
                        <Star size={15} />
                        {lastSeason?.vote_average
                          ? `${lastSeason?.vote_average.toFixed(1)}/10`
                          : 'Not Available'}
                      </Tag>
                      <Text>{formatDate(lastSeason?.air_date)}</Text>
                      <Text>•</Text>
                      <Text>{lastSeason?.episode_count} Episodes</Text>
                    </div>
                  </div>
                  <Text>{lastSeason?.overview}</Text>
                </VStack>
              </Col>
            </Row>
          </Grid>
        </Panel>
      </div>
    </>
  );
};

export default CurrentSeason;

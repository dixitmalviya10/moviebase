import HStack from 'rsuite/HStack';
import VStack from 'rsuite/VStack';
import Text from 'rsuite/Text';
import FlexboxGrid from 'rsuite/FlexboxGrid';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';

const MFooter = () => {
  return (
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={6}>
        <VStack>
          <Text size={17} weight="semibold" className="text-white">
            Movies
          </Text>
          <Text className="text-white underline-text" size={15}>
            <Link to="/movie">Popular</Link>
          </Text>
          <Text className="text-white underline-text" size={15}>
            <Link to="/movie/now-playing">Now Playing</Link>
          </Text>
          <Text className="text-white underline-text" size={15}>
            <Link to="/movie/upcoming">Upcoming</Link>
          </Text>
          <Text className="text-white underline-text" size={15}>
            <Link to="/movie/top-rated">Top Rated</Link>
          </Text>
        </VStack>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={6}>
        <VStack>
          <Text size={17} weight="semibold" className="text-white">
            TV Shows
          </Text>
          <Text className="text-white underline-text" size={15}>
            <Link to="/tv">Popular</Link>
          </Text>
          <Text className="text-white underline-text" size={15}>
            <Link to="/tv/airing-today">Airing Today</Link>
          </Text>
          <Text className="text-white underline-text" size={15}>
            <Link to="/tv/on-the-air">On TV</Link>
          </Text>
          <Text className="text-white underline-text" size={15}>
            <Link to="/tv/top-rated">Top Rated</Link>
          </Text>
        </VStack>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={6}>
        <VStack>
          <Text size={17} weight="semibold" className="text-white">
            People
          </Text>
          <Text className="text-white underline-text" size={15}>
            <Link to="/person">Popular People</Link>
          </Text>
        </VStack>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={6}>
        <VStack spacing={10}>
          <Text size={17} weight="semibold" className="text-white">
            Contact
          </Text>

          <VStack spacing={10}>
            <HStack spacing={15}>
              <a
                className="contact-icons"
                title="Linkedin"
                href="https://www.linkedin.com/in/dixit-lohar10/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={30} />
              </a>
              <a
                className="contact-icons"
                title="Instagram"
                href="https://www.instagram.com/dixitmalviya10/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={30} />
              </a>
            </HStack>
            <Link
              className="contact-icons underline-text flex-center gap-sm"
              to="mailto:dixitmalviya10@gmail.com"
            >
              <Text className="text-white" size={15}>
                dixitmalviya10@gmail.com
              </Text>
            </Link>
          </VStack>
        </VStack>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default MFooter;

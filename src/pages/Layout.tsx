import { NavLink, Outlet } from 'react-router-dom';
import Container from 'rsuite/Container';
import Header from 'rsuite/Header';
import Content from 'rsuite/Content';
import Footer from 'rsuite/Footer';
import Navbar from 'rsuite/Navbar';
import Nav from 'rsuite/Nav';
import DarkMode from '../components/DarkMode';
import { Affix } from 'rsuite';
import MFooter from '../components/MFooter';
// import { useContext } from "react";
// import { ThemeContext } from "../provider/Theme";
// import { Moon, Sun } from "lucide-react";
// import { Button, IconButton } from "rsuite";

const Layout = () => {
  return (
    <>
      <Container>
        <Affix top={0} style={{ zIndex: 30 }}>
          <Header>
            <Navbar appearance="inverse" className="fixed-width">
              <Navbar.Brand as={NavLink} to="/">
                MovieBase
              </Navbar.Brand>
              <Nav>
                <Nav.Menu title="Movies">
                  <Nav.Item as={NavLink} to="/movie">
                    Popular
                  </Nav.Item>
                  <Nav.Item as={NavLink} to="/movie/now-playing">
                    Now Playing
                  </Nav.Item>
                  <Nav.Item as={NavLink} to="/movie/upcoming">
                    Upcoming
                  </Nav.Item>
                  <Nav.Item as={NavLink} to="/movie/top-rated">
                    Top Rated
                  </Nav.Item>
                </Nav.Menu>
                <Nav.Menu title="TV Shows">
                  <Nav.Item as={NavLink} to="/tv">
                    Popular
                  </Nav.Item>
                  <Nav.Item as={NavLink} to="/tv/airing-today">
                    Airing Today
                  </Nav.Item>
                  <Nav.Item as={NavLink} to="/tv/on-the-air">
                    On TV
                  </Nav.Item>
                  <Nav.Item as={NavLink} to="/tv/top-rated">
                    Top Rated
                  </Nav.Item>
                </Nav.Menu>
                <Nav.Menu title="People">
                  <Nav.Item as={NavLink} to="/person">
                    Popular People
                  </Nav.Item>
                </Nav.Menu>
              </Nav>
              <Nav pullRight>
                <Nav.Item>
                  <DarkMode />
                </Nav.Item>
              </Nav>
            </Navbar>
          </Header>
        </Affix>
        <Content>
          <div className="fixed-width">
            <Outlet />
          </div>
        </Content>
        <Footer className="mfooter">
          <div className="fixed-width ">
            <MFooter />
          </div>
        </Footer>
      </Container>
    </>
  );
};

export default Layout;

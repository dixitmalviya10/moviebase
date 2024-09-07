import { NavLink, Outlet } from "react-router-dom";
import Container from "rsuite/Container";
import Header from "rsuite/Header";
import Content from "rsuite/Content";
import Footer from "rsuite/Footer";
import Navbar from "rsuite/Navbar";
import Nav from "rsuite/Nav";
import DarkMode from "../components/DarkMode";
import { Affix } from "rsuite";
import MFooter from "../components/MFooter";
// import { useContext } from "react";
// import { ThemeContext } from "../provider/Theme";
// import { Moon, Sun } from "lucide-react";
// import { Button, IconButton } from "rsuite";

const Layout = () => {
  return (
    <>
      <Container>
        <Affix top={0}>
          <Header>
            <Navbar appearance="inverse" className="fixed-width">
              <Navbar.Brand as={NavLink} to="/">
                MovieBase
              </Navbar.Brand>
              <Nav>
                <Nav.Menu title="Movies">
                  <Nav.Item as={NavLink} to="/popular-movies">
                    Popular
                  </Nav.Item>
                  <Nav.Item>Now Playing</Nav.Item>
                  <Nav.Item>Upcoming</Nav.Item>
                  <Nav.Item>Top Rated</Nav.Item>
                </Nav.Menu>
                <Nav.Menu title="TV Shows">
                  <Nav.Item>Popular</Nav.Item>
                  <Nav.Item>Airing Today</Nav.Item>
                  <Nav.Item>On TV</Nav.Item>
                  <Nav.Item>Top Rated</Nav.Item>
                </Nav.Menu>
                <Nav.Menu title="People">
                  <Nav.Item>Popular People</Nav.Item>
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

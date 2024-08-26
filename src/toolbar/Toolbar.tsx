import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

export const Toolbar = () => {
  return (
    <Navbar
      style={{
        padding: 0,
        width: '100%',
        height: '40px',
        paddingLeft: 0,
        paddingRight: 0,
      }}
      expand="lg" className="bg-body-tertiary">
      <Container
        style={{
          alignItems: 'start',
          width: '100%',
          height: '40px',
        }}>
        <Navbar.Brand href="#home">AIV editor</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
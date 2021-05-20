import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

function NavBar() {
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Meal To Your Door</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse animation="false">
          <Nav className="mr-auto" style={{ marginLeft: '3%' }}>
            <NavDropdown title="Meals & Menus">
              <NavDropdown.Item
                href="/admin/create-menu"
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  backgroundColor: 'white',
                }}
              >
                Create / Edit Menus
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/admin/edit-meal"
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  backgroundColor: 'honeydew',
                }}
              >
                Edit Meals
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/admin/create-meal"
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  backgroundColor: 'white',
                }}
              >
                Create Meals
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/admin/edit-meal-recipe"
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  backgroundColor: 'honeydew',
                }}
              >
                Edit Meal Recipes
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              href="/admin/plans-coupons"
            >
              Plans & Coupons
            </Nav.Link>

            <Nav.Link
              href="/admin/order-ingredients"
            >
              Orders & Ingredients
            </Nav.Link>

            <Nav.Link
              href="/admin/customers"
            >
              Customers
            </Nav.Link>

            <Nav.Link
              href="/admin/google-analytics"
            >
              Google Analytics
            </Nav.Link>

            <Nav.Link
              href="/admin/notifications"
            >
              Notifications
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/admin/zones"> Zones </Nav.Link>
            <Nav.Link href="/select-meal">Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;

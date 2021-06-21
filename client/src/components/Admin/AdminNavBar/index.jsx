import { useEffect, useState } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import whiteLogo from "../../../images/White_logo_for_web.png";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import { useHistory } from "react-router";
import styles from "./adminNavBar.module.css";
// import hamburger from './hamburger.png'

function NavBar(props) {

  const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  });

	useEffect(() => {
    function handleResize() {
			setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
		}

    window.addEventListener('resize', handleResize);

		return _ => {
      window.removeEventListener('resize', handleResize);
		}
  });

  // const history = useHistory();

  // const goToLink = (navlink) => {
  //   console.log("LINK CLICKED: ", navLink);
  //   history.push(navlink);
  // }

  /*return (
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
              href="/admin/customer-info"
            >
              Customer Info
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
  );*/
  return (
    <div
      style={{
        // border: 'solid',
        backgroundColor: '#F8BB17',
        display: 'flex',
        // alignItems: 'center',
        height: '80px',
        position: 'relative',
        zIndex: '100'
      }}
    >

      {/* For debugging window size */}
			{/* <span 
				style={{
					zIndex: '101',
					position: 'fixed',
					backgroundColor: 'white',
					border: 'solid',
					borderWidth: '1px',
					borderColor: 'green',
					width: '150px',
          top: '500px'
				}}
			>
				Height: {dimensions.height}px
				<br />
				Width: {dimensions.width}px
			</span> */}

      <div
        style={{
          // border: 'solid',
          width: '200px'
        }}
      >
        <a 
          href='/home' 
          style={{
            // margin:0,
            // position:"absolute",
            // width: "160px", 
            // height:"80px",
            // top:"5px",
            // border: 'inset',
            backgroundImage:`url(${whiteLogo})`,
            backgroundSize:'cover',
            // backgroundPosition:'center',
            // left:'48%',
            // width: '12%',
            // marginLeft: '1%',
            // marginRight: '1%',
            // minWidth: '120px',
            marginTop: '10px',
            marginLeft: '20px',
            width: '140px',
            height: '70px'
          }}>
        </a>
      </div>

      {dimensions.width > 1000 ? (
        <div
          style={{
            // border: 'solid',
            width: '90%',
            display: 'flex',
            // textAlign: 'center',
            // justifyContent: 'center',
            alignItems: 'center',
            // display: flex;
            // /* flex-direction: column; */
            // text-align: center;
            // justify-content: center;
            // align-items: center;
            height: '80px'
          }}
        >
          <a href='/admin/edit-meal' className={styles.navLink3}>Meals & Plans</a>
          <a href='/admin/plans-coupons' className={styles.navLink4}>Plans & Coupons</a>
          <a 
            href='/admin/order-ingredients' 
            className={styles.navLink5}
            style={props.currentPage === 'order-ingredients' ? {color: 'black'} : {}}
          > 
            Orders & Ingredients 
          </a>
          <a 
            href='/admin/customer-info' 
            className={styles.navLink2}
            style={props.currentPage === 'customer-info' ? {color: 'black'} : {}}
          >
            Customers
          </a>
          <a href='/admin/customers' className={styles.navLink4}>Google Analytics</a>
          <a href='/admin/edit-meal' className={styles.navLink3}>Notifications</a>
          <a 
            href='/admin/edit-meal' 
            className={styles.navLink2}
            style={props.currentPage === 'edit-meal' ? {color: 'black'} : {}}
          >
            Businesses
          </a>
          <a href='/admin/edit-meal' className={styles.navLink1}>Zones</a>
          <a href='/admin/edit-meal' className={styles.navLink1}>Profile</a>
        </div>
      ) : (
        <div>
          NARROW VIEW
        </div>
      )}


    </div>
  );
}

export default NavBar;

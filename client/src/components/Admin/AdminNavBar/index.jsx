import { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import whiteLogo from "../../../images/White_logo_for_web.png";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router";
import styles from "./adminNavBar.module.css";
import hamburger from "../../../images/hamburger.png";
import forkClose from "../../../images/forkClose.png";

const LINK_WIDTH = {
  menu: "7%",
  orders: "8%",
  ingredients_n_units: "16%",
  businesses_n_meals: "16%",
  customers: "12%",
  notifications: "14%",
  coupons: "9%",
  zones: "8%",
  analytics: "10%",

  // menu: '11%',
  // orders: '11%',
  // ingredients_n_units: '11%',
  // businesses_n_meals: '11%',
  // customers: '11%',
  // notifications: '11%',
  // coupons: '11%',
  // zones: '11%',
  // analytics: '11%'

  // menu: '9%',
  // orders: '9%',
  // ingredients_n_units: '16%',
  // businesses_n_meals: '16%',
  // customers: '11%',
  // notifications: '11%',
  // coupons: '9%',
  // zones: '9%',
  // analytics: '9%'
};

function NavBar(props) {
  const history = useHistory();

  const [showDropdown, setShowDropdown] = useState(false);

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      if (dimensions.width > 1000 && showDropdown === true) {
        console.log("in handleResize");
        setShowDropdown(false);
      }
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <>
      {/* <div
      style={{
        border: '1px solid red',
        backgroundColor: '#F8BB17',
        display: 'flex',
        // alignItems: 'center',
        height: '80px',
        position: 'relative',
        zIndex: '100',
        width: '100vw',
        maxWidth: '100%'
      }}
    > */}

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

      {/* <div
        style={{
          // border: 'solid',
          width: '200px'
        }}
      >
        <a 
          href='/home' 
          style={{
            backgroundImage:`url(${whiteLogo})`,
            backgroundSize:'cover',
            marginTop: '10px',
            marginLeft: '20px',
            width: '140px',
            height: '70px'
          }}>
        </a>
      </div> */}

      {dimensions.width > 1000 ? (
        <div
          style={{
            // border: '1px solid white',
            backgroundColor: "#F8BB17",
            display: "flex",
            // alignItems: 'center',
            height: "80px",
            position: "relative",
            zIndex: "100",
            width: "100vw",
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              // border: 'solid',
              width: "200px",
            }}
          >
            <a
              href="/home"
              style={{
                backgroundImage: `url(${whiteLogo})`,
                backgroundSize: "cover",
                marginTop: "10px",
                marginLeft: "20px",
                // marginRight: '20px',
                width: "140px",
                height: "70px",
                // border: '1px solid'
              }}
            ></a>
          </div>
          <div
            style={{
              width: "90%",
              maxWidth: "90%",
              display: "flex",
              alignItems: "center",
              height: "80px",
              // border: '1px solid'
            }}
          >
            <a
              href="/admin/create-menu"
              className={styles.navLink}
              style={
                props.currentPage === "create-menu"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.menu,
                    }
                  : {
                      width: LINK_WIDTH.menu,
                    }
              }
            >
              Menu
            </a>

            <a
              href="/admin/order-ingredients"
              className={styles.navLink}
              style={
                props.currentPage === "order-ingredients"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.orders,
                    }
                  : {
                      width: LINK_WIDTH.orders,
                    }
              }
            >
              Orders
            </a>

            <a
              href="/admin/ingredients-units"
              className={styles.navLink}
              style={
                props.currentPage === "ingredients-units"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.ingredients_n_units,
                    }
                  : {
                      width: LINK_WIDTH.ingredients_n_units,
                    }
              }
            >
              Ingredients & Units
            </a>

            <a
              href="/admin/businesses"
              className={styles.navLink}
              style={
                props.currentPage === "businesses"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.businesses_n_meals,
                    }
                  : {
                      width: LINK_WIDTH.businesses_n_meals,
                    }
              }
            >
              Businesses & Meals
            </a>

            <a
              href="/admin/customers"
              className={styles.navLink}
              style={
                props.currentPage === "customers"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.customers,
                    }
                  : {
                      width: LINK_WIDTH.customers,
                    }
              }
            >
              Customers
            </a>
            <a
              href="/admin/notifications"
              className={styles.navLink}
              style={
                props.currentPage === "notifications"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.notifications,
                    }
                  : {
                      width: LINK_WIDTH.notifications,
                    }
              }
            >
              Notifications
            </a>

            <a
              href="/admin/coupons"
              className={styles.navLink}
              style={
                props.currentPage === "plans-coupons"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.coupons,
                    }
                  : {
                      width: LINK_WIDTH.coupons,
                    }
              }
            >
              Coupons
            </a>

            <a
              href="/admin/zones"
              className={styles.navLink}
              style={
                props.currentPage === "zones"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.zones,
                    }
                  : {
                      width: LINK_WIDTH.zones,
                    }
              }
            >
              Zones
            </a>

            <a
              href="/admin/google-analytics"
              className={styles.navLink}
              style={
                props.currentPage === "google-analytics"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.analytics,
                    }
                  : {
                      width: LINK_WIDTH.analytics,
                    }
              }
            >
              Analytics
            </a>
          </div>
        </div>
      ) : (
        <div
          style={{
            // border: '1px solid white',
            backgroundColor: "#F8BB17",
            display: "flex",
            justifyContent: "center",
            // alignItems: 'center',
            height: "80px",
            position: "relative",
            zIndex: "100",
            width: "100vw",
            maxWidth: "100%",
          }}
        >
          {/* <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        > */}
          <div
            style={{
              position: "absolute",
              left: "0",
              height: "100%",
              paddingLeft: "30px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={
                showDropdown
                  ? {
                      width: "50px",
                      height: "50px",
                      backgroundImage: `url(${forkClose})`,
                      backgroundSize: "cover",
                      cursor: "pointer",
                    }
                  : {
                      width: "60px",
                      height: "40px",
                      backgroundImage: `url(${hamburger})`,
                      backgroundSize: "cover",
                      cursor: "pointer",
                    }
              }
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
            />
          </div>
          {showDropdown ? (
            <div
              style={{
                position: "absolute",
                left: "0",
                top: "80px",
                width: "100vw",
                height: "375px",
                backgroundColor: "#F8BB17",
              }}
            >
              <div className={styles.dropdownLink}>
                <a
                  href="/admin/edit-meal"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "meals-plans"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Menu
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin/orders-ingredients"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "orders-ingredients"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Orders
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin/ingredients-units"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "ingredients-units"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Ingredients & Units
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin/businesses"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "businesses" ? { color: "black" } : {}
                  }
                >
                  Businesses & Meals
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin/customers"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "customers" ? { color: "black" } : {}
                  }
                >
                  Customers
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin/notifications"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "notifications"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Notifications
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin/edit-meal"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "notifications"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Coupons
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin/edit-meal"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "businesses" ? { color: "black" } : {}
                  }
                >
                  Zones
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin/edit-meal"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "zones" ? { color: "black" } : {}
                  }
                >
                  Analytics
                </a>
              </div>
            </div>
          ) : null}
          <div
            style={{
              // border: 'dashed',
              width: "200px",
            }}
          >
            <a
              href="/home"
              style={{
                backgroundImage: `url(${whiteLogo})`,
                backgroundSize: "cover",
                marginTop: "10px",
                marginLeft: "20px",
                width: "140px",
                height: "70px",
              }}
            ></a>
          </div>
        </div>
      )}

      {/* </div> */}
    </>
  );
}

export default NavBar;

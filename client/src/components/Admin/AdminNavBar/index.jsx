import { useEffect, useState } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import whiteLogo from "../../../images/White_logo_for_web.png";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import { useHistory } from "react-router";
import styles from "./adminNavBar.module.css";
import hamburger from '../../../images/hamburger.png'
import forkClose from '../../../images/forkClose.png'

function NavBar(props) {
  const history = useHistory();

  const [showDropdown, setShowDropdown] = useState(false);

  const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  });

	useEffect(() => {
    function handleResize() {

      if(dimensions.width > 1000 && showDropdown === true) {
        console.log("in handleResize");
        setShowDropdown(false);
      }
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
        <>
          <div
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
          </div>
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
        </>
      ) : (
        <div
          style={{
            // border: 'solid',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {/* style={{
            width:"60px",
            height:"40px",
            marginLeft: '30px',
            backgroundImage:`url(${hamburger})`,
            backgroundSize:'cover',
            cursor: 'pointer'
          }} */}
          <div
            style={{
              // border: 'dashed',
              position: 'absolute',
              left: '0',
              height: '100%',
              paddingLeft: '30px',
              display: 'flex',
              // justifyContent: 'center',
              alignItems: 'center'
              // width: '20%'
            }}
          >
            <div
              // style={{
              //   width:"60px",
              //   height:"40px",
              //   // marginLeft: '30px',
              //   backgroundImage: (
              //     showDropdown 
              //     ? `url(${hamburger})`
              //     : `url(${forkClose})`
              //   ),
              //   backgroundSize:'cover',
              //   cursor: 'pointer',
              //   // border: 'solid'
              // }}
              style={showDropdown ? {
                width:"50px",
                height:"50px",
                backgroundImage: `url(${forkClose})`,
                backgroundSize:'cover',
                cursor: 'pointer',
              } : {
                width:"60px",
                height:"40px",
                backgroundImage: `url(${hamburger})`,
                backgroundSize:'cover',
                cursor: 'pointer',
              }}
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
            />
          </div>
          {/* <div
            style={{
              position: 'absolute',
              left: '0',
              top: '80px',
              // border: 'solid',
              width: '100vw',
              height: '200px',
              backgroundColor: '#F8BB17'
            }}
          >
            dropdown menu
          </div> */}
          {showDropdown ? (
            <div
              style={{
                position: 'absolute',
                left: '0',
                top: '80px',
                // border: 'solid',
                width: '100vw',
                height: '375px',
                backgroundColor: '#F8BB17'
              }}
            >
              <div className={styles.dropdownLink}>
                <a 
                  href='/admin/edit-meal' 
                  className={styles.navLinkDD}
                  style={props.currentPage === 'meals-plans' ? {color: 'black'} : {}}
                >
                  Meals & Plans
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a 
                  href='/admin/plans-coupons' 
                  className={styles.navLinkDD}
                  style={props.currentPage === 'plans-coupons' ? {color: 'black'} : {}}
                >
                  Plans & Coupons
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a 
                  href='/admin/order-ingredients' 
                  className={styles.navLinkDD}
                  style={props.currentPage === 'orders-ingredients' ? {color: 'black'} : {}}
                >
                  Orders & Ingredients
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a 
                  href='/admin/customer-info'  
                  className={styles.navLinkDD}
                  style={props.currentPage === 'customer-info' ? {color: 'black'} : {}}
                >
                  Customers
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a 
                  href='/admin/edit-meal' 
                  className={styles.navLinkDD}
                  style={props.currentPage === 'google-analytics' ? {color: 'black'} : {}}
                >
                  Google Analytics
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a 
                  href='/admin/edit-meal' 
                  className={styles.navLinkDD}
                  style={props.currentPage === 'notifications' ? {color: 'black'} : {}}
                >
                  Notifications
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a 
                  href='/admin/edit-meal' 
                  className={styles.navLinkDD}
                  style={props.currentPage === 'businesses' ? {color: 'black'} : {}}
                >
                  Businesses
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a 
                  href='/admin/edit-meal' 
                  className={styles.navLinkDD}
                  style={props.currentPage === 'zones' ? {color: 'black'} : {}}
                >
                  Zones
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a 
                  href='/admin/edit-meal' 
                  className={styles.navLinkDD}
                  style={props.currentPage === 'profile' ? {color: 'black'} : {}}
                >
                  Profile
                </a>
              </div>
            </div>
          ) : (
            null
          )}
          <div
            style={{
              // border: 'dashed',
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
          </div>
        </div>
      )}


    </div>
  );
}

export default NavBar;

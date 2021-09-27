import { Component } from "react";
import forkClose from "../../images/forkClose.png";
import styles from "../NavBar/navBar.module.css";
import { Modal } from "react-bootstrap";
import { ReactComponent as ModalCloseBtn } from "../../images/modalClose.svg";

export class MenuList extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
    showLogout: "none",
    showName: "none",
    showAdmin: "none",
    showSigninSignup: "none",
    heightOfBlock: "330px",
    mealPlans: false,
    showMealPlanModal: false,
    showAccountModal: false,
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    if (window.innerWidth <= 900) {

      this.setState({
        ...this.state,
        mealPlans: this.props.hasMealPlan,
      });

      if (this.props.login == true && this.props.isAdmin) {
        this.setState({
          ...this.state,
          showLogout: "flex",
          showAdmin: "flex",
          showSigninSignup: "none",
          heightOfBlock: "430px",
        });
      } else if (this.props.login == true && !this.props.isAdmin) {
        this.setState({
          ...this.state,
          showLogout: "flex",
          showAdmin: "none",
          showSigninSignup: "none",
          heightOfBlock: "400px",
        });
      } else {
        this.setState({
          ...this.state,
          showLogout: "none",
          showAdmin: "none",
          showSigninSignup: "flex",
          heightOfBlock: "400px",
        });
      }
    } else if (this.props.isAdmin) {
      this.setState({
        heightOfBlock: "330px",
      });
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    if (window.innerWidth <= 900) {
      if (this.props.login == true && this.props.isAdmin) {
        this.setState({
          showLogout: "flex",
          showAdmin: "flex",
          showSigninSignup: "none",
          heightOfBlock: "430px",
        });
      } else if (this.props.login == true && !this.props.isAdmin) {
        this.setState({
          showLogout: "flex",
          showAdmin: "none",
          showSigninSignup: "none",
          heightOfBlock: "400px",
        });
      } else {
        this.setState({
          showLogout: "none",
          showAdmin: "none",
          showSigninSignup: "flex",
          heightOfBlock: "400px",
        });
      }
    } else {
      this.setState({
        showLogout: "none",
        showAdmin: "none",
        showSigninSignup: "none",
        heightOfBlock: "330px",
      });
    }

    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  showPopSignup = () => {
    this.props.close();
    this.props.togglePopSignup();
  };

  showPopLogin = () => {
    this.props.close();
    this.props.togglePopLogin();
  };

  toggleMealPlanModal = () => {
    this.setState({
      ...this.state,
      showMealPlanModal: !this.state.showMealPlanModal,
    });
  };

  render() {
    return (
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: this.state.heightOfBlock,
          backgroundColor: "#F26522",
          left: "0px",
          top: "0px",
        }}
      >
        {/* <span>Window size: {this.state.width} x {this.state.height}</span> */}
        {/* {console.log("Logged In: " + this.props.login)} */}
        <div
          style={{
            width: "44px",
            height: "44px",
            position: "absolute",
            left: "50px",
            top: "25px",
            backgroundImage: `url(${forkClose})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
          }}
          onClick={this.props.close}
          aria-label="Click here to close the navigation menu"
          title="Click here to close the navigation menu"
        />

        <div
          style={{
            marginTop: "100px",
          }}
        >
          <a
            href="/home"
            className={styles.hbButton}
            aria-label="Click here to go to the homepage"
            title="Click here to go to the homepage"
          >
            Home
          </a>

          <a
            href="/select-meal"
            className={styles.hbButton}
            aria-label="Click here to select your meal"
            title="Click here to select your meal"
          >
            Select Meals
          </a>

          <a
            href={this.props.hasMealPlan ? "/meal-plan" : ""}
            className={styles.hbButton}
            aria-label="Click here to change your meal plan"
            title="Click here to change your meal plan"
            onClick={(e) => {
              if (!this.props.hasMealPlan) {
                e.preventDefault();
                this.toggleMealPlanModal();
              }
            }}
          >
            Change Meal Plans
          </a>

          <a
            href="/choose-plan"
            className={styles.hbButton}
            aria-label="Click here to add a subscription"
            title="Click here to add a subscription"
          >
            Add Subscriptions
          </a>

          <a
            href={this.props.hasMealPlan ? "/subscription-history" : ""}
            className={styles.hbButton}
            aria-label="Click here to view your subscriptions"
            title="Click here to view your subscriptions"
            onClick={(e) => {
              if (!this.props.hasMealPlan) {
                e.preventDefault();
                this.toggleMealPlanModal();
              }
            }}
          >
            Subscription History
          </a>

          <a
            className={styles.hbButton}
            aria-label="Click here to become an ambassador"
            title="Click here to become an ambassador"
            onClick={(e) => {
              //this.toggleAmbass();
              this.props.toggleAmbass();
              this.props.close();
            }}
          >
            Become an Ambassador
          </a>

          <a
            href="/meal-plan"
            style={{
              display: this.state.showLogout,
            }}
            className={styles.hbButton}
          >
            {this.props.firstName} {this.props.lastName}
          </a>

          {console.log("showAdmin? ", this.state.showAdmin)}
          <a
            href="/admin/order-ingredients"
            style={{
              display: this.state.showAdmin,
            }}
            className={styles.hbButton}
          >
            Admin
          </a>

          <a
            href="/home"
            style={{
              display: this.state.showLogout,
            }}
            className={styles.hbButton}
            onClick={this.props.LogoutFunction}
            aria-label="Click here to log out"
            title="Click here to log out"
          >
            Logout
          </a>

          <a
            style={{
              display: this.state.showSigninSignup,
              cursor: "pointer",
            }}
            className={styles.hbButton}
            onClick={this.showPopLogin}
            aria-label="Click here to log in"
            title="Click here to log in"
          >
            Sign In
          </a>

          <a
            style={{
              display: this.state.showSigninSignup,
              cursor: "pointer",
            }}
            className={styles.hbButton}
            onClick={this.showPopSignup}
            aria-label="Click here to sign up"
            title="Click here to sign up"
          >
            Sign up
          </a>
        </div>

        {this.state.showMealPlanModal && this.props.login && (
          <div
            style={{
              height: "100%",
              width: "100%",
              zIndex: "101",
              left: "0",
              top: "0",
              overflow: "auto",
              position: "fixed",
              display: "grid",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <div
              style={{
                position: "relative",
                justifySelf: "center",
                alignSelf: "center",
                display: "block",
                border: "#ff6505 solid",
                backgroundColor: "#FEF7E0",
                zIndex: "102",
                borderRadius: "20px",
              }}
            >
              <div className={styles.modalCloseBtnContainer}>
                <ModalCloseBtn
                  style={{ cursor: "pointer" }}
                  onClick={this.toggleMealPlanModal}
                />
              </div>
              <div
                style={{
                  border: "none",
                  fontWeight: "bold",
                  padding: "15px",
                }}
              >
                <Modal.Title>
                  You do not have any active meal plans{" "}
                </Modal.Title>
              </div>
              <Modal.Footer
                style={{
                  border: "none",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <button
                  className={styles.modalBtn}
                  style={{ width: "200px" }}
                  onClick={() => {
                    // this.toggleMealPlanModal();
                    window.location.href = "/choose-plan";
                  }}
                >
                  Add a subscription
                </button>
                <button
                  className={styles.modalBtn}
                  style={{ width: "200px" }}
                  onClick={this.toggleMealPlanModal}
                >
                  Cancel
                </button>
              </Modal.Footer>
            </div>
          </div>
        )}
        {this.state.showMealPlanModal && !this.props.login && (
          <div
            style={{
              height: "100%",
              width: "100%",
              zIndex: "101",
              left: "0",
              top: "0",
              overflow: "auto",
              position: "fixed",
              display: "grid",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <div
              style={{
                position: "relative",
                justifySelf: "center",
                alignSelf: "center",
                display: "block",
                border: "#ff6505 solid",
                backgroundColor: "#FEF7E0",
                zIndex: "102",
                borderRadius: "20px",
              }}
            >
              <div className={styles.modalCloseBtnContainer}>
                <ModalCloseBtn
                  style={{ cursor: "pointer" }}
                  onClick={this.toggleMealPlanModal}
                />
              </div>
              <div
                style={{
                  border: "none",
                  fontWeight: "bold",
                  padding: "15px",
                }}
              >
                <Modal.Title>
                  You must login before accessing this page.
                </Modal.Title>
              </div>
              <Modal.Footer
                style={{
                  border: "none",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <button
                  className={styles.modalBtn}
                  style={{ width: "150px" }}
                  onClick={this.showPopLogin}
                >
                  Login
                </button>
                <button
                  className={styles.modalBtn}
                  style={{ width: "150px" }}
                  onClick={this.showPopSignup}
                >
                  Sign Up
                </button>
              </Modal.Footer>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MenuList;

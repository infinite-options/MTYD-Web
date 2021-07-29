import { /*React,*/ Component } from "react";
import axios from "axios";
import { API_URL } from "../../reducers/constants";
// import { Link } from "react-router-dom";
import forkClose from "../../images/forkClose.png";
import styles from "../NavBar/navBar.module.css";

export class MenuList extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
    // crossFork :
    // {
    //   width:'44px',
    //   height:'44px',
    //   position:'absolute',
    //   right:'100px',
    //   top:'25px',
    //   backgroundImage:`url(${forkClose})`,
    //   backgroundSize:'cover',
    //   backgroundPosition:'center',
    // },
    showLogout: "none",
    showName: "none",
    showAdmin: "none",
    showSigninSignup: "none",
    heightOfBlock: "330px",
    mealPlans: false,
  };

  componentDidMount() {
    this.checkMealPlans();
    console.log("menu props: ", this.props);
    window.addEventListener("resize", this.updateDimensions);
    if (window.innerWidth <= 900) {
      // this.setState({
      //   crossFork:{
      //     width:'44px',
      //     height:'44px',
      //     position:'absolute',
      //     left:'50px',
      //     top:'25px',
      //     backgroundImage:`url(${forkClose})`,
      //     backgroundSize:'cover',
      //     backgroundPosition:'center',
      //   }
      // })

      if (this.props.login == true && this.props.isAdmin) {
        console.log("(mount) 1");
        this.setState({
          showLogout: "flex",
          showAdmin: "flex",
          showSigninSignup: "none",
          heightOfBlock: "430px",
        });
      } else if (this.props.login == true && !this.props.isAdmin) {
        console.log("(mount) 2");
        this.setState({
          showLogout: "flex",
          showAdmin: "none",
          showSigninSignup: "none",
          heightOfBlock: "400px",
        });
      } else {
        console.log("(mount) 3");
        this.setState({
          showLogout: "none",
          showAdmin: "none",
          showSigninSignup: "flex",
          heightOfBlock: "400px",
        });
      }

      // }else{
      //   this.setState({
      //     crossFork:{
      //       width:'44px',
      //       height:'44px',
      //       position:'absolute',
      //       right:'100px',
      //       top:'25px',
      //       backgroundImage:`url(${forkClose})`,
      //       backgroundSize:'cover',
      //       backgroundPosition:'center',
      //     }
      //   })
      //   if (this.props.isAdmin) {
      //     this.setState({
      //       heightOfBlock: '360px'
      //     });
      //   }
      // }
    } else if (this.props.isAdmin) {
      console.log("cp");
      this.setState({
        heightOfBlock: "330px",
        // showAdmin: 'flex'
      });
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    if (window.innerWidth <= 900) {
      // this.setState({
      //   crossFork:{
      //     width:'44px',
      //     height:'44px',
      //     position:'absolute',
      //     left:'50px',
      //     top:'25px',
      //     backgroundImage:`url(${forkClose})`,
      //     backgroundSize:'cover',
      //     backgroundPosition:'center',
      //   }
      // })

      if (this.props.login == true && this.props.isAdmin) {
        console.log("(UD) 1");
        this.setState({
          showLogout: "flex",
          showAdmin: "flex",
          showSigninSignup: "none",
          heightOfBlock: "430px",
        });
      } else if (this.props.login == true && !this.props.isAdmin) {
        console.log("(UD) 2");
        this.setState({
          showLogout: "flex",
          showAdmin: "none",
          showSigninSignup: "none",
          heightOfBlock: "400px",
        });
      } else {
        console.log("(UD) 3");
        this.setState({
          showLogout: "none",
          showAdmin: "none",
          showSigninSignup: "flex",
          heightOfBlock: "400px",
        });
      }
    } else {
      /*if (this.props.isAdmin) {
        console.log("narrow 1");
        this.setState({
          // crossFork:{
          //   width:'44px',
          //   height:'44px',
          //   position:'absolute',
          //   right:'100px',
          //   top:'25px',
          //   backgroundImage:`url(${forkClose})`,
          //   backgroundSize:'cover',
          //   backgroundPosition:'center',
          // },
          showLogout: 'none',
          showAdmin: 'flex',
          showSigninSignup: 'none',
          heightOfBlock: '360px'
        })
      } else {
        console.log("narrow 2");
        this.setState({
          // crossFork:{
          //   width:'44px',
          //   height:'44px',
          //   position:'absolute',
          //   right:'100px',
          //   top:'25px',
          //   backgroundImage:`url(${forkClose})`,
          //   backgroundSize:'cover',
          //   backgroundPosition:'center',
          // },
          showLogout: 'none',
          showAdmin: 'none',
          showSigninSignup: 'none',
          heightOfBlock: '330px'
        })
      }*/
      console.log("narrow new");
      this.setState({
        // crossFork:{
        //   width:'44px',
        //   height:'44px',
        //   position:'absolute',
        //   right:'100px',
        //   top:'25px',
        //   backgroundImage:`url(${forkClose})`,
        //   backgroundSize:'cover',
        //   backgroundPosition:'center',
        // },
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

  checkMealPlans = () => {
    if (
      document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("customer_uid="))
    ) {
      const customer_uid = document.cookie
        .split("; ")
        .find((item) => item.startsWith("customer_uid="))
        .split("=")[1];

      // refactor to use axios
      axios
        .get(`${API_URL}customer_lplp`, {
          params: {
            customer_uid: customer_uid,
          },
        })
        .then((res) => {
          const subscriptions = res.data.result;
          if (subscriptions) {
            this.setState({
              ...this.state,
              mealPlans: true,
            });
          } else {
            this.setState({
              ...this.state,
              mealPlans: false,
            });
          }
        });
      // fetch(`${API_URL}customer_lplp?customer_uid=${customer_uid}`)
      //   .then((response) => response.json())
      //   .then((json) => {
      //     let meals = [...json.result];
      //     if (meals.length == 0) {
      //       console.log("no meal plan");
      //     } else {
      //       console.log("has meal plan");
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
    }
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
            href={this.state.mealPlans ? "/meal-plan" : ""}
            className={styles.hbButton}
            aria-label="Click here to change your meal plan"
            title="Click here to change your meal plan"
            onClick={() => {
              if (!this.state.mealPlans) {
                alert("No Meal Plans Exist");
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
            href="/subscription-history"
            className={styles.hbButton}
            aria-label="Click here to view your subscriptions"
            title="Click here to view your subscriptions"
          >
            Subscription History
          </a>

          <a
            href="/ambassador"
            className={styles.hbButton}
            aria-label="Click here to become an ambassador"
            title="Click here to become an ambassador"
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
      </div>
    );
  }
}

export default MenuList;

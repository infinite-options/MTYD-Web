import { Component } from "react";
import { WebNavBar } from "../NavBar";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "../../reducers/constants";
import styles from "../Home/home.module.css";
import PopLogin from "../PopLogin";
import Popsignup from "../PopSignup";
import path28_top from "../../images/Path 28_top.png";
import path28_bottom from "../../images/Path 28.png";
import createAnAccountImage from "../../images/Group 234.png";
import pathFromCAAToSYM from "../../images/Path 49.png";
import pathFromRYMToHAE from "../../images/Path 29.png";
import selectYourMealImage from "../../images/Group 114_SYM.png";
import { HomeLink, FootLink, CreateAccPWSU1 } from "../Home/homeButtons";
import { Link } from "react-router-dom";

export class Congrats extends Component {
  constructor(props) {
    super();
    this.state = {
      user_id: "",
      user_address: "",
      login_seen: false,
      signUpSeen: false,
      seen: false,
    };
  }
  togglePop = () => {
    this.setState({
      seen: !this.state.seen,
    });
  };
  togglePopLogin = () => {
    this.setState({
      login_seen: !this.state.login_seen,
    });

    if (!this.state.login_seen) {
      this.setState({
        signUpSeen: false,
      });
    }
  };

  togglePopSignup = () => {
    this.setState({
      signUpSeen: !this.state.signUpSeen,
    });

    if (!this.state.signUpSeen) {
      this.setState({
        login_seen: false,
      });
    }
  };

  // componentDidUpdate() {
  //   console.log("(mount) props: ", this.props);
  //   if(this.props.location.hasOwnProperty('delivery_date') === false){
  //     console.log("(mount) delivery_date false");
  //     this.props.history.push('/choose-plan');
  //   } else {
  //     console.log("(mount) delivery_date true");
  //   }
  // }

  componentDidMount() {
    console.log("(mount) props: ", this.props);
    if(this.props.location.hasOwnProperty('delivery_date') === false){
      console.log("(mount) delivery_date false");
      this.props.history.push('/choose-plan');
    } else {
      console.log("(mount) delivery_date true");
    }
    const customer_uid = Cookies.get("customer_uid");
    console.log(Cookies.get("customer_uid"));
    if (customer_uid) {
      this.setState({ user_id: customer_uid });
      axios
        .get(`${API_URL}Profile/${customer_uid}`)
        .then((response) => {
          const addr = response.data.result[0].customer_address.toLowerCase();
          this.setState({ user_address: addr });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    } else {
      this.setState({ user_id: "not login" });
      this.setState({ user_address: "not login yet" });
      /*Use the following for setting the user */
      /*this.setState({user_id:'anup'});
	this.setState({user_address: '214 Main Ave, San Jose, CA 91101'});*/
    }
  }

  formatDate = (rawDate) => {
    console.log("(congrats) rawDate: ", rawDate);

    console.log("(formatDate) props: ", this.props);
    if(this.props.location.hasOwnProperty('delivery_date') === false){
      console.log("(formatDate) delivery_date false");
      this.props.history.push('/choose-plan');
    } else {
      console.log("(formatDate) delivery_date true");

      let dateElements = rawDate.split(" ");
      let yyyy_mm_dd = dateElements[0].split("-");
      let month;

      // Parse month
      switch (yyyy_mm_dd[1]) {
        case "01":
          month = "January";
          break;
        case "02":
          month = "February";
          break;
        case "03":
          month = "March";
          break;
        case "04":
          month = "April";
          break;
        case "05":
          month = "May";
          break;
        case "06":
          month = "June";
          break;
        case "07":
          month = "July";
          break;
        case "08":
          month = "August";
          break;
        case "09":
          month = "September";
          break;
        case "10":
          month = "October";
          break;
        case "11":
          month = "November";
          break;
        case "12":
          month = "December";
          break;
        default:
          month = "";
      }

      let dateString = month + " " + yyyy_mm_dd[2];
      // console.log("date string: ", dateString);

      return dateString;
    }
  };

  render() {
    console.log("(render) props: ", this.props);
    return (
      <div
        style={{
          // display: "flex",
          // flexDirection: "column",
          // justifyContent: "space-between",
          minHeight: "100vh",
          position: 'relative',
          // border: '1px solid red'
        }}
      >
        <WebNavBar
          poplogin={this.togglePopLogin}
          popSignup={this.togglePopSignup}
        />

        {this.state.login_seen ? (
          <PopLogin toggle={this.togglePopLogin} toggle_signup={this.togglePopSignup}/>
        ) : null}
        {this.state.signUpSeen ? (
          <Popsignup toggle={this.togglePopSignup} />
        ) : null}

        {/* <div className={styles.howDoesContainer} style={{ marginTop: "50px" }}>
          <div className={styles.howDoesText} style={{ marginTop: "0px" }}>
            <p
              style={{ marginLeft: "-90px", display: "inline", color: "black" }}
              // style={{ marginLeft: "8%", display: "inline", color: "black" }}
            >
              Congratulations
            </p>
          </div>
        </div> */}
        <div
          style={{
            backgroundColor: '#ffba00',
            width: '100%',
            height: '60px',
            fontWeight: 'bold',
            paddingLeft: '8%',
            // paddingTop: '12px',
            display: 'flex',
            alignItems: 'center',
            marginTop: '30px',
            fontSize: '25px',
            // marginLeft: '8%',
            // marginBottom: '30px',
            // border: '1px solid lime'
          }}
        >
          Congratulations!
        </div>

        <div
          className={styles.congratsBody}
          // style={{
          //   border: '1px inset',
          //   position: 'relative',
          //   marginTop: '30px'
          // }}
        >

          {/*Change the following to medium later on, using bold for testing*/}
          <div
            className={styles.congratsLeft}
          >
            {/* <p
              style={{
                font: "SF Pro",
                fontWeight: "medium",
                fontSize: "24px",
                color: "black",
                textAlign: "left",
              }}
            >
              Your first delivery will arrive on:
            </p>
            <p
              style={{
                marginTop: "-20px",
                marginLeft: "40px",
                font: "SF Pro",
                fontWeight: "bold",
                fontSize: "24px",
                color: "black",
                textAlign: "left",
              }}
            >
              {this.formatDate(this.props.location.delivery_date)} between 4-6pm
            </p> */}
            <span
              style={{
                font: "SF Pro",
                fontWeight: "medium",
                fontSize: "24px",
                color: "black",
                textAlign: "left",
              }}
            >
              Your first delivery will arrive on:
            </span>
            <br />
            <span
              style={{
                marginTop: "-20px",
                // marginLeft: "40px",
                font: "SF Pro",
                fontWeight: "bold",
                fontSize: "24px",
                color: "black",
                textAlign: "left",
              }}
            >
              {this.formatDate(this.props.location.delivery_date)} between 4-6pm
            </span>

            <br />
            <br />
            <span
              style={{
                marginTop: "-20px",
                // marginLeft: "40px",
                font: "SF Pro",
                // fontWeight: "bold",
                fontSize: "24px",
                color: "black",
                textAlign: "left",
              }}
            >
              To your address:
            </span>

            {/*Change the following to medium later on, using bold for testing*/}
            <br />

            {/* <p
              style={{
                marginLeft: "80px",
                font: "SF Pro",
                fontWeight: "medium",
                fontSize: "24px",
              }}
            >
              To your address:
              <br />
            </p> */}
            {/* <br /> */}
            {/* <span
              style={{
                // marginLeft: "80px",
                marginLeft: '8%',
                marginTop: "-20px",
                font: "SF Pro",
                fontWeight: "medium",
                fontSize: "24px",
                textAlign: "left",
                border: '1px dashed'
              }}
            >
              To your address:
            </span> */}
            {/* <br /> */}

            {/* <p
              style={{
                marginTop: "-10px",
                font: "SF Pro",
                fontWeight: "bold",
                fontSize: "24px",
                color: "black",
                marginLeft: "80px",
              }}
            >
              {this.props.location.delivery_address + ", "}
              <br />
              {this.props.location.delivery_city +
                ", " +
                this.props.location.delivery_state +
                ", " +
                this.props.location.delivery_zip}
            </p> */}
            <span
              style={{
                marginTop: "-10px",
                font: "SF Pro",
                fontWeight: "bold",
                fontSize: "24px",
                color: "black",
                // marginLeft: "80px",
              }}
            >
              {this.props.location.delivery_address + ", "}
              <br />
              {this.props.location.delivery_city +
                ", " +
                this.props.location.delivery_state +
                ", " +
                this.props.location.delivery_zip}
            </span>
          </div>

          {(() => {
            if (this.state.user_id !== "not login") {
              return (
                <div className={styles.congratsRightWrapper}>
                  <div className={styles.congratsRight}>
                    <div
                      className={styles.whatsNext}
                      // style={{
                      //   font: "SF Pro",
                      //   fontWeight: "bold",
                      //   fontSize: "25px",
                      //   color: "black",
                      //   // border: '1px solid green',
                      //   width: '100%',
                      //   display: 'flex',
                      //   justifyContent: 'center'
                      // }}
                    >
                      {/* {" "} */}
                      What's next?
                    </div>
                    <div 
                      style={{ 
                        textAlign: "center",
                        position: 'relative',
                        border: '1px solid white',
                        height: '300px',
                        // zIndex: '0'
                      }}
                    >
                      <div className={styles.selectMealsWrapper}>
                        <Link to={"/select-meal"} style={{ textDecoration: "none" }}>
                          <button
                            className={styles.selectMealsBtn}
                          >
                            Select Your Meals
                          </button>
                        </Link>
                      </div>

                      <div className={styles.path1}/>

                      {/* <br /> */}

                      <div className={styles.rym}>
                        Receive your
                        meals
                      </div>
                      
                      <div className={styles.hae}>
                        Heat and
                        enjoy!
                      </div>
                      
                      <div className={styles.path2} />
                      
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  className={styles.congratsRightWrapper2}
                >
                  <div
                    className={styles.congratsRight2}
                  >
                    <div className={styles.whatsNext2}>
                      {/* {" "} */}
                      What's next?
                    </div>

                    <div 
                      style={{ 
                        textAlign: "center",
                        // border: '1px solid blue',
                        // height: '600px'
                      }}
                    >

                      <div 
                        className={styles.path4}
                      />

                      <br />

                      <div
                        className={styles.createAccBtn}
                      >
                        Create an Account Password
                      </div>

                      {this.state.seen ? (
                        <CreateAccPWSU1 toggle={this.togglePop} />
                      ) : null}

                      <div 
                        className={styles.path5}
                      />

                      <div className={styles.selectMealsWrapper2}>
                        <Link to={"/select-meal"} style={{ textDecoration: "none" }}>
                          <button
                            className={styles.selectMealsBtn2}
                          >
                            Select Your Meals
                          </button>
                        </Link>
                      </div>

                      <div 
                        className={styles.path6}
                        // style={{
                        //   right: '100px',
                        //   top: '333px',
                        //   // border: '1px dashed'
                        // }}
                      />

                      <br />

                      <div className={styles.rym2}>
                        Receive your meals
                      </div>

                      <div 
                        className={styles.path7}
                        // style={{
                        //   // border: '1px solid cyan',
                        //   left: '150px',
                        //   top: '502px'
                        // }}
                      />

                      <div className={styles.hae2}>
                        Heat and enjoy!
                      </div>

                    </div>

                  </div>
                </div>
              );
            }
          })()}

        </div>
        
        <div 
          style={{ 
            width: "100vw",
            // position: 'absolute',
            bottom: '0px'
          }}
        >
          <FootLink />
        </div>

      </div>
    );
  }
}

export default Congrats;

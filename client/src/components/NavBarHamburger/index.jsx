import { Component } from "react";
import Menu from "./menu";
import hamburger from "../../images/hamburger.png";
import BecomeAmbass from "../BecomeAmbass";

export class NavMenu extends Component {
  state = {
    popSeen: false,
    width: window.innerWidth,
    height: window.innerHeight,
    showAmbass: false,
  };

  togglePopMenu = () => {
    this.setState({
      popSeen: !this.state.popSeen,
    });
  };

  componentDidMount() {
    console.log("navbar hamburgermenu props: ", this.props);
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  toggleAmbass = () => {
    this.setState({
      showAmbass: !this.state.showAmbass,
    });
  };

  render() {
    return (
      <div style={{ width: "40%" }}>
        <div>
          {/* <span>Window size: {this.state.width} x {this.state.height}</span> */}
          <div
            style={{
              // position:"absolute",
              width: "60px",
              height: "40px",
              marginLeft: "30px",
              // left:"60px",
              // top:"20px",
              backgroundImage: `url(${hamburger})`,
              backgroundSize: "cover",
              // border: 'solid',
              cursor: "pointer",
            }}
            // className={styles.hamMenu}
            onClick={this.togglePopMenu}
            tabIndex="0"
            aria-label="Click here to open navigation menu"
            title="Click here to open navigation menu"
          ></div>
          {this.state.popSeen ? (
            <Menu
              close={this.togglePopMenu}
              login={this.props.login}
              LogoutFunction={this.props.LogoutFunction}
              togglePopSignup={this.props.togglePopSignup}
              togglePopLogin={this.props.togglePopLogin}
              firstName={this.props.firstName}
              lastName={this.props.lastName}
              isAdmin={this.props.isAdmin}
              hasMealPlan={this.props.hasMealPlan}
              toggleAmbass={this.toggleAmbass}
            />
          ) : null}
          {this.state.showAmbass ? (
            <div
              style={{
                // border: 'dashed',
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                maxWidth: "100%",
                maxHeight: "100%",
                backgroundColor: "rgb(255,255,255,0.5)",
                zIndex: "50",
                // display: 'flex',
                // justifyContent: 'center'
                // backgroundColor: 'white',
                // opacity: '0.5'
              }}
            >
              <BecomeAmbass toggle={this.toggleAmbass} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default NavMenu;

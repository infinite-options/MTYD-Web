import { Component } from "react";
import Menu from "./menu";
import hamburger from "../../images/hamburger.png";

export class NavMenu extends Component {
  state = {
    popSeen: false,
    width: window.innerWidth,
    height: window.innerHeight,
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
          {console.log("L: " + this.props.login)}
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
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default NavMenu;

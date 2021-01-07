import React from "react";
import {WebNavBar} from "../NavBar";
import Menu from "../Menu";
const WeeklyMenu = () => {
  return (
    <>
      <WebNavBar />
      <Menu show={false} />
      <div>
        <h1>Menu items will fill this page later</h1>
      </div>
    </>
  );
};

export default WeeklyMenu;

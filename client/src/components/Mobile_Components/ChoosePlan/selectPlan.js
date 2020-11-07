import React from "react";

class SelectPlan extends React.Component {
  render() {
    return (
      <div className='mealMain'>
        <div className='meal-header'>
          <i class='fa fa-bars headericon'></i>
          <i class='fas fa-bell headericon'></i>
          <i class='fa fa-share-alt headericon'></i>
          <i class='fa fa-search headericon'></i>
        </div>
        <div className='title'>
          <p id='chooseYourPlan'>CHOOSE YOUR PLAN</p>
          <p id='local'>LOCAL. ORGANIC. RESPONSIBLE.</p>
        </div>
        <div className='mealselectmenu'>
          <div id='mealdays'>MEALS DELIVERIES ARE MONDAY,WEDNESDAY,FRIDAY</div>
          <p className='internal-titles'>NUMBER OF MEALS PER DELIVERY</p>
          <div className='meal-number'>
            <div className='button-wrapper'>
              <button className='meal-button'>2 MEALS</button>
              <button className='meal-button'>4 MEALS</button>
              <button className='meal-button'>6 MEALS</button>
              <button className='meal-button'>8 MEALS</button>
            </div>
          </div>

          <p className='internal-titles'>PAYMENT FREQUENCY</p>
          <div className='payment-wrapper'>
            <button className='payment-button'>1</button>
            <button className='payment-button'>2</button>
            <button className='payment-button'>3</button>
          </div>
          <div className='flexclass'>
            <p id='totalamount'>$$ TOTAL</p>
            <p id='done-button'>DONE</p>
          </div>
        </div>

        <div className='meal-footer'>
          <div className='footer-icon-tray'>
            <i class='fa fa-heart'></i>
            <p>Favorites</p>
          </div>
          <div className='footer-icon-tray'>
            <i class='fa fa-search'></i>
            <p>Search</p>
          </div>
          <div className='footer-icon-tray'>
            <i class='fas fa-exclamation-circle '></i>
            <p>Information</p>
          </div>
          <div className='footer-icon-tray'>
            <i class='fas fa-bell'></i>
            <p>Notifications</p>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectPlan;

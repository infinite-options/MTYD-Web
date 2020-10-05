import React, { Component } from "react";
import MenuItem from "./menuItem";
import axios from "axios";
import Header from "./header";
import Cookies from "js-cookie";
import { API_URL } from "../../reducers/constants";

export class MenuItemList extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      myDate: "",
      cartItems: [],
      meals: [],
      totalCount: 0,
      selectValue: "Surprise",
      saveButton: false,
    };
  }

  componentDidMount() {
    this.loadMenuItems();
    this.loadMeals();
    this.selectedMeals();
  }

  loadMenuItems = () => {
    fetch(
      `https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/upcoming_menu`
    )
      .then((response) => response.json())
      .then((json) => {
        let menuData = [...json.result];
        let myStr = menuData[0].delivery_days;
        let temp = myStr.replace(/[^a-zA-Z ]/g, "").split(" ");
        console.log(temp);
        this.setState({
          deliveryDay: temp[0],
          data: menuData,
          myDate: menuData[0].menu_date,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  selectedMeals = () => {
    let cust_id = Cookies.get("customer_uid");
    fetch(
      `https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals_selected?customer_uid=${cust_id}`
    )
      .then((response) => response.json())
      .then((json) => {
        let mealSelected = [...json.result];
        this.setState({
          mealSelected,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  filterDates = (event) => {
    let cust_id = Cookies.get("customer_uid");
    fetch(
      `https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals_selected?customer_uid=${cust_id}`
    )
      .then((response) => response.json())
      .then((json) => {
        let mealSelected = [...json.result];
        this.setState({
          deliveryDay: "Sunday",
          mealSelected,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    let cartItemsArr = [];
    let myCounter = 0;
    let pulledSelection = this.state.mealSelected.filter(
      (item) =>
        item.sel_purchase_id === this.state.purchaseID &&
        item.sel_menu_date === event.target.value
    );
    if (pulledSelection.length > 0) {
      let selection = JSON.parse(pulledSelection[0].meal_selection);
      selection.map((myItem) => {
        let required_Id = myItem.item_uid;
        let menuItemCur = this.state.data.filter(
          (dateCheck) =>
            dateCheck.menu_date === event.target.value &&
            dateCheck.meal_uid === required_Id
        );
        let spreadObj = { ...menuItemCur };
        let pushingObj = {
          count: myItem.qty,
          ...spreadObj[0],
        };
        if (myItem.name !== "SKIP" && myItem.name !== "SURPRISE") {
          cartItemsArr.push(pushingObj);
          myCounter = myCounter + myItem.qty;
        }
      });
    }

    return this.setState({
      myDate: event.target.value,
      cartItems: [...cartItemsArr],
      totalCount: myCounter,
    });
  };

  addToCart = (menuitem) => {
    const cartItems = this.state.cartItems.slice();
    let alreadyInCart = false;
    if (this.state.totalCount < this.state.totalMeals) {
      cartItems.forEach((item) => {
        if (item.menu_uid === menuitem.menu_uid) {
          item.count++;
          alreadyInCart = true;
        }
      });
      if (!alreadyInCart) {
        cartItems.push({ ...menuitem, count: 1 });
      }

      this.setState({ cartItems, totalCount: this.state.totalCount + 1 });
    }
  };

  removeFromCart = (menuitem) => {
    const cartItems = this.state.cartItems.slice();
    // let alreadyInCart_1 = false;
    cartItems.forEach((item) => {
      if (this.state.totalCount > 0) {
        if (item.menu_uid === menuitem.menu_uid) {
          if (item.count !== 0) {
            // alreadyInCart_1 = true;
            item.count--;
          }
          this.setState({ cartItems, totalCount: this.state.totalCount - 1 });
        }
      }
    });
    cartItems.forEach((meal) => {
      if (
        meal.menu_uid === menuitem.menu_uid &&
        meal.count === 0 &&
        this.state.totalCount > 0
      ) {
        this.setState({
          cartItems: cartItems.filter((x) => x.menu_uid !== menuitem.menu_uid),
          totalCount: this.state.totalCount - 1,
        });
      }
    });
  };

  makeSelection = (e) => {
    this.setState({
      selectValue: e.target.value,
    });
    if (e.target.value === "Surprise") {
      if (this.state.myDate !== "") {
        const supriseData = [
          {
            qty: "",
            name: "SURPRISE",
            price: "",
            item_uid: "",
          },
        ];
        const data1 = {
          is_addon: false,
          items: supriseData,
          purchase_id: this.state.purchaseID,
          menu_date: this.state.myDate,
          delivery_day: this.state.deliveryDay,
        };

        axios
          .post(
            "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals_selection",
            data1
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
        return this.setState({
          totalCount: 0,
          cartItems: [],
        });
      }
    } else if (e.target.value === "Skip") {
      const skipData = [
        {
          qty: "",
          name: "SKIP",
          price: "",
          item_uid: "",
        },
      ];
      const data2 = {
        is_addon: false,
        items: skipData,
        purchase_id: this.state.purchaseID,
        menu_date: this.state.myDate,
        delivery_day: this.state.deliveryDay,
      };
      axios
        .post(
          "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals_selection",
          data2
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      return this.setState({
        totalCount: 0,
        cartItems: [],
      });
    } else {
      const myarr = [];
      this.state.cartItems.map((meal) => {
        myarr.push({
          qty: meal.count,
          name: meal.meal_name,
          price: meal.meal_price,
          item_uid: meal.meal_uid,
        });
        return meal;
      });

      const data = {
        is_addon: false,
        items: myarr,
        purchase_id: this.state.purchaseID,
        menu_date: this.state.myDate,
        delivery_day: this.state.deliveryDay,
      };
      axios
        .post(
          "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals_selection",
          data
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  loadMeals() {
    const customer_uid = Cookies.get("customer_uid");
    fetch(API_URL + `customer_lplp?customer_uid=${customer_uid}`)
      .then((response) => response.json())
      .then((json) => {
        let meals = [...json.result];
        this.setState({
          meals: meals,
          purchaseID: meals[0].purchase_id,
          totalMeals: parseInt(meals[0].items.substr(23, 2)),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  mealsOnChange = (e) => {
    let cust_id = Cookies.get("customer_uid");
    fetch(
      `https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals_selected?customer_uid=${cust_id}`
    )
      .then((response) => response.json())
      .then((json) => {
        let mealSelected = [...json.result];
        this.setState({
          mealSelected,
        });
      })
      .catch((error) => {
        console.error(error);
      });

    let planName = e.target.value;
    this.state.meals.map((mealItem) => {
      if (mealItem.purchase_id === planName) {
        let meal = JSON.parse(mealItem.items)[0];
        let mystr = meal.name.toString().slice(0, 2).replace(/\s/g, "");
        this.setState({
          totalMeals: mystr,
          purchaseID: mealItem.purchase_id,
          saveButton: true,
        });
      } else {
        return this.setState({ selectValue: "Surprise" });
      }
    });
    let cartItemsArr = [];
    let delivery_Day = "";
    let myCounter = 0;
    let pulledSelection = this.state.mealSelected.filter(
      (item) =>
        item.sel_purchase_id === planName &&
        item.sel_menu_date === this.state.myDate
    );

    if (pulledSelection.length > 0) {
      let selection = JSON.parse(pulledSelection[0].meal_selection);
      delivery_Day = pulledSelection[0].delivery_day;
      selection.map((myItem) => {
        let required_Id = myItem.item_uid;
        let menuItemCur = this.state.data.filter(
          (dateCheck) =>
            dateCheck.menu_date === this.state.myDate &&
            dateCheck.meal_uid === required_Id
        );

        let spreadObj = { ...menuItemCur };
        let pushingObj = {
          count: myItem.qty,
          ...spreadObj[0],
        };

        if (myItem.name !== "SKIP" && myItem.name !== "SURPRISE") {
          cartItemsArr.push(pushingObj);
          myCounter = myCounter + myItem.qty;
          return this.setState({ selectValue: "Save" });
        } else {
          let select_val = myItem.name;
          let myoutput =
            select_val[0].toUpperCase() +
            select_val.substring(1, select_val.length).toLowerCase();

          return this.setState({ selectValue: myoutput });
        }
      });
    }

    return this.setState({
      deliveryDay: delivery_Day !== "" ? delivery_Day : "Sunday",
      cartItems: [...cartItemsArr],
      totalCount: myCounter,
      displayCount: "block",
    });
  };

  setDeliveryDay = (e) => {
    let deliver = e.target.value;
    const myarr = [];
    if (this.state.totalMeals == this.state.totalCount) {
      this.state.cartItems.map((meal) => {
        myarr.push({
          qty: meal.count,
          name: meal.meal_name,
          price: meal.meal_price,
          item_uid: meal.meal_uid,
        });
        console.log(meal.meal_name);
        return meal;
      });
      const data2 = {
        is_addon: false,
        items: myarr,
        purchase_id: this.state.purchaseID,
        menu_date: this.state.myDate,
        delivery_day: deliver,
      };

      axios
        .post(
          "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals_selection",
          data2
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      return this.setState({
        deliveryDay: deliver,
        selectValue: "Save",
      });
    } else if (this.state.selectValue === "Surprise") {
      if (this.state.myDate !== "") {
        const supriseData = [
          {
            qty: "",
            name: "SURPRISE",
            price: "",
            item_uid: "",
          },
        ];
        const data1 = {
          is_addon: false,
          items: supriseData,
          purchase_id: this.state.purchaseID,
          menu_date: this.state.myDate,
          delivery_day: deliver,
        };

        axios
          .post(
            "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals_selection",
            data1
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
        return this.setState({
          deliveryDay: deliver,
          totalCount: 0,
          cartItems: [],
        });
      }
    } else {
      const skipData = [
        {
          qty: "",
          name: "SKIP",
          price: "",
          item_uid: "",
        },
      ];
      const data2 = {
        is_addon: false,
        items: skipData,
        purchase_id: this.state.purchaseID,
        menu_date: this.state.myDate,
        delivery_day: deliver,
      };
      axios
        .post(
          "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals_selection",
          data2
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      return this.setState({
        deliveryDay: deliver,
        totalCount: 0,
        cartItems: [],
      });
    }

    return this.setState({
      deliveryDay: deliver,
    });
  };

  render() {
    const dates = this.state.data.map((date) => date.menu_date);
    const uniqueDates = Array.from(new Set(dates));

    return (
      <div className='mealMenuWrapper'>
        <Header
          data={this.state.data}
          dates={uniqueDates}
          filterDates={this.filterDates}
          meals={this.state.meals}
          mealsOnChange={this.mealsOnChange}
          totalCount={this.state.totalCount}
          totalMeals={this.state.totalMeals}
          displayCount={this.state.displayCount}
          myDate={this.state.myDate}
          setDeliveryDay={this.setDeliveryDay}
          saveMeal={this.saveMeal}
          surprise={this.surprise}
          skip={this.skip}
          deliveryDay={this.state.deliveryDay}
          makeSelection={this.makeSelection}
          selectValue={this.state.selectValue}
          saveButton={this.state.saveButton}
          purchaseID={this.state.purchaseID}
          mealSelected={this.state.mealSelected}
        />

        <div className='menu-items-wrapper'>
          <MenuItem
            addToCart={this.addToCart}
            removeFromCart={this.removeFromCart}
            data={this.state.data}
            myDate={this.state.myDate}
            cartItems={this.state.cartItems}
            mealSelected={this.state.mealSelected}
            purchaseID={this.state.purchaseID}
          />
        </div>
      </div>
    );
  }
}

export default MenuItemList;

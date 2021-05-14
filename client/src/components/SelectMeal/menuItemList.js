import React, {Component} from "react";
import MenuItem from "./menuItem";
import axios from "axios";
import Header from "./header";
import Cookies from "js-cookie";
import {API_URL} from "../../reducers/constants";
import styles from "./selectmeal.module.css";
import MenuBar from "../Menu";
import moment from 'moment';

import {connect} from "react-redux";
import {
  fetchSubscribed,
  fetchProfileInformation
} from "../../reducers/actions/subscriptionActions";
import Burgermenu from "./example";
import { SelectMealGuestPop } from "../SelectMealGuestPop/SelectMealGuestPop";
import Congrats from "../Congrats";
import { red } from "@material-ui/core/colors";

class MenuItemList extends Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      cartItems: [],
      addOnItems: [],
      addOnAmount: 0,
      meals: [],
      totalCount: 0,
      selectValue: "SURPRISE",
      saveButton: false,
      popUp: styles.popUpHide,
      popUpDisplay: false,
      popUpText: 'Hello',
      dateButtonList:[],
      surpriseSkipSave : [],
      unloginPopupShow:false,
      unloginPopupMessage:'',
      currentSelectedDate:'',

    };
  }

  toggleDisplay = (option) => {
    if(this.state.popUpDisplay === false) {
       this.setState({
           popUp: styles.popUpShow,
           popUpDisplay: true,
       })
    }else{
       this.setState({
           popUp: styles.popUpHide,
           popUpDisplay: false,
       })
    }
    if(option === "SAVE") {
      let popUpText = 'You have saved your meals for this week. '
      if (this.state.addOnAmount > 0) {
        popUpText = popUpText.concat('You will be charged for ' + this.state.addOnAmount + ' Add On items at a later date')
      }
      this.setState({
        popUpText
      })
    } else if (option === "SURPRISE") {
      let popUpText = 'You will be delivered ' + this.state.totalMeals + ' random meals this week.'
      this.setState({
        popUpText
      })
    } else if (option === "SKIP") {
      let popUpText = 'You will not be delivered meals for this week'
      this.setState({
        popUpText
      })
    }
}

  async componentDidMount() {
    this.loadMealPlans();
    this.loadMenuItems();
    const customer_uid = Cookies.get("customer_uid");
    if (customer_uid && customer_uid !== "") {
      await this.props.fetchProfileInformation(customer_uid);
      await this.props.fetchSubscribed(customer_uid);
    }
  }

  loadMealPlans = () => {
    const customer_uid = Cookies.get("customer_uid");
    fetch(`${API_URL}customer_lplp?customer_uid=${customer_uid}`)
      .then(response => response.json())
      .then(json => {
        let meals = [...json.result];
        // console.log(meals)
        this.setState({
          meals: meals,
          purchaseID: meals[0].purchase_id,
          totalMeals: parseInt(meals[0].items.substr(23, 2))
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  loadMenuItems = () => {
    fetch(
      `${API_URL}upcoming_menu`
    )
      .then(response => response.json())
      .then(json => {
        // console.log("json: " + JSON.stringify(json))
        let menuData = [...json.result];
        let myStr = menuData[0].delivery_days;
        let temp = myStr.replace(/[^a-zA-Z ]/g, "").split(" ");
        this.setState(
          {
            deliveryDay: temp[0],
            data: menuData,
            myDate: menuData[0].menu_date
          },
          () => {
            this.selectedMeals();
            
          }
        );
        this.dateButtonArray();
      })
      .catch(error => {
        console.error(error);
      });
  };

  selectedMeals = () => {
    let cust_id = Cookies.get("customer_uid");
    fetch(
      `${API_URL}meals_selected?customer_uid=${cust_id}`
    )
      .then(response => response.json())
      .then(json => {
        // console.log(json)
        let mealSelected = [...json.result];
        this.setState({
          mealSelected
        });

        let cartItemsArr = [];
        let addOnArr = [];
        let delivery_Day = "";
        let myCounter = 0;
        let addOnCount = 0;
        let pulledSelection = mealSelected.filter(
          item =>
            item.sel_purchase_id === this.state.purchaseID &&
            item.sel_menu_date === this.state.myDate
        );
        // console.log(pulledSelection)
        if (pulledSelection.length > 0) {
          let selection = JSON.parse(pulledSelection[0].meal_selection);
          let addOnSelection = JSON.parse(pulledSelection[0].addon_selection);
          // console.log(addOnSelection)
          delivery_Day = pulledSelection[0].delivery_day;
          selection.map(myItem => {
            // console.log(myItem)
            let required_Id = myItem.item_uid;
            let menuItemCur = this.state.data.filter(
              dateCheck =>
                dateCheck.menu_date === this.state.myDate &&
                dateCheck.meal_uid === required_Id
            );

            let spreadObj = {...menuItemCur};
            let pushingObj = {
              count: myItem.qty,
              ...spreadObj[0]
            };

            if (myItem.name !== "SKIP" && myItem.name !== "SURPRISE") {
              cartItemsArr.push(pushingObj);
              myCounter = myCounter + myItem.qty;
              return this.setState({selectValue: "SAVE"});
            } else {
              let select_val = myItem.name;
              let myoutput =
                select_val[0].toUpperCase() +
                select_val.substring(1, select_val.length).toUpperCase();

              return this.setState({selectValue: myoutput});
            }
          });
          
          if (addOnSelection !== null) {

            addOnSelection.map(myItem => {
              // console.log(myItem)
              let required_Id = myItem.item_uid;
              let menuItemCur = this.state.data.filter(
                dateCheck =>
                  dateCheck.menu_date === this.state.myDate &&
                  dateCheck.meal_uid === required_Id
              );
      
              let spreadObj = {...menuItemCur};
              let pushingObj = {
                count: myItem.qty,
                ...spreadObj[0]
              };
      
              if (myItem.name !== "SKIP" && myItem.name !== "SURPRISE") {
                addOnArr.push(pushingObj);
                addOnCount = addOnCount + myItem.qty;
                // return this.setState({selectValue: "SAVE"});
              // } else {
              //   let select_val = myItem.name;
              //   let myoutput =
              //     select_val[0].toUpperCase() +
              //     select_val.substring(1, select_val.length).toUpperCase();
      
              //   return this.setState({selectValue: myoutput});
              }
            });
    
          }

        }
        

        return this.setState({
          deliveryDay: delivery_Day !== "" && delivery_Day !== "SKIP" ? delivery_Day : "Sunday",
          // deliveryDay: delivery_Day !== ""  ? delivery_Day : "Sunday",
          cartItems: [...cartItemsArr],
          addOnItems: [...addOnArr],
          totalCount: myCounter,
          addOnAmount: addOnCount,
          displayCount: "block"
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  mealsOnChange = e => {
    let cust_id = Cookies.get("customer_uid");
    fetch(
      `${API_URL}meals_selected?customer_uid=${cust_id}`
    )
      .then(response => response.json())
      .then(json => {
        let mealSelected = [...json.result];

        // console.log(mealSelected)
        this.setState({
          mealSelected
        });
      })
      .catch(error => {
        console.error(error);
      });

      this.dateButtonArray();

    let planName = e.target.value;

    console.log(planName)


    this.state.meals.map(mealItem => {

      console.log(mealItem)

      if (mealItem.purchase_uid === planName) {
        let meal = JSON.parse(mealItem.items)[0];

        console.log(meal.name)

        let mystr = meal.name
          .toString()
          .slice(0, 2)
          .replace(/\s/g, "");

        
        this.setState({
          // totalMeals: mystr,
          totalMeals: parseInt(mystr),
          purchaseID: mealItem.purchase_uid,
          saveButton: true
        });
      } else {
        return this.setState({selectValue: "SURPRISE"});
      }
    });
    let cartItemsArr = [];
    let addOnArr = [];
    let delivery_Day = "";
    let myCounter = 0;
    let addOnCount = 0;
    let pulledSelection = this.state.mealSelected.filter(
      item =>
        item.sel_purchase_id === planName &&
        item.sel_menu_date === this.state.myDate
    );

    // let tempstring = JSON.parse(pulledSelection[0].items)[0].name
    // myCounter = tempstring.substring(0,1);
    // console.log(pulledSelection)



    if (pulledSelection.length > 0) {
      let selection = JSON.parse(pulledSelection[0].meal_selection);
      let addOnSelection = JSON.parse(pulledSelection[0].addon_selection);
      delivery_Day = pulledSelection[0].delivery_day;

      // console.log(selection)

      // if(JSON.parse(pulledSelection[0].items)!=[]){
      //   let tempstring = JSON.parse(pulledSelection[0].items)[0].name
      //   myCounter = tempstring.substring(0,1);
      // }else{
      //   myCounter=selection[0].qty
      // }
      

      selection.map(myItem => {
        let required_Id = myItem.item_uid;
        let menuItemCur = this.state.data.filter(
          dateCheck =>
            dateCheck.menu_date === this.state.myDate &&
            dateCheck.meal_uid === required_Id
        );

        let spreadObj = {...menuItemCur};
        let pushingObj = {
          count: myItem.qty,
          ...spreadObj[0]
        };

        if (myItem.name !== "SKIP" && myItem.name !== "SURPRISE") {
          cartItemsArr.push(pushingObj);
          myCounter = myCounter + myItem.qty;
          return this.setState({selectValue: "SAVE"});
        } else {
          let select_val = myItem.name;
          let myoutput =
            select_val[0].toUpperCase() +
            select_val.substring(1, select_val.length).toUpperCase();

          return this.setState({selectValue: myoutput});
        }
      });

      if (addOnSelection !== null) {

        addOnSelection.map(myItem => {
          // console.log(myItem)
          let required_Id = myItem.item_uid;
          let menuItemCur = this.state.data.filter(
            dateCheck =>
              dateCheck.menu_date === this.state.myDate &&
              dateCheck.meal_uid === required_Id
          );
  
          let spreadObj = {...menuItemCur};
          let pushingObj = {
            count: myItem.qty,
            ...spreadObj[0]
          };
  
          if (myItem.name !== "SKIP" && myItem.name !== "SURPRISE") {
            addOnArr.push(pushingObj);
            addOnCount = addOnCount + myItem.qty;
          //   return this.setState({selectValue: "SAVE"});
          // } else {
          //   let select_val = myItem.name;
          //   let myoutput =
          //     select_val[0].toUpperCase() +
          //     select_val.substring(1, select_val.length).toUpperCase();
  
          //   return this.setState({selectValue: myoutput});
          }
        });

      }

    }


    console.log('counter is '+ myCounter)
    return this.setState({
      deliveryDay: delivery_Day !== "" && delivery_Day !== "SKIP" ? delivery_Day : "Sunday",
      // deliveryDay: delivery_Day !== "" ? delivery_Day : "Sunday",
      cartItems: [...cartItemsArr],
      addOnItems: [...addOnArr],
      totalCount: myCounter,
      addOnAmount: addOnCount,
      displayCount: "block"
    });
  };

  filterDates = event => {

    if(this.state.currentSelectedDate === ''){
      this.setState({currentSelectedDate:event.target.value});
    }else{
      var tempElement = document.getElementById(this.state.currentSelectedDate);
      tempElement.style.border = 'none'
      this.setState({currentSelectedDate:event.target.value});
    }

    // console.log(event.target)
    var element = document.getElementById(event.target.value);
    // console.log(element.style)
    element.style.border = '4px solid #f08e1f'

    event.stopPropagation();

    if(Cookies.get("customer_uid")==null){
      return this.setState({
        myDate: event.target.value,
      });
    }

    let cust_id = Cookies.get("customer_uid");
    // console.log(cust_id)
    fetch(
      `${API_URL}meals_selected?customer_uid=${cust_id}`
    )
      .then(response => response.json())
      .then(json => {
        let mealSelected = [...json.result];
        this.setState({
          mealSelected
        });
      })
      .catch(error => {
        console.error(error);
      });

    // console.log(this.state.mealSelected);
    let cartItemsArr = [];
    let addOnArr = [];
    let delivery_Day = "";
    let myCounter = 0;
    let addOnCount = 0;
    let pulledSelection = this.state.mealSelected.filter(
      item =>
        item.sel_purchase_id === this.state.purchaseID &&
        item.sel_menu_date === event.target.value
    );
    
    // console.log(pulledSelection)
    if (pulledSelection.length > 0) {
      let selection = JSON.parse(pulledSelection[0].meal_selection);
      let addOnSelection = JSON.parse(pulledSelection[0].addon_selection);
      delivery_Day = pulledSelection[0].delivery_day;
      selection.map(myItem => {
        let required_Id = myItem.item_uid;
        let menuItemCur = this.state.data.filter(
          dateCheck =>
            dateCheck.menu_date === event.target.value &&
            dateCheck.meal_uid === required_Id
        );
        let spreadObj = {...menuItemCur};
        let pushingObj = {
          count: myItem.qty,
          ...spreadObj[0]
        };
        // console.log(myItem.name)
        if (myItem.name !== "SKIP" && myItem.name !== "SURPRISE") {
          cartItemsArr.push(pushingObj);
          myCounter = myCounter + myItem.qty;
          return this.setState({selectValue: "SAVE"});
        } else {
          let select_val = myItem.name;
          let myoutput =
            select_val[0].toUpperCase() +
            select_val.substring(1, select_val.length).toUpperCase();
          return this.setState({selectValue: myoutput});
        }
      });
      if (addOnSelection !== null) {

        addOnSelection.map(myItem => {
          let required_Id = myItem.item_uid;
          let menuItemCur = this.state.data.filter(
            dateCheck =>
              dateCheck.menu_date === event.target.value &&
              dateCheck.meal_uid === required_Id
          );
  
          let spreadObj = {...menuItemCur};
          let pushingObj = {
            count: myItem.qty,
            ...spreadObj[0]
          };
          
          if (myItem.name !== "SKIP" && myItem.name !== "SURPRISE") {
            addOnArr.push(pushingObj);
            addOnCount = addOnCount + myItem.qty;
          //   return this.setState({selectValue: "SAVE"});
          // } else {
          //   let select_val = myItem.name;
          //   let myoutput =
          //     select_val[0].toUpperCase() +
          //     select_val.substring(1, select_val.length).toUpperCase();
  
          //   return this.setState({selectValue: myoutput});
          }
        });

      }

    } else {
      this.setState({
        deliveryDay: "Sunday",
        selectValue: "SURPRISE"
      });
    }

    // console.log(event.target.getAttribute('value'));

    return this.setState({
      deliveryDay: delivery_Day !== "" && delivery_Day !== "SKIP" ? delivery_Day : "Sunday",
      // deliveryDay: delivery_Day !== "" ? delivery_Day : "Sunday",
      myDate: event.target.getAttribute('value'),
      cartItems: [...cartItemsArr],
      addOnItems: [...addOnArr],
      totalCount: myCounter,
      addOnAmount: addOnCount,
    });
  };

  setDeliveryDay = e => {
    let deliver = e.target.value;
    const myarr = [];
    if (this.state.totalMeals == this.state.totalCount) {
      this.state.cartItems.map(meal => {
        myarr.push({
          qty: meal.count,
          name: meal.meal_name,
          price: meal.meal_price,
          item_uid: meal.meal_uid
        });
        return meal;
      });
      const data2 = {
        is_addon: false,
        items: myarr,
        purchase_id: this.state.purchaseID,
        menu_date: this.state.myDate,
        delivery_day: deliver
      };
      
      axios
        .post(
          `${API_URL}meals_selection`,
          data2
        )
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
      return this.setState({
        deliveryDay: deliver,
        selectValue: "SAVE"
      });
    }
    // } else if (this.state.selectValue === "Surprise") {
    else {
      if (this.state.myDate !== "" && this.state.selectValue === "SURPRISE") {
        const supriseData = [
          {
            qty: "",
            name: "SURPRISE",
            price: "",
            item_uid: ""
          }
        ];
        const data1 = {
          is_addon: false,
          items: supriseData,
          purchase_id: this.state.purchaseID,
          menu_date: this.state.myDate,
          delivery_day: deliver
        };

        axios
          .post(
            `${API_URL}meals_selection`,
            data1
          )
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
        return this.setState({
          deliveryDay: deliver,
          totalCount: 0,
          cartItems: []
        });
      }
    }
    return this.setState({
      deliveryDay: deliver
    });
  };

  makeSelection = e => {

    const customer_uid = Cookies.get("customer_uid");


    if(customer_uid==null){
      return this.setState({unloginPopupShow:true,unloginPopupMessage:'xxxxx'})

      // return alert('signin before do this')
    }

    this.setState({
      selectValue: e.target.value
    });

    let buttonStyle = ''
    let extraInfo = ''

    console.log(this.state.myDate);

    if (e.target.value === "SURPRISE") {
      buttonStyle = styles.datebuttonSurprise;
      extraInfo = 'Surprise / No selection'
      let tempNewButton = (
        <button 
              key={this.state.myDate} 
              value={this.state.myDate} 
              onClick={this.filterDates}
              className={buttonStyle} 
              id={this.state.myDate} 
              autoFocus>
                <button
                style={{
                  fontSize:'25px',
                  fontWeight:'bold',
                  lineHeight:'25px',
                  backgroundColor:'rgba(0, 0, 0, 0)',
                  border:'none'
                }}
                key={this.state.myDate} value={this.state.myDate} 
                onClick={this.filterDates} 
                id={this.state.myDate} 
                >
                  {moment(this.state.myDate.split(" ")[0]).format("ddd")}
                  <br/>{moment(this.state.myDate.split(" ")[0]).format("MMM") +" "+ moment(this.state.myDate.split(" ")[0]).format("D")}
                </button>

                <button
                style={{
                  width:"122px",
                  height:"48px",
                  marginTop:"15px",
                  fontSize:"15px",
                  backgroundColor:'rgba(0, 0, 0, 0)',
                  border:'none'
                }}
                key={this.state.myDate} value={this.state.myDate} 
                onClick={this.filterDates} 
                id={this.state.myDate} 
                >
                  {extraInfo}
                </button>
        </button>
      )
      this.setState({dateButtonList:this.state.dateButtonList.map((info)=>info.key===this.state.myDate?tempNewButton:info)})
      if (this.state.myDate !== "") {
        const supriseData = [
          {
            qty: "",
            name: "SURPRISE",
            price: "",
            item_uid: ""
          }
        ];

        const addOns = []
        this.state.addOnItems.map(meal => {
          addOns.push({
            qty: meal.count,
            name: meal.meal_name,
            price: meal.meal_price,
            item_uid: meal.meal_uid
          });
          return meal;
        });

        const data1 = {
          is_addon: false,
          items: supriseData,
          purchase_id: this.state.purchaseID,
          menu_date: this.state.myDate,
          delivery_day: this.state.deliveryDay
        };

        const addOnData1 = {
          is_addon: true,
          items: addOns,
          purchase_id: this.state.purchaseID,
          menu_date: this.state.myDate,
          delivery_day: this.state.deliveryDay
        };
        console.log(this.state.deliveryDay)
      
        axios
          .post(
            `${API_URL}meals_selection`,
            data1
          )
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });

          axios
          .post(
            `${API_URL}meals_selection`,
            addOnData1
          )
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });

          this.toggleDisplay("SURPRISE")

        return this.setState({
          totalCount: 0,
          cartItems: []
        });
      }
    } else if (e.target.value === "SKIP") {
      buttonStyle = styles.datebuttonSkip;
      extraInfo = 'Skipped'

      let tempNewButton = (
        <button key={this.state.myDate} 
              value={this.state.myDate} 
              onClick={this.filterDates}
              className={buttonStyle} 
              id={this.state.myDate} 
              autoFocus>
                <button
                  style={{
                    fontSize:'25px',
                    fontWeight:'bold',
                    lineHeight:'25px',
                    backgroundColor:'rgba(0, 0, 0, 0)',
                    border:'none'
                  }}
                  key={this.state.myDate} value={this.state.myDate} 
                  onClick={this.filterDates} 
                  id={this.state.myDate} 
                  >
                  {moment(this.state.myDate.split(" ")[0]).format("ddd")}
                  <br/>{moment(this.state.myDate.split(" ")[0]).format("MMM") +" "+ moment(this.state.myDate.split(" ")[0]).format("D")}
                </button>

                <button
                style={{
                  width:"122px",
                  height:"48px",
                  marginTop:"15px",
                  fontSize:"15px",
                  backgroundColor:'rgba(0, 0, 0, 0)',
                  border:'none'
                }}
                key={this.state.myDate} value={this.state.myDate} 
                onClick={this.filterDates} 
                id={this.state.myDate} 
                >
                  {extraInfo}
                </button>
                
        </button>
      )
  
  
      this.setState({dateButtonList:this.state.dateButtonList.map((info)=>info.key===this.state.myDate?tempNewButton:info)})
      const skipData = [
        {
          qty: "",
          name: "SKIP",
          price: "",
          item_uid: ""
        }
      ];
      
      const data2 = {
        is_addon: false,
        items: skipData,
        purchase_id: this.state.purchaseID,
        menu_date: this.state.myDate,
        // delivery_day: this.state.deliveryDay
        delivery_day: 'SKIP'
      };

      const addOnData2 = {
        is_addon: true,
        items: [],
        purchase_id: this.state.purchaseID,
        menu_date: this.state.myDate,
        delivery_day: this.state.deliveryDay
      };

      axios
        .post(
          `${API_URL}meals_selection`,
          data2
        )
        .then(response => {
          // console.log(response);
        })
        .catch(error => {
          // console.log(error);
        });

        axios
        .post(
          `${API_URL}meals_selection`,
          addOnData2
        )
        .then(response => {
          // console.log(response);
        })
        .catch(error => {
          // console.log(error);
        });

      this.toggleDisplay("SKIP")

      return this.setState({
        totalCount: 0,
        cartItems: [],
        addOnItems: [],
        addOnAmount: 0,
      });
    } else {
      buttonStyle = styles.datebuttonSave;
      extraInfo = 'Saved'
      let tempNewButton = (

        <button key={this.state.myDate} 
              value={this.state.myDate} 
              onClick={this.filterDates}
              className={buttonStyle} 
              id={this.state.myDate} 
              autoFocus>
                <button
                style={{
                  fontSize:'25px',
                  fontWeight:'bold',
                  lineHeight:'25px',
                  backgroundColor:'rgba(0, 0, 0, 0)',
                  border:'none'
                }}
                
                key={this.state.myDate} value={this.state.myDate} 
                onClick={this.filterDates} 
                id={this.state.myDate} 
                >
                  {moment(this.state.myDate.split(" ")[0]).format("ddd")}
                  <br/>{moment(this.state.myDate.split(" ")[0]).format("MMM") +" "+ moment(this.state.myDate.split(" ")[0]).format("D")}
                </button>

                <button
                style={{
                  width:"122px",
                  height:"48px",
                  marginTop:"15px",
                  fontSize:"15px",
                  backgroundColor:'rgba(0, 0, 0, 0)',
                  border:'none'
                }}
                key={this.state.myDate} value={this.state.myDate} 
                onClick={this.filterDates} 
                id={this.state.myDate} 

                >
                  {extraInfo}
                </button>
                
              </button>
      // </button>
      )
  
  
      this.setState({dateButtonList:this.state.dateButtonList.map((info)=>info.key===this.state.myDate?tempNewButton:info)})

      const myarr = [];
      this.state.cartItems.map(meal => {
        myarr.push({
          qty: meal.count,
          name: meal.meal_name,
          price: meal.meal_price,
          item_uid: meal.meal_uid
        });
        return meal;
      });

      const addOns = []
      this.state.addOnItems.map(meal => {
        addOns.push({
          qty: meal.count,
          name: meal.meal_name,
          price: meal.meal_price,
          item_uid: meal.meal_uid
        });
        return meal;
      });

      const data = {
        is_addon: false,
        items: myarr,
        purchase_id: this.state.purchaseID,
        menu_date: this.state.myDate,
        delivery_day: this.state.deliveryDay
      };

      const addOnData = {
        is_addon: true,
        items: addOns,
        purchase_id: this.state.purchaseID,
        menu_date: this.state.myDate,
        delivery_day: this.state.deliveryDay
      };

      axios
        .post(
          `${API_URL}meals_selection`,
          data
        )
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });

        axios
        .post(
          `${API_URL}meals_selection`,
          addOnData
        )
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });

        this.toggleDisplay('SAVE')
    }
    
    // console.log(buttonStyle)

  };

  addToCart = menuitem => {

    var elementBig = document. getElementById(menuitem.menu_meal_id);

    
          
    if(Cookies.get("customer_uid")==null){
      return alert('signin before use + - button')
    }



    const cartItems = this.state.cartItems.slice();
    let alreadyInCart = false;
    if (this.state.totalCount < this.state.totalMeals) {
      elementBig.style.backgroundColor = '#F8BB17'

      cartItems.forEach(item => {
        if (item.menu_uid === menuitem.menu_uid) {
          item.count++;
          alreadyInCart = true;
        }
      });
      if (!alreadyInCart) {
        cartItems.push({...menuitem, count: 1});
      }

      this.setState({
        cartItems,
        totalCount: this.state.totalCount + 1,
        selectValue:
          this.state.totalCount != this.state.totalMeals &&
          this.state.totalCount != 0 &&
          ""
      });
    }
  };

  addAddOn = menuitem => {
    const cartItems = this.state.addOnItems.slice();
    let alreadyInCart = false;
      cartItems.forEach(item => {
        if (item.menu_uid === menuitem.menu_uid) {
          item.count++;
          alreadyInCart = true;
        }
      });
      if (!alreadyInCart) {
        cartItems.push({...menuitem, count: 1});
      }

      // console.log(cartItems)
      this.setState({
        addOnItems: cartItems,
        addOnAmount: this.state.addOnAmount + 1,
        selectValue:
          this.state.totalCount != this.state.totalMeals &&
          this.state.totalCount != 0 &&
          ""
      });
  }

  removeFromCart = (menuitem) => {
    var elementBig = document. getElementById(menuitem.menu_meal_id);
    var elementNum = document. getElementById(menuitem.menu_meal_id+'num');

    if((elementNum.textContent)>1){
      // elementBig.style.backgroundColor = '#F8BB17'
    }else{
      elementBig.style.backgroundColor = 'white'
    }

    if(Cookies.get("customer_uid")==null){
      return alert('signin before use + - button')
    }

    const cartItems = this.state.cartItems.slice();
    // let alreadyInCart_1 = false;
    cartItems.forEach(item => {
      if (this.state.totalCount > 0) {
        if (item.menu_uid === menuitem.menu_uid) {
          if (item.count !== 0) {
            // alreadyInCart_1 = true;
            item.count--;
          }
          this.setState({
            cartItems,
            totalCount: this.state.totalCount - 1,
            selectValue:
              this.state.totalCount != this.state.totalMeals &&
              this.state.totalCount != 0 &&
              ""
          });
        }
      }
    });
    cartItems.forEach(meal => {
      if (
        meal.menu_uid === menuitem.menu_uid &&
        meal.count === 0 &&
        this.state.totalCount > 0
      ) {
        this.setState({
          cartItems: cartItems.filter(x => x.menu_uid !== menuitem.menu_uid),
          totalCount: this.state.totalCount - 1
        });
      }
    });
  };

  removeAddOn = menuitem => {
    const cartItems = this.state.addOnItems.slice();
    // let alreadyInCart_1 = false;
    cartItems.forEach(item => {
        if (item.menu_uid === menuitem.menu_uid) {
          if (item.count !== 0) {
            // alreadyInCart_1 = true;
            item.count--;
          }
          this.setState({
            addOnItems: cartItems,
            addOnAmount: this.state.addOnAmount - 1,
            selectValue:
              this.state.totalCount != this.state.totalMeals &&
              this.state.totalCount != 0 &&
              ""
          });
        }
    });
    cartItems.forEach(meal => {
      if (
        meal.menu_uid === menuitem.menu_uid &&
        meal.count === 0 
      ) {
        this.setState({
          addOnItems: cartItems.filter(x => x.menu_uid !== menuitem.menu_uid),
          addOnAmount: this.state.addOnAmount - 1,
        });
      }
    });
    // console.log(cartItems)
  };

  prepareSurpriseArr=(uid)=>{
    if(uid!=null){
      fetch(
        `${API_URL}meals_selected?customer_uid=${uid}`
      )
        .then(response => response.json())
        .then(json => {
          let mealSelected = [...json.result];
          let tempArr = [];
          for(const eachData of mealSelected){
            let tempselection = JSON.parse(eachData.meal_selection);
            tempArr.push({
              id:eachData.sel_purchase_id,
              date:eachData.sel_menu_date,
              selection:tempselection[0].name,
            })
          }
          this.setState({surpriseSkipSave:tempArr});

          // console.log(this.state.surpriseSkipSave)

          let buttonList = [];
          let first=null;

          const dates = this.state.data.map(date => date.menu_date);
          const uniqueDates = Array.from(new Set(dates));
          let lessThanTen = 0;

          // console.log(this.state.surpriseSkipSave)

          for(const date of uniqueDates){

            if(lessThanTen>=10){
              break;
            }

            let classStyle = styles.datebuttonSurprise ;
            let extraInfo = 'Surprise / No selection'

            for(const surpriseInfo of this.state.surpriseSkipSave){
              if(surpriseInfo.date == date&&surpriseInfo.id==this.state.purchaseID){
                if(surpriseInfo.selection=='SKIP'){
                  classStyle = styles.datebuttonSkip
                  extraInfo='Skipped'
                }else if(surpriseInfo.selection=='SURPRISE'){
                  classStyle = styles.datebuttonSurprise 
                  extraInfo = 'Surprise / No selection'
                }
                else{
                  classStyle = styles.datebuttonSave
                  extraInfo = 'Saved'
                }
              }
            }
            buttonList.push(
              <button 
              key={date} value={date} 
              onClick={this.filterDates} 
              id={date} 
              className={classStyle} 
              autoFocus={first==null}
              >
                
                <button
                style={{
                  fontSize:'25px',
                  fontWeight:'bold',
                  lineHeight:'25px',
                  backgroundColor:'rgba(0, 0, 0, 0)',
                  border:'none'
                }}
                key={date} value={date} 
                onClick={this.filterDates} 
                id={date} 

                >
                  {moment(date.split(" ")[0]).format("ddd")}
                  <br/>{moment(date.split(" ")[0]).format("MMM") +" "+ moment(date.split(" ")[0]).format("D")}
                </button>

                <button
                style={{
                  width:"122px",
                  height:"48px",
                  marginTop:"10px",
                  fontSize:"15px",
                  backgroundColor:'rgba(0, 0, 0, 0)',
                  border:'none'
                }}
                key={date} value={date} 
                onClick={this.filterDates} 
                id={date} 
                >
                  {extraInfo}
                </button>

                
              </button>
            )
            first=1;
            lessThanTen++;
          }
          // console.log(buttonList)

          this.setState({
            dateButtonList:buttonList
          })

          return buttonList;

        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  dateButtonArray=()=>{

    const customer_uid = Cookies.get("customer_uid");

    
    const dates = this.state.data.map(date => date.menu_date);
    const uniqueDates = Array.from(new Set(dates));

    let buttonList = [];
    let first=null;

    let lessThanTen = 0;

    if (customer_uid == null) {
      //if user  not login, show them the basic date button
      for(const date of uniqueDates){
        if(lessThanTen>=10){
          break;
        }
        buttonList.push(
          // <button key={date} value={date} onClick={this.filterDates} id={date} className={styles.datebutton} autoFocus={first==null}>
          //   {moment(date.split(" ")[0]).format("ddd")}
          //   <br/>{moment(date.split(" ")[0]).format("MMM") +" "+ moment(date.split(" ")[0]).format("D")}
          // </button>

          <button 
          key={date} 
          value={date} 
          onClick={this.filterDates} 
          id={date} className={styles.datebuttonSurprise} 
          autoFocus={first==null}
          >
            <button
              style={{
                fontSize:'25px',
                fontWeight:'bold',
                lineHeight:'25px',
                backgroundColor:'rgba(0, 0, 0, 0)',
                border:'none'
              }}
              key={date} value={date} 
              value={date} 
              onClick={this.filterDates}
              >
              {moment(date.split(" ")[0]).format("ddd")}
              <br/>{moment(date.split(" ")[0]).format("MMM") +" "+ moment(date.split(" ")[0]).format("D")}
            </button>

            <button
            style={{
              width:"122px",
              height:"48px",
              marginTop:"15px",
              fontSize:"15px",
              backgroundColor:'rgba(0, 0, 0, 0)',
              border:'none'
            }}
            key={date} value={date} 
            value={date} 
            onClick={this.filterDates}
            >
              Surprise / No selection
            </button>
            
          </button>
        )
        first=1;
        lessThanTen++;
      }
      this.setState({
        dateButtonList:buttonList
      })
    }
    else{
      //if user login, fetch skip, surprise or something else on that day. 
      buttonList = this.prepareSurpriseArr(customer_uid);
    }
    return buttonList;
  }

  render() {
    const dates = this.state.data.map(date => date.menu_date);
    const uniqueDates = Array.from(new Set(dates));

    // console.log(this.state.surpriseSkipSave)
    return (
      <div className={styles.mealMenuWrapper}>
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
          dateButtonArray = {this.state.dateButtonList}
          customer_uid = {Cookies.get("customer_uid")}
        />

        <div style = {{overflow: 'visible', height: '100vh'}}>
            <div className={styles.menuItemsWrapper}>
              <MenuItem
                addToCart={this.addToCart}
                removeFromCart={this.removeFromCart}
                data={this.state.data}
                myDate={this.state.myDate}
                cartItems={this.state.cartItems}
                mealSelected={this.state.mealSelected}
                purchaseID={this.state.purchaseID}
                show={this.props.subscribedPlans.length}
                addon = {false}
                customer_uid = {Cookies.get("customer_uid")}
              />
          
            </div>
          <h6 style = {{padding: '10px 90px', fontSize: '30px', fontWeight: 'bold', color: '#FF9400'}}>Add Ons</h6>
          <div className = {styles.menuItemsWrapper}>
            <MenuItem
                  addToCart={this.addAddOn}
                  removeFromCart={this.removeAddOn}
                  data={this.state.data}
                  myDate={this.state.myDate}
                  cartItems={this.state.addOnItems}
                  mealSelected={this.state.mealSelected}
                  purchaseID={this.state.purchaseID}
                  show={this.props.subscribedPlans.length}
                  addon = {true}
                />
          </div>
        </div>

        <div className = {this.state.popUp}>
              <div className = {styles.popUpContainer}>

                <h6 style = {{margin: '20px 25px'}}>{this.state.popUpText}</h6>

                <a className = {styles.popUpButton} onClick = {this.toggleDisplay}>OK</a>
              </div>
        </div>
        {this.state.unloginPopupShow?<SelectMealGuestPop message={this.state.unloginPopupMessage }/>:null}
        
      </div>
    );
  }
}
const mapStateToProps = state => ({
  subscribedPlans: state.subscribe.subscribedPlans
});

export default connect(mapStateToProps, {
  fetchSubscribed,
  fetchProfileInformation
})(MenuItemList);

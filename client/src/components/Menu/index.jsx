import React from "react";
import styles from "./menu.module.css";
import takeaway from "./static/take-away.svg";
import calendar from "./static/Calendar.svg";
import group from "./static/Group 1682.svg";
import lunch from "./static/lunch.svg";
import {Link} from "react-router-dom";

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};


const Menu = props => {
  return (
    // <div className={props.show ? styles.menu : styles.menu1}>
    <div className={ styles.menu }>

        {(!props.login)?
          <div>
            {props.show && props.message}
          </div>
          :(
          <div>
            <div>
              {props.message}
            </div> 
            
            <div className={styles.selectBtn + " " + (!props.show && styles.w5)}>
              
              <div
                style={{
                  position:"absolute",
                  top:'68px',
                  right:'20px'
                }}
              >
                {props.subscribedPlans.length ? (
                  <select
                      onChange={props.mealsOnChange}
                      className={styles.pickers}
                      id={styles.mealPlanPicker}
                    >
                      {props.meals.map(mealItem => {
                        // let meal = JSON.parse(mealItem.items)[0];
                        // let mealName = meal.name;

                        let parsedItems = JSON.parse(mealItem.items)[0];
                        let parsedMeals = parsedItems.name.substring(0,parsedItems.name.indexOf(" "));
                        let parsedDeliveries = parsedItems.qty;

                        let parsedId = mealItem.purchase_uid.substring(
                          mealItem.purchase_uid.indexOf("-")+1,
                          mealItem.purchase_uid.length
                        );
                        // console.log(mealItem);
                        return (
                          <option
                            value={mealItem.purchase_uid}
                            // modifiedValue={mealItem.purchase_id}
                            key={mealItem.purchase_uid}
                          >
                            {/* {mealName.toUpperCase()} */}
                            {
                              parsedMeals + " Meals, " + 
                              parsedDeliveries + " Deliveries : " + 
                              parsedId
                            }
                          </option>
                        );
                      })}
                </select>
                ) : (""
                )}
              </div>

            </div>
          </div>
        
        )
        }
        

      
    </div>
  );
};

export default Menu;

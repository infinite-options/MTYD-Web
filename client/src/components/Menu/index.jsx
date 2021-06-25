import React, {useState} from "react";
import styles from "./menu.module.css";
import takeaway from "./static/take-away.svg";
import calendar from "./static/Calendar.svg";
import group from "./static/Group 1682.svg";
import lunch from "./static/lunch.svg";
import {Link} from "react-router-dom";
import whiteDown from "./static/white_arrow_down.png";
import Cookies from "js-cookie";

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
  const [showDropdown, toggleShowDropdown] = useState(false);
  const [dropdownButtons, setDropdownButtons] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);

  let tempDropdownButtons = []

  const setDefaultCurrentPlan = () => {
    if (currentPlan == null && props.subscribedPlans.length > 0) {
      setCurrentPlan(props.subscribedPlans[0])
    }
    return null
  }

  const generateDropdownButtons = () => {
    
    tempDropdownButtons = []
    var i
    for (i=0; i< props.subscribedPlans.length; i++) {
      let index = i
      tempDropdownButtons.push(
        <div
            key={index + ' : ' + props.subscribedPlans[index].purchase_uid.substring(props.subscribedPlans[index].purchase_uid.indexOf("-")+1,props.subscribedPlans[index].purchase_uid.length)}
            onClick={() => {
              console.log("pressed: ", props.subscribedPlans[index].purchase_uid.substring(props.subscribedPlans[index].purchase_uid.indexOf("-")+1,props.subscribedPlans[index].purchase_uid.length));
              setCurrentPlan(props.subscribedPlans[index]);
              // console.log("Parsed Plan")
              // console.log(currentPlan)
              // console.log(props.subscribedPlans[index])
              props.mealsOnClick(props.subscribedPlans[index])
              toggleShowDropdown(false);
            }}
            style={{
              borderRadius: '10px',
              backgroundColor: 'white',
              height: '32px',
              width: '96%',
              paddingLeft: '10px',
              marginLeft: '2%',
              marginTop: '10px',
              textOverflow: 'ellipsis',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            tabIndex="0"
            aria-label={"Click to select the following meal: "+JSON.parse(props.subscribedPlans[index].items)[0].name[0] +" Meals, "+JSON.parse(props.subscribedPlans[index].items)[0].qty+" Deliveries : "+props.subscribedPlans[index].purchase_uid.substring(props.subscribedPlans[index].purchase_uid.indexOf("-")+1,props.subscribedPlans[index].purchase_uid.length)}
            title={"Click to select the following meal: "+JSON.parse(props.subscribedPlans[index].items)[0].name[0] +" Meals, "+JSON.parse(props.subscribedPlans[index].items)[0].qty+" Deliveries : "+props.subscribedPlans[index].purchase_uid.substring(props.subscribedPlans[index].purchase_uid.indexOf("-")+1,props.subscribedPlans[index].purchase_uid.length)}
          >
            {/* Filler */}
            {JSON.parse(props.subscribedPlans[index].items)[0].name[0]} Meals, {JSON.parse(props.subscribedPlans[index].items)[0].qty} Deliveries : {props.subscribedPlans[index].purchase_uid.substring(props.subscribedPlans[index].purchase_uid.indexOf("-")+1,props.subscribedPlans[index].purchase_uid.length)}
          </div>
      )
      // if (currentPlan === null) {
      //   setCurrentPlan(props.subscribedPlans[0])
      // }
    }
    let dropdownTopMargin = [
      <div
        key={'space'}
        style={{
          height: '25px',
          backgroundColor: '#f26522',
        }}
      />
    ]

    

    return dropdownTopMargin.concat(tempDropdownButtons)
  }

  const getDropdownButtons = () => {
    return (
      <>
        <div
          style={{
            height: '20px',
            zIndex: '1'
          }}
        />
        <div
          style={{
            backgroundColor: '#f26522',
            width: '40%',
            minWidth: '300px',
            height: 40 + (props.subscribedPlans.length * 42),
            position: 'absolute',
            zIndex: '1',
            boxShadow: '0px 5px 10px gray',
            borderRadius: '15px'
          }}
        >
          {generateDropdownButtons()}
          
        </div>
      </>
    )
  }

  //dropdownButtons = getDropdownButtons()

  // console.log("testing")
  // console.log(currentPlan.purchase_uid.substring(currentPlan.purchase_uid.indexOf("-")+1,currentPlan.purchase_uid.length))
  // console.log(JSON.parse(currentPlan.items)[0])
  //console.log(props.subscribedPlans.length)
  //console.log(props.subscribedPlans)
  // console.log(props.subscribedPlans[0].items)
  // console.log(JSON.parse(props.subscribedPlans[0].items))
  // console.log(JSON.parse(props.subscribedPlans[0].items)[0])
  // console.log(JSON.parse(props.subscribedPlans[0].items)[0].qty)
  // console.log(JSON.parse(props.subscribedPlans[0].items)[0].name[0])
  //console.log(props.subscribedPlans[0].purchase_uid.substring(props.subscribedPlans[0].purchase_uid.indexOf("-")+1,props.subscribedPlans[0].purchase_uid.length))
  
  return (
    // <div className={props.show ? styles.menu : styles.menu1}>
    
    <div className={ styles.menu }>
        {setDefaultCurrentPlan()}
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
            
            {/* NEW CODE */}

              <div
                style={{
                  position:"absolute",
                  top:'68px',
                  right:'330px',
                  height: (
                    showDropdown
                      ? 60 + (props.subscribedPlans.length *42)
                      : 60
                  )
                }}
              >
              
              

                <div
                  className={styles.dropdownSelection}
                  onClick={() => {
                    // console.log("set show dropdown menu to: ", !showDropdown);
                    toggleShowDropdown(!showDropdown);
                    //console.log(showDropdown)
                    
                  }}
                  tabIndex="0"
                  aria-label="Click here to choose the subscription you want to view"
                  title="Click here to choose the subscription you want to view"
                >
                  <div
                    style={{
                      // border: 'solid',
                      // borderWidth: '1px',
                      width: '80%',
                      marginLeft: '5%',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }}
                  >
                    {
                      currentPlan === null
                        ? "No Active Plans"
                        : (
                          JSON.parse(currentPlan.items)[0].name[0] + " Meals, " +
                          JSON.parse(currentPlan.items)[0].qty + " Deliveries : " +
                          currentPlan.purchase_uid.substring(currentPlan.purchase_uid.indexOf("-")+1,currentPlan.purchase_uid.length)
                        )
                    }
                  </div>
                  <div
                    style={{
                      width: '10%',
                      minWidth: '24px',
                      marginRight: '5%'
                    }}
                  >
                    {
                      currentPlan === null
                        ? null
                        : <div className={styles.whiteArrowDown} /> 
                    }
                    {/* <div className={styles.whiteArrowDown} /> */}
                  </div>
                </div>
                {showDropdown
                  ? getDropdownButtons()
                  : null
                }

              </div>

            {/* NEW CODE */}

            {/*OLD CODE*/}

              {/* <div
                style={{
                  position:"absolute",
                  top:'108px',
                  right:'330px',
                  height: (
                    showDropdown
                      ? 60 + (props.subscribedPlans.length *42)
                      : 60
                  )
                }}
              >
              
                {props.subscribedPlans.length ? (
                  <select
                      onChange={props.mealsOnChange}
                      className={styles.dropdownSelection}
                      id={styles.mealPlanPicker}
                      aria-label={"Click here to select meals to edit"}
                      title={"Click here to select meals to edit"}
                      components={{LoadingIndicator: null}}
                    >
                      {props.meals.map(mealItem => {
                        

                        let parsedItems = JSON.parse(mealItem.items)[0];
                        let parsedMeals = parsedItems.name.substring(0,parsedItems.name.indexOf(" "));
                        let parsedDeliveries = parsedItems.qty;

                        let parsedId = mealItem.purchase_uid.substring(
                          mealItem.purchase_uid.indexOf("-")+1,
                          mealItem.purchase_uid.length
                        );
                        
                        return (
                          <option
                            value={mealItem.purchase_uid}
                           
                            key={mealItem.purchase_uid}
                            
                          >
                            
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
              </div> */}

            {/*OLD CODE*/}

            </div>
          </div>
        
        )
        }
        

      
    </div>
  );
};

export default Menu;

import { useState } from "react";
import styles from "./menu.module.css";
// import makeStyles from '@material-ui/core/styles/makeStyles';

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

// const useStyles = makeStyles((theme) => ({
//   menuButton: {
//     borderRadius: "10px",
//     backgroundColor: "white",
//     height: "32px",
//     width: "96%",
//     // paddingLeft: "10px",
//     marginLeft: "2%",
//     marginTop: "10px",
//     textOverflow: "ellipsis",
//     // display: "block",
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     cursor: "pointer",
//     '&:hover': {
//       backgroundColor: '#ffba00'
//     }
//   },
// }));

const Menu = (props) => {
  // const classes = useStyles();

  const [showDropdown, toggleShowDropdown] = useState(false);
  const [dropdownButtons, setDropdownButtons] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);

  let tempDropdownButtons = [];

  const setDefaultCurrentPlan = () => {
    if (currentPlan == null && props.subscribedPlans.length > 0) {
      setCurrentPlan(props.subscribedPlans[0]);
    }
    return null;
  };

  const generateDropdownButtons = () => {
    tempDropdownButtons = [];
    var i;
    for (i = 0; i < props.subscribedPlans.length; i++) {
      let index = i;
      tempDropdownButtons.push(
        <div
          className={styles.menuButton}
          key={
            index +
            " : " +
            props.subscribedPlans[index].purchase_id.substring(
              props.subscribedPlans[index].purchase_id.indexOf("-") + 1,
              props.subscribedPlans[index].purchase_id.length
            )
          }
          onClick={() => {
            console.log(
              "pressed: ",
              props.subscribedPlans[index].purchase_id.substring(
                props.subscribedPlans[index].purchase_id.indexOf("-") + 1,
                props.subscribedPlans[index].purchase_id.length
              )
            );
            setCurrentPlan(props.subscribedPlans[index]);
            // console.log("Parsed Plan")
            // console.log(currentPlan)
            // console.log(props.subscribedPlans[index])
            props.mealsOnClick(props.subscribedPlans[index]);
            toggleShowDropdown(false);
          }}
          // style={{
          //   borderRadius: "10px",
          //   backgroundColor: "white",
          //   height: "32px",
          //   width: "96%",
          //   // paddingLeft: "10px",
          //   marginLeft: "2%",
          //   marginTop: "10px",
          //   textOverflow: "ellipsis",
          //   // display: "block",
          //   display: 'flex',
          //   alignItems: 'center',
          //   justifyContent: 'center',
          //   whiteSpace: "nowrap",
          //   overflow: "hidden",
          //   cursor: "pointer",
          // }}
          tabIndex="0"
          aria-label={
            "Click to select the following meal: " +
            JSON.parse(props.subscribedPlans[index].items)[0].name[0] +
            " Meals, " +
            JSON.parse(props.subscribedPlans[index].items)[0].qty +
            " Deliveries : " +
            props.subscribedPlans[index].purchase_id.substring(
              props.subscribedPlans[index].purchase_id.indexOf("-") + 1,
              props.subscribedPlans[index].purchase_id.length
            )
          }
          title={
            "Click to select the following meal: " +
            JSON.parse(props.subscribedPlans[index].items)[0].name[0] +
            " Meals, " +
            JSON.parse(props.subscribedPlans[index].items)[0].qty +
            " Deliveries : " +
            props.subscribedPlans[index].purchase_id.substring(
              props.subscribedPlans[index].purchase_id.indexOf("-") + 1,
              props.subscribedPlans[index].purchase_id.length
            )
          }
        >
          {/* Filler */}
          {
            JSON.parse(props.subscribedPlans[index].items)[0].name[0]
          } Meals, {JSON.parse(props.subscribedPlans[index].items)[0].qty}{" "}
          Deliveries :{" "}
          {props.subscribedPlans[index].purchase_id.substring(
            props.subscribedPlans[index].purchase_id.indexOf("-") + 1,
            props.subscribedPlans[index].purchase_id.length
          )}
        </div>
      );
      // if (currentPlan === null) {
      //   setCurrentPlan(props.subscribedPlans[0])
      // }
    }
    let dropdownTopMargin = [
      <div
        key={"space"}
        style={{
          height: "25px",
          backgroundColor: "#f26522",
        }}
      />,
    ];

    return dropdownTopMargin.concat(tempDropdownButtons);
  };

  const getDropdownButtons = () => {
    return (
      <div
        className={styles.dropdownStyling2}
        style={{
          // border: '1px inset',
          // width: '100%',
          // left: '0',
          width: '350px',
          position: 'absolute',
          maxWidth: '96%',
          marginLeft: '2%',
          marginRight: '2%'
        }}
      >
        <div
          style={{
            height: "20px",
            zIndex: "1",
            // border: '1px dashed',
            maxWidth: '100%'
          }}
        />
        <div
          className={styles.dropdownStyling}
          style={{
            // backgroundColor: "#f26522",
            // // width: "40%",
            // // minWidth: "300px",
            // // maxWidth: '350px',
            // width: '350px',
            height: 40 + props.subscribedPlans.length * 42,
            // position: "absolute",
            // right: '8%',
            zIndex: "2",
            // boxShadow: "0px 5px 10px gray",
            // borderRadius: "15px",
            // border: '1px solid blue',
            maxWidth: '100%'
          }}
        >
          {generateDropdownButtons()}
        </div>
      </div>
    );
  };

  //dropdownButtons = getDropdownButtons()

  // console.log("testing")
  // console.log(currentPlan.purchase_id.substring(currentPlan.purchase_id.indexOf("-")+1,currentPlan.purchase_id.length))
  // console.log(JSON.parse(currentPlan.items)[0])
  //console.log(props.subscribedPlans.length)
  //console.log(props.subscribedPlans)
  // console.log(props.subscribedPlans[0].items)
  // console.log(JSON.parse(props.subscribedPlans[0].items))
  // console.log(JSON.parse(props.subscribedPlans[0].items)[0])
  // console.log(JSON.parse(props.subscribedPlans[0].items)[0].qty)
  // console.log(JSON.parse(props.subscribedPlans[0].items)[0].name[0])
  //console.log(props.subscribedPlans[0].purchase_id.substring(props.subscribedPlans[0].purchase_id.indexOf("-")+1,props.subscribedPlans[0].purchase_id.length))

  return (
    // <div className={props.show ? styles.menu : styles.menu1}>

    <div className={styles.menu}>
      {setDefaultCurrentPlan()}
      {/* {!props.login ? (
        // <div
        //   style={{
        //     border: '1px dashed',
        //     width: '50%',
        //     fontSize: '90px !important',
        //     fontWeight: '600'
        //   }}
        // >{props.show && props.message}</div>
        <div>{props.show && props.message}</div>
      ) : ( */}
        <div
          className={styles.headerWrapper}
          // style={{
          //   // border: '1px solid lime',
          //   display: 'flex',
          //   width: '84%',
          //   marginLeft: '8%'
          // }}
        >
          {/* <div
            style={{
              border: '1px dashed',
              width: '50%',
              fontSize: '90px !important',
              fontWeight: '600'
            }}
          >
            Upcoming Menus
          </div> */}
          <div
            className={styles.headerLeft}
            // style={{
            //   border: '1px dashed',
            //   display: 'flex',
            //   alignItems: 'center',
            //   height: '40px'
            // }}
          >{props.message}</div>

          {/* <div className={styles.selectBtn + " " + (!props.show && styles.w5)}> */}
            {/* NEW CODE */}

            <div
              className={styles.dropdownWrapper}
              style={{
                // position: "absolute",
                // top: "68px",
                // right: "330px",
                height: showDropdown
                  ? 60 + props.subscribedPlans.length * 42
                  : 60,
                // border: '1px dashed'
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
                    width: "80%",
                    marginLeft: "5%",
                    textOverflow: "ellipsis",
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {currentPlan === null
                    ? "No Active Plans"
                    : JSON.parse(currentPlan.items)[0].name[0] +
                      " Meals, " +
                      JSON.parse(currentPlan.items)[0].qty +
                      " Deliveries : " +
                      currentPlan.purchase_id.substring(
                        currentPlan.purchase_id.indexOf("-") + 1,
                        currentPlan.purchase_id.length
                      )}
                </div>
                <div
                  style={{
                    width: "10%",
                    minWidth: "24px",
                    marginRight: "5%",
                  }}
                >
                  {currentPlan === null ? null : (
                    <div className={styles.whiteArrowDown} />
                  )}
                  {/* <div className={styles.whiteArrowDown} /> */}
                </div>
              </div>
              {showDropdown ? getDropdownButtons() : null}
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
                        let parsedId = mealItem.purchase_id.substring(
                          mealItem.purchase_id.indexOf("-")+1,
                          mealItem.purchase_id.length
                        );
                        
                        return (
                          <option
                            value={mealItem.purchase_id}
                           
                            key={mealItem.purchase_id}
                            
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
          {/* </div> */}
        </div>
      {/* )} */}
    </div>
  );
};

export default Menu;

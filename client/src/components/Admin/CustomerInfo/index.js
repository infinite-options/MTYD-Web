import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { descendingComparator } from '../../../reducers/helperFuncs';
import { withRouter } from "react-router";
import styles from "./customerInfo.module.css";
import AdminNavBar from '../AdminNavBar'
import zIndex from '@material-ui/core/styles/zIndex';

import m4me_logo from '../../../images/LOGO_NoBG_MealsForMe.png';

// For choosing sorting arrow to display
const ARROW_ID = 0;
const ARROW_NAME = 1;
const ARROW_ADDRESS = 2;
const ARROW_EMAIL = 3;
const ARROW_ZIP = 4;
const ARROW_PHONE = 5;

// For choosing sorting mode
const SORT_ID = 6;
const SORT_ID_REVERSE = 7;
const SORT_NAME = 8;
const SORT_NAME_REVERSE = 9;
const SORT_ADDRESS = 10;
const SORT_ADDRESS_REVERSE = 11;
const SORT_EMAIL = 12;
const SORT_EMAIL_REVERSE = 13;
const SORT_ZIP = 14;
const SORT_ZIP_REVERSE = 15;
const SORT_PHONE = 16;
const SORT_PHONE_REVERSE = 17;

const CELL = {
	id_width: '10%',
	name_width: '12%',
	email_width: '12%',
	last_order_width: '10%',
	cust_since_width: '10%',
	address_width: '12%',
	zone_width: '12%',
	zip_width: '10%',
	phone_width: '12%'
}

const ERR_VAL = <>&nbsp;<strong style={{color: 'red'}}>[NULL]</strong></>;

function CustomerInfo() {
	const [ customersByName    , setCustomersByName    ] = useState(null);
	const [ customersById	     , setCustomersById	     ] = useState(null);
	const [ customersByEmail   , setCustomersByEmail   ] = useState(null);
  const [ customersByAddress , setCustomersByAddress ] = useState(null);
  const [ customersByZipcode , setCustomersByZipcode ] = useState(null);
  const [ customersByPhone   , setCustomersByPhone   ] = useState(null);

	const [customerDropdown, setCustomerDropdown] = useState(true);
	const [selectedCustomer, selectCustomer] = useState(null);
	const [subscriptionsLoaded, setSubscriptionsLoaded] = useState(false);
	const [subscriptionsList, setSubscriptionsList] = useState(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
	const [currentPlan, setCurrentPlan] = useState(null);
	const [subHistory, setSubHistory] = useState(null);
	// const [LPLP, setLPLP] = useState(null);
	const [uniquePlans, setUniquePlans] = useState(null);
	const [billingInfo, setBillingInfo] = useState(null);

  const [searchInput, inputSearch] = useState('');
	const [nameInput, inputName] = useState('');
	const [idInput, inputId] = useState('');
	const [addressInput, inputAddress] = useState('');
	const [sortMode, setSortMode] = useState(SORT_ID);

	const [initialCustomer, setInitialCustomer] = useState(false);

	const [initialHeader, setInitialHeader] = useState(false);

	const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  });

	useEffect(() => {
    function handleResize() {
			setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
		}

    window.addEventListener('resize', handleResize);

		return _ => {
      window.removeEventListener('resize', handleResize);
		}
  });

	useEffect(() => {
		axios
      .get(`${API_URL}customer_infos`)
      .then((res) => {
				console.log("customer_infos response: ", res);

				// Response should be sorted by id
				const customers_id = res.data.result;
				const customers_name = [...customers_id] ;

				// Make a copy, sort by name
        console.log("== (1) =============================================||");
				customers_name.sort((eltA, eltB) => {

          console.log("\nWhich comes first: '" + eltA.customer_first_name + "' or '" + eltB.customer_first_name + "'?");
          if(eltA.customer_first_name === null){
            console.log("Found a NULL value!");
            return -1;
          }
          if(eltB.customer_first_name === null){
            console.log("Found a NULL value!");
            return 1;
          }
          
					let result = -descendingComparator(eltA, eltB, 'customer_first_name');
          
          if(result === 1) {
            console.log("ANSWER: ", eltB.customer_first_name);
          } else if (result === -1) {
            console.log("ANSWER: ", eltA.customer_first_name);
          } else {
            console.log("ANSWER: They're the same");
          }

					if(result !== 0) {
						return result;
					}

          if(eltA.customer_last_name === null){
            return -1;
          }
          if(eltB.customer_last_name === null){
            return 1;
          }

					// result = -descendingComparator(eltA, eltB, 'customer_last_name');
					// if(result !== 0) {
					// 	return result;
					// }
					// result = -descendingComparator(eltA, eltB, 'customer_email');
					// return result;
          result = -descendingComparator(eltA, eltB, 'customer_last_name');
					return result;
				});
        console.log("\n");
        console.log("== (2) =============================================||");

				// Make a copy, sort by email
				const customers_email = [...customers_id];
				customers_email.sort((eltA, eltB) => {
					let result = -descendingComparator(eltA, eltB, 'customer_email');
					return result;
				});

        // Make a copy, sort by address
				const customers_address = [...customers_id];
        customers_address.sort((eltA, eltB) => {

          if(eltA.customer_address === null){
            return -1;
          }
          if(eltB.customer_address === null){
            return 1;
          }
          
          let result = -descendingComparator(eltA, eltB, 'customer_address');

          if(result !== 0) {
            return result;
          }

          if(eltA.customer_city === null){
            return -1;
          }
          if(eltB.customer_city === null){
            return 1;
          }
          
          result = -descendingComparator(eltA, eltB, 'customer_city');

          if(result !== 0) {
            return result;
          }

          if(eltA.customer_state === null){
            return -1;
          }
          if(eltB.customer_state === null){
            return 1;
          }

          result = -descendingComparator(eltA, eltB, 'customer_state');
          return result;
        });

        // Make a copy, sort by zipcode
				const customers_zip = [...customers_id];
				customers_zip.sort((eltA, eltB) => {
					let result = -descendingComparator(eltA, eltB, 'customer_zip');
					return result;
				});

        // Make a copy, sort by phone
				const customers_phone = [...customers_id];
				customers_phone.sort((eltA, eltB) => {
					let result = -descendingComparator(eltA, eltB, 'customer_phone_num');
					return result;
				});

				console.log("by Name: ", customers_name);
				console.log("by ID: ", customers_id);
				console.log("by Email: ", customers_email);
        console.log("by Address: ", customers_address);
        console.log("by Zip: ", customers_zip);
        console.log("by Phone: ", customers_phone);

				setCustomersByName(customers_name);
				setCustomersById(customers_id);
				setCustomersByEmail(customers_email);
        setCustomersByAddress(customers_address);
        setCustomersByZipcode(customers_zip);
        setCustomersByPhone(customers_phone);
			})
			.catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
	}, []);

	useEffect(() => {
		console.log("dropdown menu set to: ", customerDropdown);
	}, [customerDropdown]);

	// Set history tab
	useEffect(() => {
		console.log("(rerender) setting history tab for: ", selectedCustomer);

		let tempDropdownButtons = [];
    let uniquePlansFetched = 0;
    let defaultSub = false;
    let tempUniquePlans = [];
    let dropdownIndex = 0;

		// if(subHistory !== null && LPLP !== null && typeof(LPLP) !== 'undefined'){
    if(subHistory !== null){
			console.log("meal data initialized!");

			// console.log("LPLP info: ", LPLP);

			subHistory.forEach((sub) => {

				let elIndex = tempUniquePlans.findIndex(element => element.id === sub.purchase_id);

				// console.log(' ');
				// console.log('(1) ==============================');
				// console.log("sub: ", sub);

				// let lplp_info = LPLP.find(element => element.purchase_id === sub.purchase_id);

				if (elIndex === -1) {

					// console.log("-- (1.1) UNIQUE PLAN FOUND: ", sub.purchase_id);
	
					let tempUniquePlan = {
						id: sub.purchase_uid,
						// payment_id: sub.payment_id,
						history: []
					};
	
					// console.log("-- (1.2) plan to be pushed: ", tempUniquePlan);
	
					tempUniquePlans.push(tempUniquePlan);
	
					elIndex = tempUniquePlans.findIndex(element => element.id === sub.purchase_uid);

					// console.log("-- (1.3) element index: ", elIndex);
					// console.log("-- (1.4) adding to plan: ", sub);

					// let lplp_info = LPLP.find(element => element.purchase_id === sub.purchase_id);

					// console.log("adding LPLP info: ", lplp_info);
					
					let historyTab = {
						date: sub.payment_time_stamp,
						show_dropdown: false,
						payment_id: sub.payment_id,
						// payment_info: lplp_info,
						deliveries: []
					};
					tempUniquePlans[elIndex].history.push(historyTab);
					tempUniquePlans[elIndex].history[0].deliveries.push(sub);

					uniquePlansFetched++;

				} else {
					// console.log("-- (2.1) data before: ", JSON.parse(JSON.stringify(tempUniquePlans[elIndex].history)));
					let dateIndex = tempUniquePlans[elIndex].history.findIndex(
						element => element.date === sub.payment_time_stamp
					);
					// console.log("-- (2.2) date index: ", dateIndex);
					if(dateIndex === -1) {
						// console.log("---- (2A) deliveries for date not found; creating new tab...");
						let historyTab = {
							date: sub.payment_time_stamp,
							show_dropdown: false,
							payment_id: sub.payment_id,
							// payment_info: lplp_info,
							deliveries: []
						};
						tempUniquePlans[elIndex].history.push(historyTab);
						// console.log("----      history length: ", tempUniquePlans[elIndex].history.length);
						tempUniquePlans[elIndex].history[(tempUniquePlans[elIndex].history.length)-1].deliveries.push(sub);
					} else {
						// console.log("---- (2B) deliveries for date found at " + dateIndex + "! adding to tab...");
						tempUniquePlans[elIndex].history[dateIndex].deliveries.push(sub);
					}
					// console.log("-- (2.3) data after: ", JSON.parse(JSON.stringify(tempUniquePlans[elIndex].history)));
	
				}
	
				// console.log("-- new unique plan array: ", JSON.parse(JSON.stringify(tempUniquePlans)));
				// console.log('(2) ==============================');
			});

			console.log("final unique plans: ", tempUniquePlans);

			setUniquePlans(tempUniquePlans);

		}

	// }, [subHistory, LPLP]);
  }, [subHistory]);

	const isInvalid = (val) => {
		if(
			val === null ||
			val === '' ||
			typeof(val) === 'undefined'
		) {
			return true;
		}
		return false;
	}

	const formatDate = (rawDate) => {

    let dateElements = rawDate.split(' ');
    let yyyy_mm_dd = dateElements[0].split('-');
    let month;

    // Parse month
    switch(yyyy_mm_dd[1]){
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

    let dateString = month + " " + yyyy_mm_dd[2] + ", " + yyyy_mm_dd[0];
    // console.log("date string: ", dateString);

    return dateString;
  }

	const parseID = (sub) => {
		// console.log("parseID sub: ", sub);
		let parsedId = sub.purchase_uid.substring(
			sub.purchase_id.indexOf("-")+1,
			sub.purchase_id.length
		);
		return parsedId;
	}

	const parseMeals = (sub) => {
		let parsedItems = JSON.parse(sub.items)[0];
		let parsedMeals = parsedItems.name.substring(
			0,
			parsedItems.name.indexOf(" ")
		);
		return parsedMeals;
	}

	const parseDeliveries = (sub) => {
		let parsedItems = JSON.parse(sub.items)[0];
		let parsedDeliveries = parsedItems.qty;
		return parsedDeliveries;
	}

	const setCurrentCustomer = (cust) => {
    setLoadingUserInfo(true);

		console.log("set current customer: ", cust.customer_uid);
		setCurrentPlan(null);

		// Get additional customer info
		/* AXIOS CALL HERE */
		console.log("(scc) calling predict_next_billing_date on ", cust.customer_uid);
		axios
			.get(API_URL + 'predict_next_billing_date/' + cust.customer_uid)
			.then(res => {
				console.log("(pnba) next meal info res: ", res);
				setSubscriptionsList(res.data.result);
        setLoadingUserInfo(false);
			})
			.catch(err => {
				console.log(err);
			});

		console.log("(scc) calling subscription_history on ", cust.customer_uid);
		axios
			.get(API_URL + 'subscription_history/' + cust.customer_uid)
			.then(res => {
				console.log("(sh) sub history res: ", res);
				setSubHistory(res.data.result);
			})
			.catch(err => {
				console.log(err);
			});

		// console.log("(scc) calling customer_lplp on ", cust.customer_uid);
		// axios
		// 	.get(API_URL + 'customer_lplp?customer_uid=' + cust.customer_uid)
		// 	.then(res => {
		// 		console.log("(lplp) res: ", res);
		// 		setLPLP(res.data.result);
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});

		selectCustomer(cust);
		console.log("initial customer selected!");
	}

	const sortCustomers = () => {
		let sortedCustomers; 

		// if(sortMode === SORT_ID) {
		// 	sortedCustomers = customersById;
		// } else if (sortMode === SORT_ID_REVERSE) {
		// 	sortedCustomers = [...customersById];
		// 	sortedCustomers.reverse();

		// } else if (sortMode === SORT_NAME) {
		// 	sortedCustomers = customersByName;
		// } else if (sortMode === SORT_NAME_REVERSE) {
		// 	sortedCustomers = [...customersByName];
		// 	sortedCustomers.reverse();

		// } else if (sortMode === SORT_ADDRESS) {
		// 	sortedCustomers = customersByEmail;
		// } else if (sortMode === SORT_ADDRESS_REVERSE) {
		// 	sortedCustomers = [...customersByEmail]
		// 	sortedCustomers.reverse();
		// }

    switch(sortMode){
      case SORT_ID:
        sortedCustomers = customersById;
        break;
      case SORT_ID_REVERSE:
        sortedCustomers = [...customersById];
		  	sortedCustomers.reverse();
        break;
      case SORT_NAME:
        sortedCustomers = customersByName;
        break;
      case SORT_NAME_REVERSE:
        sortedCustomers = [...customersByName];
        sortedCustomers.reverse();
        break;
      case SORT_EMAIL:
        sortedCustomers = customersByEmail;
        break;
      case SORT_EMAIL_REVERSE:
        sortedCustomers = [...customersByEmail];
        sortedCustomers.reverse();
        break;
      case SORT_ADDRESS:
        sortedCustomers = customersByAddress;
        break;
      case SORT_ADDRESS_REVERSE:
        sortedCustomers = [...customersByAddress];
        sortedCustomers.reverse();
        break;
      case SORT_PHONE:
        sortedCustomers = customersByPhone;
        break;
      case SORT_PHONE_REVERSE:
        sortedCustomers = [...customersByPhone];
        sortedCustomers.reverse();
        break;
      case SORT_ZIP:
        sortedCustomers = customersByZipcode;
        break;
      case SORT_ZIP_REVERSE:
        sortedCustomers = [...customersByZipcode];
        sortedCustomers.reverse();
        break;
      default:
        sortedCustomers = [];
    }

		return sortedCustomers;
	}

  const inSearchResults = (arr) => {
    let keywordFound = false;
    arr.forEach((arrData) => {
      if (arrData !== null && arrData.toUpperCase().includes(searchInput.toUpperCase())) {
        keywordFound = true;
      }
    });
    return keywordFound;
  }

	const filterCustomers = () => {
		let sortedCustomerButtons = [];

		// console.log("(FC) name filter: ", nameInput);
		// console.log("(FC) address filter: ", addressInput);
		// console.log("(FC) id filter: ", idInput);

		let sortedCustomers = sortCustomers();

		console.log("(FC) sorted customers: ", sortedCustomers);

		sortedCustomers.forEach((cust) => {
			console.log("(FC) customer id: ", cust.customer_uid);
			console.log("(FC) customer name: ", cust.customer_first_name);
			console.log("(FC) customer address: ", cust.customer_address);

			// Parse address filter
			let address;
			if(
				isInvalid(cust.customer_address) || 
				isInvalid(cust.customer_city)
			){
				address = '--';
			} else {
				address = cust.customer_address + ', ' + cust.customer_city + ', CA';
			}

			// Parse name filter
			let fullname;
			if(
				isInvalid(cust.customer_first_name) || 
				isInvalid(cust.customer_last_name)
			){
				fullname = '--';
			} else {
				fullname = cust.customer_first_name + ' ' + cust.customer_last_name;
			}

			// Is zip code showing up?
			let zipcode;
			if(
				isInvalid(cust.customer_zip)
			){
				zipcode = '--';
			} else {
				zipcode = cust.customer_zip;
			}

			// Is phone showing up?
			let phone;
			if(
				isInvalid(cust.customer_phone_num)
			){
				phone = '--';
			} else {
				phone = cust.customer_phone_num;
			}

			// Only show customers that satisfy filter
			// if(
			// 	cust.customer_uid.includes(idInput.toUpperCase()) && 
			// 	address.toUpperCase().includes(addressInput.toUpperCase()) && 
			// 	fullname.toUpperCase().includes(nameInput.toUpperCase())
			// ) {
      console.log("before filter: ", cust);
      // if(
      //   // cust.customer_uid.includes(searchInput.toUpperCase()) ||
      //   // fullname.toUpperCase().includes(searchInput.toUpperCase()) ||
      //   // cust.customer_email.toUpperCase().includes(searchInput.toUpperCase()) ||
      //   // address.toUpperCase().includes(searchInput.toUpperCase()) ||
      //   // cust.customer_zip.toUpperCase().includes(searchInput.toUpperCase()) ||
      //   // cust.customer_phone_num.toUpperCase().includes(searchInput.toUpperCase())
      //   // fullname.toUpperCase().includes(searchInput.toUpperCase())
      // ) {
      if(
        inSearchResults([
          cust.customer_uid, 
          fullname, 
          cust.customer_email, 
          address, 
          cust.customer_zip, 
          cust.customer_phone_num
        ]) === true
      ) {

				let buttonColor = (
					selectedCustomer !== null &&
					selectedCustomer.customer_uid === cust.customer_uid 
				? ('#F8BB17') : ('#FFF7E0'));

				sortedCustomerButtons.push(
					<div
						key={cust.customer_uid}
						className={styles.filterRow}
						style={{backgroundColor: buttonColor}}
						onClick={() => {
							// console.log("(FC) clicked: ", cust.customer_uid);
							setCurrentCustomer(cust);
						}}
					>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.id_width}}
						>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									{cust.customer_uid}
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.name_width}}
						>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									{fullname}
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.email_width}}
						>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									{cust.customer_email}
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.last_order_width}}
						>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									{/* [last order] */}
									--
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.cust_since_width}}
						>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									{/* [customer since] */}
									--
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.address_width}}
						>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									{address}
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.zone_width}}
						>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									{/* [zone] */}
									--
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.zip_width}}
						>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									{zipcode}
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.phone_width}}
						>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									{phone}
								</span>
							</div>
						</div>

					</div>
				);
			}

		});

		return (
			<div
				style={{
					zIndex: '20',
					// border: 'solid',
					marginBottom: '30px',
					marginLeft: '2%',
					width: '96%',
					height: '100%',
					// height: '300px',
					// overflow: 'auto'
					overflowY: 'scroll',
					borderBottom: 'solid'
				}}
			>
				{sortedCustomerButtons}
			</div>
		);
	}

	// Display when initial information has not been loaded on first page render
	const hideSubscribedMeals = (config) => {

		// For select meal plan section
		if(config === 'plan') {
			return (
				<div 
					style={{
						textAlign: 'center', 
						paddingTop: '80px',
						fontSize: '40px', 
						fontWeight: 'bold',
						width: '100%'
					}}
				>
					Loading Subscriptions...
				</div>
			);

		// For edit plan section
		} else {
			return (
				<div 
					style={{
						textAlign: 'center', 
						paddingTop: '70px',
						fontSize: '40px', 
						fontWeight: 'bold',
						width: '100%',
						marginBottom: '100px'
					}}
				>
					Loading Subscriptions...
				</div>
			);
		}
	}

	const countActiveSubs = () => {
		let count = 0;
		if(subscriptionsList !== null) {
			subscriptionsList.forEach((sub) => {
				if(sub.final_selection !== 'CANCELLED') {
					count++;
				}
			});
			return count;
		} else {
			return 0;
		}
	}

	const showSubscribedMeals = () => {

    let deselectedMealButton = styles.mealButton;
    let selectedMealButton = styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];

    subscriptionsList.forEach((sub) => {

			// console.log("sub: ", sub);
      // console.log("curr id: ", this.state.currentPlan.id);
      mealButtons.push(
        <div
          key={sub.purchase_uid}
          // className={
          //   this.state.currentPlan.id === sub.id
          //     ? selectedMealButton
          //     : deselectedMealButton
          // }
					// className={deselectedMealButton}
					className={
            currentPlan !== null && currentPlan.purchase_uid === sub.purchase_uid
              ? selectedMealButton
              : deselectedMealButton
          }
          onClick={() => {
						console.log("meal plan id clicked: ", sub.purchase_uid);
						console.log("meal plan data clicked: ", sub);
						setCurrentPlan(sub);
					}}
				>
          {/* <div className={styles.mealButtonEdit}>
            
					</div> */}
					<div className={styles.mealButtonSection3}>
						{/* {sub.meals} Meals, {sub.deliveries} Deliveries */}
						{parseMeals(sub)} Meals, {parseDeliveries(sub)} Deliveries
					</div>
					<div className={styles.mealButtonSection2}>
						{parseID(sub)}
					</div>
					<div className={styles.mealButtonSection}>
						{formatDate(sub.next_delivery)}
					</div>
					<div className={styles.mealButtonSection}>
						{sub.final_selection}
					</div>
					<div className={styles.mealButtonSection}>
						{formatDate(sub.next_billing_date)}
					</div>
					<div className={styles.mealButtonSection}>
						${sub.amount_due.toFixed(2)}
					</div>
				</div>
			);
		});

		// return mealButtons;
		return(
      <div style={{width: '100%'}}>
        {mealButtons}
      </div>
    );
	}

  const displayMealInfo = (data) => {
    console.log("(displayMealInfo) data: ", data);
    // console.log("(showMealsForDelivery) total meals: ", totalMeals);

    let mealsForDelivery = [];

    if(data.meal_uid !== null){
      mealsForDelivery.push(
        <div style={{display: 'inline-flex', width: '100%', height: '55px'}} tabIndex="0" 
        aria-label={formatDate(data.sel_menu_date) + ". "+ data.meal_qty+ " "+data.meal_name+"s"}
        title={formatDate(data.sel_menu_date) + ". "+ data.meal_qty+ " "+data.meal_name+"s"}>
          <div
            style={{
              // border: 'inset',
              width: '8%',
              fontSize: '20px',
              fontWeight: '600',
              // paddingTop: '15px'
            }}
          >
            {data.meal_qty}
          </div>
          <div
            style={{
              // border: 'inset',
              width: '92%',
              fontWeight: '600',
              // paddingTop: '33px'
            }}
          >
            {data.meal_name}
          </div>
          <div
            style={{
              display: 'flex',
              // border: 'inset',
              width: '0%',
              minWidth: '100px',
              textAlign: 'right',
              float: 'right',
              fontWeight: '600'
            }}
          >
            <div
              style={{
                // border: 'dashed',
                width: '100px',
                height: '100px',
                marginTop: '5px',
                backgroundImage: `url(${data.meal_photo_URL})`,
                backgroundSize: 'cover'
              }}
            >
              {/* {data.meal_photo_URL} */}
            </div>
          </div>
        </div>
      );
    } else if (data.meal_desc === "SURPRISE") {
      mealsForDelivery.push(
        <div style={{display: 'inline-flex', width: '100%', height: '55px'}} tabIndex="0" 
        aria-label={formatDate(data.sel_menu_date) + ". "+ currentPlan.meals+ "surprises"}
        title={formatDate(data.sel_menu_date) + ". "+ currentPlan.meals+ "surprises"}>
          <div
            style={{
              border: 'inset',
              width: '8%',
              fontSize: '20px',
              fontWeight: '600',
							display: 'flex',
							alignItems: 'center'
              // paddingTop: '15px'
            }}
          >
            {parseMeals(data)}
          </div>
          <div
            style={{
              border: 'inset',
							// position: 'absolute',
							// left: '100px',
							// top: '0px',
              width: '92%',
              fontWeight: '600',
							display: 'flex',
							alignItems: 'center'
              // paddingTop: '33px'
            }}
          >
            {"Surprises"}
          </div>
          <div
            style={{
              display: 'flex',
							alignItems: 'center',
              border: 'inset',
              width: '0%',
              minWidth: '50px',
              textAlign: 'right',
              float: 'right',
              fontWeight: '600'
            }}
          >
            <div
              style={{
                border: 'dashed',
                width: '50px',
                height: '50px',
                marginTop: '5px',
                borderWidth: '2px',
                // backgroundColor: 'whitesmoke',
                fontSize: '25px',
                // paddingRight: '33px',
                // paddingTop: '10px'
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
              }}
            >
              ?
            </div>
          </div>
        </div>
      );
    } else if (data.meal_desc === "SKIP") {
      mealsForDelivery.push(
        <div style={{display: 'inline-flex', width: '100%', height: '55px'}} tabIndex="0" 
        aria-label={formatDate(data.sel_menu_date) + ". skip"}
        title={formatDate(data.sel_menu_date) + ". skip"}>
          <div
            style={{
              // border: 'inset',
              width: '8%',
              fontSize: '20px',
              fontWeight: '600',
              // paddingTop: '15px'
            }}
          >
            0
          </div>
          <div
            style={{
              // border: 'inset',
              width: '92%',
              fontWeight: '600',
              // paddingTop: '33px'
            }}
          >
            {"(Skip)"}
          </div>
        </div>
      );
    }

    return (
			<div 
				style={{
					border: 'solid',
					borderColor: 'cyan',
					// display: 'flex',
					// alignItems: 'center'
				}}
			>
				{mealsForDelivery}
			</div>
		);
  }

	// const nextBillingDate = (id) => {
  //   console.log("(nbd) id: ", id);
  //   let billInfo = billingInfo.find((plan) => {
  //     return plan.purchase_id === id;
  //   });
  //   console.log("(nbd) bill info: ", billInfo);
  //   // let nextBillDate = formatDate(billInfo.next_billing_date);
  //   // return nextBillDate;
  //   return billInfo.next_billing_date;
  // }
	const nextBillingDate = (id) => {
    return "01-01-2025"
  }

	const isFutureCycle = (rawDate, billDate) => {

    // console.log("raw date: ", rawDate);
    // console.log("bill date: ", billDate);

    let dateElements = rawDate.split(' ');
    let billDateElements = billDate.split(' ');

    // console.log("date elements: ", dateElements);
    // console.log("bill date elements: ", billDateElements);

    let parsedDate = Date.parse(dateElements[0]);
    let parsedBillDate = Date.parse(billDateElements[0]);

    // console.log("parsed date: ", parsedDate);
    // console.log("parsed bill date: ", parsedBillDate);

    if (parsedDate > parsedBillDate) {
      return true;
    } else {
      return false;
    }
  }

  const isFutureDate = (rawDate) => {
    let dateElements = rawDate.split(' ');

    if(Date.parse(dateElements[0]) > Date.now()) {
      return true;
    } else {
      return false;
    }
  }

	const showPastMeals = (data) => {
    // console.log("(showPastMeals) data: ", data);

    let uniqueDates = [];

    let mealsDisplay = [];

    data.deliveries.forEach((del) => {
      // console.log("del: ", del);
      if(!isFutureCycle(del.sel_menu_date, nextBillingDate(currentPlan.purchase_id))) {
				if(uniqueDates.includes(del.sel_menu_date)){
					mealsDisplay.push(
						<div
							style={{
								// border: 'solid',
								display: 'flex'
								// marginBottom: '10px'
							}}
						>
  
							<div 
								style={{
									display: 'inline-block', 
									width: '100%',
									border: 'solid',
									borderColor: 'red'
								}}
							>
								{displayMealInfo(del)}
							</div>
		
						</div>
					);
				} else {
					uniqueDates.push(del.sel_menu_date);
					mealsDisplay.push(
						<div
							style={{
								border: 'solid',
								borderColor: 'green',
								display: 'flex',
								marginTop: '15px',
								// marginBottom: '10px'
								// fontSize: '12px'
							}}
						>
		
							<div 
								style={{
									display: 'inline-block', 
									width: '100%',
									// border: 'solid',
									// borderColor: 'orchid',
									// fontWeight: '12px'
								}}
							>
					
								<div style={{display: 'inline-flex', width: '100%'}}>
									<div
										style={{
											// border: 'inset',
											width: '50%',
											fontWeight: '600'
										}}
									>
										{
											isFutureDate(del.sel_menu_date)
												? "Meals Delivered (Future)"
												: "Meals Delivered"
										}
									</div>
									<div
										style={{
											// border: 'inset',
											width: '50%',
											textAlign: 'right',
											fontWeight: '600'
										}}
									>
										{formatDate(del.sel_menu_date)}
									</div>
								</div>
		
								{displayMealInfo(del)}
		
							</div>
		
						</div>
					);
				}
      }
    });

    return (
      <div
				style={{
					border: 'dashed',
					width: '96%',
					marginLeft: '2%',
					marginRight: '2%',
					fontSize: '12px'
				}}
			>
				{mealsDisplay}
			</div>
    );
  }

	const showHistory = () => {

		// console.log("(showHistory) current customer: ", selectedCustomer);
		// console.log("(showHistory) uniquePlans: ", uniquePlans);
		// console.log("(showHistory) currentPlan: ", currentPlan);
		let planHistory = uniquePlans.find((plan) => {
      return plan.id === currentPlan.purchase_uid;
    });

    // console.log("plan history: ", planHistory);
		// console.log("plan history 2: ", planHistory.history);

		let historyTabs = [];

    planHistory.history.forEach((sel) => {
			console.log("(showHistory) sel: ", sel);

      historyTabs.push(
				<div>

					<div    
						key={sel.date}
						style={{
							// border: 'dashed',
							display: 'flex'
						}}
					>
						<div className={styles.historyCycles}>
							Billing Date
						</div>
						<div className={styles.arrowCell}>
							<div
								className={sel.show_dropdown
									? styles.orangeArrowUp
									: styles.orangeArrowDown}
								onClick={() => {
									let uniquePlanCopy = [...uniquePlans];

									// console.log("(showHistory) unique plan copy: ", uniquePlanCopy);
									console.log("(showHistory) current plan: ", currentPlan);

									let index1 = uniquePlans.findIndex((plan) => {
										return plan.id === currentPlan.purchase_id;
									});

									console.log("(showHistory) index 1: ", index1);

									let index2 = uniquePlanCopy[index1].history.findIndex((tab) => {
										// console.log("tab date: ", tab.date);
										// console.log("sel date: ", sel.date);
										return tab.date === sel.date;
									});

									console.log("(showHistory) index 2: ", index2);

									uniquePlanCopy[index1].history[index2].show_dropdown = !uniquePlanCopy[index1].history[index2].show_dropdown;

									setUniquePlans(uniquePlanCopy);
								}}
							/>
						</div>
						<div 
							className={styles.historySection}
						>
							{sel.payment_id}
						</div>
						<div className={styles.historySection}>
							{/* {sel.payment_info.payment_time_stamp} */}
              {sel.deliveries[0].payment_time_stamp}
						</div>
						<div className={styles.historySection}>
							{/* {sel.payment_info.payment_type} */}
              {sel.deliveries[0].payment_type}
						</div>
						<div className={styles.historySection}>
							--
						</div>
						<div className={styles.historySection}>
							{/* ${sel.payment_info.subtotal.toFixed(2)} */}
              ${sel.deliveries[0].subtotal.toFixed(2)}
						</div>
						<div className={styles.historySection}>
							{/* ${sel.payment_info.amount_discount.toFixed(2)} */}
              ${sel.deliveries[0].amount_discount.toFixed(2)}
						</div>
						<div className={styles.historySection}>
							${sel.deliveries[0].service_fee.toFixed(2)}
						</div>
						<div className={styles.historySection}>
							${sel.deliveries[0].delivery_fee.toFixed(2)}
						</div>
						<div className={styles.historySection}>
							${sel.deliveries[0].driver_tip.toFixed(2)}
						</div>
						<div className={styles.historySection}>
							${sel.deliveries[0].taxes.toFixed(2)}
						</div>
						<div className={styles.historySection}>
							{/* ${sel.payment_info.ambassador_code.toFixed(2)} */}
						</div>
						<div className={styles.historySection}>
							{/* ${sel.payment_info.amount_paid.toFixed(2)} */}
						</div>
						<div className={styles.historySection}>
							{/* ${sel.payment_info.amount_due.toFixed(2)} */}
						</div>
					</div>

					{/* {sel.show_dropdown
						? <>STUFF GOES HERE</>
						: null} */}
					{sel.show_dropdown
            ? <>{showPastMeals(sel)}</>
            : null}

				</div>
			);
		});

		return(
      <div
				style={{
					// border: 'solid',
					overflowY: 'scroll',
					maxHeight: '562px',
					borderTop: 'solid',
					borderBottom: 'solid',
					borderWidth: '1px',
					borderColor: '#f26522',
					// marginBottom: '50px'
					// paddingBottom: '50px'
				}}
			>
        {historyTabs.reverse()}
      </div>
    );
	}

  return (
		<div 
			style={{
				backgroundColor: '#F26522',
				height: '10px'
			}}
		>

			<div 
				style={{
					position: 'fixed',
					backgroundColor: '#F26522',
          // border: 'solid',
          // backgroundColor: 'yellow',
					height: '110vh',
					width: '100vw',
					zIndex: '-100'
				}}
			/>

			{/* For debugging window size */}
			<span 
				style={{
					zIndex: '101',
					position: 'fixed',
					backgroundColor: 'white',
					border: 'solid',
					borderWidth: '1px',
					borderColor: 'red',
					width: '150px'
				}}
			>
				Height: {dimensions.height}px
				<br />
				Width: {dimensions.width}px
			</span>

			{/* <span 
				style={{
					zIndex: '101',
					position: 'fixed',
					top: '250px',
					backgroundColor: 'white',
					border: 'solid',
					borderWidth: '1px',
					borderColor: 'blue',
					width: '200px'
				}}
			>
				cust info width: {document.getElementById("custInfo").offsetWidth}
			</span> */}

			<AdminNavBar currentPage={'customer-info'}/>

			{customersById === null ? (
				<div
					style={{
						color: 'red',
						zIndex: '99',
						height: '100vh',
						width: '100vw',
            maxWidth: '100%',
						// height: '50vh',
						// width: '50vw',
						// border: 'inset',
						position: 'fixed',
						top: '0',
						left: '0',
						backgroundColor: '#F7F4E5',
            // backgroundColor: 'blue',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<img src={m4me_logo} />
				</div>
			) : (
				null
			)}

			{console.log("Current customer info: ", selectedCustomer)}
			{/* <div className={styles.containerCustomer}> */}
			<div 
				// className={styles.containerCustomer}
				className={
					document.getElementById("custInfo") === null ||
					document.getElementById("custInfo").offsetWidth > 800 ? (
						styles.containerCustomer
					) : (
						styles.containerCustomerNarrow
					)
				}
			>
				{selectedCustomer === null ? (
					<div 
						// id={"custInfo"}
						style={{
							display: 'flex',
							height: '100%',
							fontSize: '30px',
							fontWeight: 'bold',
							justifyContent: 'center',
							alignItems: 'center',
							alignText: 'center',
							paddingRight: '20px',
							paddingLeft: '20px',
							// border: 'solid',
							// borderColor: 'orchid'
						}}
					>
						Select a customer to display their information.
					</div>
				) : (
					document.getElementById("custInfo") === null ||
					document.getElementById("custInfo").offsetWidth > 800 ? (
            <div
              style={{
                display: 'flex',
                // border: 'dashed',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {/* {console.log("(1) width: ", document.getElementById("custInfo").offsetWidth)} */}
              <div
                style={{
                  // border: 'solid',
                  // borderColor: 'green',
                  marginLeft: '50px',
                  marginRight: '50px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '80px',
                  // zIndex: '2'
                  // width: '40%',
                  // minWidth: '300px'
                }}
              >
                <div
                  className={styles.avatar}
                >
                  ?
                </div>
                <div
                  style={{
                    // border: 'solid',
                    display: 'inline-block'
                  }}
                >
                  <div
                    style={{
                      // border: 'inset',
                      display: 'inline-flex',
                      width: '100%'
                    }}
                  >
                    <div
                      style={{
                        // border: 'solid',
                        // color: 'green'
                        fontWeight: '600',
                        fontSize: '18px',
                        marginRight: '15px'
                      }}
                    >
                      {/* {
                        selectedCustomer.customer_first_name + " " + 
                        selectedCustomer.customer_last_name
                      } */}
                      {isInvalid(selectedCustomer.customer_first_name) ? (
                        ERR_VAL
                      ) : (
                        selectedCustomer.customer_first_name
                      )}
                      &nbsp;
                      {isInvalid(selectedCustomer.customer_last_name) ? (
                        ERR_VAL
                      ) : (
                        selectedCustomer.customer_last_name
                      )}
                    </div>

                    <div
                      onClick={() => {setCustomerDropdown(!customerDropdown)}}
                      // className={customerDropdown ? (
                      //   styles.orangeArrowUp
                      // ) : (
                      //   styles.orangeArrowDown
                      // )}
                      className={customerDropdown ? (
                        loadingUserInfo ? (null) : (styles.orangeArrowUp)
                      ) : (
                        styles.orangeArrowDown
                      )}
                    />

                  </div>
                  <br />
                  <div
                    style={{
                      // border: 'inset',
                      display: 'inline-flex'
                    }}
                  >
                    <div
                      style={{
                        // border: 'solid',
                        // color: 'green'
                        color: '#f26522',
                        textDecoration: 'underline',
                        marginRight: '15px',
                        fontWeight: '500',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Send Message
                    </div>
                    <div
                      style={{
                        // border: 'solid',
                        // color: 'green'
                        color: '#f26522',
                        textDecoration: 'underline',
                        // marginRight: '15px',
                        fontWeight: '500',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Issue Coupon
                    </div>
                  </div>
                </div>
                {/* {
                  selectedCustomer.customer_first_name + " " + 
                  selectedCustomer.customer_last_name
                } */}
              </div>
              <div
                id={"custInfo"}
                style={{
                  // border: 'solid',
                  // borderColor: 'blue',
                  flexGrow: '1',
                  display: 'inline-flex',
                  position: 'relative',
                  height: '100%'
                }}
              >
                {/* {document.getElementById("custInfo").offsetWidth > 800 ? ( */}
                {document.getElementById("custInfo") !== null && loadingUserInfo === false? (
                  <>
                    <div 
                      style={{
                        // border: 'inset', 
                        position: 'absolute',
                        right: '0',
                        width: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        top: '20px',
                        height: '30px',
                        color: '#f26522',
                        fontWeight: '500'
                        // width: '25%'
                      }}
                    >
                      Total Revenue
                    </div>
                    <div 
                      style={{
                        // border: 'inset', 
                        position: 'absolute',
                        right: '0',
                        width: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        top: '50px',
                        fontSize: '24px'
                        // width: '25%'
                      }}
                    >
                      $95.90
                    </div>

                    <div 
                      style={{
                        position: 'absolute',
                        right: '200px',
                        width: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        top: '20px',
                        height: '30px',
                        color: '#f26522',
                        fontWeight: '500'
                      }}
                    >
                      Active Subscriptions
                    </div>
                    <div 
                      style={{
                        position: 'absolute',
                        right: '200px',
                        width: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        top: '50px',
                        fontSize: '24px'
                      }}
                    >
                      {countActiveSubs()}
                    </div>

                    <div 
                      style={{
                        position: 'absolute',
                        right: '400px',
                        width: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        top: '20px',
                        height: '30px',
                        color: '#f26522',
                        fontWeight: '500'
                      }}
                    >
                      Delivery Info
                    </div>
                    <div 
                      style={{
                        position: 'absolute',
                        right: '400px',
                        width: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        top: '50px',
                        fontSize: '15px'
                      }}
                    >
                      {isInvalid(selectedCustomer.customer_address) ? (
                        ERR_VAL
                      ) : (
                        selectedCustomer.customer_address
                      )}
                    </div>
                    <div 
                      style={{
                        position: 'absolute',
                        right: '400px',
                        width: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        top: '70px',
                        fontSize: '15px'
                      }}
                    >
                      {isInvalid(selectedCustomer.customer_city) ? (
                        ERR_VAL
                      ) : (
                        selectedCustomer.customer_city
                      )}
                      {", CA, "}
                      {isInvalid(selectedCustomer.customer_zip) ? (
                        ERR_VAL
                      ) : (
                        selectedCustomer.customer_zip
                      )}
                    </div>

                    <div 
                      style={{
                        position: 'absolute',
                        right: '600px',
                        width: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        top: '20px',
                        height: '30px',
                        color: '#f26522',
                        fontWeight: '500'
                      }}
                    >
                      Contact Info
                    </div>
                    <div 
                      style={{
                        position: 'absolute',
                        right: '600px',
                        width: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        top: '50px',
                        fontSize: '15px'
                      }}
                    >
                      {selectedCustomer.customer_email}
                    </div>
                    <div 
                      style={{
                        position: 'absolute',
                        right: '600px',
                        width: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        top: '70px',
                        fontSize: '15px'
                      }}
                    >
                      {selectedCustomer.customer_phone_num}
                    </div>
                  </>
                ) : (
                  <div 
                    style={{
                      // height: '170px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '30px',
                      fontWeight: 'bold',
                      // border: 'dashed',
                      width: '100%'
                    }}
                  >
                    LOADING USER INFO...
                  </div>
                )}

              </div>
            </div>
					) : (

						<>
              {/* {initialHeader === false ? setInitialHeader(true) : null} */}
              <div
                style={{
                  display: 'flex',
                  // border: 'dashed',
                  height: '100%',
                  maxHeight: '120px',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    // border: 'solid',
                    // borderColor: 'red',
                    marginLeft: '50px',
                    marginRight: '50px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '80px',
                    // zIndex: '2'
                    // width: '40%',
                    // minWidth: '300px'
                  }}
                >
                  <div
                    className={styles.avatar}
                  >
                    ?
                  </div>
                  <div
                    style={{
                      // border: 'solid',
                      display: 'inline-block'
                    }}
                  >
                    <div
                      style={{
                        // border: 'inset',
                        display: 'inline-flex',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          // border: 'solid',
                          // color: 'green'
                          fontWeight: '600',
                          fontSize: '18px',
                          marginRight: '15px'
                        }}
                      >
                        {/* {
                          selectedCustomer.customer_first_name + " " + 
                          selectedCustomer.customer_last_name
                        } */}
                        {isInvalid(selectedCustomer.customer_first_name) ? (
                          ERR_VAL
                        ) : (
                          selectedCustomer.customer_first_name
                        )}
                        &nbsp;
                        {isInvalid(selectedCustomer.customer_last_name) ? (
                          ERR_VAL
                        ) : (
                          selectedCustomer.customer_last_name
                        )}
                      </div>

                      <div
                        onClick={() => {setCustomerDropdown(!customerDropdown)}}
                        // className={customerDropdown ? (
                        //   styles.orangeArrowUp
                        // ) : (
                        //   styles.orangeArrowDown
                        // )}
                        className={customerDropdown ? (
                          loadingUserInfo ? (styles.orangeArrowHidden) : (styles.orangeArrowUp)
                        ) : (
                          styles.orangeArrowDown
                        )}
                      />

                    </div>
                    <br />
                    <div
                      style={{
                        // border: 'inset',
                        display: 'inline-flex'
                      }}
                    >
                      <div
                        style={{
                          // border: 'solid',
                          // color: 'green'
                          color: '#f26522',
                          textDecoration: 'underline',
                          marginRight: '15px',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Send Message
                      </div>
                      <div
                        style={{
                          // border: 'solid',
                          // color: 'green'
                          color: '#f26522',
                          textDecoration: 'underline',
                          // marginRight: '15px',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Issue Coupon
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id={"custInfo"}
                  style={{
                    // border: 'solid',
                    // borderColor: 'cyan',
                    flexGrow: '1',
                    display: 'inline-flex',
                    position: 'relative',
                    height: '100%',
                    // maxHeight: '120px'
                  }}
                />
              </div>

              <div
                style={{
                  // border: 'inset',
                  width: '100%',
                  // display: 'inline-block',
                  // justifyContent: 'center',
                  // whiteSpace: 'initial',
                  // float: 'left'
                  // float: 'center'
                  // paddingBottom: '20px'
                  // border: 'solid',
                  // borderColor: 'lime'
                }}
              >
                {loadingUserInfo === false ? (
                  <>
                    <div
                      style={{
                        // border: 'dashed',
                        display: 'flex',
                        justifyContent: 'center',
                        // maxWidth: '500px',
                        width: '100%',
                        marginBottom: '30px'
                      }}
                    >
                      <div className={styles.narrowInfoBox}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            height: '30px',
                            color: '#f26522',
                            fontWeight: '500'
                          }}
                        >
                          Contact Info
                        </div>
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '15px'
                          }}
                        >
                          {selectedCustomer.customer_email}
                        </div>
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '15px'
                          }}
                        >
                          {selectedCustomer.customer_phone_num}
                        </div>
                      </div>

                      <div className={styles.narrowInfoBox}>
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            height: '30px',
                            color: '#f26522',
                            fontWeight: '500'
                          }}
                        >
                          Delivery Info
                        </div>
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '15px'
                          }}
                        >
                          {isInvalid(selectedCustomer.customer_address) ? (
                            ERR_VAL
                          ) : (
                            selectedCustomer.customer_address
                          )}
                        </div>
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '15px'
                          }}
                        >
                          {isInvalid(selectedCustomer.customer_city) ? (
                            ERR_VAL
                          ) : (
                            selectedCustomer.customer_city
                          )}
                          {", CA, "}
                          {isInvalid(selectedCustomer.customer_zip) ? (
                            ERR_VAL
                          ) : (
                            selectedCustomer.customer_zip
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        // border: 'dashed',
                        display: 'flex',
                        justifyContent: 'center',
                        // maxWidth: '500px',
                        width: '100%'
                      }}
                    >

                      <div
                        className={styles.narrowInfoBox}
                      >
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            height: '30px',
                            color: '#f26522',
                            fontWeight: '500'
                          }}
                        >
                          Active Subscriptions
                        </div>
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            top: '50px',
                            fontSize: '24px'
                          }}
                        >
                          {countActiveSubs()}
                        </div>
                      </div>

                      <div
                        className={styles.narrowInfoBox}
                      >
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            height: '30px',
                            color: '#f26522',
                            fontWeight: '500'
                            // width: '25%'
                          }}
                        >
                          Total Revenue
                        </div>
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '24px'
                            // width: '25%'
                          }}
                        >
                          $95.90
                        </div>
                      </div>

                    </div>
                  </>
                ) : (
                  <div 
                    style={{
                      height: '170px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '30px',
                      fontWeight: 'bold'
                    }}
                  >
                    LOADING USER INFO...
                  </div>
                )}
              </div>
    
						</>
					)
					
				)}
			</div>

			{customersById !== null && customerDropdown ? (
				<div
					style={{
						position: 'absolute',
						// border: 'solid',
						marginBottom: '20px',
						zIndex: '9',
						height: '750px',
						width: '100vw',
            maxWidth: '100%',
            // backgroundColor: 'red'
					}}
				>
				<div
					type='text'
					style={{
						// border: 'dashed',
						// borderWidth: '1px',
						borderRadius: '15px',
						marginTop: '20px',
						marginLeft: '2%',
						marginRight: '2%',
						zIndex: '10',
						// cursor: 'pointer',
						position: 'absolute',
						backgroundColor: '#FFF7E0',
						width: '96%',
						height: '700px',
					}}
				>
					<div
						style={{
							// border: 'dashed',
							height: '60px',
							width: '96%',
							display: 'flex',
							alignItems: 'center',
							marginLeft: '2%'
						}}
					>
						<input
							type='text'
							placeholder='Search'
							className={styles.customerFilter}
							// style={{marginLeft: '2%'}}
							value={searchInput}
							onChange={e => {
								inputSearch(e.target.value)
							}}
						/>
					</div>

					<div
						style={{
							display: 'flex',
							// border: 'dashed',
							height: '60px',
							marginLeft: '2%',
							marginRight: '2%',
							paddingRight: '15px',
							borderBottom: 'solid'
						}}
					>

						<div
							className={styles.cellOuterWrapper}
							style={{
								width: CELL.id_width,
								cursor: 'pointer'
							}}
							onClick={() => {
								if (sortMode === SORT_ID) {
									setSortMode(SORT_ID_REVERSE);
								} else { 
									setSortMode(SORT_ID);
								}
							}}>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									<strong>Customer ID</strong>
								</span>
								{sortMode === SORT_ID || sortMode === SORT_ID_REVERSE ? (
									<div
										className={sortMode === SORT_ID ? (
											styles.sortingArrowDown
										) : (
											styles.sortingArrowUp
										)}
									/> 
								) : (
                  <div className={styles.sortingArrowInactive} />
                )}
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper}
							style={{
								width: CELL.name_width,
								cursor: 'pointer'
							}}
							onClick={() => {
								if (sortMode === SORT_NAME) {
									setSortMode(SORT_NAME_REVERSE);
								} else { 
									setSortMode(SORT_NAME);
								}
							}}>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									<strong>Name</strong>
								</span>
								{sortMode === SORT_NAME || sortMode === SORT_NAME_REVERSE ? (
									<div
										className={sortMode === SORT_NAME ? (
											styles.sortingArrowDown
										) : (
											styles.sortingArrowUp
										)}
									/> 
								) : (
                  <div className={styles.sortingArrowInactive} />
                )}
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper}
							style={{
								width: CELL.email_width,
								cursor: 'pointer'
							}}
							onClick={() => {
								if (sortMode === SORT_EMAIL) {
									setSortMode(SORT_EMAIL_REVERSE);
								} else { 
									setSortMode(SORT_EMAIL);
								}
							}}>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									<strong>Email</strong>
								</span>
                {sortMode === SORT_EMAIL || sortMode === SORT_EMAIL_REVERSE ? (
									<div
										className={sortMode === SORT_EMAIL ? (
											styles.sortingArrowDown
										) : (
											styles.sortingArrowUp
										)}
									/> 
								) : (
                  <div className={styles.sortingArrowInactive} />
                )}
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.last_order_width}}>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									<strong>Last Order (Date)</strong>
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.cust_since_width}}>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									<strong>Customer Since</strong>
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper}
							style={{
								width: CELL.address_width,
								cursor: 'pointer'
							}}
							onClick={() => {
								if (sortMode === SORT_ADDRESS) {
									setSortMode(SORT_ADDRESS_REVERSE);
								} else { 
									setSortMode(SORT_ADDRESS);
								}
							}}>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									<strong>Address</strong>
								</span>
								{sortMode === SORT_ADDRESS || sortMode === SORT_ADDRESS_REVERSE ? (
									<div
										className={sortMode === SORT_ADDRESS ? (
											styles.sortingArrowDown
										) : (
											styles.sortingArrowUp
										)}
									/> 
								) : (
                  <div className={styles.sortingArrowInactive} />
                )}
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper2}
							style={{width: CELL.zone_width}}>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									<strong>Delivery Zone</strong>
								</span>
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper}
							style={{
								width: CELL.zip_width,
								cursor: 'pointer'
							}}
							onClick={() => {
								if (sortMode === SORT_ZIP) {
									setSortMode(SORT_ZIP_REVERSE);
								} else { 
									setSortMode(SORT_ZIP);
								}
							}}>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									<strong>Zip Code</strong>
								</span>
                {sortMode === SORT_ZIP || sortMode === SORT_ZIP_REVERSE ? (
									<div
										className={sortMode === SORT_ZIP ? (
											styles.sortingArrowDown
										) : (
											styles.sortingArrowUp
										)}
									/> 
								) : (
                  <div className={styles.sortingArrowInactive} />
                )}
							</div>
						</div>

						<div
							className={styles.cellOuterWrapper}
							style={{
								width: CELL.phone_width,
								cursor: 'pointer'
							}}
							onClick={() => {
								if (sortMode === SORT_PHONE) {
									setSortMode(SORT_PHONE_REVERSE);
								} else { 
									setSortMode(SORT_PHONE);
								}
							}}>
							<div className={styles.cellInnerWrapper}>
								<span className={styles.cellContent}>
									<strong>Phone Number</strong>
								</span>
                {sortMode === SORT_PHONE || sortMode === SORT_PHONE_REVERSE ? (
									<div
										className={sortMode === SORT_PHONE ? (
											styles.sortingArrowDown
										) : (
											styles.sortingArrowUp
										)}
									/> 
								) : (
                  <div className={styles.sortingArrowInactive} />
                )}
							</div>
						</div>

					</div>

					<div
						style={{
							height: '540px',
							// border: 'dashed'
						}}
					>
						{filterCustomers()}
					</div>
            

				</div>
				</div>
			) : (
				null
			)}

			{/* Meal Plans */}
			{/* <div
				style={{
					border: 'solid',
					marginTop: '20px',
					height: '300px',
					zIndex: '1'
				}}
			>
				{selectedCustomer === null ? (
					<>{"Waiting for selection..."}</>
				) : (
					<>
						{"Meal Plans: "}
						<br /> */}
						<div className={styles.containerMeals}>
							<div className={styles.sectionHeader}>
								All Meal Plans
							</div>
							<div className={styles.boxScroll}>
								<div className={styles.mealButtonHeader}>
									<div className={styles.mealButtonSection2} style={{fontWeight: 'bold', fontSize: '20px'}}>
										Meal Plans
									</div>
									<div className={styles.mealButtonSection2} style={{fontWeight: 'bold', fontSize: '20px'}}>
										Purchase ID
									</div>
									<div className={styles.mealButtonSection} style={{fontWeight: 'bold', fontSize: '20px'}}>
										Next Delivery Date
									</div>
									<div className={styles.mealButtonSection} style={{fontWeight: 'bold', fontSize: '20px'}}>
										Next Delivery Status
									</div>
									<div className={styles.mealButtonSection} style={{fontWeight: 'bold', fontSize: '20px'}}>
										Next Billing Date
									</div>
									<div className={styles.mealButtonSection} style={{fontWeight: 'bold', fontSize: '20px'}}>
										Next Billing Amount
									</div>
								</div>

								{console.log("subscriptions loaded? ", subscriptionsLoaded)}
								<div style={{display: 'flex'}}>
									{subscriptionsList !== null
										? showSubscribedMeals() 
										: hideSubscribedMeals('plan')}
								</div>

							</div>
        		</div>

						{customerDropdown === false ? (
						<div
							style={{
								// marginBottom: '20px',
								paddingBottom: '20px'
								// border: 'dashed'
							}}
						>

						<div className={styles.containerHistory}>

							<div className={styles.sectionHeader}>
								Meal Plan History
							</div>

							<div 
								style={{
									display: 'inline-flex', 
									width: '100%',
									paddingRight: '15px',
									// border: 'dashed'
								}}
							>
								<div className={styles.orangeHeaderCycle}>
									Billing Cycle
								</div>
								<div 
									id={'payment-id'}
									className={styles.orangeHeaderSection}>
									Payment ID
								</div>
								<div className={styles.orangeHeaderSection}>
									Payment Time Stamp
								</div>
								<div className={styles.orangeHeaderSection}>
									Payment Type
								</div>
								<div className={styles.orangeHeaderSection}>
									Addon
								</div>
								<div className={styles.orangeHeaderSection}>
									Subtotal
								</div>
								<div className={styles.orangeHeaderSection}>
									Discount
								</div>
								<div className={styles.orangeHeaderSection}>
									Service Fee
								</div>
								<div className={styles.orangeHeaderSection}>
									Delivery Fee
								</div>
								<div className={styles.orangeHeaderSection}>
									Driver Tip
								</div>
								<div className={styles.orangeHeaderSection}>
									Taxes
								</div>
								<div className={styles.orangeHeaderSection}>
									Ambassador Code
								</div>
								<div className={styles.orangeHeaderSection}>
									Amount Paid
								</div>
								<div className={styles.orangeHeaderSection}>
									Amount Due
								</div>
							</div>

							{uniquePlans === null || currentPlan === null ? (
								<div 
									// id={"custInfo"}
									style={{
										display: 'flex',
										height: '120px',
										fontSize: '30px',
										fontWeight: 'bold',
										justifyContent: 'center',
										alignItems: 'center',
										alignText: 'center',
										paddingRight: '20px',
										paddingLeft: '20px',
										borderTop: 'solid',
										borderWidth: '1px',
										borderColor: '#F26522'
									}}
								>
									Select a meal plan to display its history.
								</div>
							) : (
								<div
									style={{
										// border: 'solid',
										width: '100%'
									}}
								>
									{showHistory()}
								</div>
							)}
						</div>
						</div>
						) : (
							null
						)}

						{/* <br /> */}
					{/* </>
				)}
			</div> */}

		</div>
  )
}

export default withRouter(CustomerInfo);
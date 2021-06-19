import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { descendingComparator } from '../../../reducers/helperFuncs';
import { withRouter } from "react-router";
import styles from "./customerInfo.module.css";
import AdminNavBar from '../AdminNavBar'

// For choosing which 
const CUS_SEL_NONE  = -1;
const CUS_SEL_NAME  =  0;
const CUS_SEL_ID    =  1;
const CUS_SEL_EMAIL =  2;

function CustomerInfo() {
	const [ customersByName  , setCustomersByName  ] = useState(null);
	const [ customersById	   , setCustomersById	   ] = useState(null);
	const [ customersByEmail , setCustomersByEmail ] = useState(null);

	const [customerDropdown, setCustomerDropdown] = useState(CUS_SEL_NONE);
	const [selectedCustomer, selectCustomer] = useState(null);
	const [subscriptionsLoaded, setSubscriptionsLoaded] = useState(false);
	const [subscriptionsList, setSubscriptionsList] = useState(null);
	const [currentPlan, setCurrentPlan] = useState(null);
	const [subHistory, setSubHistory] = useState(null);
	const [uniquePlans, setUniquePlans] = useState(null);

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
				customers_name.sort((eltA, eltB) => {
					let result = -descendingComparator(eltA, eltB, 'customer_first_name');
					if(result !== 0) {
						return result;
					}
					result = -descendingComparator(eltA, eltB, 'customer_last_name');
					if(result !== 0) {
						return result;
					}
					result = -descendingComparator(eltA, eltB, 'customer_email');
					return result;
				});

				// Make a copy, sort by email
				const customers_email = [...customers_id];
				customers_email.sort((eltA, eltB) => {
					let result = -descendingComparator(eltA, eltB, 'customer_email');
					return result;
				});

				console.log("by Name: ", customers_name);
				console.log("by ID: ", customers_id);
				console.log("by Email: ", customers_email);

				setCustomersByName(customers_name);
				setCustomersById(customers_id);
				setCustomersByEmail(customers_email);
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

		if(subHistory !== null){
			subHistory.forEach((sub) => {

				let elIndex = tempUniquePlans.findIndex(element => element.id === sub.purchase_id);

				// console.log(' ');
				// console.log('(1) ==============================');
				// console.log("sub: ", sub);

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
					
					let historyTab = {
						date: sub.payment_time_stamp,
						show_dropdown: false,
						payment_id: sub.payment_id,
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

	}, [subHistory]);

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
		console.log("parseID sub: ", sub);
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

		console.log("set current customer: ", cust.customer_uid);
		setCurrentPlan(null);

		// Get additional customer info
		/* AXIOS CALL HERE */
		console.log("(scc) calling predict_next_billing_date on ", cust.customer_uid);
		axios
			.get(API_URL + 'predict_next_billing_date/' + cust.customer_uid)
			.then(res => {
				console.log("(pnba) next meal info res: ", res);

				// setSubscriptionsLoaded(true);
				setSubscriptionsList(res.data.result);

				// let fetchedSubscriptions = res.data.result;

				// this.displayErrorModal('Success!', `
				// 	OLD MEAL PLAN: ${this.state.currentPlan.meals} meals, ${this.state.currentPlan.deliveries} deliveries
				// 	NEW MEAL PLAN: ${this.state.updatedPlan.meals} meals, ${this.state.updatedPlan.deliveries} deliveries
				// `, 
				// 	'OK', 'back'
				// );

				// console.log("subscriptions loaded? ", this.state.subscriptionsLoaded);
				// console.log(this.state.defaultSet === false);
				// console.log(this.state.refreshingPrice);
				// console.log(this.activeChanges());

				// this.loadSubscriptions(fetchedSubscriptions, this.state.discounts, UPDATED);
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

				// setSubscriptionsLoaded(true);
				// setSubscriptionsList(res.data.result);

				// let fetchedSubscriptions = res.data.result;

				// this.displayErrorModal('Success!', `
				// 	OLD MEAL PLAN: ${this.state.currentPlan.meals} meals, ${this.state.currentPlan.deliveries} deliveries
				// 	NEW MEAL PLAN: ${this.state.updatedPlan.meals} meals, ${this.state.updatedPlan.deliveries} deliveries
				// `, 
				// 	'OK', 'back'
				// );

				// console.log("subscriptions loaded? ", this.state.subscriptionsLoaded);
				// console.log(this.state.defaultSet === false);
				// console.log(this.state.refreshingPrice);
				// console.log(this.activeChanges());

				// this.loadSubscriptions(fetchedSubscriptions, this.state.discounts, UPDATED);
			})
			.catch(err => {
				console.log(err);
			});

		selectCustomer(cust);
		console.log("initial customer selected!");
	}

	const showCustomerIDs = () => {
		let sortedCustomerButtons = [];

		customersById.forEach((cust) => {
			// console.log("customer: ", cust);
			sortedCustomerButtons.push(
				<div
				  key={cust.customer_uid}
					style={{
						border: 'solid',
						borderColor: 'red',
						borderWidth: '1px',
						backgroundColor: 'yellow',
						width: '120px',
						height: '30px',
						zIndex: '3'
					}}
					onClick={() => {
						console.log("clicked: ", cust.customer_uid);
						setCurrentCustomer(cust);
					}}
				>
					{cust.customer_uid}
				</div>
			);
		});

		return (
			<>
				{sortedCustomerButtons}
			</>
		);
	}

	const showCustomerNames = () => {
		let sortedCustomerButtons = [];

		customersByName.forEach((cust) => {
			// console.log("customer: ", cust);
			sortedCustomerButtons.push(
				<div
				  key={cust.customer_uid}
					style={{
						border: 'solid',
						borderColor: 'red',
						borderWidth: '1px',
						backgroundColor: 'yellow',
						width: '120px',
						height: '30px',
						zIndex: '3'
					}}
					onClick={() => {
						console.log("clicked: ", cust.customer_uid);
						setCurrentCustomer(cust);
					}}
				>
					{cust.customer_first_name}
				</div>
			);
		});

		return (
			<>
				{sortedCustomerButtons}
			</>
		);
	}

	const showCustomerEmails = () => {
		let sortedCustomerButtons = [];

		customersByEmail.forEach((cust) => {
			// console.log("customer: ", cust);
			sortedCustomerButtons.push(
				<div
				  key={cust.customer_uid}
					style={{
						border: 'solid',
						borderColor: 'red',
						borderWidth: '1px',
						backgroundColor: 'yellow',
						width: '240px',
						height: '30px',
						zIndex: '3'
					}}
					onClick={() => {
						console.log("clicked: ", cust.customer_uid);
						setCurrentCustomer(cust);
					}}
				>
					{cust.customer_email}
				</div>
			);
		});

		return (
			<>
				{sortedCustomerButtons}
			</>
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
						${sub.amount_due}
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

	const showHistory = () => {

		console.log("(showHistory) current customer: ", selectedCustomer);
		console.log("(showHistory) uniquePlans: ", uniquePlans);
		console.log("(showHistory) currentPlan: ", currentPlan);
		let planHistory = uniquePlans.find((plan) => {
      return plan.id === currentPlan.purchase_uid;
    });

    console.log("plan history: ", planHistory);
		console.log("plan history 2: ", planHistory.history);

		let historyTabs = [];

    planHistory.history.forEach((sel) => {
      historyTabs.push(
        <div    
          key={sel.date}
          style={{marginTop: '50px', marginBottom: '50px'}}
        >

          {/*<div style={{display: 'inline-flex', width: '100%'}}>
            <div className={styles.orangeHeaderLeft}>
              Billing Date
            </div>
            <div className={styles.orangeHeaderRight}>
							{sel.payment_id}
            </div>
          </div>
					<div 
            style={{display: 'inline-flex', width: '100%', cursor: 'pointer'}}
          >
						<div className={styles.orangeHeaderLeft}>
              Meal Plan
            </div>
            <div className={styles.orangeHeaderRightArrow}>
              {currentPlan.meals} Meals, {currentPlan.deliveries} Deliveries
            </div>
            <div 
              style={{
                width: '1%',
                borderTop: 'solid',
                borderWidth: '1px',
                borderColor: '#f26522'
              }} 
            />
            <div
              style={{
                width: '3%',
                minWidth: '24px',
                // border: 'solid',
                // borderWidth: '1px',
                borderTop: 'solid',
                borderWidth: '1px',
                borderColor: '#f26522',
                paddingTop: '12px'
              }}
            >
              {sel.show_dropdown
                ? <div className={styles.orangeArrowUp} />
                : <div className={styles.orangeArrowDown} />}
            </div>
          </div>*/}
					{/* <div style={{display: 'inline-flex', width: '100%'}}>
						<div className={styles.orangeHeaderSection}>
              Billing Date
            </div>
						<div className={styles.orangeHeaderSection}>
              Payment ID
            </div>
						<div className={styles.orangeHeaderSection}>
              Payment Time Stamp
            </div>
						<div className={styles.orangeHeaderSection}>
              Billing Date
            </div>
						<div className={styles.orangeHeaderSection}>
              Billing Date
            </div>
						<div className={styles.orangeHeaderSection}>
              Billing Date
            </div>
						<div className={styles.orangeHeaderSection}>
              Billing Date
            </div>
					</div> */}

        </div>
			);
		});

		// return (
		// 	<div>
		// 		{currentPlan.purchase_uid}
		// 	</div>
		// );
		return(
      <div>
        {historyTabs.reverse()}
      </div>
    );
	}

  return (
		<div style={{backgroundColor: '#F26522'}}>

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

			<div
				style={{
					// borderBottom: 'solid',
					// borderWidth: '1px',
					display: 'flex',
					height: '80px',
					alignItems: 'center',
					backgroundColor: 'white'
				}}
			>
				<div
					style={{
						// width: '10%',
						marginLeft: '2%',
						marginRight: '2%',
						minWidth: '100px',
						color: '#F26522',
						fontWeight: '600',
						fontSize: '18px'
					}}
				>
					Customers
				</div>

				{customerDropdown === CUS_SEL_ID ? (
					<div
						type='text'
						style={{
							border: 'solid',
							borderWidth: '1px',
							width: '16%',
							height: '30px',
							marginLeft: '2%',
							marginRight: '2%',
							zIndex: '2',
							cursor: 'pointer'
							// position: 'relative',
							// display: 'flex',
							// alignItems: 'flex-start'
						}}
						onClick={() => {
							customerDropdown === CUS_SEL_NONE
								? setCustomerDropdown(CUS_SEL_ID)
								: setCustomerDropdown(CUS_SEL_NONE)
						}}
					>
						{showCustomerIDs()}
					</div>
				) : (
					<div
						type='text'
						// style={{
						// 	border: 'solid',
						// 	borderWidth: '1px',
						// 	width: '16%',
						// 	marginLeft: '2%',
						// 	marginRight: '2%',
						// 	cursor: 'pointer',
						// 	color: '#F26522'
						// }}
						className={styles.customerFilter}
						onClick={() => {
							customerDropdown === CUS_SEL_NONE
								? setCustomerDropdown(CUS_SEL_ID)
								: setCustomerDropdown(CUS_SEL_NONE)
						}}
					>
						Search by Customer ID
					</div>
				)}

				{customerDropdown === CUS_SEL_NAME ? (
					<div
						type='text'
						style={{
							border: 'solid',
							borderWidth: '1px',
							width: '16%',
							height: '30px',
							marginLeft: '2%',
							marginRight: '2%',
							zIndex: '2',
							cursor: 'pointer'
							// position: 'relative',
							// display: 'flex',
							// alignItems: 'flex-start'
						}}
						onClick={() => {
							customerDropdown === CUS_SEL_NONE
								? setCustomerDropdown(CUS_SEL_NAME)
								: setCustomerDropdown(CUS_SEL_NONE)
						}}
					>
						{showCustomerNames()}
					</div>
				) : (
					<div
						type='text'
						// style={{
						// 	border: 'solid',
						// 	borderWidth: '1px',
						// 	width: '16%',
						// 	marginLeft: '2%',
						// 	marginRight: '2%',
						// 	cursor: 'pointer',
						// 	color: '#F26522'
						// }}
						className={styles.customerFilter}
						onClick={() => {
							customerDropdown === CUS_SEL_NONE
								? setCustomerDropdown(CUS_SEL_NAME)
								: setCustomerDropdown(CUS_SEL_NONE)
						}}
					>
						Search by Name
					</div>
				)}

				{customerDropdown === CUS_SEL_EMAIL ? (
					<div
						type='text'
						style={{
							border: 'solid',
							borderWidth: '1px',
							width: '16%',
							height: '30px',
							marginLeft: '2%',
							marginRight: '2%',
							zIndex: '2',
							cursor: 'pointer'
						}}
						onClick={() => {
							customerDropdown === CUS_SEL_NONE
								? setCustomerDropdown(CUS_SEL_EMAIL)
								: setCustomerDropdown(CUS_SEL_NONE)
						}}
					>
						{showCustomerEmails()}
					</div>
				) : (
					<div
						type='text'
						// style={{
						// 	border: 'solid',
						// 	borderWidth: '1px',
						// 	width: '16%',
						// 	marginLeft: '2%',
						// 	marginRight: '2%',
						// 	cursor: 'pointer',
						// 	color: '#F26522',
						// 	height: 
						// }}
						className={styles.customerFilter}
						onClick={() => {
							customerDropdown === CUS_SEL_NONE
								? setCustomerDropdown(CUS_SEL_EMAIL)
								: setCustomerDropdown(CUS_SEL_NONE)
						}}
					>
						Search by Email
					</div>
				)}
			</div>

			{console.log("Current customer info: ", selectedCustomer)}
			<div className={styles.containerCustomer}>
				{selectedCustomer === null ? (
					<div id={"custInfo"}>{"Waiting for selection..."}</div>
				) : (
					<div
						style={{
							display: 'flex',
							// border: 'dashed',
							height: '100%',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						{/* {"Current Customer: " + selectedCustomer.customer_uid}
						<br />
						<br />
						{
							selectedCustomer.customer_first_name + " " + 
							selectedCustomer.customer_last_name
						}
						<br />
						<br />
						{"Delivery Info: "}
						<br />
						{selectedCustomer.customer_address}
						<br />
						{selectedCustomer.customer_city}
						<br />
						{selectedCustomer.customer_zip}
						<br />
						<br />
						{"Contact Info: "}
						<br />
						{selectedCustomer.customer_email}
						<br />
						{selectedCustomer.customer_phone} */}
						<div
							style={{
								border: 'solid',
								borderColor: 'red',
								marginLeft: '50px',
								marginRight: '50px',
								display: 'inline-flex',
								alignItems: 'center',
								height: '80px'
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
										{
											selectedCustomer.customer_first_name + " " + 
											selectedCustomer.customer_last_name
										}
									</div>
									<div
										style={{
											// border: 'solid',
											color: 'green'
										}}
									>
										Arrow
									</div>
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
								border: 'solid',
								borderColor: 'blue',
								flexGrow: '1',
								display: 'inline-flex',
								position: 'relative',
								height: '100%'
							}}
						>

							{document.getElementById("custInfo").offsetWidth > 800 ? (
								<>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '0',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '15px',
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
											top: '45px',
											fontSize: '24px'
											// width: '25%'
										}}
									>
										$95.90
									</div>

									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '200px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '15px',
											height: '30px',
											color: '#f26522',
											fontWeight: '500'
											// width: '25%'
										}}
									>
										Active Subscriptions
									</div>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '200px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '45px',
											fontSize: '24px'
											// width: '25%'
										}}
									>
										3
									</div>

									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '400px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '15px',
											height: '30px',
											color: '#f26522',
											fontWeight: '500'
											// width: '25%'
										}}
									>
										Delivery Info
									</div>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '400px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '45px',
											fontSize: '15px'
											// width: '25%'
										}}
									>
										6123 Corte De La Reina
									</div>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '400px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '64px',
											fontSize: '15px'
											// width: '25%'
										}}
									>
										San Jose, CA, 91109
									</div>

									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '600px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '15px',
											height: '30px',
											color: '#f26522',
											fontWeight: '500'
											// width: '25%'
										}}
									>
										Contact Info
									</div>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '600px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '45px',
											fontSize: '15px'
											// width: '25%'
										}}
									>
										pmarathay@gmail.com
									</div>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '600px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '64px',
											fontSize: '15px'
											// width: '25%'
										}}
									>
										(686) 908-9080
									</div>
										</>
									) : (
										<div>NARROW VIEW</div>
									)}

									{/*<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '0',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '15px',
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
											top: '45px',
											fontSize: '24px'
											// width: '25%'
										}}
									>
										$95.90
									</div>

									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '200px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '15px',
											height: '30px',
											color: '#f26522',
											fontWeight: '500'
											// width: '25%'
										}}
									>
										Active Subscriptions
									</div>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '200px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '45px',
											fontSize: '24px'
											// width: '25%'
										}}
									>
										3
									</div>

									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '400px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '15px',
											height: '30px',
											color: '#f26522',
											fontWeight: '500'
											// width: '25%'
										}}
									>
										Delivery Info
									</div>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '400px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '45px',
											fontSize: '15px'
											// width: '25%'
										}}
									>
										6123 Corte De La Reina
									</div>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '400px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '64px',
											fontSize: '15px'
											// width: '25%'
										}}
									>
										San Jose, CA, 91109
									</div>

									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '600px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '15px',
											height: '30px',
											color: '#f26522',
											fontWeight: '500'
											// width: '25%'
										}}
									>
										Contact Info
									</div>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '600px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '45px',
											fontSize: '15px'
											// width: '25%'
										}}
									>
										pmarathay@gmail.com
									</div>
									<div 
										style={{
											// border: 'inset', 
											position: 'absolute',
											right: '600px',
											width: '200px',
											display: 'flex',
											justifyContent: 'center',
											top: '64px',
											fontSize: '15px'
											// width: '25%'
										}}
									>
										(686) 908-9080
									</div>*/}

						</div>
					</div>
				)}
			</div>

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

						<div className={styles.containerHistory}>

							<div className={styles.sectionHeader}>
								Meal Plan History
							</div>

							<div style={{display: 'inline-flex', width: '100%'}}>
								<div className={styles.orangeHeaderCycle}>
									Billing Date
								</div>
								<div className={styles.orangeHeaderSection}>
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
									style={{
										// border: 'solid',
										width: '100%'
									}}
								>
									{"Waiting for selection..."}
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

						<br />
					{/* </>
				)}
			</div> */}

		</div>
  )
}

export default withRouter(CustomerInfo);
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { descendingComparator } from '../../../reducers/helperFuncs';
import { withRouter } from "react-router";
import styles from "./customerInfo.module.css";

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
		console.log("(rerender) setting history tab...");

		let tempDropdownButtons = [];
    let uniquePlansFetched = 0;
    let defaultSub = false;
    let tempUniquePlans = [];
    let dropdownIndex = 0;

		if(subHistory !== null){
			subHistory.forEach((sub) => {

				let elIndex = tempUniquePlans.findIndex(element => element.id === sub.purchase_id);

				console.log(' ');
				console.log('(1) ==============================');
				console.log("sub: ", sub);

				if (elIndex === -1) {

					console.log("-- (1.1) UNIQUE PLAN FOUND: ", sub.purchase_id);
	
					let tempUniquePlan = {
						id: sub.purchase_id,
						history: []
					};
	
					console.log("-- (1.2) plan to be pushed: ", tempUniquePlan);
	
					tempUniquePlans.push(tempUniquePlan);
	
					elIndex = tempUniquePlans.findIndex(element => element.id === sub.purchase_id);

					console.log("-- (1.3) element index: ", elIndex);
					console.log("-- (1.4) adding to plan: ", sub);
					
					let historyTab = {
						date: sub.payment_time_stamp,
						show_dropdown: false,
						deliveries: []
					};
					tempUniquePlans[elIndex].history.push(historyTab);
					tempUniquePlans[elIndex].history[0].deliveries.push(sub);

					uniquePlansFetched++;

				}
			});

			console.log("final unique plans: ", tempUniquePlans);

		}

	}, [subHistory]);

	const setCurrentCustomer = (cust) => {

		console.log("set current customer: ", cust.customer_uid);

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

			console.log("sub: ", sub);
      // console.log("curr id: ", this.state.currentPlan.id);
      mealButtons.push(
        <div
          key={sub.id}
          // className={
          //   this.state.currentPlan.id === sub.id
          //     ? selectedMealButton
          //     : deselectedMealButton
          // }
					className={deselectedMealButton}
          onClick={() => {

					}}
				>
          {/* <div className={styles.mealButtonEdit}>
            
					</div> */}
					<div className={styles.mealButtonSection2}>
						{sub.meals} Meals, {sub.deliveries} Deliveries
					</div>
					<div className={styles.mealButtonSection2}>
						{sub.purchase_uid}
					</div>
					<div className={styles.mealButtonSection}>
						{sub.next_delivery}
					</div>
					<div className={styles.mealButtonSection}>
						{sub.final_selection}
					</div>
					<div className={styles.mealButtonSection}>
						{sub.next_billing_date}
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

  return (
		<div style={{backgroundColor: '#F26522'}}>
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
						width: '10%',
						marginLeft: '2%',
						marginRight: '2%',
						minWidth: '100px'
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
						style={{
							border: 'solid',
							borderWidth: '1px',
							width: '16%',
							marginLeft: '2%',
							marginRight: '2%',
							cursor: 'pointer'
						}}
						onClick={() => {
							customerDropdown === CUS_SEL_NONE
								? setCustomerDropdown(CUS_SEL_ID)
								: setCustomerDropdown(CUS_SEL_NONE)
						}}
					>
						ID
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
						style={{
							border: 'solid',
							borderWidth: '1px',
							width: '16%',
							marginLeft: '2%',
							marginRight: '2%',
							cursor: 'pointer'
						}}
						onClick={() => {
							customerDropdown === CUS_SEL_NONE
								? setCustomerDropdown(CUS_SEL_NAME)
								: setCustomerDropdown(CUS_SEL_NONE)
						}}
					>
						Name
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
							// position: 'relative',
							// display: 'flex',
							// alignItems: 'flex-start'
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
						style={{
							border: 'solid',
							borderWidth: '1px',
							width: '16%',
							marginLeft: '2%',
							marginRight: '2%',
							cursor: 'pointer'
						}}
						onClick={() => {
							customerDropdown === CUS_SEL_NONE
								? setCustomerDropdown(CUS_SEL_EMAIL)
								: setCustomerDropdown(CUS_SEL_NONE)
						}}
					>
						Email
					</div>
				)}
			</div>

			{console.log("Current customer info: ", selectedCustomer)}
			<div className={styles.containerCustomer}>
				{selectedCustomer === null ? (
					<>{"Waiting for selection..."}</>
				) : (
					<>
						{"Current Customer: " + selectedCustomer.customer_uid}
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
						{selectedCustomer.customer_phone}
					</>
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
							<div className={styles.boxScroll}>
								<div className={styles.mealButtonHeader}>
									{/* <div className={styles.mealButtonEdit}>
										
									</div> */}
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
						  {"HISTORY GOES HERE"}
						</div>

						<br />
					{/* </>
				)}
			</div> */}

		</div>
  )
}

export default withRouter(CustomerInfo);
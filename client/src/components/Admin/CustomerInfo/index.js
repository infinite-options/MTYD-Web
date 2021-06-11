import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { descendingComparator } from '../../../reducers/helperFuncs';
import { withRouter } from "react-router";

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
		// console.log("dropdown menu set to: ", customerDropdown);
	}, [customerDropdown]);

	const setCurrentCustomer = (cust) => {

		console.log("set current customer: ", cust.customer_uid);

		// Get additional customer info
		/* AXIOS CALL HERE */
		axios
			.get(API_URL + 'predict_next_billing_date/' + cust.customer_uid)
			.then(res => {
				console.log("(pnba) next meal info res: ", res);

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

  return (
		<>
			<div
				style={{
					borderBottom: 'solid',
					borderWidth: '1px',
					display: 'flex',
					height: '40px',
					alignItems: 'center'
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

				{/* <div
					type='text'
					style={{
						border: 'solid',
						borderWidth: '1px',
						width: '16%',
						marginLeft: '2%',
						marginRight: '2%'
					}}
					onClick={() => {
						customerDropdown === CUS_SEL_NONE
							? setCustomerDropdown(CUS_SEL_ID)
							: setCustomerDropdown(CUS_SEL_NONE)
					}}
				>
					ID
				</div> */}
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

			{/* {selectedCustomer === null ? (
				<div
					style={{
						border: 'solid',
						marginTop: '20px',
						height: '50px',
						zIndex: '1'
					}}
				>
					Waiting for selection...
				</div>
			) : (
				<div
					style={{
						border: 'solid',
						marginTop: '20px',
						height: '50px',
						zIndex: '1'
					}}
				>
					Current Customer: {selectedCustomer.customer_uid}
				</div>
			)} */}
			{/* {selectedCustomer === null ? (
				<div
					style={{
						border: 'solid',
						marginTop: '20px',
						height: '50px',
						zIndex: '1'
					}}
				>
					Waiting for selection...
				</div>
			) : ( */}

			{console.log("Current customer info: ", selectedCustomer)}
			<div
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
			<div
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
						<br />
					</>
				)}
			</div>

		</>
  )
}

export default withRouter(CustomerInfo);
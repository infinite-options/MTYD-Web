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
		console.log("dropdown menu set to: ", customerDropdown);
	}, [customerDropdown]);

	const showCustomerDropdown = (sortType) => {
		let sortedCustomerButtons = [];

		customersById.forEach((cust) => {
			// console.log("customer: ", cust);
			sortedCustomerButtons.push(
				<div
					style={{
						border: 'solid',
						borderColor: 'red',
						borderWidth: '1px',
						backgroundColor: 'yellow',
						width: '120px',
						zIndex: '5'
					}}
				>
					{cust.customer_uid}
				</div>
			);
		});

		return (
			<>
				{/* <div>cust 1</div>
				<div>cust 2</div>
				<div>cust 3</div> */}
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
						{showCustomerDropdown(CUS_SEL_ID)}
					</div>
				) : (
					<div
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
					</div>
				)}

				<div
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
							? setCustomerDropdown(CUS_SEL_NAME)
							: setCustomerDropdown(CUS_SEL_NONE)
					}}
				>
					Name
				</div>
				<div
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
							? setCustomerDropdown(CUS_SEL_EMAIL)
							: setCustomerDropdown(CUS_SEL_NONE)
					}}
				>
					Email
				</div>
			</div>
		</>
  )
}

export default withRouter(CustomerInfo);
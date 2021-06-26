import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { descendingComparator } from '../../../reducers/helperFuncs';
import { withRouter } from "react-router";
import styles from "./ingredientsUnits.module.css";
import AdminNavBar from '../AdminNavBar'
import zIndex from '@material-ui/core/styles/zIndex';
import trashIcon from '../../../images/trash_icon.png';
import xButton from '../../../images/x_button.png';
import editIcon from '../../../images/edit_icon.png';

import m4me_logo from '../../../images/LOGO_NoBG_MealsForMe.png';

const CREATE_NONE = 0;
const CREATE_INGREDIENT = 1;
const CREATE_UNIT = 2;

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

function IngredientsUnits() {
	const [selectedCustomer, selectCustomer] = useState(null);
	const [subHistory, setSubHistory] = useState(null);
	// const [LPLP, setLPLP] = useState(null);
	const [uniquePlans, setUniquePlans] = useState(null);

  const [savedIngredients, saveIngredients] = useState(null);
  const [savedUnits, saveUnits] = useState(null);

  const [savedMeals, saveMeals] = useState(null);
  const [savedBusinesses, saveBusinesses] = useState(null);

  const [loadingData, setLoadingData] = useState(true);

  const [createModal, setCreateModal] = useState(CREATE_INGREDIENT);

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
    let remoteDataFetched = 0;

    axios
      .get(API_URL + 'ingredients')
      .then(res => {
        console.log("(ingredients) res: ", res);
        remoteDataFetched++;
        if(remoteDataFetched === 4) {
          setLoadingData(false);
        }
        saveIngredients(res.data.result);
      })
      .catch(err => {
        console.log(err);
      });

    axios
      .get(API_URL + 'measure_unit')
      .then(res => {
        console.log("(measure_unit) res: ", res);
        remoteDataFetched++;
        if(remoteDataFetched === 4) {
          setLoadingData(false);
        }
        saveUnits(res.data.result);
      })
      .catch(err => {
        console.log(err);
      });

    axios
      .get(API_URL + 'all_businesses')
      .then(res => {
        console.log("(all_businesses) res: ", res);
        remoteDataFetched++;
        if(remoteDataFetched === 4) {
          setLoadingData(false);
        }
        saveBusinesses(res.data.result);
      })
      .catch(err => {
        console.log(err);
      });

    axios
      .get(API_URL + 'meals')
      .then(res => {
        console.log("(meals) res: ", res);
        remoteDataFetched++;
        if(remoteDataFetched === 4) {
          setLoadingData(false);
        }
        saveMeals(res.data.result);
      })
      .catch(err => {
        console.log(err);
      });

	}, []);

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

	const formatDate = (rawDate, withTime) => {

    let dateElements = rawDate.split(' ');

    let yyyy_mm_dd = dateElements[0].split('-');
    let hh_mm_ss = dateElements[1].split('-');

    let month;
    let hour;

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
        month = "[ERROR]";
    }

    // Parse time of day
    switch(hh_mm_ss[0]){

      // AM
      case "00":
        hour = "12";
        break;
      case "01":
        hour = "1";
        break;
      case "02":
        hour = "2";
        break;
      case "03":
        hour = "3";
        break;
      case "04":
        hour = "4";
        break;
      case "05":
        hour = "5";
        break;
      case "06":
        hour = "6";
        break;
      case "07":
        hour = "7";
        break;
      case "08":
        hour = "8";
        break;
      case "09":
        hour = "9";
        break;
      case "10":
        hour = "10";
        break;
      case "11":
        hour = "11";
        break;

      // PM
      case "12":
        hour = "12";
        break;
      case "13":
        hour = "1";
        break;
      case "14":
        hour = "2";
        break;
      case "15":
        hour = "3";
        break;
      case "16":
        hour = "4";
        break;
      case "17":
        hour = "5";
        break;
      case "18":
        hour = "6";
        break;
      case "19":
        hour = "7";
        break;
      case "20":
        hour = "8";
        break;
      case "21":
        hour = "9";
        break;
      case "22":
        hour = "10";
        break;
      case "23":
        hour = "11";
        break;

      default:
        hour = "[ERROR]";
    }

    let dateString = month + " " + yyyy_mm_dd[2] + ", " + yyyy_mm_dd[0];

    if(withTime === true) {
      dateString = dateString + " " + hour + ":" + hh_mm_ss[1] + " PM";
    }

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

  const displayIngredients = () => {

    if(savedIngredients === null) {
      return (
        <div>
          LOADING...
        </div>
      );
    }

    let ingredientDisplay = [];
    savedIngredients.forEach((ingredient) => {
      console.log("(displayIngredients) ingredient: ", ingredient);
      ingredientDisplay.push(
        <div
          style={{
            border: 'solid',
            width: '100%',
            height: '60px',
            display: 'inline-flex'
          }}
        >
          {/* <div
            style={{
              border: 'dashed',
              height: '100%',
              width: '25%'
            }}
          >
            {ingredient.ingredient_desc}
          </div>
          <div
            style={{
              border: 'dashed',
              height: '100%',
              width: '25%'
            }}
          >
            {ingredient.package_size}
          </div>
          <div
            style={{
              border: 'dashed',
              height: '100%',
              width: '25%'
            }}
          >
            {isInvalid(ingredient.package_unit) ? '--' : ingredient.package_unit}
          </div>
          <div
            style={{
              border: 'dashed',
              height: '100%',
              width: '25%'
            }}
          >
            ${ingredient.package_cost.toFixed(2)}
          </div> */}

          <div className={styles.cellOuterWrapper}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {ingredient.ingredient_desc}
              </span>
            </div>
          </div>

          <div className={styles.cellOuterWrapper}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {ingredient.package_size}
              </span>
            </div>
          </div>

          <div className={styles.cellOuterWrapper}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {isInvalid(ingredient.package_unit) ? '--' : ingredient.package_unit}
              </span>
            </div>
          </div>

          <div className={styles.cellOuterWrapper}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {ingredient.package_size}
              </span>
            </div>
          </div>

        </div>
      );
    });
    return (
      <div
        style={{
          overflowY: 'scroll',
          height: '300px'
        }}
      >
        {ingredientDisplay}
      </div>
    );
  }

  const displayUnits = () => {

    if(savedUnits === null) {
      return null;
    }

    let unitDisplay = [];
    savedUnits.forEach((unit) => {
      console.log("(displayUnits) units: ", unit);
      unitDisplay.push(
        <div
          style={{
            border: 'solid',
            width: '100%',
            height: '60px',
            display: 'inline-flex'
          }}
        >
          <div className={styles.cellOuterWrapper}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {unit.type}
              </span>
            </div>
          </div>

          <div className={styles.cellOuterWrapper}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {unit.recipe_unit}
              </span>
            </div>
          </div>

          <div className={styles.cellOuterWrapper}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {unit.conversion_ratio}
              </span>
            </div>
          </div>

          <div className={styles.cellOuterWrapper}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {unit.common_unit}
              </span>
            </div>
          </div>

        </div>
      );
    });
    return (
      <div
        style={{
          overflowY: 'scroll',
          height: '300px'
        }}
      >
        {unitDisplay}
      </div>
    );
  }

  const displayCreateModal = () => {
    if(createModal === CREATE_INGREDIENT) {
      return (
        <div
          style={{
            // border: 'solid',
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '24%',
            // height: '600px',
            height: '500px',
            backgroundColor: 'white',
            // display: 'flex',
            // alignItems: 'center'
          }}
        >
          <div
            style={{
              position: 'relative',
              height: '100px',
              // display: 'flex',
              display: 'inline-flex',
              // alignItems: 'center',
              // paddingTop: '10px',
              border: 'solid',
              borderColor: 'red',
              width: '100%',
              // width: '60%',
              // width: '200px',
              fontWeight: 'bold',
              // paddingLeft: '20px',
              // paddingRight: '70px',
              fontSize: '26px',
              // textOverflow: 'ellipsis',
              // display: 'block',
              // whiteSpace: 'nowrap',
              // overflow: 'hidden'
            }}
          >

          <div className={styles.cellOuterWrapper2}>
            <div className={styles.cellInnerWrapper2}>
              <span className={styles.cellContent2}>
                Create New Ingredient
              </span>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              border: 'dashed',
              width: '40px',
              minWidth: '40px',
              height: '40px',
              minHeight: '40px',
              backgroundImage: `url(${xButton})`,
              backgroundSize: '100%',
              cursor: 'pointer'
            }}
            onClick={() => {
              setCreateModal(CREATE_NONE)
            }}
          />

            {/* <div
              style={{
                alignSelf: 'flex-start',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                // padding: '5px 5px',   
                border: 'solid',
                borderColor: 'red',
                height: '100%'
              }}
            >

              <div
                style={{
                  border: 'dashed',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  // height: '100%'
                }}
              >
                Create New Ingredient
              </div>
            </div> */}
          </div>

          {/* <div className={styles.cellOuterWrapper}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                Type
              </span>
            </div>
          </div> */}

        </div>
      );
    } else if (createModal === CREATE_UNIT) {
      return (
        <div
          style={{
            // border: 'solid',
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '24%',
            height: '500px',
            backgroundColor: 'white',
            // display: 'flex',
            // alignItems: 'center'
          }}
        >
          <div
            style={{
              position: 'relative',
              height: '100px',
              // display: 'flex',
              display: 'inline-flex',
              // alignItems: 'center',
              // paddingTop: '10px',
              border: 'solid',
              borderColor: 'red',
              width: '100%',
              // width: '60%',
              // width: '200px',
              fontWeight: 'bold',
              // paddingLeft: '20px',
              // paddingRight: '70px',
              fontSize: '26px',
              // textOverflow: 'ellipsis',
              // display: 'block',
              // whiteSpace: 'nowrap',
              // overflow: 'hidden'
            }}
          >

            <div className={styles.cellOuterWrapper2}>
              <div className={styles.cellInnerWrapper2}>
                <span className={styles.cellContent2}>
                  Create New Unit
                </span>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                border: 'dashed',
                width: '40px',
                minWidth: '40px',
                height: '40px',
                minHeight: '40px',
                backgroundImage: `url(${xButton})`,
                backgroundSize: '100%',
                cursor: 'pointer'
              }}
              onClick={() => {
                setCreateModal(CREATE_NONE)
              }}
            />

          </div>
        </div>
      );
    } else {
      return null;
    }
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

			<AdminNavBar currentPage={'ingredients-units'}/>

			{loadingData === true ? (
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

      <div
        style={{
          // border: 'solid',
          marginTop: '20px',
          borderRadius: '15px',
          marginLeft: '2%',
          width: '96%',
          backgroundColor: 'white',
          height: '120px',
          display: 'flex',
          alignItems: 'center'
        }}
      >

        <div
          style={{
            border: 'solid',
            // width: '60%',
            width: '300px',
            fontWeight: 'bold',
            paddingLeft: '20px',
            fontSize: '26px'
          }}
        >
          Ingredients and Units
        </div>

        <div
          style={{
            border: 'solid',
            borderColor: 'blue',
            flexGrow: '1',
            display: 'inline-flex',
            position: 'relative',
            height: '100%'
          }}
        >
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
            Total no. of Restaurants
          </div>
          <div 
            style={{
              position: 'absolute',
              right: '400px',
              width: '200px',
              display: 'flex',
              justifyContent: 'center',
              top: '50px',
              fontSize: '24px'
            }}
          >
            {savedBusinesses === null ? 'LOADING...' : savedBusinesses.length}
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
            Total no. of Meals
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
            {savedMeals === null ? 'LOADING...' : savedMeals.length}
          </div>
          <div 
            style={{
              position: 'absolute',
              right: '0',
              width: '200px',
              display: 'flex',
              justifyContent: 'center',
              top: '20px',
              height: '30px',
              color: '#f26522',
              fontWeight: '500'
            }}
          >
            Total no. of Ingredients
          </div>
          <div 
            style={{
              position: 'absolute',
              right: '0',
              width: '200px',
              display: 'flex',
              justifyContent: 'center',
              top: '50px',
              fontSize: '24px'
            }}
          >
            {savedIngredients === null ? 'LOADING...' : savedIngredients.length}
          </div>
        </div>
      </div>

      <div
        style={{
          border: 'dashed',
          display: 'inline-flex',
          width: '100%'
        }}
      >
        <div
          style={{
            // border: 'solid',
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '34%',
            height: '500px',
            backgroundColor: 'white',
            marginBottom: '20px'
            // display: 'flex',
            // alignItems: 'center'
          }}
        >
          <div
            style={{
              height: '90px',
              // paddingTop: '20px',
              // display: 'flex',
              // alignItems: 'center',

              border: 'solid',
              // width: '60%',
              // width: '200px',
              fontWeight: 'bold',
              paddingLeft: '20px',
              fontSize: '26px',
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                border: 'dashed'
              }}
            >
              Ingredients
            </div>
            <div
              style={{
                // position: 'absolute',
                // top: '10px',
                // left: '168px',
                fontSize: '36px',
                // fontWeight: '700',
                cursor: 'pointer',
                border: 'dashed'
              }}
              onClick={() => {
                setCreateModal(CREATE_INGREDIENT)
              }}
            >
              &nbsp;+&nbsp;
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              border: 'solid',
              width: '100%',
              height: '60px',
              display: 'inline-flex',
              paddingRight: '15px'
            }}
          >

            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContent}>
                  Ingredient Name
                </span>
              </div>
            </div>

            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContent}>
                  Package Size
                </span>
              </div>
            </div>
            
            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContent}>
                  Package Unit
                </span>
              </div>
            </div>

            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContent}>
                  Package Cost
                </span>
              </div>
            </div>

          </div>

          {displayIngredients()}

        </div>

        <div
          style={{
            // border: 'solid',
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '34%',
            height: '500px',
            backgroundColor: 'white',
            // display: 'flex',
            // alignItems: 'center'
          }}
        >
          <div
            style={{
              height: '90px',
              // paddingTop: '20px',
              // display: 'flex',
              // alignItems: 'center',

              border: 'solid',
              // width: '60%',
              // width: '200px',
              fontWeight: 'bold',
              paddingLeft: '20px',
              fontSize: '26px',
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                border: 'dashed'
              }}
            >
              Units
            </div>
            <div
              style={{
                // position: 'absolute',
                // top: '10px',
                // left: '168px',
                fontSize: '36px',
                // fontWeight: '700',
                cursor: 'pointer',
                border: 'dashed'
              }}
              onClick={() => {
                setCreateModal(CREATE_UNIT)
              }}
            >
              &nbsp;+&nbsp;
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              border: 'solid',
              width: '100%',
              height: '60px',
              display: 'inline-flex',
              paddingRight: '15px'
            }}
          >

            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContent}>
                  Type
                </span>
              </div>
            </div>

            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContent}>
                  Unit Name
                </span>
              </div>
            </div>

            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContent}>
                  Conversion Ratio
                </span>
              </div>
            </div>

            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContent}>
                  Base Unit
                </span>
              </div>
            </div>

          </div>

          {displayUnits()}

        </div>
        
        {displayCreateModal()}

      </div>

		</div>
  )
}

export default withRouter(IngredientsUnits);
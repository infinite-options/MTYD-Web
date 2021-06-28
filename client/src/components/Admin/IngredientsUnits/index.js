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
// import editIcon from '../../../images/edit_icon.png';

import m4me_logo from '../../../images/LOGO_NoBG_MealsForMe.png';

const CREATE_NONE = 0;
const CREATE_INGREDIENT = 1;
const CREATE_UNIT = 2;
const EDIT_INGREDIENT = 3;

const SAVE_INGREDIENT = 0;
const SAVE_UNIT = 1;

const HIDE_POPUP = true;
const SHOW_POPUP = false;

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

  const [savedIngredients, saveIngredients] = useState(null);
  const [savedUnits, saveUnits] = useState(null);

  const [savedMeals, saveMeals] = useState(null);
  const [savedBusinesses, saveBusinesses] = useState(null);

  const [loadingData, setLoadingData] = useState(true);

  const [createModal, setCreateModal] = useState(CREATE_INGREDIENT);

  const [ingredientInput, inputIngredient] = useState('');
  const [packageSizeInput, inputPackageSize] = useState('');
  const [packageUnitSelection, selectPackageUnit] = useState('');
  const [packageCostInput, inputPackageCost] = useState('');

  const [unitTypeSelection, selectUnitType] = useState(null);
  const [unitNameInput, inputUnitName] = useState('');
  const [convertRatioInput, inputConvertRatio] = useState('');
  const [baseUnitSelection, selectBaseUnit] = useState('');

  const [show_pack_unit_dropd, toggle_pack_unit_dropd] = useState(false);
  const [show_base_unit_dropd, toggle_base_unit_dropd] = useState(false);
  const [show_unit_type_dropd, toggle_unit_type_dropd] = useState(false);

  const [showEditModal, toggleEditModal] = useState(false);

  const [savingUnit, setSavingUnit] = useState(false);
  const [savingIngredient, setSavingIngredient] = useState(false);

  const [showPopup, togglePopup] = useState(false);
  const [popupModal, setPopupModal] = useState(null);

  const [editIngredientID, setEditIngredientID] = useState(null);

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
        // saveIngredients(res.data.result);
        let uniqueIngredients = [];
        res.data.result.forEach((ingredient) => {
          let ingredientFound = uniqueIngredients.findIndex(element => element.ingredient_uid === ingredient.ingredient_uid);
          // console.log("Ingredient found? ", ingredientFound);
          if(ingredientFound === -1) {
            uniqueIngredients.push(ingredient);
          }
        });
        saveIngredients(uniqueIngredients);
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

  // const [ingredientInput, inputIngredient] = useState('');
  // const [packageSizeInput, inputPackageSize] = useState('');
  // const [packageUnitSelection, selectPackageUnit] = useState('');
  // const [packageCostInput, inputPackageCost] = useState('');

  // const [unitTypeSelection, selectUnitType] = useState(null);
  // const [unitNameInput, inputUnitName] = useState('');
  // const [convertRatioInput, inputConvertRatio] = useState('');
  // const [baseUnitSelection, selectBaseUnit] = useState('');
  const disableSaveButton = (type) => {

    if(savingIngredient || savingUnit) {
      return true;
    }

    if(type === SAVE_INGREDIENT) {
      if(
        ingredientInput === '' ||
        packageSizeInput === '' ||
        packageUnitSelection === '' ||
        packageCostInput === ''
      ) {
        console.log("save new ingredient: disabled");
        return true;
      } else {
        console.log("save new ingredient: enabled");
        return false;
      }
    
    } else if (type === SAVE_UNIT) {
      if(
        unitTypeSelection === null ||
        unitNameInput === '' ||
        convertRatioInput === '' ||
        baseUnitSelection === ''
      ) {
        return true;
      } else {
        return false;
      }

    } else {
      return true;
    }
  }

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

  const resetDropdowns = () => {
    toggle_base_unit_dropd(false);
    toggle_pack_unit_dropd(false);
    toggle_unit_type_dropd(false);
  }

  const resetInputs = () => {
    // const [ingredientInput, inputIngredient] = useState('');
    // const [packageSizeInput, inputPackageSize] = useState('');
    // const [packageUnitSelection, selectPackageUnit] = useState('');
    // const [packageCostInput, inputPackageCost] = useState('');
  
    // const [unitTypeSelection, selectUnitType] = useState(null);
    // const [unitNameInput, inputUnitName] = useState('');
    // const [convertRatioInput, inputConvertRatio] = useState('');
    // const [baseUnitSelection, selectBaseUnit] = useState('');
    resetDropdowns();
    inputIngredient('');
    inputPackageSize('');
    selectPackageUnit('');
    inputPackageCost('');
    selectUnitType(null);
    inputUnitName('');
    inputConvertRatio('');
    selectBaseUnit('');
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
      // console.log("(displayIngredients) ingredient: ", ingredient);
      ingredientDisplay.push(
        <div
          style={{
            // border: 'dashed',
            borderBottom: 'solid',
            borderColor: '#F8BB17',
            width: '100%',
            height: '60px',
            display: 'inline-flex'
          }}
        >

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
                {ingredient.package_cost}
              </span>
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <div 
              className={styles.editButton}
              onClick={() => {
                console.log("editing ingredient: ", ingredient);
                // resetDropdowns();
                resetInputs();
                inputIngredient(ingredient.ingredient_desc);
                inputPackageSize(ingredient.package_size);
                selectPackageUnit(ingredient.package_unit);
                inputPackageCost(ingredient.package_cost);
                setEditIngredientID(ingredient.ingredient_uid);
                setCreateModal(EDIT_INGREDIENT);
                // const [ingredientInput, inputIngredient] = useState('');
                // const [packageSizeInput, inputPackageSize] = useState('');
                // const [packageUnitSelection, selectPackageUnit] = useState('');
                // const [packageCostInput, inputPackageCost] = useState('');
              }}
            />
          </div>

        </div>
      );
    });
    return (
      <div
        style={{
          overflowY: 'scroll',
          height: '300px',
          borderBottom: 'solid',
          borderColor: '#F8BB17'
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
      // console.log("(displayUnits) units: ", unit);
      unitDisplay.push(
        <div
          style={{
            // border: 'solid',
            borderBottom: 'solid',
            borderColor: '#F8BB17',
            width: '100%',
            height: '60px',
            display: 'inline-flex'
          }}
        >
          <div className={styles.cellOuterWrapper3}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {unit.type}
              </span>
            </div>
          </div>

          <div className={styles.cellOuterWrapper3}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {unit.recipe_unit}
              </span>
            </div>
          </div>

          <div className={styles.cellOuterWrapper3}>
            <div className={styles.cellInnerWrapper}>
              <span className={styles.cellContent}>
                {unit.conversion_ratio}
              </span>
            </div>
          </div>

          <div className={styles.cellOuterWrapper3}>
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
          height: '300px',
          borderBottom: 'solid',
          borderColor: '#F8BB17'
        }}
      >
        {unitDisplay}
      </div>
    );
  }

  const showUnitsForType = () => {
    if (unitTypeSelection === 'mass') {
      return (
        <>
          <div 
            className={styles.createModalDropdownButton}
            onClick={() => {
              selectBaseUnit('g');
            }}
          >
            g
          </div>
        </>
      );
    } else if (unitTypeSelection === 'volume') {
      return (
        <>
          <div 
            className={styles.createModalDropdownButton}
            onClick={() => {
              selectBaseUnit('L');
              resetDropdowns();
            }}
          >
            L
          </div>
        </>
      );
    } else if (unitTypeSelection === 'length') {
      return (
        <>
          <div 
            className={styles.createModalDropdownButton}
            onClick={() => {
              selectBaseUnit('cm');
              resetDropdowns();
            }}
          >
            cm
          </div>
        </>
      );
    } else if (unitTypeSelection === 'each') {
      return (
        <>
          <div 
            className={styles.createModalDropdownButton}
            onClick={() => {
              selectBaseUnit('ea');
              resetDropdowns();
            }}
          >
            ea
          </div>
        </>
      );
    }
  }

  const saveNewIngredient = () => {
    console.log("Saving new ingredient...");
    setSavingIngredient(true);

    axios
      .post(API_URL + 'ingredients', {
        ingredient_desc: ingredientInput,
        package_size: packageSizeInput,
        package_unit: packageUnitSelection,
        package_cost: packageCostInput
      })
      .then(res => {
        console.log("(ingredients -- save) res: ", res);

        let newUID = res.data.ingredient_uid;

        if(res.status >= 200 || res.status < 300) {

          // Need to refresh ingredients list after successful creation
          axios
            .get(API_URL + 'ingredients')
            .then(res => {
              console.log("(ingredients -- refresh) res: ", res);

              let uniqueIngredients = [];
              res.data.result.forEach((ingredient) => {
                let ingredientFound = uniqueIngredients.findIndex(element => element.ingredient_uid === ingredient.ingredient_uid);
                if(ingredientFound === -1) {
                  uniqueIngredients.push(ingredient);
                }
              });
              saveIngredients(uniqueIngredients);

              // Show popup indicating success
              setPopup(SHOW_POPUP, "Success!", `
                Ingredient created successfully: 
              `,`
                ${ingredientInput} (UID: ${newUID})
              `);

              setSavingIngredient(false);
            })
            .catch(err => {
              console.log(err);
              if(err.response.data.message) {
                console.log("error: ", err.response);
                setPopup(SHOW_POPUP, "Error", `
                  Error refreshing ingredients: 
                `,`
                  ${err.response.data.message}
                `);
              } else {
                setPopup(SHOW_POPUP, "Error", `
                  Something went wrong
                `);
              }
              setSavingIngredient(false);
            });

        } else {
          setPopup(SHOW_POPUP, "Error", `
            Ingredient creation unsuccessful: 
          `,`
            ${res.data.message})
          `);
        }

        // if(res.status >= 200 || res.status < 300) {
        //   setPopup(SHOW_POPUP, "Success!", `
        //     Ingredient created successfully: 
        //   `,`
        //     ${ingredientInput} (UID: ${res.data.ingredient_uid})
        //   `);
        // } else {
        //   setPopup(SHOW_POPUP, "Error", `
        //     Ingredient creation unsuccessful: 
        //   `,`
        //     ${res.data.message})
        //   `);
        // }
        // setSavingIngredient(false);

      })
      .catch(err => {
        console.log(err);
        if(err.response.data.message) {
          console.log("error: ", err.response);
          setPopup(SHOW_POPUP, "Error", `
            Error creating ingredient: 
          `,`
            ${err.response.data.message}
          `);
        } else {
          setPopup(SHOW_POPUP, "Error", `
            Something went wrong
          `);
        }
        setSavingIngredient(false);
      });
  }

  const saveEditIngredient = () => {
    console.log("(SEI) Saving new ingredient...");
    setSavingIngredient(true);

    console.log("(SEI) uid: ", editIngredientID);
    console.log("(SEI) desc: ", ingredientInput);
    console.log("(SEI) unit: ", packageUnitSelection);
    console.log("(SEI) size: ", packageSizeInput);
    console.log("(SEI) cost: ", packageCostInput);

    axios
      .put(API_URL + 'ingredients', {
        ingredient_uid: editIngredientID,
        ingredient_desc: ingredientInput,
        package_size: packageSizeInput,
        package_unit: packageUnitSelection,
        package_cost: packageCostInput
      })
      .then(res => {
        console.log("(ingredients -- edit) res: ", res);
      })
      .catch(err => {
        console.log(err);
        if(err.response) {
          console.log("error: ", err.response);
        }
      });
  }

  const saveNewUnit = () => {
    console.log("Saving new unit...");
    setSavingUnit(true);

    // const [unitTypeSelection, selectUnitType] = useState(null);
    // const [unitNameInput, inputUnitName] = useState('');
    // const [convertRatioInput, inputConvertRatio] = useState('');
    // const [baseUnitSelection, selectBaseUnit] = useState('');

    axios
      .post(API_URL + 'measure_unit', {
        type: unitTypeSelection,
        recipe_unit: unitNameInput,
        conversion_ratio: convertRatioInput,
        common_unit: baseUnitSelection
      })
      .then(res => {
        console.log("(measure_unit -- edit) res: ", res);
      })
      .catch(err => {
        console.log(err);
        if(err.response) {
          console.log("error: ", err.response);
        }
      });
  }

  const setPopup = (hide, header, message_line1, message_line2) => {

    if(hide === true) {
      setPopupModal(null);
    } else {
      setPopupModal(
        <div className = {styles.popupBackground}>
          <div className  = {styles.popupContainer}>

            <div className={styles.popupHeaderWrapper}>
                {header}
            </div>

            {/* <div className={styles.popupMessageWrapper}>    
              {message}
            </div> */}
            {message_line2 === null ? (
              <div className={styles.popupMessageWrapper}>    
                {message_line1}
              </div>
            ) : (
              <>
                <div className={styles.popupMessageWrapper}>    
                  {message_line1}
                  <br />
                  {message_line2}
                </div>
              </>
            )}

            <div className={styles.popupBtnWrapper}>
              <button 
                className={styles.popupBtn}
                onClick = {() => {
                  setPopupModal(null);
                }}
              >
                OK
              </button>
            </div>

          </div>
        </div>
      );
    }

  }

  const displayCreateModal = () => {
    if(createModal === CREATE_INGREDIENT) {
      return (
        <div
          style={{
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '28%',
            height: '420px',
            backgroundColor: 'white'
          }}
        >
          <div
            style={{
              position: 'relative',
              height: '100px',
              display: 'inline-flex',
              // border: 'solid',
              // borderColor: 'red',
              width: '100%',
              fontWeight: 'bold',
              fontSize: '26px'
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
                // border: 'dashed',
                width: '40px',
                minWidth: '40px',
                height: '40px',
                minHeight: '40px',
                backgroundImage: `url(${xButton})`,
                backgroundSize: '100%',
                cursor: 'pointer'
              }}
              onClick={() => {
                // resetDropdowns();
                resetInputs();
                setCreateModal(CREATE_NONE)
              }}
            />

          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Ingredient
                </div>
              </div>
            </div>
            <div className={styles.createModalInputWrapper}>
              <input
                className={styles.createModalInput}
                onChange={(e) => {
                  inputIngredient(e.target.value)
                }}
                value={ingredientInput}
              />
            </div>
          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Package Size
                </div>
              </div>
            </div>
            <div className={styles.createModalInputWrapper}>
              <input
                className={styles.createModalInput}
                onChange={(e) => {
                  inputPackageSize(e.target.value)
                }}
                value={packageSizeInput}
              />
            </div>
          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Package Unit
                </div>
              </div>
            </div>
            <div className={styles.createModalDropdownWrapper}>
              <div 
                className={styles.createModalDropdown}
                onClick={() => {toggle_pack_unit_dropd(!show_pack_unit_dropd)}}
              >
                {show_pack_unit_dropd ? (
                  <>
                    <div className={styles.grayArrowUp}/>
                    <div
                      style={{
                        display: 'inline-block',
                        alignItems: 'top',
                        marginTop: '36px',
                        borderStyle: 'solid solid none solid',
                        borderWidth: '2px',
                        borderColor: '#ADADAD',
                        width: 'calc(100% + 4px)',
                        position: 'absolute',
                        left: '-2px',
                        top: '0',
                        marginRight: '200px',
                        zIndex: '10'
                      }}
                    >
                      <div 
                        className={styles.createModalDropdownButton}
                        onClick={() => {
                          selectPackageUnit('lb');
                          resetDropdowns();
                        }}
                      >
                        lb
                      </div>
                      <div 
                        className={styles.createModalDropdownButton}
                        onClick={() => {
                          selectPackageUnit('kg');
                          resetDropdowns();
                        }}
                      >
                        kg
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.grayArrowDown}/>
                )}
                <div className={styles.centeringWrapper}>
                  {packageUnitSelection}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Package Cost
                </div>
              </div>
            </div>
            <div className={styles.createModalInputWrapper}>
              <input
                className={styles.createModalInput}
                onChange={(e) => {
                  inputPackageCost(e.target.value)
                }}
                // placeholder={"$0.00"}
                value={packageCostInput}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <button
              disabled={disableSaveButton(SAVE_INGREDIENT)}
              className={styles.saveButton}
              onClick={() => {saveNewIngredient()}}
            >
              Save New Ingredient
            </button>
          </div>

        </div>
      );
    } else if (createModal === CREATE_UNIT) {
      return (
        <div
          style={{
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '28%',
            height: '420px',
            backgroundColor: 'white'
          }}
        >
          <div
            style={{
              position: 'relative',
              height: '100px',
              display: 'inline-flex',
              // border: 'solid',
              // borderColor: 'red',
              width: '100%',
              fontWeight: 'bold',
              fontSize: '26px'
            }}
          >

            <div className={styles.cellOuterWrapper2}>
              <div className={styles.cellInnerWrapper2}>
                <span className={styles.cellContent2}>
                  Create New Measure Unit
                </span>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                // border: 'dashed',
                width: '40px',
                minWidth: '40px',
                height: '40px',
                minHeight: '40px',
                backgroundImage: `url(${xButton})`,
                backgroundSize: '100%',
                cursor: 'pointer'
              }}
              onClick={() => {
                // resetDropdowns();
                resetInputs();
                setCreateModal(CREATE_NONE)
              }}
            />

          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper2}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Select a Type
                </div>
              </div>
            </div>
            <div className={styles.createModalDropdownWrapper}>
              <div 
                className={styles.createModalDropdown}
                onClick={() => {toggle_unit_type_dropd(!show_unit_type_dropd)}}
              >
                {show_unit_type_dropd ? (
                  <>
                    <div className={styles.grayArrowUp}/>
                    <div
                      style={{
                        display: 'inline-block',
                        alignItems: 'top',
                        marginTop: '36px',
                        borderStyle: 'solid solid none solid',
                        borderWidth: '2px',
                        borderColor: '#ADADAD',
                        width: 'calc(100% + 4px)',
                        position: 'absolute',
                        left: '-2px',
                        top: '0',
                        marginRight: '200px',
                        zIndex: '10'
                      }}
                    >
                      <div 
                        className={styles.createModalDropdownButton}
                        onClick={() => {
                          selectUnitType('mass');
                          selectBaseUnit('kg');
                          resetDropdowns();
                        }}
                      >
                        mass
                      </div>
                      <div 
                        className={styles.createModalDropdownButton}
                        onClick={() => {
                          selectUnitType('volume');
                          selectBaseUnit('L');
                          resetDropdowns();
                        }}
                      >
                        volume
                      </div>
                      <div 
                        className={styles.createModalDropdownButton}
                        onClick={() => {
                          selectUnitType('length');
                          selectBaseUnit('cm');
                          resetDropdowns();
                        }}
                      >
                        length
                      </div>
                      <div 
                        className={styles.createModalDropdownButton}
                        onClick={() => {
                          selectUnitType('each');
                          selectBaseUnit('ea');
                          resetDropdowns();
                        }}
                      >
                        each
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.grayArrowDown}/>
                )}
                <div className={styles.centeringWrapper}>
                  {unitTypeSelection}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper2}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Unit Name
                </div>
              </div>
            </div>
            <div className={styles.createModalInputWrapper}>
              <input
                className={styles.createModalInput}
                disabled={unitTypeSelection === null}
                onChange={(e) => {
                  inputUnitName(e.target.value)
                }}
                value={unitNameInput}
              />
            </div>
          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper2}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Conversion Ratio
                </div>
              </div>
            </div>
            <div className={styles.createModalInputWrapper}>
              <input
                className={styles.createModalInput}
                // className={styles.createModalDropdown}
                disabled={unitTypeSelection === null}
                // className={unitTypeSelection === '' ? (
                //   styles.createModalDropdown_disabled
                // ) : (
                //   styles.createModalDropdown
                // )}
                onChange={(e) => {
                  inputConvertRatio(e.target.value)
                }}
                value={convertRatioInput}
              />
            </div>
          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper2}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Base Unit
                </div>
              </div>
            </div>
            <div className={styles.createModalDropdownWrapper}>
              <div 
                // className={styles.createModalDropdown}
                disabled={unitTypeSelection === null}
                className={unitTypeSelection === null ? (
                  styles.createModalDropdown_disabled
                ) : (
                  styles.createModalDropdown
                )}
                onClick={() => {toggle_base_unit_dropd(!show_base_unit_dropd)}}
              >
                {show_base_unit_dropd ? (
                  <>
                    <div className={styles.grayArrowUp}/>
                    <div
                      style={{
                        display: 'inline-block',
                        alignItems: 'top',
                        marginTop: '36px',
                        borderStyle: 'solid solid none solid',
                        borderWidth: '2px',
                        borderColor: '#ADADAD',
                        width: 'calc(100% + 4px)',
                        position: 'absolute',
                        left: '-2px',
                        top: '0',
                        marginRight: '200px',
                        zIndex: '10'
                      }}
                    >
                      {showUnitsForType()}
                    </div>
                  </>
                ) : (
                  <div className={styles.grayArrowDown}/>
                )}
                <div className={styles.centeringWrapper}>
                  {baseUnitSelection}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <button
              disabled={disableSaveButton(SAVE_UNIT)}
              className={styles.saveButton}
              onClick={() => {saveNewUnit()}}
            >
              Save New Measure Unit
            </button>
          </div>

        </div>
      );
    } else if (createModal === EDIT_INGREDIENT) {
      return (
        <div
          style={{
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '28%',
            height: '420px',
            backgroundColor: 'white'
          }}
        >
          <div
            style={{
              position: 'relative',
              height: '100px',
              display: 'inline-flex',
              // border: 'solid',
              // borderColor: 'red',
              width: '100%',
              fontWeight: 'bold',
              fontSize: '26px'
            }}
          >

            <div className={styles.cellOuterWrapper2}>
              <div className={styles.cellInnerWrapper2}>
                <span className={styles.cellContent2}>
                  Edit Ingredient
                </span>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                // border: 'dashed',
                width: '40px',
                minWidth: '40px',
                height: '40px',
                minHeight: '40px',
                backgroundImage: `url(${xButton})`,
                backgroundSize: '100%',
                cursor: 'pointer'
              }}
              onClick={() => {
                // resetDropdowns();
                resetInputs();
                setCreateModal(CREATE_NONE)
              }}
            />

          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Ingredient
                </div>
              </div>
            </div>
            <div className={styles.createModalInputWrapper}>
              <input
                className={styles.createModalInput}
                onChange={(e) => {
                  inputIngredient(e.target.value)
                }}
                value={ingredientInput}
              />
            </div>
          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Package Size
                </div>
              </div>
            </div>
            <div className={styles.createModalInputWrapper}>
              <input
                className={styles.createModalInput}
                onChange={(e) => {
                  inputPackageSize(e.target.value)
                }}
                value={packageSizeInput}
              />
            </div>
          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Package Unit
                </div>
              </div>
            </div>
            <div className={styles.createModalDropdownWrapper}>
              <div 
                className={styles.createModalDropdown}
                onClick={() => {toggle_pack_unit_dropd(!show_pack_unit_dropd)}}
              >
                {show_pack_unit_dropd ? (
                  <>
                    <div className={styles.grayArrowUp}/>
                    <div
                      style={{
                        display: 'inline-block',
                        alignItems: 'top',
                        marginTop: '36px',
                        borderStyle: 'solid solid none solid',
                        borderWidth: '2px',
                        borderColor: '#ADADAD',
                        width: 'calc(100% + 4px)',
                        position: 'absolute',
                        left: '-2px',
                        top: '0',
                        marginRight: '200px',
                        zIndex: '10'
                      }}
                    >
                      <div 
                        className={styles.createModalDropdownButton}
                        onClick={() => {
                          selectPackageUnit('lb');
                          resetDropdowns();
                        }}
                      >
                        lb
                      </div>
                      <div 
                        className={styles.createModalDropdownButton}
                        onClick={() => {
                          selectPackageUnit('kg');
                          resetDropdowns();
                        }}
                      >
                        kg
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.grayArrowDown}/>
                )}
                <div className={styles.centeringWrapper}>
                  {packageUnitSelection}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.createModalSection}>
            <div className={styles.CML_OuterWrapper}>
              <div className={styles.CML_InnerWrapper}>
                <div className={styles.createModalLabel}>
                  Package Cost
                </div>
              </div>
            </div>
            <div className={styles.createModalInputWrapper}>
              <input
                className={styles.createModalInput}
                onChange={(e) => {
                  inputPackageCost(e.target.value)
                }}
                // placeholder={"$0.00"}
                value={packageCostInput}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <button
              disabled={disableSaveButton(SAVE_INGREDIENT)}
              className={styles.saveButton}
              onClick={() => {saveEditIngredient()}}
            >
              Save Edit Ingredient
            </button>
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

      {popupModal}

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
            // border: 'solid',
            // width: '60%',
            width: '300px',
            fontWeight: 'bold',
            paddingLeft: '20px',
            fontSize: '26px'
          }}
        >
          Ingredients and Units
        </div>

        {dimensions.width > 970 ? (
          <div
            style={{
              // border: 'solid',
              // borderColor: 'blue',
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
                fontSize: '24px',
                fontWeight: '600'
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
                fontSize: '24px',
                fontWeight: '600'
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
                fontSize: '24px',
                fontWeight: '600'
              }}
            >
              {savedIngredients === null ? 'LOADING...' : savedIngredients.length}
            </div>
          </div>
        ) : (
          <>NARROW VIEW</>
        )}
        
      </div>

      <div
        style={{
          // border: 'dashed',
          display: 'inline-flex',
          width: '100%'
        }}
      >
        <div
          style={createModal === CREATE_NONE ? ({
            // border: 'solid',
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '47%',
            height: '500px',
            backgroundColor: 'white',
            marginBottom: '20px'
            // display: 'flex',
            // alignItems: 'center'
          }) : ({
            // border: 'solid',
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '32%',
            height: '500px',
            backgroundColor: 'white',
            marginBottom: '20px'
            // display: 'flex',
            // alignItems: 'center'
          })}
        >
          <div
            style={{
              height: '90px',
              // paddingTop: '20px',
              // display: 'flex',
              // alignItems: 'center',
              // border: 'solid',
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
            <div>Ingredients</div>
            <div
              style={{
                // position: 'absolute',
                // top: '10px',
                // left: '168px',
                fontSize: '36px',
                // fontWeight: '700',
                cursor: 'pointer',
                // border: 'dashed'
              }}
              onClick={() => {
                // resetDropdowns();
                resetInputs();
                setCreateModal(CREATE_INGREDIENT)
              }}
            >
              &nbsp;+&nbsp;
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              // border: 'solid',
              width: '100%',
              height: '60px',
              display: 'inline-flex',
              paddingRight: '15px',
              borderBottom: 'solid',
              color: '#F8BB17'
            }}
          >

            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContentOrange}>
                  Ingredient Name
                </span>
              </div>
            </div>

            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContentOrange}>
                  Package Size
                </span>
              </div>
            </div>
            
            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContentOrange}>
                  Package Unit
                </span>
              </div>
            </div>

            <div className={styles.cellOuterWrapper}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContentOrange}>
                  Package Cost
                </span>
              </div>
            </div>

            <div className={styles.buttonWrapper} />

          </div>

          {displayIngredients()}

        </div>

        <div
          style={createModal === CREATE_NONE ? ({
            // border: 'solid',
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '47%',
            height: '500px',
            backgroundColor: 'white',
            marginBottom: '20px'
            // display: 'flex',
            // alignItems: 'center'
          }) : ({
            // border: 'solid',
            marginTop: '20px',
            borderRadius: '15px',
            marginLeft: '2%',
            width: '32%',
            height: '500px',
            backgroundColor: 'white',
            marginBottom: '20px'
            // display: 'flex',
            // alignItems: 'center'
          })}
        >
          <div
            style={{
              height: '90px',
              // paddingTop: '20px',
              // display: 'flex',
              // alignItems: 'center',

              // border: 'solid',
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
            <div>Units</div>
            <div
              style={{
                // position: 'absolute',
                // top: '10px',
                // left: '168px',
                fontSize: '36px',
                // fontWeight: '700',
                cursor: 'pointer',
                // border: 'dashed'
              }}
              onClick={() => {
                // resetDropdowns();
                resetInputs();
                setCreateModal(CREATE_UNIT)
              }}
            >
              &nbsp;+&nbsp;
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              // border: 'solid',
              borderBottom: 'solid',
              color: '#F8BB17',
              width: '100%',
              height: '60px',
              display: 'inline-flex',
              paddingRight: '15px'
            }}
          >

            <div className={styles.cellOuterWrapper3}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContentOrange}>
                  Type
                </span>
              </div>
            </div>

            <div className={styles.cellOuterWrapper3}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContentOrange}>
                  Unit Name
                </span>
              </div>
            </div>

            <div className={styles.cellOuterWrapper3}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContentOrange}>
                  Conversion Ratio
                </span>
              </div>
            </div>

            <div className={styles.cellOuterWrapper3}>
              <div className={styles.cellInnerWrapper}>
                <span className={styles.cellContentOrange}>
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
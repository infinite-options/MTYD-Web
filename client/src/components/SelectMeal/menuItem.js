import React, {Fragment} from "react";
import styles from "./selectmeal.module.css";
import Tooltip from '@material-ui/core/Tooltip';
class MenuItem extends React.Component {

  menuItemFilter = () => {
    const {cartItems, show} = this.props;
    let x = this.props.data.filter(
      date => date.menu_date === this.props.myDate
    );
    let menuHTML

    if (this.props.addon === false) {
      x = x.filter(item => item.meal_cat !== 'Add-On')
    } else {
      x = x.filter(item => item.meal_cat === 'Add-On')
    }

    // console.log(x)

    menuHTML = x.map((menuitem, index) => (
      <div
        key={index}
        className={styles.menuitemIndividual + " px-5"}
      >

        <div
          style={{
            backgroundImage: `url(${menuitem.meal_photo_URL})`,
            backgroundSize: "cover",
            backgroundPosition:'center'
            
          }}
          className={styles.menuItem}
        >
          {/* <div className={styles.menuElements} id={styles.eyeBtn}></div> */}


            <Tooltip title={menuitem.meal_desc}>
              <button className={styles.heartButton}/>
            </Tooltip>

          {show ? (
            <Fragment>
              <button
                onClick={() => this.props.removeFromCart(menuitem)}
                id={styles.minusButton}
                className={styles.menuElements}
                style={{
                  width: '50px',
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                -
              </button>

              {cartItems.length > 0 &&
                cartItems.map((item, index) => {
                return (
                  item.menu_meal_id === menuitem.menu_meal_id && (
                    <div key = {index}
                      style={{
                        border: '1px solid',
                        borderRadius: 5,
                        backgroundColor: 'white',
                        opacity: 0.9,
                        width: '50px',
                        height: '50px',
                      }}
                      className={styles.numElements}
                      id={styles.mealCounter}
                    >
                      {item.count}
                    </div>
                  )
                );
            })}

              <button
                onClick={() => this.props.addToCart(menuitem)}
                id={styles.plusButton}
                className={styles.menuElements}
                style={{
                  width: '50px',
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                +
              </button> 
            </Fragment>
          ) : (
            ""
          )}
        </div>
        <p id={styles.menuItemTitle}>{menuitem.meal_name}</p>
        <p id={styles.menuItemTitle}>cal:{menuitem.meal_calories}</p>
      </div>
    ))

    return menuHTML

  }

  render() {

    return (
      <Fragment>
        {this.menuItemFilter()}
      </Fragment>
    );
  }
}

export default MenuItem;

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
        {console.log(menuitem)}

        <div
          style={{
            backgroundImage: `url(${menuitem.meal_photo_URL})`,
            backgroundSize: "cover",
            boxShadow:
              "0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
          }}
          className={styles.menuItem}
        >
          <div className={styles.menuElements} id={styles.eyeBtn}></div>

          {cartItems.length > 0 &&
            cartItems.map((item, index) => {
              return (
                item.menu_meal_id === menuitem.menu_meal_id && (
                  <p key = {index}
                    style={{
                      textAlign: "center",
                      padding: "0px",
                      color: "black",
                      fontSize: "25px",
                      lineHeight: "2"
                    }}
                    className={styles.menuElements}
                    id={styles.mealCounter}
                  >
                    {item.count}
                  </p>
                )
              );
            })}
              <Tooltip title={menuitem.meal_desc}>
              <button
                // onClick={() => this.props.removeFromCart(menuitem)}
                className={styles.infoButton}
              >
                i
              </button>
            </Tooltip>

          {show ? (
            <Fragment>
              <button
                onClick={() => this.props.removeFromCart(menuitem)}
                id={styles.minusButton}
                className={styles.menuElements}
              >
                -
              </button>
              <button
                onClick={() => this.props.addToCart(menuitem)}
                id={styles.plusButton}
                className={styles.menuElements}
              >
                +
              </button> 
            </Fragment>
          ) : (
            ""
          )}
        </div>
        <p id={styles.menuItemTitle}>{menuitem.meal_name}</p>
        <p id={styles.menuItemDesc}>${menuitem.meal_price}</p>
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

import React, {Fragment} from "react";
import styles from "./selectmeal.module.css";
class MenuItem extends React.Component {
  render() {
    const {cartItems, show} = this.props;
    let x = this.props.data.filter(
      date => date.menu_date === this.props.myDate
    );

    return (
      <Fragment>
        {x.map(menuitem => (
          <div
            key={menuitem.meal_uid}
            className={styles.menuitemIndividual + " px-5"}
          >
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
                cartItems.map(item => {
                  return (
                    item.menu_meal_id === menuitem.menu_meal_id && (
                      <p
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
        ))}
      </Fragment>
    );
  }
}

export default MenuItem;

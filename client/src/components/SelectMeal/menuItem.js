import React, {Fragment} from "react";
import styles from "./selectmeal.module.css";
import Tooltip from '@material-ui/core/Tooltip';
import emptyHeart from './images/empty-heart.png'
import fullHeart from  './images/full-heart.png'

function changeHeart(e){
  console.log("button clicked")
  e.target.setAttribute('src',fullHeart)
  e.target.setAttribute('width',35)
  e.target.setAttribute('height',35)

}

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
            <button className={styles.infoButton}>
              i
            </button>
          </Tooltip>

          <button 
          onClick={changeHeart}
          className={styles.heartButton}
          >
            <img src={emptyHeart}
                  style={{
                    height:35,
                    width:35,
                  }}
            ></img>
          </button>

          {show ? (
            <Fragment>
              <button
                onClick={() => this.props.removeFromCart(menuitem)}
                style={{
                  border: 'none',
                  borderRadius: 5,
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',
                  top:'50'
                }}
                className={styles.minusElements}
                id={styles.mealCounter}
              >
                -
              </button>

              {cartItems.length > 0 &&
                cartItems.map((item, index) => {
                return (
                  item.menu_meal_id === menuitem.menu_meal_id && (
                    <div key = {index}
                      style={{
                        border: 'none',
                        borderRadius: 5,
                        backgroundColor: 'white',
                        width: '50px',
                        height: '50px',
                        top:'50'
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
                style={{
                  border: 'none',
                  borderRadius: 5,
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',
                  top:'50'
                }}
                className={styles.plusElements}
                id={styles.mealCounter}
              >
                +
              </button> 
            </Fragment>
          ) : (
            ""
          )}
        </div>
        <p id={styles.menuItemTitle}
        style = {{
          display:'inline-block',
          overflow:'hidden',
          whiteSpace:'nowrap'
          }}>
            {menuitem.meal_name}
            <br/>cal:{menuitem.meal_calories}
          </p>
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

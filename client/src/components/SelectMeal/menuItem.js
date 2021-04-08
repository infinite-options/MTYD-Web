import React, {Fragment} from "react";
import styles from "./selectmeal.module.css";
import Tooltip from '@material-ui/core/Tooltip';
import emptyHeart from './images/emptyHeart.svg'
import fullHeart from  './images/fullHeart.svg'
import info from  './images/info.svg'
import {API_URL} from "../../reducers/constants";
import axios from "axios";







class MenuItem extends React.Component {

  constructor(props){
    super();
    this.props={
      favList:[],
    }
  }

  changeHeart(e){
    e.target.setAttribute('src',fullHeart)
    e.target.setAttribute('width',40)
    e.target.setAttribute('height',40)
  
  }


  favoritePost(customer_uid,meal_uid){
    const data = {
      customer_uid: customer_uid,
      favorite:meal_uid,
    }
    axios
    .post(
      `${API_URL}favourite_food/post`,
      data
    ).then(response => {
      console.log(response);
    })
  
  }

  favoriteGet(customer_uid){
    const data = {
      customer_uid: customer_uid
    }
    axios
    .post(
      `${API_URL}favourite_food/get`,
      data
    ).then(response => {
      // console.log(response.data.result);
    })
  }

  menuItemFilter = () => {

    if(this.props.customer_uid==null){
      // console.log("user not login")
    }
    else{
      // console.log(this.props.customer_uid)
      this.favoriteGet(this.props.customer_uid);
    }

    
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
        {/* {
          console.log(menuitem)
        } */}
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
              <img src={info}
                    style={{
                      height:40,
                      width:40,
                    }}
              ></img>
            </button>
          </Tooltip>

          <button 
          onClick={this.changeHeart}
          className={styles.heartButton}
          >
            <img src={emptyHeart}
                  style={{
                    height:40,
                    width:40,
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

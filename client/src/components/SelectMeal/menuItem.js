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
    this.state={
      favList:[],
    }
    this.changeHeart = this.changeHeart.bind(this)
  }

  changeHeart(e){
    let customerID = this.props.customer_uid;

    console.log(e.target.getAttribute('id'))
    var tempimg = e.target.getAttribute('src');


    var nextimg;

    if(tempimg.includes('emptyHeart')){
      nextimg = fullHeart;
      this.addToFav(e.target.getAttribute('id'), customerID);
    }
    else{
      this.removeFromFav(e.target.getAttribute('id'), customerID)
      nextimg = emptyHeart;
    }

    

    e.target.setAttribute('src',nextimg)
    e.target.setAttribute('width',40)
    e.target.setAttribute('height',40)
  }

  addToFav(id, customer_uid){
    // console.log(this)
    if(customer_uid!=null){
      const data = {
        customer_uid: customer_uid,
        favorite:id,
      }
      axios
      .post(
        `${API_URL}favourite_food/post`,
        data
      ).then(response => {
        this.setState({favList:[...this.state.favList, id]})
        console.log(this.state.favList)
      })
    }
    return id;
  }

  removeFromFav(id, customer_uid){

    let tempArr = this.state.favList;

    if(customer_uid!=null){

      for(var i=0;i<tempArr.length;i++){
        if(tempArr[i]==id){
          tempArr.splice(i,1);
        }
      }

      // console.log(tempArr.join())

      const data = {
        customer_uid: customer_uid,
        favorite:tempArr.join(),
      }
      axios
      .post(
        `${API_URL}favourite_food/update`,
        data
      ).then(response => {
        this.setState({favList:tempArr})
        console.log(this.state.favList)
      })
    }
    return id;
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
      var temparr = response.data.result[0].favorites.split(",");
      this.setState({favList:temparr})
      console.log(this.state.favList);
    })
  }



  componentDidMount(){
    if(this.props.customer_uid==null){
      // console.log("user not login")
    }
    else{
      console.log(this.props.customer_uid)
      this.favoriteGet(this.props.customer_uid);
    }
  }

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
            <img src={this.state.favList.includes(menuitem.meal_uid)?fullHeart:emptyHeart}
                  style={{
                    height:40,
                    width:40,
                  }}
                  id = {menuitem.meal_uid}
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

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

    if(customerID==null){
      return alert('signin before like a meal')
    }

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
    .catch((err) => {
      if (err.response) {
        // eslint-disable-next-line no-console
        console.log(err.response);
      }
      // eslint-disable-next-line no-console
      console.log(err);
    });
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

    // console.log(cartItems)
    let x = this.props.data.filter(
      date => date.menu_date === this.props.myDate
    );
    let menuHTML

    if (this.props.addon === false) {
      x = x.filter(item => item.meal_cat !== 'Add-On')
    } else {
      x = x.filter(item => item.meal_cat === 'Add-On')
    }

    var dict = {};
    var tempxxx = 0;

    x.map((i)=>{

      cartItems.map((item)=>{
        if(item.menu_meal_id === i.menu_meal_id){
          dict[i.menu_meal_id] = item.count;
        }
      })

      if(dict[i.menu_meal_id]==null){
        dict[i.menu_meal_id]=0;
      }
    })

    // console.log(dict)


    menuHTML = x.map((menuitem, index) => (

      
      <div
        key={index}
        className={styles.menuitemIndividual}
      >
        {/* {
          console.log(menuitem)
        } */}
        <div
          style={{
            backgroundImage: `url(${menuitem.meal_photo_URL})`,
            backgroundSize: "cover",
            backgroundPosition:'center'
            // backgroundColor:"black"
            
          }}
          className={styles.menuItem}
        >
          {/* <div className={styles.menuElements} id={styles.eyeBtn}></div> */}


          <Tooltip title={menuitem.meal_desc}>
            <button className={styles.infoButton}>
              <img src={info}
                    style={{
                      height:30,
                      width:30,
                      borderRadius: '0 0 0 100px',
                      marginRight:'7px',
                      marginBottom:'2px',
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
                    height:30,
                    width:30,
                    borderRadius: '0 0 100px 0',
                    marginRight:'7px',
                    marginBottom:'2px',
                  }}
                  id = {menuitem.meal_uid}
            ></img>
          </button>

          {/* {show ? ( */}
            <Fragment>
              <button
                onClick={() => this.props.removeFromCart(menuitem)}
                style={{
                  width: '60px',
                  height: '42px',
                  top:'223px'
                }}
                className={styles.minusElements}
                id={styles.mealCounter}
              >
                -
              </button>

              {/* {cartItems.length > 0 &&
                cartItems.map((item, index) => {

                // let tempvar =  (item.menu_meal_id === menuitem.menu_meal_id) ? (0):(1);
                // console.log(tempvar)

                // return (
                //   (item.menu_meal_id === menuitem.menu_meal_id) && 
                  (
                    <div key = {index}
                    style={{
                      width: '64px',
                      height: '42px',
                      top:'223px',
                      right:'59.5px',
                    }}
                      className={styles.numElements}
                      id={styles.mealCounter}
                    >
                      {dict[menuitem.menu_meal_id]}
                    </div>
                  )

                // );
              })} */}

                <div key = {index}
                    style={{
                      width: '64px',
                      height: '42px',
                      top:'223px',
                      right:'59.5px',
                    }}
                      className={styles.numElements}
                      id={styles.mealCounter}
                    >
                      {dict[menuitem.menu_meal_id]}
                    </div>




              {cartItems.length == 0 &&

                <div key = {index}
                style={{
                  width: '64px',
                  height: '42px',
                  top:'223px',
                  right:'59.5px',
                }}
                  className={styles.numElements}
                  id={styles.mealCounter}
                >
                  {0}
                </div>

              }

            
              <button
                onClick={() => this.props.addToCart(menuitem)}
                style={{
                  width: '60px',
                  height: '42px',
                  top:'223px',
                  left:'124px'
                }}
                className={styles.plusElements}
                id={styles.mealCounter}
              >
                +
              </button> 
            </Fragment>
          ) 
          {/* : (
            ""
          )} */}
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
        <div
          style={{
            width:"100%",
            height:'7px',
          }}
        />
        {this.menuItemFilter()}
      </Fragment>
    );
  }
}

export default MenuItem;

import React, { Component } from 'react';
import {API_URL} from "../../reducers/constants";
import styles from "./home.module.css"
import eye from "./images/eye.svg"


class MenuCarousel extends Component {
    constructor(props) {
        super(props)
        this.navRef = React.createRef()
    }
    state = {
        menuItems: []
        }
    
      componentDidMount() {
        const menuUrl = `${API_URL}upcoming_menu`
        fetch(menuUrl)
          .then((response) => response.json())
          .then((data) => this.processData(data.result));
      }
    
      processData = (data) => {
        // console.log(data)
        const date = data[0].menu_date
        // console.log(date)
        let filteredData = []
        for (var x = 0; x < data.length; x++) {
          if(data[x].menu_date === date) {
            filteredData.push(data[x])
          } else { 
            break
          }
        }
    
        // console.log(filteredData)
        this.setState({
          menuItems: filteredData
        })
      }

    handleNav = (direction) => {
        if(direction === 'left') {
            this.navRef.current.scrollLeft -= 292
        } else {
            this.navRef.current.scrollLeft += 292
        }
    }

    menuLoop = () => {
        let menuHTML
    
        if (this.state.menuItems.length) {
          menuHTML = this.state.menuItems.map((item, index) =>
          <div key = {index} className = {styles.menuContainer}>
              <h6 className = {styles.itemName}>{item.meal_name}</h6>
            <div  className = {styles.imageContainer} style = {{backgroundImage: `url(${item.meal_photo_URL})`}}>
                <img className = {styles.menuEye} src = {eye}></img>
            </div>  
            
          </div>
            

          
          )
        }
    
        return menuHTML
    
      }

    render() { 
        return ( 
            <div style = {{display: 'flex', flexDirection: 'row', width: '100%', marginTop: '50px'}}>
                <div style = {{display: 'grid', justifyContent: 'center', alignItems: 'center'}}>
                    <button onClick = {() => this.handleNav('left')} className = {styles.carouselButtons}> Prev</button>
                </div>
                <div style = {{overflow: 'auto', overflow: 'hidden', whiteSpace: 'nowrap'}} ref = {this.navRef}>
                    {this.menuLoop()}
                </div>

                <div style = {{display: 'grid', justifyContent: 'center', alignItems: 'center'}}>
                    <button onClick = {() => this.handleNav('right')} className = {styles.carouselButtons}> Next</button>
                </div>
            </div>
            
         );
    }
}
 
export default MenuCarousel;
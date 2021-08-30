import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import appColors from "./AppColors";
import BusiApiReqs from "./BusiApiReqs";
import Product from "./Product";
import "react-multi-carousel/lib/styles.css";
// import { ReactComponent as LeftArrow } from "../../images/dateLeftArrow.svg";
// import { ReactComponent as RightArrow } from "../../images/dateRightArrow.svg";
// import socialA from "../../images/socialApple.png"
import LeftArrow from "../../images/dateLeftArrow.svg";
import RightArrow from "../../images/dateRightArrow.svg";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 3000, min: 1650 },
    items: 7,
  },
  largeDesktop: {
    breakpoint: { max: 1649, min: 1431 },
    items: 7,
  },
  desktop: {
    breakpoint: { max: 1430, min: 1300 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1150, min: 860 },
    items: 4,
  },
  smallScreen: {
    breakpoint: { max: 860, min: 640 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 639, min: 445 },
    items: 2,
  },
  smallMobile: {
    breakpoint: { max: 444, min: 0 },
    items: 1,
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: appColors.componentBg,
    width: "100%",
    height: '100%',
    // paddingTop: "10px",
    position: 'relative'
  },
  title: {
    color: appColors.secondary,
    fontSize: "22px",
    fontWeight: "bold",
    marginLeft: "75px",
  },
  bar: {
    borderBottom: "4px solid " + appColors.secondary,
    marginBottom: "30px",
    width: "230px",
  },
  carouselSlider: {
    // textAlign: "center",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
}));

const CustomRightArrow = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType }
  } = rest;
  // onMove means if dragging or swiping in progress.
  return (
    <button 
      onClick={() => onClick()} 
      style={{
        border: 'dashed'
      }}
    />
  );
};

const BusiMethods = new BusiApiReqs();

const ProductDisplay = () => {
  const classes = useStyles();
  const [itemsList, setItemsList] = useState([]);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    BusiMethods.getItems().then((itemsData) => {
      const itemsSet = new Set();
      const _itemList = [];
      for (const item of itemsData) {
        //const uniqueItemProps = item.item_name;
        const uniqueItemProps = item.meal_name;
        if (!itemsSet.has(uniqueItemProps)) _itemList.push(item);
        itemsSet.add(item.meal_name);
      }
      setItemsList(_itemList);
    });
  };

  const carouselRef = useRef();

  return (
    <Box className={classes.root}>
      {/* <button
        style={{ 
          border: '1px solid red',
          position: 'absolute',
          left: '10px',
          top: '0px'
        }}
        onClick={() => {
          carouselRef.current.previous();
        }}
      >
        <LeftArrow />
      </button> */}
      <div
        style={{
          height: '100%',
          position: 'absolute',
          // border: '1px solid blue',
          display: 'flex',
          alignItems: 'center',
          // zIndex: '50'
        }}
      >
        <div
          style={{ 
            border: '1px solid #f26522',
            marginLeft: '50px',
            zIndex: '50',
            // border: 'none',
            borderRadius: '50%',
            // backgroundColor: 'transparent',
            // backgroundImage: `url(${LeftArrow})`,
            backgroundColor: 'rgb(255,255,255,1)',
            // backgroundSize: 'cover',
            height: '50px',
            width: '50px',
            cursor: 'pointer',
            position: 'relative'
          }}
          onClick={() => {
            carouselRef.current.previous();
          }}
        >
          <img 
            src={LeftArrow} 
            style={{
              // border: '1px dashed',
              borderRadius: '50%',
              // marginTop: '10px',
              // marginLeft: '10px',
              // marginTop: '8px',
              // marginLeft: '-1px',
              position: 'absolute',
              top: '9px',
              left: '10px',
              height: '36px',
              width: '36px'
            }}
          />
          {/* <LeftArrow /> */}
        </div> 
      </div>
      <div
        style={{
          height: '100%',
          position: 'absolute',
          // border: '1px solid blue',
          right: '0',
          display: 'flex',
          alignItems: 'center',
          // zIndex: '50'
        }}
      >
        <button
          style={{ 
            border: '1px solid #f26522',
            marginRight: '50px',
            zIndex: '50',
            // border: 'none',
            borderRadius: '50%',
            // backgroundColor: 'transparent',
            // backgroundImage: `url(${LeftArrow})`,
            backgroundColor: 'rgb(255,255,255,1)',
            // backgroundSize: 'cover',
            height: '50px',
            width: '50px',
            cursor: 'pointer',
            position: 'relative'
          }}
          // className={styles.dateCarouselArrowBtn}
          onClick={() => {
            carouselRef.current.next();
            // dispatch({ type: "INCREMENT_DATE_INDEX" });
          }}
        >
          <img 
            src={RightArrow} 
            style={{
              // border: '1px dashed',
              borderRadius: '50%',
              // marginTop: '8px',
              // marginLeft: '-1px',
              position: 'absolute',
              top: '9px',
              left: '4px',
              height: '36px',
              width: '36px'
            }}
          />
          {/* <RightArrow /> */}
        </button>
      </div>
      <Carousel
        responsive={responsive}
        ref={carouselRef}
        autoPlay={true}
        autoPlaySpeed={3000}
        infinite={true}
        swipeable={true}
        partialVisible={true}
        // slidesToSlide={3}
        // autoPlay={true}
        // autoPlaySpeed={10000}
        // infinite={true}
        draggable={true}
        sliderClass={classes.carouselSlider}
        arrows={false}
        // arrows={true}
        // responsive={responsive}
        // customRightArrow={<CustomRightArrow />}
      >
        {itemsList.map((product) => {
          return (
            <Product
              img={product.meal_photo_URL}
              name={product.meal_name}
              key={product.menu_uid}
            />
          );
        })}
        {/* <Product
          img={itemsList[0].meal_photo_URL}
          name={itemsList[0].meal_name}
          key={itemsList[0].menu_uid}
        />
        <Product
          img={itemsList[1].meal_photo_URL}
          name={itemsList[1].meal_name}
          key={itemsList[1].menu_uid}
        />
        <Product
          img={itemsList[2].meal_photo_URL}
          name={itemsList[2].meal_name}
          key={itemsList[2].menu_uid}
        /> */}
      </Carousel>
    </Box>
  );
};

export default ProductDisplay;

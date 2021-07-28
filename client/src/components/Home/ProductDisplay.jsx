import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import appColors from "./AppColors";
import BusiApiReqs from "./BusiApiReqs";
import Product from "./Product";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 3000, min: 1650 },
    items: 8,
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
    paddingTop: "10px",
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
      <Carousel
        responsive={responsive}
        ref={carouselRef}
        autoPlay={true}
        autoPlaySpeed={5000}
        infinite={true}
        swipeable={true}
        partialVisible={true}
        // slidesToSlide={3}
        // autoPlay={true}
        // autoPlaySpeed={10000}
        // infinite={true}
        draggable={true}
        sliderClass={classes.carouselSlider}
        // responsive={responsive}
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
      </Carousel>
    </Box>
  );
};

export default ProductDisplay;

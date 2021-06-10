import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import appColors from './AppColors';
import BusiApiReqs from './BusiApiReqs';
import Product from './Product';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 3000, min: 1430 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 1430, min: 1150 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1150, min: 800 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 800, min: 0 },
    items: 2,
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: appColors.componentBg,
    width: '100%',
    height: '300px',
    paddingTop: '10px',
	  marginBottom: '180px',
  },
  title: {
    color: appColors.secondary,
    fontSize: '22px',
    fontWeight: 'bold',
	marginLeft:'75px',
  },
  bar: {
    borderBottom: '4px solid ' + appColors.secondary,
    marginBottom: '30px',
    width: '230px',
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

  return (
    <Box className={classes.root}>
      <Carousel
        arrows={true}
        swipeable={true}
        partialVisible={true}
        slidesToSlide={3}
        autoplay={true}
        autoPlaySpeed={1000}
        infinite={true}
        draggable={true}
        responsive={responsive}
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

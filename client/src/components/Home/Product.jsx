import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import appColors from './AppColors';
import styles from "./home.module.css"

const Product = (props) => {
  return (
    <Box key={props.key} property="div">
      <Grid item>
        <Box
          className="center-cropped"
          display="flex"
          alignItems="flex-start"
          position="relative"
          width = "204px"
          height = "340px"
          overflow = "hidden"		  
          style={{
            backgroundImage: `url(${props.img})`,
            backgroundSize:'cover',
            backgroundPosition:'center',
          }}
        /> 
        <Box
          width="204px"
          p={0.1}
          style={{
            backgroundColor: 'white',
            border: '1px solid #F26522',
			marginTop: '-2px',
			height: '45px'
          }}
        >
            <Box style = {{textAlign:'center', font:'SF Pro', fontWeight:'bold',fontSize:'14px/22px', paddingTop:'10px'}}>{props.name}</Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Product;

import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import appColors from "./AppColors";
import styles from "./home.module.css";

const Product = (props) => {
  return (
    <Box
      key={props.key}
      property="div"
      style={{
        width: "200px",
        boxShadow: "0 0 7px #838383",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Grid item>
        <Box
          className="center-cropped"
          display="flex"
          alignItems="flex-start"
          position="relative"
          // width="204px"
          height="200px"
          overflow="hidden"
          style={{
            backgroundImage: `url(${props.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          tabIndex="0"
          aria-label={props.name}
          title={props.name}
        />
        <Box
          // width="204px"
          p={0.1}
          style={{
            backgroundColor: "white",
            border: "1px solid #F26522",
            // marginTop: "-2px",
            height: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            style={{
              textAlign: "center",
              font: "SF Pro",
              fontWeight: "bold",
              fontSize: "14px/22px",
            }}
          >
            {props.name}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Product;

import { useHistory } from "react-router";
// import withStyles from '@material-ui/styles/withStyles';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  homeBtn: {
    // backgroundColor: '#fcfcfb',
    // '& label.Mui-focused': {
    //   color: appColors.secondary,
    // },
    // '& .MuiOutlinedInput-root': {
    //   '&.Mui-focused fieldset': {
    //     borderColor: appColors.secondary,
    //   },
    // },
    textAlign: 'center',
    justifyContent: 'center',
    padding: '5px !important',
    /*color: black !important;*/
    color: '#ffffff',
    fontSize: '16px !important',
    /*border: 1px solid rgb(187, 174, 174);*/
    borderRadius: '15px',
    borderWidth: '0',
    minWidth: '100px !important',
    backgroundColor: '#ff6505',
    // marginTop: '30px',
    // width: '90%',
    width: '200px',
    height: '50px',
    '&:hover': {
      backgroundColor: '#ffba00',
    },
    // '&focused': {
    //   backgroundColor: '#fff',
    // },
  },
}));

// class NotFound extends React.Component {
const NotFound = (props) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    // <div> Will be Not Found Page </div>
    <div
      style={{
        // border: 'dashed',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#ffba00'
      }}
    >
      <div
        style={{
          border: 'solid #ff6505',
          backgroundColor: 'white',
          width: '480px',
          maxWidth: '80%',
          borderRadius: '15px',
          // height: '500px',
          display: 'inline-block'
        }}
      >
        <h1
          style={{
            // border: '1px solid green',
            marginTop: '50px',
            textAlign: 'center',
            // width: '300px',
            // height: '100px'
            marginBottom: '30px',
            fontWeight: 'bold'
          }}
        >
          404 - Page Not Found!
        </h1>
        {/* <Link to="/">
            Go Home
        </Link> */}
        <div
          style={{
            // border: '1px solid blue',
            marginBottom: '50px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <button
            className={classes.homeBtn}
            style={{

            }}
            onClick={() => {
              history.push('/home');
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  homeBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    padding: '5px !important',
    color: '#ffffff',
    fontSize: '16px !important',
    borderRadius: '15px',
    borderWidth: '0',
    minWidth: '100px !important',
    backgroundColor: '#ff6505',
    width: '200px',
    height: '50px',
    '&:hover': {
      backgroundColor: '#ffba00',
    },
  },
}));

const NotFound = (props) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          border: 'solid #ff6505',
          backgroundColor: 'white',
          width: '480px',
          maxWidth: '80%',
          borderRadius: '15px',
          display: 'inline-block'
        }}
      >
        <h1
          style={{
            marginTop: '50px',
            textAlign: 'center',
            marginBottom: '30px',
            fontWeight: 'bold'
          }}
        >
          404 - Page Not Found!
        </h1>
        <div
          style={{
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
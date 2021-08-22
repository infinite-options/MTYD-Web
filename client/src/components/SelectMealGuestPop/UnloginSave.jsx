import { Component } from 'react'

export class UnloginSave extends Component {
  constructor(props){
    super();
    this.handleClick= this.handleClick.bind(this)
  }

  handleClick () {
    this.props.closeFunction();
  };
  render() {
    return (
      <div
      style={{
        width:'100%',
        height:'100%',
        position:'absolute',
        backgroundColor:'null',
        zIndex:99,
        top:'0px'
      }}
      >
      <div 
      style={{
        position:'absolute',
        width:'384px',
        height:'445px',
        backgroundColor:'white',
        border:'2px solid #F26522',
        left:'40%',
        top:'30%',
        zIndex:99
      }}
      >
        <p 
          style = {{
            font:'SF Pro',
            fontSize: '18px', 
            fontWeight:'normal', 
            textAlign: 'left', 
            color:'black',
            paddingLeft:'20px',
            paddingRight:'20px',
            paddingTop:'43px'

          }}
          >
          <span style={{color: '#F26522'}}>Save </span>allows you to select your meals up to 3 weeks in advance.
        </p>


          <div
           style={{
             position:'absolute',
             top:'144px',
             left:'32px',
             width:'320px',
             height:'50px',
             fontSize:'18px',
             textAlign:'center',
             backgroundColor:'#F26522',
             color:'white',
             paddingTop:'10px',
             borderRadius:'15px'
           }}
           onClick = {this.handleClick}
          >
              Continue Exploring
          </div>

          <div
           style={{
             position:'absolute',
             top:'214px',
             left:'32px',
             width:'150px',
             height:'20px',
             fontSize:'14px',
             textAlign:'center',
             borderRadius:'15px'
            //  fontWeight:'',
           }}
          >
              Already a Customer?
          </div>

          <div
           style={{
             position:'absolute',
             top:'237px',
             left:'32px',
             width:'320px',
             height:'50px',
             fontSize:'18px',
             textAlign:'center',
             backgroundColor:'#F26522',
             color:'white',
             paddingTop:'10px',
             borderRadius:'15px'
            //  fontWeight:'',
           }}

           onClick = {this.props.login}
          >
              Login
          </div>

          <div
           style={{
             position:'absolute',
             top:'307px',
             left:'32px',
             width:'200px',
             height:'20px',
             fontSize:'14px',
             textAlign:'center',
             borderRadius:'15px'
            //  fontWeight:'',
           }}
          >
              Ready to start eating better?
          </div>

          <div
           style={{
             position:'relative',
             top:'218px',
             left:'32px',
             width:'320px',
             height:'50px',
             fontSize:'18px',
             textAlign:'center',
             backgroundColor:'#F26522',
             color:'white',
             paddingTop:'10px',
             borderRadius:'15px'
            //  fontWeight:'',
           }}

           onClick = {this.props.signup}
          >
              Sign up
          </div>



      </div>
      </div>
    )
  }
}

export default UnloginSave

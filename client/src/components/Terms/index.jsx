import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import axios from "axios";
import {API_URL} from "../../reducers/constants";
import {withRouter} from "react-router";
import styles from "./terms.module.css";
import {WebNavBar, BottomNavBar} from "../NavBar";
import {HomeLink, FootLink, AmbassadorLink, AddressLink} from "../Home/homeButtons";

import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';

class Terms extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      login_seen: false,
      signUpSeen: false,
    };
  }

  togglePopLogin = () => {
    this.setState({
     login_seen: !this.state.login_seen,
    });

    if(!this.state.login_seen){
      this.setState({
        signUpSeen:false
      })
    }

   };

  togglePopSignup = () => {
    this.setState({
      signUpSeen: !this.state.signUpSeen
    });

    if(!this.state.signUpSeen){
      this.setState({
        login_seen:false
      })
    }
  };

  componentDidMount() {

  }

  render() {
    return (
      <>
        <WebNavBar 
          poplogin = {this.togglePopLogin}
          popSignup = {this.togglePopSignup}
        />

        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

        <div className={styles.sectionHeader}>
          Terms and Conditions
        </div>
          
        <div className={styles.container}>

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          Updated: May 2021
          </h6>

          <div>
          PLEASE REVIEW THE TERMS OF THIS AGREEMENT CAREFULLY. IF YOU DO NOT AGREE TO THIS AGREEMENT IN ITS ENTIRETY, YOU ARE NOT AUTHORIZED TO USE THE MEALSFOR.ME OFFERINGS IN ANY MANNER OR FORM.
          </div>

          <br />

          <div>
          THIS AGREEMENT REQUIRES THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR CLASS ACTIONS, AND ALSO LIMITS THE REMEDIES AVAILABLE TO YOU IN THE EVENT OF A DISPUTE.
          </div>

          <br />

          <div>
          Welcome to MealsFor.Me. These terms and conditions (this “Agreement”) govern when you: (a) access or use the MealsFor.Me website or any other online MealsFor.Me platform (collectively, the “Site”); (b) access or use the MealsFor.Me mobile application (the “App”); (c) access and/or view any of the video, audio, stories, text, photographs, graphics, artwork and/or other content featured on the Site and/or in the App (collectively, “Content”); (d) sign up to receive the MealsFor.Me subscription food-delivery service, and/or any other products or services offered by MealsFor.Me from time to time; (e) access links to MealsFor.Me’s social media pages/accounts on third-party social media websites or mobile or other platforms, such as Facebook®, Instagram®, Pinterest®, LinkedIn®, Twitter®, Snapchat®, and YouTube® (collectively, “Social Media Pages”); (f) enter one of the sweepstakes, contests and/or other promotions offered or conducted by MealsFor.Me from time-to-time (collectively, “Promotions”); and/or (g) utilize the many interactive features of the Site and/or App designed to facilitate interaction between you, MealsFor.Me and other users of the Site and App, respectively, including, but not limited to, blogs and associated comment sections located in designated areas of the Site and App, as applicable (collectively, the “Interactive Services” and together with the Site, App, Content, Social Media Pages and Promotions, the “MealsFor.Me Offerings”). By using the MealsFor.Me Offerings, you acknowledge that you have read, understood, and agree to be legally bound by this Agreement and have read and understand our Privacy Policy. Further, you agree to enter into a legal binding agreement with MealsFor.Me. Please do not access or use the MealsFor.Me Offerings if you are unwilling or unable to be bound by this Agreement. The MealsFor.Me Offerings are based and operated in the United States. We make no claims concerning whether the content may be downloaded, viewed, or be appropriate for use outside of the United States. If you access the Service or the Content from outside of the United States, you do so on your own initiative and at your own risk. Whether inside or outside of the United States, you are solely responsible for ensuring compliance with the laws of your specific jurisdiction.
          </div>

          <br />

          <div>
          We may modify this Agreement from time to time at our sole discretion. When changes are made, we will notify you by making the revised version available on this webpage, and will indicate at the top of this page the date that revisions were last made. You should revisit this Agreement on a regular basis as revised versions will be binding on you. Any such modification will be effective upon our posting of new terms and conditions. You are responsible for staying informed of any changes and are expected to check this page from time to time so you are aware of any changes. You understand and agree that your continued access to or use of the MealsFor.Me Offerings after any posted modification to this Agreement indicates your acceptance of the modifications. If you do not agree with the modified terms and conditions, you should stop using the MealsFor.Me Offerings.
          </div>

          <br />

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          Eligibility
          </h6>

          <div>
          By using the MealsFor.Me Offerings, you represent that you are at least eighteen (18) years of age (or the applicable age of majority if greater than eighteen (18) years of age in your jurisdiction), and have the requisite power and authority to enter into the Agreement and perform your obligations hereunder.
          </div>

          <br />

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          Registration
          </h6>

          <div>
          During the registration process, you will be asked to create an account and establish a password. Your account is for your personal, non-commercial use only. In creating it, we ask that you provide complete and accurate information. Please read our Privacy Policy on how this information will be used. You are responsible for maintaining the confidentiality of your account password and you are responsible for all activities that occur in connection with your account made by you or anyone you allow to use your account. You agree to safeguard your account password from access by others. You agree to indemnify and hold harmless MealsFor.Me for losses incurred by MealsFor.Me or another party due to someone else using your account or password. MealsFor.Me has the right to disable any user name, password or other identifier, whether chosen by you or provided by MealsFor.Me, at any time, in its sole discretion for any or no reason, if, in our opinion, you have violated any provisions of this Agreement.
          </div>

          <br />

          <div>
          MealsFor.Me reserves the right to withdraw or amend the MealsFor.Me Offerings, and any service or material we provide on the Site, the App or Social Media Pages, in its sole discretion without notice. MealsFor.Me will not be liable if for any reason all or any part of the Site is unavailable at any time or for any period. From time to time, MealsFor.Me may restrict access to some parts of the MealsFor.Me Service, or the entire MealsFor.Me Service, to users, including registered users.
          </div>

          <br />

          <div>
          Nutrition Information
          </div>

          <div>
          Please note that nutritional information on our site reflects recent updates to meals based on evolving ingredients. MealsFor.Me does not guarantee the accuracy of any nutritional information provided by MealsFor.Me. MealsFor.Me will not be responsible for any loss or damage resulting from your reliance on nutritional information, nor for ensuring that whatever foods you purchase or consume are in accordance with your respective dietary needs, restrictions or preferences. You should always check the ingredients associated with any products that you receive from MealsFor.Me to avoid potential allergic reactions. If you have or suspect that you have an allergic reaction or other adverse health event, promptly contact your health care provider.
          </div>

          <br />

          <div>
          Blog posts and other Content on the Site or in the App may contain recipes, meal recommendations, dietary advice (collectively, the “Dietary Advice”) and the food products delivered in connection with the MealsFor.Me Service (collectively, the “Dietary Options”) will contain various ingredients. You should always consult with your physician or other healthcare professional before adopting any Dietary Advice or partaking in any Dietary Options, whether offered by and through the MealsFor.Me Offerings or otherwise. The Dietary Advice and/or Dietary Options may include ingredients that you are allergic to. You should always check the ingredients associated with any Dietary Advice and Dietary Options to avoid potential allergic reactions. If you have or suspect that you have an allergic reaction or other adverse health event, promptly contact your health care provider.
          </div>

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          MealsFor.Me Billing
          </h6>

          <div>
          When you first sign up for a subscription to a MealsFor.Me Plan (a “Plan”), you are charged for the entire delivery period of your Plan selection. All Plans are continuous subscription plans, and you will be charged the applicable price listed for the Plan that you select after your current subscription is fulfilled. If you wish to cancel or modify your subscription to a Plan, you can do so at any time as described in the “Cancel or Modify a Subscription” section below; however, except as otherwise noted below, any amounts charged to or paid by you prior to such cancellation or modification will not be refunded, and cancellations or modifications may not impact any order for which you have already been charged, depending on the status of the order.
          </div>

          <br />

          <div>
          MealsFor.Me may change the price of a Plan, introduce new Plans, or remove Plans from time to time, and will communicate any price or Plan changes to you in advance in accordance with the “Notice” section of this Agreement. Price and Plan changes will take effect as of the next billing period following the date on which MealsFor.Me provided notice to you of the price or Plan change. By continuing to use the MealsFor.Me Service after the effective date of a price or Plan change, you indicate your acceptance of such price or Plan change. If you do not agree with a price or Plan change, you have the right to reject the change by cancelling your subscription(s) prior to the effective date of the price or Plan change. Please make sure that you read any notifications of price or Plan changes carefully.
          </div>

          <br />

          <div>
          Applicable sales tax may be charged on your order based on local and state laws.
          </div>

          <br />

          <div>
          You are fully responsible for all activities that occur under your account, and you agree to be personally liable for all charges incurred under your account based on your delivery status as of the specified deadline. Your liability for such charges shall continue after termination of this Agreement.
          </div>

          <br />

          <div>
          WHEN YOU REGISTER FOR THE MEALSFOR.ME SUBSCRIPTION SERVICE (AND EACH TIME YOU CHANGE YOUR PLAN) YOU EXPRESSLY AUTHORIZE AND AGREE THAT MEALSFOR.ME AND/OR OUR THIRD PARTY PAYMENT PROCESSOR IS AUTHORIZED TO AUTOMATICALLY CHARGE YOUR PAYMENT METHOD (AS DEFINED BELOW) ON A RECURRING BASIS IN AN AMOUNT EQUAL TO THE THEN-EFFECTIVE RATE FOR YOUR PLAN, TOGETHER WITH ANY APPLICABLE TAXES AND SHIPPING (the “PLAN RATE”), FOR AS LONG AS YOU CONTINUE TO USE THE MEALSFOR.ME SUBSCRIPTION SERVICE, UNLESS YOU CANCEL YOUR MEALSFOR.ME SUBSCRIPTION SERVICE IN ACCORDANCE WITH THIS AGREEMENT. YOU ACKNOWLEDGE AND AGREE THAT MEALSFOR.ME WILL NOT OBTAIN ANY ADDITIONAL AUTHORIZATION FROM YOU FOR SUCH AUTOMATIC, RECURRING PAYMENTS. IN ADDITION, YOU AUTHORIZE US (AND/OR OUR THIRD PARTY PAYMENT PROCESSOR) TO CHARGE YOUR PAYMENT METHOD FOR ANY ADDITIONAL MEALSFOR.ME OFFERINGS PURCHASED BY YOU FROM TIME TO TIME OUTSIDE OF OR IN EXCESS OF YOUR PLAN, PLUS ANY APPLICABLE TAXES AND SHIPPING. EVERY TIME THAT YOU USE THE MEALSFOR.ME SUBSCRIPTION SERVICE, YOU RE-AFFIRM THAT MEALSFOR.ME IS AUTHORIZED TO CHARGE YOUR PAYMENT METHOD AS PROVIDED IN THE AGREEMENT, AND TO HAVE ALL APPLICABLE FEES AND CHARGES APPLIED TO SAME.
          </div>

          <br />

          <div>

          </div>

        </div>

        <div style={{marginTop: '50px'}}>
          <FootLink/>  
        </div>
      </>
    );
  }
}

Terms.propTypes = {
  fetchPlans: PropTypes.func.isRequired,
  chooseMealsDelivery: PropTypes.func.isRequired,
  choosePaymentOption: PropTypes.func.isRequired,
  numItems: PropTypes.array.isRequired,
  paymentFrequency: PropTypes.array.isRequired,
  meals: PropTypes.string.isRequired,
  paymentOption: PropTypes.string.isRequired,
  selectedPlan: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  plans: state.subscribe.plans,
  numItems: state.subscribe.numItems,
  paymentFrequency: state.subscribe.paymentFrequency,
  meals: state.subscribe.meals,
  paymentOption: state.subscribe.paymentOption,
  selectedPlan: state.subscribe.selectedPlan,
  customerId: state.subscribe.profile.customerId,
  socialMedia: state.subscribe.profile.socialMedia,
  email: state.subscribe.profile.email,
  firstName: state.subscribe.addressInfo.firstName,
  lastName: state.subscribe.addressInfo.lastName,
  street: state.subscribe.address.street,
  unit: state.subscribe.address.unit,
  city: state.subscribe.address.city,
  state: state.subscribe.address.state,
  zip: state.subscribe.address.zip,
  cc_num: state.subscribe.creditCard.number,
  cc_cvv: state.subscribe.creditCard.cvv,
  cc_zip: state.subscribe.creditCard.zip,
  cc_month: state.subscribe.creditCard.month,
  cc_year: state.subscribe.creditCard.year,
  phone: state.subscribe.addressInfo.phoneNumber,
  instructions: state.subscribe.deliveryInstructions,
  password: state.subscribe.paymentPassword,
  address: state.subscribe.address
});

export default connect(mapStateToProps, {

})(withRouter(Terms));

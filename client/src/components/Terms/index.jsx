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

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          Cancel or Modify a Subscription
          </h6>

          <div>
          Following your Plan selection, order placement and receipt of your first weekly order, you may cancel or modify a subscription to a Plan at any time online by managing your account at MealsFor.Me or via the App, or by emailing us at support@MealsFor.Me.
          </div>

          <br />

          <div>
          To avoid being charged for placed orders that you no longer wish to receive in the event of a subscription cancellation, you must cancel prior to the date when you are to be charged for your next order, which is emailed to you after your receive the last delivery of your current Plan and also displayed on the Subscriptions and Order History pages. The charge is typically 1 or 2 days before your next expected delivery, depending on your specified deadline, but can vary depending on shipping length and other factors.
          </div>

          <br />

          <div>
          If you cancel a subscription to a Plan before receiving your first order, your first order may or may not be cancelled and related amounts paid may or may not be refunded to you, depending on factors including the status of your meals in our production process, and any promotions applied. You will be notified at the time of cancellation if any of your charged orders will be cancelled and refunded, To confirm, email us at support@MealsFor.Me.
          </div>

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          Food Substitution Policy
          </h6>

          <div>
          Although MealsFor.Me takes every reasonable measure to have sufficient inventory to fill your order, availability of product(s) may change without notice. MealsFor.Me is not responsible for the unavailability of product due to popular demand, whether discontinued or still in production.
          </div>

          <br />

          <div>
          In the completion of orders, MealsFor.Me reserves the right to substitute a similar product. Substituted food items may contain different ingredients and allergens than those in items originally ordered. Prior to consumption, please be sure to carefully check all individual product packages for the most updated information regarding ingredients and nutritional content for any/all of MealsFor.Me’s food products, including new and improved items, if you have any food allergies or if you are otherwise concerned about any particular ingredients.
          </div>

          <br />

          <div>
          Please Note: MealsFor.Me’s food items may contain or may have been manufactured in a facility that also processes: dairy, eggs, fish, shellfish, soy, and tree nuts.
          </div>

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          Shipping
          </h6>

          <div>
          We use third-party carriers (e.g. Just Delivered) to deliver your food packages and provide you with tracking information for every package. It is very important that you provide us with the proper shipping information and any special instructions that the delivery driver may need.
          </div>

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          App
          </h6>

          <div>
          You shall be responsible, at all times, for ensuring that you have an applicable mobile device and/or other equipment and service necessary to access the App. MealsFor.Me does not guarantee the quality, speed or availability of the Internet connection associated with your mobile device. MealsFor.Me does not guarantee that the App can be accessed: (a) on all mobile devices; (b) through all wireless service plans; and/or (c) in all geographical areas. Standard messaging, data and wireless access fees may apply to your use of the App. You are fully responsible for all such charges and MealsFor.Me has no liability or responsibility to you, whatsoever, for any such charges billed by your wireless carrier.
          </div>

          <br />

          <div>
          Export/Usage Restrictions. You agree that the App may not be transferred or exported into any other country, or used in any manner prohibited by U.S. or other applicable export laws and regulations. The MealsFor.Me Offerings are subject to, and you agree that you shall at all times comply with, all local, state, national and international laws, statutes, rules, regulations, ordinances and the like applicable to use of the MealsFor.Me Offerings. You agree not to use the MealsFor.Me Offerings: (a) for any commercial purposes; or (b) to conduct any business or activity, or solicit the performance of any activity, which is prohibited by law or any contractual provision by which you are bound.
          </div>

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          Content
          </h6>

          <div>
          The Site and App contain Content which includes, but is not limited to, information pertaining to the MealsFor.Me Offerings, as well as regularly updated blog posts and third party links. The Content is offered for informational purposes only and is at all times subject to the disclaimers contained herein, and on the Site and in the App.
          </div>

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          Interactive Services
          </h6>

          <div>
          Subject to the restrictions set forth herein, the Interactive Services will allow users to participate in comment sections and other interactive areas of the Site and/or App. Each user agrees to use the Interactive Services in full compliance with all applicable laws and regulations. Each user shall be solely responsible for her/his comments, opinions, statements, feedback and other content (collectively, “Feedback”) posted by and through the Interactive Services. You understand and agree that MealsFor.Me shall not be liable to you, any other user or any third party for any claim in connection with your use of, or inability to use, the Interactive Services. MealsFor.Me does not monitor the Feedback submitted by users, and operates the comment sections of the Site and App as a neutral host. The Interactive Services contain Feedback that is provided directly by users. You agree that MealsFor.Me shall have no obligation and incur no liability to you in connection with any Feedback appearing in or through the Interactive Services. MealsFor.Me does not represent or warrant that the Feedback posted through the Interactive Services is accurate, complete or appropriate. MealsFor.Me reserves the right to remove any Feedback from the Site and/or App at any time and for any reason, in MealsFor.Me’s sole discretion.
          </div>

          <br />

          <div>
          You agree to use the Interactive Services in a manner consistent with any and all applicable laws and regulations. In connection with your use of the Interactive Services and other of the MealsFor.Me Offerings, you agree not to: (a) display any telephone numbers, street addresses, last names, URLs, e-mail addresses or any confidential information of any third party; (b) display any audio files, text, photographs, videos or other images containing confidential information; (c) display any audio files, text, photographs, videos or other images that may be deemed indecent or obscene in your community, as defined under applicable law; (d) impersonate any person or entity; (e) “stalk” or otherwise harass any person; (f) engage in unauthorized advertising to, or commercial solicitation of, other users; (g) transmit any chain letters, spam or junk e-mail to other users; (h) express or imply that any statements that you make are endorsed by MealsFor.Me, without MealsFor.Me’s specific prior written consent; (i) harvest or collect personal information of other users whether or not for commercial purposes, without their express consent; (j) use any robot, spider, search/retrieval application or other manual or automatic device or process to retrieve, index, “data mine” or in any way reproduce or circumvent the navigational structure or presentation of the App, Site and/or their respective content; (k) post, distribute or reproduce in any way any copyrighted material, trademarks or other proprietary information without obtaining the prior consent of the owner of such proprietary rights; (l) remove any copyright, trademark or other proprietary rights notices contained in the App and/or Site; (m) interfere with or disrupt the App, Site and/or the servers or networks connected to same; (n) post, offer for download, e-mail or otherwise transmit any material that contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment; (o) post, offer for download, transmit, promote or otherwise make available any software, product or service that is illegal or that violates the rights of a third party including, but not limited to, spyware, adware, programs designed to send unsolicited advertisements (i.e. “spamware”), services that send unsolicited advertisements, programs designed to initiate “denial of service” attacks, mail bomb programs and programs designed to gain unauthorized access to mobile networks; (p) “frame” or “mirror” any part of the App and/or Site without MealsFor.Me’s prior written authorization; (q) use metatags or code or other devices containing any reference to any MealsFor.Me Offerings in order to direct any person to any other mobile application or website for any purpose; and/or (r) modify, adapt, sublicense, translate, sell, reverse engineer, decipher, decompile or otherwise disassemble any portion of the MealsFor.Me Offerings or any software used in or in connection with MealsFor.Me Offerings. Engaging in any of the aforementioned prohibited practices shall be deemed a breach of the Agreement and may result in the immediate termination of your access to the App and/or Site without notice, in the sole discretion of MealsFor.Me. MealsFor.Me reserves the right to pursue any and all legal remedies against users that engage in the aforementioned prohibited conduct.
          </div>

          <br />

          <div>
          By submitting or posting content to the Interactive Services, you grant MealsFor.Me, its directors, officers, affiliates, subsidiaries, assigns, agents, and licensees the irrevocable, perpetual, worldwide right to reproduce, display, perform, distribute, adapt, and promote any posted content in any medium. Once you submit or post content to the Interactive Services, MealsFor.Me will not give you any right to inspect or approve uses of such content or to compensate you for any such uses. MealsFor.Me owns all right, title, and interest in any compilation, collective work or other derivative work, whether or not created by MealsFor.Me, using or incorporating content posted to the Interactive Services. For more information, please review MealsFor.Me’s Privacy Policy.
          </div>

          <br />

          <div>
          You are solely responsible for anything you may post on the Interactive Services. MealsFor.Me will not be responsible, or liable to any third party, for the content or accuracy of any content posted by you or any other user of the Interactive Services.
          </div>

          <br />

          <div>
          MealsFor.Me is not responsible for, and does not endorse, content in any posting made by other users on the Interactive Services. You are solely responsible for your reliance on anything posted by another user on the Interactive Services. Under no circumstances will MealsFor.Me be held liable, directly or indirectly, for any loss or damage caused or alleged to have been caused to you or any third party in connection with the use of or reliance of any content posted by a third party on the Interactive Services. If you become aware of any misuse of the Sites by any person, please contact MealsFor.Me at support@MealsFor.Me.com.
          </div>

          <br />

          <div>
          If you feel threatened or believe someone else is in danger, you should contact your local law enforcement agency immediately. MealsFor.Me has the right to remove any user contributions from the Interactive Services for any or no reason. MealsFor.Me reserves the right to take necessary legal action against users.
          </div>

          <br />

          <div>
          MealsFor.Me may disclose user information including personal identity and other personal information to any third party who claims that material posted by you violates their rights, including their intellectual property rights or their right to privacy. MealsFor.Me has the right to cooperate with any law enforcement authorities or court order requesting or directing MealsFor.Me to disclose the identity or other information of anyone posting any materials on or through the Interactive Services.
          </div>

          <br />

          <div>
          YOU WAIVE AND HOLD MEALFOR.ME HARMLESS FROM ANY CLAIMS RESULTING FROM ANY ACTION TAKEN BY MEALSFOR.ME, DURING OR AS A RESULT OF ITS INVESTIGATIONS, AND FROM ANY ACTIONS TAKEN AS A CONSEQUENCE OF INVESTIGATIONS BY MEALSFOR.ME, LAW ENFORCEMENT AUTHORITIES OR OTHER THIRD PARTIES.
          </div>

          <br />

          <div>
          MealsFor.Me does not undertake to review any materials before you have posted them on the Interactive Services and cannot ensure prompt removal of objectionable material after it has been posted. MealsFor.Me assumes no liability for any action or inaction regarding transmissions, communications or content provided by any user or third party. MealsFor.Me shall have no liability or responsibility to anyone for performance or nonperformance of the activities described in this section.
          </div>

          <br />

          <div>
          MealsFor.Me has the right to terminate your account and your access to the Interactive Services for any reason, including, without limitation, if MealsFor.Me, in its sole discretion, considers your use to be unacceptable. MealsFor.Me may, but shall not be under any obligation to, provide you a warning prior to termination of your use of the Interactive Services.
          </div>

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          MealsFor.Me Intellectual Property
          </h6>

          <div>
          The Site, App, and all associated Content, design, text, graphics, and interfaces; as well the collection, selection, and arrangement thereof; and all associated software (collectively, the “MealsFor.Me Materials”), are the sole and exclusive property of, or duly licensed to, MealsFor.Me. The MealsFor.Me Materials are copyrighted as a collective work under the laws of the United States and other copyright laws. MealsFor.Me holds the copyright in the collective work. The collective work includes works which may be property of other members. You may display and, subject to any expressly stated restrictions or limitations relating to specific material, download portions of the material from the different areas of the Site and/or App solely for your own non-commercial use, unless otherwise permitted (e.g., in the case of electronic coupons, etc.). Any redistribution, retransmission or publication of any copyrighted material is strictly prohibited without the express written consent of the copyright owner. You agree not to change or delete any proprietary notices from materials downloaded from the Site and/or the App.
          </div>

          <br />

          <div>
          The MealsFor.Me Materials (including but not limited to all information, software, text, displays, images, video and audio, and the design, selection and arrangement thereof), are owned by MealsFor.Me or its affiliates, its licensors or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.
          </div>

          <br />

          <div>
          This Agreement permits you access to the Site and/or the App for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works from, publicly display, publicly perform, republish, download, store or transmit any of the material on our Site and/or the App.
          </div>

          <br />

          <div>
          You must not (i) modify copies of any materials from the Site; (ii) use any illustrations, photographs, video or audio sequences or any graphics separately from the accompanying text, and (iii) delete or alter any copyright, trademark or other proprietary rights notices from copies of materials from the Site and/or the App. You must not access or use for any commercial purposes any part of the Site and/or the App or any services or materials available through the Site and/or the App.
          </div>

          <br />

          <div>
          If you print, copy, modify, download or otherwise use or provide any other person with access to any part of the Site and/or the App in breach of this Agreement, your right to use the Site and/or the App will cease immediately and you must, at our option, return or destroy any copies of the materials you have made. No right, title or interest in or to the Site and/or the App or any content on the Site and/or the App is transferred to you, and all rights not expressly granted are reserved by MealsFor.Me. Any use of the Site and/or the App not expressly permitted by this Agreement is a breach of this Agreement and may violate copyright, trademark and other laws.
          </div>

          <h6 style={{fontWeight: 'bold', marginBottom: '20px'}}>
          Trademarks
          </h6>

          <div>
          The MealsFor.Me name, logo and all related names, logos, product and service names, designs and slogans are trademarks of Infinite Options LLC. or its affiliates or licensors. You must not use such marks without the prior written permission of MealsFor.Me. All other names, logos, product and service names, designs and slogans on the Site and/or the App are the trademarks of their respective owners.
          </div>

          <div>
          Facebook® and Instagram® are registered trademarks of Facebook, Inc. (“Facebook”). LinkedIn® is a registered trademark of LinkedIn Corporation (“LinkedIn”). Pinterest® is a registered trademark of Pinterest, Inc. (“Pinterest”). Twitter® is a registered trademark of Twitter, Inc. (“Twitter”). Snapchat® is a registered trademark of Snapchat, Inc. YouTube® is a registered trademark of Google, Inc. (“Google”). Please be advised that MealsFor.Me is not in any way affiliated with Facebook, Google, LinkedIn, Pinterest or Twitter, and the MealsFor.Me Offerings are not endorsed, administered or sponsored by any of those parties.
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

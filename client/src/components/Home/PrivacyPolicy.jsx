import Logo from "../../images/LOGO_NoBG_MealsForMe.png";
import { WebNavBar } from "../NavBar";
import styles from "./home.module.css";
import { FootLink } from "./homeButtons";

const PrivacyPolicy = () => {
    return (
        <div>
            <WebNavBar />
            <div className={styles.privacyHeader} style={{marginLeft:"18%", gap:"20%"}}>
                <h1 className={styles.privacyTitle}>Meals For Me Privacy Policy</h1>
                <img src={Logo}></img>
            </div>
            <h1 style={{marginLeft:"18%"}}>Last updated: July 21, 2024</h1>
            <div style={{marginLeft:"20%", marginRight:"20%"}}>
                <h1 style={{fontSize:"50px", marginTop:"100px"}}>Privacy Policy</h1>
                <h1 className={styles.bodyText}>Infinite Options, LLC (”us”, "we", or "our") operates Meals For Me (the “Application"). This page informs
you of our policies regarding the collection, use and disclosure of Personal Information we receive from
users of the mobile application and web applications (the “Platforms”).
<br/><br/>We use your Personal Information only for providing and improving the Application. By using the
Application, you agree to the collection and use of information in accordance with this policy.</h1>
                <h1 className={styles.bodyTitle}>Information Collection And Use</h1>
                <h1 className={styles.bodyText}>While using our Application, we may ask you to provide us with certain personally identifiable information
that can be used to contact or identify you. Personally identifiable information may include, but is not
limited to your name, email, social id (if you used social media to log in), street address, phone number,
and payment information ("Personal Information”). This data is stored within our secure databases and
we use this data to identify you with your account and purchases. We also use this data to pre-populate
the information into your Application profile.</h1>
                <h1 className={styles.bodyTitle}>Log Data</h1>
                <h1 className={styles.bodyText}>Like many application operators, we collect information that your Platform sends whenever you visit our
Application ("Log Data").<br/><br/>
This Log Data may include information such as your phone’s Internet Protocol ("IP") address, phone type,
software version, the pages of our Application that you visit, the time and date of your visit, the time spent
on those pages and other statistics.<br/><br/>
In addition, we may use third party services such as Google Analytics that collect, monitor and
analyze this information to improve the Application.</h1>
                <h1 className={styles.bodyTitle}>Communications</h1>
                <h1 className={styles.bodyText}>We may use your Personal Information to contact you with newsletters, marketing or promotional
                materials and other information regarding the mobile application.</h1>
                <h1 className={styles.bodyTitle}>Security</h1>
                <h1 className={styles.bodyText}>The security of your Personal Information is important to us, but remember that no method of
transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use
commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute
security.</h1>
                <h1 className={styles.bodyTitle}>Your Rights to Your Data</h1>
                <h1 className={styles.bodyText}>We believe that your personal data is your data. As such, should you ever request to be removed from
our email lists or database you need only send us an email at info@infiniteoptions.com stating your
request. We will comply within 5 working days of receiving your email.</h1>
                <h1 className={styles.bodyTitle}>Changes To This Privacy Policy</h1>
                <h1 className={styles.bodyText}>This Privacy Policy is effective as of October 26, 2021 and will remain in effect except with respect to
any changes in its provisions in the future, which will be in effect immediately after being posted on this
page.<br/><br/>
We reserve the right to update or change our Privacy Policy at any time and you should check this
Privacy Policy periodically. Your continued use of the Service after we post any modifications to the
Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to
abide and be bound by the modified Privacy Policy.<br/><br/>
If we make any material changes to this Privacy Policy, we will notify you either through the email
address you have provided us, or by placing a prominent notice on our mobile application.</h1>
                <h1 className={styles.bodyTitle}>Contact Us</h1>
                <h1 className={styles.bodyText}>If you have any questions about this Privacy Policy, please contact us:<br/><br/>
Infinite Options, LLC<br/>
info@infiniteoptions.com</h1>
            </div>
            <FootLink />
        </div>
    );
}
 
export default PrivacyPolicy;
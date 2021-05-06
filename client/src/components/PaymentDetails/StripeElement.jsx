import { Elements } from '@stripe/react-stripe-js';
import StripeCheckout from './StripeCheckout';

export default function StripeElement(props) {

  console.log("stripePromise: " + JSON.stringify(props.stripePromise));

  return (
    <Elements stripe={props.stripePromise}>
      <StripeCheckout
        customerPassword={props.customerPassword}
        deliveryInstructions={props.deliveryInstructions}
        setPaymentType={props.setPaymentType}
        paymentSummary={props.paymentSummary}
        loggedInByPassword={props.loggedInByPassword}
        latitude={props.latitude}
        longitude={props.longitude}
        email={props.email}
        customerUid={props.customerUid}
        cardInfo={props.cardInfo}
        fetchingFees={props.fetchingFees}
      />
    </Elements>
  );
}

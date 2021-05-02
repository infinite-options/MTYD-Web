import axios from 'axios';

//TODO: Use the point field
export default async function fetchDiscounts(_callback) {

    axios.get(process.env.REACT_APP_SERVER_BASE_URI + 'plans')
      .then((res) => {
        //console.log("(fetchDiscounts) plans: ", res);

        let twoMealPlans = res.data.result.filter( function(e) {
          return e.num_items === 2;
        });

        //console.log("(fetchDiscounts) 2 meal plans: ", twoMealPlans);

        let discounts = [];

        twoMealPlans.forEach((plan) => {
          // console.log(
          //   plan.num_items + " meals, " + 
          //   plan.num_deliveries + " deliveries, " + 
          //   plan.delivery_discount + "% discount"
          // );
          discounts.push({
            deliveries: plan.num_deliveries.toString(),
            discount: plan.delivery_discount
          });
        });

        _callback(discounts);

      })
      .catch((err) => {
        console.log('error happened while fetching plans', err);
        if(err.response){
          console.log("err.response: " + JSON.stringify(err.response));
        }
      });

}
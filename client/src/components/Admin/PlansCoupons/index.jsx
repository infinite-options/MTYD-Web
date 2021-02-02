import { useEffect, useState } from 'react';
import {withRouter} from "react-router";

import {
  Breadcrumb, Container,
} from 'react-bootstrap';

import Plans from './plans';
import Coupons from './coupons';


function PlansCoupons({history, ...props}) {
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
    if (
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("customer_uid="))
    ) {
      setMounted(true);
    } else {
      // Reroute to log in page
      history.push("/");
    }
   },[history])

   if(!mounted) {
     return null;
   }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Plans & Coupons </Breadcrumb.Item>
      </Breadcrumb>
      <Container
        style={{
          maxWidth: 'inherit',
        }}
      >
        <Plans />
        <Coupons />
      </Container>
    </div>
  )
}

export default withRouter(PlansCoupons);

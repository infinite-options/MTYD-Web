import { useEffect, useState } from 'react';
import {withRouter} from "react-router";
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import AdminNavBar from '../AdminNavBar';

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
      // Logged in
      let customer_uid = document.cookie
        .split("; ")
        .find(row => row.startsWith("customer_uid"))
        .split("=")[1];
      axios
      .get(`${API_URL}Profile/${customer_uid}`)
      .then((response) => {
        const role = response.data.result[0].role.toLowerCase();
        if(role === 'admin') {
          setMounted(true);
        } else {
          history.push('/meal-plan');
        }
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
    } else {
      // Reroute to log in page
      history.push("/");
    }
  }, [history]);

   if(!mounted) {
     return null;
   }

  return (
    <div>
      <AdminNavBar currentPage={'plans-coupons'}/>
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

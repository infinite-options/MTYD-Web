import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { sortedArray } from '../../../reducers/helperFuncs';
import {
  Breadcrumb, Container, Row, Col, Modal, Form, Button
} from 'react-bootstrap';
import {
  Table, TableHead, TableSortLabel, TableBody, TableRow, TableCell
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, 
} from '@fortawesome/free-solid-svg-icons';
import {withRouter} from "react-router";
import AdminNavBar from '../AdminNavBar';
import styles from "./zones.module.css";

const google = window.google;

const initialState = {
  mounted: false,
  zones: [],
  sortZone: {
    field: '',
    direction: '',
  },
  editingZone: false,
  editedZone: {
    zone_uid:'',
    z_business_uid:'',
    area:'',
    zone:'',
    zone_name:'',
    z_businesses:'',
    z_delivery_day:'',
    z_delivery_time:'',
    z_accepting_day:'',
    z_accepting_time:'',
    service_fee:'0',
    delivery_fee:'0',
    tax_rate:'0',
    LB_long:'',
    LB_lat:'',
    LT_long:'',
    LT_lat:'',
    RT_long:'',
    RT_lat:'',
    RB_long:'',
    RB_lat:'',
  },
  // businesses: [],
};

function reducer(state, action) {
  switch(action.type) {
    case 'MOUNT':
      return {
        ...state,
        mounted: true,
      }
    case 'FETCH_ZONES':
      return {
        ...state,
        zones: action.payload,
      }
    case 'SORT_ZONES':
      return {
        ...state,
        sortZone: {
          field: action.payload.field,
          direction: action.payload.direction,
        }
      }
    case 'TOGGLE_EDIT_ZONE':
      return {
        ...state,
        // editingZone: !state.editingZone,
        editedZone: action.payload,
      }
    case 'EDIT_ZONE':
      return {
        ...state,
        editedZone: action.payload,
      }
    default:
      return state;
  }
}

function Zones ({history,...props}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check for log in
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
          dispatch({ type: 'MOUNT' });
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

  const getZone = () => {
    axios
      .get(`${API_URL}get_Zones`)
      .then((response) => {
        const zoneApiResult = response.data.result;
        // Convert property values to string and nulls to empty string
        for(let index = 0; index < zoneApiResult.length; index++) {
          for (const property in zoneApiResult[index]) {
            const value = zoneApiResult[index][property];
            zoneApiResult[index][property] = value ? value.toString() : '';
          } 
        }
        dispatch({ type: 'FETCH_ZONES', payload: zoneApiResult});
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }

  const changeSortOptions = (field) => {
    const isAsc = (state.sortZone.field === field && state.sortZone.direction === 'asc');
    const direction = isAsc ? 'desc' : 'asc';
    dispatch({
      type: 'SORT_ZONES',
      payload: {
        field: field,
        direction: direction,
      }
    })
    const sortedZone = sortedArray(state.zones, field, direction);
    dispatch({ type: 'FETCH_ZONES', payload: sortedZone});
  }

  const toggleEditZone = (initialZone) => {
    dispatch({ type: 'TOGGLE_EDIT_ZONE', payload: initialZone});
  }

  const editZone = (property, value) => {
    const newZone = {
      ...state.editedZone,
      [property]: value,
    }
    dispatch({ type: 'EDIT_ZONE', payload: newZone})
  }

  const saveZone = () => {
    if(state.editedZone.zone_uid === '') {
      const newZone = {
        ...state.editedZone,
        z_business_uid: '200-000001', 
        z_businesses: [],
      }
      // Add New Zone
      axios
        .post(`${API_URL}update_zones/create`,newZone)
        .then(() => {
          getZone();
          // toggleEditZone(initialState.editedZone)
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
      // Edit current zone
      axios
        .put(`${API_URL}Update_Zone`,state.editedZone)
        .then((response) => {
          const zoneIndex = state.zones.findIndex((zone) => zone.zone_uid === state.editedZone.zone_uid);
          const newZones = [...state.zones];
          newZones[zoneIndex] = state.editedZone;
          dispatch({ type: 'FETCH_ZONES', payload: newZones});
          // toggleEditZone(initialState.editedZone)
        })
        .catch((err) => {
          if (err.response) {
            // eslint-disable-next-line no-console
            console.log(err.response);
          }
          // eslint-disable-next-line no-console
          console.log(err);
        });
    }
  }

  const createDropdownZones = () => {
    let items = []
    items.push(<option key={-1} value={-1}>Select Zone</option>)
    for (let i = 0; i < state.zones.length; i++) {
      // console.log(i)
      // console.log(state.zones[i])
      items.push(
        <option key={i} value={i}>{state.zones[i].zone_name + ", " + state.zones[i].z_delivery_day} </option>
      )
    }
    return items
  }

  // Do google map stuff here

  let map;

  function initMap() {
    if (document.getElementById("map")) {

      let tempLat = (parseFloat(state.editedZone.LB_lat) + parseFloat(state.editedZone.LT_lat) + parseFloat(state.editedZone.RB_lat) + parseFloat(state.editedZone.RT_lat))/4
      let tempLong = (parseFloat(state.editedZone.LB_long) + parseFloat(state.editedZone.LT_long) + parseFloat(state.editedZone.RB_long) + parseFloat(state.editedZone.RT_long))/4
      let tempZoom = 13

      if (isNaN(tempLat) || isNaN(tempLong)) {
        tempLat = 37.2872
        tempLong = -121.9500
        tempZoom = 11
      }

      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: tempLat, lng: tempLong },
        zoom: tempZoom,
      });

      let zonePolygons = []

      for (let i = 0; i < state.zones.length; i++) {
        zonePolygons.push(
          [
            { lat: parseFloat(state.zones[i].LB_lat), lng: parseFloat(state.zones[i].LB_long) },
            { lat: parseFloat(state.zones[i].LT_lat), lng: parseFloat(state.zones[i].LT_long) },
            { lat: parseFloat(state.zones[i].RT_lat), lng: parseFloat(state.zones[i].RT_long) },
            { lat: parseFloat(state.zones[i].RB_lat), lng: parseFloat(state.zones[i].RB_long) }
          ]
        )
      }

      let polyObjects = []

      for (let i = 0; i < zonePolygons.length; i++) {
        let polyColor = state.zones[i].zone_name.split(" ")[0]
        polyObjects.push(
          new google.maps.Polygon({
            path: zonePolygons[i],
            strokeColor: polyColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: polyColor,
            fillOpacity: 0.35
          })
        )
      }

      for (let i = 0; i< polyObjects.length; i++) {
        polyObjects[i].setMap(map)
      }
    } else {
      console.log("map not found")
    }
  }

  // Fetch Zones
  useEffect(() => {
    getZone();
    // initMap()
  },[]) 

  if (!state.mounted) {
    return null;
  }

  return (
    <div style={{backgroundColor: '#F26522', height: "900px"}}>

      <AdminNavBar currentPage={'edit-meal'}/>

      <div className={styles.containerCustomer}>
        <div style = {{width: "70%", height: "100%", float: "left", fontWeight: 'bold', paddingTop: "45px", paddingLeft: "27px", }}>
          Zones
        </div>
        <div style = {{width: "15%", height: "100%", float: "left", fontWeight: 'bold', color: "#F26522", textAlign: "center", marginTop: "15px",}}>
          Total no. of Zones
          <div style = {{color: "black", fontSize: "30px"}}>
            {state.zones.length}
          </div>
        </div>
        <div style={{width: "15%", height: "100%", float: "left", textAlign: "center"}}>
          <div 
            style = {{fontWeight: 'bold', marginTop: "45px"}}
            onClick={() => {toggleEditZone(initialState.editedZone)}}
          >
            Create New Zone +
          </div>
        </div>
      </div>

      <div
        className={styles.containerMeals}
        // style={{
        //   maxWidth: '100%',
        // }}
      > 
        <div style={{width: "100%"}}>
          <div style={{width: "50%", float: "left"}}>
            <div className = {styles.googleMap} id="map">
            </div>
            {initMap()}
          </div>
          <div style={{width: "50%", float: "left"}}>
            <div style={{width: "60%", float: "left"}}>
              <select 
                className={styles.dropdown}
                onChange={e => {
                  if( e.target.value != -1) {
                    toggleEditZone(state.zones[e.target.value])
                    console.log(state.zones[e.target.value])
                  } else {
                    toggleEditZone(initialState.editedZone)
                  }
                  // toggleEditZone(state.zones[e.target.value])
                  // console.log(state.zones[e.target.value])
                }}
              >
                {createDropdownZones()}
              </select>
              <div>Zone Name:</div>
              <Form.Control
                value={state.editedZone.zone_name}
                onChange={
                  (event) => {
                    editZone('zone_name',event.target.value);
                  }
                }
              />
              <div>Define Zone Points:</div>
              
              <div style={{padding:"10px"}}>
                <div style={{width: "20%", float: "left", color: "#F26522"}}>LB</div>
                <Form.Control
                  style={{width: "38%", float: "left"}}
                  value={state.editedZone.LB_lat}
                  onChange={
                    (event) => {
                      editZone('LB_lat',event.target.value);
                    }
                  }
                />
                <div style={{width: "4%", float: "left"}}>,</div>
                <Form.Control
                  style={{width: "38%", float: "left"}}
                  value={state.editedZone.LB_long}
                  onChange={
                    (event) => {
                      editZone('LB_long',event.target.value);
                    }
                  }
                />
              </div>
              
              <div style={{padding:"10px"}}>
                <div style={{width: "20%", float: "left", color: "#F26522"}}>LT</div>
                <Form.Control
                  style={{width: "38%", float: "left"}}
                  value={state.editedZone.LT_lat}
                  onChange={
                    (event) => {
                      editZone('LT_lat',event.target.value);
                    }
                  }
                />
                <div style={{width: "4%", float: "left"}}>,</div>
                <Form.Control
                  style={{width: "38%", float: "left"}}
                  value={state.editedZone.LT_long}
                  onChange={
                    (event) => {
                      editZone('LT_long',event.target.value);
                    }
                  }
                />
              </div>
              
              <div style={{padding:"10px"}}>
                <div style={{width: "20%", float: "left", color: "#F26522"}}>RB</div>
                <Form.Control
                  style={{width: "38%", float: "left"}}
                  value={state.editedZone.RB_lat}
                  onChange={
                    (event) => {
                      editZone('RB_lat',event.target.value);
                    }
                  }
                />
                <div style={{width: "4%", float: "left"}}>,</div>
                <Form.Control
                  style={{width: "38%", float: "left"}}
                  value={state.editedZone.RB_long}
                  onChange={
                    (event) => {
                      editZone('RB_long',event.target.value);
                    }
                  }
                />
              </div>
              
              <div style={{padding:"10px"}}>
                <div style={{width: "20%", float: "left", color: "#F26522"}}>RT</div>
                <Form.Control
                  style={{width: "38%", float: "left"}}
                  value={state.editedZone.RT_lat}
                  onChange={
                    (event) => {
                      editZone('RT_lat',event.target.value);
                    }
                  }
                />
                <div style={{width: "4%", float: "left"}}>,</div>
                <Form.Control
                  style={{width: "38%", float: "left"}}
                  value={state.editedZone.RT_long}
                  onChange={
                    (event) => {
                      editZone('RT_long',event.target.value);
                    }
                  }
                />
              </div>
              

              <div style={{width: "33%", float: "left", color: "#F26522"}}>Area:</div>
              <Form.Control
                style={{width: "66%", float: "left"}}
                value={state.editedZone.area}
                onChange={
                  (event) => {
                    editZone('area',event.target.value);
                  }
                }
              />
              
              <div style={{width: "33%", float: "left", color: "#F26522"}}>Zone:</div>
              <Form.Control
                style={{width: "66%", float: "left"}}
                value={state.editedZone.zone}
                onChange={
                  (event) => {
                    editZone('zone',event.target.value);
                  }
                }
              />

            </div>
            <div style={{width: "40%", float: "left"}}>
              <div>
                <div>Zone UID:</div>
                <Form.Control
                  value={state.editedZone.zone_uid}
                  onChange={
                    (event) => {
                      editZone('zone_uid',event.target.value);
                    }
                  }
                />
              </div>
              <div>
                <div>Business UID:</div>
                <Form.Control
                  value={state.editedZone.z_business_uid}
                  onChange={
                    (event) => {
                      editZone('z_business_uid',event.target.value);
                    }
                  }
                />
              </div>
              <div>
                <div>Delivery Day</div>
                <Form.Control
                  value={state.editedZone.z_delivery_day}
                  onChange={
                    (event) => {
                      editZone('z_delivery_day',event.target.value);
                    }
                  }
                />
              </div>
              <div>
                <div>Delivery Time</div>
                <Form.Control
                  value={state.editedZone.z_delivery_time}
                  onChange={
                    (event) => {
                      editZone('z_delivery_time',event.target.value);
                    }
                  }
                />
              </div>
              <div>
                <div>Accepting Time</div>
                <Form.Control
                  value={state.editedZone.z_accepting_time}
                  onChange={
                    (event) => {
                      editZone('z_accepting_time',event.target.value);
                    }
                  }
                />
              </div>
              <div>
                <div>Delivery Fee</div>
                <Form.Control
                  value={state.editedZone.delivery_fee}
                  onChange={
                    (event) => {
                      editZone('delivery_fee',event.target.value);
                    }
                  }
                />
              </div>
              <div>
                <div>Service Fee</div>
                <Form.Control
                  value={state.editedZone.service_fee}
                  onChange={
                    (event) => {
                      editZone('service_fee',event.target.value);
                    }
                  }
                />
              </div>
              <div>
                <div>Tax Rate</div>
                <Form.Control
                  value={state.editedZone.tax_rate}
                  onChange={
                    (event) => {
                      editZone('tax_rate',event.target.value);
                    }
                  }
                />
              </div>
            </div>
            <div style={{textAlign: "center"}}>
              <Button
                style={{backgroundColor: "#F26522", borderRadius: "15px"}}
                variant="secondary"
                onClick={() => saveZone()}
              >
                Save Zone
              </Button>
            </div>
            
          </div>
        </div>

        
      </div>
      <Modal
        show={state.editingZone}
        // onHide={() => toggleEditZone(initialState.editedZone)}
        size='lg'
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Add/Edit Zone </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> Zone Name </Form.Label>
                  <Form.Control
                    value={state.editedZone.zone_name}
                    onChange={
                      (event) => {
                        editZone('zone_name',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md="3">
                <Form.Group>
                  <Form.Label> Area </Form.Label>
                  <Form.Control
                    value={state.editedZone.area}
                    onChange={
                      (event) => {
                        editZone('area',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md="3">
                <Form.Group>
                  <Form.Label> Zone </Form.Label>
                  <Form.Control
                    value={state.editedZone.zone}
                    onChange={
                      (event) => {
                        editZone('zone',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> Delivery Day </Form.Label>
                  <Form.Control
                    value={state.editedZone.z_delivery_day}
                    onChange={
                      (event) => {
                        editZone('z_delivery_day',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> Delivery Time </Form.Label>
                  <Form.Control
                    value={state.editedZone.z_delivery_time}
                    onChange={
                      (event) => {
                        editZone('z_delivery_time',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> Accepting Day </Form.Label>
                  <Form.Control
                    value={state.editedZone.z_accepting_day}
                    onChange={
                      (event) => {
                        editZone('z_accepting_day',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> Accepting Time </Form.Label>
                  <Form.Control
                    value={state.editedZone.z_accepting_time}
                    onChange={
                      (event) => {
                        editZone('z_accepting_time',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col md='4'>
                <Form.Group>
                  <Form.Label> Service Fee </Form.Label>
                  <Form.Control
                    value={state.editedZone.service_fee}
                    onChange={
                      (event) => {
                        editZone('service_fee',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md='4'>
                <Form.Group>
                  <Form.Label> Delivery Fee </Form.Label>
                  <Form.Control
                    value={state.editedZone.delivery_fee}
                    onChange={
                      (event) => {
                        editZone('delivery_fee',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md='4'>
                <Form.Group>
                  <Form.Label> Tax Rate </Form.Label>
                  <Form.Control
                    value={state.editedZone.tax_rate}
                    onChange={
                      (event) => {
                        editZone('tax_rate',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> LT lat </Form.Label>
                  <Form.Control
                    value={state.editedZone.LT_lat}
                    onChange={
                      (event) => {
                        editZone('LT_lat',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> RT lat </Form.Label>
                  <Form.Control
                    value={state.editedZone.RT_lat}
                    onChange={
                      (event) => {
                        editZone('RT_lat',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> LT long </Form.Label>
                  <Form.Control
                    value={state.editedZone.LT_long}
                    onChange={
                      (event) => {
                        editZone('LT_long',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> RT long </Form.Label>
                  <Form.Control
                    value={state.editedZone.RT_long}
                    onChange={
                      (event) => {
                        editZone('RT_long',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> LB lat </Form.Label>
                  <Form.Control
                    value={state.editedZone.LB_lat}
                    onChange={
                      (event) => {
                        editZone('LB_lat',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> RB lat </Form.Label>
                  <Form.Control
                    value={state.editedZone.RB_lat}
                    onChange={
                      (event) => {
                        editZone('RB_lat',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> LB long </Form.Label>
                  <Form.Control
                    value={state.editedZone.LB_long}
                    onChange={
                      (event) => {
                        editZone('LB_long',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
              <Col md='6'>
                <Form.Group>
                  <Form.Label> RB long </Form.Label>
                  <Form.Control
                    value={state.editedZone.RB_long}
                    onChange={
                      (event) => {
                        editZone('RB_long',event.target.value);
                      }
                    }
                  />
                </Form.Group>
              </Col>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            // onClick={() => toggleEditZone(initialState.editedZone)}
          >
            Close
          </Button>
          <Button
            variant="secondary"
            onClick={() => saveZone()}
          >
            Save Zone
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default withRouter(Zones);
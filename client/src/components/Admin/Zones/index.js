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
        editingZone: !state.editingZone,
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
          toggleEditZone(initialState.editedZone)
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
          toggleEditZone(initialState.editedZone)
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

  // Fetch Zones
  useEffect(() => {
    getZone();
  },[])

  if (!state.mounted) {
    return null;
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Zones </Breadcrumb.Item>
      </Breadcrumb>
      <Container
        style={{
          maxWidth: 'inherit',
        }}
      >
        <Row>
          <Col>
            <h5>
              Zones
            </h5>
          </Col>
          <Col
            style={{
              textAlign: 'right'
            }}
          >
            <Button
              onClick={() => {toggleEditZone(initialState.editedZone)}}
            >
              Add New Zone
            </Button>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: '1rem'
          }}
        >
          <Col>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'zone_name'}
                      direction={state.sortZone.field === 'zone_name' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('zone_name')}
                    >
                      Zone Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'area'}
                      direction={state.sortZone.field === 'area' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('area')}
                    >
                      Area
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'zone'}
                      direction={state.sortZone.field === 'zone' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('zone')}
                    >
                      Zone
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'z_delivery_day'}
                      direction={state.sortZone.field === 'z_delivery_day' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('z_delivery_day')}
                    >
                      Delivery Day
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'z_delivery_time'}
                      direction={state.sortZone.field === 'z_delivery_time' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('z_delivery_time')}
                    >
                      Delivery Time
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'z_accepting_day'}
                      direction={state.sortZone.field === 'z_accepting_day' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('z_accepting_day')}
                    >
                      Accepting Day
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'z_accepting_time'}
                      direction={state.sortZone.field === 'z_accepting_time' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('z_accepting_time')}
                    >
                      Accepting Time
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'service_fee'}
                      direction={state.sortZone.field === 'service_fee' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('service_fee')}
                    >
                      Service Fee
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'delivery_fee'}
                      direction={state.sortZone.field === 'delivery_fee' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('delivery_fee')}
                    >
                      Delivery Fee
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'tax_rate'}
                      direction={state.sortZone.field === 'tax_rate' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('tax_rate')}
                    >
                      Tax Rate
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'LB_long'}
                      direction={state.sortZone.field === 'LB_long' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('LB_long')}
                    >
                      LB long
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'LB_lat'}
                      direction={state.sortZone.field === 'LB_lat' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('LB_lat')}
                    >
                      LB lat
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'LT_long'}
                      direction={state.sortZone.field === 'LT_long' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('LT_long')}
                    >
                      LT long
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'LT_lat'}
                      direction={state.sortZone.field === 'LT_lat' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('LT_lat')}
                    >
                      LT lat
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'RB_long'}
                      direction={state.sortZone.field === 'RB_long' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('RB_long')}
                    >
                      RB long
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'RB_lat'}
                      direction={state.sortZone.field === 'RB_lat' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('RB_lat')}
                    >
                      RB lat
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'RT_long'}
                      direction={state.sortZone.field === 'RT_long' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('RT_long')}
                    >
                      RT long
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortZone.field === 'RT_lat'}
                      direction={state.sortZone.field === 'RT_lat' ? state.sortZone.direction : 'asc'}
                      onClick={() => changeSortOptions('RT_lat')}
                    >
                      RT lat
                    </TableSortLabel>
                  </TableCell>
                  <TableCell> Action </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {
                state.zones.map(
                  (zone) => {
                    return (
                      <TableRow
                        key={zone.zone_uid}
                      >
                        <TableCell> {zone.zone_name} </TableCell>
                        <TableCell> {zone.area} </TableCell>
                        <TableCell> {zone.zone} </TableCell>
                        <TableCell> {zone.z_delivery_day} </TableCell>
                        <TableCell> {zone.z_delivery_time} </TableCell>
                        <TableCell> {zone.z_accepting_day} </TableCell>
                        <TableCell> {zone.z_accepting_time} </TableCell>
                        <TableCell> {zone.service_fee} </TableCell>
                        <TableCell> {zone.delivery_fee} </TableCell>
                        <TableCell> {zone.tax_rate} </TableCell>
                        <TableCell> {zone.LB_long} </TableCell>
                        <TableCell> {zone.LB_lat} </TableCell>
                        <TableCell> {zone.LT_long} </TableCell>
                        <TableCell> {zone.LT_lat} </TableCell>
                        <TableCell> {zone.RB_long} </TableCell>
                        <TableCell> {zone.RB_lat} </TableCell>
                        <TableCell> {zone.RT_long} </TableCell>
                        <TableCell> {zone.RT_lat} </TableCell>
                        <TableCell>
                          <button
                            className={'icon-button'}
                            onClick={() => {toggleEditZone(zone)}}
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                            />
                          </button>
                        </TableCell>
                      </TableRow>
                    )
                  }
                )
              }
              </TableBody>
            </Table>
          </Col>
        </Row>
      </Container>
      <Modal
        show={state.editingZone}
        onHide={() => toggleEditZone(initialState.editedZone)}
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
            onClick={() => toggleEditZone(initialState.editedZone)}
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
import PropTypes from 'prop-types';
import {
  Nav, Form, Button, Modal
} from 'react-bootstrap';
import styles from './notifications.module.css';

const NotificationOptions = ({state, dispatch}) => {

  const changeNotificationType = (event) => {
    dispatch({
      type: 'SWITCH_NOTIFICATION_TYPE',
      payload: event.target.value,
    })
  }  

  return (
    <>
      <Nav>
        <Nav.Item
          className={styles.optionItem}
        >
            <Form>
              <Form.Control
                as="select"
                value={state.notificationType}
                onChange={changeNotificationType}
              >
                <option value='Notifications'> Notifications </option>
                <option value='SMS'> SMS </option>
              </Form.Control>
            </Form>
        </Nav.Item>
        <Nav.Item
          className={styles.optionItem}
        >
          <Button>
            History
          </Button>
        </Nav.Item>
        <Nav.Item
          className={styles.optionItem}
        >
          <Button>
            Saved Group
          </Button>
        </Nav.Item>
        <Nav.Item
          className={styles.optionItem}
        >
          <Button>
            Saved Messages
          </Button>
        </Nav.Item>
      </Nav>
      <Modal
        open={state.history.open}
      >
        Test History Modal
      </Modal>
      <Modal
        open={state.group.open}
      >
        Test Group Modal
      </Modal>
      <Modal
        open={state.savedMessages.open}
      >
        Test Messages Modal
      </Modal>
    </>
  )
}

NotificationOptions.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default NotificationOptions;
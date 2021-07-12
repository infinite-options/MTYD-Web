import {
  Breadcrumb, Container,
} from 'react-bootstrap';
import AdminNavBar from '../AdminNavBar';

function GoogleAnalytics() {
  return (
    <div>
      <AdminNavBar currentPage={'google-analytics'}/>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Google Analytics </Breadcrumb.Item>
      </Breadcrumb>
      <Container
        style={{
          maxWidth: 'inherit',
        }}
      >
      </Container>
    </div>
  )
}

export default GoogleAnalytics;
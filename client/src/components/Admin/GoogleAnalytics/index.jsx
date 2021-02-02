import {
  Breadcrumb, Container,
} from 'react-bootstrap';

function GoogleAnalytics() {
  return (
    <div>
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
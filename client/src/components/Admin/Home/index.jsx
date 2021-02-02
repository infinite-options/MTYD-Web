import Breadcrumb from 'react-bootstrap/Breadcrumb';

function Home() {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item active> Admin Site </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        Welcome to Meal To Your Door Admin
      </div>
    </div>
  );
}

export default Home;

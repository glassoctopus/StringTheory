import { Button } from 'react-bootstrap';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';
import UserCard from '../components/UserCard';

function Home() {
  const { user } = useAuth();
  console.warn(user);

  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-content-center"
      style={{
        height: '90vh',
        padding: '30px',
        // maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <div className="grid-container">
        <div key={1} className="grid-item">*</div>
        <div key={2} className="grid-item">*</div>
        <div key={3} className="grid-item">*</div>
        <div key={4} className="grid-item">*</div>
        <div
          key={5}
          className="text-center" // justify-content-center align-content-center"
        >
          <UserCard userObj={user} />
          <Button variant="danger" type="button" size="lg" className="copy-btn" onClick={signOut}>Sign Out</Button>
        </div>
        <div key={6} className="grid-item">*</div>
        <div key={7} className="grid-item">*</div>
        <div key={8} className="grid-item">*</div>
        <div key={9} className="grid-item">*</div>
      </div>
    </div>
  );
}

export default Home;

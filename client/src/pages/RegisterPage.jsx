import Navbar from '../components/Navbar';
import RegisterBox from '../components/RegisterBox';
import './styles/login.css';

const RegisterPage = () => {
  return (
    <div className="login-page">
      <Navbar />
      <main className="login-main">
        <RegisterBox />
      </main>
    </div>
  );
};

export default RegisterPage;

import Navbar from '../components/Navbar';
import LoginBox from '../components/LoginBox';
import './styles/login.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <Navbar />
      <main className="login-main">
        <LoginBox />
      </main>
    </div>
  );
};

export default LoginPage;
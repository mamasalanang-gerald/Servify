import Navbar from '../components/Navbar';
import LoginBox from '../components/LoginBox';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <LoginBox />
      </main>
    </div>
  );
};

export default LoginPage;
import Navbar from '../components/Navbar';
import RegisterBox from '../components/RegisterBox';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <RegisterBox />
      </main>
    </div>
  );
};

export default RegisterPage;

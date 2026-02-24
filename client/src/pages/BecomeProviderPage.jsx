import Navbar from '../components/Navbar';
import BecomeProviderBox from '../components/BecomeProviderBox';

const BecomeProviderPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <BecomeProviderBox />
      </main>
    </div>
  );
};

export default BecomeProviderPage;
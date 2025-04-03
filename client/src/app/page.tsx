import Navbar from '@/components/Navbar';
import LandingPage from './(nondashboard)/landing/page';

export default function Home() {
  return (
    <div className={`w-full h-full`}>
      <Navbar />
      <main className="h-full flex w-full flex-col">
        <LandingPage />
      </main>
    </div>
  );
}

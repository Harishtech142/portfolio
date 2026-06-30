import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useScrollProgress } from './hooks';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import HomePage from './pages/HomePage';
import WorkflowPage from './pages/WorkflowPage';

/* Scrolls to a #section on navigation (e.g. coming back from /workflow/:id
   via a link to "/#projects"). React Router doesn't do this automatically. */
function ScrollToHash() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (hash) {
      // Wait a tick for the target page's content to mount.
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return () => clearTimeout(timer);
    }
    if (pathname === '/') window.scrollTo({ top: 0 });
  }, [hash, pathname]);
  return null;
}

function AppShell() {
  const [loading, setLoading] = useState(true);
  const scrollProgress = useScrollProgress();
  const { pathname } = useLocation();
  const isWorkflowPage = pathname.startsWith('/workflow/');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CustomCursor />
      <LoadingScreen isLoading={loading} />
      <ScrollToHash />

      {!loading && (
        <>
          {/* The dedicated Workflow Viewer page has its own focused top bar —
              skip the main site navbar/footer there to keep it distraction-free. */}
          {!isWorkflowPage && <Navbar scrollProgress={scrollProgress} />}

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workflow/:id" element={<WorkflowPage />} />
          </Routes>

          {!isWorkflowPage && <Footer />}
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

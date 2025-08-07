import { Outlet } from 'react-router-dom';
import Footer from '../../NavBottom-Bar/Footer';

const Layout = () => (
  <div className="layout-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <main style={{ flexGrow: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
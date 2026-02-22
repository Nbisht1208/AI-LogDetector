import { Route, Routes, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogDetail from './pages/LogDetail';
import LogsList from './pages/Logs';
import LogUpload from './pages/LogUpload';
import Alerts from './pages/Alert';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

const NO_NAVBAR_ROUTES = ['/login', '/register'];

function App() {
  const location = useLocation();
  const showNavbar = !NO_NAVBAR_ROUTES.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/Logs" element={<PrivateRoute><LogsList /></PrivateRoute>} />
        <Route path="/LogUpload" element={<PrivateRoute><LogUpload /></PrivateRoute>} />
        <Route path="/LogDetail/:id" element={<PrivateRoute><LogDetail /></PrivateRoute>} />
        <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
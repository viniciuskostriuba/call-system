import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import AllRoutes from './routes';
import AuthProvider from './contexts/auth';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <ToastContainer autoClose={5000} position={"top-center"}/>
        <AllRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

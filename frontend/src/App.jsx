import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import Register from './components/Register';
import Diagnostic from './components/Diagnostic';
import PrivateRoute from './components/PrivateRoute';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    // BrowserRouter обеспечивает маршрутизацию на стороне клиента
    <Router>
      <div className="bg-light min-vh-100">
        {/* ToastContainer отображает всплывающие уведомления */}
        <ToastContainer />
        {/* Routes определяет все доступные маршруты в приложении */}
        <Routes>
          {/* Route для страницы логина. */}
          <Route path="/login" element={<Login />} />
          {/* Route для страницы регистрации. */}
          <Route path="/register" element={<Register />} />
          {/* Route для страницы диагностики, защищенной с помощью PrivateRoute */}
          <Route
            path="/diagnostic"
            element={
              // PrivateRoute оборачивает компонент Diagnostic, обеспечивая доступ только авторизованным пользователям
              <PrivateRoute>
                <Diagnostic />
              </PrivateRoute>
            }
          />
          {/* Route для перенаправления с корневого пути на страницу логина */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const userEmail = localStorage.getItem('userEmail'); // Получаем email пользователя из localStorage

  if (!userEmail) {
    // Если email пользователя не найден в localStorage (пользователь не залогинен), перенаправляем на страницу логина
    return <Navigate to="/login" replace />;
  }

  return children; // Если пользователь залогинен, отображаем дочерний компонент
}

export default PrivateRoute;
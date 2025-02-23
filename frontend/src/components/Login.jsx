import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api/api';

function Login() {
  const [email, setEmail] = useState(''); // Состояние для хранения email пользователя
  const [password, setPassword] = useState(''); // Состояние для хранения пароля пользователя
  const navigate = useNavigate(); // Хук для навигации

  const userEmail = localStorage.getItem('userEmail'); // Получаем email пользователя из localStorage.  Используется для идентификации пользователя при запросах к API

  useEffect(() => {
    // useEffect hook выполняется при монтировании компонента и при изменении зависимостей (в данном случае, пустой массив, поэтому только при монтировании)
    if (userEmail) {
      // Если email пользователя не найден в localStorage (пользователь не залогинен), перенаправляем на страницу логина
      navigate('/diagnostic');
      return; // Важно: выходим из useEffect, чтобы предотвратить дальнейшее выполнение
    }
  }, []); // Пустой массив зависимостей означает, что useEffect выполнится только один раз при монтировании компонента

  const handleSubmit = async (e) => {
    // Функция для обработки отправки формы логина.
    e.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы
    try {
      const response = await api.loginUser(email, password); // Вызываем функцию api.loginUser для авторизации пользователя
      localStorage.setItem('userEmail', email); // Сохраняем email пользователя в localStorage
      navigate('/diagnostic'); // Перенаправляем на страницу диагностики
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка входа'); // Отображаем сообщение об ошибке
    }
  };

  return (
    // Отображаем форму логина
    <div className="container">
      <div className="row min-vh-100 align-items-center justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Вход</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Войти
                </button>
              </form>
              <p className="text-center mt-3">
                Нет аккаунта?{' '}
                <Link to="/register" className="text-decoration-none">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
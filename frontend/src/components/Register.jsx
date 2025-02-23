import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api/api';

function Register() {
  const [email, setEmail] = useState(''); // Состояние для хранения email пользователя
  const [lastName, setLastName] = useState(''); // Состояние для хранения фамилии пользователя
  const [firstName, setFirstName] = useState(''); // Состояние для хранения имени пользователя
  const [patronymic, setPatronymic] = useState(''); // Состояние для хранения отчества пользователя
  const [password, setPassword] = useState(''); // Состояние для хранения пароля пользователя
  const navigate = useNavigate(); // Хук для навигации

  const handleSubmit = async (e) => {
    // Функция для обработки отправки формы регистрации
    e.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы
    try {
      const response = await api.registerUser(email, lastName, firstName, patronymic, password); // Вызываем функцию api.registerUser для регистрации пользователя
      toast.success(response?.data?.message || 'Регистрация успешна'); // Отображаем сообщение об успехе
      navigate('/login'); // Перенаправляем на страницу логина
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка регистрации'); // Отображаем сообщение об ошибке
    }
  };

  return (
    // Отображаем форму регистрации
    <div className="container">
      <div className="row min-vh-100 align-items-center justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Регистрация</h2>
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
                <div className="mb-3">
                  <label className="form-label">Фамилия</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Имя</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Отчество</label>
                  <input
                    type="text"
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
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
                  Зарегистрироваться
                </button>
              </form>
              <p className="text-center mt-3">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-decoration-none">
                  Войти
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
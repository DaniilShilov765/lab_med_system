import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api/api';

function Diagnostic() {
  const [currentQuestion, setCurrentQuestion] = useState(null); // Состояние для хранения текущего вопроса.  Начальное значение - null
  const [diagnosis, setDiagnosis] = useState([]); // Состояние для хранения списка возможных заболеваний и их вероятностей.  Начальное значение - пустой массив
  const [loading, setLoading] = useState(true); // Состояние для отображения индикатора загрузки.  Начальное значение - true (загрузка идет)
  const [completed, setCompleted] = useState(false); // Состояние, указывающее, завершена ли диагностика. Начальное значение - false
  const navigate = useNavigate(); // Хук для навигации по страницам

  const userEmail = localStorage.getItem('userEmail'); // Получаем email пользователя из localStorage.  Используется для идентификации пользователя при запросах к API

  useEffect(() => {
    // useEffect hook выполняется при монтировании компонента и при изменении зависимостей (в данном случае, пустой массив, поэтому только при монтировании)
    if (!userEmail) {
      // Если email пользователя не найден в localStorage (пользователь не залогинен), перенаправляем на страницу логина
      navigate('/login');
      return; // Важно: выходим из useEffect, чтобы предотвратить дальнейшее выполнение
    }
    getNextQuestion(); // Если email есть, запрашиваем первый вопрос.
  }, []); // Пустой массив зависимостей означает, что useEffect выполнится только один раз при монтировании компонента

  const getNextQuestion = async () => {
    // Функция для получения следующего вопроса.
    try {
      setLoading(true); // Устанавливаем состояние загрузки в true.
      const question = await api.getNextQuestion(userEmail); // Вызываем функцию api.getNextQuestion для получения следующего вопроса
      setCurrentQuestion(question?.data); // Обновляем состояние currentQuestion полученным вопросом
      return question;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка получения вопроса'); // Отображаем сообщение об ошибке, если запрос не удался.
    } finally {
      setLoading(false); // Устанавливаем состояние загрузки в false в любом случае (успех или ошибка)
    }
  };

  const handleAnswer = async (answer) => {
    // Функция для обработки ответа пользователя на вопрос.
    try {
      setLoading(true); // Устанавливаем состояние загрузки в true.
      const result = await api.submitAnswer(userEmail, currentQuestion.id, answer); // Отправляем ответ на сервер.

      if (result?.data?.diagnosis) {
        setDiagnosis(result.data.diagnosis); // Обновляем состояние diagnosis списком заболеваний, полученных от сервера.

        // const highProbabilityDisease = result.diagnosis.find(d => d.probability > 50); // Ищем заболевание с вероятностью больше 50%.
        // if (highProbabilityDisease) {
        //   setCompleted(true); // Если такое заболевание найдено, считаем диагностику завершенной.
        //   toast.success('Диагностика завершена'); // Отображаем сообщение об успехе.
        //   return; // Выходим из функции.
        // }
      }

      const response = await getNextQuestion(); // Если заболевание с высокой вероятностью не найдено, запрашиваем следующий вопрос
      if (response?.status === 204) {
        // Если сервер возвращает статус 204, считаем диагностику завершенной (обычно это значит, что больше вопросов нет)
        console.log('test');
        setCompleted(true);
        toast.success('Диагностика завершена');
      }
    } catch (error) {
      // Обработка ошибок при отправке ответа
        toast.error('Ошибка при отправке ответа'); // Отображаем сообщение об ошибке  
      
    } finally {
      setLoading(false); // Устанавливаем состояние загрузки в false в любом случае (успех или ошибка)
    }
  };

  const handleLogout = () => {
    // Функция для выхода пользователя из системы.
    localStorage.removeItem('userEmail'); // Удаляем email пользователя из localStorage.
    navigate('/login'); // Перенаправляем на страницу логина.
  };

  const handleReset = async () => {
    // Функция для обработки сброса ответов.
    try {
      const response = await api.resetResult(email); // Вызываем функцию api.resetResult для сброса результата
      toast.success(response?.data?.message || 'Результат успешно сброшен');
      setCompleted(false);
      getNextQuestion();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка сброса результата'); // Отображаем сообщение об ошибке
    }
  }

  if (loading) {
    // Отображаем индикатор загрузки, пока идет запрос к API.
    return (
      <div className="container">
        <div className="row min-vh-100 align-items-center justify-content-center">
          <div className="col text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Отображаем интерфейс диагностической страницы.
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0">Медицинская диагностика</h1>
            <div>
              <span className='me-3'>{userEmail}</span>
            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Выйти
            </button>
            </div>
            
          </div>
        </div>
      </div>

      {completed ? (
        // Если диагностика завершена, отображаем результаты
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6 mx-auto">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="h4 mb-4">Диагностика завершена</h2>
                <div className="list-group">
                  {diagnosis.map((disease, index) => (
                    // Выводим список заболеваний и их вероятностей.
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{disease.name}</span>
                      <span className="badge bg-primary rounded-pill">{disease.probability}%</span>
                    </div>
                  ))}
                </div>
                {/* <button onClick={handleReset} className='btn btn-danger'>
                Сброс
                </button> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Если диагностика не завершена, отображаем текущий вопрос и кнопки для ответа
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6 mx-auto">
            {currentQuestion && (
              // Если есть текущий вопрос, отображаем его.
              <div className="card shadow mb-4">
                <div className="card-body">
                  <h2 className="h4 mb-4">{currentQuestion.text}</h2>
                  <div className="d-grid gap-2 d-md-flex justify-content-center">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="btn btn-success px-4"
                    >
                      Да
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      className="btn btn-danger px-4"
                    >
                      Нет
                    </button>
                  </div>
                </div>
              </div>
            )}

            {diagnosis.length > 0 && (
              // Если есть список заболеваний, отображаем их вероятности
              <div className="card shadow">
                <div className="card-body">
                  <h3 className="h5 mb-3">Текущие вероятности заболеваний:</h3>
                  <div className="list-group">
                    {diagnosis.map((disease, index) => (
                      // Выводим список заболеваний и их вероятностей
                      <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{disease.name}</span>
                        <span className="badge bg-primary rounded-pill">{disease.probability}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Diagnostic;
import axios from 'axios';
const BASE_URL = 'http://172.18.0.2:8000/api'; // Адрес с бэком

export const api = {
  registerUser: async (email, lastName, firstName, patronymic, password) => {
    // Функция для регистрации пользователя.  Асинхронная
    try {
      const response = await axios.post(`${BASE_URL}/RegisterPatient`, {
        email,
        lastName,
        firstName,
        patronymic,
        password
      });
      return response; // Возвращает данные, полученные от сервера (JSON)
    } catch (error) {
      console.error("Registration error:", error.toJSON());
      throw error; // Повторно выдаём ошибку для вызывающего компонента 
    }
  },

  loginUser: async (email, password) => {
    // Функция для авторизации пользователя. Асинхронная
    try {
      const response = await axios.post(`${BASE_URL}/LoginPatient`, {
        email,
        password
      });
      return response; // Возвращает данные, полученные от сервера (обычно JSON)
    } catch (error) {
      console.error("Login error:", error.toJSON());
      throw error; // Повторно выдаём ошибку для вызывающего компонента 
    }
  },

  getNextQuestion: async (email) => {
    // Функция для получения следующего вопроса для диагностики. Асинхронная
    try {
      const response = await axios.get(`${BASE_URL}/GetNextQuestion`, {
        params: { email }
      });
      return response; // Возвращает данные, полученные от сервера (JSON), содержащие информацию о следующем вопросе
    } catch (error) {
      console.error("Get next question error:", error.toJSON());
      throw error; // Повторно выдаём ошибку для вызывающего компонента
    }
  },

  submitAnswer: async (email, questionId, answer) => {
    // Функция для отправки ответа на вопрос и получения результатов диагностики
    try {
      const response = await axios.post(`${BASE_URL}/SubmitAnswer`, {
        email,
        questionId,
        answer
      });
      return response; // Возвращает данные, полученные от сервера (JSON), содержащие результаты диагностики (список возможных заболеваний и их вероятности)
    } catch (error) {
      console.error("Submit answer error:", error.toJSON());
      throw error; // Повторно выдаём ошибку для вызывающего компонента
    }
  },

  resetResult: async () => {
    // Функция для сброса ответов. Асинхронная
    try {
      const response = await axios.post(`${BASE_URL}/ResetResult`, {
        email
      });
      return response; // Возвращает данные, полученные от сервера (обычно JSON)
    } catch (error) {
      console.error("Reset error:", error.toJSON());
      throw error; // Повторно выдаём ошибку для вызывающего компонента 
    }
  },
};
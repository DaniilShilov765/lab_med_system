#!/usr/bin/env python
# coding: utf-8
import pandas as pd
import numpy as np
#import psycopg2  # Не используется, но оставлен, если понадобится
from flask import Flask, request
from flask_restful import Api, Resource, reqparse
import random
from flask_cors import CORS  # Import CORS

application = Flask(__name__)
origins = "*" #  URL фронтенда
CORS(application, origins=origins)  # Enable CORS for all routes
api = Api(application)


users = {}  # email: {lastName, firstName, patronymic, password}
question_bank = [
    {"id": 1, "text": "У вас часто болит голова?"},
    {"id": 2, "text": "Вы чувствуете усталость?"},
    {"id": 3, "text": "У вас повышена температура?"},
]
user_answers = {} # email: {question_id: answer}

diseases = [
    {"name": "Все в порядке", "probability": random.randint(0, 100)},
    {"name": "Аллергия", "probability": random.randint(0, 100)},
    {"name": "Грипп", "probability": random.randint(0, 100)},
    {"name": "ОРВИ", "probability": random.randint(0, 100)},
]

class RegisterPatient(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help='Email is required')
        parser.add_argument('lastName', type=str, required=True, help='Last name is required')
        parser.add_argument('firstName', type=str, required=True, help='First name is required')
        parser.add_argument('patronymic', type=str, required=True, help='Patronymic is required')
        parser.add_argument('password', type=str, required=True, help='Password is required')
        args = parser.parse_args()

        email = args['email']
        lastName = args['lastName']
        firstName = args['firstName']
        patronymic = args['patronymic']
        password = args['password']

        if email in users:
            return {'message': 'Пользователь с таким email уже существует', 'email': email}, 409  # Conflict
        else:
            users[email] = {
                'lastName': lastName,
                'firstName': firstName,
                'patronymic': patronymic,
                'password': password
            }
            return {'message': 'Пациент успешно зарегистрирован', 'email': email}, 201  # Created


class LoginPatient(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help='Email is required')
        parser.add_argument('password', type=str, required=True, help='Password is required')
        args = parser.parse_args()

        email = args['email']
        password = args['password']

        if email in users and users[email]['password'] == password:
            return {'message': 'Вход прошёл успешно', 'email': email}, 200  # OK
        else:
            return {'message': 'Некорректные данные'}, 401  # Unauthorized


class GetNextQuestion(Resource):
    def get(self):
        email = request.args.get('email')

        if not email:
            return {'message': 'Email обязателен'}, 400

        #  Проверяем, какие вопросы уже заданы пользователю
        answered_questions = user_answers.get(email, {}).keys()
        #  Выбираем вопросы, на которые еще не отвечали
        available_questions = [q for q in question_bank if q['id'] not in answered_questions]

        if not available_questions:
            return {'message': 'Вопросов больше нет'}, 204  # No Content

        next_question = random.choice(available_questions)
        return next_question, 200


class SubmitAnswer(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help='Email is required')
        parser.add_argument('questionId', type=int, required=True, help='Question ID is required')
        parser.add_argument('answer', type=str, required=True, help='Answer is required')
        args = parser.parse_args()

        email = args['email']
        question_id = args['questionId']
        answer = args['answer']

        if email not in users:
            return {'message': 'Пользователь не найден'}, 404  # Not Found

        # Сохраняем ответ пользователя
        if email not in user_answers:
            user_answers[email] = {}
        user_answers[email][question_id] = answer

        #  Здесь должна быть логика анализа ответов и выдачи диагноза.  Пока просто возвращаем заглушку
        diagnosis = get_diagnosis(email)  #  Функция, которую нужно реализовать
        return {'message': 'Ответ принят', 'diagnosis': diagnosis}, 200

class ResetResult(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help='Email is required')
        args = parser.parse_args()

        email = args['email']

        if email not in users:
            return {'message': 'Пользователь не найден'}, 404  # Not Found

        user_answers[email] = {} # Очищаем заданные вопросы

        return {'message': 'История вопросов очищена'}, 200

def get_diagnosis(email):
    """
    Эта функция должна анализировать ответы пользователя
    и возвращать результаты диагностики.
    Пока что возвращает случайный диагноз.
    """

    return diseases


api.add_resource(RegisterPatient, '/RegisterPatient')
api.add_resource(LoginPatient, '/LoginPatient')
api.add_resource(GetNextQuestion, '/GetNextQuestion')
api.add_resource(SubmitAnswer, '/SubmitAnswer')
api.add_resource(ResetResult, '/ResetResult')


if __name__ == '__main__':
    application.run(host='0.0.0.0', debug=True, port=8000)
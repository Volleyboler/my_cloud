## Облачное хранилище данных Dunkan Mycloud

1. Скачайте проект
2. Создайте файл frontend/.env со следующим содержимым

    # Данные БД приложения
    DB_NAME=
    DB_USER=
    DB_PASSWORD=
    DB_HOST=
    DB_PORT=
    DB_ENGINE=

    # Секретный ключ Django
    SECRET_KEY=

    # Настройка 
    DEBUG='False'
    
    # URL развертывания фронтенда
    FRONTEND_URL=
    
    # URL развертывания бэкенда
    REACT_APP_API_URL=
   
3. В папке проекта создайте виртуальное окружение
   
    ```python -m venv env```
   
4. Установите зависимости
   
    ```pip install -r requirements.txt```
   
5. Выполните миграции
    
    ```python manage.py migrate```
   
6. Создайте суперпользователя
    
    ```python manage.py createsuperuser```
    
7. Запустите сервер
    
    ```python manage.py runserver```
    
8. Откройте отдельный теминал и перейдите в папку frontend
    
9.  Установите зависимости
    
    ```npm i```
    
10. Запустите скрипт для сборки
    
    ```npm run dev```
from flask import Flask, render_template, url_for, request, session, redirect
from pymongo import MongoClient
import bcrypt

app = Flask(__name__)

client = MongoClient("mongodb+srv://pavel4en:fjzQDT4g7vOTRhLD@gugo.dzfexwi.mongodb.net/?retryWrites=true&w=majority")
db = client['ToDo_db']
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# Функция index() обрабатывает GET запрос на главную страницу, если есть
@app.route('/')
def index():
    # Проверяет, есть ли в текущей сессии сохраненный параметр "username"
    if 'username' in session:
        # Если есть, передает его и "balance" в качестве аргументов в шаблон index.html
        return render_template('index.html', username=session['username'], balance=session['balance'])
    return render_template('index.html')


# Функция login() использует объект "db" для получения доступа к базе данных, где хранятся
# зарегистрированные пользователи.
@app.route('/login', methods=['POST'])
def login():
    users = db.users
    login_user = users.find_one({'name': request.form['username']})

    if login_user:
        # Для сравнения паролей используется метод hashpw() из библиотеки bcrypt.
        # Если пароли совпадают, то пользователь считается аутентифицированным
        # и сохраняются его имя и баланс в сессию.
        if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password']) == login_user['password']:
            session['username'] = request.form['username']
            session['balance'] = login_user['balance']
            return redirect(url_for('index'))

        return 'Неправильно введен логин или пароль'


# Извлекает список всех зарегистрированных пользователей из коллекции "users" в базе
# данных, затем проверяет, есть ли уже пользователь с таким же именем
@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        users = db.users
        existing_user = users.find_one({'name': request.form['username']})

        # Если такого пользователя еще нет, то функция генерирует хэш от введенного пароля,
        # используя библиотеку bcrypt, и сохраняет нового пользователя в базе данных.
        if existing_user is None:
            hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())
            users.insert_one(
                {'name': request.form['username'], 'password': hashpass, 'balance': int(request.form['balance'])})
            # Затем, функция сохраняет имя и баланс нового пользователя в сессию, используя объект session
            session['username'] = request.form['username']
            session['balance'] = int(request.form['balance'])
            return redirect(url_for('index'))

        return 'Такое имя пользователя уже существует'

    return render_template('register.html')


if __name__ == '__main__':
    app.run(debug=True)
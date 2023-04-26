from flask import make_response, Flask, render_template, url_for, request, session, redirect
from flask_cors import CORS
from game_classes import *
from todo_classes import *
from bd import *

import traceback
import bcrypt

app = Flask(__name__)

# Хедеры для ориджина
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


# Обертка для обработки ошибок route функций
def exc_handler(route_func):
    def exc_handled_route_func(*args, **kargs):
        try:
            return route_func(*args, **kargs)
        except GameException as ge:
            log_msg = "--- Traceback of game error ---\n" + \
                      ''.join(traceback.format_tb(ge.__traceback__)) + \
                      "--- Game error ---\n" + \
                      str(ge)
            app.logger.error(log_msg)
            return GameResponse("fail", str(ge), {}).to_dict(), 500
        except Exception as e:
            log_msg = "--- Traceback of NOT GAME error ---\n" + \
                      ''.join(traceback.format_tb(e.__traceback__)) + \
                      "---  NOT GAME error ---\n" + \
                      str(e)
            app.logger.error(log_msg)
            return GameResponse("fail", "internal error", {}).to_dict(), 500

    exc_handled_route_func.__name__ = route_func.__name__
    return exc_handled_route_func


# Проверка на то, вошел ли пользователь. Если да, то вернем игрока, соответствующего ему,
# если нет - то словарь с ошибкой
def auth_checker() -> dict | Player:
    if "username" in session and "hashedPassword" in session:
        username = session["username"]
        hashed_password = session["hashedPassword"]
        login_user = users.find_one({'username': username})
        if login_user:
            if hashed_password == login_user["hashedPassword"]:
                return Player(login_user["playerId"])
        return GameResponse("fail", "Wrong credentials", {}).to_dict()
    return GameResponse("fail", "Have not required auth cookies", {}).to_dict()


# Создать нового пользователя и создать ему пета с именем pet_name
#
# INPUT:
# {
#     "petName": "danuil"
# }
#
# OUTPUT:
# {
#   "data": {
#     "_id": "6443be64eadf49c6182b9f9f",
#     "gems": 0,
#     "inventory": [],
#     "pet": {
#       "hunger": 99.9879524564743,
#       "hungerPerSec": 0.01,
#       "lastUpdateUnixtime": 1682161253.7386696,
#       "name": "danuil",
#       "wornThingsIds": []
#     }
#   },
#   "description": "",
#   "status": "ok"
# }
@app.route("/gameapi/create_player", methods=['POST'])
@exc_handler
def create_player():
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    pet_name = str(request_data['petName'])

    player = Player.create_user(pet_name)
    player.save()
    return GameResponse("ok", "", player.to_dict()).to_dict()


# Получить данные об игроке
#
# INPUT:
# -
#
# OUTPUT:
# {
#   "data": {
#       "hunger": 99.9879524564743,
#       "hungerPerSec": 0.01,
#       "lastUpdateUnixtime": 1682161253.7386696,
#       "name": "danuil",
#       "wornThingsIds": []
#   },
#   "description": "",
#   "status": "ok"
# }
@app.route("/gameapi/get_player_data", methods=['POST'])
@exc_handler
def get_player_data():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    pet = login_player.pet
    pet.update_pet_state()
    login_player.save()
    return GameResponse("ok", "", login_player.to_dict()).to_dict()


# Получить данные о питомце
#
# INPUT:
# {
#     "playerId": "6443be64eadf49c6182b9f9f"
# }
#
# OUTPUT:
# {
#   "data": {
#     "_id": "6443be64eadf49c6182b9f9f",
#     "gems": 0,
#     "inventory": [],
#     "pet": {
#       "hunger": 99.9879524564743,
#       "hungerPerSec": 0.01,
#       "lastUpdateUnixtime": 1682161253.7386696,
#       "name": "danuil",
#       "wornThingsIds": []
#     }
#   },
#   "description": "",
#   "status": "ok"
# }
@app.route("/gameapi/get_pet_data", methods=['POST'])
@exc_handler
def get_pet_data():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    pet = login_player.pet
    pet.update_pet_state()
    login_player.save()
    return GameResponse("ok", "", pet.to_dict()).to_dict()


# Получить список всей существующей еды в игре
#
# INPUT:
# -
#
# OUTPUT:
# {
#     "data": [
#          {
#               "_id": "64434100dfe82f69e76fe87e",
#               "name": "bulochka s koricey",
#               "price": 100,
#               "satiety": "60"
#          },
#
#          ...
#
#          {
#               "_id": "64434153dfe82f69e76fe87f",
#               "name": "komplexniy obed v stolovoy b korpusa",
#               "price": 700,
#               "satiety": "300"
#          }
#     ],
#     "status": "ok",
#     "desc": ""
# }
@app.route("/gameapi/get_all_game_food", methods=['POST'])
@exc_handler
def get_all_game_food():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    gf = GameFood()
    return GameResponse("ok", "", gf.get_all_food_as_dicts()).to_dict()


# Получить список всех существующих вещей в игре
#
# INPUT:
# -
#
# OUTPUT:
# {
#     "data": [
#         {
#             "_id": "644382cedfe82f69e76fe880",
#             "name": "boots",
#             "price": 200
#         },
#         {
#             "_id": "644382cedfe82f69e76fe882",
#             "name": "shtani",
#             "price": 700
#         }
#     ],
#     "status": "ok",
#     "desc": ""
# }
@app.route("/gameapi/get_all_game_items", methods=['POST'])
@exc_handler
def get_all_game_items():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    gi = GameItems()
    return GameResponse("ok", "", gi.get_all_items_as_dicts()).to_dict()


# Покормить питомца
#
# INPUT:
# {
#     "foodId": "6443be64eadf49c6182b9f9a"
# }
#
# OUTPUT:
# {
#     "data": {}
#     "status": "ok"
#     "desc": ""
# }
@app.route("/gameapi/feed_pet", methods=['POST'])
@exc_handler
def feed_pet():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    request_data = request.get_json()
    food_id = str(request_data['foodId'])

    pet = login_player.pet
    gf = GameFood()
    food = gf.get_food(food_id)
    if login_player.gems >= food.price:
        login_player.gems -= food.price
        pet.feed(food)
        login_player.save()
        return GameResponse("ok", "", {}).to_dict()
    return GameResponse("fail", "There is no enough money to buy food with id " + food_id, {}).to_dict()


# Купить вещь, если достаточно денег
#
# INPUT:
# {
#     "itemId": "6443be64eadf49c6182b9f9a"
# }
#
# OUTPUT:
# {
#     "data": {}
#     "status": "ok"
#     "desc": ""
# }
@app.route("/gameapi/buy_item", methods=['POST'])
@exc_handler
def buy_item():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    # Получаем словарь из json строки из запроса
    request_data = request.get_json()
    item_id = str(request_data['itemId'])

    gi = GameItems()
    player_inventory = login_player.inventory
    item = gi.get_item(item_id)
    if login_player.gems >= item.price:
        player_inventory.add(item)
        login_player.gems -= item.price
        login_player.save()
        return GameResponse("ok", "", {}).to_dict()
    return GameResponse("fail", "Not enough gems for buying item", {}).to_dict()


# Надеть вещь на питомца
#
# INPUT:
# {
#     "itemId": "6443be64eadf49c6182b9f9a"
# }
#
# OUTPUT:
# {
#     "data": {}
#     "status": "ok"
#     "desc": ""
# }
@app.route("/gameapi/wear_item", methods=['POST'])
@exc_handler
def wear_item():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    # Получаем словарь из json строки из запроса
    request_data = request.get_json()
    item_id = str(request_data['itemId'])

    player_inventory = login_player.inventory
    pet = login_player.pet
    if player_inventory.has_item(item_id):
        player_inventory.remove(item_id)
        pet.wear_item(item_id)
        login_player.save()
        return GameResponse("ok", "", {}).to_dict()
    return GameResponse("fail", "No such item in player inventory", {}).to_dict()


# Снять вещь с питомца
#
# INPUT:
# {
#     "itemId": "6443be64eadf49c6182b9f9a"
# }
#
# OUTPUT:
# {
#     "data": {},
#     "status": "ok",
#     "desc": ""
# }
@app.route("/gameapi/take_off_item", methods=['POST'])
@exc_handler
def take_off_item():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    # Получаем словарь из json строки из запроса
    request_data = request.get_json()
    item_id = str(request_data['itemId'])

    pet = login_player.pet
    if pet.worn_things.has_item(item_id):
        pet.worn_things.remove(item_id)
        login_player.inventory.add_by_id(item_id)
        login_player.save()
        return GameResponse("ok", "", {}).to_dict()
    return GameResponse("fail", "No such item on players pet worn", {}).to_dict()


# Начислить gemCount гемов игроку
#
# INPUT:
# {
#     "gemCount": 100
# }
#
# OUTPUT:
# {
#     "data": {},
#     "status": "ok",
#     "desc": ""
# }
@app.route("/gameapi/give_gem", methods=['POST'])
@exc_handler
def give_gems():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    gem_count = int(request_data['gemCount'])

    login_player.gems += int(gem_count)
    login_player.save()
    return GameResponse("ok", "", {}).to_dict()


@app.route('/')
def index():
    # Получаем все задачи из коллекции и передаем их в шаблон
    return render_template('index.html', tasks=tasks.find())


# Создать задание
#
# INPUT:
# {
#     "name": "name",
#     "description": "desc"
# }
#
# OUTPUT:
# Статусный код
@app.route('/add_task', methods=['POST'])
def add_task():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    task_name = str(request_data['name'])
    task_description = str(request_data['description'])

    task = Task.create_new_task(task_name, task_description)
    tasks.insert_one(task.to_dict())

    return make_response("", 200)


# Изменить задание по _id
#
# INPUT:
# {
#     "_id": "6443be64eadf49c6182b9f9f",
#     "name": "name",
#     "description": "desc"
# }
#
# OUTPUT:
# Статусный код
@app.route('/edit_task', methods=['POST'])
def edit_task():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    task_id = str(request_data['_id'])
    task_name = str(request_data['name'])
    task_description = str(request_data['description'])

    task = Task.create_new_task(task_name, task_description)
    tasks.update_one({'_id': ObjectId(task_id)}, {'$set': task.to_dict()})

    return make_response("", 200)


# Удалить задание по _id
#
# INPUT:
# {
#     "_id": "6443be64eadf49c6182b9f9f"
# }
#
# OUTPUT:
# Статусный код
@app.route('/delete_task', methods=['POST'])
def delete_task():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    # Получаем словарь из json строки из запроса
    request_data = request.get_json()
    task_id = str(request_data["_id"])

    # Удаляем задачу из коллекции
    tasks.delete_one({'_id': ObjectId(task_id)})
    return make_response("", 200)


# Отметить задание _id выполненным
#
# INPUT:
# {
#     "_id": "6443be64eadf49c6182b9f9f"
# }
#
# OUTPUT:
# Статусный код
@app.route('/complete_task', methods=['POST'])
def complete_task():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    # Получаем словарь из json строки из запроса
    request_data = request.get_json()
    task_id = str(request_data["_id"])

    # Получаем задачу по ее id
    # TODO: fix error
    task = tasks.find_one({'_id': ObjectId(task_id)})
    # Обновляем статус задачи
    tasks.update_one({'_id': ObjectId(task_id)}, {'$set': {'complete': True}})
    # Перемещаем задачу в коллекцию выполненных задач
    archive_tasks.insert_one(task)
    # Удаляем задачу из коллекции задач
    tasks.delete_one({'_id': ObjectId(task_id)})
    return make_response("", 200)


# Вернуть ВСЕ выполненные задания
#
# INPUT:
# -
#
# OUTPUT:
# [
#     {
#         "_id": "643ff04367a2c94c902852e5",
#         "coins": 500,
#         "complete": false,
#         "description": "",
#         "difficulty": 4,
#         "name": "Купить хлеб в другом городе"
#     }
# ]
@app.route('/completed_tasks', methods=['POST'])
def get_complete_tasks():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    complete_tasks_list = []
    for complete_task in archive_tasks.find():
        complete_task["_id"] = str(complete_task["_id"])
        complete_tasks_list.append(complete_task)
    return complete_tasks_list


# Вернуть ВСЕ невыполненные задания
#
# INPUT:
# -
#
# OUTPUT:
# [
#     {
#         "_id": "6441f63d1b2033ac84d4ae52",
#         "coins": 50,
#         "complete": false,
#         "description": "",
#         "difficulty": 1,
#         "name": "сходить в туалет"
#     },
#     {
#         "_id": "6441f6a61b2033ac84d4ae53",
#         "coins": 500,
#         "complete": false,
#         "description": "",
#         "difficulty": 4,
#         "name": "проехать на машине 1000 км"
#     },
# ]
@app.route('/incompleted_tasks', methods=['POST'])
def get_incomplete_tasks():
    login_player = auth_checker()
    if login_player is dict:
        return login_player

    incomplete_tasks_list = []
    for incomplete_task in tasks.find():
        incomplete_task["_id"] = str(incomplete_task["_id"])
        incomplete_tasks_list.append(incomplete_task)
    return incomplete_tasks_list


# Функция login() использует объект "db" для получения доступа к базе данных, где хранятся
# зарегистрированные пользователи.
# INPUT:
# {
#     "username": "name",
#     "password": "password",
# }
#
# OUTPUT:
# Статусный код
@app.route('/login', methods=['POST'])
def login():
    login_data = request.get_json()
    login_user = users.find_one({'username': login_data['username']})

    if login_user:
        # Для сравнения паролей используется метод hashpw() из библиотеки bcrypt.
        # Если пароли совпадают, то пользователь считается аутентифицированным
        # и сохраняются его имя и баланс в сессию.
        hashpas = bcrypt.hashpw(login_data['password'].encode('utf-8'), login_user['hashedPassword'])
        if hashpas == login_user['hashedPassword']:
            session['username'] = login_data['username']
            session["hashedPassword"] = hashpas
            return GameResponse("ok", "", {}).to_dict()
        return GameResponse("fail", "Wrong credentials", {}).to_dict()
    return GameResponse("fail", "User with that username didnt find", {}).to_dict()


# Извлекает список всех зарегистрированных пользователей из коллекции "users" в базе
# данных, затем проверяет, есть ли уже пользователь с таким же именем
# INPUT:
# {
#     "username": "name",
#     "petname": "petName",
#     "password": "password",
# }
#
# OUTPUT:
# Статусный код
@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        register_data = request.get_json();
        existing_user = users.find_one({'username': register_data['username']})

        # Если такого пользователя еще нет, то функция генерирует хэш от введенного пароля,
        # используя библиотеку bcrypt, и сохраняет нового пользователя в базе данных.
        if existing_user is None:
            hashpass = bcrypt.hashpw(register_data['password'].encode('utf-8'), bcrypt.gensalt())
            player = Player.create_user(register_data["petname"])
            player.save()
            users.insert_one({
                'username': register_data['username'],
                'hashedPassword': hashpass,
                'playerId': player.player_id
            })

            # Затем, функция сохраняет имя и баланс нового пользователя в сессию, используя объект session
            session['username'] = register_data['username']
            session['hashedPassword'] = register_data['password']
            return GameResponse("ok", "", {}).to_dict()
        return GameResponse("fail", "User already exists", {}).to_dict()
    return render_template('register.html')


if __name__ == '__main__':
    app.run(debug=True)
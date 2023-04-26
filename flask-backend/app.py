from flask import Flask, render_template, request, make_response
from flask_cors import CORS
from game_classes import *
from todo_classes import *
from bd import *
import traceback

app = Flask(__name__)

# Хедеры для ориджина
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


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
# {
#     "playerId": "6443be64eadf49c6182b9f9f"
# }
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
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    player_id = str(request_data['playerId'])

    player = Player(player_id)
    pet = player.pet
    pet.update_pet_state()
    player.save()
    return GameResponse("ok", "", player.to_dict()).to_dict()


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
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    player_id = str(request_data['playerId'])

    player = Player(player_id)
    pet = player.pet
    pet.update_pet_state()
    player.save()
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
    gi = GameItems()
    return GameResponse("ok", "", gi.get_all_items_as_dicts()).to_dict()


# Покормить питомца
#
# INPUT:
# {
#     "playerId": "6443be64eadf49c6182b9f9f",
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
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    player_id = str(request_data['playerId'])
    food_id = str(request_data['foodId'])

    player = Player(player_id)
    pet = player.pet
    gf = GameFood()
    food = gf.get_food(food_id)
    if player.gems >= food.price:
        player.gems -= food.price
        pet.feed(food)
        player.save()
        return GameResponse("ok", "", {}).to_dict()
    return GameResponse("fail", "There is no enough money to buy food with id " + food_id, {}).to_dict()


# Купить вещь, если достаточно денег
#
# INPUT:
# {
#     "playerId": "6443be64eadf49c6182b9f9f",
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
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    player_id = str(request_data['playerId'])
    item_id = str(request_data['itemId'])

    player = Player(player_id)
    gi = GameItems()
    player_inventory = player.inventory
    item = gi.get_item(item_id)
    if player.gems >= item.price:
        player_inventory.add(item)
        player.gems -= item.price
        player.save()
        return GameResponse("ok", "", {}).to_dict()
    return GameResponse("fail", "Not enough gems for buying item", {}).to_dict()


# Надеть вещь на питомца
#
# INPUT:
# {
#     "playerId": "6443be64eadf49c6182b9f9f",
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
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    player_id = str(request_data['playerId'])
    item_id = str(request_data['itemId'])

    player = Player(player_id)
    player_inventory = player.inventory
    pet = player.pet
    if player_inventory.has_item(item_id):
        player_inventory.remove(item_id)
        pet.wear_item(item_id)
        player.save()
        return GameResponse("ok", "", {}).to_dict()
    return GameResponse("fail", "No such item in player inventory", {}).to_dict()


# Снять вещь с питомца
#
# INPUT:
# {
#     "playerId": "6443be64eadf49c6182b9f9f",
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
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    player_id = str(request_data['playerId'])
    item_id = str(request_data['itemId'])

    player = Player(player_id)
    pet = player.pet
    if pet.worn_things.has_item(item_id):
        pet.worn_things.remove(item_id)
        player.inventory.add_by_id(item_id)
        player.save()
        return GameResponse("ok", "", {}).to_dict()
    return GameResponse("fail", "No such item on players pet worn", {}).to_dict()


# Начислить gemCount гемов игроку
#
# INPUT:
# {
#     "playerId": "6443be64eadf49c6182b9f9f",
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
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    player_id = str(request_data['playerId'])
    gem_count = int(request_data['gemCount'])

    player = Player(player_id)
    player.gems += int(gem_count)
    player.save()
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
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()
    task_id = str(request_data["_id"])

    # Получаем задачу по ее id
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
    incomplete_tasks_list = []
    for incomplete_task in tasks.find():
        incomplete_task["_id"] = str(incomplete_task["_id"])
        incomplete_tasks_list.append(incomplete_task)
    return incomplete_tasks_list


if __name__ == '__main__':
    app.run(debug=True)
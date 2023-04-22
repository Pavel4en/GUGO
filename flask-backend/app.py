from flask import Flask, render_template, request, redirect, url_for, make_response
from pymongo import MongoClient
from bson.objectid import ObjectId
import openai
from time import time
import json
import traceback

# Подключаем api нейросетки davinci
openai.api_key = "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"

app = Flask(__name__)
client = MongoClient("mongodb+srv://pavel4en:fjzQDT4g7vOTRhLD@gugo.dzfexwi.mongodb.net/?retryWrites=true&w=majority")
db = client['ToDo_db']

# Создаем коллекцию задач
tasks = db.tasks
# Создаем коллекцию выполненных задач
archive_tasks = db.archive_tasks
# Создаем коллекцию, хранящую описание вещи, её цены, id и т.д.
items_collection = db.items
# Создаем коллекцию, хранящую описание еды, её цены, id и т.д.
food_collection = db.food
# Создаем коллекцию питомцев
players_collection = db.players


# Класс игровых исключений
class GameException(Exception):
    def __init__(self, message):
        super().__init__(message)


# Класс исключений, связанных с логикой To Do листа
class TodoException(Exception):
    def __init__(self, message):
        super().__init__(message)


# Класс, содержащий ответ, связанный с логикой игры
class GameResponse:
    # Создать ответ
    def __init__(self, status: str, desc: str, data: dict | list):
        self.status = status
        self.desc = desc
        self.data = data

    # Преобразовать ответ в словарь
    def to_dict(self):
        return {
            "status": self.status,
            "description": self.desc,
            "data": self.data
        }


# Класс еды
class Food:
    # Создать еду по словарю, содержащем информацию о еде
    def __init__(self, food_dict: dict):
        try:
            self.food_id = str(food_dict["_id"])
            self.price = float(food_dict["price"])
            self.satiety = float(food_dict["satiety"])
            self.name = str(food_dict["name"])
        except KeyError:
            raise GameException("Invalid dictionary for initializing food object")

    # Создать еду по её id (обращение к бд)
    @classmethod
    def find_in_db(cls, food_id: str):
        food_dict = food_collection.find_one({"_id": ObjectId(food_id)})
        if food_dict is not None:
            return cls(food_dict)
        raise GameException("Did not found item with that id: " + food_id)


# Класс вещи
class Item:
    # Создать вещь по словарю, содержащем информацию о вещи
    def __init__(self, item_dict: dict):
        try:
            self.item_id = str(item_dict["_id"])
            self.price = float(item_dict["price"])
            self.name = str(item_dict["name"])
        except KeyError:
            raise GameException("Invalid for initializing item object")

    # Создать вещь по её id (обращение к бд)
    @classmethod
    def find_in_db(cls, item_id: str):
        item_dict = items_collection.find_one({"_id": ObjectId(item_id)})
        if item_dict is not None:
            return cls(item_dict)
        raise GameException("There is no such item in db with id " + item_id)

    # Преобразовать вещь в словарь
    def to_dict(self):
        return {
            "_id": self.item_id,
            "price": self.price,
            "name": self.name
        }


# Класс питомца
class Pet:
    def __init__(self, pet_dict: dict):
        try:
            self.name = str(pet_dict["name"])
            self.hunger = float(pet_dict["hunger"])
            self.worn_things = Inventory(pet_dict["worn_things_ids"])
            self.last_update_unixtime = float(pet_dict["last_update_unixtime"])
            self.hunger_per_sec = float(pet_dict["hunger_per_sec"])
            self.update_pet_state()
        except KeyError:
            raise GameException("Invalid dictionary for initializing pet")

    # Функция для создания нового питомца
    @classmethod
    def create_new(cls, name: str):
        default_hunger = 100
        default_hunger_per_sec = 0.01
        pet_dict = {
            "name": name,
            "hunger": default_hunger,
            "worn_things_ids": [],
            "last_update_unixtime": time(),
            "hunger_per_sec": default_hunger_per_sec
        }
        return Pet(pet_dict)

    # Надеть на питомца вещь
    def wear_item(self, item_id: str):
        self.worn_things.add_by_id(item_id)

    # Снять с питомца вещь
    def take_off_item(self, item_id: str):
        self.worn_things.remove(item_id)

    # Покормить питомца едой
    def feed(self, food_obj: Food):
        self.hunger += food_obj.satiety

    # Обновить состояние питомца
    def update_pet_state(self):
        time_diff = time() - self.last_update_unixtime
        self.hunger -= time_diff * self.hunger_per_sec
        self.last_update_unixtime = time()

    # Преобразовать питомца в словарь
    def to_dict(self):
        return {
            "name": self.name,
            "hunger": self.hunger,
            "worn_things_ids": self.worn_things.to_list_only_ids(),
            "last_update_unixtime": self.last_update_unixtime,
            "hunger_per_sec": self.hunger_per_sec
        }


# Класс, предоставляющий доступ ко всей еде в игре
class GameFood:
    def __init__(self):
        food_dict_from_db = food_collection.find()
        self.food_dict = {}
        for food in food_dict_from_db:
            food["_id"] = str(food["_id"])
            self.food_dict[food["_id"]] = food

    # Получить еду по её id. Если такой еды нет, кидаем исключение
    def get_food(self, food_id: str) -> Food:
        if food_id in self.food_dict:
            return Food.find_in_db(food_id)
        raise GameException("There is no food with id " + food_id)

    # Получить всю еду в игре
    def get_all_food(self) -> list:
        return [Food(food) for food in self.food_dict.values()]

    # Получить всю еду в игре в виде списка словарей
    def get_all_food_as_dicts(self) -> list:
        return [food.copy() for food in self.food_dict.values()]


# Класс, предоставляющий доступ ко всем вещам в игре
class GameItems:
    def __init__(self):
        items_dict_from_db = items_collection.find()
        self.items_dict = {}
        for item in items_dict_from_db:
            item["_id"] = str(item["_id"])
            self.items_dict[str(item["_id"])] = item

    # Получить вещь по ей id. Если такой вещи нет, возвращает None
    def get_item(self, item_id: str):
        if item_id in self.items_dict:
            return Item(self.items_dict[item_id])
        raise GameException("There is no item with id " + item_id)

    # Получить все вещи в игре
    def get_all_items(self):
        return [Item(item_dict) for item_dict in self.items_dict.values()]

    # Получить все вещи в игре в виде списка словарей
    def get_all_items_as_dicts(self) -> list:
        return [item.copy() for item in self.items_dict.values()]


# Класс инвентаря, предоставляющий доступ к предметам по их id.
# Изначально, в объекте этого класса хранятся только id предметов, но когда идет
# обращение к информации о вещи, экземпляр обращается к бд и вытягивает эту информацию
# для всех id-шников вещей, хранящихся в инвентаре
class Inventory:
    # Создает инвентарь по id вещей(все id войдут в инвентарь)
    def __init__(self, items_ids_list: list):
        # Словарь, содержащий только id вещей
        self.items_ids_list = items_ids_list.copy()
        # Словарь, который содержит сами вещи (экземпляры Item)
        self.inventory = {}
        # True, если уже были получены вещи по их id из бд, иначе False
        self.is_inventory_init = False

    # Создает пустой инвентарь
    @classmethod
    def create_empty(cls):
        return cls([])

    # Добавляет вещь в инвентарь
    def add(self, item: Item):
        if item.item_id not in self.items_ids_list:
            self.items_ids_list.append(item.item_id)
            self.inventory[item.item_id] = item

    # Добавляет вещь в инвентарь по её id
    def add_by_id(self, item_id: str):
        if item_id not in self.items_ids_list:
            self.items_ids_list.append(item_id)

    # Проверяет, есть ли вещь с таким id в инвентаре
    def has_item(self, item_id: str):
        return item_id in self.items_ids_list

    # Получает вещь по её id и возвращает объект Item, если вещь есть в инвентаре
    # и кидает исключение, если её там нет
    def get(self, item_id: str):
        if item_id in self.items_ids_list:
            if not self.is_inventory_init:
                self.init_inventory()
            return Item(self.inventory[item_id])
        raise GameException("There is no item with id " + item_id + " in inventory")

    # Возвращает лист всех вещей (экземпляры класса Item), содержащихся в инвентаре
    def get_all(self):
        if not self.is_inventory_init:
            self.init_inventory()
        return [item for item in self.inventory.values()]

    # Удаляет вещь из инвентаря по её id
    def remove(self, item_id: str):
        if item_id in self.items_ids_list:
            if self.is_inventory_init:
                self.inventory.pop(item_id)
            self.items_ids_list.remove(item_id)
        else:
            raise GameException("There is no item with id " + item_id + " in inventory")

    # Получаем информацию о вещах из бд и запихиваем её в виде объектов Item
    def init_inventory(self):
        items_dict_from_db = items_collection.find({
            "_id": {
                "$in": [ObjectId(item_id) for item_id in self.items_ids_list]
            }
        })
        for item in items_dict_from_db:
            item["_id"] = str(item["_id"])
            self.inventory[item["_id"]] = Item(item)
        self.is_inventory_init = True

    # Формируем лист, содержащий только id вещей из инвентаря
    def to_list_only_ids(self):
        return self.items_ids_list.copy()

    # Формируем лист, содержащий словари с данными вещей
    def to_list(self):
        if not self.is_inventory_init:
            self.init_inventory()
        return [item.to_dict() for item in self.inventory.values()]


# Класс игрока, содержит в себе методы для доступа к инвентарю, питомцу и тд
class Player:
    # Получение игрока по его id
    def __init__(self, player_id: str):
        player_dict = players_collection.find_one({"_id": ObjectId(player_id)})
        if player_dict is not None:
            self.player_id = str(player_dict["_id"])
            self.gems = int(player_dict["gems"])
            self.pet = Pet(player_dict["pet"])
            self.inventory = Inventory(items_ids_list=player_dict["inventory"])
        else:
            raise GameException("There is no user with id " + player_id)

    # Создание нового игрока
    @classmethod
    def create_user(cls, pet_name):
        new_user_dict = {
            "gems": 0,
            "pet": Pet.create_new(pet_name).to_dict(),
            "inventory": Inventory.create_empty().to_list()
        }
        new_user_id = str(players_collection.insert_one(new_user_dict).inserted_id)
        return Player(new_user_id)

    # Получить лист id вещей в инвентаре игрока
    def get_all_items_ids(self):
        return self.inventory.to_list_only_ids()

    # Получить лист информаций о вещах
    def get_all_items_dict(self):
        return self.inventory.get_all()

    # Получить информацию о вещи
    def get_item_dict(self, item_id):
        return self.inventory.get(item_id)

    # Получить игрока в виде словаря
    def to_dict(self):
        return {
            "_id": self.player_id,
            "gems": self.gems,
            "pet": self.pet.to_dict(),
            "inventory": self.inventory.to_list_only_ids()
        }

    # Сохранить игрока в бд
    def save(self):
        inserting_player_dict = json.loads(json.dumps(self.to_dict()))
        inserting_player_dict.pop("_id")
        players_collection.replace_one({"_id": ObjectId(self.player_id)}, inserting_player_dict)


# --- ROUTES ---


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
@app.route("/gameapi/create_player/<pet_name>")
@exc_handler
def create_player(pet_name):
    player = Player.create_user(pet_name)
    player.save()
    return GameResponse("ok", "", player.to_dict()).to_dict()


# Получить данные об игроке
@app.route("/gameapi/<player_id>/get_player_data")
@exc_handler
def get_player_data(player_id):
    player = Player(player_id)
    pet = player.pet
    pet.update_pet_state()
    player.save()
    return GameResponse("ok", "", player.to_dict()).to_dict()


# Получить данные о питомце
@app.route("/gameapi/<player_id>/get_pet_data")
@exc_handler
def get_pet_data(player_id):
    player = Player(player_id)
    pet = player.pet
    pet.update_pet_state()
    player.save()
    return GameResponse("ok", "", pet.to_dict()).to_dict()


# Получить список всей существующей еды в игре
@app.route("/gameapi/get_all_game_food")
@exc_handler
def get_all_game_food():
    gf = GameFood()
    return GameResponse("ok", "", gf.get_all_food_as_dicts()).to_dict()


# Получить список всех существующих вещей в игре
@app.route("/gameapi/get_all_game_items")
@exc_handler
def get_all_game_items():
    gi = GameItems()
    return GameResponse("ok", "", gi.get_all_items_as_dicts()).to_dict()


# Покормить питомца
@app.route("/gameapi/<player_id>/feed_pet/<food_id>")
@exc_handler
def feed_pet(player_id, food_id):
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
@app.route("/gameapi/<player_id>/buy_item/<item_id>")
@exc_handler
def buy_item(player_id, item_id):
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
@app.route("/gameapi/<player_id>/wear_item/<item_id>")
@exc_handler
def wear_item(player_id, item_id):
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
@app.route("/gameapi/<player_id>/take_off_item/<item_id>")
@exc_handler
def take_off_item(player_id, item_id):
    player = Player(player_id)
    pet = player.pet
    if pet.worn_things.has_item(item_id):
        pet.worn_things.remove(item_id)
        player.inventory.add_by_id(item_id)
        player.save()
        return GameResponse("ok", "", {}).to_dict()
    return GameResponse("fail", "No such item on players pet worn", {}).to_dict()


# Начислить gem_count гемов игроку
@app.route("/gameapi/<player_id>/give_gem/<gem_count>")
@exc_handler
def give_gems(player_id, gem_count):
    player = Player(player_id)
    player.gems += int(gem_count)
    player.save()
    return GameResponse("ok", "", {}).to_dict()


# Класс, инкапсулирующий логику работы с заданиями
class Task:
    # Создать задание по словарю, а также определить уровень сложности задания
    # и награду за него
    def __init__(self, task_dict: dict):
        self.task_name = str(task_dict["name"])
        self.task_description = str(task_dict["description"])
        self.difficulty = int(task_dict["difficultness"])
        self.coins = int(task_dict["coins"])
        self.completed = bool(task_dict["completed"])

    # Создать новое задание по его названию и описанию, а также определить уровень сложности задания
    # и награду за него
    @classmethod
    def create_new_task(cls, task_name: str, task_description: str):
        task_dict = {}
        task_dict["name"] = task_name
        task_dict["description"] = task_description
        task_dict["difficultness"] = Task.define_difficultness_of_task(task_name)
        # Что делать с задачами с неопределенной сложностью???
        task_dict["coins"] = Task.define_reward(task_dict["difficultness"])
        task_dict["completed"] = False
        return cls(task_dict)

    # Определить м помощью ИИ награду за задание. Оценка идет от 1 до 5.
    # Если сложность не удалось определить, возвращается 0
    @classmethod
    def define_difficultness_of_task(cls, task_name: str) -> int:
        # Получаем оценку сложности задачи с помощью нейросети
        model_engine = "text-davinci-003"
        prompt = f"What is the difficulty level of the task '{task_name}' on a scale of 1 to 5?"
        response = openai.Completion.create(
            engine=model_engine,
            prompt=prompt,
            max_tokens=60,
            n=1,
            stop=None,
            temperature=0.5,
        )

        # Обрабатываем ошибки
        if response.choices[0].text.strip() not in ['1', '2', '3', '4', '5']:
            return 0
        else:
            difficulty = int(response.choices[0].text.strip())
            return difficulty

    # Определить награду за сложность задачи и бросить исключение, если
    # сложность определить не удалось
    @classmethod
    def define_reward(cls, difficultness: int) -> int:
        difficultness_to_reward = {
            1: 50,
            2: 100,
            3: 300,
            4: 500,
            5: 1000
        }
        if difficultness not in difficultness_to_reward:
            raise TodoException(f"Can not define reward for difficultenss `{difficultness}`")
        return difficultness_to_reward[difficultness]

    def to_dict(self):
        return {
            "name": self.task_name,
            "description": self.task_description,
            "difficultness": self.difficulty,
            "coins": self.coins,
            "completed": self.completed
        }

@app.route('/')
def index():
    # Получаем все задачи из коллекции и передаем их в шаблон
    return render_template('index.html', tasks=tasks.find())


@app.route('/add_task', methods=['POST'])
def add_task():
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    task_name = request_data['task_name']
    task_description = request_data['task_description']

    task = Task.create_new_task(task_name, task_description)
    tasks.insert_one(task.to_dict())

    return make_response("", 200)


@app.route('/edit_task/<task_id>', methods=['POST'])
def edit_task(task_id):
    # Получаем словарь из json строки из запроса
    request_data = request.get_json()

    task_name = request_data['task_name']
    task_description = request_data['task_description']

    task = Task.create_new_task(task_name, task_description)
    tasks.update_one({'_id': ObjectId(task_id)}, {'$set': task.to_dict()})

    return make_response("", 200)


@app.route('/delete_task/<task_id>', methods=['POST'])
def delete_task(task_id):
    # Удаляем задачу из коллекции
    tasks.delete_one({'_id': ObjectId(task_id)})
    return make_response("", 200)


@app.route('/complete_task/<task_id>', methods=['POST'])
def complete_task(task_id):
    # Получаем задачу по ее id
    task = tasks.find_one({'_id': ObjectId(task_id)})
    # Обновляем статус задачи
    tasks.update_one({'_id': ObjectId(task_id)}, {'$set': {'completed': True}})
    # Перемещаем задачу в коллекцию выполненных задач
    archive_tasks.insert_one(task)
    # Удаляем задачу из коллекции задач
    tasks.delete_one({'_id': ObjectId(task_id)})
    return make_response("", 200)


@app.route('/completed_tasks')
def get_completed_tasks():
    completed_tasks_list = []
    for complete_task in archive_tasks.find():
        complete_task["_id"] = str(complete_task["_id"])
        completed_tasks_list.append(complete_task)
    return completed_tasks_list


@app.route('/uncompleted_tasks')
def get_uncompleted_tasks():
    uncompleted_tasks_list = []
    for incomplete_task in tasks.find():
        incomplete_task["_id"] = str(incomplete_task["_id"])
        uncompleted_tasks_list.append(incomplete_task)
    return uncompleted_tasks_list


if __name__ == '__main__':
    app.run(debug=True)

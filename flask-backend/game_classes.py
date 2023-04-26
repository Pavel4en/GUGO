from bd import *

from bson.objectid import ObjectId
from time import time

import json


# Класс игровых исключений
class GameException(Exception):
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
            self.worn_things = Inventory(pet_dict["wornThingsIds"])
            self.last_update_unixtime = float(pet_dict["lastUpdateUnixtime"])
            self.hunger_per_sec = float(pet_dict["hungerPerSec"])
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
            "wornThingsIds": [],
            "lastUpdateUnixtime": time(),
            "hungerPerSec": default_hunger_per_sec
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
            "wornThingsIds": self.worn_things.to_list_only_ids(),
            "lastUpdateUnixtime": self.last_update_unixtime,
            "hungerPerSec": self.hunger_per_sec
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

    # Получить вещь по её id. Если такой вещи нет, возвращает None
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

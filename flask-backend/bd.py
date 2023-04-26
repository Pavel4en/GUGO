from pymongo import MongoClient

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

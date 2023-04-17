from flask import Flask, render_template, request, redirect, url_for
from pymongo import MongoClient
from bson.objectid import ObjectId


app = Flask(__name__)
client = MongoClient("mongodb+srv://pavel4en:fjzQDT4g7vOTRhLD@gugo.dzfexwi.mongodb.net/?retryWrites=true&w=majority")
db = client['ToDo_db']

# Создаем коллекцию задач
tasks = db.tasks
# Создаем коллекцию выполненных задач
archive_tasks = db.archive_tasks


@app.route('/')
def index():
    # Получаем все задачи из коллекции и передаем их в шаблон
    return render_template('index.html', tasks=tasks.find())


@app.route('/add_task', methods=['POST'])
def add_task():
    # Получаем данные из формы
    task_name = request.form['task_name']
    task_description = request.form['task_description']
    # Добавляем задачу в коллекцию
    tasks.insert_one({'name': task_name, 'description': task_description, 'completed': False})
    return redirect(url_for('index'))


@app.route('/edit_task/<task_id>', methods=['GET', 'POST'])
def edit_task(task_id):
    # Получаем задачу по ее id
    task = tasks.find_one({'_id': ObjectId(task_id)})
    if request.method == 'POST':
        # Обновляем данные задачи
        tasks.update_one({'_id': ObjectId(task_id)}, {'$set': {'name': request.form['task_name'], 'description': request.form['task_description']}})
        return redirect(url_for('index'))
    return render_template('edit_task.html', task=task)


@app.route('/delete_task/<task_id>', methods=['POST'])
def delete_task(task_id):
    # Удаляем задачу из коллекции
    tasks.delete_one({'_id': ObjectId(task_id)})
    return redirect(url_for('index'))


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
    return redirect(url_for('index'))


@app.route('/completed_tasks')
def completed_tasks():
    # Получаем все выполненные задачи из коллекции и передаем их в шаблон
    return render_template('completed_tasks.html', archive_tasks=archive_tasks.find())



if __name__ == '__main__':
    app.run(debug=True)

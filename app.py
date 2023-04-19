from flask import Flask, render_template, request, redirect, url_for
from pymongo import MongoClient
from bson.objectid import ObjectId
import openai

# Подключаем api ключ
openai.api_key = "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"

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
        return "Не возможно определить уровень сложности задачи"
    else:
        difficulty = int(response.choices[0].text.strip())
        if difficulty == 1:
            coins = 50
        elif difficulty == 2:
            coins = 100
        elif difficulty == 3:
            coins = 300
        elif difficulty == 4:
            coins = 500
        else:
            coins = 1000

        # Добавляем задачу в коллекцию
        tasks.insert_one({'name': task_name, 'description': task_description, 'completed': False, 'difficulty': difficulty, 'coins': coins})
        return redirect(url_for('index'))


@app.route('/edit_task/<task_id>', methods=['GET', 'POST'])
def edit_task(task_id):
    # Получаем задачу по ее id
    task = tasks.find_one({'_id': ObjectId(task_id)})
    if request.method == 'POST':
        # Обновляем данные задачи
        task_name = request.form['task_name']
        task_description = request.form['task_description']

        # Оцениваем сложность задачи и вычисляем количество монет
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
            return "Не возможно определить уровень сложности задачи"
        else:
            difficulty = int(response.choices[0].text.strip())
            if difficulty == 1:
                coins = 50
            elif difficulty == 2:
                coins = 100
            elif difficulty == 3:
                coins = 300
            elif difficulty == 4:
                coins = 500
            else:
                coins = 1000

        # Обновляем данные задачи в базе данных
        tasks.update_one({'_id': ObjectId(task_id)}, {'$set': {'name': task_name, 'description': task_description, 'difficulty': difficulty, 'coins': coins}})
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

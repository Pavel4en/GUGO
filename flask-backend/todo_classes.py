from config import api_key
# Подключаем api нейросетки davinci
import openai

# Ставим ключ
openai.api_key = api_key


# Класс исключений, связанных с логикой To Do листа
class TodoException(Exception):
    def __init__(self, message):
        super().__init__(message)


# Класс, инкапсулирующий логику работы с заданиями
class Task:
    # Создать задание по словарю, а также определить уровень сложности задания
    # и награду за него
    def __init__(self, task_dict: dict):
        self.task_name = str(task_dict["name"])
        self.task_description = str(task_dict["description"])
        self.difficulty = int(task_dict["difficulty"])
        self.coins = int(task_dict["coins"])
        self.complete = bool(task_dict["complete"])

    # Создать новое задание по его названию и описанию, а также определить уровень сложности задания
    # и награду за него
    @classmethod
    def create_new_task(cls, task_name: str, task_description: str):
        task_dict = {}
        task_dict["name"] = task_name
        task_dict["description"] = task_description
        task_dict["difficulty"] = Task.define_difficulty_of_task(task_name)
        # Что делать с задачами с неопределенной сложностью???
        # TODO: обработка ошибок нейронки
        try:
            task_dict["coins"] = Task.define_reward(task_dict["difficulty"])
        except TodoException:
            task_dict["coins"] = -1
        task_dict["complete"] = False
        return cls(task_dict)

    # Определить м помощью ИИ награду за задание. Оценка идет от 1 до 5.
    # Если сложность не удалось определить, возвращается 0
    @classmethod
    def define_difficulty_of_task(cls, task_name: str) -> int:
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
    def define_reward(cls, difficulty: int) -> int:
        difficulty_to_reward = {
            1: 50,
            2: 100,
            3: 300,
            4: 500,
            5: 1000
        }
        if difficulty not in difficulty_to_reward:
            raise TodoException(f"Can not define reward for difficulty `{difficulty}`")
        return difficulty_to_reward[difficulty]

    def to_dict(self):
        return {
            "name": self.task_name,
            "description": self.task_description,
            "difficulty": self.difficulty,
            "coins": self.coins,
            "complete": self.complete
        }

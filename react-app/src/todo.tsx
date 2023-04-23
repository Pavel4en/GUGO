import React, {useEffect, useState} from 'react';
import './todo.css';


interface ITask {
    _id: string,
    coins: number,
    completed: false,
    description: string,
    difficulty: number,
    name: string
}

interface ITaskComponent extends JSX.Element {
}

interface ITaskComponentArr {
    taskComponentArr: ITaskComponent[]
}

interface IAddTask {
    addTask: (task: { name: string, description: string }) => void
}


const JSONFromURL = async <TResponse, >(url: string, config: RequestInit = {}): Promise<TResponse> => {
    try {
        const response = await fetch(url, config);
        return await response.json();
    } catch (error) {
        // TODO: Adequate exceptions
        throw Error;
    }
}


const parseTasksFromURL = (url: string): Promise<ITaskComponent[]> => {
    return JSONFromURL<ITask[]>(url,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
        .then((data: ITask[]): ITaskComponent[] => data.map(
                (task: ITask): ITaskComponent =>
                    <TaskListEntry {...task}/>
            )
        );
}
const getCompletedTasks = (): Promise<ITaskComponent[]> => {
    return parseTasksFromURL('http://localhost:5000/completed_tasks/')
}

const getIncompleteTasks = (): Promise<ITaskComponent[]> => {
    return parseTasksFromURL('http://localhost:5000/uncompleted_tasks');
}


const TodoApp = () => {
    const [taskComponentArr, setTaskComponentArr] = useState<ITaskComponent[]>([]);

    const updateTasksFromDB = () => {
        getIncompleteTasks().then((tasks) => setTaskComponentArr(tasks))
    }

    const addTask = (task: { name: string, description: string }) => {
        const requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: task.name,
                description: task.description
            })
        }

        fetch('http://localhost:5000/add_task', requestOption)
            .then(updateTasksFromDB)
            .catch((e) => {
                throw Error(e);
                // TODO: exceptions
            });
    }

    const deleteTask = (task: ITaskComponent) => {
        // TODO
    }

    const editTask = (task: ITaskComponent) => {
        // TODO
    }

    useEffect(() => {
        updateTasksFromDB();
    }, [])


    return (
        <div className="todo_app">
            <TaskManageBar
                addTask={addTask}/>
            <TaskList
                taskComponentArr={taskComponentArr}/>
        </div>
    );
}

const TaskManageBar = ({addTask}: IAddTask) => {
    return (
        <div className="task_manage_bar">
            <TaskSearchForm/>
            <TaskAddForm
                addTask={addTask}/>
        </div>
    );
}


const TaskAddForm = ({addTask}: IAddTask) => {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            taskName: { value: string },
            taskDescription: { value: string }
        };

        addTask({
            name: target.taskName.value,
            description: target.taskDescription.value
        })
    }

    return (
        <form className="task_add_form" onSubmit={handleSubmit}>
            <input type="text" name="taskName" className="task_add_form_name" placeholder="Name"/>
            <input type="text" name="taskDescription" className="task_add_form_description" placeholder="Description"/>
            <input type="submit" className="task_add_form_submit" value="Add"/>
        </form>
    );
}


const TaskSearchForm = () => {
    return (
        <form className="task_search_form actions">
            <input type="text" className="task_search_form_input" placeholder="..."/>
            <input type="submit" className="task_search_form_submit" value="Search"/>
        </form>
    );
}


const TaskList = ({taskComponentArr}: ITaskComponentArr) => {
    return (
        <div className="task_list">
            <div className="task_list_header">
                <h2>Name</h2>
                <h2>Description</h2>
                <h2>Difficulty</h2>
                <h2>Gems</h2>
            </div>

            <div className="task_list_body">
                {taskComponentArr}
            </div>
        </div>
    );
}


const TaskListEntry = ({_id, coins, completed, description, name, difficulty}: ITask) => {
    const taskID = _id;

    const [taskDifficulty, setTaskDifficulty] = useState(difficulty)
    const [taskReward, setTaskReward] = useState(coins);
    const [taskIsCompleted, setTaskIsCompleted] = useState(completed);
    const [taskName, setTaskName] = useState(name);
    const [taskDescription, setTaskDescription] = useState(description);


    return (
        <div className="task_list_element">
            <div className="content">
                <input type="text" className="text" value={taskName} readOnly/>
                <input type="text" className="text" value={taskDescription} readOnly/>
                <input type="text" className="text" value={taskDifficulty} readOnly/>
                <input type="text" className="text" value={taskReward} readOnly/>
            </div>
            <div className="actions">
                <button className="edit">edit</button>
                <button className="delete">delete</button>
            </div>
        </div> as ITaskComponent
    );
}


export default TodoApp;
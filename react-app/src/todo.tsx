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

interface ITaskComponentDict {
    [id: string]: ITaskComponent
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


const parseTasksFromURL = (url: string): Promise<ITask[]> => {
    return JSONFromURL<ITask[]>(url,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
}
const getCompletedTasks = () => {
    return parseTasksFromURL('http://localhost:5000/completed_tasks/')
}

const getIncompleteTasks = () => {
    return parseTasksFromURL('http://localhost:5000/uncompleted_tasks');
}


const TodoApp = () => {
    const [taskComponentDict, setTaskComponentDict]
        = useState<{ [id: string]: ITaskComponent }>({});

    const updateTasksFromDB = () => {
        getIncompleteTasks()
            .then((tasks) => {
                let newTasksComponentDict: ITaskComponentDict = {};

                tasks.forEach((task: ITask) => {
                    newTasksComponentDict[task._id] =
                        <TaskListEntry
                            {...task}
                            deleteTask={deleteTask}/>
                })

                setTaskComponentDict(newTasksComponentDict);
            })
        // TODO: exceptions
    }

    const addTask = (name: string, description: string) => {
        const requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: name,
                description: description
            })
        }

        fetch('http://localhost:5000/add_task', requestOption)
            .then(updateTasksFromDB)
    }

    const deleteTask = (taskID: string ) => {
        let newDict: ITaskComponentDict = {};
        Object.keys(taskComponentDict).forEach((iterTaskID: string) => {
            if (iterTaskID != taskID)
                newDict[iterTaskID] = taskComponentDict[taskID];
        });

        setTaskComponentDict(newDict);

        const requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                _id: taskID
            })
        }

        fetch('http://localhost:5000/delete_task', requestOption)
            .then(updateTasksFromDB)
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
            <TaskList taskComponentDict={taskComponentDict}/>
        </div>
    );
}

const TaskManageBar = (
    {addTask}: {
        addTask: (taskName: string, taskDescription: string) => void,
    }) => {
    return (
        <div className="task_manage_bar">
            <TaskSearchForm/>
            <TaskAddForm
                addTask={addTask}/>
        </div>
    );
}


const TaskAddForm = (
    {addTask}: {
        addTask: (taskName: string, taskDescription: string) => void
    }) => {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            taskName: { value: string },
            taskDescription: { value: string }
        };

        addTask(
            target.taskName.value,
            target.taskDescription.value
        )
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


const TaskList = ({taskComponentDict}: { taskComponentDict: ITaskComponentDict }) => {
    return (
        <div className="task_list">
            <div className="task_list_header">
                <h2>Name</h2>
                <h2>Description</h2>
                <h2>Difficulty</h2>
                <h2>Gems</h2>
            </div>

            <div className="task_list_body">
                {Object.values(taskComponentDict)}
            </div>
        </div>
    );
}


var TaskListEntry = ({_id, coins, completed, description, name, difficulty, deleteTask}:
                         ITask & { deleteTask: (taskID: string) => void }
) => {
    const taskID = _id;

    const [taskDifficulty, setTaskDifficulty] = useState(difficulty)
    const [taskReward, setTaskReward] = useState(coins);
    const [taskIsCompleted, setTaskIsCompleted] = useState(completed);
    const [taskName, setTaskName] = useState(name);
    const [taskDescription, setTaskDescription] = useState(description);

    const handleDelete = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        await deleteTask(taskID)
    }
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
                <button className="delete" onClick={handleDelete}>delete</button>
            </div>
        </div> as ITaskComponent
    );
}

export default TodoApp;
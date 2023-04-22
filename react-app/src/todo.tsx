import React, {useState} from 'react';
import './todo.css';


interface ITask {
    initTaskName: string,
    initTaskDescription: string,
    initTaskID: string
}

interface ITasksArr {
    tasksList: JSX.Element[]
}

interface IAddTask {
    addTask: (task: JSX.Element) => void
}

const TaskListElement: (a: ITask) => JSX.Element = ({initTaskName, initTaskDescription, initTaskID}: ITask) => {
    const [taskID, setTaskID] = useState(initTaskID);
    const [taskName, setTaskName] = useState(initTaskName);
    const [taskDescription, setTaskDescription] = useState(initTaskDescription);

    return (
        <div className="task_list_element">
            <div className="content">
                <input type="text" className="text" value={taskID} readOnly/>
                <input type="text" className="text" value={taskName} readOnly/>
                <input type="text" className="text" value={taskDescription} readOnly/>
            </div>
            <div className="actions">
                <button className="edit">edit</button>
                <button className="delete">delete</button>
            </div>
        </div>
    );

}

const TaskAddingForm = ({addTask}: IAddTask) => {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            taskName: { value: string },
            taskDescription: { value: string }
        };

        addTask(
            <TaskListElement
                initTaskName={target.taskName.value}
                initTaskDescription={target.taskDescription.value}
                initTaskID="TASKID"/>
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

const TaskSearch = () => {
    return (
        <div className="task_search">
            <h1>Search</h1>
            <form className="task_search_form actions">
                <input type="text" className="task_search_form_input" placeholder="..."/>
                <input type="submit" className="task_search_form_submit" value="Search"/>
            </form>
        </div>
    );
}

const TaskManageBar = ({addTask}: IAddTask) => {
    return (
        <div className="task_manage_bar">
            <TaskAddingForm
                addTask={addTask}/>
            <h1>LETS GO</h1>
            <TaskSearch/>
        </div>
    );
}

const TaskList = ({tasksList}: ITasksArr) => {
    console.log(tasksList[0]);
    return (
        <div className="task_list">
            <div className="task_list_header">
                <h2>Name</h2>
                <h2>Description</h2>
                <h2>Difficulty</h2>
                <h2>Gems</h2>
            </div>

            <div className="task_list_body">
                {tasksList}
            </div>
        </div>
    );
}

const TodoApp = () => {
    const [tasksList, setTasksList] = useState<JSX.Element[]>([]);

    const addTask = (task: JSX.Element) => {
        setTasksList([
            ...tasksList,
            task
        ]);
    }

    return (
        <div className="todo_app">
            <TaskManageBar
                addTask={addTask}/>
            <TaskList
                tasksList={tasksList}/>
        </div>
    );
}

export default TodoApp;
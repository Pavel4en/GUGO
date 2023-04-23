import React, {useState} from 'react';
import './todo.css';


const TodoApp = () => {
    const [tasksList, setTasksList] = useState<JSX.Element[]>([]);

    const addTask = (task: JSX.Element) => {
        setTasksList([
            ...tasksList,
            task
        ]);
    }

    const deleteTask = (task: JSX.Element) => {

    }

    const editTast = (task: JSX.Element) => {

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


interface IAddTask {
    addTask: (task: JSX.Element) => void
}
const TaskManageBar = ({addTask}: {addTask: (task: JSX.Element) => void}) => {
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

        addTask(
            <TaskListEntry
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


const TaskSearchForm = () => {
    return (
        <form className="task_search_form actions">
            <input type="text" className="task_search_form_input" placeholder="..."/>
            <input type="submit" className="task_search_form_submit" value="Search"/>
        </form>
    );
}


interface ITasksArr {
    tasksList: JSX.Element[]
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


interface ITaskListElement {
    initTaskName: string,
    initTaskDescription: string,
    initTaskID: string
}
const TaskListEntry = ({initTaskName, initTaskDescription, initTaskID}: ITaskListElement) => {
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


export default TodoApp;
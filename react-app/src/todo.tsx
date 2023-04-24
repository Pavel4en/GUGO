import React, {Fragment, useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components'


interface ITask {
    _id: string,
    coins: number,
    completed: false,
    description: string,
    difficulty: number,
    name: string
}
const Global = createGlobalStyle`
  * {
    margin: 0;
    box-sizing: border-box;

    --dark: #20B2AA;
    --darker: #008B8B;
    --darkest: #008080;
    --grey: #AFEEEE;
    --pink: #7FFFD4;
    --purple: #FFA07A;
    --light: #E0FFFF;


    background-color: #6A5ACD
  }
`

const StyleInput = styled.input`
  appearance: none;
  border: none;
  outline: none;
  background: none;
`
interface ITaskComponent extends JSX.Element {
}
interface ITaskComponentArr {
    taskComponentArr: ITaskComponent[]
}

interface ITaskComponentDict {
    [id: string]: ITaskComponent
}
const StyleButton = styled.button`
  appearance: none;
  border: none;
  outline: none;
  background: none;
`

const AppWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
  // padding: 0 15px;
`

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
        <>
            <Global/>
            <AppWrapper>
                <TaskManageBar addTask={addTask}/>
                <TaskList taskCompomentDict={taskComponentDict}/>
            </AppWrapper>
        </>
    );
}

const StyleTaskManageBar = styled.div`
  // display: flex;
  padding: 5rem;
  width: 100%;
  margin-bottom: 5rem;

`

interface IAddTask {
    addTask: (task: JSX.Element) => void
}
const TaskManageBar = (
    {addTask}: {
        addTask: (taskName: string, taskDescription: string) => void,
    }) => {
    return (
        <StyleTaskManageBar>
            <TaskSearchForm/>
            <TaskAddForm addTask={addTask}/>
        </StyleTaskManageBar>
    );
}

const StyleTaskAddForm = styled.form`
  display: flex;
`

const StyleTaskAddFormName = styled(StyleInput)`
  flex: 1 1 0;
  background-color: var(--darker);
  padding: 1rem;
  border-radius: 1rem;
  margin-right: 1rem;
  color: var(--light);
  font-size: 1.25rem;
`

const StyleTaskAddFormDescription = styled(StyleInput)`
  flex: 1 1 0;
  background-color: var(--darker);
  padding: 1rem;
  border-radius: 1rem;
  margin-right: 1rem;
  color: var(--light);
  font-size: 1.25rem;
`

const StyleTaskAddFormSubmit = styled(StyleButton)`
  color: var(--pink);
  font-size: 1.25rem;
  font-weight: 700;
  background-image: linear-gradient(to right, var(--pink), var(--purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  transition: 0.4s;

`

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
        <StyleTaskAddForm onSubmit={handleSubmit}>
            <StyleTaskAddFormName name='taskName'/>
            <StyleTaskAddFormDescription name='taskDescription'/>
            <StyleTaskAddFormSubmit> Add </StyleTaskAddFormSubmit>
        </StyleTaskAddForm>
    );
}

const StyleTaskSearchForm = styled.form`
  justify-content: center;
  display: flex;
  margin-bottom: 2rem;
`

const StyleTaskSearchFromInput = styled(StyleInput)`
  background-color: var(--darker);
  color: var(--light);
  border-radius: 1rem;
  font-size: 1.25rem;
  padding: 1rem;
  margin-right: 1rem;
`

const StyleTaskSearchFormSubmit = styled(StyleButton)`
  background-image: linear-gradient(to right, var(--pink), var(--purple));
  color: var(--pink);
  font-size: 1.25rem;
  font-weight: 700;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  transition: 0.4s;
`

const TaskSearchForm = () => {
    return (
        <StyleTaskSearchForm>
            <StyleTaskSearchFromInput/>
            <StyleTaskSearchFormSubmit> Search </StyleTaskSearchFormSubmit>
        </StyleTaskSearchForm>
    );
}


const TaskList = ({taskComponentDict}: { taskComponentDict: ITaskComponentDict }) => {
    return (
        <StyleTaskTable>
            <StyleTaskListHeader>
                <StyleTaskTableCell/>
                <StyleTaskTableCell>Name</StyleTaskTableCell>
                <StyleTaskTableCell>Description</StyleTaskTableCell>
                <StyleTaskTableCell>Difficulty</StyleTaskTableCell>
                <StyleTaskTableCell>Gems</StyleTaskTableCell>
                <StyleTaskTableCell/>
            </StyleTaskListHeader>
            {tasksList}
        </StyleTaskTable>
    );
}

const StyleTaskListElement = styled(Fragment)`
  font-size: 2rem;
`

const StyleContent = styled(Fragment)`

`

const StyleEdit = styled(StyleButton)`
  color: white;
`

const StyleDelete = styled(StyleButton)`
  color: white;
`

const StyleAction = styled.div`

`

const SpanTextbox = ({contentEditable, value = ''}: { contentEditable: boolean, value: string }) => {
    return (
        <StyleTaskTableCell>
            <span className="input" role="textbox" contentEditable={contentEditable}>{value}</span>
        </StyleTaskTableCell>
    );
}

const StyleSpan = styled(SpanTextbox)`
`


let TaskListEntry = ({_id, coins, completed, description, name, difficulty, deleteTask}:
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
        <StyleTaskTableRow>
            <StyleTaskListElement>
                <StyleContent>
                    <StyleSpan contentEditable={false} value={taskID}/>
                    <StyleSpan contentEditable={false} value={taskName}/>
                    <StyleSpan contentEditable={false} value={taskDescription}/>
                    <StyleSpan contentEditable={false} value='3'/>
                    <StyleSpan contentEditable={false} value='500'/>
                </StyleContent>
                <StyleAction>
                    <StyleEdit> edit </StyleEdit>
                    <StyleDelete> delete </StyleDelete>
                </StyleAction>
            </StyleTaskListElement>
        </StyleTaskTableRow>
    );
}


export default TodoApp;

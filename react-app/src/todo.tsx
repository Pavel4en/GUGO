import React, {Fragment, useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';


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

interface IAddTask {
    addTask: (task: JSX.Element) => void
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

const StyledInput = styled.input`
  appearance: none;
  border: none;
  outline: none;
  background: none;
`

const StyledButton = styled.button`
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

    const deleteTask = (taskID: string) => {
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
                <TaskList taskComponentDict={taskComponentDict}/>
            </AppWrapper>
        </>
    );
}

const StyledTaskManageBar = styled.div`
  // display: flex;
  padding: 5rem;
  width: 100%;
  margin-bottom: 5rem;
`


const TaskManageBar = (
    {addTask}: {
        addTask: (taskName: string, taskDescription: string) => void,
    }) => {
    return (
        <StyledTaskManageBar>
            <TaskSearchForm/>
            <TaskAddForm addTask={addTask}/>
        </StyledTaskManageBar>
    );
}

const StyledTaskAddForm = styled.form`
  display: flex;
`

const StyledTaskAddFormName = styled(StyledInput)`
  flex: 1 1 0;
  background-color: var(--darker);
  padding: 1rem;
  border-radius: 1rem;
  margin-right: 1rem;
  color: var(--light);
  font-size: 1.25rem;
`

const StyledTaskAddFormDescription = styled(StyledInput)`
  flex: 1 1 0;
  background-color: var(--darker);
  padding: 1rem;
  border-radius: 1rem;
  margin-right: 1rem;
  color: var(--light);
  font-size: 1.25rem;
`

const StyledTaskAddFormSubmit = styled(StyledButton)`
  color: var(--pink);
  font-size: 1.25rem;
  font-weight: 700;
  background-image: linear-gradient(to right, var(--pink), var(--purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  transition: 0.4s;
`

const StyledTaskListBody = styled(Fragment)`
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
        <StyledTaskAddForm onSubmit={handleSubmit}>
            <StyledTaskAddFormName name='taskName'/>
            <StyledTaskAddFormDescription name='taskDescription'/>
            <StyledTaskAddFormSubmit> Add </StyledTaskAddFormSubmit>
        </StyledTaskAddForm>
    );
}

const StyledTaskSearchForm = styled.form`
  justify-content: center;
  display: flex;
  margin-bottom: 2rem;
`

const StyledTaskSearchFromInput = styled(StyledInput)`
  background-color: var(--darker);
  color: var(--light);
  border-radius: 1rem;
  font-size: 1.25rem;
  padding: 1rem;
  margin-right: 1rem;
`

const StyledTaskSearchFormSubmit = styled(StyledButton)`
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
        <StyledTaskSearchForm>
            <StyledTaskSearchFromInput/>
            <StyledTaskSearchFormSubmit> Search </StyledTaskSearchFormSubmit>
        </StyledTaskSearchForm>
    );
}


const StyledTaskTable = styled.div`
  max-height: 100%;
  width: 100%;
  display: table;
`

const StyledTaskTableRow = styled.div`
  display: table-row;
`

const TableCell = styled.div`
  display: table-cell;
`

const StyledTaskListHeader = styled.div`
  display: table-row;
  color: var(--light);
`

const TaskList = ({taskComponentDict}: { taskComponentDict: ITaskComponentDict }) => {
    return (
        <StyledTaskTable>
            <StyledTaskListHeader>
                <TableCell/>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Gems</TableCell>
                <TableCell/>
            </StyledTaskListHeader>
            {Object.values(taskComponentDict)}
        </StyledTaskTable>
    );
}

const StyledTaskListElement = styled(Fragment)`
  font-size: 2rem;
`

const StyledContent = styled(Fragment)`
`

const StyledEdit = styled(StyledButton)`
  color: white;
`

const StyledDelete = styled(StyledButton)`
  color: white;
`

const StyledAction = styled.div`

`

const StyledSpan = styled(({contentEditable, value = ''}:
                               {
                                   contentEditable: boolean,
                                   value: string
                               }) => {
    return <span className="input" role="textbox" contentEditable={contentEditable}>{value}</span>;
})`
`


const TaskListEntry = ({_id, coins, completed, description, name, difficulty, deleteTask}:
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
        <StyledTaskTableRow>
            <StyledTaskListElement>
                <StyledContent>
                    <TableCell><StyledSpan contentEditable={false} value={taskID}/></TableCell>
                    <TableCell><StyledSpan contentEditable={false} value={taskName}/></TableCell>
                    <TableCell><StyledSpan contentEditable={false} value={taskDescription}/></TableCell>
                    <TableCell><StyledSpan contentEditable={false} value='3'/></TableCell>
                    <TableCell><StyledSpan contentEditable={false} value='500'/></TableCell>
                </StyledContent>
                <StyledAction>
                    <TableCell><StyledEdit> edit </StyledEdit></TableCell>
                    <TableCell><StyledDelete onClick={handleDelete}> delete </StyledDelete></TableCell>
                </StyledAction>
            </StyledTaskListElement>
        </StyledTaskTableRow>
    );
}


export default TodoApp;

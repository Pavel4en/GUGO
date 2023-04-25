import React, {Fragment, useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';
import editIcon from './writing.png';
import deleteIcon from './delete.png';

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
body {
    background-color: #232946;
    color: #fffffe;
    font-family: Arial, sans-serif;
  }
`

const StyledInput = styled.input`
flex: 1;
padding: 10px;
border-radius: 5px;
border: 2px solid #b8c1ec;
margin-right: 10px;
`

const StyledButton = styled.button`

padding: 10px;
background-color: #eebbc3;
color: #232946;
border: none;
border-radius: 5px;
margin-top: 20px;
`

const AppWrapper = styled.div`
max-width: 800px;
margin: 0 auto;
padding: 40px;
`
const Title = styled.h1`
  text-align: center;
  font-size: 50px;
`;


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
        <div>
            <Title>GUGO TTG</Title>
        </div>
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
  margin-bottom: 1rem;
  margin-left: -5rem;
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
            <StyledTaskAddFormName name='taskName' placeholder='Введите название задачи'/>
            <StyledTaskAddFormDescription name='taskDescription' placeholder='Введите описание задачи'/>
            <StyledTaskAddFormSubmit> Add </StyledTaskAddFormSubmit>
        </StyledTaskAddForm>
    );
}

const StyledTaskSearchForm = styled.form`
display: flex;
align-items: center;
margin-bottom: 40px;
`

const StyledTaskSearchFromInput = styled(StyledInput)`
flex: 1;
padding: 10px;
background-color: #fffffe;
color: #b8c1ec;
border: none;
border-radius: 5px 0 0 5px;
`

const StyledTaskSearchFormSubmit = styled(StyledButton)`
padding: 10px 20px;
margin-bottom: 20px;
background-color: #eebbc3;
color: #232946;
border: none;
border-radius: 0 5px 5px 0;
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
border: 1px solid #b8c1ec;
border-radius: 5px;
overflow: hidden;
`

const StyledTaskTableRow = styled.div`
display: flex;
align-items: center;
padding: 10px;
border-bottom: 1px solid #b8c1ec;
`

const TableCell = styled.div`
flex: 1;
`

const StyledTaskListHeader = styled.div`
background-color: #eebbc3;
padding: 10px;
display: flex;
font-size: 18px;
font-weight: bold;
color: #232946;
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
            <TaskListEntry 
                _id = 'pizda'
                coins = {100}
                completed = {false}
                description = 'zalupa' 
                name = 'voopche pohuy'
                difficulty = {100}
                deleteTask = {(sdaf: string) => {}}
            />
            {Object.values(taskComponentDict)}
        </StyledTaskTable>
    );
}

const StyledTaskListElement = styled(Fragment)`
display: flex;
align-items: center;
padding: 10px;
background-color: #fffffe;
color: #232946;
border-bottom: 1px solid #b8c1ec;
`

const StyledContent = styled(Fragment)`
flex: 1;
`

const StyledEdit = styled(StyledButton)`
    padding: 15px;
    background-color: #eebbc3;
    color: #232946;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
    background-image: url(${editIcon});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 24px 24px;
    display: flex;
`

const StyledDelete = styled(StyledButton)`
    padding: 15px;
    background-color: #eebbc3;
    color: #232946;
    border: none;
    border-radius: 5px;
    background-image: url(${deleteIcon});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 24px 24px;

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
                    <TableCell><StyledEdit>  </StyledEdit></TableCell>
                    <TableCell><StyledDelete onClick={handleDelete}>  </StyledDelete></TableCell>
                </StyledAction>
            </StyledTaskListElement>
        </StyledTaskTableRow>
    );
}


export default TodoApp;

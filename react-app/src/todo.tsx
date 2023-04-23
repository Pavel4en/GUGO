import React, {useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components'


const Global = createGlobalStyle`
* {
margin: 0;
box-sizing: border-box;

--dark: rgb(36, 139, 157);
--darker: #3a7c84;
--darkest: #1f484d;
--grey: #b3bed3;
--pink: #ffffff;
--purple: #ffffff;
--light: #EEE;
}
`

const StyleInput = styled.input`
appearance: none;
border: none;
outline: none;
background: none;
`

const StyleButton = styled.button`
appearance: none;
border: none;
outline: none;
background: none;
`

const AppWrapper = styled.div`

`

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
        <>
            <Global/>
                <AppWrapper>
                            <TaskManageBar addTask={addTask}/>
                            <TaskList tasksList={tasksList}/>
                </AppWrapper>
        </>
    );
}

const StyleTaskManageBar = styled.div`
display: flex;
padding: 2rem 10rem;
width: 100%;
margin: 1rem 0;
justify-content: space-between;
`

interface IAddTask {
    addTask: (task: JSX.Element) => void
}

const TaskManageBar = ({addTask}: {addTask: (task: JSX.Element) => void}) => {
    return (
        <StyleTaskManageBar>
                <TaskSearchForm/>
                <TaskAddForm addTask={addTask}/>
        </StyleTaskManageBar>
    );
}

const StyleTaskAddForm = styled.form`
display: flex;
padding: 0 4rem;
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
                initTaskID="TaskID"/>
        )
    }

    return (
        <StyleTaskAddForm>
                <StyleTaskAddFormName/>
                <StyleTaskAddFormDescription/>
                <StyleTaskAddFormSubmit>
                    Add
                </StyleTaskAddFormSubmit>
        </StyleTaskAddForm>
    );
}

const StyleTaskSearchForm = styled.form`
margin: 0 4rem;
`

const StyleTaskSearchFromInput = styled(StyleInput)`
flex: 1 1 0;
background-color: var(--darker);
padding: 1rem;
border-radius: 1rem;
margin-right: 1rem;
color: var(--light);
font-size: 1.25rem;
`

const StyleTaskSearchFormSubmit = styled(StyleButton)`
color: var(--pink);
font-size: 1.25rem;
font-weight: 700;
background-image: linear-gradient(to right, var(--pink), var(--purple));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
cursor: pointer;
transition: 0.4s;
`

const TaskSearchForm = () => {
    return (
        <StyleTaskSearchForm>
            <StyleTaskSearchFromInput/>
            <StyleTaskSearchFormSubmit>
                search
            </StyleTaskSearchFormSubmit>
        </StyleTaskSearchForm>
    );
}

const StyleTaskList = styled.div`
`

const StyleTaskListHeader = styled.div`
display: flex;
justify-content: space-between;
`

const StyleTaskListBody = styled.div`

`

interface ITasksArr {
    tasksList: JSX.Element[]
}

const TaskList = ({tasksList}: ITasksArr) => {
    console.log(tasksList[0]);
    return (
        <StyleTaskList>
            <StyleTaskListHeader>
                    <h2>Name</h2>
                    <h2>Description</h2>
                    <h2>Difficulty</h2>
                    <h2>Gems</h2>
            </StyleTaskListHeader>
            <StyleTaskListBody>
                {tasksList}
            </StyleTaskListBody>
        </StyleTaskList>
    );
}

const StyleTaskListElemen = styled.div`

`

const StyleContent = styled.div`

`

const StyleEdit = styled(StyleButton)`
background-image: linear-gradient(to right, var(--pink), var(--purple));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
`

const StyleDelete = styled(StyleButton)`
color: rgb(162, 8, 38);
`

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
        <StyleTaskListElemen>
                <StyleContent>
                    {taskID}
                    {taskName}
                    {taskDescription}
                    {taskDescription}
                    {taskDescription}
                    <StyleEdit>
                        edit
                    </StyleEdit>
                    <StyleDelete>
                        delete
                    </StyleDelete>
                </StyleContent>
        </StyleTaskListElemen>
    );
}


export default TodoApp;
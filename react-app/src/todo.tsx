import React, {Fragment, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components'


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
  // display: flex;
  padding: 5rem;
  width: 100%;
  margin-bottom: 5rem;

`

interface IAddTask {
    addTask: (task: JSX.Element) => void
}

const TaskManageBar = ({addTask}: { addTask: (task: JSX.Element) => void }) => {
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


const StyleTaskTable = styled.div`
  max-height: 100%;
  width: 100%;
  display: table;
`

const StyleTaskTableRow = styled.div`
  display: table-row;
`

const StyleTaskTableCell = styled.div`
  display: table-cell;
`


const StyleTaskListHeader = styled.div`
  display: table-row;
  color: var(--light);
`


const StyleTaskListBody = styled(Fragment)`
`

interface ITasksArr {
    tasksList: JSX.Element[]
}

const TaskList = ({tasksList}: ITasksArr) => {
    console.log(tasksList[0]);
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
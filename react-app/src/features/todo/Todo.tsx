import React, {Fragment, useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';

import {
    ITask, ITaskComponent
} from "./interfaces";

import {useDispatch, useSelector} from "react-redux";

import {
    todoUpdated,
    todoAdded,
    todoDeleted,
    todoEdited,
    todoLoaded,
    todoLoading,
    todoToggled,
    selectTasks
} from "./todoSlice";
import {Dispatch} from "@reduxjs/toolkit";


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
const getCompleteTasks = () => {
    return parseTasksFromURL('http://localhost:5000/complete_tasks/')
}

const getIncompleteTasks = () => {
    return parseTasksFromURL('http://localhost:5000/incomplete_tasks');
}

interface IUpdateTasks {
    type: "todo/todoUpdated",
    payload: ITask[]
}

const updateTasks = (dispatcher: Dispatch<IUpdateTasks>) => {
    getIncompleteTasks().then((newTasks: ITask[]) => dispatcher(todoUpdated(newTasks)))
}


const TodoApp = () => {
    const editTask = (task: ITaskComponent) => {
        // TODO
    }

    return (
        <>
            <Global/>
            <AppWrapper>
                <TaskManageBar/>
                <TaskList/>
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


const TaskManageBar = () => {
    return (
        <StyledTaskManageBar>
            <TaskSearchForm/>
            <TaskAddForm/>
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
const TaskAddForm = () => {
    const dispatcher = useDispatch();

    const addTask = (name: string, description: string) => {
        const sendAddTask = () => {
            const requestOption = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: name,
                    description: description
                })
            }
            return fetch('http://localhost:5000/add_task', requestOption)
        }

        dispatcher(todoAdded({name: name, description: description, difficulty: 0, _id: '', coins: 0, completed: false}));

        sendAddTask().then(() => updateTasks(dispatcher));
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

const TaskList = () => {
    const dispatcher = useDispatch();
    const taskList = useSelector(selectTasks);

    useEffect(() => updateTasks(dispatcher), [dispatcher]);

    const taskComponentList = taskList.map(
        (task: ITask) => <TaskListEntry {...task} />
    );

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
            {(taskList.length > 0) ? taskComponentList : null}
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


const TaskListEntry = ({_id, description, name, coins, difficulty}: ITask) => {
    const dispatcher = useDispatch();

    const handleDelete = async (event: React.FormEvent<HTMLButtonElement>) => {
        const sendDeleteTask = () => {
            const requestOption = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    _id: _id
                })
            }
            return fetch('http://localhost:5000/delete_task', requestOption)
        }
        event.preventDefault();

        dispatcher(todoDeleted(_id));

        sendDeleteTask().then(() => updateTasks(dispatcher))
    }

    return (
        <StyledTaskTableRow>
            <StyledTaskListElement>
                <StyledContent>
                    <TableCell><StyledSpan contentEditable={false} value={_id}/></TableCell>
                    <TableCell><StyledSpan contentEditable={false} value={name}/></TableCell>
                    <TableCell><StyledSpan contentEditable={false} value={description}/></TableCell>
                    <TableCell><StyledSpan contentEditable={false} value={String(difficulty)}/></TableCell>
                    <TableCell><StyledSpan contentEditable={false} value={String(coins)}/></TableCell>
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

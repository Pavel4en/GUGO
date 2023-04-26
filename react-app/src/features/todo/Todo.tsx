import React, {Fragment, useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';

import deleteImage from "./images/delete.png"
import editImage from "./images/edit.png"

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
            <div>
                <Title>GUGO TTG</Title>
            </div>
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
  margin-bottom: 1rem;
  margin-left: -5rem;
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

        dispatcher(todoAdded({
            name: name,
            description: description,
            difficulty: 0,
            _id: '',
            coins: 0,
            completed: false
        }));

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

const StyledTaskTable = styled.table`
border-collapse: collapse;
border-radius: 5px;
overflow: hidden;
width: 100%;
table-layout: fixed;
`;

const StyledTaskTableRow = styled.tr`
border-bottom: 1px solid #b8c1ec;
`;

const StyledTableHeaderRow = styled.tr`
  background-color: #eebbc3;
  display: table-row;
`;

const StyledTableCell = styled.td`
padding: 10px;
text-align: center;
min-width: 0;
`;

const StyledTableHeaderCell = styled.th`
padding: 10px;
text-align: center;
color: #232946;
font-size: 18px;
font-weight: bold;
border: none;
white-space: nowrap;
min-width: 0;
`;

const TaskList = () => {
    const dispatcher = useDispatch();
    const taskList = useSelector(selectTasks);

    useEffect(() => updateTasks(dispatcher), [dispatcher]);

    const taskComponentList = taskList.map(
        (task: ITask) => <TaskListEntry {...task} />
    );

    return (
        <StyledTaskTable>
            <StyledTableHeaderRow>
                <StyledTableHeaderCell/>
                <StyledTableHeaderCell>Name</StyledTableHeaderCell>
                <StyledTableHeaderCell>Description</StyledTableHeaderCell>
                <StyledTableHeaderCell>Difficulty</StyledTableHeaderCell>
                <StyledTableHeaderCell>Gems</StyledTableHeaderCell>
                <StyledTableHeaderCell/>
            </StyledTableHeaderRow>
            {(taskList.length > 0) ? taskComponentList : null}
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
  background-image: url(${editImage});
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
  background-image: url(${deleteImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  display: flex;

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
                <StyledTableCell></StyledTableCell>
                    <StyledTableCell><StyledSpan contentEditable={false} value={name}/></StyledTableCell>
                    <StyledTableCell><StyledSpan contentEditable={false} value={description}/></StyledTableCell>
                    <StyledTableCell><StyledSpan contentEditable={false} value={String(difficulty)}/></StyledTableCell>
                    <StyledTableCell><StyledSpan contentEditable={false} value={String(coins)}/></StyledTableCell>
                </StyledContent>
                <StyledAction>
                    <StyledTableCell><StyledEdit> </StyledEdit></StyledTableCell>
                    <StyledTableCell><StyledDelete onClick={handleDelete}> </StyledDelete></StyledTableCell>
                </StyledAction>
            </StyledTaskListElement>
        </StyledTaskTableRow>
    );
}


export default TodoApp;

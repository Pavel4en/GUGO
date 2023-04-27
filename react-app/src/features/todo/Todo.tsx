import React, {Fragment, useEffect} from 'react';
import styled, {createGlobalStyle} from 'styled-components';

import deleteImage from "./images/delete.png"
import editImage from "./images/edit.png"
import doneImage from "./images/done.png"

import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";

import {IUpdateTasks} from "./redux/interfacesRedux"

import {ITask} from "./interfaces";

import {
    todoUpdated,
    todoAdded,
    todoDeleted,
    todoEdited,
    todoLoaded,
    todoLoading,
    todoCompleted,
    selectTasks
} from "./redux/todoSlice";

import {todoAPI} from "./todoAPI";
import {petAPI} from "../pet/API/petAPI";
import {Link} from "react-router-dom";


const Global = createGlobalStyle`
  body {
    background-color: #232946;
    color: #fffffe;
    font-family: Arial, sans-serif;
    transition: 0.4s;
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
  // padding: 40px;
`

const Title = styled.h1`
  text-align: center;
  font-size: 5rem;
  padding-bottom: 4rem;
`

const updateTasks = (dispatcher: Dispatch<IUpdateTasks>) => {
    todoAPI.getIncompletedTasks()
        .then((newTasks: ITask[]) => dispatcher(todoUpdated(newTasks)))
}

const Header = styled.header`
  position: sticky;
  top: 0;
  background-color: #232946;
`

const SwitchToPet = styled(StyledButton)`
margin-right: 4rem;
margin-left: 4rem;
margin-top: 4rem;

color: #1D9AF2;
background-color: #292D3E;
border: 1px solid #1D9AF2;
border-radius: 0.5rem;
padding: 24px 88px;
cursor: pointer;
height: 5rem;
text-align: center;
justify-content: center;
font-size: 1.5rem;
box-shadow: 0 0 4px #eebbc3;
outline: none;
background-position: center;
transition: background 0.8s;

&:hover{
background: #47a7f5 radial-gradient(circle, transparent 1%, #eebbc3 1%)
 center/15000%;
color: white;
  }

&:active{
background-color: #292d3e;
background-size: 100%;
transition: background 0s;

box-shadow: 0 3px 0 #00823f;
top: 3px;
  }
`

const TodoApp = () => {
    return (
        <>
            <Global/>
            <Link to={"/pet"}>
                <SwitchToPet>Pet</SwitchToPet>
            </Link>
            <AppWrapper>
                <Title>Task To Gem</Title>
                <Header>
                    <TaskManageBar/>
                    <StyledTaskListHeader>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Difficulty</TableCell>
                        <TableCell>Gems</TableCell>
                        <TableCell/>
                    </StyledTaskListHeader>
                </Header>
                <TaskList/>
            </AppWrapper>
        </>
    );
}

const StyledTaskManageBar = styled.div`
  padding: 5rem;
  width: 100%;
  margin-bottom: 1rem;
  margin-left: -5rem;

  padding-top: 0;
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
  display: inline-block;
  position: relative;

  &:active {
    top: 3px;
  }
`

const TaskAddForm = () => {
    const dispatcher = useDispatch();

    const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            taskName: { value: string },
            taskDescription: { value: string }
        };

        dispatcher(todoAdded({
            name: target.taskName.value,
            description: target.taskDescription.value,
            difficulty: 0,
            _id: '',
            coins: 0,
            completed: false
        }));

        todoAPI.sendAddTask({name: target.taskName.value, description: target.taskDescription.value})
            .then(() => updateTasks(dispatcher));
    }

    return (
        <StyledTaskAddForm onSubmit={handleAdd}>
            <StyledTaskAddFormName name='taskName' placeholder='Task Name'/>
            <StyledTaskAddFormDescription name='taskDescription' placeholder='Task Description'/>
            <StyledTaskAddFormSubmit>Add</StyledTaskAddFormSubmit>
        </StyledTaskAddForm>
    );
}

const StyledTaskSearchForm = styled.form`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
`

const StyledTaskSearchFromInput = styled(StyledInput)`
  flex: 1;
  background-color: #fffffe;
  color: #151515;
  border: none;
  font-size: 1.25rem;
  transition: 0.4s;
`

const StyledTaskSearchFormSubmit = styled(StyledButton)`
  padding: 10px 20px;
  margin-bottom: 20px;
  background-color: #eebbc3;
  color: #232946;
  border: none;
  border-radius: 0 5px 5px 0;
  transition: 0.4s;
  font-size: 1.25rem;
  display: inline-block;
  position: relative;
  cursor: pointer;

  &:active {
    box-shadow: 0 3px 0 #1D9AF2;
    top: 3px;
  }

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
  overflow: hidden;
  width: 100%;
  table-layout: fixed;
`

const StyledTaskTableRow = styled.tr`
  align-items: center;
  border-bottom: 1px solid #b8c1ec;
`

const StyledTaskListHeader = styled.div`
  background-color: #eebbc3;
  padding: 10px;
  display: flex;
  font-size: 18px;
  font-weight: bold;
  color: #232946;
  border-radius: 5px;
  position: sticky;
  top: 0;
`

const TableCell = styled.div`
  flex: 1;
  font-size: 1rem;
  text-align: center;
`

const StyledTableCell = styled.td`
  padding: 10px;
  text-align: center;
  min-width: 0;
  font-size: 1rem;
`

const TaskList = () => {
    const dispatcher = useDispatch();
    const taskList = useSelector(selectTasks);

    useEffect(
        () => updateTasks(dispatcher),
        [dispatcher]
    );

    const taskComponentList = taskList.map(
        (task: ITask) => <TaskListEntry {...task} />
    );

    return (
        <StyledTaskTable>
            {(taskList.length > 0) ? taskComponentList : null}
        </StyledTaskTable>
    );
}

const StyledTaskListElement = styled(Fragment)`
  display: flex;
  align-items: center;
  padding: 10px;
  color: white;
`

const StyledContent = styled(Fragment)`
  flex: 1;
`

const StyledEditButton = styled(StyledButton)`
  background-color: #eebbc3;
  color: #232946;
  border: none;
  background-image: url(${editImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  display: flex;
  border-radius: 4px;
  padding: 0 15px;
  cursor: pointer;
  height: 32px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 1px 1px #53a7ea, 2px 2px #53a7ea, 3px 3px #53a7ea;
    transform: translateX(-3px);
  }
`

const StyledDeleteButton = styled(StyledButton)`
  background-color: #eebbc3;
  color: #232946;
  border: none;
  background-image: url(${deleteImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  display: flex;
  border-radius: 4px;
  padding: 0 15px;
  cursor: pointer;
  height: 32px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 1px 1px #53a7ea, 2px 2px #53a7ea, 3px 3px #53a7ea;
    transform: translateX(-3px);
  }

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

const StyledCompleteButton = styled(StyledButton)`
  background-color: #eebbc3;
  color: #232946;
  border: none;
  background-image: url(${doneImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  display: flex;
  border-radius: 4px;
  padding: 0 15px;
  cursor: pointer;
  height: 32px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 1px 1px #53a7ea, 2px 2px #53a7ea, 3px 3px #53a7ea;
    transform: translateX(-3px);
  }
`

const TaskListEntry = ({_id, description, name, coins, difficulty}: ITask) => {
    const dispatcher = useDispatch();

    const handleDelete = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        dispatcher(todoDeleted(_id));

        const data = {
            _id: _id
        }

        todoAPI.sendDeleteTask(data)
            .then(() => updateTasks(dispatcher))
    }

    const handleComplete = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        dispatcher(todoCompleted(_id));

        const data = {
            _id: _id
        }

        todoAPI.sendCompleteTask(data)
            .then(() => updateTasks(dispatcher));
    }

    return (
        <StyledTaskTableRow>
            <StyledTaskListElement>
                <StyledContent>
                    <StyledTableCell><StyledSpan contentEditable={false} value={name}/></StyledTableCell>
                    <StyledTableCell><StyledSpan contentEditable={false} value={description}/></StyledTableCell>
                    <StyledTableCell><StyledSpan contentEditable={false} value={String(difficulty)}/></StyledTableCell>
                    <StyledTableCell><StyledSpan contentEditable={false} value={String(coins)}/></StyledTableCell>
                </StyledContent>
                <StyledAction>
                    <StyledTableCell><StyledEditButton/></StyledTableCell>
                    <StyledTableCell><StyledDeleteButton onClick={handleDelete}/></StyledTableCell>
                    <StyledTableCell><StyledCompleteButton onClick={handleComplete}/></StyledTableCell>
                </StyledAction>
            </StyledTaskListElement>
        </StyledTaskTableRow>
    );
}


export default TodoApp;

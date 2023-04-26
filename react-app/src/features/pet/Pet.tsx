import React, {ButtonHTMLAttributes, Fragment, useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';

import petHappy from './images/pet-pet/m-happy.png'
import petClassic from './images/pet-pet/m-classic.png'
import petSad from './images/pet-pet/m-sad.png'
import petSleepy from './images/pet-pet/m-sleepy.png'
import petAngry from './images/pet-pet/m-angry.png'


import lamp from './images/pet-button/b-sleep.png'
import computer from './images/pet-button/b-computer.png'
import eat from './images/pet-button/b-eat.png'

import {
    IPet,
    IPetSetup
} from "./interfaces";

import {petAPI} from "./petAPI";


import {
    petSetup,
    petChangedName,
    petAddedSatiety,
    petAddedSleep,
    petAddedHappiness,
    petPutOnCloth,
    petTakeOffCloth,
    petToggleSleep
} from "./petSlice";

import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";


const Global = createGlobalStyle`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #232946;
  }
`

const StyledButton = styled.button`
  border: none;
  margin-top: 4rem;
  width: 5.3rem;
  height: 5.3rem;
  background-size: 5.3rem;
  border-radius: 13px;
  margin-right: 5rem;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`

const AppWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 800px;
  margin: 0 auto;
`

const updatePet = () => {
    // petAPI.getPet().then((newPet: IPet) => dispatcher(petSetup(newPet)));
}

const PetApp = () => {
    return (
        <>
            <Global/>
            <AppWrapper>
                <StyledPetsName>DOLBAEB</StyledPetsName>
                <Visual>
                    <StyledPetNest>
                        <StatsList/>
                    </StyledPetNest>

                </Visual>
                <StatsActions>
                    <StyledEatButton/>
                    <LampButton/>
                    <StyledComputerButton/>
                </StatsActions>
            </AppWrapper>
        </>
    );
}

const StyledPetsName = styled.div`
  font-size: 3rem;
  margin-bottom: 2rem;
  font-weight: 700;
  // -webkit-background-clip: text;
  transition: 0.4s;

  border: none;
  outline: none;

  background: -webkit-linear-gradient(white, #eebbc3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const LampButtonStyle = styled(StyledButton)`
  background-image: url(${lamp});
`

const StyledComputerButton = styled(StyledButton)`
  background-image: url(${computer});
`

const StyledEatButton = styled(StyledButton)`
  background-image: url(${eat});
`

const LampButton = () => {
    const dispatcher = useDispatch();

    const toggleSleep = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        dispatcher(petToggleSleep());

        petAPI.sendSleepToggled()
            .then(() => dispatcher(petToggleSleep()))
    }

    return <LampButtonStyle onClick={toggleSleep}/>;
}

const Visual = styled.div`
  display: flex;
  align-items: center;
`

const StyledPetNest = styled.div`
  background-image: url(${petClassic});
  width: 30rem;
  height: 30rem;
  background-size: 30rem;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 1rem;


  position: relative;
  // top: 50%;
  left: 50%;
  // margin-left: 50%;
  transform: translate(-50%, 0);
`

const PetNest = () => {
    return (
        <StyledPetNest>
        </StyledPetNest>
    )
}

const StyledStatsList = styled.div`
  margin-left: 100%;
  padding-left: 2rem;
  margin-top: 50%;
  transform: translate(0, -50%);
`

const StatsActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-position: center;

  margin-left: 6rem;
  margin-right: 1rem;

`


const StatsListItem = ({className, label}: { className?: string, label: string }) => {
    return (
        <div className={className}>{label}</div>
    );
}


const StyledStatsListItem = styled(StatsListItem)`
  padding: 1rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
  border-radius: 35px;
  justify-content: center;
  background-color: #eebbc3;
  width: 14rem;
  height: 50%;

  position: relative;
  animation: fillBar 2.5s 1;
`

const StatsList = () => {
    return (
        <StyledStatsList>
            <StyledStatsListItem label="Еда"/>
            <StyledStatsListItem label="Кофеин"/>
            <StyledStatsListItem label="Позитивчик"/>
        </StyledStatsList>
    )
}


export default PetApp;
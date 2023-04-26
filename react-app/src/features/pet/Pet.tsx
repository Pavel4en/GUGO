import React, {Fragment, useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';

import petHappy from './images/m-happy.png'
import petClassic from './images/m-classic.png'
import petSad from './images/m-sad.png'
import petSleepy from './images/m-sleepy.png'

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
    petPutOffCloth
} from "./petSlice";

import {Dispatch} from "@reduxjs/toolkit";


const Global = styled.div`
  * {
    margin: 0;
    box-sizing: border-box;
  }
`

const AppWrapper = styled.div`
  // margin: 20% auto;
  max-width: 960px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
`

const updatePet = () => {
    petAPI.getPet().then((newPet: IPet) => dispatcher(petSetup(newPet)));
}

const PetApp = () => {
    return (
        <>
            <Global/>
            <AppWrapper>
                <PetNest/>
                <StatsList/>
            </AppWrapper>
        </>
    );
}

const StyledPetNest = styled.button`
  background-color: red;
  background-image: url(${petClassic});
  width: 17rem;
  height: 17rem;
  background-size: 17rem;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 4rem;
  margin-bottom: 1rem;
`


const PetNest = () => {
    return (
        <StyledPetNest/>
    )
}

const StyledStatsList = styled.div`
  font-family: 'Open Sans', sans-serif;
  margin-right: 0;

  color: #f2f2f2;
  cursor: pointer;
  padding: 1rem 0;
  width: 40%;
`

const StyledStatsListItem = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 35px;
  background: #777;

  justify-content: center;
`

const StatsList = () => {
    return (
        <StyledStatsList>
            <StyledStatsListItem>
                Feed: {}
            </StyledStatsListItem>
            <StyledStatsListItem>
                Sleepy: 100%
            </StyledStatsListItem>
            <StyledStatsListItem>
                Happinnes: 100%
            </StyledStatsListItem>
        </StyledStatsList>
    )
}


export default PetApp;
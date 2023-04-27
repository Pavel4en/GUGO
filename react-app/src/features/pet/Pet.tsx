import React, {ButtonHTMLAttributes, Fragment, useEffect, useState} from 'react';
import styled, {createGlobalStyle, keyframes} from 'styled-components';
import { Keyframes } from 'styled-components';

import petHappy from './images/pet-pet/m-happy.png'
import petClassic from './images/pet-pet/m-classic.png'
import petSad from './images/pet-pet/m-sad.png'
import petSleepy from './images/pet-pet/m-sleepy.png'
import petAngry from './images/pet-pet/m-angry.png'


import lamp from './images/pet-button/b-sleep.png'
import computer from './images/pet-button/b-computer.png'
import eat from './images/pet-button/b-eat.png'

import {
    IPet
} from "./interfaces";

import {petAPI} from "./API/petAPI";


import {
    petSetup,
    petChangedName,
    petAddedSatiety,
    petAddedSleep,
    petAddedHappiness,
    petPutOnCloth,
    petRemovedCloth,
    petToggledSleep,
    selectName,
    selectCharacteristics,
    selectClothes
} from "./redux/petSlice";

import {useDispatch} from "react-redux";
import { emitWarning } from 'process';


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
  margin-right: 5rem;
  background-repeat: no-repeat;
  background-position: center;


  color: #1D9AF2;
  background-color: #eebbc3;
  border: 2px solid #eebbc3;
  border-radius: 4px;
  padding: 0 15px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
  box-shadow: 2px 2px #eebbc3, 3px 3px #eebbc3, 4px 4px #eebbc3;
  transform: translateX(-3px);
  }
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

const SwithToTodo = styled.button`

  margin: 4rem;

  color: #1D9AF2;
  background-color: #292D3E;
  border: 1px solid #1D9AF2;
  border-radius: 0.5rem;
  padding: 24px 88px;
  cursor: pointer;
  height: 5rem;
  text-align: center;
  justify-content: center;
  justify-item: center;
  transition: 0.4s;
  font-size: 1.5rem;
  box-shadow: 0 0 4px #999;
  outline: none;
  background-position: center;
  transition: background 0.8s;

  &:hover{
  background: #47a7f5 radial-gradient(circle, transparent 1%, #47a7f5 1%)
   center/15000%;
  color: white;

  &:active{
  background-color: #292d3e;
  background-size: 100%;
  transition: background 0s;

  box-shadow: 0 3px 0 #00823f;
  top: 3px;
`

const PetApp = () => {
    return (
        <>
            <Global/>
                <SwithToTodo>ToDo</SwithToTodo>
            <AppWrapper>
                <PetNameStyle>Мой Мышь</PetNameStyle>
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

const leFadeIn = keyframes` {
  from { opacity: 0 }
  to { opacity: 1 }
}
`

const PetNameStyle = styled.div`
  font-size: 3rem;
  margin-bottom: 2rem;
  font-weight: 700;
  transition: 0.4s;

  border: none;
  outline: none;

  background: -webkit-linear-gradient(white, #eebbc3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation-name: ${leFadeIn};
  animation-duration: 2s;
`

const PetName = () => {
    return (
        <PetNameStyle>

        </PetNameStyle>
    )
}

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

        dispatcher(petToggledSleep());

        petAPI.sendToggleSleep();
    }

    return <LampButtonStyle onClick={toggleSleep}/>;
}

const Visual = styled.div`
  display: flex;
  align-items: center;
`

const StyledStatsList = styled.div`
  margin-left: 100%;
  padding-left: 2rem;
  margin-top: 50%;
  transform: translate(0, -50%);
  transition: 0.4s;
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
  padding: 2rem 2rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
  border-radius: 35px;
  justify-content: center;
  background-color: #eebbc3;
  width: 14rem;  height: 50%;
  font-size: 1.2rem;
  text-align: left;
  position: relative;
  animation: fillBar 2.5s 1;
  transition: 0.4s;
`

const StatsList = () => {
  const [food, setFood] = useState(100);
  const [coffee, setCoffee] = useState(100);
  const [positive, setPositive] = useState(100);
  const [pet_mood, setMood] = useState("happy");

  useEffect(() => {
    const interval = setInterval(() => {
      setFood((prevFood) => Math.max(0, prevFood - 10));
      setCoffee((prevCoffee) => Math.max(0, prevCoffee - 7));
      setPositive((prevPositive) => Math.max(0, prevPositive - 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateMood();
  }, [food, coffee, positive]);

  function updateMood() {
    if (food < 50) {
      setMood("petSad");
    } else if (coffee > 80) {
      setMood("petSleepy");
    } else if (positive > 70) {
      setMood("petHappy");
    } else {
      setMood("normal");
    }
  }

  return (
    <StyledStatsList>
      <StyledStatsListItem label={`Еда: ${food}%`} />
      <StyledStatsListItem label={`Кофеин: ${coffee}%`} />
      <StyledStatsListItem label={`Позитивчик: ${positive}%`} />
      <StyledStatsListItem label={`Настроение: ${pet_mood}`} />
    </StyledStatsList>
  );
};

const StyledPetNest = styled.div`

  transition: 0.4s;
  background-image: url(${petSad});


  width: 30rem;
  height: 30rem;
  background-size: 30rem;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 1rem;


  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
`

export default PetApp;
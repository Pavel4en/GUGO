import React, {useEffect, useState} from 'react';
import styled, {createGlobalStyle, keyframes} from 'styled-components';

import petHappy from './images/pet-pet/m-happy.png'
import petClassic from './images/pet-pet/m-classic.png'
import petSad from './images/pet-pet/m-sad.png'
import petSleepy from './images/pet-pet/m-sleepy.png'
import petAngry from './images/pet-pet/m-angry.png'


import lamp from './images/pet-button/b-sleep.png'
import computer from './images/pet-button/b-computer.png'
import eat from './images/pet-button/b-eat.png'

import shop from './images/shop/shop.png'

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
    selectStats,
    selectClothes,
    petChangedMood,
    petReducedSatiety,
    petReducedHappiness,
    petReducedSleep,
    selectMood
} from "./redux/petSlice";

import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

import {IAPIPet} from "./API/interfacesAPI";


const Global = createGlobalStyle`
  * {
    margin: 0;
    box-sizing: border-box;
    transition: 0.4s;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #232946;
  }
`

const StyledButton = styled.button`
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

const SwitchToTODO = styled.button`
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
  font-size: 1.5rem;

  outline: none;
  background-position: center;
  transition: background 0.8s;

  &:hover {
    background: #47a7f5 radial-gradient(circle, transparent 1%, #eebbc3 1%)
      center/15000%;
    color: white;
  }

  &:active {
    background-color: #292d3e;
    background-size: 100%;
    transition: background 0s;

    box-shadow: 0 3px 0 #00823f;
    top: 3px;
  }
`

const StyledShopBar = styled.div`
  display: flex;
  margin-bottom: 6rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 1rem #eebbc3;
`


const BalanceBar = styled.label`
  font-size: 3rem;
  color: white;
  margin-right: 2rem;
`

const Shop = styled.button`
  background-color: #eebbc3;
  background-image: url(${shop});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 3rem 3rem;
  display: flex;
  border-radius: 4px;
  padding: 0 1.4rem;
  cursor: pointer;
  height: 3rem;
  transition: all 0.2s ease-in-out;

`


const PetApp = () => {
    const dispatcher = useDispatch();

    useEffect(() => {
        petAPI.getPet()
            .then((newPet: IAPIPet) => dispatcher(petSetup(newPet)));
    }, [dispatcher])

    return (
        <>
            <Global/>
            <Link to={"/todo"}>
                <SwitchToTODO>TODO</SwitchToTODO>
            </Link>
            <AppWrapper>
                <StyledShopBar>
                    <BalanceBar>1.000.000 денег</BalanceBar>
                    <Shop/>
                </StyledShopBar>
                <PetNameStyle>Мой Мышь</PetNameStyle>
                <Visual>
                    <PetNest>
                        <StatsList/>
                    </PetNest>
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

const leFadeIn = keyframes`
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
`

const PetNameStyle = styled.div`
  font-size: 3rem;
  margin-bottom: 2rem;
  font-weight: 700;
  transition: 0.4s;

  border: none;
  outline: none;

  background: #eebbc3;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation-name: ${leFadeIn};
  animation-duration: 2s;
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
  width: 14rem;
  height: 50%;
  font-size: 1.2rem;
  text-align: left;
  position: relative;
  animation: fillBar 2.5s 1;
  transition: 0.4s;
`

const StatsList = () => {
    const [statsTimer, setStatsTimer]: [any, any] = useState();
    const {satiety, caffeine, happiness} = useSelector(selectStats);

    useEffect(() => {
        petAPI.getPet()
            .then((response) => {
                return {
                    hungerPerSec: response.data.hungerPerSec,
                    caffeinePerSec: response.data.caffeinePerSec,
                    happinessPerSec: response.data.happinessPerSec
                }
            })
            .then((stats) => setInterval(() => {
                    petReducedSatiety({amount: stats.hungerPerSec});
                    petReducedSleep({amount: stats.caffeinePerSec});
                    petReducedHappiness({amount: stats.happinessPerSec});
                    updateMood();
                    console.log(satiety, caffeine, happiness)
                }, 1000)
            )
            .then((timer) => setStatsTimer(timer));
        return () => clearInterval(statsTimer);
    }, []);

    function updateMood() {
        if (satiety < 50) {
            petChangedMood({newMood: "petHungry"})
        } else if (caffeine < 50) {
            petChangedMood({newMood: "petSleepy"});
        } else if (happiness < 50) {
            petChangedMood({newMood: "petHappy"});
        } else {
            petChangedMood({newMood: "petClassic"});
        }
    }

    return (
        <StyledStatsList>
            <StyledStatsListItem label={`Еда: ${satiety}%`}/>
            <StyledStatsListItem label={`Кофеин: ${caffeine}%`}/>
            <StyledStatsListItem label={`Позитивчик: ${happiness}%`}/>
        </StyledStatsList>
    );
};

const StyledPetNest = styled.div`
  transition: 0.4s;
  background-image: url(${(props: {mood: string}) => props.mood});
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

const PetNest = ({children}: {children?: React.ReactElement<any, any>}) => {
    const mood = useSelector(selectMood);
    console.log(mood);
    return <StyledPetNest mood={mood}>{children}</StyledPetNest>
}


export default PetApp;
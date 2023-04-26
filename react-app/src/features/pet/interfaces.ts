// Interfaces
export interface IStats {
    satiety: number,
    sleep: number,
    happiness: number,
}

export interface IPet {
    id: string,
    name: string,
    stats: IStats,
    clothes: string[],
    isSleeping: boolean
}

// Redux interfaces
export interface IPetSetup {
    type: "pet/petSetup",
    payload: IPet
}

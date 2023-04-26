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
}

// Redux interfaces
export interface IPetSetup {
    type: "pet/petSetup",
    payload: IPet
}

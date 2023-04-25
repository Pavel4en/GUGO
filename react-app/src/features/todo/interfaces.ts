export interface ITask {
    _id: string,
    coins: number,
    completed: boolean,
    description: string,
    difficulty: number,
    name: string
}

export interface ITaskComponent extends JSX.Element {
}

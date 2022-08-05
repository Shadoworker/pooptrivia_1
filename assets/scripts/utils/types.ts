export type PlayerData = {

    index:number,
    name : string,
    avatar : string,
    score : number,
    globalScore : number,
    coins:number,
    pq:number,
    progression : {
        levelIndex:number,
        roundIndex: number,
        gameIndex: number,
        bestScore: number
    }
    eliminated : boolean

}

export type GameData = {

    players : PlayerData[]
}

type Game = {
    name:string,
    played:boolean
}

type Round = {

    id:number,
    games : Game[]
}

type LevelGameStruct = {

    id:number,
    name:string,
    unlocked:boolean,
    rounds : Round[]
}

export type GameStruct = {

    levels : LevelGameStruct[]
}

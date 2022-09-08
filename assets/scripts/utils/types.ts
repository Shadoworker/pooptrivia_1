export type PlayerData = {

    index:number,
    podiumIndex:number,
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
    },
    stats:{
        pq:number,
        wrong_answers:number,
        right_answers:number,
        poop_coins:number
    },
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
    trophy:string,
    rounds : Round[]
}

export type GameStruct = {

    levels : LevelGameStruct[]
}

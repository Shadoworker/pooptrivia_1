import { playerItemSCROB } from "./utils/scrobs";
import { PlayerData } from "./utils/types";

export const OPPONENTS_ANSWERS_PROBS = [

    { name: "EASY" , baseProbaRightAnswer : 50, marginProbaRightAnswer : 20},
    { name: "MEDIUM" , baseProbaRightAnswer : 60, marginProbaRightAnswer : 20},
    { name: "HARD" , baseProbaRightAnswer : 70, marginProbaRightAnswer : 20}
]


export const TROPHIES_ACCESS = [

    { id:0, name: "NONE"   , scoreMin: 0, scoreMax:199},
    { id:1, name: "BRONZE" , scoreMin: 200, scoreMax:450},
    { id:2, name: "SILVER" , scoreMin: 451, scoreMax:600},
    { id:3, name: "GOLD"   , scoreMin: 601, scoreMax:10000000}
]


export function padWithX(n, width, z = null) 
{
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function getRandomWithWeight(items)
{
    let point = items[0].point;

    let r = Math.floor(Math.random() * (1 + 100));

    for (var i = 0; i < items.length; i++)
    {
        let proportion = items[i].power;
        
        if (r > 0 && r <= proportion)
        {
        
            point = items[i].point;
            break;
        }
        else
        {
            r = r - proportion;
        }

    }

    return point;
}

// Set Qualified (disqualified)
export function qualifyPlayers(_players : any[], _eliminatedCount : number)
{
    var sortedByScore = _players.sort((a, b) => {
        return b.score - a.score;
    });
 
    let firstEliminatedIndex = sortedByScore.findIndex(e=>e.eliminated == true);
    if(firstEliminatedIndex == -1) firstEliminatedIndex = 0;

    let eliminated = sortedByScore.filter(e=>e.eliminated == true).length;

    let totalEliminated = eliminated + _eliminatedCount;

    // Eliminated
    for (let i = (sortedByScore.length - totalEliminated); i < sortedByScore.length; i++) {
        
       sortedByScore[i].eliminated = true;
    }

    
   
    return sortedByScore;
}


export function definePlayers(_selectedPlayerData:PlayerData, _playerItemSCROBs:[playerItemSCROB], _selectedPlayer : playerItemSCROB)
{
    var newPlayers : [PlayerData] = [_selectedPlayerData];

    var _globalPlayers = [..._playerItemSCROBs];
    var shuffledPlayers = _globalPlayers.sort((a, b) => 0.5 - Math.random());
    
    var index = shuffledPlayers.indexOf(_selectedPlayer);
    shuffledPlayers.splice(index, 1);

    // Add selected player data to array

    for (let i = 0; i < 4; i++) { // 4 Opponents
        var p = shuffledPlayers[i];

        // Creating PlayerData Item and setting values from playerAvatarSCROB corresponding item
        var playerData : PlayerData = {
            index:0,
            podiumIndex:(i+1),
            name: '',
            avatar: '',
            score: 0,
            globalScore: 0,
            coins: 0,
            pq: 0,
            progression: {
                levelIndex: 0,
                roundIndex: 0,
                gameIndex: 0,
                bestScore: 0
            },
            stats:{
                pq: 0,
                wrong_answers: 0,
                right_answers: 0,
                poop_coins: 0,
            },
            level_coins : [0,0,0],
            eliminated: false
        };
        playerData.index = _playerItemSCROBs.indexOf(p);
        playerData.name = p.m_name.toString();
        // Add to array
        newPlayers.push(playerData);
    }

    
    return newPlayers;

}
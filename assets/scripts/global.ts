export const OPPONENTS_ANSWERS_PROBS = [

    { name: "EASY" , baseProbaRightAnswer : 50, marginProbaRightAnswer : 20},
    { name: "MEDIUM" , baseProbaRightAnswer : 60, marginProbaRightAnswer : 20},
    { name: "HARD" , baseProbaRightAnswer : 70, marginProbaRightAnswer : 20}
]


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

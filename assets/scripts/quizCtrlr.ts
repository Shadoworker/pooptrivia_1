import { _decorator, Component, Node, find, Label, RichText, Button } from 'cc';
import { stateManager } from './managers/stateManager';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;

@ccclass('quizCtrlr')
export class quizCtrlr extends Component {

    m_GAME_NAME = "quiz";
    m_quiz : any;

    m_lang : string = "fr";

    @property({type: Label})
    public m_questionText = null;

    @property({type: [Node]})
    public m_answerBtns = [];



    start() {

        this.m_lang = find('stateManager').getComponent(stateManager).m_gameLang.get();

        this.nextSet();
    }


    nextSet()
    {
 
        let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
        let quizData : any[]  = JSON.parse(find('stateManager').getComponent(stateManager).m_quizData.get())
        let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())
        let levelIndex = playerData.progression.levelIndex; // Used as difficulty property as well
        
        // Get Next Game
        let nextGame = gameStruct.levels[playerData.progression.levelIndex]
                                    .rounds[playerData.progression.roundIndex]
                                        .games.find((g)=>{return g.played == false}).name;


        // Is this game the nextOne or Another
        if(nextGame == this.m_GAME_NAME)
        {

            let thisLevelData = quizData.filter(q=>q.level == (levelIndex+1)); // quiz-level starts from 1 and levelIndex in type from 0.
            // Get Random One Random Question
            let r = Math.floor(Math.random() * thisLevelData.length);
    
            this.m_quiz = thisLevelData[r];
    
            // Remove selected Quiz Item from initial array and save
            quizData.splice(quizData.indexOf(this.m_quiz), 1);
            find('stateManager').getComponent(stateManager).m_quizData.set(JSON.stringify(quizData));

            // Load data
            this.initView();
    
        }
        else
        {
            console.log("WE ARE LOADING THE NEXT TYPE OF GAME(IMAGE-WORDS)")
        }


    }

    // Set UI items
    initView()
    {
        this.m_questionText.string = JSON.parse(this.m_quiz.questions)[this.m_lang];

        let answers = JSON.parse(this.m_quiz.answers)[this.m_lang];

        let shuffledAnswers = answers.sort(() => Math.random() - 0.5);

        // Setting Btns Data
        for (let i = 0; i < this.m_answerBtns.length; i++) {

            const el : Node = this.m_answerBtns[i];
            el.getComponentInChildren(Label).string = shuffledAnswers[i].answer;
            // Manage truthy....
            
        }
    }
    // update(deltaTime: number) {
        
    // }
}


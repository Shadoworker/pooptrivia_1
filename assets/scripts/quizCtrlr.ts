import { _decorator, Component, Node, find, Label, RichText, Button, Sprite, SpriteFrame, EventMouse, Color, director } from 'cc';
import { stateManager } from './managers/stateManager';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;

@ccclass('quizCtrlr')
export class quizCtrlr extends Component {

    m_GAME_NAME : string = "quiz";
    m_MISTAKES : number = 3;


    m_quiz : any;
    m_mistakes : number;
    m_lang : string = "fr";

    m_didClearRound : boolean = false;
    m_didClearLevel : boolean = false;

    @property({type: Label})
    public m_questionText = null;

    @property({type: [Node]})
    public m_answerBtns = [];

    @property({type: [SpriteFrame]})
    public m_btnTextures = [];



    start() {

        this.m_lang = find('stateManager').getComponent(stateManager).m_gameLang.get();

        this.nextSet();

    }


    nextSet()
    {

        if(this.m_didClearRound) // Goto Recap screen
        {
            
        }
        else if(this.m_didClearLevel) // Goto Recap screen : with unlock stats
        {

        }
        else
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

                // Init Basics
                this.m_mistakes = this.m_MISTAKES;
        
            }
            else
            {
                console.log("WE ARE LOADING THE NEXT TYPE OF GAME(IMAGE-WORDS)")
                let scene = nextGame + "Scene";
                director.loadScene(scene);

            }
        
        }
        


    }

    // Set UI items
    initView()
    {
        this.m_questionText.string = JSON.parse(this.m_quiz.questions)[this.m_lang];

        let answers = JSON.parse(this.m_quiz.answers)[this.m_lang];

        let shuffledAnswers = answers.sort(() => Math.random() - 0.5);

        this.m_quiz.answers = shuffledAnswers;
        // Setting Btns Data
        for (let i = 0; i < this.m_answerBtns.length; i++) {

            const el : Node = this.m_answerBtns[i];
            el.getComponent(Button).interactable = true;
            el.getComponent(Button).enabled = true;
            el.getComponent(Sprite).spriteFrame = this.m_btnTextures[0];


            el.getComponentInChildren(Label).string = this.m_quiz.answers[i].answer;
            
        }
    }

    checkAnswer(e: EventMouse, _btnIndex:number)
    {
        const delay = 1000;
        let isCorrect = this.m_quiz.answers[_btnIndex].isCorrect;
        // UI btn change
        this.setAnswerBtnColor(_btnIndex, isCorrect);

        if(isCorrect) // Correct answer : 
        {
            
            // Progress
            let _clears = find('stateManager').getComponent(stateManager).updateProgress();
            this.m_didClearRound = _clears[0];
            this.m_didClearLevel = _clears[1];
            
            // Go forward -->
            setTimeout(() => {
                this.nextSet();
            }, delay);


            // Deactivate all btns
            for (let i = 0; i < this.m_answerBtns.length; i++) {
                this.m_answerBtns[i].getComponent(Button).enabled = false;
            }

        }
        else // Wrong answer
        {
            // Has mistakes coins left
            if(this.m_mistakes > 1)
            {
                // Decrease miscoins and score base
                //...
                this.m_mistakes--;
            }
            else // No more miscoins
            {
                // Go to next game
                setTimeout(() => {
                    this.nextSet();
                }, delay);
            }
        }
        
    }


    setAnswerBtnColor(_btnIndex:number, _isCorrect:boolean)
    {
        let btnTexture = _isCorrect ? 
        this.m_btnTextures[1] : this.m_btnTextures[2];
        let thisBtn : Node = this.m_answerBtns[_btnIndex];
        thisBtn.getComponent(Button).enabled = false;
        setTimeout(() => {
            thisBtn.getComponent(Sprite).spriteFrame = btnTexture;
        }, 30);
    }

    // update(deltaTime: number) {
        
    // }
}


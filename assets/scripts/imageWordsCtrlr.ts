import { _decorator, Component, Node, find, Label, RichText, Button, Sprite, SpriteFrame, EventMouse, Color, assetManager, ImageAsset, Texture2D, director } from 'cc';
import { gameHeaderCtrlr } from './components/gameHeaderCtrlr';
import { transitionBoxCtrlr } from './components/transitionBoxCtrlr';
import { getRandomWithWeight, OPPONENTS_ANSWERS_PROBS } from './global';
import { stateManager } from './managers/stateManager';
import { TRANSITIONS } from './utils/transitions';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;

@ccclass('imageWords')
export class imageWords extends Component {

    m_GAME_NAME : string = "imageWords";
    m_MISTAKES : number = 3;
    m_BASE_SCORE : number = 50;
    m_base_score : number;

    m_quiz : any;
    m_mistakes : number;
    m_lang : string = "fr";
    m_gameIndex : number;

    m_didClearRound : boolean = false;
    m_didClearLevel : boolean = false;

    m_correctBtnIndex = 0;

    
    @property({type: Label})
    public m_questionHeader = null;
    @property({type: Sprite})
    public m_questionImage = null;

    @property({type: [Node]})
    public m_answerBtns = [];

    @property({type: [SpriteFrame]})
    public m_btnTextures = [];

    @property({type: Node})
    public m_transitionBox = null;

    @property({type: Node})
    public m_preloader : Node = null;

    start() {

        this.m_lang = find('stateManager').getComponent(stateManager).m_gameLang.get();

    }

    onEnable()
    {
        this.m_didClearRound = false;
        this.m_didClearLevel = false;

        this.nextSet();
    }


    nextSet()
    {

        if(this.m_didClearRound) // Goto Recap screen
        {
            this.m_didClearRound = false;
            find('stateManager').getComponent(stateManager).switchScene("fortuneWcScene");

        }
        else if(this.m_didClearLevel) // Goto Recap screen : with unlock stats
        {
            this.m_didClearLevel = false;
        }
        else
        {
        
    
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
            let fiowData : any[]  = JSON.parse(find('stateManager').getComponent(stateManager).m_fiowData.get())
            let fiowDataInit : any[]  = JSON.parse(find('stateManager').getComponent(stateManager).m_fiowDataInit.get())
            if(fiowData.length == 0) 
            {
                fiowData = fiowDataInit;
                find('stateManager').getComponent(stateManager).m_fiowData.set(JSON.stringify(fiowData))
            }

            let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())
            let levelIndex = playerData.progression.levelIndex; // Used as difficulty property as well
            // let levelIndex = find('stateManager').getComponent(stateManager).m_selectedDifficulty.get();

            this.m_gameIndex = playerData.progression.gameIndex; // Used as question Index as well
            
            // Get Next Game
            let nextGame = gameStruct.levels[levelIndex]
                                        .rounds[playerData.progression.roundIndex]
                                            .games.find((g)=>{return g.played == false}).name;


            // Is this game the nextOne or Another
            if(nextGame == this.m_GAME_NAME)
            {

                let thisLevelData : any[] = fiowData.filter(q=>q.level == (levelIndex+1)); // quiz-level starts from 1 and levelIndex in type from 0.
                
                if(thisLevelData.length == 0) // CHEAT : Must ensure in DB that there is enough data for each level (THIS CAUSED A BUG)
                {
                    thisLevelData = fiowData/* Init */; // Any
                }
                // Get Random One Random Question
                let r = Math.floor(Math.random() * thisLevelData.length);
        
                this.m_quiz = thisLevelData[r];
        
                // Remove selected Quiz Item from initial array and save
                fiowData.splice(fiowData.indexOf(this.m_quiz), 1);
                find('stateManager').getComponent(stateManager).m_fiowData.set(JSON.stringify(fiowData));

                // Load data
                this.initView();

                // Init Basics
                this.m_base_score = this.m_BASE_SCORE;
                this.m_mistakes = this.m_MISTAKES;
        
            }
            else
            {
                // this.m_preloader.active = true;
                // console.log("WE ARE LOADING THE NEXT TYPE OF GAME(QUIZ)")
                let scene = nextGame + "Scene";
                find('stateManager').getComponent(stateManager).switchScene(scene);

                // director.loadScene(scene);
            }
        
        }

    }

    // Set UI items
    initView()
    {

        this.m_questionHeader.string = "QUESTION "+ (this.m_gameIndex+1) + "/5"

        let imageUrl = JSON.parse(this.m_quiz.questions)[this.m_lang];

        //Toggle spinner
        this.m_questionImage.node.getChildByName("spinnerItem").active = true;

        assetManager.loadRemote(imageUrl, 
            (err:any, tex:ImageAsset)=>{
                if(err) return;

            var newTexture2D = new Texture2D();
            newTexture2D.image = tex;

            var newSpriteFrame = new SpriteFrame();
            newSpriteFrame.texture = newTexture2D;

            // set Image
            this.m_questionImage.spriteFrame = newSpriteFrame; 

            //Toggle spinner
            this.m_questionImage.node.getChildByName("spinnerItem").active = false;



        })
        // this.m_questionText.string = JSON.parse(this.m_quiz.questions)[this.m_lang];

        let answers = JSON.parse(this.m_quiz.answers)[this.m_lang];

        let shuffledAnswers = answers.sort(() => Math.random() - 0.5);

        this.m_quiz.answers = shuffledAnswers;
        // Setting Btns Data
        for (let i = 0; i < this.m_answerBtns.length; i++) {

            const el : Node = this.m_answerBtns[i];
            el.getComponent(Button).interactable = true;
            el.getComponent(Button).enabled = true;
            // el.getComponent(Sprite).spriteFrame = this.m_btnTextures[0];
            el.getComponent(Sprite).color = Color.WHITE;


            //Toggle spinner
            el.getChildByName("spinnerItem").active = false;

            el.getComponentInChildren(Label).string = this.m_quiz.answers[i].answer;

            if(this.m_quiz.answers[i].isCorrect)
                this.m_correctBtnIndex = i;
            
        }
    }


    usePqHint()
    {
        let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())

        if(playerData.pq == 0) return;

        playerData.pq -= 1;

        let btnCounter = 0;
        for (let i = 0; i < this.m_answerBtns.length; i++) 
        {
            const btnEl : Node = this.m_answerBtns[i];
            if(btnEl.getComponent(Button).enabled == false)
                btnCounter++;
        }

        if(btnCounter >= 2) return;
        
        let counter = 0;
        for (let i = 0; i < this.m_quiz.answers.length; i++) {
            const el = this.m_quiz.answers[i];

            if(!el.isCorrect)
            {
                const btnEl : Node = this.m_answerBtns[i];

                btnEl.getComponent(Button).interactable = false;
                btnEl.getComponent(Button).enabled = false;
                // btnEl.getComponent(Sprite).spriteFrame = this.m_btnTextures[0];
                btnEl.getComponent(Sprite).color = Color.RED;

                
                counter++;
            }

            if(counter == 2) break;
            
            
        }

        // Save
        find('stateManager').getComponent(stateManager).m_playerData.set(JSON.stringify(playerData));

        this.node.getChildByName("gameHeader").getComponent(gameHeaderCtrlr).setPqPoints();

    }


    checkAnswer(e: EventMouse, _btnIndex:number)
    {

        find('stateManager').getComponent(stateManager).playBtnSound();

        const delay = 1000;
        let isCorrect = this.m_quiz.answers[_btnIndex].isCorrect;
        // UI btn change
        this.setAnswerBtnColor(_btnIndex, isCorrect);

        if(isCorrect) // Correct answer : 
        {
 
            // Display transition message
            var messages = TRANSITIONS[this.m_lang].answers.correct;
            var mess = messages[Math.floor(Math.random() * messages.length)]

            this.m_transitionBox.getComponent(transitionBoxCtrlr).setItem("Small", mess, "happy", true);
            
            
            // Progress
            let _clears = find('stateManager').getComponent(stateManager).updateProgress(this.m_base_score);
            this.m_didClearRound = _clears[0];
            this.m_didClearLevel = _clears[1];
            // Go forward -->
            setTimeout(() => {
                this.nextSet();
            }, delay);


            // Deactivate all btns
            for (let i = 0; i < this.m_answerBtns.length; i++) {
                this.m_answerBtns[i].getComponent(Button).enabled = false;
                //Toggle spinner
                this.m_answerBtns[i].getChildByName("spinnerItem").active = false;
            }

        }
        else // Wrong answer
        {
 
            // Display transition message
            var messages = TRANSITIONS[this.m_lang].answers.wrong;
            var mess = messages[Math.floor(Math.random() * messages.length)]

            this.m_transitionBox.getComponent(transitionBoxCtrlr).setItem("Small", mess, "sad", true);
            
            // Has mistakes coins left
            if(this.m_mistakes > 1)
            {
                // Decrease miscoins and score base
                //...
                this.m_mistakes--;
                this.m_base_score -= 10//(5*this.m_mistakes); // init 3 : 5*2=10; 5*1=5
            }
            else // No more miscoins
            {

                // set correct one
                setTimeout(() => {
                    this.setAnswerBtnColor(this.m_correctBtnIndex, true);
                }, 300);

                 // Progress
                let _clears = find('stateManager').getComponent(stateManager).updateProgress(this.m_base_score, false);
                this.m_didClearRound = _clears[0];
                this.m_didClearLevel = _clears[1];

                // Go to next game
                setTimeout(() => {
                    this.nextSet();
                }, delay);
            }
        }


        
        // Simulate opps scores
        this.simulateOpponentsScores(this.m_base_score);
        
    }

    simulateOpponentsScores(_playerScore)
    {

        let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
        
        let _playersListData : [PlayerData] = JSON.parse(find('stateManager').getComponent(stateManager).m_playersListData.get())
        let playersListData = [..._playersListData]

        // let levelIndex = find('stateManager').getComponent(stateManager).m_selectedDifficulty.get();
        let levelIndex =  playerData.progression.levelIndex;
        
        let modeBaseProba = OPPONENTS_ANSWERS_PROBS[levelIndex].baseProbaRightAnswer;
        let modeMarginProba = OPPONENTS_ANSWERS_PROBS[levelIndex].marginProbaRightAnswer;
        let randomBaseMax = modeMarginProba / 5 + 1; 
        

        let indexAmongPlayers = playersListData.findIndex(e=>e.index == playerData.index);

        playersListData[indexAmongPlayers].score += _playerScore;

        for (let i = 0; i < playersListData.length; i++) {
            
            if(i != indexAmongPlayers && !playersListData[i].eliminated)
            {
                var signs = [1, -1];
                var signIndex = Math.floor(Math.random() * (1 + 1));
                var sign = signs[signIndex];
    
                let margin = Math.floor(Math.random()*randomBaseMax)*5;
                margin = margin * sign;
                let rightAnswerProba = modeBaseProba + margin;
                let wrongAnswerProba = 100 - rightAnswerProba;
    
                var points = [{point : 1, power : rightAnswerProba}, {point : 0, power : wrongAnswerProba}];
                points = points.sort((a, b) => 0.5 - Math.random());

                var p = getRandomWithWeight(points);
                playersListData[i].score = playersListData[i].score +( p * 10);
            }
        }


        // Update data
        find('stateManager').getComponent(stateManager).m_playersListData.set(JSON.stringify(playersListData))

        //console.log(playersListData)

    }


    setAnswerBtnColor(_btnIndex:number, _isCorrect:boolean)
    {
        let btnTexture = _isCorrect ? 
        // this.m_btnTextures[1] : this.m_btnTextures[2];
        Color.GREEN : Color.RED;
        let thisBtn : Node = this.m_answerBtns[_btnIndex];
        thisBtn.getComponent(Button).enabled = false;
        setTimeout(() => {
            // thisBtn.getComponent(Sprite).spriteFrame = btnTexture;
            
            thisBtn.getComponent(Sprite).color = btnTexture;

            if(_isCorrect)
            {
                // find('stateManager').getComponent(stateManager).playSuccessSound();
            }
            else
            {
                // find('stateManager').getComponent(stateManager).playErrorSound();
            }
            
        }, 50);
    }

    // update(deltaTime: number) {
        
    // }
}


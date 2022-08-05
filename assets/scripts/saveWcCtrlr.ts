import { _decorator, Component, Node, find, Label, RichText, Button, Sprite, SpriteFrame, EventMouse, Color, director, Prefab, instantiate, EventHandler } from 'cc';
import { stateManager } from './managers/stateManager';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;

@ccclass('saveWcCtrlr')
export class saveWcCtrlr extends Component {

    m_GAME_NAME : string = "saveWc";
    m_MISTAKES : number = 3;
    m_BASE_SCORE : number = 20;
    m_base_score : number;

    m_ALPHABET = 
    ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

    m_quiz : any;
    m_mistakes : number;
    m_lang : string = "fr";
    m_gameIndex : number;

    m_didClearRound : boolean = false;
    m_didClearLevel : boolean = false;

    m_word:string;
    m_letters:string[];
    m_lettersToFind:string[];

    @property({type: Label})
    public m_questionHeader = null;
    @property({type: Label})
    public m_questionText = null;

    
    @property({type: Node})
    public m_keyboard = null;
    @property({type: Node})
    public m_slotsContainer = null;
    @property({type: Prefab})
    public m_letterBtn = null;
    @property({type: Prefab})
    public m_letterSlot = null;


    @property({type: [Node]})
    public m_answerBtns = [];

    @property({type: [SpriteFrame]})
    public m_btnTextures = [];



    start() {

        this.m_lang = find('stateManager').getComponent(stateManager).m_gameLang.get();


        this.nextSet();

    }

    initKeyboard()
    {
        
        // Destroy previous
        this.m_keyboard.destroyAllChildren()

        for (let i = 0; i < this.m_ALPHABET.length; i++) {
            const el = this.m_ALPHABET[i];

            let letterBtn : Button = instantiate(this.m_letterBtn);
 
            letterBtn.getComponentInChildren(Label).string = el;
            // letterBtn.clickEvents[0].
            this.m_keyboard.addChild(letterBtn);
            
        }
    }

    initAnswer(_word: string, _difficulty : number = 1)
    {
        this.m_word = _word;

        this.m_letters = this.m_word.split('');
        this.m_lettersToFind = [];

        // Get number of hidden letters
        let hiddenLength = this.getHiddenLength(_word.length, _difficulty);
        // Set max errors
        this.m_MISTAKES = hiddenLength;
        this.m_mistakes = hiddenLength;

        let randomLetterIndexes : number[] = this.getRandomIndexes(_word.length, hiddenLength);

        // Destroy previous
        this.m_slotsContainer.destroyAllChildren()

        for (let i = 0; i < this.m_letters.length; i++) {

            const el = this.m_letters[i];

            let letterSlot : Node = instantiate(this.m_letterSlot);
 
            letterSlot.getComponentInChildren(Label).string = el;
            if(randomLetterIndexes.indexOf(i) != -1) // Included in
            {
                // Hide letter
                letterSlot.getComponentInChildren(Label).enabled = false;

                // Define missings
                this.m_lettersToFind.push(el);
            }


            // letterSlot.clickEvents[0].
            this.m_slotsContainer.addChild(letterSlot);
            
        }

    }

    getHiddenLength(_wordLength: number, _level:number)
    {
        let x = 4 - _level;

        let a = _wordLength / x + 1;

        return a;

    }

    getRandomIndexes(_wordLength: number, _hiddenLength:number)
    {
        let indexes = [];
        for (let i = 0; i < _hiddenLength; i++) {
            
            let r = Math.floor(Math.random() * _wordLength);
            if(indexes.indexOf(r) == - 1)
                indexes.push(r);
        }

        return indexes;
    }

    nextSet()
    {

        if(this.m_didClearRound) // Goto Recap screen
        {
            director.loadScene('recapScene');
        }
        else if(this.m_didClearLevel) // Goto Recap screen : with unlock stats
        {

        }
        else
        {
    
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
            let saveWcData : any[]  = JSON.parse(find('stateManager').getComponent(stateManager).m_saveWcData.get())
            let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())
            let levelIndex = playerData.progression.levelIndex; // Used as difficulty property as well
            this.m_gameIndex = playerData.progression.gameIndex; // Used as question Index as well
            
            // Get Next Game
            let nextGame = gameStruct.levels[playerData.progression.levelIndex]
                                        .rounds[playerData.progression.roundIndex]
                                            .games.find((g)=>{return g.played == false}).name;
    
            // Is this game the nextOne or Another
            if(nextGame == this.m_GAME_NAME)
            {

                console.log(saveWcData)
                let thisLevelData = saveWcData.filter(q=>q.level == (levelIndex+1)); // quiz-level starts from 1 and levelIndex in type from 0.
                // Get Random One Random Question
                let r = Math.floor(Math.random() * thisLevelData.length);
        
                this.m_quiz = thisLevelData[r];
        
                // Remove selected Quiz Item from initial array and save
                saveWcData.splice(saveWcData.indexOf(this.m_quiz), 1);
                find('stateManager').getComponent(stateManager).m_saveWcData.set(JSON.stringify(saveWcData));

                // Load data
                this.initView();

                // Init Basics
                this.m_base_score = this.m_BASE_SCORE;
                this.m_mistakes = this.m_MISTAKES;
        
            }
            else
            {
                console.log("WE ARE LOADING THE NEXT TYPE OF GAME(any)")
                let scene = nextGame + "Scene";
                director.loadScene(scene);

            }
        
        }
        


    }

    // Set UI items
    initView()
    {

        this.m_questionHeader.string = "QUESTION "+ (this.m_gameIndex+1) + "/4"

        this.initKeyboard();

        this.m_questionText.string = this.m_quiz.questions[this.m_lang];
        let answer = this.m_quiz.answers[this.m_lang];
        
        console.log(answer)
        this.initAnswer(answer, this.m_quiz.level)

   
    }

    onClickLetter(_letter : string)
    {
        const delay = 1000;

        // Check if among correct letters
        let isCorrect = this.m_lettersToFind.indexOf(_letter) != -1 ? true : false;
        let amongWord = this.m_letters.indexOf(_letter) != -1 ? true : false;

        // Update slots
        for (let i = 0; i < this.m_slotsContainer.children.length; i++) {

            const el = this.m_slotsContainer.children[i];

            if(el.getComponentInChildren(Label).string == _letter)
            {
                el.getComponentInChildren(Label).enabled = true;
            }
 
        }

        if(isCorrect)
        {
            // Remove from to find
            this.m_lettersToFind.splice(this.m_lettersToFind.indexOf(_letter), 1);
            console.log(this.m_lettersToFind)
            if(this.m_lettersToFind.length == 0)
            {
                // Completed 
                console.log("COMPLETED");
                    // Progress
                let _clears = find('stateManager').getComponent(stateManager).updateProgress(this.m_base_score);
                this.m_didClearRound = _clears[0];
                this.m_didClearLevel = _clears[1];
                
                // Go forward -->
                setTimeout(() => {
                    this.nextSet();
                }, delay);

            }
        }
        else // Not correct letter (decrease mistake coins)
        {
            if(!amongWord)
            {
                if(this.m_mistakes > 1)
                {
                    // Decrease miscoins and score base
                    //...
                    this.m_mistakes--;
                    let baseReduc = Math.floor(this.m_BASE_SCORE / this.m_MISTAKES)
                    this.m_base_score -= (baseReduc*this.m_mistakes); // init 3 : 5*2=10; 5*1=5
                }
                else // No more miscoins
                {

                    // FAILED
                    let _clears = find('stateManager').getComponent(stateManager).updateProgress(this.m_base_score);
                    this.m_didClearRound = _clears[0];
                    this.m_didClearLevel = _clears[1];

                    // Go to next game
                    setTimeout(() => {
                        this.nextSet();
                    }, delay);
                }
            }

        }



        return [isCorrect, amongWord];
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
                let baseReduc = Math.floor(this.m_BASE_SCORE/ this.m_MISTAKES)
                this.m_base_score -= (5*this.m_mistakes); // init 3 : 5*2=10; 5*1=5
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
        // this.m_btnTextures[1] : this.m_btnTextures[2];
        Color.GREEN : Color.RED;
        let thisBtn : Node = this.m_answerBtns[_btnIndex];
        thisBtn.getComponent(Button).enabled = false;
        setTimeout(() => {
            // thisBtn.getComponent(Sprite).spriteFrame = btnTexture;
            thisBtn.getComponent(Sprite).color = btnTexture;
        }, 30);
    }

    // update(deltaTime: number) {
        
    // }
}


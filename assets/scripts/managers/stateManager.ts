import { _decorator, Component, Node, find, game } from 'cc';
import { Kayfo } from '../utils/persistentMember';
import { Singleton } from '../utils/singleton';
import { PlayerData } from '../utils/types';
import { dataLoader } from './dataLoader';
const { ccclass, property } = _decorator;


@ccclass('stateManager')
export class stateManager extends Component {

    public m_gameLang = new Kayfo.PersistentString('m_persistentGameLang', 'fr');


    public m_gameStruct = new Kayfo.PersistentString('m_persistentGameStruct', '');
    public m_quizData = new Kayfo.PersistentString('m_persistentQuizData', '');
    public m_fiowData = new Kayfo.PersistentString('m_persistentFiowData', '');

    // selected levelIndex (0=EASY, 1=MEDIUM, 2=)
    // public m_currentLevelIndex = new Kayfo.PersistentNum('m_persistentCurrentLevelIndex', 0);
    
    public m_playerData = new Kayfo.PersistentString('m_persistentPlayerData', '');

    
    onLoad()
    {
        this.m_gameLang.set(navigator.language.substring(0,2));
        
        game.addPersistRootNode(this.node);
    }

    start() {

       
        if(find('dataLoader') != null)
        {      
            let persistentDataLoader = find('dataLoader').getComponent(dataLoader);
            console.log(persistentDataLoader.m_quizData);
    
            // console.log(dataLoader.getInstance().m_quizData)
            if(persistentDataLoader.m_gameStruct != null)
                this.m_gameStruct.set(JSON.stringify(persistentDataLoader.m_gameStruct))

            if(persistentDataLoader.m_quizData != null)
                this.m_quizData.set(JSON.stringify(persistentDataLoader.m_quizData))

            if(persistentDataLoader.m_fiowData != null)
                this.m_fiowData.set(JSON.stringify(persistentDataLoader.m_fiowData))

            // console.log(this.m_fiowData.get());
        }
        else
        {
            console.log("No dataLoader !")
            // console.log(JSON.parse(this.m_fiowData.get()));

        }

    
        // For Test : Normally called by selectPlayer screen
        let p: PlayerData = {
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
            }
        };
        this.setPlayerData(p)

    }

    setPlayerData(_playerData : PlayerData)
    {
        // For Test
        if(_playerData.name == "")
            _playerData = { ..._playerData,
                name : "Moussa"
            }

        
        this.m_playerData.set(JSON.stringify(_playerData));
    }


    // update(deltaTime: number) {
        
    // }
}


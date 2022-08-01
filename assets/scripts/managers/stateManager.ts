import { _decorator, Component, Node, find } from 'cc';
import { Kayfo } from '../utils/persistentMember';
import { Singleton } from '../utils/singleton';
import { dataLoader } from './dataLoader';
const { ccclass, property } = _decorator;

type PlayerData = {

    name : string,
    avatar : string,
    score : number,
    globalScore : number,
    coins:number,
    pq:number,
    progression : {
        roundIndex: number,
        gameIndex: number
    }

}

@ccclass('stateManager')
export class stateManager extends Component {

    public m_gameStruct = new Kayfo.PersistentString('m_persistentGameStruct', '');
    public m_quizData = new Kayfo.PersistentString('m_persistentQuizData', '');
    public m_fiowData = new Kayfo.PersistentString('m_persistentFiowData', '');

    public m_playerData = new Kayfo.PersistentString('m_persistentPlayerData', '');



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

    

    }

    // update(deltaTime: number) {
        
    // }
}


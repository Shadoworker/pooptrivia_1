import { _decorator, Component, Node, TextAsset, resources, JsonAsset, director, game, sys, SceneGlobals } from 'cc';
import { Kayfo } from '../utils/persistentMember';
import { DataManager} from '../utils/dataManager';
import { Singleton } from '../utils/singleton';
import { stateManager } from './stateManager';
const { ccclass, property } = _decorator;

@ccclass('dataLoader')
export class dataLoader extends Component {


    private m_baseUrl = 'https://app-cf6d19ba-6849-4172-ad9e-0423ded407d4.cleverapps.io';
 
    @property({type: Object})
    public m_gameStruct = null;

    public m_quizData = null;
    public m_fiowData = null;

    onLoad()
    {
        game.addPersistRootNode(this.node);
    }

    start() {

        // if(sys.localStorage.getItem("_dataLoaded"))
        {
        
            this.getQuizData();
            this.getFiowData();
            // Loading the structure of the game : Levels
            this.loadGameStruct();
            // ...


            // Got Home
            setTimeout(() => {
                director.loadScene("homeScene");
            }, 500);
    
        }


        // setInterval(() => {
        //     console.log("I am here : " + new Date().toLocaleString());
        // }, 3000);

    }

   
    getQuizData()
    {
        fetch(this.m_baseUrl+'/quizzes')
        .then(response => response.json())
        .then(data => {
            // console.log(data) // Prints result from `response.json()` in getRequest
            this.m_quizData = data;
        })
        .catch(error => console.error(error))
    }

    getFiowData()
    {
        fetch(this.m_baseUrl+'/fiows')
        .then(response => response.json())
        .then(data => {
            // console.log(data) // Prints result from `response.json()` in getRequest
            this.m_fiowData = data;
        })
        .catch(error => console.error(error))
    }

    loadGameStruct(){
        
        resources.load<JsonAsset>('gameStruct', (err, data)=> {

            this.m_gameStruct = data.json;

        });
    }



    // update(deltaTime: number) {
        
    // }
}



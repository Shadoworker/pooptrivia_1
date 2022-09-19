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
    public m_saveWcData = null;
    public m_sanitizeData = null;

    onLoad()
    {
        if(!this.node._persistNode)
            game.addPersistRootNode(this.node);
    }

    start() {

        if(localStorage.getItem("_dataLoaded") != "true")
        {
        
            this.getQuizData();
            this.getFiowData();
            this.getSaveWcData();

            this.getSanitizeData();
            // Loading the structure of the game : Levels
            this.loadGameStruct();
            // ...

            localStorage.setItem("_dataLoaded", "true")
        }

        // Go to Home
        setTimeout(() => {
            director.loadScene("homeScene");
        }, 1500);
    


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

    getSaveWcData()
    {
        this.m_saveWcData =
        [
            {
                "id": 1,
                "questions": {
                    "en": "Word to find : CAR",
                    "fr": "Mot à trouver : VOITURE"
                },
                "answers": {
                    "en": "CAR",
                    "fr": "VOITURE"
                },
                "level": 1,
                "active": true,
            },
            {
                "id": 2,
                "questions": {
                    "en": "Word to find : HOME",
                    "fr": "Mot à trouver : MAISON"
                },
                "answers": {
                    "en": "HOME",
                    "fr": "MAISON"
                },
                "level": 1,
                "active": true,
            },
            {
                "id": 3,
                "questions": {
                    "en": "Word to find : NECK",
                    "fr": "Mot à trouver : COU"
                },
                "answers": {
                    "en": "NECK",
                    "fr": "COU"
                },
                "level": 1,
                "active": true,
            },
            {
                "id": 4,
                "questions": {
                    "en": "Word to find : BEE",
                    "fr": "Mot à trouver : ABEILLE"
                },
                "answers": {
                    "en": "BEE",
                    "fr": "ABEILLE"
                },
                "level": 2,
                "active": true,
            },
            {
                "id": 5,
                "questions": {
                    "en": "Word to find : WORDUS",
                    "fr": "Mot à trouver : MOTUS"
                },
                "answers": {
                    "en": "WORDUS",
                    "fr": "MOTUS"
                },
                "level": 2,
                "active": true,
            },
            {
                "id": 6,
                "questions": {
                    "en": "Word to find : TITLE",
                    "fr": "Mot à trouver : TITRE"
                },
                "answers": {
                    "en": "TITLE",
                    "fr": "TITRE"
                },
                "level": 3,
                "active": true,
            },
            {
                "id": 7,
                "questions": {
                    "en": "Word to find : LONDON",
                    "fr": "Mot à trouver : LONDRES"
                },
                "answers": {
                    "en": "LONDON",
                    "fr": "LONDRES"
                },
                "level": 1,
                "active": true,
            },
            {
                "id": 8,
                "questions": {
                    "en": "Word to find : BIRD",
                    "fr": "Mot à trouver : OISEAU"
                },
                "answers": {
                    "en": "BIRD",
                    "fr": "OISEAU"
                },
                "level": 3,
                "active": true,
            },
            {
                "id": 9,
                "questions": {
                    "en": "Word to find : YELLOW",
                    "fr": "Mot à trouver : JAUNE"
                },
                "answers": {
                    "en": "YELLOW",
                    "fr": "JAUNE"
                },
                "level": 3,
                "active": true,
            },
            {
                "id": 10,
                "questions": {
                    "en": "Word to find : GREEN",
                    "fr": "Mot à trouver : VERT"
                },
                "answers": {
                    "en": "GREEN",
                    "fr": "VERT"
                },
                "level": 2,
                "active": true,
            },
            {
                "id": 11,
                "questions": {
                    "en": "Word to find : RED",
                    "fr": "Mot à trouver : ROUGE"
                },
                "answers": {
                    "en": "RED",
                    "fr": "ROUGE"
                },
                "level": 2,
                "active": true,
            }
            ,
            {
                "id": 12,
                "questions": {
                    "en": "Word to find : BLUE",
                    "fr": "Mot à trouver : BLEU"
                },
                "answers": {
                    "en": "BLUE",
                    "fr": "BLEU"
                },
                "level": 2,
                "active": true,
            }
            ,
            {
                "id": 13,
                "questions": {
                    "en": "Word to find : YELLOW",
                    "fr": "Mot à trouver : JAUNE"
                },
                "answers": {
                    "en": "YELLOW",
                    "fr": "JAUNE"
                },
                "level": 2,
                "active": true,
            }
            ,
            {
                "id": 14,
                "questions": {
                    "en": "Word to find : ORANGE",
                    "fr": "Mot à trouver : ORANGE"
                },
                "answers": {
                    "en": "ORANGE",
                    "fr": "ORANGE"
                },
                "level": 2,
                "active": true,
            }
            ,
            {
                "id": 15,
                "questions": {
                    "en": "Word to find : ROUND",
                    "fr": "Mot à trouver : ROND"
                },
                "answers": {
                    "en": "ROUND",
                    "fr": "ROND"
                },
                "level": 2,
                "active": true,
            }
        ]
 
    }


    getSanitizeData()
    {
        this.m_sanitizeData =
        {
            "env": [],
            "bio": [],
            "building": []
        }
 
    }



    loadGameStruct(){
        
        resources.load<JsonAsset>('gameStruct', (err, data)=> {

            this.m_gameStruct = data.json;
            console.log(this.m_gameStruct);
        });
    }



    // update(deltaTime: number) {
        
    // }
}



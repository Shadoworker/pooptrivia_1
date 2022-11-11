import { _decorator, Component, Node, TextAsset, resources, JsonAsset, director, game, sys, SceneGlobals, assetManager, find } from 'cc';
import { Kayfo } from '../utils/persistentMember';
import { DataManager} from '../utils/dataManager';
import { Singleton } from '../utils/singleton';
import { stateManager } from './stateManager';
const { ccclass, property } = _decorator;

import * as XLSX from 'xlsx/xlsx.mjs';

@ccclass('dataLoader')
export class dataLoader extends Component {


    private m_baseUrl = 'https://app-cf6d19ba-6849-4172-ad9e-0423ded407d4.cleverapps.io';
 
    @property({type: Object})
    public m_gameStruct = null;

    public m_quizData = null;
    public m_fiowData = null;
    public m_saveWcData = null;
    public m_sanitizeData = null;

    public m_quiz_excel_url ="https://docs.google.com/spreadsheets/d/e/2PACX-1vRSAQaTABwKtg-UXX8VOpsa80R5Re8d1dNF2glniiY1SQ3y7NzN7CLS19nSGDjeMxEzhhr7P6zYhAbI/pubhtml";
    
    public m_savewc_excel_url ="https://docs.google.com/spreadsheets/d/e/2PACX-1vSICo7dgg828X8HuaFjRZ9T2w_0E9p_9DGEFUVV-TNgsKta2hFtRwlYmj6OkNppI4XOiA37FvW946ZL/pubhtml";

    public m_dataCounter = 0;

    onLoad()
    {
        if(!this.node._persistNode)
            game.addPersistRootNode(this.node);
    }

    start() {

        if(localStorage.getItem("_dataLoaded") != "true")
        {
           // Loading the structure of the game : Levels
            this.loadGameStruct();

            this.getQuizData();
            this.getFiowData();
            this.getSaveWcData();

            this.getSanitizeData();
         
            // ...

        }
        else
        {
             // Go to Home
             setTimeout(() => {
                find('stateManager').getComponent(stateManager).switchScene("homeScene");
            }, 150);
        }


        if(find('stateManager').getComponent(stateManager).m_playerData.get() != '')
        {
            // Go to Home
            setTimeout(() => {
                find('stateManager').getComponent(stateManager).switchScene("homeScene");
            }, 150);
        
        }
       



        // setInterval(() => {
        //     console.log("I am here : " + new Date().toLocaleString());
        // }, 3000);

    }

 
    getExcelData(_index :any, _url : string)
    {
        let _self = this;

        fetch(_url).then(function (res) {
            /* get the data as a Blob */
            if (!res.ok) throw new Error("fetch failed");
            return res.arrayBuffer();
        })
        .then(function (ab) {
            /* parse the data when it is received */
            var data = new Uint8Array(ab);
            var workbook = XLSX.read(data, {
                type: "array"
            });
        
            /* *****************************************************************
            * DO SOMETHING WITH workbook: Converting Excel value to Json       *
            ********************************************************************/
            var first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];
            
            var _JsonData = XLSX.utils.sheet_to_json(worksheet, {raw: true});
            /************************ End of conversion ************************/
            // console.log(_JsonData);
            // FORMAT
            _JsonData.forEach((el ,_i)=> {
                
                let _quests = _JsonData[_i].questions.split("\\"); // Later split languages by "\"
                let _answs = _JsonData[_i].answers.split("\\"); // Later split languages by "\"
                _JsonData[_i].questions = {"fr" : "", "en" : ""};
                _JsonData[_i].answers = {"fr" : [], "en" : []};

                _JsonData[_i].questions["fr"] = _quests[0].replaceAll("&#39;", "'"); 
                // _JsonData[_i].questions["en"] = _quests[1].replaceAll("&#39;", "'"); 

                let frAnswers = _answs[0].split("\n").filter(e=>e);
                // let enAnswers = _answs[1].split("\n").filter(e=>e);

                frAnswers.forEach((_a , _j)=> {
                    let _answer = {answer : _a.split("&#39;").join("'"), isCorrect : _j == 0};
                    frAnswers[_j] = _answer;
                });

                // enAnswers.forEach((_a , _j)=> {
                //     let _answer = {answer : _a.split("&#39;").join("'"), isCorrect : _j == 0};
                //     enAnswers[_j] = _answer;
                // });

                _JsonData[_i].answers["fr"] = frAnswers;
                // _JsonData[_i].answers["en"] = enAnswers;

            });

            switch (_index) {
                case 0:
                    _self.m_quizData = _JsonData;
                    break;
                
                case 1:
                    _self.m_fiowData = _JsonData;
                    break;
                
                case 2:
                    _self.m_saveWcData = _JsonData;
                    break;
        
            }

            _self.m_dataCounter++;

            if(_self.m_dataCounter == 2)
            {
    
                localStorage.setItem("_dataLoaded", "true")

                // Go to Onboard
                setTimeout(() => {

                    find('stateManager').getComponent(stateManager).initialize();

                    find('stateManager').getComponent(stateManager).switchScene("onboardScene");

                }, 150);
            }

        });

    }

   
    getQuizData()
    {
        this.getExcelData(0, this.m_quiz_excel_url);
    }   


    getFiowData()
    {
     
    }

    getSaveWcData()
    {
        this.getExcelData(2, this.m_savewc_excel_url);

        // this.m_saveWcData =
        // [
        //     {
        //         "id": 1,
        //         "questions": {
        //             "en": "Word to find : CAR",
        //             "fr": "Mot à trouver : VOITURE"
        //         },
        //         "answers": {
        //             "en": "CAR",
        //             "fr": "VOITURE"
        //         },
        //         "level": 1,
        //         "active": true,
        //     },
        //     {
        //         "id": 2,
        //         "questions": {
        //             "en": "Word to find : HOME",
        //             "fr": "Mot à trouver : MAISON"
        //         },
        //         "answers": {
        //             "en": "HOME",
        //             "fr": "MAISON"
        //         },
        //         "level": 1,
        //         "active": true,
        //     },
        //     {
        //         "id": 3,
        //         "questions": {
        //             "en": "Word to find : NECK",
        //             "fr": "Mot à trouver : COU"
        //         },
        //         "answers": {
        //             "en": "NECK",
        //             "fr": "COU"
        //         },
        //         "level": 1,
        //         "active": true,
        //     },
        //     {
        //         "id": 4,
        //         "questions": {
        //             "en": "Word to find : BEE",
        //             "fr": "Mot à trouver : ABEILLE"
        //         },
        //         "answers": {
        //             "en": "BEE",
        //             "fr": "ABEILLE"
        //         },
        //         "level": 2,
        //         "active": true,
        //     },
        //     {
        //         "id": 5,
        //         "questions": {
        //             "en": "Word to find : WORDUS",
        //             "fr": "Mot à trouver : MOTUS"
        //         },
        //         "answers": {
        //             "en": "WORDUS",
        //             "fr": "MOTUS"
        //         },
        //         "level": 2,
        //         "active": true,
        //     },
        //     {
        //         "id": 6,
        //         "questions": {
        //             "en": "Word to find : TITLE",
        //             "fr": "Mot à trouver : TITRE"
        //         },
        //         "answers": {
        //             "en": "TITLE",
        //             "fr": "TITRE"
        //         },
        //         "level": 3,
        //         "active": true,
        //     },
        //     {
        //         "id": 7,
        //         "questions": {
        //             "en": "Word to find : LONDON",
        //             "fr": "Mot à trouver : LONDRES"
        //         },
        //         "answers": {
        //             "en": "LONDON",
        //             "fr": "LONDRES"
        //         },
        //         "level": 1,
        //         "active": true,
        //     },
        //     {
        //         "id": 8,
        //         "questions": {
        //             "en": "Word to find : BIRD",
        //             "fr": "Mot à trouver : OISEAU"
        //         },
        //         "answers": {
        //             "en": "BIRD",
        //             "fr": "OISEAU"
        //         },
        //         "level": 3,
        //         "active": true,
        //     },
        //     {
        //         "id": 9,
        //         "questions": {
        //             "en": "Word to find : YELLOW",
        //             "fr": "Mot à trouver : JAUNE"
        //         },
        //         "answers": {
        //             "en": "YELLOW",
        //             "fr": "JAUNE"
        //         },
        //         "level": 3,
        //         "active": true,
        //     },
        //     {
        //         "id": 10,
        //         "questions": {
        //             "en": "Word to find : GREEN",
        //             "fr": "Mot à trouver : VERT"
        //         },
        //         "answers": {
        //             "en": "GREEN",
        //             "fr": "VERT"
        //         },
        //         "level": 2,
        //         "active": true,
        //     },
        //     {
        //         "id": 11,
        //         "questions": {
        //             "en": "Word to find : RED",
        //             "fr": "Mot à trouver : ROUGE"
        //         },
        //         "answers": {
        //             "en": "RED",
        //             "fr": "ROUGE"
        //         },
        //         "level": 2,
        //         "active": true,
        //     }
        //     ,
        //     {
        //         "id": 12,
        //         "questions": {
        //             "en": "Word to find : BLUE",
        //             "fr": "Mot à trouver : BLEU"
        //         },
        //         "answers": {
        //             "en": "BLUE",
        //             "fr": "BLEU"
        //         },
        //         "level": 2,
        //         "active": true,
        //     }
        //     ,
        //     {
        //         "id": 13,
        //         "questions": {
        //             "en": "Word to find : YELLOW",
        //             "fr": "Mot à trouver : JAUNE"
        //         },
        //         "answers": {
        //             "en": "YELLOW",
        //             "fr": "JAUNE"
        //         },
        //         "level": 2,
        //         "active": true,
        //     }
        //     ,
        //     {
        //         "id": 14,
        //         "questions": {
        //             "en": "Word to find : ORANGE",
        //             "fr": "Mot à trouver : ORANGE"
        //         },
        //         "answers": {
        //             "en": "ORANGE",
        //             "fr": "ORANGE"
        //         },
        //         "level": 2,
        //         "active": true,
        //     }
        //     ,
        //     {
        //         "id": 15,
        //         "questions": {
        //             "en": "Word to find : ROUND",
        //             "fr": "Mot à trouver : ROND"
        //         },
        //         "answers": {
        //             "en": "ROUND",
        //             "fr": "ROND"
        //         },
        //         "level": 2,
        //         "active": true,
        //     }
        // ]
 
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



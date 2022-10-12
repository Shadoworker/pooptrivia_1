import { _decorator, Component, Node, find, Sprite, Label, Button, director } from 'cc';
import { gameHeaderCtrlr } from './components/gameHeaderCtrlr';
import { stateManager } from './managers/stateManager';
import { PlayerData } from './utils/types';

const { ccclass, property } = _decorator;

@ccclass('sanitizeCtrlr')
export class sanitizeCtrlr extends Component {



    @property ({type : Node})
    public m_gameHeader = null;


    @property ({type : Node})
    public m_menuBox = null;
    @property ({type : Node})
    public m_plusBtn = null;

    // Bg Visuals
    @property ({type : [Node]})
    public m_envSets = [];
    @property ({type : [Node]})
    public m_bioSets = [];
    @property ({type : [Node]})
    public m_buildingSets = [];

    // Resources 
    @property ({type : Node})
    public m_envResourceItem = null;
    @property ({type : Node})
    public m_bioResourceItem = null;
    @property ({type : Node})
    public m_buildingResourceItem = null;

    @property ({type : Sprite})
    public m_progressSlider = null;

    @property ({type : Label})
    public m_progressText = null;    




    public m_playerData = null;


    @property ({type : Boolean})
    public m_onTest = false;


    onLoad()
    {
        if(this.m_onTest)
        {
          let p = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
          p.coins = 3000;
          find('stateManager').getComponent(stateManager).m_playerData.set(JSON.stringify(p));
        }
    }

    start() {

            
        this.m_playerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())

        this.setupVisuals();

    }

    goBack()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        director.loadScene("homeScene");
    }

    setupVisuals()
    {
        // Get sanitizeData
        let _sanitizeData : any = JSON.parse(find('stateManager').getComponent(stateManager).m_sanitizeData.get())

        // Set
        let envData = _sanitizeData['env'];
        this.setScenery(this.m_envSets, this.m_envResourceItem, envData);
        let bioData = _sanitizeData['bio'];
        this.setScenery(this.m_bioSets, this.m_bioResourceItem, bioData);
        let buildingData = _sanitizeData['building'];
        this.setScenery(this.m_buildingSets, this.m_buildingResourceItem, buildingData);


        this.setPercentage([this.m_envSets, this.m_bioSets, this.m_buildingSets], 
                           [envData, bioData, buildingData]);

    }

    setPercentage(_sets: any[], _data: any[])
    {
        let s = 0;

        for (let i = 0; i < _sets.length; i++) 
        {
            const item = _sets[i];
            for (let j = 0; j < item.length; j++) 
            {
                s++;
            }
            
        }

        let d = 0;
        for (let i = 0; i < _data.length; i++) 
        {
            d += _data[i].length;
        }


        let p = d / s;

        this.m_progressSlider.fillRange = p;
        this.m_progressText.string = Math.round((p * 100)) + "%";
        
    }

    toggleMenu(e:Event, _bool:any)
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        let bool = _bool == "true" ? true : false;
        this.m_menuBox.active = bool;
        this.m_plusBtn.active = !bool;
    }

    refreshView()
    {
        this.setupVisuals();
        this.m_gameHeader.getComponent(gameHeaderCtrlr).setCoinsPoints();
    }

    setScenery(_scene : any[], _resourceItem : Node, _data:number[])
    {
        for (let i = 0; i < _data.length; i++) {
            const blocIndex = _data[i];

            // Hide Dirty and Display Clean
            _scene[blocIndex].getChildByName("dirty").active = false;
            _scene[blocIndex].getChildByName("clean").active = true;

        }


        // Setups invest btns

        let _sanitizeBtn : Button = _resourceItem.getChildByPath("action/investBtn").getComponent(Button);
        let _sanitizeCost = parseInt(_resourceItem.getChildByPath("action/coins/cost").getComponent(Label).string);

        // Set progress 
        let percentage = _data.length / _scene.length;
        let _spotsFill : Sprite = _resourceItem.getChildByPath("spotsSlider/spotsFill").getComponent(Sprite);
        _spotsFill.fillRange = percentage;

        // console.log(_sanitizeCost)
        if(this.m_playerData.coins < _sanitizeCost || ( _data.length == _scene.length)) // 1 : ... 2 : Filled
        {
            _sanitizeBtn.interactable = false;
        }


    }

    investIn(e:Event, _domain: string)
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        let _sanitizeData : any = JSON.parse(find('stateManager').getComponent(stateManager).m_sanitizeData.get())
        let sanitizeData = {..._sanitizeData};

        let _sets = this.m_envSets;
        let _resItem = this.m_envResourceItem;
        switch (_domain) {
            
            case "env":
                _sets = this.m_envSets;
                _resItem = this.m_envResourceItem;
                break;

            case "bio":
                _sets = this.m_bioSets;
                _resItem = this.m_bioResourceItem;
                break;

            case "building":
                _sets = this.m_buildingSets;
                _resItem = this.m_buildingResourceItem;
                break;
        }

        let _sanitizeCost = parseInt(_resItem.getChildByPath("action/coins/cost").getComponent(Label).string);

        this.investInDomain(_domain, sanitizeData, _sanitizeCost)
        // this.setInvestment(_sets, _resItem)
    }

    investInDomain(_domain:string, _data:any, _cost:number)
    {
        // - cost
        this.m_playerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
        this.m_playerData.coins -= _cost;


        let p : number[] = _data[_domain];
        let nextIndex = p.length;
        // if(!nextIndex) nextIndex = -1;
        _data[_domain].push(nextIndex);

        // Save
        find('stateManager').getComponent(stateManager).m_playerData.set(JSON.stringify(this.m_playerData));
        find('stateManager').getComponent(stateManager).m_sanitizeData.set(JSON.stringify(_data));

        setTimeout(() => {
            // Call Setup Visuals
            this.refreshView();            
        }, 1000);


    }
 


}


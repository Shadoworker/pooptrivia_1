import { _decorator, Component, Node, find, director, assetManager, SpriteFrame, ImageAsset, Texture2D, Sprite, dynamicAtlasManager, SpriteAtlas, Button, EventMouse, Color, Label } from 'cc';
import { stateManager } from './managers/stateManager';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;

@ccclass('onboardCtrlr')
export class onboardCtrlr extends Component {
    

    
    @property({type: Label})
    public m_header : Label = null;

    @property({type: Button})
    public m_continueBtn : Button = null;

    @property({type: [Node]})
    public m_langBtns = [];

    public m_selectedLang : string;

    start() {

        this.m_selectedLang = find('stateManager').getComponent(stateManager).m_gameLang.get()
    }

    selectLang(e: EventMouse, _lang:string)
    {
        let langs = 
        {
            "fr" : [0 ,"Choisir votre langue pour continuer", "CONTINUER"], 
            "en" : [1 ,"Choose your language to continue", "CONTINUE"]
        };

        let ind = langs[_lang][0];
        let header = langs[_lang][1];
        let btnText = langs[_lang][2];

        this.m_selectedLang = _lang;

        for (let i = 0; i < this.m_langBtns.length; i++) {
            const el = this.m_langBtns[i];
            
            el.getComponent(Button).enabled = !(i==ind);
            el.getComponent(Sprite).color = i==ind ? new Color("#FFFFFF") : new Color("#AAA4A4");
            el.getComponent(Button).normalColor = i==ind ? new Color("#FFFFFF") : new Color("#AAA4A4");
        }

        this.m_header.string = header;
        this.m_continueBtn.getComponentInChildren(Label).string = btnText;


        find('stateManager').getComponent(stateManager).m_gameLang.set(_lang)


    }

    continue()
    {
        director.loadScene("homeScene");
    }
 
    
}


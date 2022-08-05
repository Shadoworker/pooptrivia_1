import { Component, Node, SpriteFrame, _decorator } from "cc";

// avatarModule.ts
const {ccclass, property} = _decorator;


@ccclass('playerItemSCROB')
export class playerItemSCROB  {
    
    @property (SpriteFrame)
    public m_avatar: SpriteFrame = null;

    @property (String)
    public m_name: String = "";

    @property (Number)
    public m_age: number = 0;

    @property (String)
    public m_job: String = "No Job";

}
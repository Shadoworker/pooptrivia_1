import { Component, Enum, Node, SpriteFrame, _decorator } from "cc";

// avatarModule.ts
const {ccclass, property} = _decorator;

    
enum sex {
    M = 0,
    F = 1
}

@ccclass('playerItemSCROB')
export class playerItemSCROB  {

    @property ({type:Enum(sex)})
    public m_sex: sex = sex.M;

    @property (SpriteFrame)
    public m_avatar: SpriteFrame = null;

    @property (String)
    public m_name: String = "";

    @property (Number)
    public m_age: number = 0;

    @property (String)
    public m_job: String = "No Job";

}
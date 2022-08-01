
export namespace Kayfo{

    class PersistentMember
    {
        protected m_defaultValue:any;
        protected m_value:any;
        protected m_key:string;
        protected loadedOnce : boolean = false;

        constructor(_key:string, _defaultValue:any)
        {
            this.m_key = _key;
            this.m_defaultValue = _defaultValue;
        }

        public get():any
        {
            if (this.loadedOnce)
                return this.m_value;

            if (localStorage.getItem(this.m_key) != null)
            {
                this.m_value = this.GetInternal();
            }
            else
            {
                this.m_value = this.m_defaultValue;
            }

            this.loadedOnce = true;
            return this.m_value;
        }

        public set(_value:any):any
        {
            this.m_value = _value;
            this.SetInternal(_value);
        }

        GetInternal():any{};
        SetInternal(_value:any):any{};
    }

    export class PersistentBool extends PersistentMember
    {
        constructor(_key:string, _default:boolean)
        {
            super(_key, _default)
        }

        GetInternal():any
        {
            return localStorage.getItem(this.m_key) == "true" ? true : false;
        }

        SetInternal(_value:boolean)
        {
            localStorage.setItem(this.m_key, _value ? "true" : "false");
        }
    }

    export class PersistentNum extends PersistentMember
    {
        constructor(_key:string, _default:number)
        {
            super(_key, _default)
        }

        GetInternal():any
        {
            return parseFloat(localStorage.getItem(this.m_key));
        }

        SetInternal(_value:number)
        {
            localStorage.setItem(this.m_key, _value.toString());
        }
    }

    export class PersistentString extends PersistentMember
    {
        constructor(_key:string, _default:string)
        {
            super(_key, _default)
        }

        GetInternal():any
        {
            return localStorage.getItem(this.m_key);
        }

        SetInternal(_value:string)
        {
            localStorage.setItem(this.m_key, _value);
        }
    }

}

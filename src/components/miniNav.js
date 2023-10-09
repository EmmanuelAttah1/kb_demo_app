import "../styles/miniNav.css"
import { useState } from "react"

const sections = [
    {name:'Query',id:1},
    {name:'Draft Report',id:2},
    {name:'Images',id:3},
]

export const MiniNav=props=>{
    const {active,changeTab} = props
    return(
        <div id="mini-nav-container">
            {sections.map(e=>(
                <div 
                    key={"section_"+e.id} 
                    className={e.id === active?"mini-nav-option mini-nav-active":"mini-nav-option"}
                    onClick={()=>{changeTab(e.id)}}
                    >
                        {e.name}
                </div>
            ))}
        </div>
    )
}
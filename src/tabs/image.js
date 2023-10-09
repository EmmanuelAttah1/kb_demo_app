import { useEffect } from "react"
import { UnderConstruction } from "../components/construction"
import "../styles/imageTab.css"

export const ImageTab=props=>{
    useEffect(()=>{
        props.setActiveTab(3)
    },[])
    return(
        <div id="image-tab">
            <div id="construction">
                <UnderConstruction/>
            </div>
        </div>
    )
}
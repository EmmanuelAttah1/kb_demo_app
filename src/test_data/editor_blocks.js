import {editorData} from "./editor"

const data = editorData

export const getEditorData=()=>{
    const report_blocks = []

    let id = 1

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const block = {
            id:`id${id}`,
            type:element.type === "paragraph"?"paragraph":"header",
            data:{
                text:element.text,
            }
        }

        if (element.type === "heading") {
            block['data']['level'] = 1
        }else if(element.type === "subheading"){
            block['data']['level'] = 3
        }

        report_blocks.push(block)

        id++
    }

    return report_blocks
}
import { useState, useRef, useEffect } from "react"

const Doc=props=>{
    return(
        <div className="doc">
            <div className="doc-name">{props.name}</div>
            <div className="rm-doc-btn" onClick={()=>{
                props.deleteDoc(props.id)
            }}>remove</div>
        </div>
    )
}

const addr = "http://127.0.0.1:8000/doc/"


export const MyDocs=props=>{
    const [allDocs, setDocs] = useState([])
    const myFile = useRef()

    useEffect(()=>{
        fetch(`${addr}new/`)
        .then(res=>{
            return res.json()
            // setDocs(res.data)
        })
        .then(data=>{
            setDocs(data.data);
        })
    },[])

    const selectFile=()=>{
        myFile.current.click()
    }

    const uploadDoc=(file)=>{
        const form = new FormData()
        form.append("file",file)
        form.append("name",file.name)

        fetch(`${addr}new/`,{
            method:"POST",
            body:form,
        }).then(res=>{
            return res.json()
        })
        .then(myfile=>{
            const data = [...allDocs]
            data.push(myfile.data)
            setDocs(data)
        })
    }

    const deleteDoc=(id)=>{
        const form = new FormData()
        form.append("id",id)

        fetch(`${addr}delete/`,{
            method:"POST",
            body:form,
        }).then(res=>{
            let data = [...allDocs]
            data = data.filter(e=>{
                return e.id !== id
            })
            setDocs(data)
        })
    }

    return(
        <div id="source-documents">
            <div id="doc-top">
                <h3>Source Documents</h3>
                <div id="add-doc" onClick={selectFile}>Add doc</div>
            </div>
            <input id="hidden-file" type="file" ref={myFile} onInput={(e)=>{uploadDoc(e.target.files[0])}}/>
            
            <div id="all-docs">
                {
                    allDocs.map((e,index)=>(
                        <Doc name={e.name} key={"doc_"+index} id={e.id} deleteDoc={deleteDoc}/>
                    ))
                }
            </div>
        </div>
    )
}
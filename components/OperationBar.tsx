import React, {useContext, useEffect, useState, useRef} from "react"
import {Dropdown, DropdownButton} from "react-bootstrap"
import {EnableDragContext, MobileContext, SelectionItemsContext, SelectFlagContext,
ActiveDropdownContext, ImageFlagContext} from "../Context"
import "./styles/operationbar.less"

const OperationBar: React.FunctionComponent = () => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const {mobile, setMobile} = useContext(MobileContext)
    const {activeDropdown, setActiveDropdown} = useContext(ActiveDropdownContext)
    const {selectionItems, setSelectionItems} = useContext(SelectionItemsContext)
    const {selectFlag, setSelectFlag} = useContext(SelectFlagContext)
    const {imageFlag, setImageFlag} = useContext(ImageFlagContext)
    const [folder, setFolder] = useState("good")
    const [qualifier, setQualifier] = useState("p")
    const [special1, setSpecial1] = useState("none")
    const [special2, setSpecial2] = useState("none")
    const [altSource, setAltSource] = useState("")

    const deselect = () => {
        selectionItems.clear()
        setSelectFlag(true)
    }

    const move = async (change?: boolean) => {
        let images = Array.from(selectionItems.values())
        await fetch("/move-images", {method: "POST", headers: {"content-type": "application/json"}, 
            body: JSON.stringify({images, folder, qualifier, special1, special2, altSource, change})})
        await fetch("/update")
        selectionItems.clear()
        setSelectFlag(true)
        setImageFlag(true)
        setQualifier("p")
        setSpecial1("none")
        setSpecial2("none")
        setAltSource("")
    }

    return (
        <div className={`operation-bar ${activeDropdown === "operation" ? "" : "hide-operation-bar"}`}>
            <div className="operation-bar-row">
                <p className="operation-bar-text">Send To: </p>
                <DropdownButton className="operation-row-dropdown" title={folder} drop="down">
                    <Dropdown.Item active={folder === "good"} onClick={() => setFolder("good")}>good</Dropdown.Item>
                    <Dropdown.Item active={folder === "meh"} onClick={() => setFolder("meh")}>meh</Dropdown.Item>
                </DropdownButton>
            </div>
            <div className="operation-bar-row">
                <p className="operation-bar-text">Qualifier: </p>
                <DropdownButton className="operation-row-dropdown" title={qualifier} drop="down">
                    <Dropdown.Item active={qualifier === "p"} onClick={() => setQualifier("p")}>p</Dropdown.Item>
                    <Dropdown.Item active={qualifier === "c"} onClick={() => setQualifier("c")}>c</Dropdown.Item>
                    <Dropdown.Item active={qualifier === "c!"} onClick={() => setQualifier("c!")}>c!</Dropdown.Item>
                    <Dropdown.Item active={qualifier === "g"} onClick={() => setQualifier("g")}>g</Dropdown.Item>
                    <Dropdown.Item active={qualifier === "g!"} onClick={() => setQualifier("g!")}>g!</Dropdown.Item>
                </DropdownButton>
            </div>
            <div className="operation-bar-row">
                <p className="operation-bar-text">Special 1: </p>
                <DropdownButton className="operation-row-dropdown" title={special1} drop="down">
                    <Dropdown.Item active={special1 === "none"} onClick={() => setSpecial1("none")}>none</Dropdown.Item>
                    <Dropdown.Item active={special1 === "comic"} onClick={() => setSpecial1("comic")}>comic</Dropdown.Item>
                    <Dropdown.Item active={special1 === "daki"} onClick={() => setSpecial1("daki")}>daki</Dropdown.Item>
                    <Dropdown.Item active={special1 === "promo"} onClick={() => setSpecial1("promo")}>promo</Dropdown.Item>
                    <Dropdown.Item active={special1 === "text"} onClick={() => setSpecial1("text")}>text</Dropdown.Item>
                    <Dropdown.Item active={special1 === "sketch"} onClick={() => setSpecial1("sketch")}>sketch</Dropdown.Item>
                    <Dropdown.Item active={special1 === "lineart"} onClick={() => setSpecial1("lineart")}>lineart</Dropdown.Item>
                    <Dropdown.Item active={special1 === "r18"} onClick={() => setSpecial1("r18")}>r18</Dropdown.Item>
                </DropdownButton>
            </div>
            <div className="operation-bar-row">
                <p className="operation-bar-text">Special 2: </p>
                <DropdownButton className="operation-row-dropdown" title={special2} drop="down">
                    <Dropdown.Item active={special2 === "none"} onClick={() => setSpecial2("none")}>none</Dropdown.Item>
                    <Dropdown.Item active={special2 === "comic"} onClick={() => setSpecial2("comic")}>comic</Dropdown.Item>
                    <Dropdown.Item active={special2 === "daki"} onClick={() => setSpecial2("daki")}>daki</Dropdown.Item>
                    <Dropdown.Item active={special2 === "promo"} onClick={() => setSpecial2("promo")}>promo</Dropdown.Item>
                    <Dropdown.Item active={special2 === "text"} onClick={() => setSpecial2("text")}>text</Dropdown.Item>
                    <Dropdown.Item active={special2 === "sketch"} onClick={() => setSpecial2("sketch")}>sketch</Dropdown.Item>
                    <Dropdown.Item active={special2 === "lineart"} onClick={() => setSpecial2("lineart")}>lineart</Dropdown.Item>
                    <Dropdown.Item active={special2 === "r18"} onClick={() => setSpecial2("r18")}>r18</Dropdown.Item>
                </DropdownButton>
            </div>
            <div className="operation-bar-row">
                <p className="operation-bar-text">Alt Source: </p>
                <input className="operation-bar-input" type="text" spellCheck="false" value={altSource} onChange={(event) => setAltSource(event.target.value)}
                onMouseEnter={() => setEnableDrag(false)} onMouseLeave={() => setEnableDrag(true)}/>
            </div>
            <div className="operation-bar-row">
                <button className="operation-bar-button" onClick={() => deselect()}>Deselect</button>
                <button className="operation-bar-button" onClick={() => move(true)}>Change</button>
                <button className="operation-bar-button" onClick={() => move()}>Move</button>
            </div>
        </div>
    )
}

export default OperationBar
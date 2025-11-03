import React, {useEffect, useContext, useReducer, useState} from "react"
import {EnableDragContext} from "../Context"
import NavBar from "../components/NavBar"
import ImageGrid from "../components/ImageGrid"
import TitleBar from "../components/TitleBar"
import OperationBar from "../components/OperationBar"

const HomePage: React.FunctionComponent = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)

    useEffect(() => {
        document.title = "Image Sorter"
    }, [])

    return (
        <>
        <TitleBar rerender={forceUpdate}/>
        <NavBar rerender={forceUpdate}/>
        <div className="body">
            <OperationBar/>
            <ImageGrid/>
        </div>
        </>
    )
}

export default HomePage
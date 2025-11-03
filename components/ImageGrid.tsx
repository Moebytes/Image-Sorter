import React, {useContext, useEffect, useState, useRef} from "react"
import {useHistory} from "react-router-dom"
import {EnableDragContext, MobileContext, SelectedFolderContext, ImageSizeContext, ImageFlagContext} from "../Context"
import Image from "./Image"
import "./styles/imagegrid.less"

const ImageGrid: React.FunctionComponent = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const {mobile, setMobile} = useContext(MobileContext)
    const {selectedFolder, setSelectedFolder} = useContext(SelectedFolderContext)
    const {imageFlag, setImageFlag} = useContext(ImageFlagContext)
    const {imageSize, setImageSize} = useContext(ImageSizeContext)
    const [images, setImages] = useState([])
    const ref = useRef<HTMLCanvasElement>(null)
    const history = useHistory()

    const updateImages = async () => {
        let data = await fetch(`/images/${selectedFolder}/files.json`).then((r) => r.json())
        let files = data.files.sort(new Intl.Collator(undefined, {numeric: true, sensitivity: "base"}).compare)
        const images = files.map((file: string) => `/images/${selectedFolder}/${file}`)
        setImages(images)
    }

    useEffect(() => {
        updateImages()
    }, [selectedFolder])

    useEffect(() => {
        if (imageFlag) {
            updateImages()
            setImageFlag(false)
        }
    }, [imageFlag])

    const generateJSX = () => {
        let jsx = [] as any 
        for (let i = 0; i < images.length; i++) {
            jsx.push(
                <Image img={images[i]}/>
            )
        }
        return jsx
    }

    return (
        <div className="image-grid" onMouseEnter={() => setEnableDrag(true)}>
            {generateJSX()}
        </div>
    )
}

export default ImageGrid
import React, {useContext, useEffect, useState, useRef} from "react"
import {EnableDragContext, MobileContext, ImageSizeContext, BrightnessContext, 
ContrastContext, HueContext, SaturationContext, LightnessContext, BlurContext, 
SharpenContext, PixelateContext, SelectionItemsContext, SelectFlagContext} from "../Context"
import path from "path"
import Audio from "./Audio"
import "./styles/image.less"

interface Props {
    img: string
}

const Image: React.FunctionComponent<Props> = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const {mobile, setMobile} = useContext(MobileContext)
    const {imageSize, setImageSize} = useContext(ImageSizeContext)
    const {brightness, setBrightness} = useContext(BrightnessContext)
    const {contrast, setContrast} = useContext(ContrastContext)
    const {hue, setHue} = useContext(HueContext)
    const {saturation, setSaturation} = useContext(SaturationContext)
    const {lightness, setLightness} = useContext(LightnessContext)
    const {blur, setBlur} = useContext(BlurContext)
    const {sharpen, setSharpen} = useContext(SharpenContext)
    const {pixelate, setPixelate} = useContext(PixelateContext)
    const {selectionItems, setSelectionItems} = useContext(SelectionItemsContext)
    const {selectFlag, setSelectFlag} = useContext(SelectFlagContext)
    const [selected, setSelected] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.border = 
                `4px solid ${selected ? "var(--selectBorder)" : "transparent"}`
        }
    }, [selected])

    useEffect(() => {
        if (selectFlag) {
            setSelected(selectionItems.has(props.img))
            setSelectFlag(false)
        }
    }, [selectFlag])

    const onClick = (event: React.MouseEvent) => {
        if (event.metaKey || event.ctrlKey || event.button === 1) {
            event.preventDefault()
            let id = path.basename(props.img, path.extname(props.img)).split("_")[0]
            const newWindow = window.open(`https://www.pixiv.net/en/artworks/${id}`, "_blank")
            return newWindow?.focus()
        }
        const isSelected = !selectionItems.has(props.img)
        if (isSelected) {
            selectionItems.add(props.img)
            containerRef.current?.querySelector("audio")?.play().catch(() => {})
        } else {
            selectionItems.delete(props.img)
        }
        setSelected(isSelected)
    }

    const onDoubleClick = async () => {
        await fetch("/show-image", {method: "POST", headers: {"content-type": "application/json"}, 
            body: JSON.stringify({image: props.img})})
    }

    let isImage = /\.(jpe?g|png|gif|webp|avif|jxl)$/.test(props.img)
    let isAudio = /\.(wav|mp3|ogg|flac)$/i.test(props.img)
    let isVideo = /\.(mp4|webm|mkv|avi|mov)$/.test(props.img)

    if (!isImage && !isAudio && !isVideo) return null

    return (
        <div className={`image-filters ${isAudio ? "audio-filters" : ""}`} onMouseEnter={() => setEnableDrag(!isAudio)} ref={containerRef}
            style={{filter: isAudio ? undefined : `brightness(${brightness}%) contrast(${contrast}%)
            hue-rotate(${hue - 180}deg) saturate(${saturation}%) blur(${blur}px)`}}
            onClick={onClick} onDoubleClick={onDoubleClick}>
            {isImage ?
                <img className="image" src={props.img} style={{height: `${imageSize}px`}}/>
            : isAudio ? 
                <Audio src={props.img}/>
            : isVideo ?
                <video className="video" src={props.img} style={{height: `${imageSize}px`}} controls></video>
            : null}
            {!isAudio && <span className="image-text">{path.basename(decodeURIComponent(props.img))}</span>}
        </div>
    )
}

export default Image
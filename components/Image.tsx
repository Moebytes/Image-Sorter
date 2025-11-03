import React, {useContext, useEffect, useState, useRef} from "react"
import {EnableDragContext, MobileContext, ImageSizeContext, BrightnessContext, 
ContrastContext, HueContext, SaturationContext, LightnessContext, BlurContext, 
SharpenContext, PixelateContext, SelectionItemsContext, SelectFlagContext} from "../Context"
import path from "path"
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
            let id = path.basename(props.img).split("_")[0]
            const newWindow = window.open(`https://www.pixiv.net/en/artworks/${id}`, "_blank")
            return newWindow?.focus()
        }
        const isSelected = !selectionItems.has(props.img)
        if (isSelected) {
            selectionItems.add(props.img)
        } else {
            selectionItems.delete(props.img)
        }
        setSelected(isSelected)
    }

    if (!/\.(jpe?g|png|webp|avif|jxl)$/.test(props.img)) return null

    return (
        <div className="image-filters" onMouseEnter={() => setEnableDrag(true)} ref={containerRef}
            style={{filter: `brightness(${brightness}%) contrast(${contrast}%) 
            hue-rotate(${hue - 180}deg) saturate(${saturation}%) blur(${blur}px)`}}>
            <img className="image" src={props.img} style={{height: `${imageSize}px`}} onClick={onClick}/>
            <span className="image-text">{path.basename(props.img)}</span>
        </div>
    )
}

export default Image
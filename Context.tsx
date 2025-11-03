import React, {useState} from "react"

export const EnableDragContext = React.createContext<any>(null)
export const MobileContext = React.createContext<any>(null)
export const SiteHueContext = React.createContext<any>(null)
export const SiteSaturationContext = React.createContext<any>(null)
export const SiteLightnessContext = React.createContext<any>(null)
export const SelectedFolderContext = React.createContext<any>(null)
export const ImageSizeContext = React.createContext<any>(null)
export const BrightnessContext = React.createContext<any>(null)
export const ContrastContext = React.createContext<any>(null)
export const HueContext = React.createContext<any>(null)
export const SaturationContext = React.createContext<any>(null)
export const LightnessContext = React.createContext<any>(null)
export const BlurContext = React.createContext<any>(null)
export const SharpenContext = React.createContext<any>(null)
export const PixelateContext = React.createContext<any>(null)
export const ActiveDropdownContext = React.createContext<any>(null)
type SelectionItemsContextType = {selectionItems: Set<string>, setSelectionItems: React.Dispatch<React.SetStateAction<Set<string>>>}
export const SelectionItemsContext = React.createContext<SelectionItemsContextType>({selectionItems: new Set<string>(), setSelectionItems: () => null})
type SelectFlagContextType = {selectFlag: boolean, setSelectFlag: React.Dispatch<React.SetStateAction<boolean>>}
export const SelectFlagContext = React.createContext<SelectFlagContextType>({selectFlag: false, setSelectFlag: () => null})
type ImageFlagContextType = {imageFlag: boolean, setImageFlag: React.Dispatch<React.SetStateAction<boolean>>}
export const ImageFlagContext = React.createContext<ImageFlagContextType>({imageFlag: false, setImageFlag: () => null})

const Context: React.FunctionComponent = (props) => {
    const [siteHue, setSiteHue] = useState(189)
    const [siteSaturation, setSiteSaturation] = useState(100)
    const [siteLightness, setSiteLightness] = useState(50)
    const [selectedFolder, setSelectedFolder] = useState("")
    const [imageSize, setImageSize] = useState(500)
    const [brightness, setBrightness] = useState(100)
    const [contrast, setContrast] = useState(100)
    const [hue, setHue] = useState(180)
    const [saturation, setSaturation] = useState(100)
    const [lightness, setLightness] = useState(100)
    const [blur, setBlur] = useState(0)
    const [sharpen, setSharpen] = useState(0)
    const [pixelate, setPixelate] = useState(1)
    const [activeDropdown, setActiveDropdown] = useState("")
    const [selectionItems, setSelectionItems] = useState(new Set<string>())
    const [selectFlag, setSelectFlag] = useState(false)
    const [imageFlag, setImageFlag] = useState(false)

    return (
        <>  
            <ImageFlagContext.Provider value={{imageFlag, setImageFlag}}>
            <SelectFlagContext.Provider value={{selectFlag, setSelectFlag}}>
            <SelectionItemsContext.Provider value={{selectionItems, setSelectionItems}}>
            <ActiveDropdownContext.Provider value={{activeDropdown, setActiveDropdown}}>
            <PixelateContext.Provider value={{pixelate, setPixelate}}>
            <BrightnessContext.Provider value={{brightness, setBrightness}}>
            <ContrastContext.Provider value={{contrast, setContrast}}>
            <HueContext.Provider value={{hue, setHue}}>
            <SaturationContext.Provider value={{saturation, setSaturation}}>
            <LightnessContext.Provider value={{lightness, setLightness}}>
            <BlurContext.Provider value={{blur, setBlur}}>
            <SharpenContext.Provider value={{sharpen, setSharpen}}>
            <ImageSizeContext.Provider value={{imageSize, setImageSize}}>
            <SelectedFolderContext.Provider value={{selectedFolder, setSelectedFolder}}>
            <SiteLightnessContext.Provider value={{siteLightness, setSiteLightness}}>
            <SiteSaturationContext.Provider value={{siteSaturation, setSiteSaturation}}>
            <SiteHueContext.Provider value={{siteHue, setSiteHue}}>
                {props.children}
            </SiteHueContext.Provider>
            </SiteSaturationContext.Provider>
            </SiteLightnessContext.Provider>
            </SelectedFolderContext.Provider>
            </ImageSizeContext.Provider>
            </SharpenContext.Provider>
            </BlurContext.Provider>
            </LightnessContext.Provider>
            </SaturationContext.Provider>
            </HueContext.Provider>
            </ContrastContext.Provider>
            </BrightnessContext.Provider>
            </PixelateContext.Provider>
            </ActiveDropdownContext.Provider>
            </SelectionItemsContext.Provider>
            </SelectFlagContext.Provider>
            </ImageFlagContext.Provider>
        </>
    )
}

export default Context
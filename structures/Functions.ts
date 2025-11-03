import {hexToRgb, Color, Solver} from "./Color"

let newScrollY = 0
let lastScrollTop = 0
let newScrollX = 0
let lastScrollLeft = 0
let element = null as any
let inertia = false
let mouseDown = false
let stopInertia = false

export default class Functions {
    public static decodeEntities(encodedString: string) {
        const regex = /&(nbsp|amp|quot|lt|gt);/g
        const translate = {
            nbsp: " ",
            amp : "&",
            quot: "\"",
            lt  : "<",
            gt  : ">"
        }
        return encodedString.replace(regex, function(match, entity) {
            return translate[entity]
        }).replace(/&#(\d+);/gi, function(match, numStr) {
            const num = parseInt(numStr, 10)
            return String.fromCharCode(num)
        })
    }

    public static cleanHTML = (str: string) => {
        return Functions.decodeEntities(str).replace(/<\/?[^>]+(>|$)/g, "")
    }
    
    public static removeDuplicates = <T>(array: T[]) => {
        return array.filter((value, index) => {
            return index === array.findIndex(obj => {
              return JSON.stringify(obj) === JSON.stringify(value)
            })
        })
    }
    
    public static arrayIncludes = (str: string, arr: string[]) => {
        for (let i = 0; i < arr.length; i++) {
            if (str.includes(arr[i])) return true
        }
        return false
    }

    public static timeout = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    
    public static toProperCase = (str: string) => {
        if (!str) return ""
        return str.replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            }
        )
    }

    public static dragScroll = (enabled?: boolean) => {
        if (inertia || mouseDown) return
        element?.removeEventListener("mousedown", element?.mouseDownFunc, false)
        window.removeEventListener("mouseup", element?.mouseUpFunc, false)
        window.removeEventListener("mousemove", element?.mouseMoveFunc, false)
        window.removeEventListener("scroll", element?.scrollFunc, false)

        element = document.querySelector(".drag") as HTMLElement
        if (!element) element = document.querySelector("body") as HTMLElement
        if (!element || !enabled) return
        let lastClientY = 0
        let lastClientX = 0
        mouseDown = false
        let time = null as any
        let id = 0
        stopInertia = false

        element.addEventListener("mousedown", element.mouseDownFunc = (event: MouseEvent) => {
                if (event.button === 2) return 
                event.preventDefault()
                window.getSelection()?.removeAllRanges()
                // @ts-ignore
                document.activeElement.blur()
                mouseDown = true
                inertia = false
                time = new Date()
                lastClientY = event.clientY
                lastClientX = event.clientX
                let scrollElement = element
                if (element == document.body) scrollElement = document.documentElement
                lastScrollTop = scrollElement.scrollTop
                lastScrollLeft = scrollElement.scrollLeft
                cancelAnimationFrame(id)
        }, false)

        window.addEventListener("scroll", element.scrollFunc = () => {
            cancelAnimationFrame(id)
        }, false)

        window.addEventListener("mouseup", element.mouseUpFunc = (event) => {
            mouseDown = false
            if (stopInertia) return
            const timeDiff = (new Date() as any - time)
            let scrollElement = element
            if (element == document.body) scrollElement = document.documentElement
            let speedY = (scrollElement.scrollTop - lastScrollTop) / timeDiff * 25
            let speedX = (scrollElement.scrollLeft - lastScrollLeft) / timeDiff * 25
            let speedYAbsolute = Math.min(Math.abs(speedY), 500)
            let speedXAbsolute = Math.min(Math.abs(speedX), 500)

            const draw = () => {
                let scrollElement = element
                if (element == document.body) scrollElement = document.documentElement
                if (speedYAbsolute > 0 || speedXAbsolute > 0) {
                    if (speedYAbsolute > 0) {
                        if (speedY > 0) {
                            scrollElement.scrollTop += speedYAbsolute--
                        } else {
                            scrollElement.scrollTop -= speedYAbsolute--
                        }
                    }
                    if (speedXAbsolute > 0) {
                        if (speedX > 0) {
                            scrollElement.scrollLeft += speedXAbsolute--
                        } else {
                            scrollElement.scrollLeft -= speedXAbsolute--
                        }
                    }
                } else {
                    inertia = false
                }
                id = requestAnimationFrame(draw)
            }
            inertia = true
            draw()
        }, false)

        window.addEventListener("mousemove", element.mouseMoveFunc = (event) => {
            if (Math.abs(window.innerWidth - event.pageX) < 10) {
                stopInertia = true
            } else {
                stopInertia = false
            }
            if (!mouseDown) return
            let scrollElement = element
            if (element == document.body) scrollElement = document.documentElement
            newScrollY = event.clientY - lastClientY
            newScrollX = event.clientX - lastClientX
            lastClientY = event.clientY
            lastClientX = event.clientX
            scrollElement.scrollTop -= newScrollY
            if (element !== document.body) {
                scrollElement.scrollLeft -= newScrollX
            }
        }, false)
    }

    public static preventDragging = () => {
        document.querySelectorAll("img").forEach((img) => {
          img.draggable = false
        })
    }

    public static rgbToHsl = (r: any, g: any, b: any) => {
        r /= 255;
        g /= 255;
        b /= 255;
      
        let cmin = Math.min(r,g,b),
            cmax = Math.max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0)
            h = 0;
        // Red is max
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        // Green is max
        else if (cmax == g)
            h = (b - r) / delta + 2;
        // Blue is max
        else
            h = (r - g) / delta + 4;
    
        h = Math.round(h * 60);
        
        // Make negative hues positive behind 360°
        if (h < 0)
            h += 360;

        l = (cmax + cmin) / 2;

        // Calculate saturation
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
            
        // Multiply l and s by 100
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return [h, s, l]
    }

    public static hslToRgb(h: any, s: any, l: any) {
        // Must be fractions of 1
        s /= 100.0;
        l /= 100.0;
      
        let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60.0) % 2 - 1)),
        m = l - c/2.0,
        r = 0,
        g = 0,
        b = 0;
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;  
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return [r, g, b]
    } 

    public static rgbToHex(r: any, g: any, b: any) {
        r = r.toString(16)
        g = g.toString(16)
        b = b.toString(16)
      
        if (r.length == 1)
          r = "0" + r
        if (g.length == 1)
          g = "0" + g
        if (b.length == 1)
          b = "0" + b
      
        return "#" + r + g + b
    }

    public static wrap = (num: number, min: number, max: number) => {
        let newNum = num 
        if (newNum < min) newNum += max 
        if (newNum > max) newNum -= min
        return newNum
    }

    public static mod = (num: number, mod: number) => {
        if (num === mod) return num 
        return num % mod
    }

    public static calculateFilter = (hexColor: string) => {
        const rgb = hexToRgb(hexColor) as any
        if (!rgb) return ""
        const color = new Color(rgb[0], rgb[1], rgb[2])
        const solver = new Solver(color)
        const result = solver.solve()
        return result.filter
    }

    public static hexToRgb = (hexColor: string) => {
        const rgb = hexToRgb(hexColor) as any
        if (!rgb) return {r: 0, g: 0, b: 0}
        return {r: rgb[0], g: rgb[1], b: rgb[2]}
    }

    public static rotateColor = (color: string, hue: number, saturation: number, lightness: number) => {
        let hsl = [] as any
        let a = 1
        if (color.trim().startsWith("#")) {
            const rgb = hexToRgb(color) as any
            hsl = Functions.rgbToHsl(rgb[0], rgb[1], rgb[2])
        } else {
            const matches = color.match(/\d+(\.\d+)?/g)!
            hsl = Functions.rgbToHsl(Number(matches[0]), Number(matches[1]), Number(matches[2]))
            if (matches[3]) a = Number(matches[3])
        }
        const newH = Functions.mod(Functions.wrap(hsl[0] - 180 + hue, 0, 360), 360)
        const newS = Functions.mod(Functions.wrap(hsl[1] - 100 + saturation, 0 , 100), 100)
        const newL = Functions.mod(Functions.wrap(hsl[2] - 50 + lightness, 0, 100), 100)
        const newRGB = Functions.hslToRgb(newH, newS, newL)
        if (a < 1) {
            return `rgba(${newRGB[0]}, ${newRGB[1]}, ${newRGB[2]}, ${a})`
        } else {
            return Functions.rgbToHex(newRGB[0], newRGB[1], newRGB[2])
        }
    }
}
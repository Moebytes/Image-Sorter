import React from "react"
import path from "path"
import "./styles/audio.less"

interface Props {
    src: string
}

const Audio: React.FunctionComponent<Props> = (props) => {
    const filename = path.basename(decodeURIComponent(props.src))

    const play = (event: React.SyntheticEvent) => {
        const current = event.currentTarget
        document.querySelectorAll("audio").forEach((audio) => {
            if (audio !== current) audio.pause()
        })
    }

    return (
        <>
        <div className="audio-heading">
            <span className="audio-icon" aria-hidden="true">♫</span>
            <span className="audio-name" title={filename}>{filename}</span>
        </div>
        <audio className="audio" src={props.src} controls preload="metadata"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
            onPlay={play}>
        </audio>
        </>
    )
}

export default Audio
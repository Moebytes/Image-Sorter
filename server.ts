import path from "path"
import cors from "cors"
import mime from "mime"
import fs from "fs"
import child_process from "child_process"
import express from "express"
import dotenv from "dotenv"
const __dirname = path.resolve()

dotenv.config()
const app = express()
app.use(express.urlencoded({extended: true, limit: "1gb", parameterLimit: 50000}))
app.use(express.json({limit: "1gb"}))
app.use(cors({credentials: true, origin: true}))
app.disable("x-powered-by")
app.set("trust proxy", true)

app.use(express.static(path.join(__dirname, "./dist"), {index: false}))
app.use("/assets", express.static(path.join(__dirname, "./assets")))

const getImagesLocation = () => {
  return process.env.FOLDER ? process.env.FOLDER : path.join(__dirname, "./images")
}

const getDirectories = (source: string) => {
  return fs.readdirSync(source, {withFileTypes: true}).filter(file => file.isDirectory()).map(file => `"${file.name}"`)
}

const writeFolderJSON = () => {
  let json = `{"folders": [${getDirectories(getImagesLocation()).join(", ")}]}`
  fs.writeFileSync(path.join(__dirname, "./assets/misc/folders.json"), json)
}

const getFiles = (source: string) => {
  return fs.readdirSync(source, {withFileTypes: true}).filter(file => file.isFile()).map(file => `"${file.name}"`)
}

const writeFileJSON = () => {
  const directories = getDirectories(getImagesLocation())
  for (let i = 0; i < directories.length; i++) {
    const directory = directories[i].replaceAll("\"", "")
    let json = `{"files": [${getFiles(path.join(getImagesLocation(), directory)).join(", ")}]}`
    fs.writeFileSync(path.join(getImagesLocation(), `./${directory}/files.json`), json)
  }
}

const parseFilename = (filename: string, qualifier: string, special1: string, special2: string, altSource: string) => {
  let {name, ext} = path.parse(filename)
  let nameSplit = name.split("_")
  name = nameSplit.length > 1 ? `${nameSplit[0]}_${nameSplit[nameSplit.length - 1]}`  : nameSplit[0]

  const match = name.match(/(_s|_p|_g!?|_c!?)(\d+)?$/)
  let specialString = [special1, special2].filter((s) => s !== "none").join("_")
  if (specialString) specialString += "_"
  let altString = altSource ? `_*${altSource}*` : ""

  let newName = `${name}${altString}_${specialString}${qualifier}0`
  if (match) {
      const num = match[2] ?? 0
      newName = name.replace(/(_s|_p|_g!?|_c!?)(\d+)?$/, `${altString}_${specialString}${qualifier}${num}`)
  }

  return newName + ext
}

app.post("/move-images", function(req, res, next) {
  let {images, folder, qualifier, special1, special2, altSource, change} = req.body
  if (!images.length) return res.status(200).send("Success")
  let baseFolder = path.basename(path.dirname(images[0]))
  let srcFolder = path.join(getImagesLocation(), baseFolder)
  let destFolder = path.join(getImagesLocation(), `${baseFolder} ${folder}`)
  if (change) destFolder = srcFolder
  if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, {recursive: true})
  for (const image of images) {
    let filename = path.basename(image)
    let newName = parseFilename(filename, qualifier, special1, special2, altSource)
    let src = path.join(srcFolder, filename)
    let dest = path.join(destFolder, newName)
    fs.renameSync(src, dest)
  }
  res.status(200).send("Success")
})

app.post("/show-image", function(req, res, next) {
  let {image} = req.body
  let baseFolder = path.basename(path.dirname(image))
  let filename = path.basename(image)
  let srcFolder = path.join(getImagesLocation(), baseFolder)
  let src = path.join(srcFolder, filename)
  if (process.platform === "win32") {
    child_process.execSync(`explorer /select,"${src.replace(/\//g, "\\")}"`)
  } else if (process.platform === "darwin") {
    child_process.execSync(`open -R "${src}"`)
  } else if (process.platform === "linux") {
    child_process.execSync(`xdg-open "${path.dirname(src)}"`)
  }
  res.status(200).send("Success")
})

app.get("/images/*", function(req, res, next) {
  const filename = req.path.replace("/images/", "")
  const pathname = path.join(getImagesLocation(), decodeURIComponent(filename))
  if (!fs.existsSync(pathname)) return res.status(404).end()
  const file = fs.readFileSync(pathname)
  res.status(200).send(file)
})

app.get("/update", function(req, res, next) {
  writeFolderJSON()
  writeFileJSON()
  res.status(200).end()
})

app.get("/*", function(req, res, next) {
    if (req.path.startsWith("/images")) return next()
    res.setHeader("Content-Type", mime.getType(req.path) ?? "")
    res.header("Access-Control-Allow-Origin", "*")
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
    const document = fs.readFileSync(path.join(__dirname, "./dist/index.html"), {encoding: "utf-8"})
    res.status(200).send(document)
})

const run = async () => {
  writeFolderJSON()
  writeFileJSON()
  let port = process.env.PORT || 8085
  app.listen(port, () => console.log(`Started the website server! http://localhost:${port}`))
}

run()
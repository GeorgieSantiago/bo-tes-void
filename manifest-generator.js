const fs = require('fs'); 
const Rx = /(?:\.([^.]+))?$/;


const convertText = (str, arr) => {
    if( str.charAt(0) === "." ) return false
    let hasExt = false
    arr.forEach(i => {
        if( str.search(i) ){
             hasExt = true
             str = str.replace(i, "")
        }
    })
    if( hasExt ) return str
    return false
}

const createManifest = name => {
    const pathToManifest = `src/manifest/${name}-manifest.json`
    try {
        fs.unlinkSync(pathToManifest)
      } catch(err) {}
    fs.appendFile(pathToManifest, "", (e) => {
        if (e) throw e;
    })

    return pathToManifest
}

const run = (key, ext=[".png"]) => {
    const manifest = fs.createWriteStream(createManifest(key))
    fs.readdir(`src/assets/${key}`, (err, files) => {
        if( files.length === 0 || err ) {
            manifest.write('{ "files": [] }')
            console.log("Error", err)
            return;
        }

        const entries = files.filter(file => convertText(file,ext))
        let hasFirstEntry = false
        files.map( (file, i) => {
            if( convertText(file, ext) ) {
                if( !hasFirstEntry ) {
                    hasFirstEntry = true
                    manifest.write(`{ "files": [\n`)
                }
                manifest.write(`{ 
                    "label": "${convertText(file, ext)}",
                    "path": "/assets/${key}/${file}"
                }${i === (files.length -1) ? "\n ] }" : ", \n"}`)
            }
        })
        manifest.end()
    })
}
console.log("Creating autoload files")
const props = process.argv.slice(2)
run(props.shift(),props)
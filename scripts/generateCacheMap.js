const {globSync} = require("glob")
const fs = require("fs")

const rules = ["out/**/*.*"]
const ignore = ["**/sw.js", "**/*.html", "**/*.txt", "**/_ssgManifest.js", "**/_buildManifest.js"]
const prefix = "\\turbo-scout" 
    
const extra =  [
    "\\turbo-scout\\",
    "\\turbo-scout\\pit",
    "\\turbo-scout\\match",
    "\\turbo-scout\\view"
]

var obj = {
    urls: extra
}

globSync(rules, {ignore: ignore}).forEach((file) => {
    obj.urls.push(prefix + file.substring(3))
})

fs.writeFile("out/cacheMap.json", JSON.stringify(obj), "utf8", (error) => console.log(error))

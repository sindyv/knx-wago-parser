// hent funksjon for filsystem
const fs = require("fs")

// Hent modul for å printe XML
const writeXml = require("./src/xml/writeXML")

// Hent diverse moduler
const createKnx = require("./src/knx/createKnx")
const createBacnetGvl = require("./src/bacnet/createBacnetGvl")

// Hent modul for å lese excel
const reader = require("xlsx")

// Hent funksjon for å lage json-objekt
const createRoomJson = require("./src/import/createRoomJson")
const createKnxObject = require("./src/import/createKnxObjects")
// Les fil
const file = reader.readFile("./Bok1.xlsx")

// Hent ark
const sheets = file.SheetNames

// Konverter Ark1 til JSON
const groupAddresses = reader.utils.sheet_to_json(
	file.Sheets[file.SheetNames[0]],
	{ header: 1 }
)

// Konverter rommatrise til JSON
const roomMatrix = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[1]], {
	header: 1,
})

// Lag nytt JSON-objekt med rom, komponenter og signaler
const { rooms } = createRoomJson(groupAddresses, roomMatrix)
const knxLines = createKnxObject(groupAddresses)

// Skriv til JSON-fil
try {
	fs.writeFileSync("jsonOutput.json", JSON.stringify({ rooms }))
} catch (err) {
	console.error(err)
}

try {
	fs.writeFileSync("jsonKnxOutput.json", JSON.stringify({ knxLines }))
} catch (err) {
	console.error(err)
}

// Skriv til XML-fil
writeXml.header()
createKnx(knxLines)
writeXml.middle()
createBacnetGvl()
writeXml.footer()

// Hent config
const config = require("../../config.json")

// Hent modul for å printe XML
const XML = require("./xmlData")
// hent funksjon for filsystem
const fs = require("fs")

const header = () => {
	try {
		fs.writeFileSync(config.xmlExportFileName, XML.header())
	} catch (error) {
		console.log(error)
	}
}

const pouHeader = (name) => {
	try {
		fs.appendFileSync(config.xmlExportFileName, XML.pouHeader(name))
	} catch (error) {
		console.log(error)
	}
}

const pouVariable = (name, type) => {
	try {
		fs.appendFileSync(config.xmlExportFileName, XML.pouVariable(name, type))
	} catch (error) {
		console.log(error)
	}
}

const pouMiddle = () => {
	try {
		fs.appendFileSync(config.xmlExportFileName, XML.pouMiddle())
	} catch (error) {
		console.log(error)
	}
}

const pouFunctions = (data) => {
	try {
		fs.appendFileSync(config.xmlExportFileName, data)
	} catch (error) {
		console.log(error)
	}
}

const pouEnd = () => {
	try {
		fs.appendFileSync(config.xmlExportFileName, XML.pouEnd())
	} catch (error) {
		console.log(error)
	}
}

const middle = () => {
	try {
		fs.appendFileSync(config.xmlExportFileName, XML.middle())
	} catch (error) {
		console.log(error)
	}
}

const globalvarsHeader = (name) => {
	try {
		fs.appendFileSync(config.xmlExportFileName, XML.gvlHeader(name))
	} catch (error) {
		console.log(error)
	}
}

const globalvarsVar = (name, type, comment) => {
	try {
		fs.appendFileSync(config.xmlExportFileName, XML.gvlVar(name, type, comment))
	} catch (error) {
		console.log(error)
	}
}

const globalvarsFooter = () => {
	try {
		fs.appendFileSync(config.xmlExportFileName, XML.gvlFooter())
	} catch (error) {
		console.log(error)
	}
}

const footer = () => {
	try {
		fs.appendFileSync(config.xmlExportFileName, XML.footer())
	} catch (error) {
		console.log(error)
	}
}
module.exports = {
	header,
	pouHeader,
	pouVariable,
	pouMiddle,
	pouFunctions,
	pouEnd,
	middle,
	footer,
	globalvarsHeader,
	globalvarsFooter,
	globalvarsVar,
}

// hent funksjon for filsystem
const fs = require("fs")
const writeXml = require("../xml/writeXML")
const createFunctionBlocks = require("./functionBlocks")
const { variablesTypesList } = require("../../config.json")
const CONFIG = require("../../config.json")
const createVariableArray = (signalArray, knxLineIndex) => {
	// Lag en variabel indeks
	let variableIndex = 1

	// Lag variabel-array
	let variablesArray = []

	signalArray.forEach((signal) => {
		variablesTypesList.forEach((signalType) => {
			if (signal.signalName === signalType.signalName) {
				let varIndexExt = ""
				if (variableIndex < 10) {
					varIndexExt = "00" + variableIndex.toString()
				} else if (variableIndex < 100) {
					varIndexExt = "0" + variableIndex.toString()
				} else {
					varIndexExt = variableIndex.toString()
				}
				variablesArray.push({
					tag: `M${knxLineIndex}_${varIndexExt}_${signal.room}_${signal.plcTag}_${signalType.signalName}`,
					plcTag: signal.plcTag[0],
					componentType: signal.plcTag[0].slice(
						0,
						CONFIG.tfmComponentCodeLength
					),
					tfmTag: signal.tfmTag,
					signalType: signalType.signalType,
					signalName: signalType.signalName,
					roomName: signal.room,
					knxIndex: variableIndex,
					knxLineIndex: knxLineIndex,
				})
				variableIndex += 1
			}
		})
	})

	variablesArray.sort((a, b) => a.knxIndex - b.knxIndex)
	return variablesArray
}

module.exports = (knxLines) => {
	const knxVariables = []
	knxLines.forEach((mainLine, index) => {
		const knxLineIndex = index + 1
		let knxIndex = 1

		// Lag array med variabler
		const variableArray = createVariableArray(mainLine.signals, knxLineIndex)
		knxVariables.push(variableArray)

		// Lag ny PRG
		writeXml.pouHeader(`PRG_KnxLine_${index + 1}`)

		// Skriv variabler
		variableArray.forEach((variable) => {
			writeXml.pouVariable(variable.tag, variable.signalType)
		})

		// Avslutt variabelfelt
		writeXml.pouMiddle()

		// Lag funksjonsblokker
		variableArray.forEach((variable) => {
			if (createFunctionBlocks.hasOwnProperty(variable.signalName)) {
				writeXml.pouFunctions(
					createFunctionBlocks[variable.signalName](variable, knxLineIndex)
				)
			}
		})

		// Avslutt PRG
		writeXml.pouEnd()
	})

	// Skriv variablene til fil
	try {
		fs.writeFileSync("knxVariables.json", JSON.stringify({ knxVariables }))
	} catch (err) {
		console.error(err)
	}
}

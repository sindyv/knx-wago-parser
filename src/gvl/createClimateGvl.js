const { rooms } = require("../../jsonOutput.json")
const { knxLines } = require("../../jsonKnxOutput.json")
const { knxVariables } = require("../../knxVariables.json")
const writeXml = require("../xml/writeXML")
const config = require("../../config.json")

module.exports = () => {
	// Globale variabler
	writeXml.globalvarsHeader("GVL_ClimateControl")
	rooms.forEach((room) => {
		writeXml.globalvarsVar(
			`typClimateControllerInterface_${room.roomName}`,
			"typMultiModeClimateControl_00_01"
		)
	})
	writeXml.globalvarsFooter()

	// Peristent
	writeXml.globalvarsHeader("GVL_Persistent")

	rooms.forEach((room) => {
		writeXml.globalvarsVar(
			`typClimateControllerSettings_${room.roomName}`,
			"typMultiModeClimateControlSettings_00_01"
		)
	})
	writeXml.globalvarsFooter()
}

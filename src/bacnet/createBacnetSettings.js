const { rooms } = require("../../jsonOutput.json")
const bacnetMappingData = require("./bacnetMappingsData")
const writeXml = require("../xml/writeXML")
const config = require("../../config.json")
const usePlaceholders = require("../usePlaceholders")

module.exports = () => {
	// Lag ny PRG
	writeXml.pouHeader(`PRG_ClimateControl_BACnet_Settings`)

	// Ingen variabler i denne POU

	// Avslutt variabelfelt, start kodefelt
	writeXml.pouMiddle()

	// Gå igjennom alle rom
	rooms.forEach((room) => {
		// Gå igjennom alle komponenter
		room.components.forEach((component) => {
			// Gå igjennom tilknyttede BACnet-variabler
			component.bacnetVars.forEach((bacnetVar) => {
				config.bacnetVars.forEach((configBacnetVar) => {
					if (
						configBacnetVar.name === bacnetVar &&
						configBacnetVar.hasOwnProperty("stateTexts")
					) {
						configBacnetVar.stateTexts.forEach((stateText, index) => {
							const tagName = `${config.bacnetTagPrefix}${room.tagPrefix}_${component.type}${component.suffix}_${configBacnetVar.name}_${config.bacnetTagRoomPrefix}${room.roomName}`
							writeXml.pouFunctions(
								`
                                ${tagName}.setStateText(${
									index + 1
								}, ${stateText})`
							)
						})
					}
				})
			})
		})
		// Gå igjennom BACnet tag registrert på komponenten

		//
	})

	// Avslutt PRG
	writeXml.pouEnd()
}

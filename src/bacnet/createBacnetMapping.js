const { rooms } = require("../../jsonOutput.json")
const bacnetMappingData = require("./bacnetMappingsData")
const writeXml = require("../xml/writeXML")
const config = require("../../config.json")
const usePlaceholders = require("../usePlaceholders")

module.exports = () => {
	// Lag ny PRG
	writeXml.pouHeader(`PRG_ClimateControl_Mapping`)

	// Ingen variabler i denne POU

	// Avslutt variabelfelt, start kodefelt
	writeXml.pouMiddle()

	// Gå igjennom alle rom
	rooms.forEach((room) => {
		writeXml.pouFunctions(
			`\n
            // BACnet-mapping for rom ${room.roomName} - Romtype ${room.roomType}`
		)
		// Gå igjennom alle komponenter
		room.components.forEach((component) => {
			// Gå igjennom tilknyttede BACnet-variabler
			component.bacnetVars.forEach((bacnetVar) => {
				bacnetMappingData.components.forEach((mappingComponent) => {
					// Finn tilsvarende komponent i bacnetMappingData
					if (mappingComponent.type === component.type) {
						mappingComponent.bacnetMappings.forEach((bacnetMapping) => {
							// Finn tilsvarende BACnet-tag i mapping-komponenten
							if (bacnetVar === bacnetMapping.varName) {
								const tagName = `${config.bacnetTagPrefix}${room.tagPrefix}_${component.type}${component.suffix}_${bacnetMapping.varName}_${config.bacnetTagRoomPrefix}${room.roomName}`
								let mapping = ``
								// Sjekk om det en innkommende eller utgående variabel
								if (bacnetMapping.incomingValue) {
									mapping = `${usePlaceholders(
										bacnetMapping.mapSource,
										room
									)}.${usePlaceholders(
										bacnetMapping.mapSourceSuffix,
										room
									)} := ${tagName}${bacnetMapping.mapTarget}`
								} else {
									mapping = `${tagName}${
										bacnetMapping.mapTarget
									} := ${usePlaceholders(
										bacnetMapping.mapSource,
										room
									)}.${usePlaceholders(bacnetMapping.mapSourceSuffix, room)}`
								}

								// Skriv til XML-fil
								writeXml.pouFunctions(
									`
                                            ${mapping};`
								)
							}
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

const { rooms } = require("../../jsonOutput.json")
const writeXml = require("../xml/writeXML")
const config = require("../../config.json")
const usePlaceholders = require("../usePlaceholders")
const {
	components: bacnetMappingData,
} = require("../bacnet/bacnetMappingsData")

module.exports = () => {
	// Lag ny PRG
	writeXml.pouHeader(`PRG_ReadRetainValues`)

	// Avslutt variabelfelt
	writeXml.pouMiddle()
	rooms.forEach((room) => {
		room.components.forEach((component) => {
			bacnetMappingData.forEach((mapDataComponent) => {
				if (mapDataComponent.type === component.type) {
					mapDataComponent.bacnetMappings.forEach((bacnetMapping) => {
						if (bacnetMapping.incomingValue) {
							const tagName = `${config.bacnetTagPrefix}${room.tagPrefix}_${component.type}${component.suffix}_${bacnetMapping.varName}_${config.bacnetTagRoomPrefix}${room.roomName}`
							const map = `
                            ${tagName}${
								bacnetMapping.mapTarget
							} := ${usePlaceholders(
								bacnetMapping.mapSource,
								room
							)}.${usePlaceholders(bacnetMapping.mapSourceSuffix, room)}`

							writeXml.pouFunctions(map)
						}
					})
				}
			})
		})
	})
	// Avslutt PRG
	writeXml.pouEnd()
}

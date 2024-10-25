const knxJSON = require("../../jsonOutput.json")
const writeXML = require("../xml/writeXML")
const config = require("../../config.json")

module.exports = () => {
	const bacnetVars = []
	// Skriv GVL-header til XML
	writeXML.globalvarsHeader("GVL_BACnet_ClimateControl")

	// Lag indexer for de forskjellige BACnet-typene
	let indexes = {
		FbAnalogValue: 0,
		FbAnalogInput: 0,
		FbAnalogOutput: 0,
		FbBinaryValue: 0,
		FbBinaryInput: 0,
		FbBinaryOutput: 0,
		FbMultiStateValue: 0,
	}

	knxJSON.rooms.forEach((room) => {
		// Gå igjennom hver komponent i rommet
		// Lag BACnet tags basert på komponent
		room.components.forEach((component) => {
			component.bacnetVars.forEach((bacnetVar) => {
				config.bacnetVars.forEach((configVar) => {
					if (
						bacnetVar === configVar.name &&
						component.type === configVar.component
					) {
						// Definer parametre
						const index = indexes[configVar.type]
						const tagName = `${config.bacnetTagPrefix}${room.tagPrefix}_${configVar.component}${component.suffix}_${configVar.name}_${config.bacnetTagRoomPrefix}${room.roomName}`
						let initData = ``
						// Sjekk om BACnet-tagget har egen config componentSuffix
						if (configVar.hasOwnProperty("config")) {
							initData = `\n`
							configVar?.config.forEach((config, index) => {
								if (index === configVar.config.length - 1) {
									initData += `               ${config} \n`
								} else {
									initData += `               ${config}, \n`
								}
							})
						}
						// Definer codesys-deklarasjonen
						const type = `${configVar.type}_${configVar.size} (${index}) ${
							initData !== "" ? `:= (${initData}         )` : ""
						}`
						// Skriv variabel til XML-filen
						writeXML.globalvarsVar(tagName, type)
						bacnetVars.push({ tagName, type: configVar.type })
						// Inkrementer indexen for den aktuelle BACnet-typen
						indexes[configVar.type] += 1
					}
				})
			})
		})
	})

	// console.log(bacnetVars)

	//console.log(indexes)

	// skriv GVL-footer
	writeXML.globalvarsFooter()
}

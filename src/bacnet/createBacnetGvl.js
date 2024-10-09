const knxJSON = require("../../jsonOutput.json")
const writeXML = require("../xml/writeXML")
const config = require("../../config.json")

module.exports = () => {
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
	}

	knxJSON.rooms.forEach((room) => {
		// Gå igjennom hver komponent i rommet
		// Lag BACnet tags basert på komponent
		room.components.forEach((component) => {
			if (Array.isArray(component.bacnetTags)) {
				component.bacnetTags.forEach((bacnetTag) => {
					config.bacnetVars.forEach((bacnetVar) => {
						if (bacnetTag === bacnetVar.name) {
							// Definer parametre
							const name = `${config.bacnetTagPrefix}${component.plcTag}_${
								bacnetVar.name
							}_R0${room.roomName.replace(".", "_")}`

							const index = indexes[bacnetVar.type]

							let initData = ``

							// Sjekk om BACnet-tagget har egen config
							if (bacnetVar.hasOwnProperty("config")) {
								initData = `\n`
								bacnetVar?.config.forEach((config, index) => {
									if (index === bacnetVar.config.length - 1) {
										initData += `               ${config} \n`
									} else {
										initData += `               ${config}, \n`
									}
								})
							}

							// Definer codesys-deklarasjonen
							const type = `${bacnetVar.type}_${bacnetVar.size} (${index}) ${
								initData !== "" ? `:= (${initData}         )` : ""
							}`

							// Skriv variabel til XML-filen
							writeXML.globalvarsVar(name, type)

							// Inkrementer indexen for den aktuelle BACnet-typen
							indexes[bacnetVar.type] += 1
						}
					})
				})
			}
		})
	})

	// skriv GVL-footer
	writeXML.globalvarsFooter()
}

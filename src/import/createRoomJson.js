const config = require("../../config.json")
const usePlaceholders = require("../usePlaceholders")
const createRoomJson = (groupAddresses, roomMatrix) => {
	let data = { rooms: [] }

	/*
        Beskrivelse:

    */

	roomMatrix.forEach((res, index) => {
		if (index > 0) {
			// Hent data fra excel-arket
			const roomName = res[0].toString()
			const roomType = res[1]

			// Lag tag-prefix basert på config
			const tagPrefix = `${config.tagSystem}_${usePlaceholders(
				config.tagNumber,
				{ roomName }
			)}`

			const components = []

			// Legg til komponenter til rommet basert på romtype og config
			config.roomTypes.forEach((type) => {
				if (type.type === roomType) {
					type.components.forEach((component) => {
						const componentObject = {
							type: component.type,
							suffix: component.suffix,
							bacnetVars: [...component.bacnetVars],
						}
						components.push(componentObject)
					})
				}
			})

			const roomObject = {
				roomName,
				roomType,
				tagPrefix,
				components,
			}

			data.rooms.push(roomObject)
		}
	})

	// Sorter rom etter romnavn
	data.rooms.sort((a, b) => {
		const dataA = a.roomName.toUpperCase()
		const dataB = b.roomName.toUpperCase()

		if (dataA > dataB) {
			return 1
		} else if (dataA < dataB) {
			return -1
		} else {
			return 0
		}
	})

	// Sjekk etter duplikater
	data.rooms.forEach((room) => {
		const exists = data.rooms.filter(
			(roomcheck) => roomcheck.roomName === room.roomName
		)
		if (exists.length > 1) {
			console.log("Følgende rom har duplikater: " + exists[0].roomName)
		}
	})
	return data
}

module.exports = createRoomJson

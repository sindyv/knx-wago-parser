const config = require("../../config.json")
const createRoomJson = (groupAddresses, roomMatrix) => {
	let data = { rooms: [] }

	groupAddresses.forEach((res) => {
		if (res[0].includes("=")) {
			// Sjekk at dataen inneholder et romnummer
			if (res[6]) {
				// Opprett KNX-objekt
				const knxSignalObject = {
					signal: res[0].split(" - ")[1],
					mainGroup: res[1],
					middleGroup: res[2],
					subGroup: res[3],
				}

				// finn romnavn
				const roomName = res[6].split(" ")[1]

				// Sjekk om rommet allerede eksisterer i listen
				const exists = data.rooms.filter((room) => room.roomName === roomName)

				// Opprett rommet hvis det ikke eksisterer
				if (exists.length === 0) {
					// Finn romtype
					let roomType = ""
					roomMatrix.forEach((res) => {
						if (res[0] === roomName) {
							roomType = res[1]
						}
					})

					// Opprett romobjekt basert på linjeinformasjonen fra excel
					const roomObject = {
						roomType,
						line: [],
						roomName: res[6].split(" ")[1],
						components: [],
					}

					// Legg til hvilken linje(r) rommet er tilknyttet
					roomObject.line.push(knxSignalObject.mainGroup)

					// Legg rommet til i listen
					data.rooms.push(roomObject)
				}

				// Finn rommet med navnet fra raden i excel
				const [room] = data.rooms.filter((room) => room.roomName === roomName)

				// Opprett komponentnavn
				const componentName = res[0].split(" - ")[0]

				// sjekk om komponent allerede eksisterer i rommet
				const [existingComponent] = room.components.filter(
					(component) => component.tfmTag === componentName
				)

				if (existingComponent) {
					existingComponent.knxSignals.push(knxSignalObject)
				} else {
					// Komponenten finnes ikke, opprett nytt objekt

					// Finn komponenttype
					const componentType = res[0]
						.split(" - ")[0]
						.split("-")[1]
						.slice(0, config.tfmComponentCodeLength)

					// Sjekk hvilke bacnet-tag denne skal ha
					let bacnetVars = []
					config.roomTypes.forEach((roomType) => {
						if (roomType.type === room.roomType) {
							if (Array.isArray(roomType.components)) {
								roomType.components.forEach((component) => {
									if (component.type === componentType) {
										bacnetVars = [...component.bacnetVars]
									}
								})
							}
						}
					})
					const component = {
						type: componentType,
						tfmTag: componentName,
						plcTag: componentName
							.replace("=", "_")
							.replace("-", "_")
							.replace(".", "_"),
						bacnetTags: bacnetVars,
						knxSignals: [],
					}
					// Legg signalet til under komponenten
					component.knxSignals.push(knxSignalObject)
					room.components.push(component)
				}
			}
		}
	})

	data.rooms.sort((a, b) => {
		dataA = a.roomName.toUpperCase()
		dataB = b.roomName.toUpperCase()

		if (dataA > dataB) {
			return 1
		} else if (dataA < dataB) {
			return -1
		} else {
			return 0
		}
	})

	// Logg ut rom som ikke får romtype
	data.rooms.forEach((room) => {
		if (!room.hasOwnProperty("roomType")) {
			console.log("Dette rommet har ikke romtype! - Rom " + room.roomName)
		}
	})

	return data
}

module.exports = createRoomJson

const config = require("../../config.json")
const createRoomJson = (groupAddresses, roomMatrix) => {
	let data = { rooms: [] }

	groupAddresses.forEach((res) => {
		if (res[0].includes("=")) {
			// Sjekk at dataen inneholder et romnummer
			if (res[6]) {
				// find room name
				const roomName = res[6].split(" ")[1]

				// Finn romtype
				let roomType = ""
				roomMatrix.forEach((res) => {
					if (res[0] === roomName) {
						roomType = res[1]
					}
				})

				// Opprett komponentnavn
				const componentName = res[0].split(" - ")[0]
				const componentType = res[0].split(" - ")[0].split("-")[1].slice(0, 3)
				// Opprett signalobjekt basert på informasjonen i raden fra excel
				const knxSignalObject = {
					signal: res[0].split(" - ")[1],
					mainGroup: res[1],
					middleGroup: res[2],
					subGroup: res[3],
				}

				// Sjekk om rommet allerede eksisterer i listen
				const exists = data.rooms.filter((room) => room.roomName === roomName)

				if (exists.length === 0) {
					// Opprett romobjekt basert på linjeinformasjonen fra excel
					const roomObject = {
						roomType,
						line: [],
						roomName: res[6].split(" ")[1],
						components: [],
					}

					// Opprett komponent-objekt
					const component = {
						type: componentType,
						tfmTag: componentName,
						plcTag: componentName
							.replace("=", "_")
							.replace("-", "_")
							.replace(".", "_"),
						bacnetTags: [],
						knxSignals: [],
					}

					// Legg signalet til under ommet
					component.knxSignals.push(knxSignalObject)

					// Legg til hvilken linje(r) rommet er tilknyttet
					roomObject.line.push(knxSignalObject.mainGroup)

					// Legg til BACnet-tag til komponenten

					// Legg til komponenten under rommet
					roomObject.components.push(component)

					// Legg rommet til i listen
					data.rooms.push(roomObject)
				} else {
					// Finn rommet med navnet fra raden i excel
					const [room] = data.rooms.filter((room) => room.roomName === roomName)

					// sjekk om komponent eksisterer i rommet
					const [component] = room.components.filter(
						(component) => component.tfmTag === componentName
					)

					if (component) {
						component.knxSignals.push(knxSignalObject)
					} else {
						// Opprett komponent-objekt
						const component = {
							tfmTag: componentName,
							plcTag: componentName
								.replace("=", "_")
								.replace("-", "_")
								.replace(".", "_"),
							knxSignals: [],
						}
						// Legg signalet til under komponenten
						component.knxSignals.push(knxSignalObject)
						room.components.push(component)
					}
				}
			}
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

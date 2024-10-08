const createRoomJson = (groupAddresses) => {
  let data = { rooms: [] };
  groupAddresses.forEach((res) => {
    if (res[0].includes("=")) {
      // Sjekk at dataen inneholder et romnummer
      if (res[6]) {
        // find room name
        const roomName = res[6].split(" ")[1];

        // Opprett komponentnavn
        const componentName = res[0].split(" - ")[0];
        // Opprett signalobjekt basert på informasjonen i raden fra excel
        const signalObject = {
          signal: res[0].split(" - ")[1],
          mainGroup: res[1],
          middleGroup: res[2],
          subGroup: res[3],
        };

        // Sjekk om rommet allerede eksisterer i listen
        const exists = data.rooms.filter((room) => room.roomName === roomName);

        if (exists.length === 0) {
          // Opprett romobjekt basert på linjeinformasjonen fra excel
          const roomObject = {
            line: [],
            roomName: res[6].split(" ")[1],
            components: [],
          };

          // Opprett komponent-objekt
          const component = {
            tfmTag: componentName,
            plcTag: componentName
              .replace("=", "_")
              .replace("-", "_")
              .replace(".", "_"),
            signals: [],
          };

          // Legg signalet til under ommet
          component.signals.push(signalObject);

          // Legg til hvilken linje(r) rommet er tilknyttet
          roomObject.line.push(signalObject.mainGroup);

          // Legg til komponenten under rommet
          roomObject.components.push(component);

          // Legg rommet til i listen
          data.rooms.push(roomObject);
        } else {
          // Finn rommet med navnet fra raden i excel
          const [room] = data.rooms.filter(
            (room) => room.roomName === roomName
          );

          // sjekk om komponent eksisterer i rommet
          const [component] = room.components.filter(
            (component) => component.tfmTag === componentName
          );

          if (component) {
            component.signals.push(signalObject);
          } else {
            // Opprett komponent-objekt
            const component = {
              tfmTag: componentName,
              plcTag: componentName
                .replace("=", "_")
                .replace("-", "_")
                .replace(".", "_"),
              signals: [],
            };
            // Legg signalet til under komponenten
            component.signals.push(signalObject);
            room.components.push(component);
          }
        }
      }
    }
  });

  return data;
};

module.exports = createRoomJson;

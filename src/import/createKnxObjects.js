const createKnxObjects = (groupAddresses) => {
  const lines = [];

  // Find lines
  groupAddresses.forEach((res) => {
    if (res[0].includes("=")) {
      const lineExists = lines.filter((line) => line.number === res[1]);

      if (lineExists.length === 0) {
        lines.push({ number: res[1], signals: [] });
      }
    }
  });

  // Legg til signaler
  groupAddresses.forEach((res) => {
    lines.forEach((line) => {
      if (res[1] === line.number && res[0].includes("=")) {
        const componentName = res[0].split(" - ")[0];
        const signalObject = {
          signalName: res[0].split(" - ")[1],
          room: res[6]?.split(" ")[1]?.replace(".", "_"),
          plcTag: componentName.split("-").slice(-1),
          tfmTag: res[0]
            .split(" - ")[0]
            .replace(".", "_")
            .replace("-", "_")
            .replace("=", ""),
        };

        line.signals.push(signalObject);
      }
    });
  });
  return lines;
};

module.exports = createKnxObjects;

const writeXml = require("../xml/writeXML");
const createFunctionBlocks = require("./functionBlocks");
const { variablesTypesList } = require("../../config.json");
const CONFIG = require("../../config.json");
const createVariableArray = (signalArray, knxLineIndex) => {
  // Lag en variabel indeks
  let variableIndex = 1;

  // Lag variabel-array
  let variablesArray = [];

  signalArray.forEach((signal) => {
    variablesTypesList.forEach((signalType) => {
      if (signal.signalName === signalType.signalName) {
        let varIndexExt = "";
        if (variableIndex < 10) {
          varIndexExt = "00" + variableIndex.toString();
        } else if (variableIndex < 100) {
          varIndexExt = "0" + variableIndex.toString();
        } else {
          varIndexExt = variableIndex.toString();
        }
        variablesArray.push({
          tag: `M${knxLineIndex}_${varIndexExt}_${signal.room}_${signal.plcTag}_${signalType.signalName}`,
          plcTag: signal.plcTag,
          tfmTag: signal.tfmTag,
          signalType: signalType.signalType,
          signalName: signalType.signalName,
          roomName: signal.room,
          bacnetTag: `${CONFIG.bacnetTagPrefix}_${signal.tfmTag}_${signal.signalName}_R0${signal.room}`,
          knxIndex: variableIndex,
        });
        variableIndex += 1;
      }
    });
  });

  variablesArray.sort((a, b) => a.knxIndex - b.knxIndex);

  return variablesArray;
};
module.exports = (knxLines) => {
  knxLines.forEach((mainLine, index) => {
    const knxLineIndex = index + 1;
    let knxIndex = 1;

    const variableArray = createVariableArray(mainLine.signals, knxLineIndex);
    // console.log(variableArray[0]);
    // Lag array med variabler

    // Lag ny PRG
    writeXml.pouHeader(`KNX_${index + 1}`);

    // Skriv variabler
    variableArray.forEach((variable) => {
      writeXml.pouVariable(variable.tag, variable.signalType);
    });

    // Avslutt variabelfelt
    writeXml.pouMiddle();

    // Lag funksjonsblokker
    variableArray.forEach((variable) => {
      if (createFunctionBlocks.hasOwnProperty(variable.signalName)) {
        writeXml.pouFunctions(
          createFunctionBlocks[variable.signalName](variable, knxLineIndex)
        );
      }
    });

    // Avslutt PRG
    writeXml.pouEnd();
  });
};

const { rooms } = require("../../jsonOutput.json")
const { knxLines } = require("../../jsonKnxOutput.json")
const { knxVariables } = require("../../knxVariables.json")
const writeXml = require("../xml/writeXML")
const config = require("../../config.json")

module.exports = () => {
	rooms.forEach((room) => {
		// Lag ny PRG
		writeXml.pouHeader(`ClimateControl_${room.roomName}`)

		writeXml.pouVariable("climateController", "FbMultiModeClimateControl_00_01")
		writeXml.pouVariable(
			"defaultSetpoints",
			"typMultiModeClimateControllerDefaultSettings_00_01"
		)
		writeXml.pouVariable(
			"dwConfigurationMask",
			"DWORD := 2#0000_0000_0000_0000_0000_000_0000_0010"
		)

		// Variabler for overvåking
		writeXml.pouVariable("actualSetpointHeating", "REAL")
		writeXml.pouVariable("actualSetpointCooling", "REAL")
		writeXml.pouVariable("actualSetpointCo2", "REAL")
		writeXml.pouVariable("meanTemp", "REAL")
		writeXml.pouVariable("meanCo2", "REAL")
		writeXml.pouVariable("presence", "BOOL")
		writeXml.pouVariable("gainHeating", "REAL")
		writeXml.pouVariable("gainCooling", "REAL")
		writeXml.pouVariable("gainAirQuality", "REAL")
		writeXml.pouVariable("damperOutput", "REAL")
		writeXml.pouVariable(
			"currentWorkingMode",
			"enumMultiModeClimateActiveControlMode_00_01"
		)

		// Avslutt variabelfelt
		writeXml.pouMiddle()
		let pouStart = `
// Innstillinger for rom:
IF (firstScan) THEN
    PersistentVars.typClimateControllerSettings_${room.roomName}.ahuSystem		:= 001;
    PersistentVars.typClimateControllerSettings_${room.roomName}.heatingSystem	:= 001;
    PersistentVars.typClimateControllerSettings_${room.roomName}.coolingSystem	:= 001;
    defaultSetpoints 							:= PersistentVars.typClimateControlDefaultSettings;
    
// Hvis du ønsker egne innstillinger for rommet, kjør settings
    // settings();
END_IF

// Tilbakestill settpunkt (global kommando)
IF (GVL.initDefaultSettings) THEN
    climateController.initSetpoints();
END_IF

        `
		writeXml.pouFunctions(pouStart)

		mapSensors(
			"Registrer temperaturer",
			knxVariables,
			room,
			"TMP_ACT",
			"Temp",
			"rValue_OUT"
		)

		mapSensors(
			"Registrer CO2",
			knxVariables,
			room,
			"CO2_ACT",
			"CO2",
			"rValue_OUT"
		)

		mapSensors(
			"Registrer tilstedeværelse",
			knxVariables,
			room,
			"MOV_ACT",
			"Presence",
			"xSwitch_OUT"
		)

		writeXml.pouFunctions(`
meanTemp					:= typClimateControllerInterface_${room.roomName}.actuators.heating.processValue;
meanCo2						:= climateController.Co2;
presence					:= climateController.Presence;

actualSetpointHeating 		:= typClimateControllerInterface_${room.roomName}.actuators.heating.setpoint;
gainHeating 				:= typClimateControllerInterface_${room.roomName}.actuators.heating.controlledVariable;

actualSetpointCooling 		:= typClimateControllerInterface_${room.roomName}.actuators.cooling.setpoint;
gainCooling 				:= typClimateControllerInterface_${room.roomName}.actuators.cooling.controlledVariable;

actualSetpointCo2			:= typClimateControllerInterface_${room.roomName}.actuators.airQuality.setpoint;
gainAirQuality				:= typClimateControllerInterface_${room.roomName}.actuators.airQuality.controlledVariable; 
damperOutput				:= typClimateControllerInterface_${room.roomName}.actuators.damper.setpoint;

currentWorkingMode			:= typClimateControllerInterface_${room.roomName}.currentMode;        

// Kjør funksjonsblokk
climateController(
    typController			:= typClimateControllerInterface_${room.roomName}, 
    typSettings				:= PersistentVars.typClimateControllerSettings_${room.roomName}, 
    dwConfigurationMask		:= dwConfigurationMask            
);
            `)

		// Avslutt PRG
		writeXml.pouEnd()
	})
}

function mapSensors(
	comment,
	knxVariables,
	room,
	knxSignalType,
	funcionSignalType,
	knxOutputType
) {
	const signalArray = []

	// Skriv kommentar
	writeXml.pouFunctions(`
// ${comment}`)

	knxVariables.forEach((knxLine) => {
		const match = knxLine.filter(
			(signal) =>
				signal.roomName === room.roomName && signal.signalName === knxSignalType
		)
		signalArray.push(...match)
	})

	signalArray.forEach((signal) => {
		writeXml.pouFunctions(
			`
climateController.${funcionSignalType}          := PRG_KnxLine_${signal.knxLineIndex}.${signal.tag}.${knxOutputType};`
		)
	})
	writeXml.pouFunctions("\n")
}

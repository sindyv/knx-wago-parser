module.exports = {
	components: [
		{
			type: "RT",

			bacnetMappings: [
				{
					incomingValue: false,
					varName: "SPV",
					mapSource: "GVL_ClimateControl",
					mapSourceSuffix:
						"typClimateControllerInterface_{{roomName}}.actuators.heating.setpoint",
					mapTarget: ".rPresentValue",
				},
				{
					incomingValue: true,
					varName: "SPV_Komf",
					mapSource: "PersistentVars",
					mapSourceSuffix:
						"typClimateControllerSettings_{{roomName}}.heating.comfort.setpoint",
					mapTarget: ".rPresentValue",
				},
				{
					incomingValue: true,
					varName: "SPV_Stdb",
					mapSource: "PersistentVars",
					mapSourceSuffix:
						"typClimateControllerSettings_{{roomName}}.heating.standby.setpoint",
					mapTarget: ".rPresentValue",
				},
				{
					incomingValue: true,
					varName: "SPV_Natt",
					mapSource: "PersistentVars",
					mapSourceSuffix:
						"typClimateControllerSettings_{{roomName}}.heating.economy.setpoint",
					mapTarget: ".rPresentValue",
				},
				{
					incomingValue: false,
					varName: "SPC",
					mapSource: "GVL_ClimateControl",
					mapSourceSuffix:
						"typClimateControllerInterface_{{roomName}}.actuators.cooling.setpoint",
					mapTarget: ".rPresentValue",
				},
				{
					incomingValue: true,
					varName: "SPC_Komf",
					mapSource: "PersistentVars",
					mapSourceSuffix:
						"typClimateControllerSettings_{{roomName}}.cooling.comfort.setpoint",
					mapTarget: ".rPresentValue",
				},
				{
					incomingValue: true,
					varName: "SPC_Stdb",
					mapSource: "PersistentVars",
					mapSourceSuffix:
						"typClimateControllerSettings_{{roomName}}.cooling.standby.setpoint",
					mapTarget: ".rPresentValue",
				},
				{
					incomingValue: true,
					varName: "SPC_Natt",
					mapSource: "PersistentVars",
					mapSourceSuffix:
						"typClimateControllerSettings_{{roomName}}.cooling.economy.setpoint",
					mapTarget: ".rPresentValue",
				},
				{
					incomingValue: false,
					varName: "MV",
					mapSource: "ClimateControl_{{roomName}}",
					mapSourceSuffix: "climateController.Temp",
					mapTarget: ".rIN",
				},
				{
					incomingValue: true,
					varName: "KMD_MSV",
					mapSource: "PersistentVars",
					mapSourceSuffix: "typClimateControllerSettings_{{roomName}}.calendar",
					mapTarget: ".udiPresentValue",
				},
				{
					incomingValue: false,
					varName: "MOD_FB",
					mapSource: "GVL_ClimateControl",
					mapSourceSuffix:
						"typClimateControllerInterface_{{roomName}}.currentMode",
					mapTarget: ".udiPresentValue",
				},
			],
		},
		{
			type: "RB",
			bacnetMappings: [
				{
					incomingValue: false,
					varName: "D",
					mapSource: "ClimateControl_{{roomName}}",
					mapSourceSuffix: "climateController.Presence",
					mapTarget: ".xIN",
				},
			],
		},
		{
			type: "LH",
			bacnetMappings: [
				{
					incomingValue: false,
					varName: "C",
					mapSource: "typClimateControllerInterface_{{roomName}}",
					mapSourceSuffix: "actuators.heating.controlledVariable",
					mapTarget: ".rPresentValue",
				},
			],
		},
		{
			type: "RY",
			bacnetMappings: [
				{
					incomingValue: false,
					varName: "MV",
					mapSource: "ClimateControl_{{roomName}}",
					mapSourceSuffix: "climateController.Co2",
					mapTarget: ".rIN",
				},
				{
					incomingValue: true,
					varName: "SP",
					mapSource: "PersistentVars",
					mapSourceSuffix:
						"typClimateControllerSettings_{{roomName}}.co2.comfort.setpoint",
					mapTarget: ".rPresentValue",
				},
			],
		},
		{
			type: "SQ",
			bacnetMappings: [
				{
					incomingValue: false,
					varName: "CO2_C",
					mapSource: "GVL_ClimateControl",
					mapSourceSuffix:
						"typClimateControllerInterface_{{roomName}}.actuators.airQuality.controlledVariable",
					mapTarget: ".rPresentValue",
				},
				{
					incomingValue: false,
					varName: "KJL_C",
					mapSource: "GVL_ClimateControl",
					mapSourceSuffix:
						"typClimateControllerInterface_{{roomName}}.actuators.cooling.controlledVariable",
					mapTarget: ".rPresentValue",
				},
			],
		},
	],
}

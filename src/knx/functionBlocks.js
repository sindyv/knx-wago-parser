module.exports = {
  TMP_ACT: (variable, knxLineIndex) => {
    return `
        ${variable.tag}(
            bPortKNX      := ${knxLineIndex},
            dwIndex_DPT   := ${variable.knxIndex},
            typDPT        := PersistentVars.typDPT[${knxLineIndex}][${variable.knxIndex}],
            xUpdate_PLC   => ,
            xTimeOut      => );

            GVL_ClimateControl.fbClimateControllerRoom${variable.roomName}.Temp := ${variable.bacnetTag}.rValue_Out;
        `;
  },
  MOV_ACT: (variable, knxLineIndex) => {
    return `
        ${variable.tag}(
            bPortKNX      := ${knxLineIndex}, 
            dwIndex_DPT   := ${variable.knxIndex}, 
            typDPT        := PersistentVars.typDPT[${knxLineIndex}][${variable.knxIndex}], 
            xSwitch_OUT   => GVL_ClimateControl.presenceDetectorRoom${variable.roomName}.0);
        `;
  },
  CO2_ACT: (variable, knxLineIndex) => {
    return `
        ${variable.tag}(
            bPortKNX      := ${knxLineIndex},
            dwIndex_DPT   := ${variable.knxIndex},
            typDPT        := PersistentVars.typDPT[${knxLineIndex}][${variable.knxIndex}],
            xUpdate_PLC   => ,
            xTimeOut      => );

            GVL_ClimateControl.fbClimateControllerRoom${variable.roomName}.Co2 := ${variable.bacnetTag}.rValue_Out;
        `;
  },
  CV: (variable, knxLineIndex) => {
    return `
        ${variable.tag}(
            bPortKNX		  := ${knxLineIndex}, 
            dwIndex_DPT		:= ${variable.knxIndex}, 
            typDPT			  := PersistentVars.typDPT[${knxLineIndex}][${variable.knxIndex}],
            xUpdate_KNX		:= PRG_KnxMaster.updateHeat, 
            rValue_IN		  := GVL_BACnet_ClimateControl.${variable.bacnetTag}.IOUT.rValue,
            );
            `;
  },
  POS_ACT: (variable, knxLineIndex) => {
    return `
        ${variable.tag}(
            bPortKNX		   := ${knxLineIndex}, 
            dwIndex_DPT		:= ${variable.knxIndex}, 
            typDPT			  := PersistentVars.typDPT[${knxLineIndex}][${variable.knxIndex}],,
            xUpdate_KNX		:= PRG_KnxMaster.updateHeat, 
            rValue_OUT		:= ,
            );

        GVL_BACnet_ClimateControl.${variable.bacnetTag}.xIN := ${variable.tag}.xTimeout;
            `;
  },
};

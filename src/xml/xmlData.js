const header = () => {
  return `<?xml version="1.0" encoding="utf-8"?>
<project xmlns="http://www.plcopen.org/xml/tc6_0200">
  <fileHeader companyName="" productName="CODESYS" productVersion="CODESYS V3.5 SP19 Patch 2" creationDateTime="2024-10-03T10:19:48.2662044" />
  <contentHeader name="Untitled1.project" modificationDateTime="2024-10-03T10:12:01.335834">
    <coordinateInfo>
      <fbd>
        <scaling x="1" y="1" />
      </fbd>
      <ld>
        <scaling x="1" y="1" />
      </ld>
      <sfc>
        <scaling x="1" y="1" />
      </sfc>
    </coordinateInfo>
    <addData>
      <data name="http://www.3s-software.com/plcopenxml/projectinformation" handleUnknown="implementation">
        <ProjectInformation />
      </data>
    </addData>
  </contentHeader>
  <types>
    <dataTypes />
    <pous>`;
};

const pouHeader = (puoName) => {
  return `
          <pou name="${puoName}" pouType="program">
            <interface>
              <localVars>
    `;
};

const pouVariable = (name, type) => {
  return `
                        <variable name="${name}" > 
                          <type>
                            <derived name="${type}" /> 
                          </type>
                        </variable>   
    `;
};

const pouMiddle = () => {
  return `
              </localVars>
            </interface>
            <body>
              <ST>
                <xhtml xmlns="http://www.w3.org/1999/xhtml">
    `;
};

const pouEnd = () => {
  return `
                </xhtml>
              </ST>
            </body>
            <addData />
          </pou>
    `;
};

const gvlHeader = (name) => {
  return `
        <data name="http://www.3s-software.com/plcopenxml/globalvars" handleUnknown="implementation">
          <globalVars name="${name}" >
    `;
};

const gvlFooter = () => {
  return `
          </globalVars>
        </data>
    `;
};

const middle = () => {
  return `
        </pous>
      </types>
      <instances>
        <configurations />
      </instances>
      <addData>`;
};

const footer = () => {
  return `
      </addData>
    </project>
    `;
};

module.exports = {
  header,
  middle,
  footer,
  pouHeader,
  pouVariable,
  pouMiddle,
  pouEnd,
  gvlHeader,
  gvlFooter,
};

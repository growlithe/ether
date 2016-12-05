"use strict";

var handler = function() {
  var name = 'Security_Authenticate';
  var payload = {
    userIdentifier: {
      originIdentification: {
        sourceOffice: process.env.SOURCEOFFICE
      },
      originatorTypeCode: 'U',
      originator: process.env.ORIGINATOR
    },
    dutyCode: {
      dutyCodeDetails: {
        referenceQualifier: 'DUT',
        referenceIdentifier: 'SU'
      }
    },
    systemDetails: {
      organizationDetails: {
        organizationId: process.env.ORGANIZATIONID
      }
    },
    passwordInfo: {
      dataLength: process.env.DATALENGTH,
      dataType: 'E',
      binaryData: process.env.BINARYDATA
    }
  };

  return this.perform(name, payload);
};

module.exports = handler;
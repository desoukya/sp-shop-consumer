const axios = require('axios');

const processPendingTicket = async (message) => {
  console.log('[processPendingTicket]')
  return Promise.resolve('[processPendingTicket]')
};

const processReservedTicket = async (message) => {
  console.log('[processReservedTicket]')
  return Promise.resolve('[processReservedTicket]')
};

module.exports = {
  processPendingTicket,
  processReservedTicket
};

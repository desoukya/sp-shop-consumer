const axios = require('axios');

const processPendingTicket = async (message) => {
  console.log('[processPendingTicket]', message)
  return Promise.resolve('[processPendingTicket]')
};

const processReservedTicket = async (message) => {
  console.log('[processReservedTicket]', message)
  return Promise.resolve('[processReservedTicket]')
};

module.exports = {
  processPendingTicket,
  processReservedTicket
};

const BTNS_ABI = require('./btnsAbi')
const config = require('config')
const axios = require('axios')
const CronJob = require('cron').CronJob
const util = require('../module/utils')



async function syncContractLogs () {
  // TODO get lastBlock from db
  const start = config.startBlock;

  const api = `${config.etherScan}/?module=logs&action=getlogs&fromBlock=${start}&toBlock=latest&address=${config.btnsContract}&apikey=${config.apiKey}&sort=-timestamp`
  console.log(api)
  const {data} = await axios.get(api);
  console.log(data);
}


async function startSyncContractLogs () {
  while (true) {
    const startTime = Date.now()
    await syncContractLogs()
    const duration = Date.now() - startTime
    await util.sleep(duration > 10000 ? 0 : 1000 - duration)
  }
}

module.exports = startSyncContractLogs;

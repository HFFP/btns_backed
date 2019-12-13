const BTNS_ABI = require('./btnsAbi')
const config = require('config')
const axios = require('axios').default
const util = require('../module/utils')
const Web3 = require('web3')

const web3 = new Web3();

const events = function(){
  const event = {}
  BTNS_ABI.map(item => {
    if (item.type === 'event') {
      const paramsTypeStr = item.inputs.map(param => {
        return param.type
      }).join(',')
      const sha3 = web3.utils.sha3(`${item.name}(${paramsTypeStr})`)
      const input = item.inputs
      event[sha3] = {sha3, input, name: item.name}
    }
  })
  return event;
}();


async function syncContractLogs () {
  // TODO get lastBlock from db
  const start = config.startBlock;

  const api = `${config.etherScan}/?module=logs&action=getlogs&fromBlock=${start}&toBlock=latest&address=${config.btnsContract}&apikey=${config.apiKey}&sort=-timestamp`
  const {data} = await axios.get(api);
  data.result.forEach(item => {
    const topic = item.topics[0]
    const logs = web3.eth.abi.decodeLog(
      events[topic].input,
      item.data,
      item.topics.slice(1, item.topics.length)
    )
    console.log(logs, events[topic].name)
  })
}


async function startSyncContractLogs () {
  while (true) {
    try {
      const startTime = Date.now()
      await syncContractLogs()
      const duration = Date.now() - startTime
      await util.sleep(duration > 10000 ? 0 : 10000 - duration)
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = startSyncContractLogs;

const BTNS_ABI = require('./btnsAbi')
const config = require('config')
const axios = require('axios').default
const util = require('../module/utils')
const EventModel = require('../model/event')
const registeredInvitationEvent = require('./eventManage/registeredInvitation')
const exchangeEvent =  require('./eventManage/exchange')
const bootUpEvent =  require('./eventManage/bootUp')
const miningEvent =  require('./eventManage/mining')
const updateMiningEvent =  require('./eventManage/updateMining')


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
  const lastSyncBlock = await EventModel.findOne().sort({blockNumber: -1});
  const start = lastSyncBlock ? lastSyncBlock.blockNumber + 1: config.startBlock

  const api = `${config.etherScan}/?module=logs&action=getlogs&fromBlock=${start}&toBlock=latest&address=${config.btnsContract}&apikey=${config.apiKey}&sort=-timestamp`
  const {data} = await axios.get(api);
  for (const item of data.result) {
    const topic = item.topics[0]
    const logs = web3.eth.abi.decodeLog(
      events[topic].input,
      item.data,
      item.topics.slice(1, item.topics.length)
    )

    //deal with
    switch (events[topic].name) {
      case 'RegisteredInvitation':
        await registeredInvitationEvent(item, logs);
        break;
      case 'Exchange':
        await exchangeEvent(item, logs);
        break;
      case 'BootUp':
        await bootUpEvent(item, logs);
        break;
      case 'Mining':
        await miningEvent(item, logs);
        break;
      case 'UpdateMining':
        await updateMiningEvent(item, logs);
        break;
    }

    // recode event
    await EventModel.updateOne({
      transactionHash: item.transactionHash,
    },{
      $set: {
        transactionHash: item.transactionHash,
        timeStamp: web3.utils.hexToNumber(item.timeStamp),
        blockNumber: web3.utils.hexToNumber(item.blockNumber),
        data: item.data,
        topics: item.topics,
        decode: logs,
        name: events[topic].name
      }
    },{
      upsert: true
    })
  }
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

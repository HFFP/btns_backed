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
const communityAwardEvent = require('./eventManage/communityAward')
const bootUpAwardEvent = require('./eventManage/bootUpAward')
const coinbaseEvent = require('./eventManage/coinbase')
const btnsContract = require('../module/btnsContract')




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

  // const api = `${config.etherScan}/?module=logs&action=getlogs&fromBlock=${start}&toBlock=latest&address=${config.btnsContract}&apikey=${config.apiKey}&sort=-timestamp`
  // const {data} = await axios.get(api);
  const data = await btnsContract.getPastLogs(config.btnsContract, start)
  for (const item of data) {
    const topic = item.topics[0]
    const logs = web3.eth.abi.decodeLog(
      events[topic].input,
      item.data,
      item.topics.slice(1, item.topics.length)
    )

    let index = ''
    //deal with
    switch (events[topic].name) {
      case 'RegisteredInvitation':
        index = await registeredInvitationEvent(item, logs);
        break;
      case 'Exchange':
        index = await exchangeEvent(item, logs);
        break;
      case 'BootUp':
        index = await bootUpEvent(item, logs);
        break;
      case 'Mining':
        index = await miningEvent(item, logs);
        break;
      case 'UpdateMining':
        index = await updateMiningEvent(item, logs);
        break;
      case 'BootUpAward':
        index = await bootUpAwardEvent(item, logs);
        break;
      case 'CommunityAward':
        index = await communityAwardEvent(item, logs);
        break;
      case 'CoinBase':
        index = await coinbaseEvent(item, logs);
        break;
    }

    // recode event
    const blockData = await btnsContract.getBlock(item.blockNumber);
    await EventModel.updateOne({
      transactionHash: item.transactionHash,
      index: index
    },{
      $set: {
        transactionHash: item.transactionHash,
        timeStamp: blockData.timestamp * 1000,
        blockNumber: web3.utils.hexToNumber(item.blockNumber),
        data: item.data,
        topics: item.topics,
        decode: logs,
        name: events[topic].name,
        index: index
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
      await util.sleep(duration > 20000 ? 0 : 20000 - duration)
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = startSyncContractLogs;

const CronJob = require('cron').CronJob
const AddressModel = require('../model/address')
const btnsContract = require('../module/btnsContract')

const Web3 = require('web3')
const web3 = new Web3();

async function sendMiningAward () {
  console.log('sendMiningAward')
  const nowTime = new Date().getTime()
  let miningUsers = await AddressModel.find({millType: {$ne: 0}})
  miningUsers = miningUsers.map(user => {
    const tmp = {}
    let power = 0;
    switch (user.millType) {
      case 1000:
        power = 10;
        break;
      case 5000:
        power = 60;
        break;
      case 10000:
        power = 130;
        break;
      case 50000:
        power = 700
    }
    tmp[user.address] = {
      ...user,
      power
    }
    return tmp
  }).reduce((pre, cur) => {
    return {
      ...pre,
      ...cur
    }
  })
  Object.keys(miningUsers).map(userAddress => {
    const user = miningUsers[userAddress]
    user.nowPower = user.power
    const duration = Math.floor((nowTime - user.miningTime) / 86400000);
    if (duration > 7) {
      user.nowPower += user.nowPower * 0.07 * 7
    } else {
      user.nowPower += user.nowPower * 0.07 * duration
    }
    user.invitationList.map(item => {
      if (miningUsers[item]) {
        switch (user.invitationDetail[item]) {
          case 1:
            let ratio = 0
            switch (user.millType) {
              case 1000:
                ratio = 0.15;
                break;
              case 5000:
                ratio = 0.2;
                break;
              case 10000:
                ratio = 0.25;
                break;
              case 50000:
                ratio = 0.3
            }
            user.nowPower += miningUsers[item].power * ratio
            break;
          case 2:
            user.nowPower += miningUsers[item].power * 0.02
            break;
          case 3:
            user.nowPower += miningUsers[item].power * 0.03
            break;
          case 4:
            user.nowPower += miningUsers[item].power * 0.04
            break;
          case 5:
            user.nowPower += miningUsers[item].power * 0.05
            break;
          case 6:
            user.nowPower += miningUsers[item].power * 0.06
            break;
          case 7:
            user.nowPower += miningUsers[item].power * 0.07
            break;
          case 8:
            user.nowPower += miningUsers[item].power * 0.08
            break;
          case 9:
            user.nowPower += miningUsers[item].power * 0.09
            break;
          case 10:
            user.nowPower += miningUsers[item].power * 0.1
            break;
        }
      }
    })
  })
  // split 80/transaction
  let tmp = []
  let tmpUsers = Object.keys(miningUsers)
  for(let i=0,len=tmpUsers.length; i<len;i+=80){
    tmp.push(Object.keys(miningUsers).slice(i,i+80));
  }
  for (const item of tmp){
    let data = item.map(address => {
      return [[address], [web3.utils.toHex(Math.floor(miningUsers[address].nowPower))]]
    }).reduce((pre, cur) => {
      return [pre[0].concat(cur[0]), pre[1].concat(cur[1])]
    })
    console.log(data)
    await btnsContract.sendMiningAward(data[0], data[1])
  }

}

function startSendMiningAward () {
  const job = new CronJob('0 0 1 * * *', sendMiningAward)

  job.start()
}

module.exports = startSendMiningAward

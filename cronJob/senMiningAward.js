const CronJob = require('cron').CronJob
const AddressModel = require('../model/address')

async function sendMiningAward () {
  console.log('sendMiningAward')
  let miningUsers = await AddressModel.find({millType: {$ne: 0}})
  miningUsers = miningUsers.map(user => {
    const tmp = {}
    tmp[user.address] = user
    return tmp
  }).reduce((pre, cur) => {
    return {
      ...pre,
      ...cur
    }
  })
  console.log(miningUsers)
}

function startSendMiningAward () {
  const job = new CronJob('*/10 * * * * *', sendMiningAward)

  job.start()
}

module.exports = startSendMiningAward

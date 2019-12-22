const AddressModel = require('../../model/address')
const btnsContract = require('../../module/btnsContract')

async function miningEvent (event, logs) {
  console.log('miningEvent')

  // update address info
  await AddressModel.updateOne({
    address: logs.user,
  },{
    $set: {
      millType: Number(logs.millType),
      miningTime: logs.time * 1000
    }
  })

  // 判断是否需要给邀请人发社区奖
  // 直系大于等于20 && 非直系 大于等于 200 level1
  // 直系大于等于100 && 非直系 大于等于 5000 level2
  const users = await AddressModel.find({invitationList: logs.user});
  for (const user of users) {
    let immediateList = [];
    let distantList = [];
    for(const address of Object.keys(user.invitationDetail)) {
      if (user.invitationDetail[address] > 1) {
        distantList.push(address)
      } else {
        immediateList.push(address)
      }
    }
    if (immediateList.length >= 100 && distantList.length >= 5000) {
      if (user.communityAward2) {
        continue
      }
      const immediateBootUpNum = await AddressModel.estimatedDocumentCount({millType: {$ne: 0}, address: {$in: immediateList}})
      if (immediateBootUpNum >= 100) {
        const distantBootUpNum = await AddressModel.estimatedDocumentCount({millType: {$ne: 0}, address: {$in: distantList}})
        if (distantBootUpNum >= 5000) {
          await btnsContract.sendCommunityAward(user, 2)
        }
      }
    } else if (immediateList.length >= 20 && distantList.length >= 200) {
      if (user.communityAward1) {
        continue
      }
      const immediateBootUpNum = await AddressModel.countDocuments({millType: {$gt: 0}, address: {$in: immediateList}})
      if (immediateBootUpNum >= 20) {
        const distantBootUpNum = await AddressModel.countDocuments({millType: {$gt: 0}, address: {$in: distantList}})
        if (distantBootUpNum >= 200) {
          await btnsContract.sendCommunityAward(user.address, 1)
        }
      }
    }
  }

  return logs.user;

}

module.exports = miningEvent

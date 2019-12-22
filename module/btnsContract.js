const BTNS_ABI = require('../sync/btnsAbi')
const config = require('config')
const Transaction = require('ethereumjs-tx').Transaction
const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider(config.provider))
const btnsContract = new web3.eth.Contract(BTNS_ABI, config.btnsContract, {from:config.ethAddress});

async function sendBootUpAward (immediate, distant) {
  const rawTransaction = {
    nonce: await getNonce(),
    from: config.ethAddress,
    to: config.btnsContract,
    gasPrice: web3.utils.toHex(await getGasPrice()),
    gasLimit: web3.utils.toHex(300000),
    value: '0x0',
    data: btnsContract.methods.sendBootUpAward(immediate, distant).encodeABI()
  }
  const tx = new Transaction(rawTransaction, {chain: config.network})
  const pk = Buffer.from(config.ethPrivateKey, 'hex')
  tx.sign(pk)
  const signedTx = '0x' + tx.serialize().toString('hex')
  const transaction = await web3.eth.sendSignedTransaction(signedTx).catch(err => {
    throw new Error(err.message, err.stack);
  });
  console.log(transaction.transactionHash)
}

async function sendCommunityAward(address, level) {
  const rawTransaction = {
    nonce: await getNonce(),
    from: config.ethAddress,
    to: config.btnsContract,
    gasPrice: web3.utils.toHex(await getGasPrice()),
    gasLimit: web3.utils.toHex(300000),
    value: '0x0',
    data: btnsContract.methods.sendCommunityAward(address, level).encodeABI()
  }
  const tx = new Transaction(rawTransaction, {chain: config.network})
  const pk = Buffer.from(config.ethPrivateKey, 'hex')
  tx.sign(pk)
  const signedTx = '0x' + tx.serialize().toString('hex')
  const transaction = await web3.eth.sendSignedTransaction(signedTx).catch(err => {
    throw new Error(err.message, err.stack);
  });
  console.log(transaction.transactionHash)
}

async function getNonce () {
  return await web3.eth.getTransactionCount(config.ethAddress)
}

async function getGasPrice () {
  return await web3.eth.getGasPrice()
}

module.exports = {sendBootUpAward, sendCommunityAward}

const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))

function queryToPagination ({ page = 1, size = 50 }) {
  size = Number(size)
  size = size > 500 ? 500 : size

  return {
    offset: (page - 1) * size,
    limit: size,

    page: Number(page),
    size: size
  }
}

// 保留n位小数
function roundFun (value, n) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
}

module.exports = {
  sleep,
  queryToPagination,
  roundFun
}


const alert = require('cli-alerts-codeword7')

module.exports = (info) => {
  alert({
    type: `warning`,
    name: `DEBUG LOG`,
    msg: ``
  })

  console.log(info)
  console.log()
}
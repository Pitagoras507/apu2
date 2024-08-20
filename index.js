const http = require('node:http') // protocolo HTTP
const {findAvailablePort} =require("./availableServer")

const server = http.createServer((req, res) => {
    console.log('request received')
    res.end('Hola mundo')
  })
  
  findAvailablePort(1500).then(port => {
    server.listen(port, () => {
      console.log(`server listening on port http://localhost:${port}`)
    })
  })
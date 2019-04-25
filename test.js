const net = require('net')

const HOST = 'localhost'
const PORT = 1337

function generateDocId() {
  return `doc${Math.floor(Math.random() * 1000)}`
}

function runCommand(command) {
  return new Promise((resolve) => {
    const client = new net.Socket()
    client.connect(PORT, HOST, function () {
      client.on('data', function (data) {
        resolve(data.toString('utf8'))
        client.end()
      })
      client.write(command + '\n')
    })
  })
}

describe('Slite 1986 Test', function () {
  describe('create', function () {
    it('creates a doc with a 200 response', async function () {
      const docId = generateDocId()
      const resp = await runCommand(`create:${docId}`)
      expect(resp).toEqual('200\r\n')
    })

    it('creates a doc by storing an empty document', async function () {
      const docId = generateDocId()
      await runCommand(`create:${docId}`)
      const resp = await runCommand(`get:${docId}:txt`)
      expect(resp).toEqual('\r\n')
    })

    it('creates a doc by overriding an existing one', async function () {
      const docId = generateDocId()
      await runCommand(`create:${docId}`)
      await runCommand(`insert:${docId}:hello`)
      await runCommand(`create:${docId}`)
      const resp = await runCommand(`get:${docId}:txt`)
      expect(resp).toEqual('\r\n')
    })
  })

  describe('insert', function () {
    it('returns a 404 if doc has not been created', async function () {
      const docId = generateDocId()
      await runCommand(`insert:${docId}:Hello`)
      const resp = await runCommand(`get:${docId}:txt`)
      expect(resp).toEqual('404\r\n')
    })

    it('inserts content at first position', async function () {
      const docId = generateDocId()
      await runCommand(`create:${docId}`)
      await runCommand(`insert:${docId}:0:Hello`)
      const resp = await runCommand(`get:${docId}:txt`)
      expect(resp).toEqual('Hello\r\n')
    })

    it('inserts at multiple position', async function () {
      const docId = generateDocId()
      await runCommand(`create:${docId}`)
      await runCommand(`insert:${docId}:Hello`)
      await runCommand(`insert:${docId}:5:World`)
      await runCommand(`insert:${docId}:5: `)
      await runCommand(`insert:${docId}:11:!`)
      const resp = await runCommand(`get:${docId}:txt`)
      expect(resp).toEqual('Hello World!\r\n')
    })

    it('inserts break line', async function () {
      const docId = generateDocId()
      await runCommand(`create:${docId}`)
      await runCommand(`insert:${docId}:Hello\n`)
      await runCommand(`insert:${docId}:World!\n`)
      const resp = await runCommand(`get:${docId}:txt`)
      expect(resp).toEqual('Hello\nWorld!\n\r\n')
    })
  })

  describe('formats', function () {
    it('formats a document in bold', async function () {
      const docId = generateDocId()
      await runCommand(`create:${docId}`)
      await runCommand(`insert:${docId}:Hello World!\n`)
      await runCommand(`format:${docId}:0:5:bold`)
      const resp = await runCommand(`get:${docId}:md`)
      expect(resp).toEqual('**Hello** World!\n\r\n')
    })

    it('formats a document in italic', async function () {
      const docId = generateDocId()
      await runCommand(`create:${docId}`)
      await runCommand(`insert:${docId}:Hello World!\n`)
      await runCommand(`format:${docId}:0:5:italic`)
      const resp = await runCommand(`get:${docId}:md`)
      expect(resp).toEqual('*Hello* World!\n\r\n')
    })

    it('formats a document while maintaining text intact', async function () {
      const docId = generateDocId()
      await runCommand(`create:${docId}`)
      await runCommand(`insert:${docId}:Hello`)
      await runCommand(`format:${docId}:0:5:italic`)
      await runCommand(`insert:${docId}:5: World!`)

      const respmd = await runCommand(`get:${docId}:md`)
      expect(respmd).toEqual('*Hello* World!\n\r\n')

      const resptxt = await runCommand(`get:${docId}:txt`)
      expect(resptxt).toEqual('Hello World!\r\n')
    })
  })

  describe('delete', function () {
    it('deletes a document', async function () {
      const docId = generateDocId()
      await runCommand(`create:${docId}`)
      await runCommand(`delete:${docId}`)
      const resp = await runCommand(`get:${docId}:txt`)
      expect(resp).toEqual('404\r\n')
    })
  })
})


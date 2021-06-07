#!/usr/bin/env node

/**
 * cli-todo-codeword7
 * CLI to manage todo anywhere
 * 
 * @author Neeraj Kumar <https://twitter.com/codeword007>
 */
const fs = require('fs')
const path = require('path')
const makeDir = require('make-dir')

//Database
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dbTodos = path.join(process.cwd(), `.todo/todos.json`)

const init = require('./utils/init')
const cli = require('./utils/cli')
const log = require('./utils/log')
const ask = require('./utils/ask')

const input = cli.input
const flags = cli.flags
const { clear, debug } = flags

const start = async () => {
  init({ clear })
  input.includes(`help`) && cli.showHelp(0)

  if (!fs.existsSync(dbTodos)) {
    await makeDir(`.todo`)
    process.chdir(`.todo`)
    fs.writeFileSync(`todos.json`, `{}`)
  }

  const adapter = new FileSync(dbTodos)
  const db = low(adapter)
  db.defaults({ todos: [] }).write()

  // to view or list todo
  if (input.includes(`view`) || input.includes(`ls`)) {
    const allTodos = db.get(`todos`).value()
    console.log(`allTodos: `, allTodos)
  }

  // add todo
  if (input.includes(`add`)) {
    const whatTodo = await ask({ message: `Add a todo` })
    console.log(`whatTodo: `, whatTodo)
  }
  debug && log(flags)
}

start()
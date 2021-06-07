#!/usr/bin/env node

/**
 * cli-todo-codeword7
 * CLI to manage todo anywhere
 * 
 * @author Neeraj Kumar <https://twitter.com/codeword007>
 */
const fs = require('fs')
const alert = require('cli-alerts-codeword7')
const path = require('path')
const { green: g, yellow: y, red: r, dim, hex } = require('chalk')
const makeDir = require('make-dir')

//Database
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dbTodos = path.join(process.cwd(), `.todo/todos.json`)

const init = require('./utils/init')
const cli = require('./utils/cli')
const log = require('./utils/log')
const ask = require('./utils/ask')
const select = require('./utils/select')

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
    allTodos.map((todo, i) => console.log(`${dim(`${++i}:`)} ${todo.title}`))
    console.log(`\n ${y(` TOTAL `)} ${allTodos.length}\n`)
  }

  // add todo
  if (input.includes(`add`)) {
    const whatTodo = await ask({ message: `Add a todo` })
    db.get(`todos`).push({ title: whatTodo }).write()

    alert({
      type: `success`,
      name: `ADDED`,
      msg: `successfully!`
    })
  }

  // delete todo
  if (input.includes(`del`)) {
    const allTodos = db.get(`todos`).value()
    const toDels = await select({
      choices: allTodos,
      message: `Finish todos: `
    })
    toDels.map(todoTitle => db.get(`todos`).remove({ title: todoTitle }).write())

    alert({
      type: `success`,
      name: `FINISHED`,
      msg: `${toDels.length} todos`
    })
  }
  debug && log(flags)
}

start()
#!/usr/bin/env node

const clivas = require('clivas')
const keypress = require('keypress')

const one = '' +
  '.........................................\n' +
  '.........................................\n' +
  '...................   ...................\n' +
  '................      ...................\n' +
  '...................   ...................\n' +
  '...................   ...................\n' +
  '...................   ...................\n' +
  '...................   ...................\n' +
  '...............          ................\n' +
  '.........................................\n' +
  '.........................................\n'
const two = '' +
  '.........................................\n' +
  '.........................................\n' +
  '...............          ................\n' +
  '......................   ................\n' +
  '......................   ................\n' +
  '...............          ................\n' +
  '...............   .......................\n' +
  '...............   .......................\n' +
  '...............          ................\n' +
  '.........................................\n' +
  '.........................................\n'
const three = '' +
  '.........................................\n' +
  '.........................................\n' +
  '...............          ................\n' +
  '......................   ................\n' +
  '......................   ................\n' +
  '...............          ................\n' +
  '......................   ................\n' +
  '......................   ................\n' +
  '...............          ................\n' +
  '.........................................\n' +
  '.........................................\n'
const four = '' +
  '.........................................\n' +
  '.........................................\n' +
  '...............   ....   ................\n' +
  '...............   ....   ................\n' +
  '...............   ....   ................\n' +
  '...............          ................\n' +
  '......................   ................\n' +
  '......................   ................\n' +
  '......................   ................\n' +
  '.........................................\n' +
  '.........................................\n'

const oneAsLineArray = one.split('\n')
const twoAsLineArray = two.split('\n')
const threeAsLineArray = three.split('\n')
const fourAsLineArray = four.split('\n')

const draw = (cOne = 'bold+blue', cTwo = 'bold+red', cThree = 'bold+yellow', cFour = 'bold+green') => {
  clivas.clear()

  for (let i = 0; i < oneAsLineArray.length; i++)
    clivas.line(`{${cOne}: ${oneAsLineArray[i]}}    {${cTwo}:${twoAsLineArray[i]}}`)

  for (let i = 0; i < threeAsLineArray.length; i++)
    clivas.line(`{${cThree}: ${threeAsLineArray[i]}}    {${cFour}:${fourAsLineArray[i]}}`)
}

const pickRandom = () => Math.floor(Math.random() * 4) + 1

const matches = (us, s) => us.every((v, i) => v === s[i])

const fullMatch = (us, s) => us.length === s.length && matches(us, s)

const drawSequence = (sequence = [], delay = 1000, cb = () => {}) => {
  if (sequence.length === 0) return

  drawingSequence = true
  sequence.forEach((number, i) => {
    setTimeout(() => {
      switch (number) {
      case 1:
        draw(cOne = 'black')
        break
      case 2:
        draw(undefined, 'black')
        break
      case 3:
        draw(undefined, undefined, 'black')
        break
      case 4:
        draw(undefined, undefined, undefined, 'black')
        break
      }

      setTimeout(() => {
        draw()
        if (i === sequence.length - 1) {
          drawingSequence = false
          cb()
        }
      }, delay / 2)

    }, i * delay)
  })
}

const drawGameOver = (color) => {
  for (let i = 0; i < 3; i++)
    setTimeout(() => {
      draw(color, color, color, color)
      setTimeout(draw, 500)
    }, i * 1000)
}

const nextLevel = () => {
  sequence.push(pickRandom())
  userSequence = []
  drawSequence(sequence)
}

let drawingSequence = false
let sequence = [pickRandom()]
let userSequence = []
let gameOver = false

clivas.flush(false)
clivas.cursor(false)
keypress(process.stdin)

process.stdin.on('keypress', (ch, key) => {
  if (key && (key.name === 'c' && key.ctrl)) return process.exit(0);
  if (drawingSequence) return

  if (['1', '2', '3', '4'].includes(ch) && !gameOver) {
    const asNumber = Number(ch)
    userSequence.push(asNumber)
    if (!matches(userSequence, sequence)) {
      drawGameOver('red')
      gameOver = true
      return
    }

    drawSequence([asNumber], 300, () => {
      if (fullMatch(userSequence, sequence)) {
        nextLevel()
      }
    })
    return
  }

  if (ch === 'r') {
    gameOver = false
    sequence = [pickRandom()]
    userSequence = []
    draw()
    drawSequence(sequence)
  }
})
process.stdin.resume()

try {
  process.stdin.setRawMode(true)
} catch (e) {
  require('tty').setRawMode(true)
}

draw()
drawSequence(sequence)


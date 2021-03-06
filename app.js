'use strict'

const fs = require('fs')
const TravellingSalesman = require('./travelling-salesman')
const argv = require('yargs')
  .usage('Usage $0 <input_file>')
  .demand(1)
  .argv

function readFile() {
  let filePath = argv._[0]
  return fs.readFileSync(filePath, { encoding: 'utf8' })
}

function mountTuples(str) {
  let lines = str.trim().split('\n').map(x => x.trim())
  let tuples = lines.map(x => x.split(/\s+/))

  return tuples
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function mountDistanceMatrix(tuples) {
  let matrix = []

  tuples.forEach((tuple1, i) => {
    let line = []

    tuples.forEach((tuple2, j) => {
      if (i === j) {
        line.push(Infinity)
      } else {
        let x1 = tuple1[1], y1 = tuple1[2]
        let x2 = tuple2[1], y2 = tuple2[2]

        line.push(getDistance(x1, y1, x2, y2))
      }
    })

    matrix.push(line)
  })

  return matrix
}

function addNodeNamesTo(result, tuples) {
  let nodeNames = tuples.map(x => x[0])
  result.path = result.path.map(x => nodeNames[x])
}

function run() {
  let content = readFile()
  let tuples = mountTuples(content)
  let distances = mountDistanceMatrix(tuples)
  let result = TravellingSalesman.calculate(0, distances)

  addNodeNamesTo(result, tuples)

  console.log('Path: ' + result.path.join(' - '))
  console.log('Distance: ' + result.distance)
}

run()
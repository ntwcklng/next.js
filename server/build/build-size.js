import chalk from 'chalk'
import prettyBytes from 'pretty-bytes'
import path from 'path'
import 'console.table'

export default async function buildSize (files) {
  let table = []
  let maxPages = 3

  files
    .sort((a, b) => b.compressed - a.compressed)
    .filter((file, i) => {
      const isPage = file.fileName.indexOf('/pages/')
      if (file.fileName.indexOf('_document.json') >= 0) {
        return false
      }
      if (isPage > 0) {
        if (maxPages <= 0) {
          return false
        }
        maxPages--
      }
      files[i].fileName = isPage >= 0 ? `${file.fileName.slice(isPage + 1)}` : path.basename(file.fileName)
      return file
    })
    .map(file => {
      const compressed = chalk.dim.green(`(${prettyBytes(file.compressed)})`)
      const uncompressed = prettyBytes(file.uncompressed)
      table.push([
        file.fileName,
        `${uncompressed} ${compressed}`
      ])
    })

  console.log('Bundle size\n')
  console.table(['File', `Size ${chalk.dim.green('(gzipped)')}`], table)
}

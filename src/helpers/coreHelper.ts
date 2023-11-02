import { create, all } from 'mathjs'
const config = {}
const math = create(all, config) as any
import { enumData } from '../constants/enumData'

class CoreHelper {
  /** Get array từ obj */
  public convertObjToArray(obj: any) {
    const arr = []
    // tslint:disable-next-line:forin
    for (const key in obj) {
      const value = obj[key]
      arr.push(value)
    }
    return arr
  }

  /** Get array từ obj */
  public convertObjToArrayCodeName(obj: any) {
    const arr = []
    // tslint:disable-next-line:forin
    for (const key in obj) {
      const value = obj[key]
      arr.push({ code: value.code, name: value.name })
    }
    return arr
  }

  public newDateTZ() {
    const d = new Date()
    const offset = 7
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    const utc = d.getTime() + d.getTimezoneOffset() * 60000

    // create new Date object for different city
    // using supplied offset
    const nd = new Date(utc + 3600000 * offset)
    return nd
  }

  /** format tên , viết hoa chữ đầu và bỏ khoảng trắng dư */
  public formatName(text: string): string {
    text = text.trim()
    text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    while (text.includes('  ') === true) {
      text = text.replaceAll('  ', ' ')
    }
    const arrText = text.split(' ').map((value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
    return arrText.join(' ')
  }
}

export const coreHelper = new CoreHelper()

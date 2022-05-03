import { getRepository, Between } from 'typeorm';
import { Request, Response } from 'express'
import Metering from '../models/Metering';
import Device from '../models/Device'
import moment from 'moment';

const assembleHumidity = (meterings: Array<any>, parameter: string) => {

  const formattedResponse = meterings.reduce((obj, item) => Object.assign(obj, { [item.created_at]: parseFloat(item[parameter]) }))

  delete formattedResponse.id
  delete formattedResponse.flow_rate
  delete formattedResponse.device_id
  delete formattedResponse.timeInstant
  delete formattedResponse.humidity
  delete formattedResponse.humiditySoil
  delete formattedResponse.temperature
  delete formattedResponse.commandInfo
  delete formattedResponse.totalFlow
  delete formattedResponse.created_at

  return formattedResponse
}

async function create(request: Request, response: Response) {
  try {
    const { data } = request.body
    const metering = data[0]
    const meteringRepository = getRepository(Metering)
    moment.locale('pt-br')
    const now = moment().subtract(3, 'hours').format("DD-MM-YYYYTkk:mm:ss")    
    const meteringToSave = meteringRepository.create({
      flow_rate: metering.flow_rate.value,
      device_id: metering.id,
      timeInstant: now,
      humidity: metering.humidity.value,
      humiditySoil: metering.humiditySoil.value,
      commandInfo: metering.on_status.value.trim() === '1' ? false : true,
      temperature: metering.temperature.value,
      totalFlow: metering.total_flow.value,
      created_at: moment().subtract(3, 'hours').unix()
    })

    const deviceRepository = getRepository(Device)
    const device = await deviceRepository.findOneOrFail({
      where: { device_id: metering.id }
    })

    deviceRepository.merge(device, { last_metering: now })

    await Promise.all([
      meteringRepository.save(meteringToSave),
      deviceRepository.save(device)
    ])

    return response.sendStatus(201)
  } catch (error) {
    return response.status(400).json({ message: Object(error).message })
  }
}

async function getSoilHumidity(request: Request, response: Response) {
  try {
    const { month } = request.query
    
    if (month) {
      const monthIndex = parseInt(month.toString()) - 1
      const beginOfMonth = moment().set('month', monthIndex).startOf('month').unix()  
      const endOfMonth = moment().set('month', monthIndex).endOf('month').unix()
      const whereBetween = Between(beginOfMonth.toString(), endOfMonth.toString())
      
      const meteringRepository = getRepository(Metering)
      const meterings = await meteringRepository.find({
        where: {
          created_at: whereBetween
        }
      })

      return response.status(200).json(meterings.length > 0 ? assembleHumidity(meterings, 'humiditySoil') : [])
    } else {
      throw new Error('Faltando o parametro month');
    }
  } catch (error) {
    return response.status(400).json({ message: Object(error).message })
  }
}

async function getAirHumidity(request: Request, response: Response) {
  try {
    const { month } = request.query
    
    if (month) {
      const monthIndex = parseInt(month.toString()) - 1
      const beginOfMonth = moment().set('month', monthIndex).startOf('month').unix()  
      const endOfMonth = moment().set('month', monthIndex).endOf('month').unix()
      const whereBetween = Between(beginOfMonth.toString(), endOfMonth.toString())
      
      const meteringRepository = getRepository(Metering)
      const meterings = await meteringRepository.find({
        where: {
          created_at: whereBetween
        }
      })

      return response.status(200).json(meterings.length > 0 ? assembleHumidity(meterings, 'humidity') : [])
    } else {
      throw new Error('Faltando o parametro month');
    }
  } catch (error) {
    return response.status(400).json({ message: Object(error).message })
  }
}

export default {
  create,
  getAirHumidity,
  getSoilHumidity
}
import { getRepository, Between } from 'typeorm';
import { Request, Response } from 'express'
import Metering from '../models/Metering';
import Device from '../models/Device'
import moment from 'moment';

const formatDate = (date:string) => {
  const arrayDate = date.split('-')
  return `${arrayDate[1]}/${arrayDate[0]}/${arrayDate[2]}`
}

const assembleHumidity = (meterings: Array<any>) => {
  const formattedResponse = meterings.reduce((obj, item) => 
    Object.assign(obj, { 
      [Date.parse(formatDate(item.agrouppeddate)).toString()]: parseFloat(item.media) 
    }))
  
  Object.assign(formattedResponse, {
    [Date.parse(formatDate(formattedResponse.agrouppeddate)).toString()]: 
    parseFloat(formattedResponse.media)
  })

  delete formattedResponse.agrouppeddate
  delete formattedResponse.media

  return formattedResponse
}

const getDailyAVG = async (month:number, parameter:string, device_id: string) => {
  const monthIndex = month - 1
  const beginOfMonth = moment().set('month', monthIndex).startOf('month').unix()  
  const endOfMonth = moment().set('month', monthIndex).endOf('month').unix()
  const whereBetween = Between(beginOfMonth.toString(), endOfMonth.toString())
  
  const meteringRepository = getRepository(Metering)
  const meterings = await meteringRepository.createQueryBuilder()
    .select(`AVG(${parameter})`, "media")
    .addSelect("split_part(time_instant, 'T', 1) as agrouppedDate")
    .where({
      created_at: whereBetween,
      device_id      
    })
    .groupBy('agrouppedDate').getRawMany()

  return assembleHumidity(meterings)
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
      time_instant: now,
      humidity: parseFloat(metering.humidity.value),
      humidity_soil: parseFloat(metering.humiditySoil.value),
      commandInfo: metering.on_status.value.trim() === '1' ? false : true,
      temperature: parseFloat(metering.temperature.value),
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
    const { month, device_id } = request.query
    
    if (month && device_id) {
      const meterings = await getDailyAVG(parseInt(month.toString()), 'humidity_soil', device_id.toString())

      return response.status(200).json(meterings)
    } else {
      throw new Error('É necessário enviar os parâmetros month e device_id');
    }
  } catch (error) {
    return response.status(400).json({ message: Object(error).message })
  }
}

async function getAirHumidity(request: Request, response: Response) {
  try {
    const { month, device_id }  = request.query
    
    if (month && device_id) {
      const meterings = await getDailyAVG(parseInt(month.toString()), 'humidity', device_id.toString())

      return response.status(200).json(meterings)
    } else {
      throw new Error('É necessário enviar os parâmetros month e device_id');
    }
  } catch (error) {
    return response.status(400).json({ message: Object(error).message })
  }
}

async function getTemperature(request: Request, response: Response) {
  try {
    const { month, device_id } = request.query
    
    if (month && device_id) {
      const meterings = await getDailyAVG(parseInt(month.toString()), 'temperature', device_id.toString())

      return response.status(200).json(meterings)
    } else {
      throw new Error('É necessário enviar os parâmetros month e device_id');
    }
  } catch (error) {
    return response.status(400).json({ message: Object(error).message })
  }
}

export default {
  create,
  getAirHumidity,
  getSoilHumidity,
  getTemperature
}
import { getRepository } from 'typeorm';
import { Request, Response } from 'express'
import Metering from '../models/Metering';
import Device from '../models/Device'
import moment from 'moment';

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
      totalFlow: metering.total_flow.value
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

export default {
  create
}
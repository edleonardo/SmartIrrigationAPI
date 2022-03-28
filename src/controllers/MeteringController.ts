import { getRepository } from 'typeorm';
import { Request, Response } from 'express'
import Metering from '../models/Metering';
import Device from '../models/Device';

async function create(request: Request, response: Response) {
  try {
    const { data } = request.body
    const metering = data[0]
    const meteringRepository = getRepository(Metering)
    const meteringToSave = meteringRepository.create({
      flow_rate: metering.flow_rate.value,
      device_id: metering.id,
      timeInstant: metering.TimeInstant.value,
      humidity: metering.humidity.value,
      humiditySoil: metering.humiditySoil.value,
      commandInfo: metering.on_status.value ?? 'off',
      temperature: metering.temperature.value,
      totalFlow: metering.totalFlow.value
    })
    
    const deviceRepository = getRepository(Device)
    const device = await deviceRepository.findOneOrFail({
      where: { device_id: metering.id }
    })

    deviceRepository.merge(device, { last_metering: metering.TimeInstant.value})

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
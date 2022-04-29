import { getRepository } from 'typeorm';
import { Request, Response } from 'express'
import * as Yup from 'yup'
import Device from '../models/Device';
import Metering from '../models/Metering';

async function create(request: Request, response: Response) {
  try {
    const { userId } = request.headers
    const { name, device_id, description } = request.body
    
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      device_id: Yup.string().required(),
      description: Yup.string().required()
    })
    await schema.validate({ name, device_id, description }, { abortEarly: false })
    
    const deviceRepository = getRepository(Device)
    
    const checkIfDeviceAlreadyExists = await deviceRepository.findOne({
      where: { device_id }
    })

    if (checkIfDeviceAlreadyExists) {
      throw new Error('Device já cadastrado');
    }

    const device = deviceRepository.create({
      name, 
      device_id, 
      description,
      active: false,
      user_id: userId?.toString()
    })

    await deviceRepository.save(device)
    return response.sendStatus(201);

  } catch (error) {
    return response.status(400).json({ message: Object(error).message })
  }
}

async function index(request: Request, response: Response) {
  try {
    const { userId } = request.headers
    
    const deviceRepository = getRepository(Device)

    const devices = await deviceRepository.find({
      where: { user_id: userId }
    })

    const amountActive = devices.filter(item => item.active === true).length
    const amountInactive = devices.filter(item => item.active === false).length

    return response.status(200).json({
      devices: devices,
      amountActive,
      amountInactive 
    })
  } catch (error) {
    return response.status(404).json({ message: Object(error).message })
  }
}

async function show(request: Request, response: Response) {
  try {
    const { id } = request.params
  
    const deviceRepository = getRepository(Device)
    const device = await deviceRepository.findOneOrFail(id)

    const meteringRepository = getRepository(Metering)

    const metering = await meteringRepository.find({
      where: {
        timeInstant: device.last_metering
      }
    })

    return response.status(200).json({
      ...device, lastMetering: metering
    })
    
  } catch (error) {
    return response.status(404).json({ message: Object(error).message })
  }
  
}

export default {
  create,
  index,
  show
}
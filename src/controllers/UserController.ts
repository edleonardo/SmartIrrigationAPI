import { getRepository } from 'typeorm';
import { Request, Response } from 'express'
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import * as Yup from 'yup'

import User from '../models/User'

const makeAuth = async (email: string, password: string) => {
  try {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new Error('Combinação de email/senha incorreta');
    }
    
    const passwordMatch = await compare(password, user.password)
    
    if (!passwordMatch) {
      throw new Error('Combinação de email/senha incorreta');
    }
    
    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });
    
    return ({
      user,
      token
    })
  } catch (error) {
    throw error
  }
}

async function authenticate(request: Request, response: Response) {
  try {
    const { email, password } = request.body
    
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required()
    })
    await schema.validate({ email, password }, { abortEarly: false })
    
    return response.status(200).json(await makeAuth(email, password))
  } catch (error) {
    return response.status(400).json({ message: Object(error).message })
  }
}

async function create (request: Request, response: Response) {
  try {
    
    const { email, password, name } = request.body
    
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })
    await schema.validate({ email, password, name }, { abortEarly: false })
    
    const userRepository = getRepository(User);
    
    const checkIfUserAlreadyExists = await userRepository.findOne({
      where: { email },
    })
    
    if (checkIfUserAlreadyExists) {
      throw new Error('Endereço de email já está sendo utilizado');
    }
    
    const hashSenha = await hash(password, 8);
    
    const user = userRepository.create({
      name,
      email,
      password: hashSenha,
    });
    
    await userRepository.save(user);
    
    return response.status(200).json(await makeAuth(email, password))
  } catch (error) {
    return response.status(400).json({ message: Object(error).message })
  }
}

async function update(request: Request, response: Response) {
  try {
    const { id } = request.params
    const { email, password, name } = request.body
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })
    await schema.validate({ email, password, name }, { abortEarly: false })
    
    const userRepository = getRepository(User);
    
    const user = await userRepository.findOneOrFail(id)
    userRepository.merge(user, { email, password, name })
    await userRepository.save(user)

    response.sendStatus(204)
  } catch (error) {
    return response.status(404).json({ message: Object(error).message })
  }
}

export default {
  authenticate,
  create, 
  update
}
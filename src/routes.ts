import { Router } from 'express'
import DeviceController from './controllers/DeviceController'
import MeteringController from './controllers/MeteringController'
import UserController from './controllers/UserController'
import verifyAuth from './middlewares/verifyAuth'

const routes = Router()

routes.post('/user', UserController.create)
routes.post('/auth', UserController.authenticate)
routes.post('/subscription', MeteringController.create)

routes.use(verifyAuth)
routes.put('/user/:id', UserController.update)
routes.post('/device', DeviceController.create)
routes.get('/device', DeviceController.index)

export default routes
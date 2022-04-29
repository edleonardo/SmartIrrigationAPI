import { Request, Response, Router } from 'express'
import DeviceController from './controllers/DeviceController'
import MeteringController from './controllers/MeteringController'
import UserController from './controllers/UserController'
import verifyAuth from './middlewares/verifyAuth'

const routes = Router()

routes.post('/user', UserController.create)
routes.post('/auth', UserController.authenticate)
routes.post('/subscription', MeteringController.create)
routes.get('/health-check', (req: Request, res: Response) => res.send('OK'))

routes.use(verifyAuth)
routes.get('/meterings/soil-humidity', MeteringController.getSoilHumidity)
routes.get('/meterings/air-humidity', MeteringController.getAirHumidity)
routes.put('/user/:id', UserController.update)
routes.post('/device', DeviceController.create)
routes.get('/device', DeviceController.index)
routes.get('/device/:id', DeviceController.show)

export default routes
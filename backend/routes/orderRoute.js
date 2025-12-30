import express from 'express'
import { confirmPayment, createOrder, getAllOrders, getOrder , getOrderById, updateAnyOrder, updateOrder } from '../contollers/orderContoller.js'
import authMiddleware from '../middleware/auth.js'


const orderRouter=express.Router()
orderRouter.get('/getall',getAllOrders)
orderRouter.put('/getall/:id',updateAnyOrder)

//protect rest of routes using middleware
orderRouter.use(authMiddleware)
orderRouter.post('/',createOrder)
orderRouter.get('/',getOrder )
orderRouter.get('/confirm',confirmPayment)
orderRouter.get('/:id',getOrderById)
orderRouter.put('/:id',updateOrder)

export default orderRouter
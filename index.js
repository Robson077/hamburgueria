const express = require("express")
const uuid = require("uuid")

const app = express()
app.use(express.json())
const port = 3000

const orders = []

const checkOrder = (req, res, next) => {
    const {id} = req.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0) {
        res.status(404).json({message: "not found"})
    }

    req.orderId = id
    req.orderIndex = index

    next()
}

const checkMethod = (req, res, next) => {
    console.log(req.method, req.url)

    next()
}

app.get("/orders", checkMethod, (req, res) => {
    return res.json(orders)
})

app.get("/orders/:id",checkOrder, checkMethod, (req, res) => {  
    const index = req.orderIndex
    const id = req.orderId

    return res.json(orders[index])
})

app.post("/orders", checkMethod, (req, res) => {
    const {pedido, clienteName, price} = req.body

    const order =  { id: uuid.v4(), pedido, clienteName, price, status: "Em preparação"}

    orders.push(order)

    return res.json(order)
})

app.put("/orders/:id",checkOrder, checkMethod, (req, res) => {
    const index = req.orderIndex
    const id = req.orderId

    const {pedido, clienteName, price} = req.body

    const updateOrder = { id, pedido, clienteName, price, status: "Em preparação" }

    orders[index] = updateOrder

    return res.json(updateOrder)
})

app.patch("/orders/:id", checkOrder, checkMethod, (req, res) => {
    const index = req.orderIndex
    const id = req.orderId

    const {pedido, clienteName, price} = orders[index]

    const updateStatus = { id, pedido, clienteName, price, status: "Pronto" }

    orders[index] = updateStatus

    return res.json(updateStatus)
})

app.delete("/orders/:id", checkOrder, checkMethod, (req, res) => {
    const index = req.orderIndex
    const id = req.orderId

    orders.splice(index, 1)

    return res.json()
})

app.listen(port, ()  => {
    console.log("Servidor conectado")
})

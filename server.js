import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import mongoose from "./src/config/db.js";
import userRoutes from "./src/routes/user.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import courseRoutes from "./src/routes/course.routes.js";
import cartRoutes from "./src/routes/cart.routes.js"
import paymentRoutes from "./src/routes/payment.routes.js";
import couponRoutes from "./src/routes/coupon.routes.js";
import purchaseRoutes from "./src/routes/purchase.routes.js";


const app = express();
dotenv.config()

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { 
    extended: true
}));

app.use(
    cookieSession({
        name:'auth-session',
        keys: [process.env.COOKIE_SECRET],
        httpOnly: true
    })
);

app.get('/', (req, res) =>{
    res.send({
        message: 'Bienvenido a mi API de e-commerce de cursos online'
    })
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes)
app.use("/api/course", courseRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/coupon", couponRoutes)
app.use("/api/purchase", purchaseRoutes)

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Conectado a MongoDB')
}).catch(error => {
    console.log('Error de conexión a MongoDB', error)
})

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})
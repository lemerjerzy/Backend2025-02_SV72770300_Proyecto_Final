import Cart from "../models/cart.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";

const loadCart = (req, res) => {
    const user = req.user;
    Cart.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId.createFromHexString(user._id.toString())
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $unwind: "$course"
        },
        {
            $project: {
                _id: 1,
                quantity: 1,
                status: 1,
                "user._id": 1,
                "user.username": 1,
                "user.email": 1,
                "course._id": 1,
                "course.name": 1,
                "course.value": 1,
                "course.description": 1,
                "course.img": 1
            }
        }
    ]).then(cart => {
        res.status(200).json({
            message: "Carrito del usuario con detalles de cursos",
            cart: cart
        });
    })
        .catch(error => {
            res.status(500).json({
                message: "Error al cargar el carrito",
                error: error.message
            });
        });
};

const addCard = (req, res) => {
    const { course } = req.body;
    const user = req.user;

    Course.findById(course)
        .then(courseFound => {
            if (!courseFound) {
                return res.status(404).json({
                    message: "Curso no encontrado"
                });
            }

            const cart = new Cart({
                user: user._id,
                course: courseFound._id,
                quantity: 1,
                status: "Pendiente"
            });

            return cart.save();
        })
        .then(savedCart => {
            res.status(200).json({
                message: "Curso agregado al carrito correctamente",
                cart: savedCart
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al añadir curso al carrito",
                error: error.message
            });
        });
};

// const updateQuantityCart = (req, res) => {
//     const { cartId } = req.params;
//     const updateData = req.body;

//     Cart.findByIdAndUpdate(cartId, updateData, { new: true })
//         .then(updatedCart => {
//             if (!updatedCart) {
//                 return res.status(404).json({ 
//                     message: "El curso no existe" 
//                 });
//             }
//             res.status(200).json({
//                 message: "Curso actualizado correctamente en el carrito",
//                 course: updatedCart
//             });
//         })
//         .catch(error => {
//             res.status(500).json({
//                 message: "Error al actualizar curso en el carrito",
//                 error: error.message
//             });
//         });
// };

const deleteItem = (req, res) => {
    const { cartId } = req.params;

    Cart.findByIdAndDelete(cartId)
        .then(cart => {
            if (!cart) {
                return res.status(404).json({
                    message: "Curso no encontrado en el carrito"
                });
            }
            res.status(200).json({
                message: "Curso eliminado del carrito",
                cart: cart
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al eliminar el curso del carrito",
                error: error.message
            });
        });
}


export {
    loadCart,
    addCard,
    // updateQuantityCart,
    deleteItem
}
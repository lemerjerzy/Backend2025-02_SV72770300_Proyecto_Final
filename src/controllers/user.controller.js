import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

const getAllUsers = (req, res) => {
    User.find({
        active: true
    })
        .then(users => {
            const safeUser = users.map(user => ({
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.roles,
                active: user.active
            }))

            res.status(200).json({
                message: "Usuarios obtenidos correctamente",
                users: safeUser
            })
        }).catch(error => {
            res.status(500).json({
                message: "Error al obtener usuarios",
                error: error.message
            })
        })
}

const getOnlyUser = (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
        .then(user => {
            const safeUser = {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.roles,
                active: user.active
            }
            res.status(200).json({
                message: "Usuario obtenido correctamente",
                user: safeUser
            })
        }).catch(error => {
            res.status(500).json({
                message: "Error al obtener usuario",
                error: error.message
            })
        })
}

const createUser = (req, res) => {

    const { username, password, email, roles } = req.body;

    // if (!username || !password || !email) {
    //     return res.status(400).json({
    //         message: "Faltan campos obligatorios",
    //         fields: {
    //             username: "obligatorio",
    //             password: "obligatorio",
    //             email: "obligatorio"
    //         }
    //     });
    // }

    User.findOne({
        email: email
    })
        .then(existUser => {
            if (existUser) {
                throw {
                    status: 400, message: "El usuario o email ya existe"
                };
            }
            return bcryptjs.genSalt(10);
        })
        .then(salt => {
            return bcryptjs.hash(password, salt);
        })
        .then(hashedPassword => {
            const user = new User({
                username,
                email,
                password: hashedPassword,
                roles: roles ?? ["user"]
            });

            return user.save();
        })
        .then(user => {
            res.status(201).json({
                message: "Usuario creado correctamente",
                user: user
            });
        })
        .catch(error => {
            res.status(error.status || 500).json({
                message: "Error al crear usuario",
                error: error.message
            });
        });
};

const updateUser = (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;

    if (!updateData.password) {
        User.findByIdAndUpdate(userId, updateData, { new: true })
            .then(updatedUser => {
                if (!updatedUser) {
                    return res.status(404).json({
                        message: "El usuario no existe"
                    });
                }

                const { password, ...userData } = updatedUser.toObject();

                res.status(200).json({
                    message: "Usuario actualizado correctamente",
                    user: userData
                });
            })
            .catch(error => {
                res.status(500).json({
                    message: "Error al actualizar usuario",
                    error: error.message
                });
            });
    } else {
        bcryptjs.genSalt(10)
            .then(salt => bcryptjs.hash(updateData.password, salt))
            .then(hashedPassword => {
                updateData.password = hashedPassword;
                return User.findByIdAndUpdate(userId, updateData, { new: true });
            })
            .then(updatedUser => {
                if (!updatedUser) {
                    return res.status(404).json({
                        message: "El usuario no existe"
                    });
                }

                const { password, ...userData } = updatedUser.toObject();

                res.status(200).json({
                    message: "Usuario actualizado correctamente",
                    user: userData
                });
            })
            .catch(error => {
                res.status(500).json({
                    message: "Error al actualizar usuario",
                    error: error.message
                });
            });
    }
};

const deleteUser = (req, res) => {
    const { userId } = req.params;

    User.findByIdAndUpdate(userId, { active: false }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }
            res.status(200).json({
                message: "Usuario marcado como inactivo",
                user: user
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al desactivar usuario",
                error: error.message
            });
        });
}

export {
    getAllUsers,
    getOnlyUser,
    createUser,
    updateUser,
    deleteUser
}
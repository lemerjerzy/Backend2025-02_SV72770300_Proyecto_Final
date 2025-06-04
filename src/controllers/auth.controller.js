import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";

const signup = async (req, res) => {
    try {
        const { username, password, email, roles } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({
                message: "Faltan campos obligatorios",
                fields: {
                    username: "obligatorio",
                    password: "obligatorio",
                    email: "obligatorio"
                }
            });
        }

        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                message: "El usuario o email ya existe"
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = new UserModel({
            username,
            email,
            password: hashedPassword,
            roles: roles ?? ["user"]
        });

        await user.save();

        res.status(201).json({
            message: "Usuario creado correctamente",
            user: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear usuario",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const matchPassword = await bcryptjs.compare(password, user.password);
        if (!matchPassword) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = jsonwebtoken.sign(
            { id: user._id },
            process.env.COOKIE_SECRET,
            {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: 86400
            }
        );

        req.session.token = token;

        res.status(200).json({ message: "Inicio de sesión exitoso" });
    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar sesión",
            error: error.message || error
        });
    }
};

const logout = (req, res) => {
    try {
        req.session = null;
        res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
        res.status(500).json({
            message: "Error al cerrar sesión",
            error: error.message || error
        });
    }
};

export {
    signup,
    login,
    logout
};

import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const validateAuthJwt = async (req, res, next) => {
    try {
        const token = req.session?.token;

        if (!token) {
            return res.status(401).json({
                message: "Acceso denegado"
            });
        }

        const decoded = jsonwebtoken.verify(token, process.env.COOKIE_SECRET);

        const userFound = await UserModel.findById(decoded.id);

        if (!userFound) {
            return res.status(401).json({
                message: "Usuario no encontrado"
            });
        }

        req.user = userFound.toJSON();
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o expirado",
            error: error.message
        });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes("admin")) {
        return res.status(403).json({
            message: "Requiere rol de administrador"
        });
    }
    next();
};

const isModerator = (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes("moderator")) {
        return res.status(403).json({
            message: "Requiere rol de moderador"
        });
    }
    next();
};

export {
    validateAuthJwt,
    isAdmin,
    isModerator
}

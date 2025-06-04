import Category from "../models/category.model.js";

const getAllCategories = (req, res) => {
    Category.find({
        active: true
    })
        .then(categories => {
            res.status(200).json({
                message: "Categorias obtenidos correctamente",
                categories: categories
            })
        }).catch(error => {
            res.status(500).json({
                message: "Error al obtener las categorías",
                error: error.message
            })
        })
}

const getOnlyCategory = (req, res) => {
    const { categoryId } = req.params;
    Category.findById(categoryId)
        .then(category => {
            res.status(200).json({
                message: "Categoría obtenido correctamente",
                category: category
            })
        }).catch(error => {
            res.status(500).json({
                message: "Error al obtener categoría",
                error: error.message
            })
        })
}

const createCategory = (req, res) => {

    const { name, description } = req.body;

    Category.findOne({
        name: name
    }).then(existCategory => {
        if (existCategory) {
            res.status(400).json({
                message: "La categoría ya existe",
                existCategory: existCategory
            })
        }

        const category = new Category({
            name: name,
            description: description
        })

        return category.save();

    }).then(newCategory => {
        res.status(201).json({
            message: 'Categoría creada correctamente',
            category: newCategory
        });
    })
        .catch(error => {
            res.status(500).json({
                message: 'Error al crear la categoría',
                error: error.message
            });
        });
};

const updateCategory = (req, res) => {
    const { categoryId } = req.params;
    const updateData = req.body;

    Category.findByIdAndUpdate(categoryId, updateData, { new: true })
        .then(updatedCategory => {
            if (!updatedCategory) {
                return res.status(404).json({
                    message: "La categoría no existe"
                });
            }
            res.status(200).json({
                message: "Categoría actualizada correctamente",
                user: updatedCategory
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al actualizar categoría",
                error: error.message
            });
        });
};

const deleteCategory = (req, res) => {
    const { categoryId } = req.params;

    Category.findByIdAndUpdate(categoryId, { active: false }, { new: true })
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: "Categoría no encontrado"
                });
            }
            res.status(200).json({
                message: "Categoría marcado como inactivo",
                user: category
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al desactivar categoría",
                error: error.message
            });
        });
}

export {
    getAllCategories,
    getOnlyCategory,
    createCategory,
    updateCategory,
    deleteCategory
}
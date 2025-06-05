import Course from "../models/course.model.js";
import Category from "../models/category.model.js"

const getAllCourses = (req, res) => {
    Course.find({
        active: true
    }).populate("category")
        .then(courses => {
            res.status(200).json({
                message: "Cursos obtenidos correctamente",
                courses: courses
            })
        }).catch(error => {
            res.status(500).json({
                message: "Error al obtener cursos",
                error: error.message
            })
        })
}

const getOnlyCourse = (req, res) => {
    const { courseId } = req.params;
    Course.findById(courseId).populate("category")
        .then(course => {
            res.status(200).json({
                message: "Curso obtenido correctamente",
                course: course
            })
        }).catch(error => {
            res.status(500).json({
                message: "Error al obtener curso",
                error: error.message
            })
        })
}

const createCourse = (req, res) => {
    const { name, description, img, value, category } = req.body;

    const course = new Course({
        name: name,
        description: description,
        img: img,
        value: value,
        category: category
    });

    course.save()
        .then(newCourse => {
            res.status(200).json({
                message: "Curso creado correctamente",
                course: newCourse
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al crear el curso",
                error: error.message
            });
        });
};

const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const updateData = req.body;

    Course.findByIdAndUpdate(courseId, updateData, { new: true })
        .then(updatedCourse => {
            if (!updatedCourse) {
                return res.status(404).json({
                    message: "El curso no existe"
                });
            }
            res.status(200).json({
                message: "Curso actualizado correctamente",
                course: updatedCourse
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al actualizar curso",
                error: error.message
            });
        });
};

const deleteCourse = (req, res) => {
    const { courseId } = req.params;

    Course.findByIdAndUpdate(courseId, { active: false }, { new: true })
        .then(course => {
            if (!course) {
                return res.status(404).json({
                    message: "Curso no encontrado"
                });
            }
            res.status(200).json({
                message: "Curso marcado como inactivo",
                course: course
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al desactivar curso",
                error: error.message
            });
        });
}

const filterCourses = (req, res) => {
    let { query = "", page = 1, limit = 5 } = req.body;

    const regexQuery = new RegExp(query, 'i');
    const skip = (page - 1) * limit;

    const filter = {
        $or: [
            { name: { $regex: regexQuery } },
            { description: { $regex: regexQuery } }
        ]
    };

    Promise.all([
        Course.find(filter).skip(skip).limit(limit),
        Course.countDocuments(filter)
    ])
    .then(([filteredCourses, total]) => {

        if (!filterCourses) {
            return res.status(404).json({
                message: "No se encontraron cursos"
            })
        }

        res.status(200).json({
            message: "Cursos filtrados correctamente",
            courses: filteredCourses,
            pagination: {
                coursesPerPage: limit,
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalCourses: total
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Error al filtrar cursos",
            error: error.message
        });
    });
};

const filterCoursesPerCategory = (req, res) => {
    let { query = "", page = 1, limit = 5 } = req.body;

    const regexQuery = new RegExp(query, 'i');
    const skip = (page - 1) * limit;

    Category.find({ name: { $regex: regexQuery } }).select('_id')
        .then(matchCategories => {

            const selectCategoryId = matchCategories.map(category => category._id);

            const filter = { category: { $in: selectCategoryId } };

            return Promise.all([
                Course.find(filter).skip(skip).limit(limit),
                Course.countDocuments(filter)
            ]);
        })
        .then(([filteredCourses, total]) => {

            if (!filterCourses) {
                return res.status(404).json({
                    message: "No hay cursos en la categoría seleccionada"
                })
            }

            res.status(200).json({
                message: "Cursos filtrados correctamente",
                courses: filteredCourses,
                pagination: {
                    coursesPerPage: limit,
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / limit),
                    totalCourses: total
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al filtrar cursos por categoría",
                error: error.message
            });
        });
};

export {
    getAllCourses,
    getOnlyCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    filterCourses,
    filterCoursesPerCategory
}
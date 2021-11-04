let express = require('express'); // Solicitud de Express
let router = express.Router(); //Módulo Router de Express
const path = require('path'); //Módulo Path de Express


/* *****Controlador de usuario***** */
let userController = require('../controllers/userController.js');



const multer = require('multer');
const { body, validationResult } = require('express-validator');

const registerValidation = [
    body('firstName').notEmpty().withMessage('Debes ingresar un nombre'),
    body('lastName').notEmpty().withMessage('Debes ingresar un apellido'),
    body('zipCode').notEmpty().withMessage('Debes ingresar un código postal'),
    body('email')
        .notEmpty().withMessage('Debes ingresar un correo electrónico').bail()
        .isEmail().withMessage('Debes ingresar un formato de correo electrónico válido'),
    body('nickname').notEmpty().withMessage('Debes ingresar un usuario'),
    body('password').notEmpty().withMessage('Debes ingresar una contraseña')
        .bail(),
    body('repeatPassword').notEmpty().withMessage('Debes repetir la contraseña'),
    body('image').custom((value, { req }) => {
        let file = req.file;
        let acceptedExtensions = ['.jpg', '.png', '.jpeg'];

        if (!file) {
            throw new Error('Tienes que subir una imagen');
        } else {
            let fileExtension = path.extname(file.originalname);
            if (!acceptedExtensions.includes(fileExtension)) {
                throw new Error('Las extensiones de archivo permitidas son .jpg, .png, .jpeg');

            }
        }
        return true
    })
]

const loginValidation = [ //Array de validaciones de login
    body('user').notEmpty().withMessage('Debes ingresar un usuario o email'),
    body('password').notEmpty().withMessage('Debes ingresar una contraseña')
]

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/usersImages')
    },
    filename: function (req, file, cb) {
        /*cb(null, (imagesCounter + '_' + req.body.name +  '.jpg'))*/
        /*cb(null, (this.req.file.filename))*/
        cb(null, (Date.now() + path.extname(file.originalname)));
    }
})

const userCrud = multer({ storage: storage });

/* *****A página register***** */
router.get('/register', userController.register);
router.post('/register', userCrud.single('image'), registerValidation, userController.create); //Revisar que si un usuario no se genera, pero si se cargó la foto, la misma se almacena

/* *****A página login***** */
router.get('/login', userController.login);
router.post('/login', loginValidation, userController.logprocess)



module.exports = router; // Exportación ruteo
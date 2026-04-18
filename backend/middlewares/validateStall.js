const { body } = require('express-validator');

exports.validateStall = [
    body('eventName').trim().notEmpty().withMessage('Event name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

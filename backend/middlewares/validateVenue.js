const { body } = require('express-validator');

exports.validateVenue = [
    body('name').trim().notEmpty().withMessage('Venue name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
];

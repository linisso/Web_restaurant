var Guest = require('../models/guest');
const { body, validationResult } = require('express-validator');

exports.guest_all = function(req, res, next) {
    Guest.find({}, 'first_name second_name date_of_reservation table time_of_reservation').exec(function (err, list_guests) {
        if (err) { return next(err); }
        res.render('guest_all', {title: 'All guests', guest_list: list_guests });
    })
}

//Создать новую бронь - GET
exports.guest_create_get = function(req, res, next) {
    res.render('guest_form', { title: 'Reservations', tables: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        times: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'] })
}

//Создать новую бронь - POST
exports.guest_create_post = [
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('This field is required'),
    body('second_name').trim().isLength({ min: 1 }).escape().withMessage('This field is required'),
    body('date_of_reservation', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        var guest = new Guest({
            first_name: req.body.first_name,
            second_name: req.body.second_name,
            date_of_reservation: req.body.date_of_reservation,
            time_of_reservation: req.body.time,
            table: req.body.table
        })
        
        // Сохраняем с проверкой того, что не один зал не бронируется в один день два раза подряд
        Guest.find({date_of_reservation: guest.date_of_reservation, table: guest.table, time_of_reservation: guest.time_of_reservation}, 
            'date_of_reservation table time_of_reservation')
        .exec(function (err, same_date_table) {
            if (err) { return console.log(err) }
            else {
                if (same_date_table.length === 0 && errors.isEmpty()) {
                    guest.save(function (err) {
                        if (err) { return next(err); }
                        res.redirect(guest.url);
                    })
                } else {
                    res.render('guest_form', { title: 'Reservations', 
                        tables: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
                        errors: [`Sorry, "${guest.table}" the table is already taken, ${guest.time_of_reservation} 
                        ${guest.date_of_reservation_formatted}, please try again.`], 
                        times: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
                            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'],
                        guest: guest })
                }
            }
        })
    }
]

//Показать информацию по конкретной брони - Get
exports.guest_detail = function(req, res, next) {
    Guest.findById(req.params.id).exec(function (err, info) {
        if (err) return res.render('guest_instance', {
            title: 'Reservation information', error: `The entered unique number does not exist, please try again`});
        res.render('guest_instance', {
            title: 'Reservation information', guest_info: info, error: `The entered unique number does not exist, please try again`});
    })}

//Отменить бронь - POST
exports.guest_delete_post = function(req, res, next) {
    Guest.findByIdAndRemove(req.params.id, function deleteGuest(err) {
        if (err) { return next(err); }
        res.render('deleted_guest', {
            title: 'Cancellation of reservation', mes: `Your reservation is canceled`})
    })
}

//Изменить параметры брони - GET
exports.guest_change_get = function(req, res, next) {
    Guest.findById(req.params.id).exec(function (err, guest_info) {
        if (err) { return next(err); }
        res.render('guest_form', {
            title: 'Change of reservation', guest: guest_info, 
            tables: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], times: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
                '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'] });
    })

}

//Изменить параметры брони - GET
exports.guest_change_post = [
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('This field is required')
        .isAlphanumeric().withMessage('Unacceptable symbols!'),
    body('second_name').trim().isLength({ min: 1 }).escape().withMessage('This field is required')
        .isAlphanumeric().withMessage('Unacceptable symbols!'),
    body('date_of_reservation', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        var guest = new Guest({
            first_name: req.body.first_name,
            second_name: req.body.second_name,
            date_of_reservation: req.body.date_of_reservation,
            table: req.body.table,
            time_of_reservation: req.body.time,
            _id: req.params.id
        })
        
        // Сохраняем с проверкой того, что ни один зал не бронируется в один день два раза подряд
        Guest.find({date_of_reservation: guest.date_of_reservation, table: guest.table, time_of_reservation: guest.time_of_reservation}, 
            'date_of_reservation table time_of_reservation').exec(function (err, same_date_table) {
                console.log(same_date_table)
            if (err) { return console.log(err) }
            else {
                if (same_date_table.length === 0 && errors.isEmpty()) {
                    Guest.findByIdAndUpdate(req.params.id, guest, {}, function(err, theguest) {
                        if (err) { return next(err); }
                        res.redirect(theguest.url)
                    });
                } else {
                    res.render('guest_form', {
                        title: 'Reservations', 
                        tables: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
                        errors: [`Sorry, "${guest.table}" the table is already taken ${guest.time_of_reservation}
                        ${guest.date_of_reservation_formatted}, please try again.`], 
                        times: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
                            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'], guest: guest })
                }
            }
        })
    }
]

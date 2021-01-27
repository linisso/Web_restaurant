var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var GuestSchema = new Schema(
    {
        first_name: { type: String, required: true, maxlength: 100 },
        second_name: { type: String, required: true, maxlength: 100 },
        table: { type: String, required: true, enum: ['1', '2', '3', '4', '5', '6','7', '8', '9'] },
        time_of_reservation: { type: String, required: true, enum: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'] },
        date_of_reservation: { type: Date, required: true }
    }
);

// Virtual for author's full name
GuestSchema
    .virtual('name')
    .get(function () {
        return this.first_name + ' ' + this.second_name;
    });

// Virtual for bookinstance's URL
GuestSchema
    .virtual('url')
    .get(function () {
        return '/guest/' + this._id;
    });

GuestSchema
    .virtual('date_of_reservation_formatted')
    .get(function () {
        return this.date_of_reservation ? moment(this.date_of_reservation).format('YYYY-MM-DD') : '';
    });

//Export model
module.exports = mongoose.model('Guest', GuestSchema);
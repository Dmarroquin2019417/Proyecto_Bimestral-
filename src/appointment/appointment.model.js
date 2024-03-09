'use strict';

import { Schema, model } from "mongoose";

const appointmentSchema = Schema({
    date: {
        type: Date,
    },
    status: {
        type: String,
        enum: [ 'CANCELLED', 'COMPLETED', 'PURCHASED'],
        default: 'COMPLETED',
        required: true,
    },
    producto: {
        type: Schema.ObjectId,
        ref: 'Producto',
        required: true,
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true,
    }, 
}, {
    versionKey: false,
});

export default model('Appointment', appointmentSchema);
const express = require('express');
const request = require('supertest');
const backend = require('../controller/backend.js');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

jest.mock('bcrypt');
jest.mock('../models/user');

describe('userLogout', () => {
    let req, res;

    //console.log(backend);

    beforeEach(() => {
        req = { session: { destroy: jest.fn() } };
        res = {
            clearCookie: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should destroy the session and redirect', done => {
        req.session.destroy.mockImplementation(callback => callback(null));
        backend.backendLogout(req, res); 

        process.nextTick(() => {
            expect(req.session.destroy).toHaveBeenCalled();
            expect(res.clearCookie).toHaveBeenCalledWith('connect.sid');
            expect(res.redirect).toHaveBeenCalledWith('/');
            done();
        });
    });

    it('should return 500 on error', done => {
        req.session.destroy.mockImplementation(callback => callback(new Error('Zerstörungsfehler')));
        backend.backendLogout(req, res); 
        process.nextTick(() => {
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Interner Serverfehler');
            done();
        });
    });
});

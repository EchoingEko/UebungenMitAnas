const express = require('express');
const request = require('supertest');
const backend = require('../controller/backend.js');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');


jest.mock('bcrypt');
jest.mock('../models/user');

describe('userLogout', () => {
    let req, res;

    beforeEach(() => {
        req = { session: { destroy: jest.fn() } };
        res = {
            clearCookie: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should destroy the session and redirect', async () => {
        req.session.destroy.mockImplementation(callback => callback(null));
        await backend.userLogout(req, res);
        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.clearCookie).toHaveBeenCalledWith('connect.sid');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should return 500 on error', async () => {
        req.session.destroy.mockImplementation(callback => callback(new Error('Zerstörungsfehler')));
        await backend.userLogout(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Interner Serverfehler');
    });
});

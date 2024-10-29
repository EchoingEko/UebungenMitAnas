const express = require('express');
const request = require('supertest');
const backend = require('../controller/backend.js');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');


jest.mock('bcrypt');
jest.mock('../models/user');


describe('backendLogin function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            session: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            redirect: jest.fn(),
        };
    });

    it('should return 400 if username or password are missing', async () => {
        req.body = {};
        await backend.backendLogin(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Benutzername und Passwort sind erforderlich');
    });
});








const express = require('express');
const request = require('supertest'); 
const backend = require('../controller/backend.js');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');  

jest.mock('../models/user'); 
jest.mock('bcrypt');

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
        req.body = {}; // Kein Benutzername und Passwort
        await backend.backendLogin(req, res); // Zugriff über backend.backendLogin
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Benutzername und Passwort sind erforderlich');
    });

    // Weitere Tests...
});
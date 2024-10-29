const express = require('express');
const request = require('supertest');
const backend = require('../controller/backend.js');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');


jest.mock('bcrypt');
jest.mock('../models/user');

describe('backendRegistration', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should return 400 if username or password are missing', async () => {
        await backend.backendRegistration(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Benutzername und Passwort sind erforderlich');
    });

    it('should return 400 if username is already taken', async () => {
        req.body = { username: 'testuser', password: 'password123' };
        User.findOne.mockResolvedValue({});
        await backend.backendRegistration(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Benutzername bereits vergeben');
    });

    it('should create a new user and return success message', async () => {
        req.body = { username: 'a', password: 'a' };
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedpassword');

        await backend.backendRegistration(req, res);
        expect(User.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith('Erfolgreich registriert: testuser');
    });

    it('should return 500 on error', async () => {
        req.body = { username: 'a', password: 'a' };
        User.findOne.mockRejectedValue(new Error('Datenbankfehler'));

        await backend.backendRegistration(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Interner Serverfehler');
    });
});
const express = require('express');
const request = require('supertest');
const backend = require('../controller/backend.js');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');


jest.mock('bcrypt');
jest.mock('../models/user');


describe('addUser', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should add a new user and redirect', async () => {
        req.body = { username: 'newuser', password: 'newpassword' };
        bcrypt.hash.mockResolvedValue('hashedpassword');

        await backend.addUser(req, res);
        expect(User.prototype.save).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should return 500 on error', async () => {
        req.body = { username: 'newuser', password: 'newpassword' };
        bcrypt.hash.mockRejectedValue(new Error('Hash-Fehler'));

        await backend.addUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Interner Serverfehler');
    });
});
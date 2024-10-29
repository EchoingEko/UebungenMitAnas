const express = require('express');
const request = require('supertest');
const backend = require('../controller/backend.js');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');


jest.mock('bcrypt');
jest.mock('../models/user');



describe('editOrUpdateUser', () => {
    let req, res;

    beforeEach(() => {
        req = { params: { id: '123' }, body: {}, method: 'GET' };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            redirect: jest.fn(),
        };
    });

    it('should return 404 if user is not found', async () => {
        User.findById.mockResolvedValue(null);
        await backend.editOrUpdateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Benutzer nicht gefunden');
    });

    it('should render the edit form for the user', async () => {
        const mockUser = { _id: '123', username: 'testuser' };
        User.findById.mockResolvedValue(mockUser);
        await backend.editOrUpdateUser(req, res);
        expect(res.send).toHaveBeenCalled();
    });

    it('should update the user and redirect on POST', async () => {
        req.method = 'POST';
        req.body = { username: 'updateduser', password: 'newpassword' };
        const mockUser = { _id: '123', username: 'testuser', password: 'oldpassword', save: jest.fn() };
        User.findById.mockResolvedValue(mockUser);
        bcrypt.hash.mockResolvedValue('hashedpassword');

        await backend.editOrUpdateUser(req, res);
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should return 500 on error', async () => {
        req.method = 'POST';
        req.body = { username: 'updateduser' };
        User.findById.mockRejectedValue(new Error('Datenbankfehler'));

        await backend.editOrUpdateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Interner Serverfehler');
    });
});
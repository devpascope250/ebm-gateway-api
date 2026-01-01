"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
class UserService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    async getAllUsers() {
        return await this.userRepository.findAll();
    }
    async getUserById(id) {
        return await this.userRepository.findById(id);
    }
    async createUser(userData) {
        // Check if email already exists
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        return await this.userRepository.create(userData);
    }
    async updateUser(id, userData) {
        if (userData.email) {
            const existingUser = await this.userRepository.findByEmail(userData.email);
            if (existingUser && existingUser.id !== id) {
                throw new Error('Email already exists');
            }
        }
        return await this.userRepository.update(id, userData);
    }
    async deleteUser(id) {
        return await this.userRepository.delete(id);
    }
}
exports.UserService = UserService;

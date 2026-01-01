"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
class UserController {
    constructor() {
        this.getAllUsers = async (req, res) => {
            try {
                const users = await this.userService.getAllUsers();
                res.json({
                    success: true,
                    data: users,
                    count: users.length
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error fetching users',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        };
        this.getUserById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const user = await this.userService.getUserById(id);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                    return;
                }
                res.json({
                    success: true,
                    data: user
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error fetching user',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        };
        this.createUser = async (req, res) => {
            try {
                const userData = req.body;
                const userId = await this.userService.createUser(userData);
                res.status(201).json({
                    success: true,
                    message: 'User created successfully',
                    data: { id: userId }
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: 'Error creating user',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        };
        this.updateUser = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const userData = req.body;
                const success = await this.userService.updateUser(id, userData);
                if (!success) {
                    res.status(404).json({
                        success: false,
                        message: 'User not found or no changes made'
                    });
                    return;
                }
                res.json({
                    success: true,
                    message: 'User updated successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: 'Error updating user',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        };
        this.deleteUser = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const success = await this.userService.deleteUser(id);
                if (!success) {
                    res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                    return;
                }
                res.json({
                    success: true,
                    message: 'User deleted successfully'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error deleting user',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        };
        this.userService = new UserService_1.UserService();
    }
}
exports.UserController = UserController;

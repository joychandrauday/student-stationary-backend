"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const globalErrorHandler_1 = require("../Error/globalErrorHandler");
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../Utils/catchAsync"));
// registering user by hashed password use userService
const registeringUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        //  check if the user already exists
        const existingUser = yield user_service_1.userService.getSingleUser(email);
        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists",
                success: false,
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role: "user",
            status: 'active',
            avatar: "",
            paymentMethods: [],
            cart: []
        };
        const user = yield user_service_1.userService.registeringUserService(newUser);
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: 'User created successfully',
            data: user,
        });
    }
    catch (error) {
        (0, globalErrorHandler_1.errorHandler)(error, res);
    }
});
// log in user
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: true,
            message: "Provide Proper credentials!",
            data: {},
        });
        return;
    }
    const result = yield user_service_1.userService.loginUser({ email, password });
    const { accessToken, refreshToken, user } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User logged in successfully!",
        data: {
            accessToken,
            refreshToken,
            user
        },
    });
}));
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield user_service_1.userService.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access token is retrieved succesfully!',
        data: result,
    });
});
// getting user from database
const gettingUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Save the new user to the database
        const user = yield user_service_1.userService.getUsers();
        // Send success response
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: 'User retrive successfully',
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
//get single user
const gettingSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        if (!userId) {
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                success: true,
                message: "Provide userId!",
                data: {},
            });
            return;
        }
        const user = yield user_service_1.userService.getSingleUser(userId);
        // Send success response
        res.status(200).json({
            message: 'User retrieved successfully',
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
//get single user
const gettingSingleUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield user_service_1.userService.getSingleUserById(userId);
        // Send success response
        res.status(200).json({
            message: 'User retrieved successfully',
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser = yield user_service_1.userService.editUser(userId, updatedData);
        if (!updatedUser) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: 'User not found!',
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'User updated successfully!',
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
// delete user
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const deletedUser = yield user_service_1.userService.deleteUser(userId);
        if (!deletedUser) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: 'User not found!',
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'User deleted successfully!',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
// sending to routes
exports.userController = {
    registeringUser,
    loginUser,
    updateUser,
    refreshToken,
    gettingUsers,
    gettingSingleUser,
    gettingSingleUserById,
    deleteUser
};

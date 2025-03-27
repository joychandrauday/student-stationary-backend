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
exports.BrandController = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const brand_service_1 = __importDefault(require("./brand.service"));
const addBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brandData = req.body;
        const newMessage = yield brand_service_1.default.addBrand(brandData);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'Brand added successfully',
            data: newMessage
        });
    }
    catch (error) {
        let errorMessage = 'Failed to added brand';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
const getBrandAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield brand_service_1.default.getBrand();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'brand retrieved successfully',
            data: messages
        });
    }
    catch (error) {
        let errorMessage = 'Failed to retrieve brand';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
// editing Brand using put method
const updateBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BrandId = req.params.id;
        const BrandData = req.body;
        const updatedBrand = yield brand_service_1.default.editBrand(BrandId, BrandData);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Brand updated successfully',
            data: updatedBrand
        });
    }
    catch (error) {
        let errorMessage = 'Failed to update Brand';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
// deleting Brand using delete method
const deleteBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BrandId = req.params.id;
        yield brand_service_1.default.deleteBrand(BrandId);
        res.status(204).send();
    }
    catch (error) {
        let errorMessage = 'Failed to delete Brand';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
exports.BrandController = {
    addBrand,
    getBrandAll,
    updateBrand,
    deleteBrand,
};

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
const brand_model_1 = __importDefault(require("./brand.model"));
const addBrand = (brand) => __awaiter(void 0, void 0, void 0, function* () {
    return yield brand_model_1.default.create(brand);
});
const getBrand = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield brand_model_1.default.find();
});
// edit Brand using put method
const editBrand = (brandId, updatedBrand) => __awaiter(void 0, void 0, void 0, function* () {
    return yield brand_model_1.default.findByIdAndUpdate(brandId, updatedBrand, { new: true });
});
const deleteBrand = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield brand_model_1.default.findByIdAndDelete(brandId);
});
exports.default = {
    addBrand,
    getBrand,
    editBrand,
    deleteBrand
};

import { IBrand } from "./brand.interface";
import Brand from "./brand.model";


const addBrand = async (brand: IBrand) => {
    return await Brand.create(brand);
};

const getBrand = async () => {
    return await Brand.find()
};
// edit Brand using put method

const editBrand = async (brandId: string, updatedBrand: IBrand) => {
    return await Brand.findByIdAndUpdate(brandId, updatedBrand, { new: true });
};

const deleteBrand = async (brandId: string) => {
    return await Brand.findByIdAndDelete(brandId);
};

export default {
    addBrand,
    getBrand,
    editBrand,
    deleteBrand
};

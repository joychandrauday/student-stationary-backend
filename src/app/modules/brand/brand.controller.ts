import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../Utils/sendResponse';
import brandService from './brand.service';

const addBrand = async (req: Request, res: Response) => {
    try {
        const brandData = req.body;
        const newMessage = await brandService.addBrand(brandData);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Brand added successfully',
            data: newMessage
        });
    } catch (error) {
        let errorMessage = 'Failed to added brand';

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
};

const getBrandAll = async (req: Request, res: Response) => {
    try {
        const messages = await brandService.getBrand();

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'brand retrieved successfully',
            data: messages
        });
    } catch (error) {
        let errorMessage = 'Failed to retrieve brand';

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
};
// editing Brand using put method

const updateBrand = async (req: Request, res: Response) => {
    try {
        const BrandId = req.params.id;
        const BrandData = req.body;

        const updatedBrand = await brandService.editBrand(BrandId, BrandData);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Brand updated successfully',
            data: updatedBrand
        });
    } catch (error) {
        let errorMessage = 'Failed to update Brand';

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
};

// deleting Brand using delete method
const deleteBrand = async (req: Request, res: Response) => {
    try {
        const BrandId = req.params.id;
        await brandService.deleteBrand(BrandId);
        res.status(204).send();
    } catch (error) {
        let errorMessage = 'Failed to delete Brand';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
};

export const BrandController = {
    addBrand,
    getBrandAll,
    updateBrand,
    deleteBrand,

}

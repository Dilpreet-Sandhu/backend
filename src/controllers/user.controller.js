import { asyncHandler } from '../utils/asyncHandler.js';



export const RegisterUser = asyncHandler(async function(req,res) {
    res.status(200).json({
        message : 'ok'
    })
})
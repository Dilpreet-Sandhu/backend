// export const asyncHandler = (fn) =>
//   async function (req, res, next) {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       res.error(error.code || 500).json({
//         success: true,
//         message: error.message,
//       });
//     }
//   };


export const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch(err => next(err))
    }
}


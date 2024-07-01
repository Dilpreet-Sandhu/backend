import e, {Router} from 'express';
import { addComment, deleteComment, updateComment, viewAllVideoComments } from '../controllers/comment.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js'

export const CommentRouter = Router();

CommentRouter.route('/addComment/:videoId').post(verifyJWT,addComment)
CommentRouter.route('/view/:videoId').get(viewAllVideoComments)
CommentRouter.route('/update/:commentId').patch(verifyJWT,updateComment)
CommentRouter.route('/del/:commentId').delete(deleteComment)
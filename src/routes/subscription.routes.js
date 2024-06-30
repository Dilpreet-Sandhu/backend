import {Router} from 'express';
import {subscribersCount, subscriptionsCount, toggleSubscription} from '../controllers/subscription.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js'

export const SubscriptionRouter = Router();


SubscriptionRouter.route('/subscribe/:channelId').post(verifyJWT,toggleSubscription)
SubscriptionRouter.route('/subscribers/:channelId').get(subscribersCount)
SubscriptionRouter.route('/subscriptions').get(verifyJWT,subscriptionsCount)
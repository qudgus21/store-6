import { Router } from 'express';
import {
  handleOauthFacebook,
  handleOauthFacebookCallback,
  handleOauthGoogle,
  handleOauthGoogleCallback,
} from './oauthController';

const oauthRouter = Router();

export default (router: Router) => {
  router.use('/oauth', oauthRouter);

  oauthRouter.get('/google', handleOauthGoogle);
  oauthRouter.get('/google/callback', handleOauthGoogleCallback);

  oauthRouter.get('/facebook', handleOauthFacebook);
  oauthRouter.get('/facebook/callback', handleOauthFacebookCallback);

  return router;
};
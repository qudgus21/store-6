import { NextFunction, Request, Response } from 'express';
import { Container } from 'typeorm-typedi-extensions';
import * as oauthHelper from '@/helper/oauth';
import OAuthService from '@/service/oauth';

export const handleOauthGoogle = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.redirect(oauthHelper.getOauthGoogleRedirectUrl());
  } catch (e) {
    next(e);
  }
};

export const handleOauthGoogleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code } = req.query;
    const oauthServiceInstance = Container.get(OAuthService);

    const accessToken = await oauthServiceInstance.getGoogleAccessToken(
      code as string,
    );
    const { id, email, picture } = await oauthServiceInstance.getGoogleUserInfo(
      accessToken,
    );

    res.json({ id, email, picture });
  } catch (e) {
    next(e);
  }
};

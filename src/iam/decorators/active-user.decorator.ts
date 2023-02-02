import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constants';
import { ActiveUserData, Maybe } from '../types';

export const ActiveUser = createParamDecorator(
  (field: Maybe<keyof ActiveUserData>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: Maybe<ActiveUserData> = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);

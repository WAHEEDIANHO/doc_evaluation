import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExtractToken } from '../utils/exract-token';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private extractToken: ExtractToken
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const user = request?.user;
    
    console.log(user,  "user is")
    
    if (!user) throw new UnauthorizedException();
    
    return user.isAdmin;
  }
}

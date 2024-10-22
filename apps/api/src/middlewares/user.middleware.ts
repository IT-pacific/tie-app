
import type { Request, Response, NextFunction } from 'express';
import { getTokenInfo } from '../utils';
import type { TUser } from '../types';
import { User } from '../models/user.model';

 class UserMiddleware {
    constructor() {}

    validateToken(req: Request, res: Response, next: NextFunction) {
        const token = getTokenInfo({ req });
        return token?.is_valid_token ? next() : res.status(408).send({ error: 'Unauthorized' });
    }

     hasRole(role: string) {
        return async(req: Request, res: Response, next: NextFunction) => {
            const userId = getTokenInfo({ req })?.user?.userId;
            const user = await User.findById(userId);
         
            const has_role = (user as unknown as TUser)?.role == role;
            return has_role ? next() : res.status(403).send({ error: 'Access Denied' });
        };
    }

    hasAllRoles(role: Array<string>) {
        return async (req: Request, res: Response, next: NextFunction) => {
           const userId = getTokenInfo({ req })?.user?.userId;
           const user = await User.findById(userId);
           
           const has_role = role.some((role)=>(user  as  unknown as  TUser)?.role==role);
           return has_role ? next() : res.status(403).send({ error: 'Access Denied' });
        }
    }
    // hasAllRole(roles: Array<string>) {
    //     return (req: Request, res: Response, next: NextFunction) => {
    //         const user = getTokenInfo({ req })?.user;
    //         const user_roles = (user as TUser)?.role;
    //         const has_role = roles.every((role) => user_roles.find((e) => e === role));
    //         return has_role ? next() : res.status(403).send({ error: 'Access Denied' });
    //     };
    // }

    // hasAnyRole(roles: Array<"recptionist"|"operator">) {
    //     return (req: Request, res: Response, next: NextFunction) => {
    //         const user = getTokenInfo({ req })?.user;
    //         const user_roles = (user as TUser)?.role;
    //         const has_role = roles.some((role) => user_roles.find((e) => e === role));
    //         return has_role ? next() : res.status(403).send({ error: 'Access Denied' });
    //     };
     // }
     getUploadImages(role: Array<String>) {
         return async (req: Request, res: Response, next: NextFunction) => {
             const token = req.query.token;
            const userId = getTokenInfo({token:token?.toString() })?.user?.userId;
            const user = await User.findById(userId);
            
            const has_role = role.some((role)=>(user  as  unknown as  TUser)?.role==role);
            return has_role ? next() : res.status(403).send({ error: 'Access Denied' });
         }
    }
}

export default new UserMiddleware
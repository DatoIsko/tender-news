import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { environment } from 'src/environments/environment';

@Injectable()
export class UniversalInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const newReq = request.clone({
      setHeaders: {
        'X-Api-Key': `${environment.NEWS_API_KEY}`
      }
    });

    return next.handle(newReq);
  }
}

import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from './home/environment';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {


  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
        const requestURL: Array<any> = req.url.split('/');
        const apiUrl = environment.api_url.split('/');
        const token = localStorage.getItem('x-access-token');

        if(token && (requestURL[2] === apiUrl[2])){
          const newRequest = req.clone({ setHeaders: {'x-access-token': `Bearer ${token}`} });
          return next.handle(newRequest);


        }
        else{
          return next.handle(req);
    }
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private API = 'http://localhost:3000/cliente'


  constructor(private http: HttpClient ) { }

  getClientes(): Observable<any>{
    let token = localStorage.getItem('x-access-token')!;
    const headers = {
    'x-access-token': token
    }
    return this.http.get(this.API,{
      'headers': new HttpHeaders(headers)
    });
  }


  login(usuario: any): Observable<any>{
    return this.http.post('http://localhost:3000/login', usuario);
        
  }

  logout(): boolean {
    localStorage.removeItem('access_token');
    return true;
  }


}

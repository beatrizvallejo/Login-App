import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = 'AIzaSyBVP0oNGqMySeK9ydlyKMxQVr-tcdnK2KQ';

  userToken:string;

  // Crear Nuevo Usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  constructor( private http : HttpClient) { 
    this.leerToken();
  }


  login( usuario:UsuarioModel  ){
    const authData = {
      ...usuario,
      returnSecureToken: true
    }

    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp => {
        this.guardarToken(resp['idToken']);
        return resp;
      })
  );
  }

  logout(){
     localStorage.removeItem('token');
  }

  createNewUser( usuario:UsuarioModel ){
      const authData = {
        ...usuario,
        returnSecureToken: true
      }

      return this.http.post(
        `${this.url}signUp?key=${this.apiKey}`,
        authData
      ).pipe(
          map(resp => {
            this.guardarToken(resp['idToken']);
            return resp;
          })
      );


  }

  private guardarToken (idToken:string){

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

  }

  leerToken(){
      if(localStorage.getItem('token')){
        this.userToken = localStorage.getItem('token');
      }else{
        this.userToken = '';
      }
  }


  isAutenticated():boolean{
    return this.userToken.length > 2;
  }



}

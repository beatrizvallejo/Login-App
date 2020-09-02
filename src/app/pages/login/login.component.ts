import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';

import{ NgForm } from '@angular/forms';

import{AuthService} from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: UsuarioModel;
  rememberMe:boolean = false;

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();

    if(localStorage.getItem('userEmail')){
      this.usuario.email = localStorage.getItem('userEmail');
      this.rememberMe = true;
    }
  }

  onSubmit( form: NgForm ){

    if( form.invalid){
        return;
    }

    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      text:'Espere por favor'
    });

    Swal.showLoading();

    this.auth.login(this.usuario).subscribe( resp => {
      console.log(resp);
      Swal.close();

      if(this.rememberMe){
        localStorage.setItem('userEmail', this.usuario.email);
      }

      this.router.navigateByUrl('/home');

    }, (err) => {
      console.log(err.error.error.message);
      Swal.fire({
        icon:'error',
        title:'Error de autenticación',
        text:err.error.error.message
      });
    });

   }

}

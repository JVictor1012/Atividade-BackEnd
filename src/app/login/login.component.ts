import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private service: LoginService, private router: Router) { }

  form = new FormGroup({
    user: new FormControl(),
    password: new FormControl(),
  });

  ngOnInit(): void {
    

  }


  onSubmit(): void {


    this.service
      .login(this.form.value)
      .subscribe({
        next: (response: any) => {

          response.token //Acesso ao token retornado da sua API

          localStorage.setItem('x-access-token',response.token);

          console.log(response.token)
          this.router.navigate(['/home']);
        },
        error: (erro: any) => console.log(erro)
      });



  }


}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dados: any;

  constructor(private service: LoginService, private router: Router) { 
    this.dados = ''
  }

  ngOnInit(): void {
    this.service.getClientes().subscribe({
      next: (retorno: any) => this.dados = retorno
    });
  }

  onLogoff(): void{
    if(this.service.logout()){
      this.router.navigate(['/login']);
    }
  }

}

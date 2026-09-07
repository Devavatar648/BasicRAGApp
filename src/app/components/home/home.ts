import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);
  private userService = inject(UserService);
  private isLoggedIn = signal(false);

  ngOnInit(){
    this.userService.isLoggedin.subscribe(res=>this.isLoggedIn.set(res));
  }

  getStarted(){
    console.log("Login status : "+this.isLoggedIn())
    if(this.isLoggedIn()) this.router.navigateByUrl('chatbot');
    else this.router.navigateByUrl('login');
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import users from '../database/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedin = new BehaviorSubject(false);

  login(email:string, password:string):boolean{
    const user = users.find(user=>user.email==email && user.password==password);
    if(user){
      localStorage.setItem('basicRAGAppUser', JSON.stringify(user));
      this.isLoggedin.next(true);
      return true;
    }
    return false;
  }
  
}

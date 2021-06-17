import { Component } from '@angular/core';
import { FireAuthService } from './services/fire-auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Pools', url: '/folder/Pools', icon: 'water' },
    { title: 'Users', url: '/folder/Users', icon: 'people' },
    { title: 'Admins', url: '/folder/Admins', icon: 'shield-half' }
  ];

  constructor(private fauth: FireAuthService) {}
}

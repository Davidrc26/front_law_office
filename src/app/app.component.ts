import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from './public/master-page/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
            ButtonModule, 
            NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front_law_office';
}

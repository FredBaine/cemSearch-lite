import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeOut', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', animate('1s ease-out'))
    ])
  ]
})
export class SplashScreenComponent implements OnInit {
  isVisible = true;

  private router = inject(Router);

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = false;
      setTimeout(() => {
        this.router.navigate(['/search']);
      }, 1000); // Wait for fade out animation to complete
    }, 3000); // 3 seconds delay
  }
}
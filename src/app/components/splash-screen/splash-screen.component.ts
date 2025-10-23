import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-splash-screen',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule],
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
  isVisible = signal(true);

  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    // Remove auto-navigation, let user choose when to proceed
  }

  goToSearch() {
    this.isVisible.set(false);
    setTimeout(() => {
      this.router.navigate(['/search']);
    }, 1000); // Wait for fade out animation to complete
  }

  donate() {
    // Show "under construction" message using snackbar
    this.snackBar.open(
      '🚧 Donation feature under construction - Coming Soon! 🚧', 
      'Close', 
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['donation-snackbar']
      }
    );
  }
}
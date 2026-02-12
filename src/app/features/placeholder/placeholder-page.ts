import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-placeholder-page',
  imports: [MatCard, MatCardContent, MatIcon],
  template: `
    <div class="placeholder-container">
      <mat-card class="placeholder-card">
        <mat-card-content>
          <mat-icon class="placeholder-icon">construction</mat-icon>
          <h2>{{ viewName }}</h2>
          <p>The {{ viewName }} report view is coming soon.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .placeholder-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .placeholder-card {
      text-align: center;
      padding: 48px;
      max-width: 400px;
    }

    .placeholder-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #DC3B75;
      opacity: 0.5;
      margin-bottom: 16px;
    }

    h2 {
      margin: 0 0 8px;
      color: #131619;
    }

    p {
      margin: 0;
      color: #666;
    }
  `,
})
export class PlaceholderPage {
  private route = inject(ActivatedRoute);
  viewName = this.route.snapshot.data['view'] ?? 'Unknown';
}

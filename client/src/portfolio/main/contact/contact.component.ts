import { Component, DestroyRef, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PortfolioData } from '../../data/portfolio.models';
import { PortfolioService } from '../../data/portfolio.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  @Input() portfolio!: PortfolioData;

  private readonly portfolioService = inject(PortfolioService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  submitMessage = '';
  submitState: 'idle' | 'sending' | 'success' | 'error' = 'idle';

  readonly contactForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['Portfolio inquiry', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(20)]],
  });

  ngOnInit(): void {}

  submitContactForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitState = 'sending';
    this.submitMessage = '';

    this.portfolioService
      .sendContactMessage(this.contactForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.submitState = 'success';
          this.submitMessage = response.message;
          this.contactForm.reset({
            name: '',
            email: '',
            subject: 'Portfolio inquiry',
            message: '',
          });
        },
        error: (error: HttpErrorResponse) => {
          this.submitState = 'error';
          this.submitMessage =
            error.error?.message ||
            'The message could not be sent. Check the server SMTP settings.';
        },
      });
  }

  isInvalid(controlName: 'name' | 'email' | 'subject' | 'message'): boolean {
    const control = this.contactForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}


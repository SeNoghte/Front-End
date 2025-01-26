import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './services/interceptor/auth.interceptor';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

// import { jwtInterceptor } from './interceptors/jwt.service';

export const PERSIAN_DATE_FORMATS = {
  parse: {
    dateInput: 'jYYYY/jMM/jDD',
  },
  display: {
    dateInput: 'jYYYY/jMM/jDD',
    monthYearLabel: 'jYYYY jMMM',
    dateA11yLabel: 'jYYYY/jMM/jDD',
    monthYearA11yLabel: 'jYYYY jMMM',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideToastr(),
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'fa-IR', // زبان فارسی
    },
    {
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: {
        useUtc: true, // فعال کردن حالت UTC در صورت نیاز
      },
    },
    {
      provide: DateAdapter,
      useClass: MatMomentDateModule,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'jYYYY/jMM/jDD',
        },
        display: {
          dateInput: 'jYYYY/jMM/jDD', 
          monthYearLabel: 'jYYYY jMMMM',
          dateA11yLabel: 'jYYYY/jMM/jDD',
          monthYearA11yLabel: 'jYYYY jMMMM',
        },
      },
    },
    
  ],
    
};

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { setHeaderInterceptor } from './shared/interceptors/set-header.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes ,withViewTransitions()), 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor,setHeaderInterceptor]))  ,
    importProvidersFrom(BrowserAnimationsModule,
      TranslateModule.forRoot({
       defaultLanguage:'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    provideAnimations(),
    provideToastr()
  ]

};

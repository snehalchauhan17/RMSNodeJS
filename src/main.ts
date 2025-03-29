import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import 'zone.js';  // REMOVE OR COMMENT THIS OUT
import { environment } from './environments/environment';

enableProdMode();

// Declare Zone.js and Angular globally to avoid TypeScript errors
declare global {
  interface Window {
    ng?: any;
    Zone?: any;
    Reflect?: any;
  }
}

// Bootstrap Angular app
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    setTimeout(() => {
      // Remove 'ng-version' attribute from the <html> element
      document.documentElement.removeAttribute('ng-version');

      // Hide Angular global object 'ng'
      if (window.ng) {
        Object.defineProperty(window, 'ng', {
          get: () => undefined,
          configurable: true,
        });
      }

      // Hide Zone.js global object if environment setting allows
      if (environment.hideZoneJs && window.Zone) {
        Object.defineProperty(window, 'Zone', {
          get: () => undefined,
          configurable: true,
        });
      }

      // Hide Reflect (used internally by Angular)
      if (window.Reflect) {
        Object.defineProperty(window, 'Reflect', {
          get: () => undefined,
          configurable: true,
        });
      }
    }, 500);  // Delay to ensure Angular has fully initialized
  })
  .catch((err) => console.error(err));
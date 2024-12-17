import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MytranslateService {

  private readonly _TranslateService = inject(TranslateService)
  private readonly _RendererFactory2 = inject(RendererFactory2).createRenderer(null,null)

  readonly _PLATFORM_ID = inject(PLATFORM_ID)
  constructor() {
if(isPlatformBrowser(this._PLATFORM_ID))
{

  this._TranslateService.setDefaultLang('en');

  this.setLang();
}
    
  }
  setLang(): void {
    let saveLang = localStorage.getItem('lang');
    if(saveLang !== null)
      {
        this._TranslateService.use(saveLang!);
      
      }
    if (saveLang === 'en') {
      document.documentElement.dir = 'ltr';
      this._RendererFactory2.setAttribute(document.documentElement,'dir','ltr');
      this._RendererFactory2.setAttribute(document.documentElement,'lang','en');

    }
    else if (saveLang === 'ar') {
      document.documentElement.dir = 'rtl';
      this._RendererFactory2.setAttribute(document.documentElement,'dir','rtl');
      this._RendererFactory2.setAttribute(document.documentElement,'lang','ar');


    }
  }
  changeLan(lan:string)
  {
    if(isPlatformBrowser(this._PLATFORM_ID))
      {
        localStorage.setItem('lang',lan);
        this.setLang();
      }
   
  }
}

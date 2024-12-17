import { Component, computed, OnInit, Signal, signal, WritableSignal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { FlowbiteService } from '../../../shared/services/flowbite/flowbite.service';
import { CartService } from '../../../shared/services/cart/cart.service';
import { NgClass } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MytranslateService } from '../../../shared/services/translate/mytranslate.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass,TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLogin: WritableSignal<boolean>=signal(false);
  isMobileMenuOpen: WritableSignal<boolean>=signal(false);
  isUserMenuOpen: WritableSignal<boolean>=signal(false);
  userName:WritableSignal<string>=signal('');
  userStatus:WritableSignal<string>=signal('');
  userEmail: WritableSignal<string>=signal('');
  productCount:Signal<number>=computed(()=> this._CartService.cartNumber());


 readonly _TranslateService =inject(TranslateService)

  constructor(
    public _AuthService: AuthService,
    private _FlowbiteService: FlowbiteService,
    private _CartService: CartService,
    private  _MytranslateService:MytranslateService

  ) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.userName.set(localStorage.getItem('userName')!) ;
      this.userStatus.set(localStorage.getItem('userStatus')!)  ;
      this.userEmail.set(localStorage.getItem('userEmail')!) ;
    }

    this._FlowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      // console.log('Flowbite loaded', flowbite);
    });

    this._AuthService.userData.subscribe(() => {
      if (this._AuthService.userData.getValue() != null) {
        this.isLogin.set(true);
      } else {
        this.isLogin.set(false) ;
      }
    });

    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('userToken')) {
        this._CartService.getLoggedUserCart().subscribe({
          next: (res) => {
            this._CartService.cartNumber.set(res.numOfCartItems);
          },
        });
      }
    }

    
  }
  chang(lan: string): void {
    this._MytranslateService.changeLan(lan);
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen)
  }

  toggleUserMenu() {
    this.isUserMenuOpen.set(!this.isUserMenuOpen) 
  }
}

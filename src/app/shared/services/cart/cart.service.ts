import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Environment } from '../../../base/Enviroment';
import { SuccessAddProduct } from '../../interfaces/success-add-product';
import { FailAddProduct } from '../../interfaces/fail-add-product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartNumber: WritableSignal<number>=signal(0);

  constructor(private _HttpClient: HttpClient,@Inject(PLATFORM_ID) private platformId:object) {}
  
  addProductToCart(
    productId: string
  ): Observable<SuccessAddProduct | FailAddProduct> {
    return this._HttpClient.post<SuccessAddProduct | FailAddProduct>(
      `${Environment.baseUrl}/api/v1/cart`,
      { productId: productId }
    );
  }

  getLoggedUserCart(): Observable<any> {
    return this._HttpClient.get<any>(
      `${Environment.baseUrl}/api/v1/cart`
    );
  }

  updateProductCartCount(
    productId: string,
    count: string
  ): Observable<any> {
    return this._HttpClient.put<any>(
      `${Environment.baseUrl}/api/v1/cart/${productId}`,
      { count: count }
    );
  }

  removeProductFromCart(productId: string): Observable<any> {
    return this._HttpClient.delete<any>(
      `${Environment.baseUrl}/api/v1/cart/${productId}`
    );
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete<any>(
      `${Environment.baseUrl}/api/v1/cart/`
    );
  }
}

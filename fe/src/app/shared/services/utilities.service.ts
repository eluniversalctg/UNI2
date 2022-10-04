import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class UtilitiesService {
  private tempStorage: any;
  private secretKey: string = 'uni2';
  private localStorageItem = environment.localStorageItem;

  constructor(private router: Router) {}

  getBasePath() {
    return environment.basePath;
  }

  /**
   * description: set token of local storage
   *  * @param user - the logged user
   */
  setToken(user: any) {
    this.tempStorage = undefined;
    localStorage.removeItem(this.localStorageItem);

    let toString = user;

    let encrypted: any = CryptoJS.AES.encrypt(
      JSON.stringify(toString),
      this.secretKey
    );

    localStorage.setItem(this.localStorageItem, encrypted);
  }

  /**
   * description: get token of local storage
   * @returns token user
   */
  getToken(): string {
    const toObj = this.decryptLocalStorage();
    return toObj !== undefined && toObj !== null ? toObj.access_token : '';
  }

  /**
   * description: get the logged in user
   * @returns The current user
   */
  getCurrentUser(): any {
    const toObj = this.decryptLocalStorage();

    if (this.tempStorage) {
      return this.tempStorage;
    }

    // decrypt jwt.
    var base64Url = toObj.access_token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    // save jwt decrypted on cache.
    this.tempStorage = JSON.parse(jsonPayload);

    return JSON.parse(jsonPayload);
  }

  /**
   * description: decrypt the local storage
   *  @returns The current user decrypt
   */
  private decryptLocalStorage() {
    let user = localStorage.getItem(this.localStorageItem);

    if (user !== null && user !== undefined) {
      let decrypted = CryptoJS.AES.decrypt(user, this.secretKey).toString(
        CryptoJS.enc.Utf8
      );

      let toObj = JSON.parse(decrypted);
      return toObj;
    }

    return undefined;
  }

  /**
   * description: delete user from local storage, redirect to login
   */
  logOut() {
    localStorage.removeItem(this.localStorageItem);
    this.router.navigateByUrl('auth/login');
  }

  /**
   * description: validate if user is autheticate
   * @returns Boolean: true in case affirmative
   */
  isAuthenticated() {
    let token = this.getToken();
    if (token === null || token === '') return false;
    else return true;
  }

  /**
   * description: get the pattern used in the password
   * @returns Regular expression: pattern
   */
  get patterOfPassword() {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  }
}

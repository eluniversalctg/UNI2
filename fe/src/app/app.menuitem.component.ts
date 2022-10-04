import {
  Input,
  OnInit,
  OnDestroy,
  Component,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import {
  state,
  style,
  trigger,
  animate,
  transition,
} from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuService } from './core/services';
import { AppComponent } from './app.component';
import { UtilitiesService } from './shared/services';
import { Router, NavigationEnd } from '@angular/router';
import { AppMainComponent } from './app.main.component';

@Component({
  /* lint:disable:component-selector */
  selector: '[app-menuitem]',
  /* lint:enable:component-selector */
  template: `
    <ng-container *ngIf="showMenu(item)">
      <div *ngIf="root" class="layout-menuitem-root-text">{{ item.label }}</div>
      <a
        [attr.href]="item.url"
        (click)="itemClick($event)"
        *ngIf="!item.routerLink || item.children"
        (mouseenter)="onMouseEnter()"
        (keydown.enter)="itemClick($event)"
        [attr.target]="item.target"
        [attr.tabindex]="0"
        [ngClass]="item.class"
        [pTooltip]="item.label"
        [tooltipDisabled]="
          active || !(root && appMain.isSlim() && !appMain.isMobile())
        "
        tooltipStyleClass="layout-tooltip"
        pRipple
      >
        <i [ngClass]="item.icon" style="{{ item.style }}" class="layout-menuitem-icon"></i>
        <span class="layout-menuitem-text">{{ item.label }}</span>
        <i
          class="pi pi-fw pi-angle-down layout-submenu-toggler"
          *ngIf="item.children"
        ></i>
      </a>
      <a
        (click)="itemClick($event)"
        (mouseenter)="onMouseEnter()"
        *ngIf="item.routerLink && !item.children"
        [routerLink]="item.routerLink"
        routerLinkActive="active-menuitem-routerlink"
        [routerLinkActiveOptions]="{ exact: true }"
        [attr.target]="item.target"
        [attr.tabindex]="0"
        [ngClass]="item.class"
        [pTooltip]="item.label"
        [tooltipDisabled]="
          active || !(root && appMain.isSlim() && !appMain.isMobile())
        "
        tooltipStyleClass="layout-tooltip"
        pRipple
      >
        <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
        <span class="layout-menuitem-text">{{ item.label }}</span>
        <i
          class="pi pi-fw pi-angle-down layout-submenu-toggler"
          *ngIf="item.children"
        ></i>
      </a>
      <ul
        *ngIf="item.children"
        role="menu"
        [@children]="
          root ? 'visible' : active ? 'visibleAnimated' : 'hiddenAnimated'
        "
      >
        <ng-template ngFor let-child let-i="index" [ngForOf]="item.children">
          <li
            app-menuitem
            [item]="child"
            [index]="i"
            [parentKey]="key"
            [class]="child.badgeClass"
          ></li>
        </ng-template>
      </ul>
    </ng-container>
  `,
  host: {
    '[class.layout-root-menuitem]': 'root',
    '[class.active-menuitem]':
      '(active && !root) || (active && appMain.isSlim())',
  },
  animations: [
    trigger('children', [
      state(
        'void',
        style({
          height: '0px',
        })
      ),
      state(
        'hiddenAnimated',
        style({
          height: '0px',
        })
      ),
      state(
        'visibleAnimated',
        style({
          height: '*',
        })
      ),
      transition(
        'visibleAnimated => hiddenAnimated',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
      ),
      transition(
        'hiddenAnimated => visibleAnimated',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
      ),
      transition(
        'void => visibleAnimated, visibleAnimated => void',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
      ),
    ]),
  ],
})
export class AppMenuitemComponent implements OnInit, OnDestroy {
  @Input() item: any;

  @Input() index: number;

  @Input() root: boolean;

  @Input() parentKey: string;

  active = false;

  menuSourceSubscription: Subscription;

  menuResetSubscription: Subscription;

  key: string;

  constructor(
    public router: Router,
    public app: AppComponent,
    private cd: ChangeDetectorRef,
    private menuService: MenuService,
    public appMain: AppMainComponent,
    private utilitiesService: UtilitiesService
  ) {
    this.menuSourceSubscription = this.menuService.menuSource$.subscribe(
      (key) => {
        // deactivate current active menu
        if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
          this.active = false;
        }
      }
    );

    this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
      this.active = false;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((params) => {
        if (this.appMain.isSlim()) {
          this.active = false;
        } else {
          if (this.item.routerLink) {
            this.updateActiveStateFromRoute();
          } else {
            this.active = false;
          }
        }
      });
  }

  ngOnInit() {
    if (!this.appMain.isSlim() && this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }

    this.key = this.parentKey
      ? this.parentKey + '-' + this.index
      : String(this.index);
  }

  showMenu(item) {
    let show = false;
    //get user roles
    let userRole = this.utilitiesService.getCurrentUser();
    if (userRole) {
      // validate if role is active to show on sidebar menu
      if (userRole.roles.isActive) {
        let exists = userRole.roles.pages.find((x) => x.key === item.key);
        // if march return the access
        if (exists) {
          show = exists.hasAccess;
        }
      }
    }
    return show;
  }

  updateActiveStateFromRoute() {
    this.active = this.router.isActive(
      this.item.routerLink[0],
      this.item.children ? false : true
    );
  }

  itemClick(event: Event) {
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    // navigate with hover in horizontal mode
    if (this.root) {
      this.appMain.menuHoverActive = !this.appMain.menuHoverActive;
    }

    // notify other items
    this.menuService.onMenuStateChange(this.key);

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // toggle active state
    if (this.item.children) {
      this.active = !this.active;
    } else {
      // activate item
      this.active = true;

      if (this.appMain.isMobile()) {
        this.appMain.staticMenuMobileActive = false;
      }

      // reset slim menu
      if (this.appMain.isSlim()) {
        this.menuService.reset();
        this.appMain.menuHoverActive = false;
      }
    }

    this.removeActiveInk(event);
  }

  removeActiveInk(event: Event) {
    const currentTarget = event.currentTarget as HTMLElement;
    setTimeout(() => {
      if (currentTarget) {
        const activeInk = currentTarget.querySelector('.p-ink-active');
        if (activeInk) {
          if (activeInk.classList) {
            activeInk.classList.remove('p-ink-active');
          } else {
            activeInk.className = activeInk.className.replace(
              new RegExp(
                '(^|\\b)' + 'p-ink-active'.split(' ').join('|') + '(\\b|$)',
                'gi'
              ),
              ' '
            );
          }
        }
      }
    }, 401);
  }

  onMouseEnter() {
    // activate item on hover
    if (
      this.root &&
      this.appMain.menuHoverActive &&
      this.appMain.isSlim() &&
      !this.appMain.isMobile() &&
      !this.appMain.isTablet()
    ) {
      this.menuService.onMenuStateChange(this.key);
      this.active = true;
    }
  }

  get visible() {
    return this.item
      ? typeof this.item.visible === 'function'
        ? this.item.visible()
        : this.item.visible !== false
      : false;
  }

  ngOnDestroy() {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }

    if (this.menuResetSubscription) {
      this.menuResetSubscription.unsubscribe();
    }
  }
}

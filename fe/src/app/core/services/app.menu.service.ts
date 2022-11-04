import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class MenuService {
  private menuSource = new Subject<string>();
  private resetSource = new Subject();

  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  onMenuStateChange(key: string) {
    this.menuSource.next(key);
  }

  reset() {
    this.resetSource.next(true);
  }

  getMenu() {
    return [
      {
        key: '1',
        label: 'Usuarios',
        icon: 'c-iconsMenu menu1-icon',
        children: [
          {
            key: '1.0',
            label: 'solicitudes',
            icon: 'pi pi-users',
            routerLink: ['/main/register'],
          },
          {
            key: '1.1',
            label: 'Usuarios',
            icon: 'pi pi-users',
            routerLink: ['/main/register'],
          },
          {
            key: '1.2',
            label: 'Roles',
            icon: 'pi pi-user-edit',
            routerLink: ['/main/roles'],
          },
          {
            key: '1.3',
            label: 'Widgets',
            icon: 'c-icons widget-icon',
            routerLink: ['/main/widgets'],
          },
          {
            key: '1.4',
            label: 'Dashboard',
            icon: 'c-icons dashboard-icon',
            routerLink: ['/main/dashboard'],
          },
          {
            key: '1.5',
            label: 'Parametrización widgets',
            icon: 'c-icons parametrizacionWidgets-icon',
            routerLink: ['/main/paramsWidgets'],
          },
          {
            key: '1.6',
            label: 'Dominios',
            icon: 'c-icons dominios-icon',
            routerLink: ['/main/domains'],
          },
        ],
      },
      {
        key: '2',
        label: 'Personalización',
        icon: 'c-iconsMenu menu2-icon',
        children: [
          {
            key: '2.1',
            label: 'Variables',
            icon: 'c-icons variable-icon',
            routerLink: ['/main/profiles/variables'],
          },
          {
            key: '2.2',
            label: 'Reglas',
            icon: 'c-icons reglas-icon',
            routerLink: ['/main/profiles/rules'],
          },
          {
            key: '2.3',
            label: 'Personalización',
            icon: 'c-icons widget-icon',
            routerLink: ['/main/profiles/personalization'],
          },
          {
            key: '2.4',
            label: 'Condiciones',
            icon: 'c-icons condiciones-icon',
            routerLink: ['/main/profiles/conditions'],
          },
          {
            key: '2.5',
            label: 'Acciones',
            icon: 'c-icons acciones-icon',
            routerLink: ['/main/profiles/actions'],
          },
          {
            key: '2.6',
            label: 'Campos de usuario',
            icon: 'pi pi-user-edit',
            routerLink: ['/main/profiles/userFields'],
          },
          {
            key: '2.7',
            label: 'Perfiles unomi',
            icon: 'pi pi-user',
            routerLink: ['/main/profiles/unomiProfiles'],
          },
          {
            key: '2.8',
            label: 'Sesiones de usuario',
            icon: 'pi pi-user',
            routerLink: ['/main/profiles/profilesStatistics'],
          },
        ],
      },
      {
        key: '3',
        label: 'Pefiles',
        icon: 'c-iconsMenu menu3-icon',
        style: ' width: 3.1rem',
        children: [
          {
            key: '3.1',
            label: 'Segmentos',
            icon: 'c-icons menu3-icon segmento-icon',
            routerLink: ['/main/profiles/segments'],
          },
          {
            key: '3.2',
            label: 'Goals',
            icon: 'c-icons goals-icon',
            routerLink: ['/main/profiles/goals'],
          },
          {
            key: '3.3',
            label: 'Campañas',
            icon: 'c-icons campanas-icon',
            routerLink: ['/main/profiles/campaigns'],
          },
        ],
      },
      {
        key: '4',
        label: 'Matomo',
        icon: 'pi c-iconsMenu menu4-icon',
        style: ' width: 2.9rem; height: 1.6rem;',
        children: [
          {
            key: '4.1',
            label: 'Matomo tags',
            icon: 'pi pi-tags',
            routerLink: ['/main/matomo/tags'],
          },
        ],
      },
      {
        key: '5',
        label: 'Croma',
        icon: 'c-iconsMenu menu5-icon',
        style: ' width: 2.6rem; height: 3rem;',
        children: [
          {
            key: '5.1',
            label: 'Croma tags',
            icon: 'pi pi-tags',
            routerLink: ['/main/croma/cromatags'],
          },
        ],
      },
      {
        key: '6',
        label: 'Plantillas',
        icon: 'c-iconsMenu template-icon',
        children: [
          {
            key: '6.1',
            label: 'Creación plantillas',
            icon: 'c-icons creacion_plantillas-icon',
            routerLink: ['/main/templates'],
          },
          {
            key: '6.2',
            label: 'Creación de placeholders',
            icon: 'c-icons creacion_placeholders-icon',
            routerLink: ['/main/placeholders'],
          },
        ],
      },
      {
        key: '7',
        label: 'Plantillas de personalización',
        icon: 'c-iconsMenu menu7-icon',
        children: [
          {
            key: '7.1',
            label: 'Creación plantillas de personalización',
            icon: 'c-icons creacion_plantillas-icon',
            routerLink: ['/main/templatesPersonalization'],
          },
          {
            key: '7.2',
            label: 'Creación de placeholders de unomi',
            icon: 'c-icons creacion_placeholders-icon',
            routerLink: ['/main/placeholderUnomi'],
          },
          {
            key: '7.3',
            label: 'Creación de propiedades de unomi',
            icon: 'c-icons creacion_propiedades-icon',
            routerLink: ['/main/propertiesUnomi'],
          },
        ],
      },
      {
        key: '8',
        label: 'Administrar web',
        icon: 'pi pi-globe',
        children: [
          {
            key: '8.1',
            label: 'Páginas',
            icon: 'pi pi-link',
            routerLink: ['/main/pages'],
          },
          {
            key: '8.2',
            label: 'Bloques',
            icon: 'pi pi-box',
            routerLink: ['/main/blocks'],
          },
          {
            key: '8.3',
            label: 'Ponderación',
            icon: 'pi pi-sliders-v',
            routerLink: ['/main/weighing'],
          },
        ],
      },

    ];
  }
}

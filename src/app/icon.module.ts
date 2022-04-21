import { NgModule } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material/icon'

export interface Icon {
  name: string,
  path: string
}

@NgModule()
export class IconModule {

  private iconsPath = '../assets/icons'

  private icons: Icon[] = [
      {
      name: 'address-book',
      path: 'address-book.svg'
      },
      {
        name: 'sign-out',
        path: 'sign-out.svg'
      },
    {
      name: 'trash',
      path: 'trash.svg'
    },
    {
      name: 'pencil',
      path: 'pencil.svg'
    },
    {
      name: 'user-add',
      path: 'user-add.svg'
    },
    {
      name: 'cross',
      path: 'cross.svg'
    },
    {
      name: 'star',
      path: 'star.svg'
    },
    {
      name: 'form',
      path: 'form.svg'
    },
    {
      name: 'favorite',
      path: 'favorite.svg'
    },
    {
      name: 'search',
      path: 'search.svg'
    }
    ]

  constructor (
    private domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry) {
    this.registerIcons()
  }

  private registerIcons () {
    this.icons.forEach(i => {
      this.matIconRegistry.addSvgIcon(i.name, this.setPath(this.iconsPath + '/' + i.path))
    })
  }

  private setPath (url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url)
  }

}

// tslint:disable: directive-selector component-selector callable-types no-host-metadata-property no-inputs-metadata-property

import {
  InjectionToken,
  Input,
  Directive,
  ElementRef,
  NgZone,
  Renderer2,
  Inject,
  Optional,
  OnChanges,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { MatInkBar, MatTabNav, MatTabLink } from '@angular/material/tabs';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Directionality } from '@angular/cdk/bidi';
import { ViewportRuler } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';

export interface PttInkBarPositioner {
  (element: HTMLElement): {
    left?: string;
    width?: string;
    top?: string;
    height?: string;
  };
}

export const PTT_INK_BAR_POSITIONER = new InjectionToken<PttInkBarPositioner>(
  'PttInkBarPositioner',
  {
    providedIn: 'root',
    factory: PTT_INK_BAR_POSITIONER_FACTORY
  }
);

export function PTT_INK_BAR_POSITIONER_FACTORY() {
  const method = (element: HTMLElement) => ({
    width: element ? (element.offsetWidth || 0) + 'px' : '0',
    left: element ? (element.offsetLeft || 0) + 'px' : '0',
    height: element ? (element.offsetHeight || 0) + 'px' : '0',
    top: element ? (element.offsetTop || 0) + 'px' : '0'
  });

  return method;
}

export type PttInkBarPosition = 'left' | 'right' | 'bottom' | 'top';

@Directive({
  selector: 'ptt-ink-bar',
  host: {
    class: 'mat-ink-bar',
    '[class._mat-animation-noopable]': `_animationMode === 'NoopAnimations'`
  },
  providers: [
    {
      provide: MatInkBar,
      useExisting: PttInkBarDirective
    }
  ]
})
export class PttInkBarDirective implements OnChanges {
  @Input() position?: PttInkBarPosition = 'bottom';
  private elementToAlign: HTMLElement = null;
  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _ngZone: NgZone,
    private renderer2: Renderer2,
    @Inject(PTT_INK_BAR_POSITIONER)
    private _inkBarPositioner: PttInkBarPositioner,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) public _animationMode?: string
  ) { }

  ngOnChanges() {
    if (this.elementToAlign) {
      this._render(this.elementToAlign);
    }
  }
  /**
   * Calculates the styles from the provided element in order to align the ink-bar to that element.
   * Shows the ink bar if previously set as hidden.
   * @params element
   */
  alignToElement(element: HTMLElement) {
    this.elementToAlign = element;
    this.show();

    this._render(element);
  }

  /** Shows the ink bar. */
  show(): void {
    this._elementRef.nativeElement.style.visibility = 'visible';
  }

  /** Hides the ink bar. */
  hide(): void {
    this._elementRef.nativeElement.style.visibility = 'hidden';
  }

  private _render(element: HTMLElement) {
    if (typeof requestAnimationFrame !== 'undefined') {
      this._ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => this._setStyles(element));
      });
    } else {
      this._setStyles(element);
    }
  }

  /**
   * Sets the proper styles to the ink bar element.
   * @params element
   */
  private _setStyles(element: HTMLElement) {
    const position = this.position || 'bottom';
    const positions = this._inkBarPositioner(element);
    const inkBar: HTMLElement = this._elementRef.nativeElement;
    let style: any;
    // delte before set
    ['width', 'height', 'top', 'bottom', 'right', 'left'].forEach(key =>
      this.renderer2.removeStyle(inkBar, key)
    );
    switch (position) {
      case 'right':
      case 'left':
        style = {
          top: positions.top,
          height: positions.height
        };
        Object.entries(style).forEach(([key, value]) =>
          this.renderer2.setStyle(inkBar, key, value)
        );

        break;
      case 'bottom':
      case 'top':
        style = {
          width: positions.width,
          left: positions.left
        };
        Object.entries(style).forEach(([key, value]) =>
          this.renderer2.setStyle(inkBar, key, value)
        );
        break;
    }
  }
}

@Component({
  selector: '[ptt-tab-nav-bar]',
  exportAs: 'pttTabNavBar, pttTabNav',
  inputs: ['color'],
  templateUrl: './tab-nav-bar.component.html',
  styleUrls: ['./tab-nav-bar.component.scss'],
  host: {
    class: 'mat-tab-nav-bar mat-tab-header',
    '[class.mat-tab-header-pagination-controls-enabled]':
      '_showPaginationControls',
    '[class.mat-tab-header-rtl]': '_getLayoutDirection() == "rtl"',
    '[class.mat-primary]': 'color !== "warn" && color !== "accent"',
    '[class.mat-accent]': 'color === "accent"',
    '[class.mat-warn]': 'color === "warn"',
    '[class.ptt-tab-nav-bar-bottom]': 'inkBarPosition === "bottom"',
    '[class.ptt-tab-nav-bar-top]': 'inkBarPosition === "top"',
    '[class.ptt-tab-nav-bar-right]': 'inkBarPosition === "right"',
    '[class.ptt-tab-nav-bar-left]': 'inkBarPosition === "left"'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: MatTabNav,
      useExisting: forwardRef(() => PttTabNavComponent)
    }
  ]
})
export class PttTabNavComponent extends MatTabNav implements OnChanges {
  constructor(
    elementRef: ElementRef,
    @Optional() dir: Directionality,
    private ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    @Optional() platform?: Platform,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string
  ) {
    super(
      elementRef,
      dir,
      ngZone,
      changeDetectorRef,
      viewportRuler,
      platform,
      animationMode
    );
  }
  @Input() inkBarPosition: PttInkBarPosition = 'bottom';
  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      this.updatePagination();
      this._alignInkBarToSelectedTab();
      this._changeDetectorRef.markForCheck();
    });
  }
}


/**
 * Link inside of a `mat-tab-nav-bar`.
 */
// @Directive({
//   selector: '[ptt-tab-link], [pttTabLink]',
//   exportAs: 'pttTabLink',
//   inputs: ['disabled', 'disableRipple', 'tabIndex'],
//   host: {
//     class: 'mat-tab-link',
//     '[attr.aria-current]': 'active ? "page" : null',
//     '[attr.aria-disabled]': 'disabled',
//     '[attr.tabIndex]': 'tabIndex',
//     '[class.mat-tab-disabled]': 'disabled',
//     '[class.mat-tab-label-active]': 'active'
//   },
//   providers: [
//     {
//       provide: MatTabLink,
//       useExisting: PttTabLinkDirective
//     }
//   ]
// })
// export class PttTabLinkDirective extends MatTabLink {}


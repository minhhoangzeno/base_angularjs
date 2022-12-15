import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
  Output,
  Inject,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { fromEvent, Observable, Subscription, Subject } from 'rxjs';
import { filter, map, debounceTime, tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

/**
 * Send message from child iframe
 * const event = {
 *   name: 'update_location',
 *   detail: { location: { lat: 1, long: 2 } },
 * };
 * window.parent.postMessage(JSON.stringify(event), '*');
 *
 * Receive message
 * <cel-external-r-generated-content
 *  src="/assets/other/iframe.html"
 *  (msg)="onMessage($event)">
 * </cel-external-r-generated-content>
 *
 */

export class BaseIFrameComponent {
  constructor(private readonly doc: Document) {
    this.iframe.onload = () => {
      if (this.url) {
        const ellapsed = Date.now() - this.start;
        console.log(`loaded ${this.url} after ${ellapsed} ms`);
      }
      this._loading = false;
      this.currentForm = undefined;
    };
    this.iframe.onerror = (e) => {
      console.log(`load ${this.url} error`, e);
      this._loading = false;
    };
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.border = 'none';
    this.iframe.name = Math.random().toString(36).substr(3, 8);
    this.iframe.setAttribute('frameBorder', '0');
  }

  protected iframe = this.doc.createElement('iframe');
  protected currentForm?: HTMLFormElement;

  get url() {
    return this.currentForm?.action || '';
  }

  private start = Date.now();
  private _loading = false;
  // support ssr when window is not available
  // iframe communication will have no effect
  protected message$: Observable<any> = window
    ? fromEvent<MessageEvent>(window, 'message').pipe(
        filter((e) => e.source === this.iframe.contentWindow),
        map((e) => JSON.parse(e.data)),
      )
    : new Subject();

  get loading() {
    return this._loading;
  }

  submit(src: string, params = {}, method = 'GET') {
    if (this.currentForm) {
      console.log('cancel previous url', this.url);
      this.currentForm.target = '';
      this.currentForm.remove();
    }
    console.log(`loading ${src}`);
    this._loading = true;
    this.start = Date.now();
    const form = this.doc.createElement('form');
    this.currentForm = form;
    form.style.display = 'none';
    for (const name in params) {
      const input = this.doc.createElement('input');
      input.name = name;
      input.value = params[name];
      form.appendChild(input);
    }

    this.doc.body.appendChild(form);
    form.target = this.iframe.name;
    form.action = src;
    form.method = method;
    form.submit();
  }

  protected destroy() {
    if (this.currentForm) {
      this.currentForm.remove();
    }
    this.iframe.remove();
  }

  send(data: Record<string, unknown>) {
    this.iframe.contentWindow?.postMessage(JSON.stringify(data), '*');
  }
}

@Component({
  selector: 'cel-external-r-generated-content',
  template: `
    <div
      style="width:100%;height:100%"
      #main
      [nbSpinner]="loading"
      nbSpinnerStatus="primary"
      nbSpinnerSize="giant"
    ></div>
  `,
})
export class ExternalRGeneratedContentComponent
  extends BaseIFrameComponent
  implements OnInit, OnChanges, OnDestroy
{
  constructor(@Inject(DOCUMENT) doc: Document) {
    super(doc);
  }

  @Output() msg = this.message$;

  refreshObs = new Subject<void>();

  @Input() src = '';

  @Input() params = {};

  @Input() method = 'GET';

  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.refreshObs
      .pipe(
        debounceTime(200),
        filter(() => !!this.src && !!this.method),
        tap(() => this.submit(this.src, this.params, this.method)),
      )
      .subscribe();
    this.refreshObs.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['src'] || changes['params']) {
      this.refreshObs.next();
    }
  }

  ngOnDestroy() {
    super.destroy();
    this.subscription?.unsubscribe();
  }

  @ViewChild('main', { read: ElementRef })
  set main(ref: ElementRef) {
    const el = ref.nativeElement as HTMLElement;
    el.appendChild(this.iframe);
  }
}

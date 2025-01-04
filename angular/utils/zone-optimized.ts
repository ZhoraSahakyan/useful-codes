export function zoneFree<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
    return source =>
      new Observable(subscriber =>
        zone.runOutsideAngular(() => source.subscribe(subscriber))
      );
  }
  
  export function zoneFull<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
    return source =>
      new Observable(subscriber =>
        source.subscribe({
          next: value => zone.run(() => subscriber.next(value)),
          error: error => zone.run(() => subscriber.error(error)),
          complete: () => zone.run(() => subscriber.complete())
        })
      );
  }
  
  export function zoneOptimized<T>(ngZone: NgZone): MonoTypeOperatorFunction<T> {
    return pipe(
        zoneFree(ngZone),
        zoneFull(ngZone)
    );
  }

//   usage example

// export class AppComponent {
//     readonly seconds$ = timer(0, 1000).pipe(
//       tap(i => console.log(i, ' is in Angular zone: ', NgZone.isInAngularZone())),
//       filter(i => !(i % 2)),
//       zoneOptimized(this.zone),
//       tap(i =>
//         console.log(i, ' has returned to the zone: ', NgZone.isInAngularZone())
//       )
//     );
  
//     constructor(private readonly zone: NgZone) {}
//   }
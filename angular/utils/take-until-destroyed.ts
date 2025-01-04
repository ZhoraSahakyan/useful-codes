export function takeUntilDestroyed<T>(destroyRef?: DestroyRef):  MonoTypeOperatorFunction<T> {
    if (!destroyRef) {
      assertInInjectionContext(takeUntilDestroyed);
      destroyRef = inject(DestroyRef);
    }
  
    const destroyed$ = new Observable<void>((observer) => {
      const unregisterFn = destroyRef!.onDestroy(observer.next.bind(observer));
      return unregisterFn;
    });
  
    return <T>(source: Observable<T>) => {
      return source.pipe(takeUntil(destroyed$));
    };
  }
  
  // Usage example
  
//   @Component(/*...*/)
//   class MyComponent {
//     source$ = new Subject();
  
//     constructor() {
//       this.source$
//          .pipe(takeUntilDestroyed())
//          .subscribe(() => console.log('hello world'));
//     }
//   }
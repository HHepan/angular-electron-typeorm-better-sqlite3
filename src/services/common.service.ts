import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  /** 当前路由是否能后退观察者 */
  private canBack$ = new BehaviorSubject<boolean>(false);
  /** 所有路由信息 */
  public routeStates: Array<{ url: string, state: { [k: string]: any } | undefined }> = [];
  /** 当前是否处于后退状态 */
  private isBack = false;
  /** 当前路由 */
  private currentUrl: string | undefined;

  constructor(private router: Router) {
    /** 订阅路由事件 */
    this.router.events
      /** 过滤：路由结束事件 */
      .pipe(filter((event) => {
        return event instanceof NavigationEnd;
      }))
      /** 订阅路由结束后执行的方法 */
      .subscribe((route) => {
        const routeState = route as unknown as NavigationEnd;
        this.currentUrl = routeState.urlAfterRedirects;

        if (this.isBack) {
          /** 如果处于后退状态，清空状态 */
          /** 获取完历史参数以后再清除后退状态 */
          this.isBack = false;
        } else if (!this.currentUrl.startsWith('/login')) {
          /** 如果不是认证模块，将当前路由添加到数组中 */
          if (this.routeStates.length >= 50) {
            this.routeStates.splice(0, 1);
          }
          this.routeStates.push({url: this.currentUrl, state: this.router.getCurrentNavigation()?.extras.state});
        }

        /** 更新是否能后退信息 */
        this.canBack$.next(this.routeStates.length >= 2);
      });
  }

  canBack(): Observable<boolean> {
    return this.canBack$;
  }

  /** 路由后退 */
  back(): void {
    /** 清空当前的路由信息 */
    this.clearCurrentRoute();
    if (this.routeStates.length > 0) {
      /** 获取待后退的url */
      const state = this.routeStates[this.routeStates.length - 1];
      /** 设置后退状态 */
      this.isBack = true;
      /** 路由跳转 */
      this.router.navigateByUrl(state.url, {state: state.state});
    }
  }

  /**
   * 清空当前路由信息
   */
  clearCurrentRoute(): void {
    this.routeStates.pop();
  }
}

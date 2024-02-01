import {ElementRef, Injectable} from '@angular/core';
import swal, {SweetAlertIcon, SweetAlertResult} from "sweetalert2";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  passwordChanged = new BehaviorSubject(false);
  passwordChanged$ = this.passwordChanged.asObservable();
  /*
     * 操作失败提示框
     * @param callback  回调
     * @param description  描述
     * @param title  标题
     */
  error(callback?: () => void, description: string = '', title: string = '操作失败'): void {
    swal.fire({
      titleText: title,
      text: description,
      icon: 'error',
      background: '#F7F8FA',
      allowOutsideClick: false,
      confirmButtonText: '确定',
      confirmButtonColor: '#007BFF',
      showCancelButton: false
    }).then((result: SweetAlertResult) => {
      if (result.value) {
        // 执行回调
        if (callback) {
          callback();
        }
      }
    });
  }
  /**
   * 操作成功提示框
   * @param callback    回调
   * @param description 描述
   * @param title       标题
   * @param options     选项
   */
  success(callback?: () => void, description = '', title = '操作成功', option = {confirmButtonText: '确定'}): void {
    swal.fire({
      titleText: title,
      text: description,
      icon: 'success',
      background: '#F7F8FA',
      allowOutsideClick: false,
      confirmButtonText: option.confirmButtonText,
      confirmButtonColor: '#007BFF',
      showCancelButton: false
    }).then((result: SweetAlertResult) => {
      if (result.value) {
        // 执行回调
        if (callback) {
          callback();
        }
      }
    });
  }

  /**
   * 是否确认提示框
   * @param callback    回调
   * @param description 描述
   * @param title       标题
   */
  confirm(callback?: (state?: boolean) => void,
          title: string = '',
          description: string = '该操作不可逆，请谨慎操作',
          confirmButtonText = '确定',
          cancelButtonText = '取消',
          options = {icon: 'question' as SweetAlertIcon}): void {
    swal.fire({
      titleText: title,
      text: description,
      icon: options.icon,
      background: '#F7F8FA',
      allowOutsideClick: false,
      confirmButtonText,
      confirmButtonColor: '#007BFF',
      showCancelButton: true,
      cancelButtonText,
      cancelButtonColor: '#6C757D'
    }).then((result: SweetAlertResult) => {
      if (callback) {
        callback(result.isConfirmed);
      }
    });
  }

  extractPositionLineAndPosition(inputString: string | undefined): string[] {
    const arr: string[] = [];
    if (inputString !== undefined) {
      // 找到 "米处" 的位置
      const meterIndex = inputString.indexOf("米处");

      if (meterIndex !== -1) {
        // 找到 "线路" 的位置
        const routeIndex = inputString.lastIndexOf("线路", meterIndex);

        // 从字符串开始到 "米处" 之间的部分存入 arr[0]
        arr[0] = inputString.substring(0, routeIndex).trim();

        if (routeIndex !== -1) {
          // 从 "线路" 到 "米处" 之间的部分存入 arr[1]
          arr[1] = inputString.substring(routeIndex + 2, meterIndex).trim();
        }
      }

      return arr;
    } else {
      return arr;
    }
  }

  clickButtonDom(elementRef: ElementRef<HTMLButtonElement> | undefined, isOpen: boolean): void {
    // DOM元素为undefined
    if (!elementRef) {
      return;
    }
    const buttonDom = elementRef.nativeElement;
    // 获取当前展开状态与目标状态是否一致，如果不一致，点击DOM元素。
    const value = buttonDom.getAttribute('aria-expanded');
    if (value !== null && value !== String(isOpen)) {
      buttonDom.click();
    }
  }
}

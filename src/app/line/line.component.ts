import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {Line} from "../../../app/entity/line";
import {LineService} from "../../services/line.service";
import {CommonService} from "../../services/common.service";
import {FormControl, Validators} from "@angular/forms";
import {ScoreService} from "../../services/score.service";
import {Assert, isNotNullOrUndefined} from "@yunzhi/utils";
import {SystemService} from "../../services/system.service";
import {Router} from "@angular/router";
import {ElectronService} from "../../services/electron.service";
import {PasswordValidator} from "../../../app/utils/PasswordValidator";
import {APP_CONFIG} from "../../environments/environment";

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {
  modelType = '';
  Lines = [] as Line[];
  searchName = new FormControl('');
  lineIdForEdit: number | undefined;
  isDangerRecord = {} as Record<number, boolean>;
  isShowWarningSettingModal = false;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  warningValue = new FormControl('', Validators.required);
  isShowPasswordSettingModal = false;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  password = new FormControl('', Validators.required);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  confirmPassword = new FormControl('', Validators.required);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  originPassword = new FormControl('', Validators.required);
  systemPassword = '';
  mouseoverLine: number | undefined;
  selectedLine: Line | undefined;
  lineKeyForDoubleClick: Line | undefined;
  currentLine: Line | undefined;
  keyLineClick = 0;
  keyBodyClick = 0;
  constructor(private lineService: LineService,
              private scoreService: ScoreService,
              private systemService: SystemService,
              private commonService: CommonService,
              private route: Router,
              private renderer: Renderer2,
              private el: ElementRef,
              private electronService: ElectronService) {}

  ngOnInit(): void {
    const searchName = this.searchName.value;
    this.initWarningValue();
    this.initSystemPassword();
    this.lineService.getLines(searchName).subscribe((lines) => {
      this.Lines = lines;
      this.Lines.forEach(line => {
        this.updateIsDanger(line);
      })
    });
    this.electronService.ipcRenderer.on('newLine', () => {
      this.openAddModel();
    });
    this.electronService.ipcRenderer.on('setAlarmValue', () => {
      const button = this.el.nativeElement.querySelector('.buttonForAlarmValue');
      this.renderer.selectRootElement(button).click();
    });
    this.electronService.ipcRenderer.on('updatePassword', () => {
      const button = this.el.nativeElement.querySelector('.buttonForUpdatePassword');
      this.renderer.selectRootElement(button).click();
    });
  }

  openAddModel(): void {
    this.modelType = 'add';
    const button = this.el.nativeElement.querySelector('.buttonForAdd');
    this.renderer.selectRootElement(button).click();
  }

  onDelete(line: Line): void {
    this.commonService.confirm(confirm => {
      if (confirm) {
        this.lineService.deleteLine(line).subscribe(() => {
          this.commonService.success(() => {
            this.ngOnInit();
          });
        });
      }
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    }, '确认删除线路' + line.name + '?');
  }

  receiveLoginMessage(isSubmit: boolean): void {
    if (isSubmit) {
      this.modelType = '';
      this.ngOnInit();
    }
  }

  onSearch(searchName: FormControl<string | null>): void {
    this.ngOnInit();
  }

  onEdit(lineId: number | undefined): void {
    this.modelType = 'edit';
    const button = this.el.nativeElement.querySelector('.buttonForEdit');
    this.renderer.selectRootElement(button).click();
    this.lineIdForEdit = lineId;
  }

  onCloseModel() {
    this.modelType = '';
  }

  updateIsDanger(line: Line): void {
    Assert.isNotNullOrUndefined(line.id, 'value error');
    this.scoreService.getIsDangerOfLine(line.id!)
      .subscribe(isDanger => {
        this.isDangerRecord[line.id!] = isDanger;
      });
  }

  onWarningSettingModalClose(): void {
    this.isShowWarningSettingModal = false;
  }

  onWarningSettingModalOpen() {
    this.isShowWarningSettingModal = true;
  }

  onWarningValueSubmit() {
    this.systemService.setSystemItem('warningValue', this.warningValue.value!)
      .subscribe(() => {
        this.commonService.success(() => {
          this.isShowWarningSettingModal = false;
          this.ngOnInit();
        })
      });
  }

  private initWarningValue() {
    this.systemService.getSystemItem('warningValue')
      .subscribe(warningValue => {
        console.log('warningValue', warningValue);
        if (warningValue && warningValue.value) {
          this.warningValue.setValue(warningValue.value);
        }
      })
  }

  isShowDanger(line: Line): boolean {
    return this.isDangerRecord[line.id!];
  }

  onMouseEnter(line: Line) {
    this.mouseoverLine = line.id;
  }

  onMouseLeave() {
    this.mouseoverLine = -1;
  }

  cantSubmitPassword() {
    return this.originPassword.invalid || this.password.invalid ||
      this.confirmPassword.invalid ||
      this.password.value != this.confirmPassword.value ||
      !this.isOriginPasswordRight();
  }

  private initSystemPassword() {
    this.systemService.getSystemItem('password')
      .subscribe(passwordItem => {
        if (passwordItem && passwordItem.value) {
          this.systemPassword = passwordItem.value;
        }
      })
  }

  isOriginPasswordRight() {
    return PasswordValidator.validatePassword(this.originPassword.value!, this.systemPassword);
  }

  onPasswordSubmit() {
    if (isNotNullOrUndefined(this.password.value) && this.password.value !== '') {
      this.systemService.setSystemItem('password', PasswordValidator.createHash(this.password.value))
        .subscribe(() => {
          this.commonService.success(() => {
            this.isShowPasswordSettingModal = false;
            window.sessionStorage.removeItem('isLogin');
            this.commonService.passwordChanged.next(true);
          })
        });
    } else {
      this.commonService.error(() => {}, '密码不能为空')
    }
  }

  onLineClick(line: Line) {
    this.keyLineClick++;
    // console.log('onLineClick clickSameLineCount', this.clickSameLineCount);
    if (this.lineKeyForDoubleClick === line) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      void this.route.navigate(['view/' + line.id]);
    }
    if (this.selectedLine === undefined || this.selectedLine !== line) {
      this.selectedLine = line;
    } else {
      this.selectedLine = undefined;
    }
    this.lineKeyForDoubleClick = line;
    setTimeout(() => {
      this.lineKeyForDoubleClick = undefined;
    }, 750);
  }

  showMenu = false;

  showContextMenu(event: MouseEvent, line: Line) {
    event.preventDefault();
    this.showMenu = true;
    this.currentLine = line;
    this.setPosition(event.clientX, event.clientY);
  }

  setPosition(x: number, y: number) {
    const menu = document.querySelector('.context-menu') as HTMLElement;
    menu.style.left = x.toString() + 'px';
    menu.style.top = y.toString() + 'px';
  }

  handleMenuItemClick(item: string, currentLine: Line | undefined) {
    // 处理菜单项点击事件，例如执行相关操作
    if (item === 'delete') {
      if (currentLine !== undefined) {
        this.onDelete(currentLine);
      }
    } else if (item === 'edit') {
      if (currentLine !== undefined) {
        this.onEdit(currentLine.id);
      }
    } else if (item === 'view') {
      if (currentLine !== undefined) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        void this.route.navigate(['view/' + currentLine.id])
      }
    }
    this.showMenu = false;
  }

  onBodyClick() {
    this.showMenu = false;
    this.keyBodyClick++;
    if (this.keyBodyClick !== this.keyLineClick) {
      this.selectedLine = undefined;
      this.keyBodyClick = 0;
      this.keyLineClick = 0;
    }
  }

  protected readonly APP_CONFIG = APP_CONFIG;
}

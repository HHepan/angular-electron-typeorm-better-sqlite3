import {EventsCenter} from "../events.center";
import {IpcMainInvokeEvent, ipcRenderer} from "electron";
import {AppDataSource} from "../data-source";
import {System} from "../entity/system";
import {MAIN_CONFIG} from "../environment.main";
import {PasswordValidator} from "../utils/PasswordValidator";

export class SystemRepository {
  _baseUrl = 'system';
  constructor(private eventsCenter: EventsCenter) {
    this.loadEvents()
    this.initSystem();
  }

  addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
  }

  loadEvents(): void {
    const systemRepo = AppDataSource.getRepository(System);
    this.addEvent('getSystemItem', async (event, key: string) => {
      return systemRepo.findOne({where: {key}})
    });
    this.addEvent('setSystemItem', async (event, key: string, value: string) => {
      const systemItem = await systemRepo.findOne({where: {key}});
      if (systemItem) {
        systemItem.value = value;
        systemRepo.save(systemItem);
      }
    });

  }

  private async initSystem() {
    const systemRepo = AppDataSource.getRepository(System);
    // 设置系统初始密码
    const password = await systemRepo.findOne({where: {key: 'password'}});
    if (password == null) {
      const systemItem = new System();
      systemItem.key = 'password';
      systemItem.value = PasswordValidator.createHash(MAIN_CONFIG.password);
      systemItem.description = '系统密码';
      systemRepo.save(systemItem);
    }

    // 设置报警值为80分
    const warningValue = await systemRepo.findOne({where: {key: 'warningValue'}});
    if (warningValue == null) {
      const systemItem = new System();
      systemItem.key = 'warningValue';
      systemItem.value = '80';
      systemItem.description = '报警值';
      systemRepo.save(systemItem);
    }
  }
}

import {EventsCenter} from "../events.center";
import {IpcMainInvokeEvent} from "electron";
import {AppDataSource} from "../data-source";
import {Item} from "../entity/item";
export class ItemRepository {
  _baseUrl = 'item';

  constructor(private eventsCenter: EventsCenter) {
    this.loadEvents()
  }

  addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
  }

  loadEvents(): void {
    const itemRepo = AppDataSource.getRepository(Item);
    this.addEvent('add', async (event: any, _item: Item) => {
      await itemRepo.save(_item);
      return itemRepo.find();
    });
  }
}

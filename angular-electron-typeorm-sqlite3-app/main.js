"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var electron_1 = require("electron");
require("reflect-metadata");
var path = require("path");
var url = require("url");
var typeorm_1 = require("typeorm");
var item_entity_1 = require("./src/assets/entities/item.entity");
var win = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--dev'; });
function createWindow() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, itemRepo, size;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, typeorm_1.createConnection)({
                        type: 'sqlite',
                        synchronize: true,
                        logging: true,
                        logger: 'simple-console',
                        database: './src/assets/data/database.sqlite',
                        entities: [item_entity_1.Item]
                    })];
                case 1:
                    connection = _a.sent();
                    itemRepo = connection.getRepository(item_entity_1.Item);
                    size = electron_1.screen.getPrimaryDisplay().workAreaSize;
                    // Create the browser window.
                    win = new electron_1.BrowserWindow({
                        x: 0,
                        y: 0,
                        width: size.width,
                        height: size.height,
                        webPreferences: {
                            nodeIntegration: true,
                            allowRunningInsecureContent: (serve),
                            contextIsolation: false
                        }
                    });
                    if (serve) {
                        console.log('加载localhost:4200');
                        win.loadURL('http://localhost:4200');
                    }
                    else {
                        console.log('加载dist/');
                        win.loadURL(url.format({
                            pathname: path.join(__dirname, 'dist/angular-electron-app/index.html'),
                            protocol: 'file:',
                            slashes: true
                        }));
                    }
                    // 打开开发者工具
                    win.webContents.openDevTools();
                    // 当 window 被关闭，这个事件会被触发。
                    win.on('closed', function () {
                        // 取消引用 window 对象，如果你的应用支持多窗口的话，
                        // 通常会把多个 window 对象存放在一个数组里面，
                        // 与此同时，你应该删除相应的元素。
                        win = null;
                    });
                    electron_1.ipcMain.on('get-items', function (event) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args[_i - 1] = arguments[_i];
                        }
                        return __awaiter(_this, void 0, void 0, function () {
                            var _a, err_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        _a = event;
                                        return [4 /*yield*/, itemRepo.find()];
                                    case 1:
                                        _a.returnValue = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_1 = _b.sent();
                                        throw err_1;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        });
                    });
                    electron_1.ipcMain.on('add-item', function (event, _item) { return __awaiter(_this, void 0, void 0, function () {
                        var item, _a, err_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, itemRepo.create(_item)];
                                case 1:
                                    item = _b.sent();
                                    return [4 /*yield*/, itemRepo.save(item)];
                                case 2:
                                    _b.sent();
                                    _a = event;
                                    return [4 /*yield*/, itemRepo.find()];
                                case 3:
                                    _a.returnValue = _b.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_2 = _b.sent();
                                    throw err_2;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    electron_1.ipcMain.on('delete-item', function (event, _item) { return __awaiter(_this, void 0, void 0, function () {
                        var item, _a, err_3;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, itemRepo.create(_item)];
                                case 1:
                                    item = _b.sent();
                                    return [4 /*yield*/, itemRepo.remove(item)];
                                case 2:
                                    _b.sent();
                                    _a = event;
                                    return [4 /*yield*/, itemRepo.find()];
                                case 3:
                                    _a.returnValue = _b.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_3 = _b.sent();
                                    throw err_3;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/, win];
            }
        });
    });
}
try {
    //在ready事件里
    electron_1.app.on('ready', function () {
        setTimeout(createWindow, 400);
        electron_1.globalShortcut.register('CommandOrControl+Shift+i', function () {
            if (win !== null) {
                if (win.webContents.isDevToolsOpened()) {
                    win.webContents.closeDevTools();
                }
                else {
                    win.webContents.openDevTools();
                }
            }
        });
    });
    // 当全部窗口关闭时退出。
    electron_1.app.on('window-all-closed', function () {
        // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
        // 否则绝大部分应用及其菜单栏会保持激活。
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // 在macOS上，当单击dock图标并且没有其他窗口打开时，
        // 通常在应用程序中重新创建一个窗口。
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}

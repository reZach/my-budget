// @flow
import { app, Menu, shell, BrowserWindow } from 'electron';
import i18n from "./utils/i18n/i18n.config";

const appVersion = app.getVersion();


export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }
    
    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    };
    const subMenuEdit = {
      label: i18n.t("edit"),//'Edit',
      submenu: [
        { label: i18n.t("undo"),//'Undo', 
          accelerator: 'Command+Z', selector: 'undo:' },
        { label: i18n.t("redo"),//'Redo', 
          accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: i18n.t("cut"),//'Cut', 
          accelerator: 'Command+X', selector: 'cut:' },
        { label: i18n.t("copy"),//'Copy', 
          accelerator: 'Command+C', selector: 'copy:' },
        { label: i18n.t("paste"),//'Paste', 
          accelerator: 'Command+V', selector: 'paste:' },
        {
          label: i18n.t("selectAll"),//'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    };
    const subMenuViewDev = {
      label: i18n.t("view"),//'View',
      submenu: [
        {
          label: i18n.t("reload"),//'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          }
        },
        {
          label: i18n.t("toggleFullScreen"),//'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        },
        {
          label: i18n.t("toggleDeveloperTools"),//'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.toggleDevTools();
          }
        }
      ]
    };
    const subMenuViewProd = {
      label: i18n.t("view"),//'View',
      submenu: [
        {
          label: i18n.t('Toggle Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        }
      ]
    };
    const subMenuWindow = {
      label: i18n.t("window"),//'Window',
      submenu: [
        {
          label: i18n.t("minimize"),//'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        { label: i18n.t("close"),//'Close', 
          accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: i18n.t("bringAllToFront"),//'Bring All to Front', 
          selector: 'arrangeInFront:' }
      ]
    };
    const subMenuHelp = {
      label: i18n.t("help"),//'Help',
      submenu: [
        {
          label: i18n.t("newUsersGuide"),//'New user\'s guide',
          click() {
            shell.openExternal('https://github.com/reZach/my-budget/wiki/New-user\'s-guide');
          }
        },
        {
          label: i18n.t("learnMore"),//'Learn More',
          click() {
            shell.openExternal('https://github.com/reZach/my-budget/blob/master/README.md');
          }
        },
        {
          label: i18n.t("documentation"),//'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/reZach/my-budget/wiki'
            );
          }
        },
        {
          label: i18n.t("communityDiscussions"),//'Community Discussions',
          click() {
            shell.openExternal('https://my-budget.slack.com');
          }
        },
        {
          label: i18n.t("searchIssues"),//'Search Issues',
          click() {
            shell.openExternal('https://github.com/reZach/my-budget/issues');
          }
        }
      ]
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp, 
      {
        label: `v${appVersion}`,
        submenu: [
          {
            label: i18n.t("changelog"),//'Changelog',
            click() {
              shell.openExternal('https://github.com/reZach/my-budget/releases');
            }
          }
        ]
      }
    ];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: i18n.t("file"),//'&File',
        submenu: [
          {
            label: i18n.t("open"),//'&Open',
            accelerator: 'Ctrl+O'
          },
          {
            label: i18n.t("close"),//'&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            }
          }
        ]
      },
      {
        label: i18n.t('&View'),
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
                {
                  label: i18n.t("reload"),//'&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  }
                },
                {
                  label: i18n.t("toggleFullScreen"),//'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                },
                {
                  label: i18n.t("toggleDeveloperTools"),//'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.toggleDevTools();
                  }
                }
              ]
            : [
                {
                  label: i18n.t("toggleFullScreen"),//'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                }
              ]
      },
      {
        label: i18n.t("help"),//'Help',
        submenu: [
          {
            label: i18n.t("newUsersGuide"),//'New user\'s guide',
            click() {
              shell.openExternal('https://github.com/reZach/my-budget/wiki/New-user\'s-guide');
            }
          },
          {
            label: i18n.t("learnMore"),//'Learn More',
            click() {
              shell.openExternal('https://github.com/reZach/my-budget/blob/master/README.md');
            }
          },
          {
            label: i18n.t("documentation"),//'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/reZach/my-budget/wiki'
              );
            }
          },
          {
            label: i18n.t("communityDiscussions"),//'Community Discussions',
            click() {
              shell.openExternal('https://my-budget.slack.com');
            }
          },
          {
            label: i18n.t("searchIssues"),//'Search Issues',
            click() {
              shell.openExternal('https://github.com/reZach/my-budget/issues');
            }
          }
        ]
      },
      {
        label: `v${appVersion}`,
        submenu: [
          {
            label: i18n.t("changelog"),//'Changelog',
            click() {
              shell.openExternal('https://github.com/reZach/my-budget/releases');
            }
          }
        ]
      }
    ];

    return templateDefault;
  }
}
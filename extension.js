import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import {
    Extension,
    InjectionManager,
    gettext as _,
} from 'resource:///org/gnome/shell/extensions/extension.js';

import * as AltTab from 'resource:///org/gnome/shell/ui/altTab.js';
import * as SwitcherPopup from 'resource:///org/gnome/shell/ui/switcherPopup.js';

const DESKTOP_ICON_SIZE = 64;

const DesktopItem = GObject.registerClass(
class DesktopItem extends St.BoxLayout {
    _init(labelText) {
        super._init({
            orientation: Clutter.Orientation.VERTICAL,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            style: 'padding: 12px;',
        });

        this.window = null;

        const icon = new St.Icon({
            icon_name: 'user-desktop-symbolic',
            icon_size: DESKTOP_ICON_SIZE,
            x_align: Clutter.ActorAlign.CENTER,
        });

        this.label = new St.Label({
            text: labelText,
            x_align: Clutter.ActorAlign.CENTER,
        });

        this.add_child(icon);
        this.add_child(this.label);
    }
});

function addDesktopItem(switcherList) {
    const desktopItem = new DesktopItem(_('Desktop'));

    switcherList.addItem(desktopItem, desktopItem.label);
    switcherList.icons.push(desktopItem);

    return switcherList.icons;
}

function minimizeActiveWorkspace() {
    const workspace = global.workspace_manager.get_active_workspace();

    for (const window of workspace.list_windows()) {
        if (window.skip_taskbar || window.minimized)
            continue;

        window.minimize();
    }
}

export default class DesktopInSwitcherExtension extends Extension {
    enable() {
        const popupPrototype = AltTab.WindowSwitcherPopup.prototype;

        this._injectionManager = new InjectionManager();

        this._injectionManager.overrideMethod(
            popupPrototype,
            '_init',
            originalMethod => {
                return function (...args) {
                    originalMethod.call(this, ...args);

                    this._items = addDesktopItem(this._switcherList);
                };
            }
        );

        this._injectionManager.overrideMethod(
            popupPrototype,
            '_finish',
            originalMethod => {
                return function (timestamp) {
                    const item = this._items[this._selectedIndex];

                    if (item instanceof DesktopItem) {
                        minimizeActiveWorkspace();
                        SwitcherPopup.SwitcherPopup.prototype._finish.call(
                            this,
                            timestamp
                        );

                        return;
                    }

                    originalMethod.call(this, timestamp);
                };
            }
        );
    }

    disable() {
        this._injectionManager.clear();
        this._injectionManager = null;
    }
}

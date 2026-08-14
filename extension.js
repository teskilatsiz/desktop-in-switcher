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

const DesktopItem = GObject.registerClass(
class DesktopItem extends St.BoxLayout {
    _init(labelText) {
        super._init({
            orientation: Clutter.Orientation.VERTICAL,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            style: 'padding: 12px;',
        });

        this.isDesktopItem = true;
        this.window = null;

        const icon = new St.Icon({
            icon_name: 'user-desktop-symbolic',
            icon_size: 64,
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

export default class DesktopInSwitcherExtension extends Extension {
    enable() {
        this._injectionManager = new InjectionManager();

        this._injectionManager.overrideMethod(
            AltTab.WindowSwitcherPopup.prototype,
            '_init',
            originalMethod => {
                return function (...args) {
                    originalMethod.call(this, ...args);

                    const desktopItem = new DesktopItem(_('Desktop'));

                    this._switcherList.addItem(
                        desktopItem,
                        desktopItem.label
                    );

                    this._switcherList.icons.push(desktopItem);
                    this._items = this._switcherList.icons;
                };
            }
        );

        this._injectionManager.overrideMethod(
            AltTab.WindowSwitcherPopup.prototype,
            '_finish',
            originalMethod => {
                return function (timestamp) {
                    const item = this._items?.[this._selectedIndex];

                    if (item?.isDesktopItem) {
                        const workspace =
                            global.workspace_manager.get_active_workspace();

                        for (const window of workspace.list_windows()) {
                            if (!window.skip_taskbar && !window.minimized)
                                window.minimize();
                        }

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
        this._injectionManager?.clear();
        this._injectionManager = null;
    }
}

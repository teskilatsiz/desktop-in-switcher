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

        // Shell's switcher lists assume every icon has a window and an app.
        // This synthetic item has neither, so provide the harmless cleanup
        // and close methods those lists call for their real entries.
        this.window = {
            delete() {},
            disconnectObject() {},
        };
        this.app = {
            disconnectObject() {},
            request_quit() {},
        };
        this.cachedWindows = [];
        this.isDesktopItem = true;
        this.icon = null;

        this._desktopIcon = new St.Icon({
            icon_name: 'user-desktop-symbolic',
            icon_size: DESKTOP_ICON_SIZE,
            x_align: Clutter.ActorAlign.CENTER,
        });

        this.label = new St.Label({
            text: labelText,
            x_align: Clutter.ActorAlign.CENTER,
        });

        this.add_child(this._desktopIcon);
        this.add_child(this.label);
    }

    set_size(size) {
        this._desktopIcon.icon_size = size;
        this.icon = this._desktopIcon;
    }
});

function addDesktopItem(switcherList, appSwitcher = false) {
    const desktopItem = new DesktopItem(_('Desktop'));

    switcherList.addItem(desktopItem, desktopItem.label);
    switcherList.icons.push(desktopItem);

    if (appSwitcher) {
        const arrow = new St.DrawingArea({style_class: 'switcher-arrow'});
        arrow.connect('repaint', () =>
            SwitcherPopup.drawArrow(arrow, St.Side.BOTTOM));
        switcherList.add_child(arrow);
        switcherList._arrows.push(arrow);
        arrow.hide();
    }

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

function installPopupOverrides(injectionManager, popupClass, appSwitcher = false) {
    const popupPrototype = popupClass?.prototype;

    if (!popupPrototype || typeof popupPrototype._init !== 'function' ||
        typeof popupPrototype._finish !== 'function') {
        throw new Error(
            'The GNOME Shell switcher API is unavailable or unsupported.'
        );
    }

    injectionManager.overrideMethod(
        popupPrototype,
        '_init',
        originalMethod => {
            return function (...args) {
                originalMethod.call(this, ...args);

                this._items = addDesktopItem(this._switcherList, appSwitcher);
            };
        }
    );

    injectionManager.overrideMethod(
        popupPrototype,
        '_finish',
        originalMethod => {
            return function (timestamp) {
                const item = this._items?.[this._selectedIndex];

                if (item?.isDesktopItem) {
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

    if (appSwitcher) {
        injectionManager.overrideMethod(
            popupPrototype,
            '_select',
            originalMethod => {
                return function (index, window, forceAppFocus) {
                    if (this._items?.[index]?.isDesktopItem && window != null)
                        window = null;

                    originalMethod.call(this, index, window, forceAppFocus);
                };
            }
        );
    }
}

export default class DesktopInSwitcherExtension extends Extension {
    enable() {
        this._injectionManager = new InjectionManager();

        installPopupOverrides(
            this._injectionManager,
            AltTab.WindowSwitcherPopup
        );
        installPopupOverrides(
            this._injectionManager,
            AltTab.AppSwitcherPopup,
            true
        );
    }

    disable() {
        this._injectionManager.clear();
        this._injectionManager = null;
    }
}

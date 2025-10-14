if(!Object.hasOwn(window, "AvInstance")) {
	Object.defineProperty(window, "AvInstance", {
		get() {return Aventus.Instance;}
	});

	(() => {
		Map.prototype._defaultHas = Map.prototype.has;
		Map.prototype._defaultSet = Map.prototype.set;
		Map.prototype._defaultGet = Map.prototype.get;
		Map.prototype.has = function(key) {
			if(Aventus.Watcher?.is(key)) {
				return Map.prototype._defaultHas.call(this,key.getTarget())
			}
			return Map.prototype._defaultHas.call(this,key);
		}

		Map.prototype.set = function(key, value) {
			if(Aventus.Watcher?.is(key)) {
				return Map.prototype._defaultSet.call(this, key.getTarget(), value)
			}
			return Map.prototype._defaultSet.call(this, key, value);
		}
		Map.prototype.get = function(key) {
			if(Aventus.Watcher?.is(key)) {
				return Map.prototype._defaultGet.call(this, key.getTarget())
			}
			return Map.prototype._defaultGet.call(this, key);
		}
	})();
}
var Aventus;
(Aventus||(Aventus = {}));
(function (Aventus) {
const __as1 = (o, k, c) => { if (o[k] !== undefined) for (let w in o[k]) { c[w] = o[k][w] } o[k] = c; }
const moduleName = `Aventus`;
const _ = {};


let _n;
var HttpErrorCode;
(function (HttpErrorCode) {
    HttpErrorCode[HttpErrorCode["unknow"] = 0] = "unknow";
})(HttpErrorCode || (HttpErrorCode = {}));
__as1(_, 'HttpErrorCode', HttpErrorCode);

var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["OPTION"] = "OPTION";
})(HttpMethod || (HttpMethod = {}));
__as1(_, 'HttpMethod', HttpMethod);

var RamErrorCode;
(function (RamErrorCode) {
    RamErrorCode[RamErrorCode["unknow"] = 0] = "unknow";
    RamErrorCode[RamErrorCode["noId"] = 1] = "noId";
    RamErrorCode[RamErrorCode["noItemInsideRam"] = 2] = "noItemInsideRam";
})(RamErrorCode || (RamErrorCode = {}));
__as1(_, 'RamErrorCode', RamErrorCode);

let DateConverter=class DateConverter {
    static __converter = new DateConverter();
    static get converter() {
        return this.__converter;
    }
    static set converter(value) {
        this.__converter = value;
    }
    isStringDate(txt) {
        return /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3,6})Z$/.exec(txt) !== null;
    }
    fromString(txt) {
        return new Date(txt);
    }
    toString(date) {
        if (date.getFullYear() < 100) {
            return "0001-01-01T00:00:00.000Z";
        }
        return date.toISOString();
    }
}
DateConverter.Namespace=`Aventus`;
__as1(_, 'DateConverter', DateConverter);

let ActionGuard=class ActionGuard {
    /**
     * Map to store actions that are currently running.
     * @type {Map<any[], ((res: any) => void)[]>}
     * @private
     */
    runningAction = new Map();
    run(keys, action) {
        return new Promise(async (resolve) => {
            if (typeof keys == 'function') {
                action = keys;
                keys = [];
            }
            if (!action) {
                throw "No action inside the Mutex.run";
            }
            let actions = undefined;
            let runningKeys = Array.from(this.runningAction.keys());
            for (let runningKey of runningKeys) {
                if (runningKey.length == keys.length) {
                    let found = true;
                    for (let i = 0; i < keys.length; i++) {
                        if (runningKey[i] != keys[i]) {
                            found = false;
                            break;
                        }
                    }
                    if (found) {
                        actions = this.runningAction.get(runningKey);
                        break;
                    }
                }
            }
            if (actions) {
                actions.push((res) => {
                    resolve(res);
                });
            }
            else {
                this.runningAction.set(keys, []);
                let res = await action();
                let actions = this.runningAction.get(keys);
                if (actions) {
                    for (let action of actions) {
                        action(res);
                    }
                }
                this.runningAction.delete(keys);
                resolve(res);
            }
        });
    }
}
ActionGuard.Namespace=`Aventus`;
__as1(_, 'ActionGuard', ActionGuard);

let DragElementXYType= [SVGGElement, SVGRectElement, SVGEllipseElement, SVGTextElement];
__as1(_, 'DragElementXYType', DragElementXYType);

let DragElementLeftTopType= [HTMLElement, SVGSVGElement];
__as1(_, 'DragElementLeftTopType', DragElementLeftTopType);

let sleep=function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
__as1(_, 'sleep', sleep);

let isClass=function isClass(v) {
    return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
}
__as1(_, 'isClass', isClass);

let ElementExtension=class ElementExtension {
    /**
     * Find a parent by custom check
     */
    static findParent(element, check, untilNode) {
        let el = element;
        if (el) {
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
        }
        while (el) {
            if (check(el)) {
                return el;
            }
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
            if (el == untilNode) {
                break;
            }
        }
        return null;
    }
    /**
     * Find a list of parent by custom check
     */
    static findParents(element, check, untilNode) {
        let result = [];
        let el = element;
        if (el) {
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
        }
        while (el) {
            if (check(el)) {
                result.push(el);
            }
            if (el instanceof ShadowRoot) {
                el = el.host;
            }
            else {
                el = el.parentNode;
            }
            if (el == untilNode) {
                break;
            }
        }
        return result;
    }
    /**
     * Find a parent by tagname if exist Static.findParentByTag(this, "av-img")
     */
    static findParentByTag(element, tagname, untilNode) {
        if (Array.isArray(tagname)) {
            for (let i = 0; i < tagname.length; i++) {
                tagname[i] = tagname[i].toLowerCase();
            }
        }
        else {
            tagname = [tagname.toLowerCase()];
        }
        const checkFunc = (el) => {
            return tagname.indexOf((el.nodeName || el.tagName).toLowerCase()) != -1;
        };
        return this.findParent(element, checkFunc, untilNode);
    }
    /**
     * Find a parent by class name if exist Static.findParentByClass(this, "my-class-img") = querySelector('.my-class-img')
     */
    static findParentByClass(element, classname, untilNode) {
        if (!Array.isArray(classname)) {
            classname = [classname];
        }
        const check = (el) => {
            for (let classnameTemp of classname) {
                if (el['classList'] && el['classList'].contains(classnameTemp)) {
                    return true;
                }
            }
            return false;
        };
        return this.findParent(element, check, untilNode);
    }
    static findParentByType(element, types, untilNode) {
        if (!Array.isArray(types)) {
            types = [types];
        }
        let isValid = true;
        for (let type of types) {
            if (typeof type == "function" && type['prototype']['constructor'])
                continue;
            isValid = false;
        }
        if (isValid) {
            let checkFunc = (el) => {
                for (let type of types) {
                    const t = type;
                    if (el instanceof t) {
                        return true;
                    }
                }
                return false;
            };
            return this.findParent(element, checkFunc, untilNode);
        }
        console.error("you must provide a class inside this function");
        return null;
    }
    /**
     * Find list of parents by tagname
     */
    static findParentsByTag(element, tagname, untilNode) {
        let el = element;
        if (Array.isArray(tagname)) {
            for (let i = 0; i < tagname.length; i++) {
                tagname[i] = tagname[i].toLowerCase();
            }
        }
        else {
            tagname = [tagname.toLowerCase()];
        }
        let check = (el) => {
            return tagname.indexOf((el.nodeName || el['tagName']).toLowerCase()) != -1;
        };
        return this.findParents(element, check, untilNode);
    }
    /**
     * Check if element contains a child
     */
    static containsChild(element, child) {
        var rootScope = element.getRootNode();
        var elScope = child.getRootNode();
        while (elScope != rootScope) {
            if (!elScope['host']) {
                return false;
            }
            child = elScope['host'];
            elScope = elScope['host'].getRootNode();
        }
        return element.contains(child);
    }
    /**
     * Get element inside slot
     */
    static getElementsInSlot(element, slotName) {
        let result = [];
        if (element.shadowRoot) {
            let slotEl;
            if (slotName) {
                slotEl = element.shadowRoot.querySelector('slot[name="' + slotName + '"]');
            }
            else {
                slotEl = element.shadowRoot.querySelector("slot:not([name])");
                if (!slotEl) {
                    slotEl = element.shadowRoot.querySelector("slot");
                }
            }
            while (true) {
                if (!slotEl) {
                    return result;
                }
                var listChild = Array.from(slotEl.assignedElements());
                if (!listChild) {
                    return result;
                }
                let slotFound = false;
                for (let i = 0; i < listChild.length; i++) {
                    let child = listChild[i];
                    if (listChild[i].nodeName == "SLOT") {
                        slotEl = listChild[i];
                        slotFound = true;
                    }
                    else if (child instanceof HTMLElement) {
                        result.push(child);
                    }
                }
                if (!slotFound) {
                    return result;
                }
            }
        }
        return result;
    }
    /**
     * Get element inside slot
     */
    static getNodesInSlot(element, slotName) {
        let result = [];
        if (element.shadowRoot) {
            let slotEl;
            if (slotName) {
                slotEl = element.shadowRoot.querySelector('slot[name="' + slotName + '"]');
            }
            else {
                slotEl = element.shadowRoot.querySelector("slot:not([name])");
                if (!slotEl) {
                    slotEl = element.shadowRoot.querySelector("slot");
                }
            }
            while (true) {
                if (!slotEl) {
                    return result;
                }
                var listChild = Array.from(slotEl.assignedNodes());
                if (!listChild) {
                    return result;
                }
                let slotFound = false;
                for (let i = 0; i < listChild.length; i++) {
                    let child = listChild[i];
                    if (listChild[i].nodeName == "SLOT") {
                        slotEl = listChild[i];
                        slotFound = true;
                    }
                    else if (child instanceof Node) {
                        result.push(child);
                    }
                }
                if (!slotFound) {
                    return result;
                }
            }
        }
        return result;
    }
    /**
     * Get deeper element inside dom at the position X and Y
     */
    static getElementAtPosition(x, y, startFrom) {
        var _realTarget = (el, i = 0) => {
            if (i == 50) {
                debugger;
            }
            if (el.shadowRoot && x !== undefined && y !== undefined) {
                const elements = el.shadowRoot.elementsFromPoint(x, y);
                var newEl = elements.length > 0 ? elements[0] : null;
                if (newEl && newEl != el && (el.shadowRoot.contains(newEl) || el.contains(newEl))) {
                    return _realTarget(newEl, i + 1);
                }
            }
            return el;
        };
        if (startFrom == null) {
            startFrom = document.body;
        }
        return _realTarget(startFrom);
    }
    /**
     * Get active element from the define root
     */
    static getActiveElement(root = document) {
        if (!root)
            return null;
        let el = root.activeElement;
        while (el instanceof WebComponent) {
            let elTemp = el.shadowRoot?.activeElement;
            if (!elTemp)
                return el;
            el = elTemp;
        }
        return el;
    }
}
ElementExtension.Namespace=`Aventus`;
__as1(_, 'ElementExtension', ElementExtension);

let Style=class Style {
    static instance;
    static noAnimation;
    static defaultStyleSheets = {
        "@default": `:host{display:inline-block;box-sizing:border-box}:host *{box-sizing:border-box}`,
    };
    static store(name, content) {
        this.getInstance().store(name, content);
    }
    static get(name) {
        return this.getInstance().get(name);
    }
    static getAsString(name) {
        return this.getInstance().getAsString(name);
    }
    static sheetToString(stylesheet) {
        return this.getInstance().sheetToString(stylesheet);
    }
    static load(name, url) {
        return this.getInstance().load(name, url);
    }
    static appendToHead(name) {
        if (!document.head.querySelector(`style[data-name="${name}"]`)) {
            const styleNode = document.createElement('style');
            styleNode.setAttribute(`data-name`, name);
            styleNode.innerHTML = Style.getAsString(name);
            document.getElementsByTagName('head')[0].appendChild(styleNode);
        }
    }
    static refreshHead(name) {
        const styleNode = document.head.querySelector(`style[data-name="${name}"]`);
        if (styleNode) {
            styleNode.innerHTML = Style.getAsString(name);
        }
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Style();
        }
        return this.instance;
    }
    constructor() {
        for (let name in Style.defaultStyleSheets) {
            this.store(name, Style.defaultStyleSheets[name]);
        }
        Style.noAnimation = new CSSStyleSheet();
        Style.noAnimation.replaceSync(`:host{-webkit-transition: none !important;-moz-transition: none !important;-ms-transition: none !important;-o-transition: none !important;transition: none !important;}:host *{-webkit-transition: none !important;-moz-transition: none !important;-ms-transition: none !important;-o-transition: none !important;transition: none !important;}`);
    }
    stylesheets = new Map();
    async load(name, url) {
        try {
            let style = this.stylesheets.get(name);
            if (!style || style.cssRules.length == 0) {
                let txt = await (await fetch(url)).text();
                this.store(name, txt);
            }
        }
        catch (e) {
        }
    }
    store(name, content) {
        let style = this.stylesheets.get(name);
        if (!style) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(content);
            this.stylesheets.set(name, sheet);
            return sheet;
        }
        else {
            style.replaceSync(content);
            Style.refreshHead(name);
            return style;
        }
    }
    get(name) {
        let style = this.stylesheets.get(name);
        if (!style) {
            style = this.store(name, "");
        }
        return style;
    }
    getAsString(name) {
        return this.sheetToString(this.get(name));
    }
    sheetToString(stylesheet) {
        return stylesheet.cssRules
            ? Array.from(stylesheet.cssRules)
                .map(rule => rule.cssText || '')
                .join('\n')
            : '';
    }
}
Style.Namespace=`Aventus`;
__as1(_, 'Style', Style);

let setValueToObject=function setValueToObject(path, obj, value) {
    path = path.replace(/\[(.*?)\]/g, '.$1');
    const val = (key) => {
        if (obj instanceof Map) {
            return obj.get(key);
        }
        return obj[key];
    };
    let splitted = path.split(".");
    for (let i = 0; i < splitted.length - 1; i++) {
        let split = splitted[i];
        let value = val(split);
        if (!value) {
            obj[split] = {};
            value = obj[split];
        }
        obj = value;
    }
    if (obj instanceof Map) {
        obj.set(splitted[splitted.length - 1], value);
    }
    else {
        obj[splitted[splitted.length - 1]] = value;
    }
}
__as1(_, 'setValueToObject', setValueToObject);

let Mutex=class Mutex {
    /**
     * Array to store functions waiting for the mutex to become available.
     * @type {((run: boolean) => void)[]}
     */
    waitingList = [];
    /**
    * Indicates whether the mutex is currently locked or not.
    * @type {boolean}
    */
    isLocked = false;
    /**
    * Waits for the mutex to become available and then acquires it.
    * @returns {Promise<boolean>} A Promise that resolves to true if the mutex was acquired successfully.
    */
    waitOne() {
        return new Promise((resolve) => {
            if (this.isLocked) {
                this.waitingList.push((run) => {
                    resolve(run);
                });
            }
            else {
                this.isLocked = true;
                resolve(true);
            }
        });
    }
    /**
     * Release the mutex
     */
    release() {
        let nextFct = this.waitingList.shift();
        if (nextFct) {
            nextFct(true);
        }
        else {
            this.isLocked = false;
        }
    }
    /**
     * Releases the mutex, allowing only the last function in the waiting list to acquire it.
     */
    releaseOnlyLast() {
        if (this.waitingList.length > 0) {
            let lastFct = this.waitingList.pop();
            for (let fct of this.waitingList) {
                fct(false);
            }
            this.waitingList = [];
            if (lastFct) {
                lastFct(true);
            }
        }
        else {
            this.isLocked = false;
        }
    }
    /**
     * Clears the mutex, removing all waiting functions and releasing the lock.
     */
    dispose() {
        this.waitingList = [];
        this.isLocked = false;
    }
    /**
     * Executes a callback function safely within the mutex lock and releases the lock afterward.
     * @template T - The type of the return value of the callback function.
     * @param {() => T} cb - The callback function to execute.
     * @returns {Promise<T | null>} A Promise that resolves to the result of the callback function or null if an error occurs.
     */
    async safeRun(cb) {
        let result = null;
        await this.waitOne();
        try {
            result = cb.apply(null, []);
        }
        catch (e) {
            console.error(e);
        }
        await this.release();
        return result;
    }
    /**
     * Executes an asynchronous callback function safely within the mutex lock and releases the lock afterward.
     * @template T - The type of the return value of the asynchronous callback function.
     * @param {() => Promise<T>} cb - The asynchronous callback function to execute.
     * @returns {Promise<T | null>} A Promise that resolves to the result of the asynchronous callback function or null if an error occurs.
     */
    async safeRunAsync(cb) {
        let result = null;
        await this.waitOne();
        try {
            result = await cb.apply(null, []);
        }
        catch (e) {
            console.error(e);
        }
        await this.release();
        return result;
    }
    /**
     * Executes a callback function safely within the mutex lock, allowing only the last function in the waiting list to acquire the lock, and releases the lock afterward.
     * @template T - The type of the return value of the callback function.
     * @param {() => T} cb - The callback function to execute.
     * @returns {Promise<T | null>} A Promise that resolves to the result of the callback function or null if an error occurs.
     */
    async safeRunLast(cb) {
        let result = null;
        if (await this.waitOne()) {
            try {
                result = cb.apply(null, []);
            }
            catch (e) {
                console.error(e);
            }
            await this.releaseOnlyLast();
        }
        return result;
    }
    /**
     * Executes an asynchronous callback function safely within the mutex lock, allowing only the last function in the waiting list to acquire the lock, and releases the lock afterward.
     * @template T - The type of the return value of the asynchronous callback function.
     * @param {() => Promise<T>} cb - The asynchronous callback function to execute.
     * @returns {Promise<T | undefined>} A Promise that resolves to the result of the asynchronous callback function or undefined if an error occurs.
     */
    async safeRunLastAsync(cb) {
        let result;
        if (await this.waitOne()) {
            try {
                result = await cb.apply(null, []);
            }
            catch (e) {
                console.error(e);
            }
            await this.releaseOnlyLast();
        }
        return result;
    }
}
Mutex.Namespace=`Aventus`;
__as1(_, 'Mutex', Mutex);

let NormalizedEvent=class NormalizedEvent {
    _event;
    get event() {
        return this._event;
    }
    constructor(event) {
        this._event = event;
    }
    getProp(prop) {
        if (prop in this.event) {
            return this.event[prop];
        }
        return undefined;
    }
    stopImmediatePropagation() {
        this.event.stopImmediatePropagation();
    }
    get clientX() {
        if ('clientX' in this.event) {
            return this.event.clientX;
        }
        else if ('touches' in this.event && this.event.touches.length > 0) {
            return this.event.touches[0].clientX;
        }
        return 0;
    }
    get clientY() {
        if ('clientY' in this.event) {
            return this.event.clientY;
        }
        else if ('touches' in this.event && this.event.touches.length > 0) {
            return this.event.touches[0].clientY;
        }
        return 0;
    }
    get pageX() {
        if ('pageX' in this.event) {
            return this.event.pageX;
        }
        else if ('touches' in this.event && this.event.touches.length > 0) {
            return this.event.touches[0].pageX;
        }
        return 0;
    }
    get pageY() {
        if ('pageY' in this.event) {
            return this.event.pageY;
        }
        else if ('touches' in this.event && this.event.touches.length > 0) {
            return this.event.touches[0].pageY;
        }
        return 0;
    }
    get type() {
        return this.event.type;
    }
    get target() {
        return this.event.target;
    }
    get timeStamp() {
        return this.event.timeStamp;
    }
    get pointerType() {
        if ('TouchEvent' in window && this._event instanceof TouchEvent)
            return "touch";
        return this.getProp("pointerType");
    }
    get button() {
        return this.getProp("button");
    }
    get isTouch() {
        if ('TouchEvent' in window && this._event instanceof TouchEvent)
            return true;
        return this._event.pointerType == "touch";
    }
}
NormalizedEvent.Namespace=`Aventus`;
__as1(_, 'NormalizedEvent', NormalizedEvent);

let Callback=class Callback {
    callbacks = new Map();
    /**
     * Clear all callbacks
     */
    clear() {
        this.callbacks.clear();
    }
    /**
     * Add a callback
     */
    add(cb, scope = null) {
        if (!this.callbacks.has(cb)) {
            this.callbacks.set(cb, scope);
        }
    }
    /**
     * Remove a callback
     */
    remove(cb) {
        this.callbacks.delete(cb);
    }
    /**
     * Trigger all callbacks
     */
    trigger(...args) {
        let result = [];
        let cbs = [...this.callbacks];
        for (let [cb, scope] of cbs) {
            result.push(cb.apply(scope, args));
        }
        return result;
    }
}
Callback.Namespace=`Aventus`;
__as1(_, 'Callback', Callback);

let compareObject=function compareObject(obj1, obj2) {
    if (Array.isArray(obj1)) {
        if (!Array.isArray(obj2)) {
            return false;
        }
        obj2 = obj2.slice();
        if (obj1.length !== obj2.length) {
            return false;
        }
        for (let i = 0; i < obj1.length; i++) {
            let foundElement = false;
            for (let j = 0; j < obj2.length; j++) {
                if (compareObject(obj1[i], obj2[j])) {
                    obj2.splice(j, 1);
                    foundElement = true;
                    break;
                }
            }
            if (!foundElement) {
                return false;
            }
        }
        return true;
    }
    else if (typeof obj1 === 'object' && obj1 !== undefined && obj1 !== null) {
        if (typeof obj2 !== 'object' || obj2 === undefined || obj2 === null) {
            return false;
        }
        if (obj1 == obj2) {
            return true;
        }
        if (obj1 instanceof HTMLElement || obj2 instanceof HTMLElement) {
            return false;
        }
        if (obj1 instanceof Date || obj2 instanceof Date) {
            return obj1.toString() === obj2.toString();
        }
        let oneProxy = false;
        if (Watcher.is(obj1)) {
            oneProxy = true;
            obj1 = Watcher.extract(obj1, false);
        }
        if (Watcher.is(obj2)) {
            oneProxy = true;
            obj2 = Watcher.extract(obj2, false);
        }
        if (obj1 instanceof Map && obj2 instanceof Map) {
            if (obj1.size != obj2.size) {
                return false;
            }
            const keys = obj1.keys();
            for (let key in keys) {
                if (!obj2.has(key)) {
                    return false;
                }
                if (!compareObject(obj1.get(key), obj2.get(key))) {
                    return false;
                }
            }
            return true;
        }
        else {
            if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                return false;
            }
            for (let key in obj1) {
                if (oneProxy && Watcher['__reservedName'][key]) {
                    continue;
                }
                if (!(key in obj2)) {
                    return false;
                }
                if (!compareObject(obj1[key], obj2[key])) {
                    return false;
                }
            }
            return true;
        }
    }
    else {
        return obj1 === obj2;
    }
}
__as1(_, 'compareObject', compareObject);

let getValueFromObject=function getValueFromObject(path, obj) {
    if (path === undefined) {
        path = '';
    }
    path = path.replace(/\[(.*?)\]/g, '.$1');
    if (path == "") {
        return obj;
    }
    const val = (key) => {
        if (obj instanceof Map) {
            return obj.get(key);
        }
        return obj[key];
    };
    let splitted = path.split(".");
    for (let i = 0; i < splitted.length - 1; i++) {
        let split = splitted[i];
        let value = val(split);
        if (!value || typeof value !== 'object') {
            return undefined;
        }
        obj = value;
    }
    if (!obj || typeof obj !== 'object') {
        return undefined;
    }
    return val(splitted[splitted.length - 1]);
}
__as1(_, 'getValueFromObject', getValueFromObject);

var WatchAction;
(function (WatchAction) {
    WatchAction[WatchAction["CREATED"] = 0] = "CREATED";
    WatchAction[WatchAction["UPDATED"] = 1] = "UPDATED";
    WatchAction[WatchAction["DELETED"] = 2] = "DELETED";
})(WatchAction || (WatchAction = {}));
__as1(_, 'WatchAction', WatchAction);

let Effect=class Effect {
    callbacks = [];
    isInit = false;
    isDestroy = false;
    __subscribes = [];
    __allowChanged = [];
    version = 0;
    fct;
    constructor(fct) {
        this.fct = fct;
        if (this.autoInit()) {
            this.init();
        }
    }
    autoInit() {
        return true;
    }
    init() {
        this.isInit = true;
        this.run();
    }
    run() {
        this.version++;
        Watcher._registering.push(this);
        let result = this.fct();
        Watcher._registering.splice(Watcher._registering.length - 1, 1);
        for (let i = 0; i < this.callbacks.length; i++) {
            if (this.callbacks[i].version != this.version) {
                this.callbacks[i].receiver.unsubscribe(this.callbacks[i].cb);
                this.callbacks.splice(i, 1);
                i--;
            }
        }
        return result;
    }
    register(receiver, path, version, fullPath) {
        for (let info of this.callbacks) {
            if (info.receiver == receiver && info.path == path && receiver.__path == info.registerPath) {
                info.version = version;
                info.fullPath = fullPath;
                return;
            }
        }
        let cb;
        if (path == "*") {
            cb = (action, changePath, value, dones) => { this.onChange(action, changePath, value, dones); };
        }
        else {
            cb = (action, changePath, value, dones) => {
                // if(changePath == path || changePath.startsWith(path + ".") || changePath.startsWith(path + "[")) {
                if (changePath == path) {
                    this.onChange(action, changePath, value, dones);
                }
            };
        }
        this.callbacks.push({
            receiver,
            path,
            registerPath: receiver.__path,
            cb,
            version,
            fullPath
        });
        receiver.subscribe(cb);
    }
    canChange(fct) {
        this.__allowChanged.push(fct);
    }
    checkCanChange(action, changePath, value, dones) {
        if (this.isDestroy) {
            return false;
        }
        for (let fct of this.__allowChanged) {
            if (!fct(action, changePath, value, dones)) {
                return false;
            }
        }
        return true;
    }
    onChange(action, changePath, value, dones) {
        if (!this.checkCanChange(action, changePath, value, dones)) {
            return;
        }
        this.run();
        for (let fct of this.__subscribes) {
            fct(action, changePath, value, dones);
        }
    }
    destroy() {
        this.isDestroy = true;
        this.clearCallbacks();
        this.isInit = false;
    }
    clearCallbacks() {
        for (let pair of this.callbacks) {
            pair.receiver.unsubscribe(pair.cb);
        }
        this.callbacks = [];
    }
    subscribe(fct) {
        let index = this.__subscribes.indexOf(fct);
        if (index == -1) {
            this.__subscribes.push(fct);
        }
    }
    unsubscribe(fct) {
        let index = this.__subscribes.indexOf(fct);
        if (index > -1) {
            this.__subscribes.splice(index, 1);
        }
    }
}
Effect.Namespace=`Aventus`;
__as1(_, 'Effect', Effect);

let Signal=class Signal {
    __subscribes = [];
    _value;
    _onChange;
    get value() {
        Watcher._register?.register(this, "*", Watcher._register.version, "*");
        return this._value;
    }
    set value(item) {
        const oldValue = this._value;
        this._value = item;
        if (oldValue != item) {
            if (this._onChange) {
                this._onChange();
            }
            for (let fct of this.__subscribes) {
                fct(WatchAction.UPDATED, "*", item, []);
            }
        }
    }
    constructor(item, onChange) {
        this._value = item;
        this._onChange = onChange;
    }
    subscribe(fct) {
        let index = this.__subscribes.indexOf(fct);
        if (index == -1) {
            this.__subscribes.push(fct);
        }
    }
    unsubscribe(fct) {
        let index = this.__subscribes.indexOf(fct);
        if (index > -1) {
            this.__subscribes.splice(index, 1);
        }
    }
    destroy() {
        this.__subscribes = [];
    }
}
Signal.Namespace=`Aventus`;
__as1(_, 'Signal', Signal);

let Computed=class Computed extends Effect {
    _value;
    __path = "*";
    get value() {
        if (!this.isInit) {
            this.init();
        }
        Watcher._register?.register(this, "*", Watcher._register.version, "*");
        return this._value;
    }
    autoInit() {
        return false;
    }
    constructor(fct) {
        super(fct);
    }
    init() {
        this.isInit = true;
        this.computedValue();
    }
    computedValue() {
        this._value = this.run();
    }
    onChange(action, changePath, value, dones) {
        if (!this.checkCanChange(action, changePath, value, dones)) {
            return;
        }
        let oldValue = this._value;
        this.computedValue();
        if (oldValue === this._value) {
            return;
        }
        for (let fct of this.__subscribes) {
            fct(action, changePath, value, dones);
        }
    }
}
Computed.Namespace=`Aventus`;
__as1(_, 'Computed', Computed);

let Watcher=class Watcher {
    constructor() { }
    ;
    static __reservedName = {
        __path: '__path',
    };
    static __triggerForced = false;
    static _registering = [];
    static get _register() {
        return this._registering[this._registering.length - 1];
    }
    /**
     * Transform object into a watcher
     */
    static get(obj, onDataChanged) {
        if (obj == undefined) {
            console.error("You must define an objet / array for your proxy");
            return;
        }
        if (obj.__isProxy) {
            if (onDataChanged)
                obj.subscribe(onDataChanged);
            return obj;
        }
        const reservedName = this.__reservedName;
        const clearReservedNames = (data) => {
            if (data instanceof Object && !data.__isProxy) {
                for (let key in reservedName) {
                    delete data[key];
                }
                for (let key in data) {
                    clearReservedNames(data[key]);
                }
            }
        };
        const setProxyPath = (newProxy, newPath) => {
            if (newProxy instanceof Object && newProxy.__isProxy) {
                newProxy.__path = newPath;
            }
        };
        const jsonReplacer = (key, value) => {
            if (reservedName[key])
                return undefined;
            return value;
        };
        const addAlias = (otherBaseData, name, cb) => {
            let cbs = aliases.get(otherBaseData);
            if (!cbs) {
                cbs = [];
                aliases.set(otherBaseData, cbs);
            }
            cbs.push({
                name: name,
                fct: cb
            });
        };
        const deleteAlias = (otherBaseData, name) => {
            let cbs = aliases.get(otherBaseData);
            if (!cbs)
                return;
            for (let i = 0; i < cbs.length; i++) {
                if (cbs[i].name == name) {
                    cbs.splice(i, 1);
                    if (cbs.length == 0) {
                        aliases.delete(otherBaseData);
                    }
                    return;
                }
            }
        };
        const replaceByAlias = (target, element, prop, receiver, apply, out = {}) => {
            let fullInternalPath = "";
            if (Array.isArray(receiver)) {
                if (prop != "length") {
                    if (target.__path) {
                        fullInternalPath = target.__path;
                    }
                    fullInternalPath += "[" + prop + "]";
                }
            }
            else {
                if (target.__path) {
                    fullInternalPath = target.__path + '.';
                }
                fullInternalPath += prop;
            }
            if (receiver && internalAliases[fullInternalPath]) {
                internalAliases[fullInternalPath].unbind();
            }
            if (element instanceof Object && element.__isProxy) {
                let root = element.__root;
                if (root != proxyData.baseData) {
                    element.__validatePath();
                    let oldPath = element.__path ?? '';
                    let unbindElement = Watcher.extract(getValueFromObject(oldPath, root));
                    if (unbindElement === undefined) {
                        return element;
                    }
                    if (receiver == null) {
                        receiver = getValueFromObject(target.__path, realProxy);
                        if (internalAliases[fullInternalPath]) {
                            internalAliases[fullInternalPath].unbind();
                        }
                    }
                    if (apply) {
                        let result = Reflect.set(target, prop, unbindElement, receiver);
                    }
                    element.__addAlias(proxyData.baseData, oldPath, (type, target, receiver2, value, prop2, dones) => {
                        let triggerPath;
                        if (prop2.startsWith("[") || fullInternalPath == "" || prop2 == "") {
                            triggerPath = fullInternalPath + prop2;
                        }
                        else {
                            triggerPath = fullInternalPath + "." + prop2;
                        }
                        if (type == 'DELETED' && internalAliases[triggerPath]) {
                            internalAliases[triggerPath].unbind();
                        }
                        triggerPath = triggerPath.replace(/\[(.*?)\]/g, '.$1');
                        let splitted = triggerPath.split(".");
                        let newProp = splitted.pop();
                        let newReceiver = getValueFromObject(splitted.join("."), realProxy);
                        if (newReceiver.getTarget(false) == target)
                            trigger(type, target, newReceiver, value, newProp, dones);
                    });
                    internalAliases[fullInternalPath] = {
                        unbind: () => {
                            delete internalAliases[fullInternalPath];
                            element.__deleteAlias(proxyData.baseData, oldPath);
                            deleteAlias(root, fullInternalPath);
                        }
                    };
                    addAlias(root, fullInternalPath, (type, target, receiver2, value, prop2, dones) => {
                        const pathSave = element.__path;
                        let proxy = element.__getProxy;
                        let triggerPath;
                        if (prop2.startsWith("[") || oldPath == "" || prop2 == "") {
                            triggerPath = oldPath + prop2;
                        }
                        else {
                            triggerPath = oldPath + "." + prop2;
                        }
                        triggerPath = triggerPath.replace(/\[(.*?)\]/g, '.$1');
                        let splitted = triggerPath.split(".");
                        let newProp = splitted.pop();
                        let newReceiver = getValueFromObject(splitted.join("."), proxy);
                        if (newReceiver.getTarget(false) == target)
                            element.__trigger(type, target, newReceiver, value, newProp, dones);
                        element.__path = pathSave;
                    });
                    out.otherRoot = root;
                    return unbindElement;
                }
            }
            return element;
        };
        let currentTrace = new Error().stack?.split("\n") ?? [];
        currentTrace.shift();
        currentTrace.shift();
        const aliases = new Map();
        const internalAliases = {};
        let proxyData = {
            baseData: {},
            callbacks: {},
            callbacksReverse: new Map(),
            avoidUpdate: [],
            pathToRemove: [],
            injectedDones: null,
            history: [{
                    object: JSON.parse(JSON.stringify(obj, jsonReplacer)),
                    trace: currentTrace,
                    action: 'init',
                    path: ''
                }],
            useHistory: false,
            getProxyObject(target, element, prop) {
                let newProxy;
                element = replaceByAlias(target, element, prop, null, true);
                if (element instanceof Object && element.__isProxy) {
                    newProxy = element;
                }
                else {
                    try {
                        if (element instanceof Computed) {
                            return element;
                        }
                        if (element instanceof HTMLElement) {
                            return element;
                        }
                        if (element instanceof Object) {
                            newProxy = new Proxy(element, this);
                        }
                        else {
                            return element;
                        }
                    }
                    catch {
                        return element;
                    }
                }
                let newPath = '';
                if (Array.isArray(target)) {
                    if (/^[0-9]*$/g.exec(prop)) {
                        if (target.__path) {
                            newPath = target.__path;
                        }
                        newPath += "[" + prop + "]";
                        setProxyPath(newProxy, newPath);
                    }
                    else {
                        newPath += "." + prop;
                        setProxyPath(newProxy, newPath);
                    }
                }
                else if (element instanceof Date) {
                    return element;
                }
                else {
                    if (target.__path) {
                        newPath = target.__path + '.';
                    }
                    newPath += prop;
                    setProxyPath(newProxy, newPath);
                }
                return newProxy;
            },
            tryCustomFunction(target, prop, receiver) {
                if (prop == "__isProxy") {
                    return true;
                }
                else if (prop == "__getProxy") {
                    return realProxy;
                }
                else if (prop == "__root") {
                    return this.baseData;
                }
                else if (prop == "__validatePath") {
                    return () => {
                        if (this.baseData == target) {
                            target.__path = "";
                        }
                    };
                }
                else if (prop == "__callbacks") {
                    return this.callbacks;
                }
                else if (prop == "subscribe") {
                    let path = receiver.__path;
                    return (cb) => {
                        if (!this.callbacks[path]) {
                            this.callbacks[path] = [];
                        }
                        this.callbacks[path].push(cb);
                        this.callbacksReverse.set(cb, path);
                    };
                }
                else if (prop == "unsubscribe") {
                    return (cb) => {
                        let oldPath = this.callbacksReverse.get(cb);
                        if (oldPath === undefined)
                            return;
                        if (!this.callbacks[oldPath]) {
                            return;
                        }
                        let index = this.callbacks[oldPath].indexOf(cb);
                        if (index > -1) {
                            this.callbacks[oldPath].splice(index, 1);
                        }
                        this.callbacksReverse.delete(cb);
                    };
                }
                else if (prop == "getHistory") {
                    return () => {
                        return this.history;
                    };
                }
                else if (prop == "clearHistory") {
                    this.history = [];
                }
                else if (prop == "enableHistory") {
                    return () => {
                        this.useHistory = true;
                    };
                }
                else if (prop == "disableHistory") {
                    return () => {
                        this.useHistory = false;
                    };
                }
                else if (prop == "getTarget") {
                    return (clear = true) => {
                        if (clear)
                            clearReservedNames(target);
                        return target;
                    };
                }
                else if (prop == "toJSON") {
                    if (target.toJSON) {
                        return target.toJSON;
                    }
                    if (Array.isArray(receiver)) {
                        return () => {
                            let result = [];
                            for (let element of target) {
                                result.push(element);
                            }
                            return result;
                        };
                    }
                    return () => {
                        let result = {};
                        for (let key of Object.keys(target)) {
                            if (reservedName[key]) {
                                continue;
                            }
                            result[key] = target[key];
                        }
                        return result;
                    };
                }
                else if (prop == "__addAlias") {
                    return addAlias;
                }
                else if (prop == "__deleteAlias") {
                    return deleteAlias;
                }
                else if (prop == "__injectedDones") {
                    return (dones) => {
                        this.injectedDones = dones;
                    };
                }
                else if (prop == "__trigger") {
                    return trigger;
                }
                else if (prop == "__static_trigger") {
                    return (type) => {
                        Watcher.__triggerForced = true;
                        trigger(type, target, receiver, target, '');
                        Watcher.__triggerForced = false;
                    };
                }
                return undefined;
            },
            get(target, prop, receiver) {
                if (typeof prop == 'symbol') {
                    return Reflect.get(target, prop, receiver);
                }
                if (reservedName[prop]) {
                    return target[prop];
                }
                let customResult = this.tryCustomFunction(target, prop, receiver);
                if (customResult !== undefined) {
                    return customResult;
                }
                let element = target[prop];
                if (typeof (element) == 'function') {
                    if (Array.isArray(receiver)) {
                        let result;
                        if (prop == 'push') {
                            if (target.__isProxy) {
                                result = (el) => {
                                    let index = target.push(el);
                                    return index;
                                };
                            }
                            else {
                                result = (el) => {
                                    let index = target.length;
                                    let out = {};
                                    el = replaceByAlias(target, el, target.length + '', receiver, false, out);
                                    target.push(el);
                                    const dones = [];
                                    if (out.otherRoot) {
                                        dones.push(out.otherRoot);
                                    }
                                    trigger('CREATED', target, receiver, receiver[index], "[" + (index) + "]", dones);
                                    trigger('UPDATED', target, receiver, target.length, "length", dones);
                                    return index;
                                };
                            }
                        }
                        else if (prop == 'splice') {
                            if (target.__isProxy) {
                                result = (index, nbRemove, ...insert) => {
                                    let res = target.splice(index, nbRemove, ...insert);
                                    return res;
                                };
                            }
                            else {
                                result = (index, nbRemove, ...insert) => {
                                    let oldValues = [];
                                    const extReceiver = Watcher.extract(receiver);
                                    for (let i = index; i < index + nbRemove; i++) {
                                        oldValues.push(extReceiver[i]);
                                    }
                                    let updateLength = nbRemove != insert.length;
                                    for (let i = 0; i < oldValues.length; i++) {
                                        target.splice((index + i), 1);
                                        trigger('DELETED', target, receiver, oldValues[i], "[" + index + "]");
                                    }
                                    for (let i = 0; i < insert.length; i++) {
                                        const out = {};
                                        let value = replaceByAlias(target, insert[i], (index + i) + '', receiver, false, out);
                                        const dones = out.otherRoot ? [out.otherRoot] : [];
                                        target.splice((index + i), 0, value);
                                        trigger('CREATED', target, receiver, receiver[(index + i)], "[" + (index + i) + "]", dones);
                                    }
                                    if (updateLength)
                                        trigger('UPDATED', target, receiver, target.length, "length");
                                    return target;
                                };
                            }
                        }
                        else if (prop == 'pop') {
                            if (target.__isProxy) {
                                result = () => {
                                    let res = target.pop();
                                    return res;
                                };
                            }
                            else {
                                result = () => {
                                    let index = target.length - 1;
                                    let oldValue = receiver.length ? receiver[receiver.length] : undefined;
                                    let res = target.pop();
                                    trigger('DELETED', target, receiver, oldValue, "[" + index + "]");
                                    trigger('UPDATED', target, receiver, target.length, "length");
                                    return res;
                                };
                            }
                        }
                        else {
                            result = element.bind(target);
                        }
                        return result;
                    }
                    else if (target instanceof Map) {
                        let result;
                        if (prop == "set") {
                            if (target.__isProxy) {
                                result = (key, value) => {
                                    return target.set(key, value);
                                };
                            }
                            else {
                                result = (key, value) => {
                                    const out = {};
                                    let dones = [];
                                    key = Watcher.extract(key);
                                    value = replaceByAlias(target, value, key + '', receiver, false, out);
                                    if (out.otherRoot)
                                        dones.push(out.otherRoot);
                                    let result = target.set(key, value);
                                    trigger('CREATED', target, receiver, receiver.get(key), key + '', dones);
                                    trigger('UPDATED', target, receiver, target.size, "size", dones);
                                    return result;
                                };
                            }
                        }
                        else if (prop == "clear") {
                            if (target.__isProxy) {
                                result = () => {
                                    return target.clear();
                                };
                            }
                            else {
                                result = () => {
                                    let keys = target.keys();
                                    for (let key of keys) {
                                        let oldValue = receiver.get(key);
                                        target.delete(key);
                                        trigger('DELETED', target, receiver, oldValue, key);
                                        trigger('UPDATED', target, receiver, target.size, "size");
                                    }
                                };
                            }
                        }
                        else if (prop == "delete") {
                            if (target.__isProxy) {
                                result = (key) => {
                                    return target.delete(key);
                                };
                            }
                            else {
                                result = (key) => {
                                    key = Watcher.extract(key);
                                    let oldValue = receiver.get(key);
                                    let res = target.delete(key);
                                    trigger('DELETED', target, receiver, oldValue, key + '');
                                    trigger('UPDATED', target, receiver, target.size, "size");
                                    return res;
                                };
                            }
                        }
                        else {
                            result = element.bind(target);
                        }
                        return result;
                    }
                    return element.bind(target);
                }
                if (element instanceof Computed) {
                    return element.value;
                }
                if (Watcher._registering.length > 0) {
                    let currentPath;
                    let fullPath;
                    let isArray = Array.isArray(receiver);
                    if (isArray && /^[0-9]*$/g.exec(prop)) {
                        fullPath = receiver.__path + "[" + prop + "]";
                        currentPath = "[" + prop + "]";
                    }
                    else {
                        fullPath = receiver.__path ? receiver.__path + '.' + prop : prop;
                        currentPath = prop;
                    }
                    Watcher._register?.register(receiver, currentPath, Watcher._register.version, fullPath);
                }
                if (typeof (element) == 'object') {
                    return this.getProxyObject(target, element, prop);
                }
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                if (typeof prop == 'symbol') {
                    return Reflect.set(target, prop, value, receiver);
                }
                let oldValue = Reflect.get(target, prop, receiver);
                value = replaceByAlias(target, value, prop, receiver, true);
                if (value instanceof Signal) {
                    value = value.value;
                }
                let triggerChange = false;
                if (!reservedName[prop]) {
                    if (Array.isArray(receiver)) {
                        if (prop != "length") {
                            triggerChange = true;
                        }
                    }
                    else {
                        if (!compareObject(value, oldValue)) {
                            triggerChange = true;
                        }
                    }
                    if (Watcher.__triggerForced) {
                        triggerChange = true;
                    }
                }
                let result = Reflect.set(target, prop, value, receiver);
                if (triggerChange) {
                    let index = this.avoidUpdate.indexOf(prop);
                    if (index == -1) {
                        let dones = this.injectedDones ?? [];
                        this.injectedDones = null;
                        trigger('UPDATED', target, receiver, value, prop, dones);
                    }
                    else {
                        this.avoidUpdate.splice(index, 1);
                    }
                }
                return result;
            },
            deleteProperty(target, prop) {
                if (typeof prop == 'symbol') {
                    return Reflect.deleteProperty(target, prop);
                }
                let triggerChange = false;
                let pathToDelete = '';
                if (!reservedName[prop]) {
                    if (Array.isArray(target)) {
                        if (prop != "length") {
                            if (target.__path) {
                                pathToDelete = target.__path;
                            }
                            pathToDelete += "[" + prop + "]";
                            triggerChange = true;
                        }
                    }
                    else {
                        if (target.__path) {
                            pathToDelete = target.__path + '.';
                        }
                        pathToDelete += prop;
                        triggerChange = true;
                    }
                }
                if (internalAliases[pathToDelete]) {
                    internalAliases[pathToDelete].unbind();
                }
                if (target.hasOwnProperty(prop)) {
                    let oldValue = target[prop];
                    if (oldValue instanceof Effect || oldValue instanceof Signal) {
                        oldValue.destroy();
                    }
                    delete target[prop];
                    if (triggerChange) {
                        clearReservedNames(oldValue);
                        trigger('DELETED', target, null, oldValue, prop);
                    }
                    return true;
                }
                return false;
            },
            defineProperty(target, prop, descriptor) {
                if (typeof prop == 'symbol') {
                    return Reflect.defineProperty(target, prop, descriptor);
                }
                let triggerChange = false;
                let newPath = '';
                if (!reservedName[prop]) {
                    if (Array.isArray(target)) {
                        if (prop != "length") {
                            if (target.__path) {
                                newPath = target.__path;
                            }
                            newPath += "[" + prop + "]";
                            if (!target.hasOwnProperty(prop)) {
                                triggerChange = true;
                            }
                        }
                    }
                    else {
                        if (target.__path) {
                            newPath = target.__path + '.';
                        }
                        newPath += prop;
                        if (!target.hasOwnProperty(prop)) {
                            triggerChange = true;
                        }
                    }
                }
                let result = Reflect.defineProperty(target, prop, descriptor);
                if (triggerChange) {
                    this.avoidUpdate.push(prop);
                    let proxyEl = this.getProxyObject(target, descriptor.value, prop);
                    target[prop] = proxyEl;
                    trigger('CREATED', target, null, proxyEl, prop);
                }
                return result;
            },
            ownKeys(target) {
                let result = Reflect.ownKeys(target);
                for (let i = 0; i < result.length; i++) {
                    let key = result[i];
                    if (typeof key == 'string') {
                        if (reservedName[key]) {
                            result.splice(i, 1);
                            i--;
                        }
                    }
                }
                return result;
            },
        };
        if (onDataChanged) {
            proxyData.callbacks[''] = [onDataChanged];
        }
        const trigger = (type, target, receiver, value, prop, dones = []) => {
            if (dones.includes(proxyData.baseData)) {
                return;
            }
            if (target.__isProxy) {
                return;
            }
            let rootPath;
            if (receiver == null) {
                rootPath = target.__path;
            }
            else {
                rootPath = receiver.__path;
            }
            if (rootPath != "") {
                if (Array.isArray(receiver)) {
                    if (prop && !prop.startsWith("[")) {
                        if (/^[0-9]*$/g.exec(prop)) {
                            rootPath += "[" + prop + "]";
                        }
                        else {
                            rootPath += "." + prop;
                        }
                    }
                    else {
                        rootPath += prop;
                    }
                }
                else {
                    if (prop && !prop.startsWith("[")) {
                        rootPath += ".";
                    }
                    rootPath += prop;
                }
            }
            else {
                rootPath = prop;
            }
            let stacks = [];
            if (proxyData.useHistory) {
                let allStacks = new Error().stack?.split("\n") ?? [];
                for (let i = allStacks.length - 1; i >= 0; i--) {
                    let current = allStacks[i].trim().replace("at ", "");
                    if (current.startsWith("Object.set") || current.startsWith("Proxy.result")) {
                        break;
                    }
                    stacks.push(current);
                }
            }
            dones.push(proxyData.baseData);
            let aliasesDone = [];
            for (let name in proxyData.callbacks) {
                let pathToSend = rootPath;
                if (name !== "") {
                    let regex = new RegExp("^" + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + "(\\.|(\\[)|$)");
                    if (!regex.test(rootPath)) {
                        let regex2 = new RegExp("^" + rootPath.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + "(\\.|(\\[)|$)");
                        if (!regex2.test(name)) {
                            continue;
                        }
                        else {
                            pathToSend = "";
                        }
                    }
                    else {
                        pathToSend = rootPath.replace(regex, "$2");
                    }
                }
                if (name === "" && proxyData.useHistory) {
                    proxyData.history.push({
                        object: JSON.parse(JSON.stringify(proxyData.baseData, jsonReplacer)),
                        trace: stacks.reverse(),
                        action: WatchAction[type],
                        path: pathToSend
                    });
                }
                let cbs = [...proxyData.callbacks[name]];
                for (let cb of cbs) {
                    try {
                        cb(WatchAction[type], pathToSend, value, dones);
                    }
                    catch (e) {
                        if (e != 'impossible')
                            console.error(e);
                    }
                }
                for (let [key, infos] of aliases) {
                    if (!dones.includes(key)) {
                        for (let info of infos) {
                            if (info.name == name) {
                                aliasesDone.push(key);
                                if (target.__path) {
                                    let oldPath = target.__path;
                                    info.fct(type, target, receiver, value, prop, dones);
                                    target.__path = oldPath;
                                }
                                else {
                                    info.fct(type, target, receiver, value, prop, dones);
                                }
                            }
                        }
                    }
                }
            }
            for (let [key, infos] of aliases) {
                if (!dones.includes(key) && !aliasesDone.includes(key)) {
                    for (let info of infos) {
                        let regex = new RegExp("^" + info.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + "(\\.|(\\[)|$)");
                        if (!regex.test(rootPath)) {
                            continue;
                        }
                        let newProp = rootPath.replace(info.name, "");
                        if (newProp.startsWith(".")) {
                            newProp = newProp.slice(1);
                        }
                        if (target.__path) {
                            let oldPath = target.__path;
                            info.fct(type, target, receiver, value, newProp, dones);
                            target.__path = oldPath;
                        }
                        else {
                            info.fct(type, target, receiver, value, newProp, dones);
                        }
                    }
                }
            }
        };
        var realProxy = new Proxy(obj, proxyData);
        proxyData.baseData = obj;
        setProxyPath(realProxy, '');
        return realProxy;
    }
    static is(obj) {
        return typeof obj == 'object' && obj.__isProxy;
    }
    static extract(obj, clearPath = false) {
        if (this.is(obj)) {
            return obj.getTarget(clearPath);
        }
        else {
            if (obj instanceof Object) {
                for (let key in this.__reservedName) {
                    delete obj[key];
                }
            }
        }
        return obj;
    }
    static trigger(type, target) {
        if (this.is(target)) {
            target.__static_trigger(type);
        }
    }
    /**
     * Create a computed variable that will watch any changes
     */
    static computed(fct) {
        const comp = new Computed(fct);
        return comp;
    }
    /**
     * Create an effect variable that will watch any changes
     */
    static effect(fct) {
        const comp = new Effect(fct);
        return comp;
    }
    /**
     * Create an effect variable that will watch any changes inside the fct and trigger the cb on change
     */
    static watch(fct, cb) {
        const comp = new Effect(fct);
        comp.subscribe(cb);
        return comp;
    }
    /**
     * Create a signal variable
     */
    static signal(item, onChange) {
        return new Signal(item, onChange);
    }
}
Watcher.Namespace=`Aventus`;
__as1(_, 'Watcher', Watcher);

let ComputedNoRecomputed=class ComputedNoRecomputed extends Computed {
    init() {
        this.isInit = true;
        Watcher._registering.push(this);
        this._value = this.fct();
        Watcher._registering.splice(Watcher._registering.length - 1, 1);
    }
    computedValue() {
        if (this.isInit)
            this._value = this.fct();
        else
            this.init();
    }
    run() { }
}
ComputedNoRecomputed.Namespace=`Aventus`;
__as1(_, 'ComputedNoRecomputed', ComputedNoRecomputed);

let PressManager=class PressManager {
    static globalConfig = {
        delayDblPress: 250,
        delayLongPress: 700,
        offsetDrag: 20
    };
    static configure(options) {
        this.globalConfig = options;
    }
    static create(options) {
        if (Array.isArray(options.element)) {
            let result = [];
            for (let el of options.element) {
                let cloneOpt = { ...options };
                cloneOpt.element = el;
                result.push(new PressManager(cloneOpt));
            }
            return result;
        }
        else {
            return new PressManager(options);
        }
    }
    static onEvent = new Callback();
    options;
    element;
    delayDblPress;
    delayLongPress;
    nbPress = 0;
    offsetDrag;
    dragDirection;
    state = {
        oneActionTriggered: null,
    };
    startPosition = { x: 0, y: 0 };
    customFcts = {};
    timeoutDblPress = 0;
    timeoutLongPress = 0;
    downEventSaved;
    useDblPress = false;
    stopPropagation = () => true;
    pointersRecord = {};
    functionsBinded = {
        downAction: (e) => { },
        downActionDelay: (e) => { },
        upAction: (e) => { },
        moveAction: (e) => { },
        childPressStart: (e) => { },
        childPressEnd: (e) => { },
        childPressMove: (e) => { }
    };
    /**
     * @param {*} options - The options
     * @param {HTMLElement | HTMLElement[]} options.element - The element to manage
     */
    constructor(options) {
        if (options.element === void 0) {
            throw 'You must provide an element';
        }
        this.offsetDrag = PressManager.globalConfig.offsetDrag !== undefined ? PressManager.globalConfig.offsetDrag : 20;
        this.dragDirection = 'XY';
        this.delayLongPress = PressManager.globalConfig.delayLongPress ?? 700;
        this.delayDblPress = PressManager.globalConfig.delayDblPress ?? 150;
        this.element = options.element;
        this.checkDragConstraint(options);
        this.assignValueOption(options);
        this.options = options;
        this.init();
    }
    /**
     * Get the current element focused by the PressManager
     */
    getElement() {
        return this.element;
    }
    checkDragConstraint(options) {
        if (options.onDrag !== void 0) {
            if (options.onDragStart === void 0) {
                options.onDragStart = (e) => { };
            }
            if (options.onDragEnd === void 0) {
                options.onDragEnd = (e) => { };
            }
        }
        if (options.onDragStart !== void 0) {
            if (options.onDrag === void 0) {
                options.onDrag = (e) => { };
            }
            if (options.onDragEnd === void 0) {
                options.onDragEnd = (e) => { };
            }
        }
        if (options.onDragEnd !== void 0) {
            if (options.onDragStart === void 0) {
                options.onDragStart = (e) => { };
            }
            if (options.onDrag === void 0) {
                options.onDrag = (e) => { };
            }
        }
    }
    assignValueOption(options) {
        if (PressManager.globalConfig.delayDblPress !== undefined) {
            this.delayDblPress = PressManager.globalConfig.delayDblPress;
        }
        if (options.delayDblPress !== undefined) {
            this.delayDblPress = options.delayDblPress;
        }
        if (PressManager.globalConfig.delayLongPress !== undefined) {
            this.delayLongPress = PressManager.globalConfig.delayLongPress;
        }
        if (options.delayLongPress !== undefined) {
            this.delayLongPress = options.delayLongPress;
        }
        if (PressManager.globalConfig.offsetDrag !== undefined) {
            this.offsetDrag = PressManager.globalConfig.offsetDrag;
        }
        if (options.offsetDrag !== undefined) {
            this.offsetDrag = options.offsetDrag;
        }
        if (options.dragDirection !== undefined) {
            this.dragDirection = options.dragDirection;
        }
        if (options.onDblPress !== undefined) {
            this.useDblPress = true;
        }
        if (PressManager.globalConfig.forceDblPress !== undefined) {
            this.useDblPress = PressManager.globalConfig.forceDblPress;
        }
        if (options.forceDblPress !== undefined) {
            this.useDblPress = options.forceDblPress;
        }
        if (typeof PressManager.globalConfig.stopPropagation == 'function') {
            this.stopPropagation = PressManager.globalConfig.stopPropagation;
        }
        else if (options.stopPropagation === false) {
            this.stopPropagation = () => false;
        }
        if (typeof options.stopPropagation == 'function') {
            this.stopPropagation = options.stopPropagation;
        }
        else if (options.stopPropagation === false) {
            this.stopPropagation = () => false;
        }
        if (!options.buttonAllowed)
            options.buttonAllowed = PressManager.globalConfig.buttonAllowed;
        if (!options.buttonAllowed)
            options.buttonAllowed = [0];
        if (!options.onEvent)
            options.onEvent = PressManager.globalConfig.onEvent;
    }
    bindAllFunction() {
        this.functionsBinded.downAction = this.downAction.bind(this);
        this.functionsBinded.downActionDelay = this.downActionDelay.bind(this);
        this.functionsBinded.moveAction = this.moveAction.bind(this);
        this.functionsBinded.upAction = this.upAction.bind(this);
        this.functionsBinded.childPressStart = this.childPressStart.bind(this);
        this.functionsBinded.childPressEnd = this.childPressEnd.bind(this);
        this.functionsBinded.childPressMove = this.childPressMove.bind(this);
    }
    init() {
        this.bindAllFunction();
        this.element.addEventListener("pointerdown", this.functionsBinded.downAction);
        this.element.addEventListener("touchstart", this.functionsBinded.downActionDelay);
        this.element.addEventListener("trigger_pointer_pressstart", this.functionsBinded.childPressStart);
        this.element.addEventListener("trigger_pointer_pressend", this.functionsBinded.childPressEnd);
        this.element.addEventListener("trigger_pointer_pressmove", this.functionsBinded.childPressMove);
    }
    identifyEvent(touch) {
        if ('Touch' in window && touch instanceof Touch)
            return touch.identifier;
        return touch.pointerId;
    }
    registerEvent(ev) {
        if ('TouchEvent' in window && ev instanceof TouchEvent) {
            for (let touch of ev.targetTouches) {
                const id = this.identifyEvent(touch);
                if (this.pointersRecord[id]) {
                    return false;
                }
                this.pointersRecord[id] = ev;
            }
            return true;
        }
        else {
            const id = this.identifyEvent(ev);
            if (this.pointersRecord[id]) {
                return false;
            }
            this.pointersRecord[id] = ev;
            return true;
        }
    }
    unregisterEvent(ev) {
        let result = true;
        if ('TouchEvent' in window && ev instanceof TouchEvent) {
            for (let touch of ev.changedTouches) {
                const id = this.identifyEvent(touch);
                if (!this.pointersRecord[id]) {
                    result = false;
                }
                else {
                    delete this.pointersRecord[id];
                }
            }
        }
        else {
            const id = this.identifyEvent(ev);
            if (!this.pointersRecord[id]) {
                result = false;
            }
            else {
                delete this.pointersRecord[id];
            }
        }
        return result;
    }
    genericDownAction(state, e) {
        this.downEventSaved = e;
        this.startPosition = { x: e.pageX, y: e.pageY };
        if (this.options.onLongPress) {
            this.timeoutLongPress = setTimeout(() => {
                if (!state.oneActionTriggered) {
                    if (this.options.onLongPress) {
                        if (this.options.onLongPress(e, this) !== false) {
                            state.oneActionTriggered = this;
                        }
                    }
                }
            }, this.delayLongPress);
        }
    }
    pointerEventTriggered = false;
    downActionDelay(ev) {
        if (!this.pointerEventTriggered) {
            this.downAction(ev);
        }
        else {
            ev.stopImmediatePropagation();
        }
        setTimeout(() => {
            this.pointerEventTriggered = false;
        }, 0);
    }
    downAction(ev) {
        this.pointerEventTriggered = true;
        const isFirst = Object.values(this.pointersRecord).length == 0;
        if (!this.registerEvent(ev)) {
            if (this.stopPropagation()) {
                ev.stopImmediatePropagation();
            }
            return;
        }
        const e = new NormalizedEvent(ev);
        if (this.options.onEvent) {
            this.options.onEvent(e);
        }
        PressManager.onEvent.trigger(e, this);
        if (e.button != undefined && !this.options.buttonAllowed?.includes(e.button)) {
            this.unregisterEvent(ev);
            return;
        }
        if (this.stopPropagation()) {
            e.stopImmediatePropagation();
        }
        this.customFcts = {};
        if (this.nbPress == 0 && isFirst) {
            this.state.oneActionTriggered = null;
            clearTimeout(this.timeoutDblPress);
        }
        if (isFirst) {
            document.addEventListener("pointerup", this.functionsBinded.upAction);
            document.addEventListener("pointercancel", this.functionsBinded.upAction);
            document.addEventListener("touchend", this.functionsBinded.upAction);
            document.addEventListener("touchcancel", this.functionsBinded.upAction);
            document.addEventListener("pointermove", this.functionsBinded.moveAction);
        }
        this.genericDownAction(this.state, e);
        if (this.options.onPressStart) {
            this.options.onPressStart(e, this);
            this.lastEmitEvent = e;
            // this.emitTriggerFunctionParent("pressstart", e);
        }
        this.emitTriggerFunction("pressstart", e);
    }
    genericUpAction(state, e) {
        clearTimeout(this.timeoutLongPress);
        if (state.oneActionTriggered == this) {
            if (this.options.onDragEnd) {
                this.options.onDragEnd(e, this);
            }
            else if (this.customFcts.src && this.customFcts.onDragEnd) {
                this.customFcts.onDragEnd(e, this.customFcts.src);
            }
        }
        else {
            if (this.useDblPress) {
                this.nbPress++;
                if (this.nbPress == 2) {
                    if (!state.oneActionTriggered) {
                        this.nbPress = 0;
                        if (this.options.onDblPress) {
                            if (this.options.onDblPress(e, this) !== false) {
                                state.oneActionTriggered = this;
                            }
                        }
                    }
                }
                else if (this.nbPress == 1) {
                    this.timeoutDblPress = setTimeout(() => {
                        this.nbPress = 0;
                        if (!state.oneActionTriggered) {
                            if (this.options.onPress) {
                                if (this.options.onPress(e, this) !== false) {
                                    state.oneActionTriggered = this;
                                }
                            }
                        }
                    }, this.delayDblPress);
                }
            }
            else {
                if (!state.oneActionTriggered) {
                    if (this.options.onPress) {
                        if (this.options.onPress(e, this) !== false) {
                            state.oneActionTriggered = this;
                        }
                    }
                }
            }
        }
    }
    upAction(ev) {
        if (!this.unregisterEvent(ev)) {
            if (this.stopPropagation()) {
                ev.stopImmediatePropagation();
            }
            return;
        }
        const e = new NormalizedEvent(ev);
        if (this.options.onEvent) {
            this.options.onEvent(e);
        }
        PressManager.onEvent.trigger(e, this);
        if (this.stopPropagation()) {
            e.stopImmediatePropagation();
        }
        if (Object.values(this.pointersRecord).length == 0) {
            document.removeEventListener("pointerup", this.functionsBinded.upAction);
            document.removeEventListener("pointercancel", this.functionsBinded.upAction);
            document.removeEventListener("touchend", this.functionsBinded.upAction);
            document.removeEventListener("touchcancel", this.functionsBinded.upAction);
            document.removeEventListener("pointermove", this.functionsBinded.moveAction);
        }
        this.genericUpAction(this.state, e);
        if (this.options.onPressEnd) {
            this.options.onPressEnd(e, this);
            this.lastEmitEvent = e;
            // this.emitTriggerFunctionParent("pressend", e);
        }
        this.emitTriggerFunction("pressend", e);
    }
    genericMoveAction(state, e) {
        if (!state.oneActionTriggered) {
            let xDist = e.pageX - this.startPosition.x;
            let yDist = e.pageY - this.startPosition.y;
            let distance = 0;
            if (this.dragDirection == 'XY')
                distance = Math.sqrt(xDist * xDist + yDist * yDist);
            else if (this.dragDirection == 'X')
                distance = Math.abs(xDist);
            else
                distance = Math.abs(yDist);
            if (distance > this.offsetDrag && this.downEventSaved) {
                if (this.options.onDragStart) {
                    if (this.options.onDragStart(this.downEventSaved, this) !== false) {
                        state.oneActionTriggered = this;
                    }
                }
            }
        }
        else if (state.oneActionTriggered == this) {
            if (this.options.onDrag) {
                this.options.onDrag(e, this);
            }
            else if (this.customFcts.src && this.customFcts.onDrag) {
                this.customFcts.onDrag(e, this.customFcts.src);
            }
        }
    }
    moveAction(ev) {
        const e = new NormalizedEvent(ev);
        if (this.options.onEvent) {
            this.options.onEvent(e);
        }
        PressManager.onEvent.trigger(e, this);
        if (this.stopPropagation()) {
            e.stopImmediatePropagation();
        }
        this.genericMoveAction(this.state, e);
        this.lastEmitEvent = e;
        // if(this.options.onDrag) {
        //     this.emitTriggerFunctionParent("pressmove", e);
        this.emitTriggerFunction("pressmove", e);
    }
    childPressStart(e) {
        if (this.lastEmitEvent == e.detail.realEvent)
            return;
        this.genericDownAction(e.detail.state, e.detail.realEvent);
        if (this.options.onPressStart) {
            this.options.onPressStart(e.detail.realEvent, this);
        }
    }
    childPressEnd(e) {
        this.unregisterEvent(e.detail.realEvent.event);
        if (Object.values(this.pointersRecord).length == 0) {
            document.removeEventListener("pointerup", this.functionsBinded.upAction);
            document.removeEventListener("pointercancel", this.functionsBinded.upAction);
            document.removeEventListener("touchend", this.functionsBinded.upAction);
            document.removeEventListener("touchcancel", this.functionsBinded.upAction);
            document.removeEventListener("pointermove", this.functionsBinded.moveAction);
        }
        if (this.lastEmitEvent == e.detail.realEvent)
            return;
        this.genericUpAction(e.detail.state, e.detail.realEvent);
        if (this.options.onPressEnd) {
            this.options.onPressEnd(e.detail.realEvent, this);
        }
    }
    childPressMove(e) {
        if (this.lastEmitEvent == e.detail.realEvent)
            return;
        this.genericMoveAction(e.detail.state, e.detail.realEvent);
    }
    lastEmitEvent;
    emitTriggerFunction(action, e, el) {
        let ev = new CustomEvent("trigger_pointer_" + action, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                state: this.state,
                customFcts: this.customFcts,
                realEvent: e
            }
        });
        this.lastEmitEvent = e;
        if (!el) {
            el = this.element;
        }
        el.dispatchEvent(ev);
    }
    /**
     * Destroy the Press instance byremoving all events
     */
    destroy() {
        if (this.element) {
            this.element.removeEventListener("pointerdown", this.functionsBinded.downAction);
            this.element.removeEventListener("touchstart", this.functionsBinded.downActionDelay);
            this.element.removeEventListener("trigger_pointer_pressstart", this.functionsBinded.childPressStart);
            this.element.removeEventListener("trigger_pointer_pressend", this.functionsBinded.childPressEnd);
            this.element.removeEventListener("trigger_pointer_pressmove", this.functionsBinded.childPressMove);
            document.removeEventListener("pointerup", this.functionsBinded.upAction);
            document.removeEventListener("pointercancel", this.functionsBinded.upAction);
            document.removeEventListener("touchend", this.functionsBinded.upAction);
            document.removeEventListener("touchcancel", this.functionsBinded.upAction);
            document.removeEventListener("pointermove", this.functionsBinded.moveAction);
        }
    }
}
PressManager.Namespace=`Aventus`;
__as1(_, 'PressManager', PressManager);

let Uri=class Uri {
    static prepare(uri) {
        let params = [];
        let i = 0;
        let regexState = uri.replace(/{.*?}/g, (group, position) => {
            group = group.slice(1, -1);
            let splitted = group.split(":");
            let name = splitted[0].trim();
            let type = "string";
            let result = "([^\\/]+)";
            i++;
            if (splitted.length > 1) {
                if (splitted[1].trim() == "number") {
                    result = "([0-9]+)";
                    type = "number";
                }
            }
            params.push({
                name,
                type,
                position: i
            });
            return result;
        });
        regexState = regexState.replace(/\*/g, ".*?").toLowerCase();
        regexState = "^" + regexState + '$';
        return {
            regex: new RegExp(regexState),
            params
        };
    }
    static getParams(from, current) {
        if (typeof from == "string") {
            from = this.prepare(from);
        }
        let matches = from.regex.exec(current.toLowerCase());
        if (matches) {
            let slugs = {};
            for (let param of from.params) {
                if (param.type == "number") {
                    slugs[param.name] = Number(matches[param.position]);
                }
                else {
                    slugs[param.name] = matches[param.position];
                }
            }
            return slugs;
        }
        return null;
    }
    static isActive(from, current) {
        if (typeof from == "string") {
            from = this.prepare(from);
        }
        return from.regex.test(current);
    }
    static normalize(path) {
        const isAbsolute = path.startsWith('/');
        const parts = path.split('/');
        const normalizedParts = [];
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === '..') {
                normalizedParts.pop();
            }
            else if (parts[i] !== '.' && parts[i] !== '') {
                normalizedParts.push(parts[i]);
            }
        }
        let normalizedPath = normalizedParts.join('/');
        if (isAbsolute) {
            normalizedPath = '/' + normalizedPath;
        }
        return normalizedPath;
    }
}
Uri.Namespace=`Aventus`;
__as1(_, 'Uri', Uri);

let State=class State {
    /**
     * Activate a custom state inside a specific manager
     * It ll be a generic state with no information inside exept name
     */
    static async activate(stateName, manager) {
        return await manager.setState(stateName);
    }
    /**
     * Activate this state inside a specific manager
     */
    async activate(manager) {
        return await manager.setState(this);
    }
    onActivate() {
    }
    onInactivate(nextState) {
    }
    async askChange(state, nextState) {
        return true;
    }
}
State.Namespace=`Aventus`;
__as1(_, 'State', State);

let EmptyState=class EmptyState extends State {
    localName;
    constructor(stateName) {
        super();
        this.localName = stateName;
    }
    /**
     * @inheritdoc
     */
    get name() {
        return this.localName;
    }
}
EmptyState.Namespace=`Aventus`;
__as1(_, 'EmptyState', EmptyState);

let StateManager=class StateManager {
    subscribers = {};
    static canBeActivate(statePattern, stateName) {
        let stateInfo = Uri.prepare(statePattern);
        return stateInfo.regex.test(stateName);
    }
    activeState;
    changeStateMutex = new Mutex();
    canChangeStateCbs = [];
    afterStateChanged = new Callback();
    /**
     * Subscribe actions for a state or a state list
     */
    subscribe(statePatterns, callbacks, autoActiveState = true) {
        if (!callbacks.active && !callbacks.inactive && !callbacks.askChange) {
            this._log(`Trying to subscribe to state : ${statePatterns} with no callbacks !`, "warning");
            return;
        }
        if (!Array.isArray(statePatterns)) {
            statePatterns = [statePatterns];
        }
        for (let statePattern of statePatterns) {
            if (!this.subscribers.hasOwnProperty(statePattern)) {
                let res = Uri.prepare(statePattern);
                let isActive = this.activeState !== undefined && res.regex.test(this.activeState.name);
                this.subscribers[statePattern] = {
                    "regex": res.regex,
                    "params": res.params,
                    "callbacks": {
                        "active": [],
                        "inactive": [],
                        "askChange": [],
                    },
                    "isActive": isActive,
                };
            }
            if (callbacks.active) {
                if (!Array.isArray(callbacks.active)) {
                    callbacks.active = [callbacks.active];
                }
                for (let activeFct of callbacks.active) {
                    this.subscribers[statePattern].callbacks.active.push(activeFct);
                    if (this.subscribers[statePattern].isActive && this.activeState && autoActiveState) {
                        let slugs = Uri.getParams(this.subscribers[statePattern], this.activeState.name);
                        if (slugs) {
                            activeFct(this.activeState, slugs);
                        }
                    }
                }
            }
            if (callbacks.inactive) {
                if (!Array.isArray(callbacks.inactive)) {
                    callbacks.inactive = [callbacks.inactive];
                }
                for (let inactiveFct of callbacks.inactive) {
                    this.subscribers[statePattern].callbacks.inactive.push(inactiveFct);
                }
            }
            if (callbacks.askChange) {
                if (!Array.isArray(callbacks.askChange)) {
                    callbacks.askChange = [callbacks.askChange];
                }
                for (let askChangeFct of callbacks.askChange) {
                    this.subscribers[statePattern].callbacks.askChange.push(askChangeFct);
                }
            }
        }
    }
    /**
     *
     */
    activateAfterSubscribe(statePatterns, callbacks) {
        if (!Array.isArray(statePatterns)) {
            statePatterns = [statePatterns];
        }
        for (let statePattern of statePatterns) {
            if (callbacks.active) {
                if (!Array.isArray(callbacks.active)) {
                    callbacks.active = [callbacks.active];
                }
                for (let activeFct of callbacks.active) {
                    if (this.subscribers[statePattern].isActive && this.activeState) {
                        let slugs = Uri.getParams(this.subscribers[statePattern], this.activeState.name);
                        if (slugs) {
                            activeFct(this.activeState, slugs);
                        }
                    }
                }
            }
        }
    }
    /**
     * Unsubscribe actions for a state or a state list
     */
    unsubscribe(statePatterns, callbacks) {
        if (!callbacks.active && !callbacks.inactive && !callbacks.askChange) {
            this._log(`Trying to unsubscribe to state : ${statePatterns} with no callbacks !`, "warning");
            return;
        }
        if (!Array.isArray(statePatterns)) {
            statePatterns = [statePatterns];
        }
        for (let statePattern of statePatterns) {
            if (this.subscribers[statePattern]) {
                if (callbacks.active) {
                    if (!Array.isArray(callbacks.active)) {
                        callbacks.active = [callbacks.active];
                    }
                    for (let activeFct of callbacks.active) {
                        let index = this.subscribers[statePattern].callbacks.active.indexOf(activeFct);
                        if (index !== -1) {
                            this.subscribers[statePattern].callbacks.active.splice(index, 1);
                        }
                    }
                }
                if (callbacks.inactive) {
                    if (!Array.isArray(callbacks.inactive)) {
                        callbacks.inactive = [callbacks.inactive];
                    }
                    for (let inactiveFct of callbacks.inactive) {
                        let index = this.subscribers[statePattern].callbacks.inactive.indexOf(inactiveFct);
                        if (index !== -1) {
                            this.subscribers[statePattern].callbacks.inactive.splice(index, 1);
                        }
                    }
                }
                if (callbacks.askChange) {
                    if (!Array.isArray(callbacks.askChange)) {
                        callbacks.askChange = [callbacks.askChange];
                    }
                    for (let askChangeFct of callbacks.askChange) {
                        let index = this.subscribers[statePattern].callbacks.askChange.indexOf(askChangeFct);
                        if (index !== -1) {
                            this.subscribers[statePattern].callbacks.askChange.splice(index, 1);
                        }
                    }
                }
                if (this.subscribers[statePattern].callbacks.active.length === 0 &&
                    this.subscribers[statePattern].callbacks.inactive.length === 0 &&
                    this.subscribers[statePattern].callbacks.askChange.length === 0) {
                    delete this.subscribers[statePattern];
                }
            }
        }
    }
    onAfterStateChanged(cb) {
        this.afterStateChanged.add(cb);
    }
    offAfterStateChanged(cb) {
        this.afterStateChanged.remove(cb);
    }
    assignDefaultState(stateName) {
        return new EmptyState(stateName);
    }
    canChangeState(cb) {
        this.canChangeStateCbs.push(cb);
    }
    /**
     * Activate a current state
     */
    async setState(state) {
        let result = await this.changeStateMutex.safeRunLastAsync(async () => {
            let stateToUse;
            if (typeof state == "string") {
                stateToUse = this.assignDefaultState(state);
            }
            else {
                stateToUse = state;
            }
            if (!stateToUse) {
                this._log("state is undefined", "error");
                this.changeStateMutex.release();
                return false;
            }
            for (let cb of this.canChangeStateCbs) {
                if (!(await cb(stateToUse))) {
                    return false;
                }
            }
            let canChange = true;
            if (this.activeState) {
                let activeToInactive = [];
                let inactiveToActive = [];
                let triggerActive = [];
                canChange = await this.activeState.askChange(this.activeState, stateToUse);
                if (canChange) {
                    for (let statePattern in this.subscribers) {
                        let subscriber = this.subscribers[statePattern];
                        if (subscriber.isActive) {
                            let clone = [...subscriber.callbacks.askChange];
                            let currentSlug = Uri.getParams(subscriber, this.activeState.name);
                            if (currentSlug) {
                                for (let i = 0; i < clone.length; i++) {
                                    let askChange = clone[i];
                                    if (!await askChange(this.activeState, stateToUse, currentSlug)) {
                                        canChange = false;
                                        break;
                                    }
                                }
                            }
                            let slugs = Uri.getParams(subscriber, stateToUse.name);
                            if (slugs === null) {
                                activeToInactive.push(subscriber);
                            }
                            else {
                                triggerActive.push({
                                    subscriber: subscriber,
                                    params: slugs
                                });
                            }
                        }
                        else {
                            let slugs = Uri.getParams(subscriber, stateToUse.name);
                            if (slugs) {
                                inactiveToActive.push({
                                    subscriber,
                                    params: slugs
                                });
                            }
                        }
                        if (!canChange) {
                            break;
                        }
                    }
                }
                if (canChange) {
                    const oldState = this.activeState;
                    this.activeState = stateToUse;
                    oldState.onInactivate(stateToUse);
                    for (let subscriber of activeToInactive) {
                        subscriber.isActive = false;
                        let oldSlug = Uri.getParams(subscriber, oldState.name);
                        if (oldSlug) {
                            let oldSlugNotNull = oldSlug;
                            let callbacks = [...subscriber.callbacks.inactive];
                            for (let callback of callbacks) {
                                callback(oldState, stateToUse, oldSlugNotNull);
                            }
                        }
                    }
                    for (let trigger of triggerActive) {
                        let callbacks = [...trigger.subscriber.callbacks.active];
                        for (let callback of callbacks) {
                            callback(stateToUse, trigger.params);
                        }
                    }
                    for (let trigger of inactiveToActive) {
                        trigger.subscriber.isActive = true;
                        let callbacks = [...trigger.subscriber.callbacks.active];
                        for (let callback of callbacks) {
                            callback(stateToUse, trigger.params);
                        }
                    }
                    stateToUse.onActivate();
                }
            }
            else {
                this.activeState = stateToUse;
                for (let key in this.subscribers) {
                    let slugs = Uri.getParams(this.subscribers[key], stateToUse.name);
                    if (slugs) {
                        let slugsNotNull = slugs;
                        this.subscribers[key].isActive = true;
                        let callbacks = [...this.subscribers[key].callbacks.active];
                        for (let callback of callbacks) {
                            callback(stateToUse, slugsNotNull);
                        }
                    }
                }
                stateToUse.onActivate();
            }
            this.afterStateChanged.trigger();
            return true;
        });
        return result ?? false;
    }
    getState() {
        return this.activeState;
    }
    /**
     * Check if a state is in the subscribers and active, return true if it is, false otherwise
     */
    isStateActive(statePattern) {
        return Uri.isActive(statePattern, this.activeState?.name ?? '');
    }
    /**
     * Get slugs information for the current state, return null if state isn't active
     */
    getStateSlugs(statePattern) {
        return Uri.getParams(statePattern, this.activeState?.name ?? '');
    }
    // 0 = error only / 1 = errors and warning / 2 = error, warning and logs (not implemented)
    logLevel() {
        return 0;
    }
    _log(msg, type) {
        if (type === "error") {
            console.error(msg);
        }
        else if (type === "warning" && this.logLevel() > 0) {
            console.warn(msg);
        }
        else if (type === "info" && this.logLevel() > 1) {
            console.log(msg);
        }
    }
}
StateManager.Namespace=`Aventus`;
__as1(_, 'StateManager', StateManager);

let TemplateContext=class TemplateContext {
    data = {};
    comp;
    computeds = [];
    watch;
    registry;
    isDestroyed = false;
    constructor(component, data = {}, parentContext, registry) {
        this.comp = component;
        this.registry = registry;
        this.watch = Watcher.get({});
        let that = this;
        for (let key in data) {
            if (data[key].__isProxy) {
                Object.defineProperty(this.data, key, {
                    get() {
                        return data[key];
                    }
                });
            }
            else {
                this.watch[key] = data[key];
                Object.defineProperty(this.data, key, {
                    get() {
                        return that.watch[key];
                    }
                });
            }
        }
        if (parentContext) {
            const descriptors = Object.getOwnPropertyDescriptors(parentContext.data);
            for (let name in descriptors) {
                Object.defineProperty(this.data, name, {
                    get() {
                        return parentContext.data[name];
                    }
                });
            }
        }
    }
    print(value) {
        return value == null ? "" : value + "";
    }
    registerIndex() {
        let name = "index";
        let i = 0;
        let fullName = name + i;
        while (this.watch[fullName] !== undefined) {
            i++;
            fullName = name + i;
        }
        return fullName;
    }
    registerLoop(dataName, _indexValue, _indexName, indexName, itemName, onThis) {
        this.watch[_indexName] = _indexValue;
        let getItems;
        let mustBeRecomputed = /if|switch|\?|\[.+?\]/g.test(dataName);
        let _class = mustBeRecomputed ? Computed : ComputedNoRecomputed;
        if (!onThis) {
            getItems = new _class(() => {
                return getValueFromObject(dataName, this.data);
            });
        }
        else {
            dataName = dataName.replace(/^this\./, '');
            getItems = new _class(() => {
                return getValueFromObject(dataName, this.comp);
            });
        }
        let getIndex = new ComputedNoRecomputed(() => {
            let items = getItems.value;
            if (!items)
                throw 'impossible';
            let keys = Object.keys(items);
            let index = keys[_getIndex.value];
            if (/^[0-9]+$/g.test(index))
                return Number(index);
            return index;
        });
        let getItem = new ComputedNoRecomputed(() => {
            let items = getItems.value;
            if (!items)
                throw 'impossible';
            let keys = Object.keys(items);
            let index = keys[_getIndex.value];
            let element = items[index];
            if (element === undefined && (Array.isArray(items) || !items)) {
                if (this.registry) {
                    let indexNb = Number(_getIndex.value);
                    if (!isNaN(indexNb)) {
                        this.registry.templates[indexNb].destructor();
                        this.registry.templates.splice(indexNb, 1);
                        for (let i = indexNb; i < this.registry.templates.length; i++) {
                            this.registry.templates[i].context.decreaseIndex(_indexName);
                        }
                    }
                }
            }
            return element;
        });
        let _getIndex = new ComputedNoRecomputed(() => {
            return this.watch[_indexName];
        });
        this.computeds.push(getIndex);
        this.computeds.push(getItem);
        this.computeds.push(_getIndex);
        if (itemName) {
            Object.defineProperty(this.data, itemName, {
                get() {
                    return getItem.value;
                }
            });
        }
        if (indexName) {
            Object.defineProperty(this.data, indexName, {
                get() {
                    return getIndex.value;
                }
            });
        }
    }
    updateIndex(newIndex, _indexName) {
        // let items: any[] | {};
        // if(!dataName.startsWith("this.")) {
        //     let comp = new Computed(() => {
        //         return getValueFromObject(dataName, this.data);
        //     });
        //     fullName = dataName.replace(/^this\./, '');
        //     items = getValueFromObject(fullName, this.comp);
        // if(Array.isArray(items)) {
        //     let regex = new RegExp("^(" + fullName.replace(/\./g, "\\.") + ")\\[(\\d+?)\\]");
        //     for(let computed of computeds) {
        //         for(let cb of computed.callbacks) {
        //             cb.path = cb.path.replace(regex, "$1[" + newIndex + "]");
        //     let oldKey = Object.keys(items)[this.watch[_indexName]]
        //     let newKey = Object.keys(items)[newIndex]
        //     let regex = new RegExp("^(" + fullName.replace(/\./g, "\\.") + "\\.)(" + oldKey + ")($|\\.)");
        //     for (let computed of computeds) {
        //         for (let cb of computed.callbacks) {
        //             cb.path = cb.path.replace(regex, "$1" + newKey + "$3")
        this.watch[_indexName] = newIndex;
    }
    increaseIndex(_indexName) {
        this.updateIndex(this.watch[_indexName] + 1, _indexName);
    }
    decreaseIndex(_indexName) {
        this.updateIndex(this.watch[_indexName] - 1, _indexName);
    }
    destructor() {
        this.isDestroyed = true;
        for (let computed of this.computeds) {
            computed.destroy();
        }
        this.computeds = [];
    }
    registerWatch(name, value) {
        let that = this;
        that.watch[name] = value;
        Object.defineProperty(that.data, name, {
            get() {
                return that.watch[name];
            }
        });
    }
    updateWatch(name, value, dones) {
        if (Watcher.is(this.watch[name])) {
            this.watch[name].__injectedDones(dones);
        }
        this.watch[name] = value;
    }
    normalizePath(path) {
        path = path.replace(/^this\./, '');
        const regex = /\[(.*?)\]/g;
        let m;
        while ((m = regex.exec(path)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            let name = m[1];
            let result = getValueFromObject(name, this.data);
            if (result !== undefined) {
                path = path.replace(m[0], `[${result}]`);
            }
        }
        return path;
    }
    getValueFromItem(name) {
        if (!name)
            return undefined;
        let result = getValueFromObject(name, this.data);
        if (result !== undefined) {
            return result;
        }
        result = getValueFromObject(name, this.comp);
        if (result !== undefined) {
            return result;
        }
        return undefined;
    }
    setValueToItem(name, value) {
        setValueToObject(name, this.comp, value);
    }
}
TemplateContext.Namespace=`Aventus`;
__as1(_, 'TemplateContext', TemplateContext);

let TemplateInstance=class TemplateInstance {
    context;
    content;
    actions;
    component;
    _components = {};
    firstRenderUniqueCb = {};
    firstRenderCb = [];
    firstChild;
    lastChild;
    computeds = [];
    renderingComputeds = [];
    loopRegisteries = {};
    loops = [];
    ifs = [];
    isDestroyed = false;
    constructor(component, content, actions, loops, ifs, context) {
        this.component = component;
        this.content = content;
        this.actions = actions;
        this.ifs = ifs;
        this.loops = loops;
        this.context = context ? context : new TemplateContext(component);
        this.firstChild = content.firstElementChild;
        this.lastChild = content.lastElementChild;
        this.selectElements();
        this.transformActionsListening();
    }
    render() {
        this.updateContext();
        this.bindEvents();
        for (let cb of this.firstRenderCb) {
            cb();
        }
        for (let key in this.firstRenderUniqueCb) {
            this.firstRenderUniqueCb[key]();
        }
        this.renderSubTemplate();
    }
    destructor() {
        this.isDestroyed = true;
        for (let name in this.loopRegisteries) {
            let register = this.loopRegisteries[name];
            for (let item of register.templates) {
                item.destructor();
            }
            for (let item of register.computeds) {
                item.destroy();
            }
            if (register.unsub) {
                register.unsub();
            }
        }
        this.loopRegisteries = {};
        this.context.destructor();
        for (let computed of this.computeds) {
            computed.destroy();
        }
        for (let computed of this.renderingComputeds) {
            computed.destroy();
        }
        this.computeds = [];
        this.removeFromDOM();
    }
    removeFromDOM(avoidTrigger = false) {
        if (avoidTrigger) {
            let node = this.firstChild;
            while (node && node != this.lastChild) {
                let next = node.nextElementSibling;
                node.parentNode?.removeChild(node);
                node = next;
            }
            this.lastChild?.parentNode?.removeChild(this.lastChild);
        }
        else {
            let node = this.firstChild;
            while (node && node != this.lastChild) {
                let next = node.nextElementSibling;
                node.remove();
                node = next;
            }
            this.lastChild?.remove();
        }
    }
    selectElements() {
        this._components = {};
        let idEls = Array.from(this.content.querySelectorAll('[_id]'));
        for (let idEl of idEls) {
            let id = idEl.attributes['_id'].value;
            if (!this._components[id]) {
                this._components[id] = [];
            }
            this._components[id].push(idEl);
        }
        if (this.actions.elements) {
            for (let element of this.actions.elements) {
                let components = [];
                for (let id of element.ids) {
                    if (this._components[id]) {
                        components = [...components, ...this._components[id]];
                    }
                }
                if (element.isArray) {
                    setValueToObject(element.name, this.component, components);
                }
                else if (components[0]) {
                    setValueToObject(element.name, this.component, components[0]);
                }
            }
        }
    }
    updateContext() {
        if (this.actions.contextEdits) {
            for (let contextEdit of this.actions.contextEdits) {
                this.renderContextEdit(contextEdit);
            }
        }
    }
    renderContextEdit(edit) {
        let _class = edit.once ? ComputedNoRecomputed : Computed;
        let computed = new _class(() => {
            try {
                return edit.fct(this.context);
            }
            catch (e) {
            }
            return {};
        });
        computed.subscribe((action, path, value, dones) => {
            for (let key in computed.value) {
                let newValue = computed.value[key];
                this.context.updateWatch(key, newValue, dones);
            }
        });
        this.computeds.push(computed);
        for (let key in computed.value) {
            this.context.registerWatch(key, computed.value[key]);
        }
    }
    bindEvents() {
        if (this.actions.events) {
            for (let event of this.actions.events) {
                this.bindEvent(event);
            }
        }
        if (this.actions.pressEvents) {
            for (let event of this.actions.pressEvents) {
                this.bindPressEvent(event);
            }
        }
    }
    bindEvent(event) {
        if (!this._components[event.id]) {
            return;
        }
        if (event.isCallback) {
            for (let el of this._components[event.id]) {
                let cb = getValueFromObject(event.eventName, el);
                cb?.add((...args) => {
                    try {
                        return event.fct(this.context, args);
                    }
                    catch (e) {
                        console.error(e);
                    }
                });
            }
        }
        else {
            for (let el of this._components[event.id]) {
                el.addEventListener(event.eventName, (e) => {
                    try {
                        event.fct(e, this.context);
                    }
                    catch (e) {
                        console.error(e);
                    }
                });
            }
        }
    }
    bindPressEvent(event) {
        let id = event['id'];
        if (id && this._components[id]) {
            let clone = {};
            for (let temp in event) {
                if (temp != 'id') {
                    if (event[temp] instanceof Function) {
                        clone[temp] = (e, pressInstance) => { event[temp](e, pressInstance, this.context); };
                    }
                    else {
                        clone[temp] = event[temp];
                    }
                }
            }
            clone.element = this._components[id];
            PressManager.create(clone);
        }
    }
    transformActionsListening() {
        if (this.actions.content) {
            for (let name in this.actions.content) {
                this.transformChangeAction(name, this.actions.content[name]);
            }
        }
        if (this.actions.injection) {
            for (let injection of this.actions.injection) {
                this.transformInjectionAction(injection);
            }
        }
        if (this.actions.bindings) {
            for (let binding of this.actions.bindings) {
                this.transformBindigAction(binding);
            }
        }
    }
    transformChangeAction(name, change) {
        const [id, attr] = name.split("°");
        if (!this._components[id])
            return;
        let apply = () => { };
        if (attr == "@HTML") {
            apply = () => {
                let value = this.context.print(computed.value);
                for (const el of this._components[id])
                    el.innerHTML = value;
            };
        }
        else {
            apply = () => {
                let value = this.context.print(computed.value);
                if (value === "false") {
                    for (const el of this._components[id]) {
                        el.removeAttribute(attr);
                    }
                }
                else {
                    for (const el of this._components[id]) {
                        el.setAttribute(attr, value);
                    }
                }
            };
        }
        let _class = change.once ? ComputedNoRecomputed : Computed;
        let computed = new _class(() => {
            try {
                return change.fct(this.context);
            }
            catch (e) {
                if (e instanceof TypeError && e.message.includes("undefined")) {
                    if (computed instanceof ComputedNoRecomputed) {
                        computed.isInit = false;
                    }
                }
                else {
                    console.error(e);
                }
            }
            return "";
        });
        let timeout;
        computed.subscribe((action, path, value, dones) => {
            clearTimeout(timeout);
            // add timeout to group change that append on the same frame (for example index update)
            timeout = setTimeout(() => {
                if (computed.isDestroy)
                    return;
                apply();
            });
        });
        this.renderingComputeds.push(computed);
        this.firstRenderUniqueCb[name] = () => {
            apply();
        };
    }
    transformInjectionAction(injection) {
        if (!this._components[injection.id])
            return;
        let _class = injection.once ? ComputedNoRecomputed : Computed;
        let computed = new _class(() => {
            try {
                return injection.inject(this.context);
            }
            catch (e) {
                if (e instanceof TypeError && e.message.includes("undefined")) {
                    if (computed instanceof ComputedNoRecomputed) {
                        computed.isInit = false;
                    }
                }
                else {
                    console.error(e);
                }
            }
        });
        this.computeds.push(computed);
        computed.subscribe((action, path, value, dones) => {
            for (const el of this._components[injection.id]) {
                if (el instanceof WebComponent && el.__watch && Object.hasOwn(el.__watch, injection.injectionName)) {
                    el.__watch.__injectedDones(dones);
                }
                el[injection.injectionName] = computed.value;
            }
        });
        this.firstRenderCb.push(() => {
            for (const el of this._components[injection.id]) {
                el[injection.injectionName] = computed.value;
            }
        });
    }
    transformBindigAction(binding) {
        let isLocalChange = false;
        let _class = binding.once ? ComputedNoRecomputed : Computed;
        let computed = new _class(() => {
            try {
                return binding.inject(this.context);
            }
            catch (e) {
                if (e instanceof TypeError && e.message.includes("undefined")) {
                    if (computed instanceof ComputedNoRecomputed) {
                        computed.isInit = false;
                    }
                }
                else {
                    console.error(e);
                }
            }
        });
        this.computeds.push(computed);
        computed.subscribe((action, path, value, dones) => {
            if (isLocalChange)
                return;
            for (const el of this._components[binding.id]) {
                if (el instanceof WebComponent && el.__watch && Object.hasOwn(el.__watch, binding.injectionName)) {
                    el.__watch.__injectedDones(dones);
                }
                el[binding.injectionName] = computed.value;
            }
        });
        this.firstRenderCb.push(() => {
            for (const el of this._components[binding.id]) {
                el[binding.injectionName] = computed.value;
            }
        });
        if (binding.isCallback) {
            this.firstRenderCb.push(() => {
                for (var el of this._components[binding.id]) {
                    for (let fct of binding.eventNames) {
                        let cb = getValueFromObject(fct, el);
                        cb?.add((value) => {
                            let valueToSet = getValueFromObject(binding.injectionName, el);
                            isLocalChange = true;
                            binding.extract(this.context, valueToSet);
                            isLocalChange = false;
                        });
                    }
                }
            });
        }
        else {
            this.firstRenderCb.push(() => {
                for (var el of this._components[binding.id]) {
                    for (let fct of binding.eventNames) {
                        el.addEventListener(fct, (e) => {
                            let valueToSet = getValueFromObject(binding.injectionName, e.target);
                            isLocalChange = true;
                            binding.extract(this.context, valueToSet);
                            isLocalChange = false;
                        });
                    }
                }
            });
        }
    }
    renderSubTemplate() {
        for (let loop of this.loops) {
            this.renderLoop(loop);
        }
        for (let _if of this.ifs) {
            this.renderIf(_if);
        }
    }
    renderLoop(loop) {
        if (loop.func) {
            this.renderLoopComplex(loop);
        }
        else if (loop.simple) {
            this.renderLoopSimple(loop, loop.simple);
        }
    }
    resetLoopComplex(anchorId) {
        if (this.loopRegisteries[anchorId]) {
            for (let item of this.loopRegisteries[anchorId].templates) {
                item.destructor();
            }
            for (let item of this.loopRegisteries[anchorId].computeds) {
                item.destroy();
            }
        }
        this.loopRegisteries[anchorId] = {
            templates: [],
            computeds: [],
        };
    }
    renderLoopComplex(loop) {
        if (!loop.func)
            return;
        let fctsTemp = loop.func.bind(this.component)(this.context);
        let fcts = {
            apply: fctsTemp.apply,
            condition: fctsTemp.condition,
            transform: fctsTemp.transform ?? (() => { })
        };
        this.resetLoopComplex(loop.anchorId);
        let computedsCondition = [];
        let alreadyRecreated = false;
        const createComputedCondition = () => {
            let compCondition = new Computed(() => {
                return fcts.condition();
            });
            compCondition.value;
            compCondition.subscribe((action, path, value) => {
                if (!alreadyRecreated) {
                    alreadyRecreated = true;
                    this.renderLoopComplex(loop);
                }
            });
            computedsCondition.push(compCondition);
            this.loopRegisteries[loop.anchorId].computeds.push(compCondition);
            return compCondition;
        };
        let result = [];
        let compCondition = createComputedCondition();
        while (compCondition.value) {
            result.push(fcts.apply());
            fcts.transform();
            compCondition = createComputedCondition();
        }
        let anchor = this._components[loop.anchorId][0];
        for (let i = 0; i < result.length; i++) {
            let context = new TemplateContext(this.component, result[i], this.context, this.loopRegisteries[loop.anchorId]);
            let content = loop.template.template?.content.cloneNode(true);
            document.adoptNode(content);
            customElements.upgrade(content);
            let actions = loop.template.actions;
            let instance = new TemplateInstance(this.component, content, actions, loop.template.loops, loop.template.ifs, context);
            instance.render();
            anchor.parentNode?.insertBefore(instance.content, anchor);
            this.loopRegisteries[loop.anchorId].templates.push(instance);
        }
    }
    resetLoopSimple(anchorId, basePath) {
        let register = this.loopRegisteries[anchorId];
        if (register?.unsub) {
            register.unsub();
        }
        this.resetLoopComplex(anchorId);
    }
    renderLoopSimple(loop, simple) {
        let onThis = simple.data.startsWith("this.");
        let basePath = this.context.normalizePath(simple.data);
        this.resetLoopSimple(loop.anchorId, basePath);
        let getElements = () => this.context.getValueFromItem(basePath);
        let elements = getElements();
        if (!elements) {
            let currentPath = basePath;
            while (currentPath != '' && !elements) {
                let splittedPath = currentPath.split(".");
                splittedPath.pop();
                currentPath = splittedPath.join(".");
                elements = this.context.getValueFromItem(currentPath);
            }
            if (!elements && onThis) {
                const splittedPath = basePath.split(".");
                const firstPart = splittedPath.length > 0 ? splittedPath[0] : null;
                if (firstPart && this.component.__signals[firstPart]) {
                    elements = this.component.__signals[firstPart];
                }
                else {
                    elements = this.component.__watch;
                }
            }
            if (!elements || !(elements.__isProxy || elements instanceof Signal)) {
                debugger;
            }
            const subTemp = (action, path, value) => {
                if (basePath.startsWith(path) || path == "*") {
                    elements.unsubscribe(subTemp);
                    this.renderLoopSimple(loop, simple);
                    return;
                }
            };
            elements.subscribe(subTemp);
            return;
        }
        let indexName = this.context.registerIndex();
        let keys = Object.keys(elements);
        if (elements.__isProxy) {
            let regexArray = new RegExp("^\\[(\\d+?)\\]$");
            let regexObject = new RegExp("^([^\\.]*)$");
            let sub = (action, path, value) => {
                if (path == "") {
                    this.renderLoopSimple(loop, simple);
                    return;
                }
                if (action == WatchAction.UPDATED) {
                    return;
                }
                let index = undefined;
                regexArray.lastIndex = 0;
                regexObject.lastIndex = 0;
                let resultArray = regexArray.exec(path);
                if (resultArray) {
                    index = Number(resultArray[1]);
                }
                else {
                    let resultObject = regexObject.exec(path);
                    if (resultObject) {
                        let oldKey = resultObject[1];
                        if (action == WatchAction.CREATED) {
                            keys = Object.keys(getElements());
                            index = keys.indexOf(oldKey);
                        }
                        else if (action == WatchAction.DELETED) {
                            index = keys.indexOf(oldKey);
                            keys = Object.keys(getElements());
                        }
                    }
                }
                if (index !== undefined) {
                    let registry = this.loopRegisteries[loop.anchorId];
                    if (action == WatchAction.CREATED) {
                        let context = new TemplateContext(this.component, {}, this.context, registry);
                        context.registerLoop(basePath, index, indexName, simple.index, simple.item, onThis);
                        let content = loop.template.template?.content.cloneNode(true);
                        document.adoptNode(content);
                        customElements.upgrade(content);
                        let actions = loop.template.actions;
                        let instance = new TemplateInstance(this.component, content, actions, loop.template.loops, loop.template.ifs, context);
                        instance.render();
                        let anchor;
                        if (index < registry.templates.length) {
                            anchor = registry.templates[index].firstChild;
                        }
                        else {
                            anchor = this._components[loop.anchorId][0];
                        }
                        anchor?.parentNode?.insertBefore(instance.content, anchor);
                        registry.templates.splice(index, 0, instance);
                        for (let i = index + 1; i < registry.templates.length; i++) {
                            registry.templates[i].context.increaseIndex(indexName);
                        }
                    }
                    else if (action == WatchAction.DELETED) {
                        registry.templates[index].destructor();
                        registry.templates.splice(index, 1);
                        for (let i = index; i < registry.templates.length; i++) {
                            registry.templates[i].context.decreaseIndex(indexName);
                        }
                    }
                }
            };
            this.loopRegisteries[loop.anchorId].unsub = () => {
                elements.unsubscribe(sub);
            };
            elements.subscribe(sub);
        }
        let anchor = this._components[loop.anchorId][0];
        for (let i = 0; i < keys.length; i++) {
            let context = new TemplateContext(this.component, {}, this.context, this.loopRegisteries[loop.anchorId]);
            context.registerLoop(basePath, i, indexName, simple.index, simple.item, onThis);
            let content = loop.template.template?.content.cloneNode(true);
            document.adoptNode(content);
            customElements.upgrade(content);
            let actions = loop.template.actions;
            let instance = new TemplateInstance(this.component, content, actions, loop.template.loops, loop.template.ifs, context);
            instance.render();
            anchor.parentNode?.insertBefore(instance.content, anchor);
            this.loopRegisteries[loop.anchorId].templates.push(instance);
        }
    }
    renderIf(_if) {
        // this.renderIfMemory(_if);
        this.renderIfRecreate(_if);
    }
    renderIfMemory(_if) {
        let computeds = [];
        let instances = [];
        if (!this._components[_if.anchorId] || this._components[_if.anchorId].length == 0)
            return;
        let anchor = this._components[_if.anchorId][0];
        let currentActive = -1;
        const calculateActive = () => {
            let newActive = -1;
            for (let i = 0; i < _if.parts.length; i++) {
                if (computeds[i].value) {
                    newActive = i;
                    break;
                }
            }
            if (newActive == currentActive) {
                return;
            }
            if (currentActive != -1) {
                let instance = instances[currentActive];
                let node = instance.firstChild;
                while (node && node != instance.lastChild) {
                    let next = node.nextElementSibling;
                    instance.content.appendChild(node);
                    node = next;
                }
                if (instance.lastChild)
                    instance.content.appendChild(instance.lastChild);
            }
            currentActive = newActive;
            if (instances[currentActive])
                anchor.parentNode?.insertBefore(instances[currentActive].content, anchor);
        };
        for (let i = 0; i < _if.parts.length; i++) {
            const part = _if.parts[i];
            let _class = part.once ? ComputedNoRecomputed : Computed;
            let computed = new _class(() => {
                return part.condition(this.context);
            });
            computeds.push(computed);
            computed.subscribe(() => {
                calculateActive();
            });
            this.computeds.push(computed);
            let context = new TemplateContext(this.component, {}, this.context);
            let content = part.template.template?.content.cloneNode(true);
            document.adoptNode(content);
            customElements.upgrade(content);
            let actions = part.template.actions;
            let instance = new TemplateInstance(this.component, content, actions, part.template.loops, part.template.ifs, context);
            instances.push(instance);
            instance.render();
        }
        calculateActive();
    }
    renderIfRecreate(_if) {
        let computeds = [];
        if (!this._components[_if.anchorId] || this._components[_if.anchorId].length == 0)
            return;
        let anchor = this._components[_if.anchorId][0];
        let currentActive = undefined;
        let currentActiveNb = -1;
        const createContext = () => {
            if (currentActiveNb < 0 || currentActiveNb > _if.parts.length - 1) {
                currentActive = undefined;
                return;
            }
            const part = _if.parts[currentActiveNb];
            let context = new TemplateContext(this.component, {}, this.context);
            let content = part.template.template?.content.cloneNode(true);
            document.adoptNode(content);
            customElements.upgrade(content);
            let actions = part.template.actions;
            let instance = new TemplateInstance(this.component, content, actions, part.template.loops, part.template.ifs, context);
            currentActive = instance;
            instance.render();
            anchor.parentNode?.insertBefore(currentActive.content, anchor);
        };
        for (let i = 0; i < _if.parts.length; i++) {
            const part = _if.parts[i];
            let _class = part.once ? ComputedNoRecomputed : Computed;
            let computed = new _class(() => {
                return part.condition(this.context);
            });
            computeds.push(computed);
            computed.subscribe(() => {
                calculateActive();
            });
            this.computeds.push(computed);
        }
        const calculateActive = () => {
            let newActive = -1;
            for (let i = 0; i < _if.parts.length; i++) {
                if (computeds[i].value) {
                    newActive = i;
                    break;
                }
            }
            if (newActive == currentActiveNb) {
                return;
            }
            if (currentActive) {
                currentActive.destructor();
            }
            currentActiveNb = newActive;
            createContext();
        };
        calculateActive();
    }
}
TemplateInstance.Namespace=`Aventus`;
__as1(_, 'TemplateInstance', TemplateInstance);

let Template=class Template {
    static validatePath(path, pathToCheck) {
        if (pathToCheck.startsWith(path)) {
            return true;
        }
        return false;
    }
    cst;
    constructor(component) {
        this.cst = component;
    }
    htmlParts = [];
    setHTML(data) {
        this.htmlParts.push(data);
    }
    generateTemplate() {
        this.template = document.createElement('template');
        let currentHTML = "<slot></slot>";
        let previousSlots = {
            default: '<slot></slot>'
        };
        for (let htmlPart of this.htmlParts) {
            for (let blockName in htmlPart.blocks) {
                if (!previousSlots.hasOwnProperty(blockName)) {
                    throw "can't found slot with name " + blockName;
                }
                currentHTML = currentHTML.replace(previousSlots[blockName], htmlPart.blocks[blockName]);
            }
            for (let slotName in htmlPart.slots) {
                previousSlots[slotName] = htmlPart.slots[slotName];
            }
        }
        this.template.innerHTML = currentHTML;
    }
    /**
     * Used by the for loop and the if
     * @param template
     */
    setTemplate(template) {
        this.template = document.createElement('template');
        this.template.innerHTML = template;
    }
    template;
    actions = {};
    setActions(actions) {
        if (!this.actions) {
            this.actions = actions;
        }
        else {
            if (actions.elements) {
                if (!this.actions.elements) {
                    this.actions.elements = [];
                }
                this.actions.elements = [...actions.elements, ...this.actions.elements];
            }
            if (actions.events) {
                if (!this.actions.events) {
                    this.actions.events = [];
                }
                this.actions.events = [...actions.events, ...this.actions.events];
            }
            if (actions.pressEvents) {
                if (!this.actions.pressEvents) {
                    this.actions.pressEvents = [];
                }
                this.actions.pressEvents = [...actions.pressEvents, ...this.actions.pressEvents];
            }
            if (actions.content) {
                if (!this.actions.content) {
                    this.actions.content = actions.content;
                }
                else {
                    for (let contextProp in actions.content) {
                        if (!this.actions.content[contextProp]) {
                            this.actions.content[contextProp] = actions.content[contextProp];
                        }
                        else {
                            throw 'this should be impossible';
                        }
                    }
                }
            }
            if (actions.injection) {
                if (!this.actions.injection) {
                    this.actions.injection = actions.injection;
                }
                else {
                    for (let contextProp in actions.injection) {
                        if (!this.actions.injection[contextProp]) {
                            this.actions.injection[contextProp] = actions.injection[contextProp];
                        }
                        else {
                            this.actions.injection[contextProp] = { ...actions.injection[contextProp], ...this.actions.injection[contextProp] };
                        }
                    }
                }
            }
            if (actions.bindings) {
                if (!this.actions.bindings) {
                    this.actions.bindings = actions.bindings;
                }
                else {
                    for (let contextProp in actions.bindings) {
                        if (!this.actions.bindings[contextProp]) {
                            this.actions.bindings[contextProp] = actions.bindings[contextProp];
                        }
                        else {
                            this.actions.bindings[contextProp] = { ...actions.bindings[contextProp], ...this.actions.bindings[contextProp] };
                        }
                    }
                }
            }
            if (actions.contextEdits) {
                if (!this.actions.contextEdits) {
                    this.actions.contextEdits = [];
                }
                this.actions.contextEdits = [...actions.contextEdits, ...this.actions.contextEdits];
            }
        }
    }
    loops = [];
    addLoop(loop) {
        this.loops.push(loop);
    }
    ifs = [];
    addIf(_if) {
        this.ifs.push(_if);
    }
    createInstance(component) {
        let content = this.template.content.cloneNode(true);
        document.adoptNode(content);
        customElements.upgrade(content);
        return new TemplateInstance(component, content, this.actions, this.loops, this.ifs);
    }
}
Template.Namespace=`Aventus`;
__as1(_, 'Template', Template);

let Instance=class Instance {
    static elements = new Map();
    static get(type) {
        let result = this.elements.get(type);
        if (!result) {
            let cst = type.prototype['constructor'];
            result = new cst();
            this.elements.set(type, result);
        }
        return result;
    }
    static set(el) {
        let cst = el.constructor;
        if (this.elements.get(cst)) {
            return false;
        }
        this.elements.set(cst, el);
        return true;
    }
    static destroy(el) {
        let cst = el.constructor;
        return this.elements.delete(cst);
    }
}
Instance.Namespace=`Aventus`;
__as1(_, 'Instance', Instance);

let WebComponent=class WebComponent extends HTMLElement {
    /**
     * Add attributes informations
     */
    static get observedAttributes() {
        return [];
    }
    _first;
    _isReady;
    /**
     * Determine if the component is ready (postCreation done)
     */
    get isReady() {
        return this._isReady;
    }
    /**
     * The current namespace
     */
    static Namespace = "";
    /**
     * The current Tag / empty if abstract class
     */
    static Tag = "";
    /**
     * Get the unique type for the data. Define it as the namespace + class name
     */
    static get Fullname() { return this.Namespace + "." + this.name; }
    /**
     * The current namespace
     */
    get namespace() {
        return this.constructor['Namespace'];
    }
    /**
     * Get the name of the component class
     */
    getClassName() {
        return this.constructor.name;
    }
    /**
     * The current tag
     */
    get tag() {
        return this.constructor['Tag'];
    }
    /**
    * Get the unique type for the data. Define it as the namespace + class name
    */
    get $type() {
        return this.constructor['Fullname'];
    }
    __onChangeFct = {};
    __watch;
    __watchActions = {};
    __watchActionsCb = {};
    __watchFunctions = {};
    __watchFunctionsComputed = {};
    __pressManagers = [];
    __signalActions = {};
    __signals = {};
    __isDefaultState = true;
    __defaultActiveState = new Map();
    __defaultInactiveState = new Map();
    __statesList = {};
    constructor() {
        super();
        if (this.constructor == WebComponent) {
            throw "can't instanciate an abstract class";
        }
        this.__removeNoAnimations = this.__removeNoAnimations.bind(this);
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", this.__removeNoAnimations);
        }
        this._first = true;
        this._isReady = false;
        this.__renderTemplate();
        this.__registerWatchesActions();
        this.__registerPropertiesActions();
        this.__registerSignalsActions();
        this.__createStates();
        this.__subscribeState();
        if (this.constructor == WebComponent) {
            throw "can't instanciate an abstract class";
        }
    }
    /**
     * Remove all listeners
     * State + press
     */
    destructor() {
        WebComponentInstance.removeInstance(this);
        this.__unsubscribeState();
        for (let press of this.__pressManagers) {
            press.destroy();
        }
        for (let name in this.__watchFunctionsComputed) {
            this.__watchFunctionsComputed[name].destroy();
        }
        for (let name in this.__signals) {
            this.__signals[name].destroy();
        }
        // TODO add missing info for destructor();
        this.postDestruction();
        this.destructChildren();
    }
    destructChildren() {
        const recu = (el) => {
            for (let child of Array.from(el.children)) {
                if (child instanceof WebComponent) {
                    child.destructor();
                }
                else if (child instanceof HTMLElement) {
                    recu(child);
                }
            }
            if (el.shadowRoot) {
                for (let child of Array.from(el.shadowRoot.children)) {
                    if (child instanceof WebComponent) {
                        child.destructor();
                    }
                    else if (child instanceof HTMLElement) {
                        recu(child);
                    }
                }
            }
        };
        recu(this);
    }
    __addWatchesActions(name, fct) {
        if (!this.__watchActions[name]) {
            this.__watchActions[name] = [];
            this.__watchActionsCb[name] = (action, path, value) => {
                for (let fct of this.__watchActions[name]) {
                    fct(this, action, path, value);
                }
                if (this.__onChangeFct[name]) {
                    for (let fct of this.__onChangeFct[name]) {
                        fct(path);
                    }
                }
            };
        }
        if (fct) {
            this.__watchActions[name].push(fct);
        }
    }
    __addWatchesFunctions(infos) {
        for (let info of infos) {
            let realName;
            let autoInit;
            if (typeof info == "string") {
                realName = info;
                autoInit = false;
            }
            else {
                realName = info.name;
                autoInit = info.autoInit;
            }
            if (!this.__watchFunctions[realName]) {
                this.__watchFunctions[realName] = { autoInit };
            }
        }
    }
    __registerWatchesActions() {
        if (Object.keys(this.__watchActions).length > 0) {
            if (!this.__watch) {
                let defaultValue = {};
                this.__defaultValuesWatch(defaultValue);
                this.__watch = Watcher.get(defaultValue, (type, path, element) => {
                    try {
                        let action = this.__watchActionsCb[path.split(".")[0]] || this.__watchActionsCb[path.split("[")[0]];
                        action(type, path, element);
                    }
                    catch (e) {
                        console.error(e);
                    }
                });
            }
        }
        for (let name in this.__watchFunctions) {
            this.__watchFunctionsComputed[name] = Watcher.computed(this[name].bind(this));
            if (this.__watchFunctions[name].autoInit) {
                this.__watchFunctionsComputed[name].value;
            }
        }
    }
    __addSignalActions(name, fct) {
        this.__signalActions[name] = () => {
            fct(this);
        };
    }
    __registerSignalsActions() {
        if (Object.keys(this.__signals).length > 0) {
            const defaultValues = {};
            for (let name in this.__signals) {
                this.__registerSignalsAction(name);
                this.__defaultValuesSignal(defaultValues);
            }
            for (let name in defaultValues) {
                this.__signals[name].value = defaultValues[name];
            }
        }
    }
    __registerSignalsAction(name) {
        this.__signals[name] = new Signal(undefined, () => {
            if (this.__signalActions[name]) {
                this.__signalActions[name]();
            }
        });
    }
    __defaultValuesSignal(s) { }
    __addPropertyActions(name, fct) {
        if (!this.__onChangeFct[name]) {
            this.__onChangeFct[name] = [];
        }
        if (fct) {
            this.__onChangeFct[name].push(() => {
                fct(this);
            });
        }
    }
    __registerPropertiesActions() { }
    static __style = ``;
    static __template;
    __templateInstance;
    styleBefore(addStyle) {
        addStyle("@default");
    }
    styleAfter(addStyle) {
    }
    __getStyle() {
        return [WebComponent.__style];
    }
    __getHtml() { }
    __getStatic() {
        return WebComponent;
    }
    static __styleSheets = {};
    __renderStyles() {
        let sheets = {};
        const addStyle = (name) => {
            let sheet = Style.get(name);
            if (sheet) {
                sheets[name] = sheet;
            }
        };
        this.styleBefore(addStyle);
        let localStyle = new CSSStyleSheet();
        let styleTxt = this.__getStyle().join("\r\n");
        if (styleTxt.length > 0) {
            localStyle.replace(styleTxt);
            sheets['@local'] = localStyle;
        }
        this.styleAfter(addStyle);
        return sheets;
    }
    __renderTemplate() {
        let staticInstance = this.__getStatic();
        if (!staticInstance.__template || staticInstance.__template.cst != staticInstance) {
            staticInstance.__template = new Template(staticInstance);
            this.__getHtml();
            this.__registerTemplateAction();
            staticInstance.__template.generateTemplate();
            staticInstance.__styleSheets = this.__renderStyles();
        }
        this.__templateInstance = staticInstance.__template.createInstance(this);
        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.adoptedStyleSheets = [...Object.values(staticInstance.__styleSheets), Style.noAnimation];
        shadowRoot.appendChild(this.__templateInstance.content);
        // customElements.upgrade(shadowRoot);
        return shadowRoot;
    }
    __registerTemplateAction() {
    }
    connectedCallback() {
        if (this._first) {
            WebComponentInstance.addInstance(this);
            this._first = false;
            this.__defaultValues();
            this.__upgradeAttributes();
            this.__activateState();
            this.__templateInstance?.render();
            this.__removeNoAnimations();
        }
        else {
            setTimeout(() => {
                this.postConnect();
            });
        }
    }
    disconnectedCallback() {
        setTimeout(() => {
            this.postDisonnect();
        });
    }
    __onReadyCb = [];
    onReady(cb) {
        if (this._isReady) {
            cb();
        }
        else {
            this.__onReadyCb.push(cb);
        }
    }
    __setReady() {
        this._isReady = true;
        this.dispatchEvent(new CustomEvent('postCreationDone'));
        let cbs = [...this.__onReadyCb];
        for (let cb of cbs) {
            cb();
        }
        this.__onReadyCb = [];
    }
    __removeNoAnimations() {
        if (document.readyState !== "loading") {
            setTimeout(() => {
                this.postCreation();
                this.__setReady();
                this.shadowRoot.adoptedStyleSheets = Object.values(this.__getStatic().__styleSheets);
                document.removeEventListener("DOMContentLoaded", this.__removeNoAnimations);
                this.postConnect();
            }, 50);
        }
    }
    __defaultValues() { }
    __defaultValuesWatch(w) { }
    __upgradeAttributes() { }
    __listBoolProps() {
        return [];
    }
    __upgradeProperty(prop) {
        let boolProps = this.__listBoolProps();
        if (boolProps.indexOf(prop) != -1) {
            if (this.hasAttribute(prop) && (this.getAttribute(prop) === "true" || this.getAttribute(prop) === "")) {
                let value = this.getAttribute(prop);
                delete this[prop];
                this[prop] = value;
            }
            else {
                this.removeAttribute(prop);
                delete this[prop];
                this[prop] = false;
            }
        }
        else {
            if (this.hasAttribute(prop)) {
                let value = this.getAttribute(prop);
                delete this[prop];
                this[prop] = value;
            }
            else if (Object.hasOwn(this, prop)) {
                const value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }
    }
    __correctGetter(prop) {
        if (Object.hasOwn(this, prop)) {
            const value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }
    __getStateManager(managerClass) {
        let mClass;
        if (managerClass instanceof StateManager) {
            mClass = managerClass;
        }
        else {
            mClass = Instance.get(managerClass);
        }
        return mClass;
    }
    __addActiveDefState(managerClass, cb) {
        let mClass = this.__getStateManager(managerClass);
        if (!this.__defaultActiveState.has(mClass)) {
            this.__defaultActiveState.set(mClass, []);
        }
        this.__defaultActiveState.get(mClass)?.push(cb);
    }
    __addInactiveDefState(managerClass, cb) {
        let mClass = this.__getStateManager(managerClass);
        if (!this.__defaultInactiveState.has(mClass)) {
            this.__defaultInactiveState.set(mClass, []);
        }
        this.__defaultInactiveState.get(mClass)?.push(cb);
    }
    __addActiveState(statePattern, managerClass, cb) {
        let mClass = this.__getStateManager(managerClass);
        this.__statesList[statePattern].get(mClass)?.active.push(cb);
    }
    __addInactiveState(statePattern, managerClass, cb) {
        let mClass = this.__getStateManager(managerClass);
        this.__statesList[statePattern].get(mClass)?.inactive.push(cb);
    }
    __addAskChangeState(statePattern, managerClass, cb) {
        let mClass = this.__getStateManager(managerClass);
        this.__statesList[statePattern].get(mClass)?.askChange.push(cb);
    }
    __createStates() { }
    __createStatesList(statePattern, managerClass) {
        if (!this.__statesList[statePattern]) {
            this.__statesList[statePattern] = new Map();
        }
        let mClass = this.__getStateManager(managerClass);
        if (!this.__statesList[statePattern].has(mClass)) {
            this.__statesList[statePattern].set(mClass, {
                active: [],
                inactive: [],
                askChange: []
            });
        }
    }
    __inactiveDefaultState(managerClass) {
        if (this.__isDefaultState) {
            this.__isDefaultState = false;
            let mClass = this.__getStateManager(managerClass);
            if (this.__defaultInactiveState.has(mClass)) {
                let fcts = this.__defaultInactiveState.get(mClass) ?? [];
                for (let fct of fcts) {
                    fct.bind(this)();
                }
            }
        }
    }
    __activeDefaultState(nextStep, managerClass) {
        if (!this.__isDefaultState) {
            for (let pattern in this.__statesList) {
                if (StateManager.canBeActivate(pattern, nextStep)) {
                    let mClass = this.__getStateManager(managerClass);
                    if (this.__statesList[pattern].has(mClass)) {
                        return;
                    }
                }
            }
            this.__isDefaultState = true;
            let mClass = this.__getStateManager(managerClass);
            if (this.__defaultActiveState.has(mClass)) {
                let fcts = this.__defaultActiveState.get(mClass) ?? [];
                for (let fct of fcts) {
                    fct.bind(this)();
                }
            }
        }
    }
    __subscribeState() {
        if (!this.isReady && this.__stateCleared) {
            return;
        }
        for (let route in this.__statesList) {
            for (const managerClass of this.__statesList[route].keys()) {
                let el = this.__statesList[route].get(managerClass);
                if (el) {
                    managerClass.subscribe(route, el, false);
                }
            }
        }
    }
    __activateState() {
        for (let route in this.__statesList) {
            for (const managerClass of this.__statesList[route].keys()) {
                let el = this.__statesList[route].get(managerClass);
                if (el) {
                    managerClass.activateAfterSubscribe(route, el);
                }
            }
        }
    }
    __stateCleared = false;
    __unsubscribeState() {
        for (let route in this.__statesList) {
            for (const managerClass of this.__statesList[route].keys()) {
                let el = this.__statesList[route].get(managerClass);
                if (el) {
                    managerClass.unsubscribe(route, el);
                }
            }
        }
        this.__stateCleared = true;
    }
    dateToString(d) {
        if (typeof d == 'string') {
            d = this.stringToDate(d);
        }
        if (d instanceof Date) {
            return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        }
        return null;
    }
    dateTimeToString(dt) {
        if (typeof dt == 'string') {
            dt = this.stringToDate(dt);
        }
        if (dt instanceof Date) {
            return new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
        }
        return null;
    }
    stringToDate(s) {
        let td = new Date(s);
        let d = new Date(td.getTime() + (td.getTimezoneOffset() * 60000));
        if (isNaN(d)) {
            return null;
        }
        return d;
    }
    stringToDateTime(s) {
        let td = new Date(s);
        let d = new Date(td.getTime() + (td.getTimezoneOffset() * 60000));
        if (isNaN(d)) {
            return null;
        }
        return d;
    }
    getBoolean(val) {
        if (val === true || val === 1 || val === 'true' || val === '') {
            return true;
        }
        else if (val === false || val === 0 || val === 'false' || val === null || val === undefined) {
            return false;
        }
        console.error("error parsing boolean value " + val);
        return false;
    }
    __registerPropToWatcher(name) {
        if (Watcher._register) {
            Watcher._register.register(this.getReceiver(name), name, Watcher._register.version, name);
        }
    }
    getStringAttr(name) {
        return this.getAttribute(name)?.replace(/&avquot;/g, '"') ?? undefined;
    }
    setStringAttr(name, val) {
        if (val === undefined || val === null) {
            this.removeAttribute(name);
        }
        else {
            this.setAttribute(name, (val + "").replace(/"/g, '&avquot;'));
        }
    }
    getStringProp(name) {
        this.__registerPropToWatcher(name);
        return this.getStringAttr(name);
    }
    getNumberAttr(name) {
        return Number(this.getAttribute(name));
    }
    setNumberAttr(name, val) {
        if (val === undefined || val === null) {
            this.removeAttribute(name);
        }
        else {
            this.setAttribute(name, val);
        }
    }
    getNumberProp(name) {
        this.__registerPropToWatcher(name);
        return this.getNumberAttr(name);
    }
    getBoolAttr(name) {
        return this.hasAttribute(name);
    }
    setBoolAttr(name, val) {
        val = this.getBoolean(val);
        if (val) {
            this.setAttribute(name, 'true');
        }
        else {
            this.removeAttribute(name);
        }
    }
    getBoolProp(name) {
        this.__registerPropToWatcher(name);
        return this.getBoolAttr(name);
    }
    getDateAttr(name) {
        if (!this.hasAttribute(name)) {
            return undefined;
        }
        return this.stringToDate(this.getAttribute(name));
    }
    setDateAttr(name, val) {
        let valTxt = this.dateToString(val);
        if (valTxt === null) {
            this.removeAttribute(name);
        }
        else {
            this.setAttribute(name, valTxt);
        }
    }
    getDateProp(name) {
        this.__registerPropToWatcher(name);
        return this.getDateAttr(name);
    }
    getDateTimeAttr(name) {
        if (!this.hasAttribute(name))
            return undefined;
        return this.stringToDateTime(this.getAttribute(name));
    }
    setDateTimeAttr(name, val) {
        let valTxt = this.dateTimeToString(val);
        if (valTxt === null) {
            this.removeAttribute(name);
        }
        else {
            this.setAttribute(name, valTxt);
        }
    }
    getDateTimeProp(name) {
        this.__registerPropToWatcher(name);
        return this.getDateTimeAttr(name);
    }
    __propertyReceivers = {};
    getReceiver(name) {
        if (!this.__propertyReceivers[name]) {
            let that = this;
            let result = {
                __subscribes: [],
                subscribe(fct) {
                    let index = this.__subscribes.indexOf(fct);
                    if (index == -1) {
                        this.__subscribes.push(fct);
                    }
                },
                unsubscribe(fct) {
                    let index = this.__subscribes.indexOf(fct);
                    if (index > -1) {
                        this.__subscribes.splice(index, 1);
                    }
                },
                onChange() {
                    for (let fct of this.__subscribes) {
                        fct(WatchAction.UPDATED, name, that[name]);
                    }
                },
                __path: name
            };
            this.__propertyReceivers[name] = result;
        }
        return this.__propertyReceivers[name];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue || !this.isReady) {
            if (this.__propertyReceivers.hasOwnProperty(name)) {
                this.__propertyReceivers[name].onChange();
            }
            if (this.__onChangeFct.hasOwnProperty(name)) {
                for (let fct of this.__onChangeFct[name]) {
                    fct('');
                }
            }
        }
    }
    /**
     * Remove a component from the dom
     * If desctruct is set to true, the component will be fully destroyed
     */
    remove(destruct = true) {
        super.remove();
        if (destruct) {
            this.destructor();
        }
    }
    /**
     * Function triggered when the component is destroyed
     */
    postDestruction() { }
    /**
     * Function triggered the first time the component is rendering inside DOM
     */
    postCreation() { }
    /**
    * Function triggered each time the component is rendering inside DOM
    */
    postConnect() { }
    /**
    * Function triggered each time the component is removed from the DOM
    */
    postDisonnect() { }
    /**
     * Find a parent by tagname if exist
     */
    findParentByTag(tagname, untilNode) {
        return ElementExtension.findParentByTag(this, tagname, untilNode);
    }
    /**
     * Find a parent by class name if exist
     */
    findParentByClass(classname, untilNode) {
        return ElementExtension.findParentByClass(this, classname, untilNode);
    }
    /**
     * Find a parent by type if exist
     */
    findParentByType(type, untilNode) {
        return ElementExtension.findParentByType(this, type, untilNode);
    }
    /**
     * Find list of parents by tagname
     */
    findParentsByTag(tagname, untilNode) {
        return ElementExtension.findParentsByTag(this, tagname, untilNode);
    }
    /**
     * Find list of parents by custom check
     */
    findParents(tagname, check, untilNode) {
        return ElementExtension.findParents(this, check, untilNode);
    }
    /**
     * Find list of parents by custom check
     */
    findParent(tagname, check, untilNode) {
        return ElementExtension.findParent(this, check, untilNode);
    }
    /**
     * Check if element contains a child
     */
    containsChild(el) {
        return ElementExtension.containsChild(this, el);
    }
    /**
     * Get elements inside slot
     */
    getElementsInSlot(slotName) {
        return ElementExtension.getElementsInSlot(this, slotName);
    }
    /**
     * Get nodes inside slot
     */
    getNodesInSlot(slotName) {
        return ElementExtension.getNodesInSlot(this, slotName);
    }
    /**
     * Get active element from the shadowroot or the document
     */
    getActiveElement(document) {
        return ElementExtension.getActiveElement(document ?? this.shadowRoot);
    }
}
WebComponent.Namespace=`Aventus`;
__as1(_, 'WebComponent', WebComponent);

let WebComponentInstance=class WebComponentInstance {
    static __allDefinitions = [];
    static __allInstances = [];
    /**
     * Last definition insert datetime
     */
    static lastDefinition = 0;
    static registerDefinition(def) {
        WebComponentInstance.lastDefinition = Date.now();
        WebComponentInstance.__allDefinitions.push(def);
    }
    static removeDefinition(def) {
        WebComponentInstance.lastDefinition = Date.now();
        let index = WebComponentInstance.__allDefinitions.indexOf(def);
        if (index > -1) {
            WebComponentInstance.__allDefinitions.splice(index, 1);
        }
    }
    /**
     * Get all sub classes of type
     */
    static getAllClassesOf(type) {
        let result = [];
        for (let def of WebComponentInstance.__allDefinitions) {
            if (def.prototype instanceof type) {
                result.push(def);
            }
        }
        return result;
    }
    /**
     * Get all registered definitions
     */
    static getAllDefinitions() {
        return WebComponentInstance.__allDefinitions;
    }
    static addInstance(instance) {
        this.__allInstances.push(instance);
    }
    static removeInstance(instance) {
        let index = this.__allInstances.indexOf(instance);
        if (index > -1) {
            this.__allInstances.splice(index, 1);
        }
    }
    static getAllInstances(type) {
        let result = [];
        for (let instance of this.__allInstances) {
            if (instance instanceof type) {
                result.push(instance);
            }
        }
        return result;
    }
    static create(type) {
        let _class = customElements.get(type);
        if (_class) {
            return new _class();
        }
        let splitted = type.split(".");
        let current = window;
        for (let part of splitted) {
            current = current[part];
        }
        if (current && current.prototype instanceof WebComponent) {
            return new current();
        }
        return null;
    }
}
WebComponentInstance.Namespace=`Aventus`;
__as1(_, 'WebComponentInstance', WebComponentInstance);

let ResourceLoader=class ResourceLoader {
    static headerLoaded = {};
    static headerWaiting = {};
    /**
     * Load the resource inside the head tag
     */
    static async loadInHead(options) {
        const _options = this.prepareOptions(options);
        if (this.headerLoaded[_options.url]) {
            return true;
        }
        else if (this.headerWaiting.hasOwnProperty(_options.url)) {
            return await this.awaitFctHead(_options.url);
        }
        else {
            this.headerWaiting[_options.url] = [];
            let tagEl;
            if (_options.type == "js") {
                tagEl = document.createElement("SCRIPT");
            }
            else if (_options.type == "css") {
                tagEl = document.createElement("LINK");
                tagEl.setAttribute("rel", "stylesheet");
            }
            else {
                throw "unknow type " + _options.type + " to append into head";
            }
            document.head.appendChild(tagEl);
            let result = await this.loadTag(tagEl, _options.url);
            this.headerLoaded[_options.url] = true;
            this.releaseAwaitFctHead(_options.url, result);
            return result;
        }
    }
    static loadTag(tagEl, url) {
        return new Promise((resolve, reject) => {
            tagEl.addEventListener("load", (e) => {
                resolve(true);
            });
            tagEl.addEventListener("error", (e) => {
                resolve(false);
            });
            if (tagEl instanceof HTMLLinkElement) {
                tagEl.setAttribute("href", url);
            }
            else {
                tagEl.setAttribute('src', url);
            }
        });
    }
    static releaseAwaitFctHead(url, result) {
        if (this.headerWaiting[url]) {
            for (let i = 0; i < this.headerWaiting[url].length; i++) {
                this.headerWaiting[url][i](result);
            }
            delete this.headerWaiting[url];
        }
    }
    static awaitFctHead(url) {
        return new Promise((resolve) => {
            this.headerWaiting[url].push((result) => {
                resolve(result);
            });
        });
    }
    static requestLoaded = {};
    static requestWaiting = {};
    /**
     *
    */
    static async load(options) {
        options = this.prepareOptions(options);
        if (this.requestLoaded[options.url]) {
            return this.requestLoaded[options.url];
        }
        else if (this.requestWaiting.hasOwnProperty(options.url)) {
            await this.awaitFct(options.url);
            return this.requestLoaded[options.url];
        }
        else {
            this.requestWaiting[options.url] = [];
            let blob = false;
            if (options.type == "img") {
                blob = true;
            }
            let content = await this.fetching(options.url, blob);
            if (options.type == "img" && content.startsWith("data:text/html;")) {
                console.error("Can't load img " + options.url);
                content = "";
            }
            this.requestLoaded[options.url] = content;
            this.releaseAwaitFct(options.url);
            return content;
        }
    }
    static releaseAwaitFct(url) {
        if (this.requestWaiting[url]) {
            for (let i = 0; i < this.requestWaiting[url].length; i++) {
                this.requestWaiting[url][i]();
            }
            delete this.requestWaiting[url];
        }
    }
    static awaitFct(url) {
        return new Promise((resolve) => {
            this.requestWaiting[url].push(() => {
                resolve('');
            });
        });
    }
    static async fetching(url, useBlob = false) {
        if (useBlob) {
            let result = await fetch(url, {
                headers: {
                    responseType: 'blob'
                }
            });
            let blob = await result.blob();
            return await this.readFile(blob);
        }
        else {
            let result = await fetch(url);
            return await result.text();
        }
    }
    static readFile(blob) {
        return new Promise((resolve) => {
            var reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    }
    static imgExtensions = ["png", "jpg", "jpeg", "gif"];
    static prepareOptions(options) {
        let result;
        if (typeof options === 'string' || options instanceof String) {
            result = {
                url: options,
                type: 'js'
            };
            let splittedURI = result.url.split('.');
            let extension = splittedURI[splittedURI.length - 1];
            extension = extension.split("?")[0];
            if (extension == "svg") {
                result.type = 'svg';
            }
            else if (extension == "js") {
                result.type = 'js';
            }
            else if (extension == "css") {
                result.type = 'css';
            }
            else if (this.imgExtensions.indexOf(extension) != -1) {
                result.type = 'img';
            }
            else {
                delete result.type;
            }
        }
        else {
            result = options;
        }
        return result;
    }
}
ResourceLoader.Namespace=`Aventus`;
__as1(_, 'ResourceLoader', ResourceLoader);

let GenericError=class GenericError {
    /**
     * Code for the error
     */
    code;
    /**
     * Description of the error
     */
    message;
    /**
     * Additional details related to the error.
     */
    details = [];
    /**
     * Creates a new instance of GenericError.
     * @param {EnumValue<T>} code - The error code.
     * @param {string} message - The error message.
     */
    constructor(code, message) {
        this.code = code;
        this.message = message + '';
    }
}
GenericError.Namespace=`Aventus`;
__as1(_, 'GenericError', GenericError);

let VoidWithError=class VoidWithError {
    /**
     * Determine if the action is a success
     */
    get success() {
        return this.errors.length == 0;
    }
    /**
     * List of errors
     */
    errors = [];
    /**
     * Converts the current instance to a VoidWithError object.
     * @returns {VoidWithError} A new instance of VoidWithError with the same error list.
     */
    toGeneric() {
        const result = new VoidWithError();
        result.errors = this.errors;
        return result;
    }
    /**
    * Checks if the error list contains a specific error code.
    * @template U - The type of error, extending GenericError.
    * @template T - The type of the error code, which extends either number or Enum.
    * @param {EnumValue<T>} code - The error code to check for.
    * @param {new (...args: any[]) => U} [type] - Optional constructor function of the error type.
    * @returns {boolean} True if the error list contains the specified error code, otherwise false.
    */
    containsCode(code, type) {
        if (type) {
            for (let error of this.errors) {
                if (error instanceof type) {
                    if (error.code == code) {
                        return true;
                    }
                }
            }
        }
        else {
            for (let error of this.errors) {
                if (error.code == code) {
                    return true;
                }
            }
        }
        return false;
    }
}
VoidWithError.Namespace=`Aventus`;
__as1(_, 'VoidWithError', VoidWithError);

let ResultWithError=class ResultWithError extends VoidWithError {
    /**
      * The result value of the action.
      * @type {U | undefined}
      */
    result;
    /**
     * Converts the current instance to a ResultWithError object.
     * @returns {ResultWithError<U>} A new instance of ResultWithError with the same error list and result value.
     */
    toGeneric() {
        const result = new ResultWithError();
        result.errors = this.errors;
        result.result = this.result;
        return result;
    }
}
ResultWithError.Namespace=`Aventus`;
__as1(_, 'ResultWithError', ResultWithError);

let Json=class Json {
    /**
     * Converts a JavaScript class instance to a JSON object.
     * @template T - The type of the object to convert.
     * @param {T} obj - The object to convert to JSON.
     * @param {JsonToOptions} [options] - Options for JSON conversion.
     * @returns {{ [key: string | number]: any; }} Returns the JSON representation of the object.
     */
    static classToJson(obj, options) {
        const realOptions = {
            isValidKey: options?.isValidKey ?? (() => true),
            replaceKey: options?.replaceKey ?? ((key) => key),
            transformValue: options?.transformValue ?? ((key, value) => value),
            beforeEnd: options?.beforeEnd ?? ((res) => res)
        };
        return this.__classToJson(obj, realOptions);
    }
    static __classToJson(obj, options) {
        let result = {};
        let descriptors = Object.getOwnPropertyDescriptors(obj);
        for (let key in descriptors) {
            if (options.isValidKey(key))
                result[options.replaceKey(key)] = options.transformValue(key, descriptors[key].value);
        }
        let cst = obj.constructor;
        while (cst.prototype && cst != Object.prototype) {
            let descriptorsClass = Object.getOwnPropertyDescriptors(cst.prototype);
            for (let key in descriptorsClass) {
                if (options.isValidKey(key)) {
                    let descriptor = descriptorsClass[key];
                    if (descriptor?.get) {
                        result[options.replaceKey(key)] = options.transformValue(key, obj[key]);
                    }
                }
            }
            cst = Object.getPrototypeOf(cst);
        }
        result = options.beforeEnd(result);
        return result;
    }
    /**
    * Converts a JSON object to a JavaScript class instance.
    * @template T - The type of the object to convert.
    * @param {T} obj - The object to populate with JSON data.
    * @param {*} data - The JSON data to populate the object with.
    * @param {JsonFromOptions} [options] - Options for JSON deserialization.
    * @returns {T} Returns the populated object.
    */
    static classFromJson(obj, data, options) {
        let realOptions = {
            transformValue: options?.transformValue ?? ((key, value) => value),
            replaceUndefined: options?.replaceUndefined ?? false,
            replaceUndefinedWithKey: options?.replaceUndefinedWithKey ?? false,
        };
        return this.__classFromJson(obj, data, realOptions);
    }
    static __classFromJson(obj, data, options) {
        let props = Object.getOwnPropertyNames(obj);
        for (let prop of props) {
            let propUpperFirst = prop[0].toUpperCase() + prop.slice(1);
            let value = data[prop] === undefined ? data[propUpperFirst] : data[prop];
            if (value !== undefined || options.replaceUndefined || (options.replaceUndefinedWithKey && (Object.hasOwn(data, prop) || Object.hasOwn(data, propUpperFirst)))) {
                let propInfo = Object.getOwnPropertyDescriptor(obj, prop);
                if (propInfo?.writable) {
                    obj[prop] = options.transformValue(prop, value);
                }
            }
        }
        let cstTemp = obj.constructor;
        while (cstTemp.prototype && cstTemp != Object.prototype) {
            props = Object.getOwnPropertyNames(cstTemp.prototype);
            for (let prop of props) {
                let propUpperFirst = prop[0].toUpperCase() + prop.slice(1);
                let value = data[prop] === undefined ? data[propUpperFirst] : data[prop];
                if (value !== undefined || options.replaceUndefined || (options.replaceUndefinedWithKey && (Object.hasOwn(data, prop) || Object.hasOwn(data, propUpperFirst)))) {
                    let propInfo = Object.getOwnPropertyDescriptor(cstTemp.prototype, prop);
                    if (propInfo?.set) {
                        obj[prop] = options.transformValue(prop, value);
                    }
                }
            }
            cstTemp = Object.getPrototypeOf(cstTemp);
        }
        return obj;
    }
}
Json.Namespace=`Aventus`;
__as1(_, 'Json', Json);

let Data=class Data {
    /**
     * The schema for the class
     */
    static $schema;
    /**
     * The current namespace
     */
    static Namespace = "";
    /**
     * Get the unique type for the data. Define it as the namespace + class name
     */
    static get Fullname() { return this.Namespace + "." + this.name; }
    /**
     * The current namespace
     */
    get namespace() {
        return this.constructor['Namespace'];
    }
    /**
     * Get the unique type for the data. Define it as the namespace + class name
     */
    get $type() {
        return this.constructor['Fullname'];
    }
    /**
     * Get the name of the class
     */
    get className() {
        return this.constructor.name;
    }
    /**
     * Get a JSON for the current object
     */
    toJSON() {
        let toAvoid = ['className', 'namespace'];
        return Json.classToJson(this, {
            isValidKey: (key) => !toAvoid.includes(key)
        });
    }
    /**
     * Clone the object by transforming a parsed JSON string back into the original type
     */
    clone() {
        return Converter.transform(JSON.parse(JSON.stringify(this)));
    }
}
Data.Namespace=`Aventus`;
__as1(_, 'Data', Data);

let ResizeObserver=class ResizeObserver {
    callback;
    targets;
    fpsInterval = -1;
    nextFrame;
    entriesChangedEvent;
    willTrigger;
    static resizeObserverClassByObject = {};
    static uniqueInstance;
    static getUniqueInstance() {
        if (!ResizeObserver.uniqueInstance) {
            ResizeObserver.uniqueInstance = new window.ResizeObserver(entries => {
                let allClasses = [];
                for (let j = 0; j < entries.length; j++) {
                    let entry = entries[j];
                    let index = entry.target['sourceIndex'];
                    if (ResizeObserver.resizeObserverClassByObject[index]) {
                        for (let i = 0; i < ResizeObserver.resizeObserverClassByObject[index].length; i++) {
                            let classTemp = ResizeObserver.resizeObserverClassByObject[index][i];
                            classTemp.entryChanged(entry);
                            if (allClasses.indexOf(classTemp) == -1) {
                                allClasses.push(classTemp);
                            }
                        }
                    }
                }
                for (let i = 0; i < allClasses.length; i++) {
                    allClasses[i].triggerCb();
                }
            });
        }
        return ResizeObserver.uniqueInstance;
    }
    constructor(options) {
        let realOption;
        if (options instanceof Function) {
            realOption = {
                callback: options,
            };
        }
        else {
            realOption = options;
        }
        this.callback = realOption.callback;
        this.targets = [];
        if (!realOption.fps) {
            realOption.fps = 60;
        }
        if (realOption.fps != -1) {
            this.fpsInterval = 1000 / realOption.fps;
        }
        this.nextFrame = 0;
        this.entriesChangedEvent = {};
        this.willTrigger = false;
    }
    /**
     * Observe size changing for the element
     */
    observe(target) {
        if (!target["sourceIndex"]) {
            target["sourceIndex"] = Math.random().toString(36);
            this.targets.push(target);
            ResizeObserver.getUniqueInstance().observe(target);
        }
        if (!ResizeObserver.resizeObserverClassByObject[target["sourceIndex"]]) {
            ResizeObserver.resizeObserverClassByObject[target["sourceIndex"]] = [];
        }
        if (ResizeObserver.resizeObserverClassByObject[target["sourceIndex"]].indexOf(this) == -1) {
            ResizeObserver.resizeObserverClassByObject[target["sourceIndex"]].push(this);
        }
    }
    /**
     * Stop observing size changing for the element
     */
    unobserve(target) {
        for (let i = 0; this.targets.length; i++) {
            let tempTarget = this.targets[i];
            if (tempTarget == target) {
                let position = ResizeObserver.resizeObserverClassByObject[target['sourceIndex']].indexOf(this);
                if (position != -1) {
                    ResizeObserver.resizeObserverClassByObject[target['sourceIndex']].splice(position, 1);
                }
                if (ResizeObserver.resizeObserverClassByObject[target['sourceIndex']].length == 0) {
                    delete ResizeObserver.resizeObserverClassByObject[target['sourceIndex']];
                }
                ResizeObserver.getUniqueInstance().unobserve(target);
                this.targets.splice(i, 1);
                return;
            }
        }
    }
    /**
     * Destroy the resize observer
     */
    disconnect() {
        for (let i = 0; this.targets.length; i++) {
            this.unobserve(this.targets[i]);
        }
    }
    entryChanged(entry) {
        let index = entry.target.sourceIndex;
        this.entriesChangedEvent[index] = entry;
    }
    triggerCb() {
        if (!this.willTrigger) {
            this.willTrigger = true;
            this._triggerCb();
        }
    }
    _triggerCb() {
        let now = window.performance.now();
        let elapsed = now - this.nextFrame;
        if (this.fpsInterval != -1 && elapsed <= this.fpsInterval) {
            requestAnimationFrame(() => {
                this._triggerCb();
            });
            return;
        }
        this.nextFrame = now - (elapsed % this.fpsInterval);
        let changed = Object.values(this.entriesChangedEvent);
        this.entriesChangedEvent = {};
        this.willTrigger = false;
        setTimeout(() => {
            this.callback(changed);
        }, 0);
    }
}
ResizeObserver.Namespace=`Aventus`;
__as1(_, 'ResizeObserver', ResizeObserver);

let Animation=class Animation {
    /**
     * Default FPS for all Animation if not set inside options
     */
    static FPS_DEFAULT = 60;
    options;
    nextFrame = 0;
    fpsInterval;
    continueAnimation = false;
    frame_id = 0;
    constructor(options) {
        if (!options.animate) {
            options.animate = () => { };
        }
        if (!options.stopped) {
            options.stopped = () => { };
        }
        if (!options.fps) {
            options.fps = Animation.FPS_DEFAULT;
        }
        this.options = options;
        this.fpsInterval = 1000 / options.fps;
    }
    animate() {
        let now = window.performance.now();
        let elapsed = now - this.nextFrame;
        if (elapsed <= this.fpsInterval) {
            this.frame_id = requestAnimationFrame(() => this.animate());
            return;
        }
        this.nextFrame = now - (elapsed % this.fpsInterval);
        setTimeout(() => {
            this.options.animate();
        }, 0);
        if (this.continueAnimation) {
            this.frame_id = requestAnimationFrame(() => this.animate());
        }
        else {
            this.options.stopped();
        }
    }
    /**
     * Start the of animation
     */
    start() {
        if (this.continueAnimation == false) {
            this.continueAnimation = true;
            this.nextFrame = window.performance.now();
            this.animate();
        }
    }
    /**
     * Stop the animation
     */
    stop() {
        this.continueAnimation = false;
    }
    /**
     * Stop the animation
     */
    immediateStop() {
        cancelAnimationFrame(this.frame_id);
        this.continueAnimation = false;
        this.options.stopped();
    }
    /**
     * Get the FPS
     */
    getFPS() {
        return this.options.fps;
    }
    /**
     * Set the FPS
     */
    setFPS(fps) {
        this.options.fps = fps;
        this.fpsInterval = 1000 / this.options.fps;
    }
    /**
     * Get the animation status (true if animation is running)
     */
    isStarted() {
        return this.continueAnimation;
    }
}
Animation.Namespace=`Aventus`;
__as1(_, 'Animation', Animation);

let DragAndDrop=class DragAndDrop {
    /**
     * Default offset before drag element
     */
    static defaultOffsetDrag = 20;
    pressManager;
    options;
    startCursorPosition = { x: 0, y: 0 };
    startElementPosition = { x: 0, y: 0 };
    isEnable = true;
    draggableElement;
    constructor(options) {
        this.options = this.getDefaultOptions(options.element);
        this.mergeProperties(options);
        this.mergeFunctions(options);
        this.options.elementTrigger.style.touchAction = 'none';
        this.pressManager = new PressManager({
            element: this.options.elementTrigger,
            onPressStart: this.onPressStart.bind(this),
            onPressEnd: this.onPressEnd.bind(this),
            onDragStart: this.onDragStart.bind(this),
            onDrag: this.onDrag.bind(this),
            onDragEnd: this.onDragEnd.bind(this),
            offsetDrag: this.options.offsetDrag,
            dragDirection: this.options.dragDirection,
            stopPropagation: this.options.stopPropagation
        });
    }
    getDefaultOptions(element) {
        return {
            applyDrag: true,
            element: element,
            elementTrigger: element,
            offsetDrag: DragAndDrop.defaultOffsetDrag,
            dragDirection: 'XY',
            shadow: {
                enable: false,
                container: document.body,
                removeOnStop: true,
                transform: () => { },
                delete: (el) => {
                    el.remove();
                }
            },
            strict: false,
            targets: [],
            usePercent: false,
            stopPropagation: true,
            useMouseFinalPosition: false,
            useTransform: false,
            isDragEnable: () => true,
            getZoom: () => 1,
            getOffsetX: () => 0,
            getOffsetY: () => 0,
            onPointerDown: (e) => { },
            onPointerUp: (e) => { },
            onStart: (e) => { },
            onMove: (e) => { },
            onStop: (e) => { },
            onDrop: (element, targets) => { },
            correctPosition: (position) => position
        };
    }
    mergeProperties(options) {
        if (options.element === void 0) {
            throw "You must define the element for the drag&drop";
        }
        this.options.element = options.element;
        if (options.elementTrigger === void 0) {
            this.options.elementTrigger = this.options.element;
        }
        else {
            this.options.elementTrigger = options.elementTrigger;
        }
        this.defaultMerge(options, "applyDrag");
        this.defaultMerge(options, "offsetDrag");
        this.defaultMerge(options, "dragDirection");
        this.defaultMerge(options, "strict");
        this.defaultMerge(options, "targets");
        this.defaultMerge(options, "usePercent");
        this.defaultMerge(options, "stopPropagation");
        this.defaultMerge(options, "useMouseFinalPosition");
        this.defaultMerge(options, "useTransform");
        if (options.shadow !== void 0) {
            this.options.shadow.enable = options.shadow.enable;
            if (options.shadow.container !== void 0) {
                this.options.shadow.container = options.shadow.container;
            }
            else {
                this.options.shadow.container = document.body;
            }
            if (options.shadow.removeOnStop !== void 0) {
                this.options.shadow.removeOnStop = options.shadow.removeOnStop;
            }
            if (options.shadow.transform !== void 0) {
                this.options.shadow.transform = options.shadow.transform;
            }
            if (options.shadow.delete !== void 0) {
                this.options.shadow.delete = options.shadow.delete;
            }
        }
    }
    mergeFunctions(options) {
        this.defaultMerge(options, "isDragEnable");
        this.defaultMerge(options, "getZoom");
        this.defaultMerge(options, "getOffsetX");
        this.defaultMerge(options, "getOffsetY");
        this.defaultMerge(options, "onPointerDown");
        this.defaultMerge(options, "onPointerUp");
        this.defaultMerge(options, "onStart");
        this.defaultMerge(options, "onMove");
        this.defaultMerge(options, "onStop");
        this.defaultMerge(options, "onDrop");
        this.defaultMerge(options, "correctPosition");
    }
    defaultMerge(options, name) {
        if (options[name] !== void 0) {
            this.options[name] = options[name];
        }
    }
    positionShadowRelativeToElement = { x: 0, y: 0 };
    onPressStart(e) {
        this.options.onPointerDown(e);
    }
    onPressEnd(e) {
        this.options.onPointerUp(e);
    }
    onDragStart(e) {
        this.isEnable = this.options.isDragEnable();
        if (!this.isEnable) {
            return false;
        }
        let draggableElement = this.options.element;
        this.startCursorPosition = {
            x: e.pageX,
            y: e.pageY
        };
        this.startElementPosition = this.getBoundingBoxRelative(draggableElement);
        if (this.options.shadow.enable) {
            draggableElement = this.options.element.cloneNode(true);
            let elBox = this.options.element.getBoundingClientRect();
            let containerBox = this.options.shadow.container.getBoundingClientRect();
            this.positionShadowRelativeToElement = {
                x: elBox.x - containerBox.x,
                y: elBox.y - containerBox.y
            };
            if (this.options.applyDrag) {
                draggableElement.style.position = "absolute";
                draggableElement.style.top = this.positionShadowRelativeToElement.y + this.options.getOffsetY() + 'px';
                draggableElement.style.left = this.positionShadowRelativeToElement.x + this.options.getOffsetX() + 'px';
                this.options.shadow.transform(draggableElement);
                this.options.shadow.container.appendChild(draggableElement);
            }
        }
        this.draggableElement = draggableElement;
        const result = this.options.onStart(e);
        if (result !== false) {
            document.body.style.userSelect = 'none';
            if (window.getSelection) {
                window.getSelection()?.removeAllRanges();
            }
        }
        return result;
    }
    onDrag(e) {
        if (!this.isEnable) {
            return;
        }
        let zoom = this.options.getZoom();
        let diff = {
            x: 0,
            y: 0
        };
        if (this.options.shadow.enable) {
            diff = {
                x: (e.pageX - this.startCursorPosition.x) + this.positionShadowRelativeToElement.x + this.options.getOffsetX(),
                y: (e.pageY - this.startCursorPosition.y) + this.positionShadowRelativeToElement.y + this.options.getOffsetY(),
            };
        }
        else {
            diff = {
                x: (e.pageX - this.startCursorPosition.x) / zoom + this.startElementPosition.x + this.options.getOffsetX(),
                y: (e.pageY - this.startCursorPosition.y) / zoom + this.startElementPosition.y + this.options.getOffsetY()
            };
        }
        let newPos = this.setPosition(diff);
        this.options.onMove(e, newPos);
    }
    onDragEnd(e) {
        if (!this.isEnable) {
            return;
        }
        document.body.style.userSelect = '';
        let targets = this.options.useMouseFinalPosition ? this.getMatchingTargetsWithMousePosition({
            x: e.clientX,
            y: e.clientY
        }) : this.getMatchingTargets();
        let draggableElement = this.draggableElement;
        if (this.options.shadow.enable && this.options.shadow.removeOnStop) {
            this.options.shadow.delete(draggableElement);
        }
        if (targets.length > 0) {
            this.options.onDrop(this.options.element, targets);
        }
        this.options.onStop(e);
    }
    setPosition(position) {
        let draggableElement = this.draggableElement;
        if (this.options.usePercent) {
            let elementParent = this.getOffsetParent(draggableElement);
            if (elementParent instanceof HTMLElement) {
                let percentPosition = {
                    x: (position.x / elementParent.offsetWidth) * 100,
                    y: (position.y / elementParent.offsetHeight) * 100
                };
                percentPosition = this.options.correctPosition(percentPosition);
                if (this.options.applyDrag) {
                    draggableElement.style.left = percentPosition.x + '%';
                    draggableElement.style.top = percentPosition.y + '%';
                }
                return percentPosition;
            }
            else {
                console.error("Can't find parent. Contact an admin", draggableElement);
            }
        }
        else {
            position = this.options.correctPosition(position);
            if (this.options.applyDrag) {
                if (this.isLeftTopElement(draggableElement)) {
                    draggableElement.style.left = position.x + 'px';
                    draggableElement.style.top = position.y + 'px';
                }
                else {
                    if (this.options.useTransform) {
                        draggableElement.setAttribute("transform", `translate(${position.x},${position.y})`);
                    }
                    else {
                        draggableElement.style.left = position.x + 'px';
                        draggableElement.style.top = position.y + 'px';
                    }
                }
            }
        }
        return position;
    }
    getTargets() {
        if (typeof this.options.targets == "function") {
            return this.options.targets();
        }
        else {
            return this.options.targets;
        }
    }
    /**
     * Get targets within the current element position is matching
     */
    getMatchingTargets() {
        let draggableElement = this.draggableElement;
        let matchingTargets = [];
        let srcTargets = this.getTargets();
        for (let target of srcTargets) {
            let elementCoordinates = this.getBoundingBoxAbsolute(draggableElement);
            let targetCoordinates = this.getBoundingBoxAbsolute(target);
            let offsetX = this.options.getOffsetX();
            let offsetY = this.options.getOffsetY();
            let zoom = this.options.getZoom();
            targetCoordinates.x += offsetX;
            targetCoordinates.y += offsetY;
            targetCoordinates.width *= zoom;
            targetCoordinates.height *= zoom;
            if (this.options.strict) {
                if ((elementCoordinates.x >= targetCoordinates.x && elementCoordinates.x + elementCoordinates.width <= targetCoordinates.x + targetCoordinates.width) &&
                    (elementCoordinates.y >= targetCoordinates.y && elementCoordinates.y + elementCoordinates.height <= targetCoordinates.y + targetCoordinates.height)) {
                    matchingTargets.push(target);
                }
            }
            else {
                let elementLeft = elementCoordinates.x;
                let elementRight = elementCoordinates.x + elementCoordinates.width;
                let elementTop = elementCoordinates.y;
                let elementBottom = elementCoordinates.y + elementCoordinates.height;
                let targetLeft = targetCoordinates.x;
                let targetRight = targetCoordinates.x + targetCoordinates.width;
                let targetTop = targetCoordinates.y;
                let targetBottom = targetCoordinates.y + targetCoordinates.height;
                if (!(elementRight < targetLeft ||
                    elementLeft > targetRight ||
                    elementBottom < targetTop ||
                    elementTop > targetBottom)) {
                    matchingTargets.push(target);
                }
            }
        }
        return matchingTargets;
    }
    /**
     * This function will return the targets that are matching with the mouse position
     * @param mouse The mouse position
     */
    getMatchingTargetsWithMousePosition(mouse) {
        let matchingTargets = [];
        if (this.options.shadow.enable == false || this.options.shadow.container == null) {
            console.warn("DragAndDrop : To use useMouseFinalPosition=true, you must enable shadow and set a container");
            return matchingTargets;
        }
        const container = this.options.shadow.container;
        let xCorrected = mouse.x - container.getBoundingClientRect().left;
        let yCorrected = mouse.y - container.getBoundingClientRect().top;
        for (let target of this.getTargets()) {
            if (this.isLeftTopElement(target)) {
                if (this.matchPosition(target, { x: mouse.x, y: mouse.y })) {
                    matchingTargets.push(target);
                }
            }
            else {
                if (this.matchPosition(target, { x: xCorrected, y: yCorrected })) {
                    matchingTargets.push(target);
                }
            }
        }
        return matchingTargets;
    }
    matchPosition(element, point) {
        let elementCoordinates = this.getBoundingBoxAbsolute(element);
        if (point.x >= elementCoordinates.x &&
            point.x <= elementCoordinates.x + elementCoordinates.width &&
            point.y >= elementCoordinates.y &&
            point.y <= elementCoordinates.y + elementCoordinates.height) {
            return true;
        }
        return false;
    }
    /**
     * Get element currently dragging
     */
    getElementDrag() {
        return this.options.element;
    }
    /**
     * Set targets where to drop
     */
    setTargets(targets) {
        this.options.targets = targets;
    }
    /**
     * Set targets where to drop
     */
    setTargetsFct(targets) {
        this.options.targets = targets;
    }
    /**
     * Destroy the current drag&drop instance
     */
    destroy() {
        this.pressManager.destroy();
    }
    isLeftTopElement(element) {
        for (let Type of DragElementLeftTopType) {
            if (element instanceof Type) {
                return true;
            }
        }
        return false;
    }
    isXYElement(element) {
        for (let Type of DragElementXYType) {
            if (element instanceof Type) {
                return true;
            }
        }
        return false;
    }
    getCoordinateFromAttribute(element) {
        if (this.options.useTransform) {
            const transform = element.getAttribute("transform");
            const tvalue = transform?.match(/translate\(([^,]+),([^,]+)\)/);
            const x = tvalue ? parseFloat(tvalue[1]) : 0;
            const y = tvalue ? parseFloat(tvalue[2]) : 0;
            return {
                x: x,
                y: y
            };
        }
        return {
            x: parseFloat(element.getAttribute("x")),
            y: parseFloat(element.getAttribute("y"))
        };
    }
    XYElementToRelativeBox(element) {
        let coordinates = this.getCoordinateFromAttribute(element);
        const width = parseFloat(element.getAttribute("width"));
        const height = parseFloat(element.getAttribute("height"));
        return {
            x: coordinates.x,
            y: coordinates.y,
            width: width,
            height: height,
            bottom: coordinates.y + height,
            right: coordinates.x + width,
            top: coordinates.y,
            left: coordinates.x,
            toJSON() {
                return JSON.stringify(this);
            }
        };
    }
    XYElementToAbsoluteBox(element) {
        let coordinates = this.getCoordinateFromAttribute(element);
        const parent = this.getOffsetParent(element);
        if (parent) {
            const box = parent.getBoundingClientRect();
            coordinates = {
                x: coordinates.x + box.x,
                y: coordinates.y + box.y
            };
        }
        const width = parseFloat(element.getAttribute("width"));
        const height = parseFloat(element.getAttribute("height"));
        return {
            x: coordinates.x,
            y: coordinates.y,
            width: width,
            height: height,
            bottom: coordinates.y + height,
            right: coordinates.x + width,
            top: coordinates.y,
            left: coordinates.x,
            toJSON() {
                return JSON.stringify(this);
            }
        };
    }
    getBoundingBoxAbsolute(element) {
        if (this.isLeftTopElement(element)) {
            if (element instanceof HTMLElement) {
                const bounds = element.getBoundingClientRect();
                return {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height,
                    bottom: bounds.bottom,
                    right: bounds.right,
                    top: bounds.top,
                    left: bounds.left,
                    toJSON() {
                        return JSON.stringify(this);
                    }
                };
            }
        }
        else if (this.isXYElement(element)) {
            return this.XYElementToAbsoluteBox(element);
        }
        const parent = this.getOffsetParent(element);
        if (parent instanceof HTMLElement) {
            const rect = element.getBoundingClientRect();
            const rectParent = parent.getBoundingClientRect();
            const x = rect.left - rectParent.left;
            const y = rect.top - rectParent.top;
            return {
                x: x,
                y: y,
                width: rect.width,
                height: rect.height,
                bottom: y + rect.height,
                right: x + rect.width,
                left: rect.left - rectParent.left,
                top: rect.top - rectParent.top,
                toJSON() {
                    return JSON.stringify(this);
                }
            };
        }
        console.error("Element type not supported");
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            bottom: 0,
            right: 0,
            top: 0,
            left: 0,
            toJSON() {
                return JSON.stringify(this);
            }
        };
    }
    getBoundingBoxRelative(element) {
        if (this.isLeftTopElement(element)) {
            if (element instanceof HTMLElement) {
                return {
                    x: element.offsetLeft,
                    y: element.offsetTop,
                    width: element.offsetWidth,
                    height: element.offsetHeight,
                    bottom: element.offsetTop + element.offsetHeight,
                    right: element.offsetLeft + element.offsetWidth,
                    top: element.offsetTop,
                    left: element.offsetLeft,
                    toJSON() {
                        return JSON.stringify(this);
                    }
                };
            }
        }
        else if (this.isXYElement(element)) {
            return this.XYElementToRelativeBox(element);
        }
        const parent = this.getOffsetParent(element);
        if (parent instanceof HTMLElement) {
            const rect = element.getBoundingClientRect();
            const rectParent = parent.getBoundingClientRect();
            const x = rect.left - rectParent.left;
            const y = rect.top - rectParent.top;
            return {
                x: x,
                y: y,
                width: rect.width,
                height: rect.height,
                bottom: y + rect.height,
                right: x + rect.width,
                left: rect.left - rectParent.left,
                top: rect.top - rectParent.top,
                toJSON() {
                    return JSON.stringify(this);
                }
            };
        }
        console.error("Element type not supported");
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            bottom: 0,
            right: 0,
            top: 0,
            left: 0,
            toJSON() {
                return JSON.stringify(this);
            }
        };
    }
    getOffsetParent(element) {
        if (element instanceof HTMLElement) {
            return element.offsetParent;
        }
        let current = element.parentNode;
        while (current) {
            if (current instanceof Element) {
                const style = getComputedStyle(current);
                if (style.position !== 'static') {
                    return current;
                }
            }
            if (current instanceof ShadowRoot) {
                current = current.host;
            }
            else {
                current = current.parentNode;
            }
        }
        return null;
    }
}
DragAndDrop.Namespace=`Aventus`;
__as1(_, 'DragAndDrop', DragAndDrop);

let ConverterTransform=class ConverterTransform {
    transform(data) {
        return this.transformLoop(data);
    }
    createInstance(data) {
        if (data.$type) {
            let cst = Converter.info.get(data.$type);
            if (cst) {
                return new cst();
            }
        }
        return undefined;
    }
    beforeTransformObject(obj) {
    }
    afterTransformObject(obj) {
    }
    transformLoop(data) {
        if (data === null) {
            return data;
        }
        if (Array.isArray(data)) {
            let result = [];
            for (let element of data) {
                result.push(this.transformLoop(element));
            }
            return result;
        }
        if (data instanceof Date) {
            return data;
        }
        if (typeof data === 'object' && !/^\s*class\s+/.test(data.toString())) {
            let objTemp = this.createInstance(data);
            if (objTemp) {
                if (objTemp instanceof Map) {
                    if (data.values) {
                        for (const keyValue of data.values) {
                            objTemp.set(this.transformLoop(keyValue[0]), this.transformLoop(keyValue[1]));
                        }
                    }
                    return objTemp;
                }
                let obj = objTemp;
                this.beforeTransformObject(obj);
                if (obj.fromJSON) {
                    obj = obj.fromJSON(data);
                }
                else {
                    obj = Json.classFromJson(obj, data, {
                        transformValue: (key, value) => {
                            if (obj[key] instanceof Date) {
                                return value ? new Date(value) : null;
                            }
                            else if (typeof value == 'string' && DateConverter.converter.isStringDate(value)) {
                                return value ? DateConverter.converter.fromString(value) : null;
                            }
                            else if (obj[key] instanceof Map) {
                                let map = new Map();
                                if ("$type" in value && value['$type'] == "Aventus.Map") {
                                    value = value.values;
                                }
                                for (const keyValue of value) {
                                    map.set(this.transformLoop(keyValue[0]), this.transformLoop(keyValue[1]));
                                }
                                return map;
                            }
                            else if (obj instanceof Data) {
                                let cst = obj.constructor;
                                if (cst.$schema[key] == 'boolean') {
                                    return value ? true : false;
                                }
                                else if (cst.$schema[key] == 'number') {
                                    return isNaN(Number(value)) ? 0 : Number(value);
                                }
                                else if (cst.$schema[key] == 'number') {
                                    return isNaN(Number(value)) ? 0 : Number(value);
                                }
                                else if (cst.$schema[key] == 'Date') {
                                    return value ? new Date(value) : null;
                                }
                            }
                            return this.transformLoop(value);
                        }
                    });
                }
                this.afterTransformObject(obj);
                return obj;
            }
            let result = {};
            for (let key in data) {
                result[key] = this.transformLoop(data[key]);
            }
            return result;
        }
        if (typeof data == 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/.exec(data)) {
            return new Date(data);
        }
        return data;
    }
    copyValuesClass(target, src, options) {
        const realOptions = {
            isValidKey: options?.isValidKey ?? (() => true),
            replaceKey: options?.replaceKey ?? ((key) => key),
            transformValue: options?.transformValue ?? ((key, value) => value),
        };
        this.__classCopyValues(target, src, realOptions);
    }
    __classCopyValues(target, src, options) {
        let props = Object.getOwnPropertyNames(target);
        for (let prop of props) {
            let propInfo = Object.getOwnPropertyDescriptor(target, prop);
            if (propInfo?.writable) {
                if (options.isValidKey(prop))
                    target[options.replaceKey(prop)] = options.transformValue(prop, src[prop]);
            }
        }
        let cstTemp = target.constructor;
        while (cstTemp.prototype && cstTemp != Object.prototype) {
            props = Object.getOwnPropertyNames(cstTemp.prototype);
            for (let prop of props) {
                let propInfo = Object.getOwnPropertyDescriptor(cstTemp.prototype, prop);
                if (propInfo?.set && propInfo.get) {
                    if (options.isValidKey(prop))
                        target[options.replaceKey(prop)] = options.transformValue(prop, src[prop]);
                }
            }
            cstTemp = Object.getPrototypeOf(cstTemp);
        }
    }
}
ConverterTransform.Namespace=`Aventus`;
__as1(_, 'ConverterTransform', ConverterTransform);

let Converter=class Converter {
    /**
    * Map storing information about registered types.
    */
    static info = new Map([["Aventus.Map", Map]]);
    /**
    * Map storing schemas for registered types.
    */
    static schema = new Map();
    /**
     * Internal converter instance.
     */
    static __converter = new ConverterTransform();
    /**
     * Getter for the internal converter instance.
     */
    static get converterTransform() {
        return this.__converter;
    }
    /**
    * Sets the converter instance.
    * @param converter The converter instance to set.
    */
    static setConverter(converter) {
        this.__converter = converter;
    }
    /**
    * Registers a unique string type for any class.
    * @param $type The unique string type identifier.
    * @param cst The constructor function for the class.
    * @param schema Optional schema for the registered type.
    */
    static register($type, cst, schema) {
        this.info.set($type, cst);
        if (schema) {
            this.schema.set($type, schema);
        }
    }
    /**
     * Transforms the provided data using the current converter instance.
     * @template T
     * @param {*} data The data to transform.
     * @param {IConverterTransform} [converter] Optional converter instance to use for transformation.
     * @returns {T} Returns the transformed data.
     */
    static transform(data, converter) {
        if (!converter) {
            converter = this.converterTransform;
        }
        return converter.transform(data);
    }
    /**
     * Copies values from one class instance to another using the current converter instance.
     * @template T
     * @param {T} to The destination class instance to copy values into.
     * @param {T} from The source class instance to copy values from.
     * @param {ClassCopyOptions} [options] Optional options for the copy operation.
     * @param {IConverterTransform} [converter] Optional converter instance to use for the copy operation.
     * @returns {T} Returns the destination class instance with copied values.
     */
    static copyValuesClass(to, from, options, converter) {
        if (!converter) {
            converter = this.converterTransform;
        }
        return converter.copyValuesClass(to, from, options);
    }
}
Converter.Namespace=`Aventus`;
__as1(_, 'Converter', Converter);

let clone=function clone(item) {
    return Converter.transform(JSON.parse(JSON.stringify(item)));
}
__as1(_, 'clone', clone);

let RamManager=class RamManager {
    static _allInit = true;
    static get allInit() { return this._allInit; }
    ;
    static info = new Map([]);
    static rams = [];
    static registerRAM(ram) {
        this._allInit = false;
        if (!this.rams.includes(ram)) {
            this.rams.push(ram);
        }
    }
    static check() {
        if (this._allInit) {
            this._allInit = true;
            for (let ramCst of this.rams) {
                const ram = Instance.get(ramCst);
                for (let type of ram.ramForTypes()) {
                    this.info.set(type, ram);
                }
            }
            for (let ramCst of this.rams) {
                const ram = Instance.get(ramCst);
                const mapping = {};
                for (let type of ram.ramForTypes()) {
                    if ('$schema' in type) {
                        const schema = type.$schema;
                        for (let key in schema) {
                            if (mapping[key])
                                continue;
                            let schemaType = schema[key];
                            let asArray = false;
                            if (schemaType.endsWith("[]")) {
                                asArray = true;
                                schemaType = schemaType.slice(0, -2);
                            }
                            const schemaInfo = Converter.info.get(schemaType);
                            if (schemaInfo) {
                                const ramLink = this.info.get(schemaInfo);
                                if (ramLink) {
                                    mapping[key] = {
                                        ram: ramLink,
                                        asArray
                                    };
                                }
                            }
                        }
                    }
                }
                ram.ramMapping = mapping;
            }
        }
    }
}
RamManager.Namespace=`Aventus`;
__as1(_, 'RamManager', RamManager);

let RamError=class RamError extends GenericError {
}
RamError.Namespace=`Aventus`;
__as1(_, 'RamError', RamError);

let VoidRamWithError=class VoidRamWithError extends VoidWithError {
}
VoidRamWithError.Namespace=`Aventus`;
__as1(_, 'VoidRamWithError', VoidRamWithError);

let ResultRamWithError=class ResultRamWithError extends ResultWithError {
}
ResultRamWithError.Namespace=`Aventus`;
__as1(_, 'ResultRamWithError', ResultRamWithError);

let GenericRam=class GenericRam {
    static info = new Map([]);
    /**
     * The current namespace
     */
    static Namespace = "";
    // public static get Namespace(): string { return ""; }
    /**
     * Get the unique type for the data. Define it as the namespace + class name
     */
    static get Fullname() { return this.Namespace + "." + this.name; }
    subscribers = {
        created: [],
        updated: [],
        deleted: [],
    };
    recordsSubscribers = new Map();
    /**
     * List of stored item by index key
     */
    records = new Map();
    actionGuard = new ActionGuard();
    ramMapping = {};
    constructor() {
        if (this.constructor == GenericRam) {
            throw "can't instanciate an abstract class";
        }
        RamManager.check();
        this.getIdWithError = this.getIdWithError.bind(this);
        this.getId = this.getId.bind(this);
        this.save = this.save.bind(this);
        this.saveWithError = this.saveWithError.bind(this);
        this.onCreated = this.onCreated.bind(this);
        this.offCreated = this.offCreated.bind(this);
        this.onUpdated = this.onUpdated.bind(this);
        this.offUpdated = this.offUpdated.bind(this);
        this.onDeleted = this.onDeleted.bind(this);
        this.offDeleted = this.offDeleted.bind(this);
        this.get = this.get.bind(this);
        this.getWithError = this.getWithError.bind(this);
        this.getById = this.getById.bind(this);
        this.getByIdWithError = this.getByIdWithError.bind(this);
        this.getByIds = this.getByIds.bind(this);
        this.getByIdsWithError = this.getByIdsWithError.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getAllWithError = this.getAllWithError.bind(this);
        this.getList = this.getList.bind(this);
        this.getListWithError = this.getListWithError.bind(this);
        this.createList = this.createList.bind(this);
        this.createListWithError = this.createListWithError.bind(this);
        this.create = this.create.bind(this);
        this.createWithError = this.createWithError.bind(this);
        this.updateList = this.updateList.bind(this);
        this.updateListWithError = this.updateListWithError.bind(this);
        this.update = this.update.bind(this);
        this.updateWithError = this.updateWithError.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.deleteListWithError = this.deleteListWithError.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteWithError = this.deleteWithError.bind(this);
        this.deleteById = this.deleteById.bind(this);
        this.deleteByIdWithError = this.deleteByIdWithError.bind(this);
    }
    /**
     * Get item id
     */
    getIdWithError(item) {
        let action = new ResultRamWithError();
        let idTemp = item[this.defineIndexKey()];
        if (idTemp !== undefined) {
            action.result = idTemp;
        }
        else {
            action.errors.push(new RamError(RamErrorCode.noId, "no key found for item"));
        }
        return action;
    }
    /**
     * Get item id
     */
    getId(item) {
        let result = this.getIdWithError(item);
        if (result.success) {
            return result.result;
        }
        throw 'no key found for item';
    }
    /**
     * Prevent adding Watch element
     */
    removeWatch(element) {
        let byPass = element;
        if (byPass.__isProxy) {
            return byPass.getTarget();
        }
        return element;
    }
    /**
     * Add function update, onUpdate, offUpdate, delete, onDelete, offDelete
     */
    addRamAction(Base) {
        let that = this;
        return class ActionClass extends Base {
            static get className() {
                return Base.className || Base.name;
            }
            get className() {
                return Base.className || Base.name;
            }
            async update(newData = {}) {
                let id = that.getId(this);
                let oldData = that.records.get(id);
                if (oldData) {
                    that.mergeObject(oldData, newData, { replaceUndefinedWithKey: true });
                    let result = await that.update(oldData);
                    return result;
                }
                return undefined;
            }
            async updateWithError(newData = {}) {
                const result = new ResultRamWithError();
                let queryId = that.getIdWithError(this);
                if (!queryId.success || !queryId.result) {
                    result.errors = queryId.errors;
                    return result;
                }
                let oldData = that.records.get(queryId.result);
                if (oldData) {
                    that.mergeObject(oldData, newData, { replaceUndefinedWithKey: true });
                    let result = await that.updateWithError(oldData);
                    return result;
                }
                result.errors.push(new RamError(RamErrorCode.noItemInsideRam, "Can't find this item inside the ram"));
                return result;
            }
            onUpdate(callback) {
                let id = that.getId(this);
                if (!that.recordsSubscribers.has(id)) {
                    that.recordsSubscribers.set(id, {
                        created: [],
                        updated: [],
                        deleted: []
                    });
                }
                let sub = that.recordsSubscribers.get(id);
                if (sub && !sub.updated.includes(callback)) {
                    sub.updated.push(callback);
                }
            }
            offUpdate(callback) {
                let id = that.getId(this);
                let sub = that.recordsSubscribers.get(id);
                if (sub) {
                    let index = sub.updated.indexOf(callback);
                    if (index != -1) {
                        sub.updated.splice(index, 1);
                    }
                }
            }
            async delete() {
                let id = that.getId(this);
                await that.deleteById(id);
            }
            async deleteWithError() {
                const result = new VoidRamWithError();
                let queryId = that.getIdWithError(this);
                if (!queryId.success || !queryId.result) {
                    result.errors = queryId.errors;
                    return result;
                }
                const queryDelete = await that.deleteByIdWithError(queryId.result);
                result.errors = queryDelete.errors;
                return result;
            }
            onDelete(callback) {
                let id = that.getId(this);
                if (!that.recordsSubscribers.has(id)) {
                    that.recordsSubscribers.set(id, {
                        created: [],
                        updated: [],
                        deleted: []
                    });
                }
                let sub = that.recordsSubscribers.get(id);
                if (sub && !sub.deleted.includes(callback)) {
                    sub.deleted.push(callback);
                }
            }
            offDelete(callback) {
                let id = that.getId(this);
                let sub = that.recordsSubscribers.get(id);
                if (sub) {
                    let index = sub.deleted.indexOf(callback);
                    if (index != -1) {
                        sub.deleted.splice(index, 1);
                    }
                }
            }
        };
    }
    /**
     * Define all the types you ram is capable of
     */
    ramForTypes() {
        return [this.getTypeForData({})];
    }
    /**
     * Transform the object into the object stored inside Ram
     */
    getObjectForRam(objJson) {
        let T = this.addRamAction(this.getTypeForData(objJson));
        let item = new T();
        this.mergeObject(item, objJson);
        return item;
    }
    linkFct = new Map();
    linkInfo = {};
    linkRamItem(item) {
        for (let key in this.ramMapping) {
            this.linkRamItemByKey(item, key);
        }
    }
    linkRamItemByKey(item, key) {
        const mapping = this.ramMapping[key];
        if (key in item) {
            if (mapping.asArray) {
                if (Array.isArray(item[key])) {
                }
                else {
                    console.error(key + " in type " + item + " must be an array");
                }
            }
            else {
                const id = mapping.ram.getId(item[key]);
                if (!this.linkFct.has(mapping.ram)) {
                    const fcts = {
                        onCreated: (item) => {
                        },
                        onUpdated: (item) => {
                        },
                        onDeleted: (item) => {
                        },
                    };
                    this.linkFct.set(mapping.ram, fcts);
                    mapping.ram.onCreated(fcts.onCreated);
                    mapping.ram.onUpdated(fcts.onUpdated);
                    mapping.ram.onDeleted(fcts.onDeleted);
                }
                if (!this.linkInfo[key])
                    this.linkInfo[key] = {};
                if (!this.linkInfo[key][id])
                    this.linkInfo[key][id] = [];
                this.linkInfo[key][id].push(item);
            }
        }
    }
    /**
     * Add element inside Ram or update it. The instance inside the ram is unique and ll never be replaced
     */
    async addOrUpdateData(item, result) {
        let resultTemp = null;
        try {
            let idWithError = this.getIdWithError(item);
            if (idWithError.success && idWithError.result !== undefined) {
                let id = idWithError.result;
                if (this.records.has(id)) {
                    let uniqueRecord = this.records.get(id);
                    await this.beforeRecordSet(uniqueRecord);
                    // this.unlinkRamItem(uniqueRecord);
                    this.mergeObject(uniqueRecord, item);
                    await this.afterRecordSet(uniqueRecord);
                    this.linkRamItem(uniqueRecord);
                    resultTemp = 'updated';
                }
                else {
                    let realObject = this.getObjectForRam(item);
                    await this.beforeRecordSet(realObject);
                    this.records.set(id, realObject);
                    await this.afterRecordSet(realObject);
                    this.linkRamItem(realObject);
                    resultTemp = 'created';
                }
                result.result = this.records.get(id);
            }
            else {
                result.errors = [...result.errors, ...idWithError.errors];
                resultTemp = null;
            }
        }
        catch (e) {
            result.errors.push(new RamError(RamErrorCode.unknow, e));
            resultTemp = null;
        }
        return resultTemp;
    }
    /**
     * Merge object and create real instance of class
     */
    mergeObject(item, objJson, options) {
        if (!item) {
            return;
        }
        if (!options) {
            options = {
                replaceUndefined: true
            };
        }
        Json.classFromJson(item, objJson, options);
    }
    /**
     * Create or update the item
     */
    async save(item, ...args) {
        let action = await this.saveWithError(item, ...args);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    /**
     * Create or update the item
     */
    async saveWithError(item, ...args) {
        let action = new ResultRamWithError();
        let resultTemp = await this.getIdWithError(item);
        if (resultTemp.success && resultTemp.result !== undefined) {
            if (resultTemp.result) {
                return this.updateWithError(item, ...args);
            }
            else {
                return this.createWithError(item, ...args);
            }
        }
        else {
            action.errors = resultTemp.errors;
        }
        return action;
    }
    async beforeRecordSet(item) { }
    async afterRecordSet(item) { }
    async beforeRecordDelete(item) { }
    async afterRecordDelete(item) { }
    publish(type, data) {
        let callbacks = [...this.subscribers[type]];
        for (let callback of callbacks) {
            callback(data);
        }
        let sub = this.recordsSubscribers.get(this.getId(data));
        if (sub) {
            let localCallbacks = [...sub[type]];
            for (let localCallback of localCallbacks) {
                localCallback(data);
            }
        }
    }
    subscribe(type, cb) {
        if (!this.subscribers[type].includes(cb)) {
            this.subscribers[type].push(cb);
        }
    }
    unsubscribe(type, cb) {
        let index = this.subscribers[type].indexOf(cb);
        if (index != -1) {
            this.subscribers[type].splice(index, 1);
        }
    }
    /**
    * Add a callback that ll be triggered when a new item is stored
    */
    onCreated(cb) {
        this.subscribe('created', cb);
    }
    /**
     * Remove a created callback
     */
    offCreated(cb) {
        this.unsubscribe('created', cb);
    }
    /**
     * Add a callback that ll be triggered when an item is updated
     */
    onUpdated(cb) {
        this.subscribe('updated', cb);
    }
    /**
     * Remove an updated callback
     */
    offUpdated(cb) {
        this.unsubscribe('updated', cb);
    }
    /**
     * Add a callback that ll be triggered when an item is deleted
     */
    onDeleted(cb) {
        this.subscribe('deleted', cb);
    }
    /**
     * Remove an deleted callback
     */
    offDeleted(cb) {
        this.unsubscribe('deleted', cb);
    }
    /**
     * Get an item by id if exist (alias for getById)
     */
    async get(id) {
        return await this.getById(id);
    }
    ;
    /**
     * Get an item by id if exist (alias for getById)
     */
    async getWithError(id) {
        return await this.getByIdWithError(id);
    }
    ;
    /**
     * Get an item by id if exist
     */
    async getById(id) {
        let action = await this.getByIdWithError(id);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    /**
     * Get an item by id if exist
     */
    async getByIdWithError(id) {
        return this.actionGuard.run(['getByIdWithError', id], async () => {
            let action = new ResultRamWithError();
            await this.beforeGetById(id, action);
            if (action.success) {
                if (this.records.has(id)) {
                    action.result = this.records.get(id);
                    await this.afterGetById(action);
                }
                else {
                    action.errors.push(new RamError(RamErrorCode.noItemInsideRam, "can't find the item " + id + " inside ram"));
                }
            }
            return action;
        });
    }
    /**
     * Trigger before getting an item by id
     */
    async beforeGetById(id, result) { }
    ;
    /**
     * Trigger after getting an item by id
     */
    async afterGetById(result) { }
    ;
    /**
     * Get multiple items by ids
     */
    async getByIds(ids) {
        let result = await this.getByIdsWithError(ids);
        if (result.success) {
            return result.result ?? [];
        }
        return [];
    }
    ;
    /**
     * Get multiple items by ids
     */
    async getByIdsWithError(ids) {
        return this.actionGuard.run(['getByIdsWithError', ids], async () => {
            let action = new ResultRamWithError();
            action.result = [];
            await this.beforeGetByIds(ids, action);
            if (action.success) {
                action.result = [];
                for (let id of ids) {
                    let rec = this.records.get(id);
                    if (rec) {
                        action.result.push(rec);
                    }
                    else {
                        action.errors.push(new RamError(RamErrorCode.noItemInsideRam, "can't find the item " + id + " inside ram"));
                    }
                }
                if (action.success) {
                    await this.afterGetByIds(action);
                }
            }
            return action;
        });
    }
    ;
    /**
     * Trigger before getting a list of items by id
     */
    async beforeGetByIds(ids, result) { }
    ;
    /**
     * Trigger after getting a list of items by id
     */
    async afterGetByIds(result) { }
    ;
    /**
     * Get all elements inside the Ram
     */
    async getAll() {
        let result = await this.getAllWithError();
        if (result.success) {
            return result.result ?? new Map();
        }
        return new Map();
    }
    /**
     * Get all elements inside the Ram
     */
    async getAllWithError() {
        return this.actionGuard.run(['getAllWithError'], async () => {
            let action = new ResultRamWithError();
            action.result = new Map();
            await this.beforeGetAll(action);
            if (action.success) {
                action.result = this.records;
                await this.afterGetAll(action);
            }
            return action;
        });
    }
    /**
     * Trigger before getting all items inside Ram
     */
    async beforeGetAll(result) { }
    ;
    /**
     * Trigger after getting all items inside Ram
     */
    async afterGetAll(result) { }
    ;
    /**
     * Get all elements inside the Ram
     */
    async getList() {
        let data = await this.getAll();
        return Array.from(data.values());
    }
    ;
    /**
     * Get all elements inside the Ram
     */
    async getListWithError() {
        let action = new ResultRamWithError();
        action.result = [];
        let result = await this.getAllWithError();
        if (result.success) {
            if (result.result) {
                action.result = Array.from(result.result.values());
            }
            else {
                action.result = [];
            }
        }
        else {
            action.errors = result.errors;
        }
        return action;
    }
    /**
     * Create a list of items inside ram
     */
    async createList(list) {
        let result = await this.createListWithError(list);
        return result.result ?? [];
    }
    /**
     * Create a list of items inside ram
     */
    async createListWithError(list) {
        list = this.removeWatch(list);
        let action = new ResultRamWithError();
        action.result = [];
        await this.beforeCreateList(list, action);
        if (action.success) {
            if (action.result.length > 0) {
                list = action.result;
                action.result = [];
            }
            for (let item of list) {
                let resultItem = await this._create(item, true);
                if (resultItem.success && resultItem.result) {
                    action.result.push(resultItem.result);
                }
                else {
                    action.errors = [...action.errors, ...resultItem.errors];
                }
            }
            if (action.success) {
                await this.afterCreateList(action);
            }
        }
        return action;
    }
    /**
     * Create an item inside ram
     */
    async create(item, ...args) {
        let action = await this.createWithError(item, args);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    /**
     * Create an item inside ram
     */
    async createWithError(item, ...args) {
        return await this._create(item, false);
    }
    async _create(item, fromList) {
        item = this.removeWatch(item);
        return this.actionGuard.run(['_create', item], async () => {
            let action = new ResultRamWithError();
            await this.beforeCreateItem(item, fromList, action);
            if (action.success) {
                if (action.result) {
                    item = action.result;
                }
                let resultTemp = this.getIdWithError(item);
                if (resultTemp.success) {
                    await this.addOrUpdateData(item, action);
                    if (!action.success) {
                        return action;
                    }
                    await this.afterCreateItem(action, fromList);
                    if (!action.success) {
                        action.result = undefined;
                    }
                    else if (action.result) {
                        this.publish('created', action.result);
                    }
                }
                else {
                    action.errors = resultTemp.errors;
                }
            }
            return action;
        });
    }
    /**
     * Trigger before creating a list of items
     */
    async beforeCreateList(list, result) {
    }
    ;
    /**
     * Trigger before creating an item
     */
    async beforeCreateItem(item, fromList, result) {
    }
    ;
    /**
     * Trigger after creating an item
     */
    async afterCreateItem(result, fromList) {
    }
    ;
    /**
     * Trigger after creating a list of items
     */
    async afterCreateList(result) {
    }
    ;
    /**
     * Update a list of items inside ram
     */
    async updateList(list) {
        let result = await this.updateListWithError(list);
        return result.result ?? [];
    }
    ;
    /**
     * Update a list of items inside ram
     */
    async updateListWithError(list) {
        list = this.removeWatch(list);
        let action = new ResultRamWithError();
        action.result = [];
        await this.beforeUpdateList(list, action);
        if (action.success) {
            if (action.result.length > 0) {
                list = action.result;
                action.result = [];
            }
            for (let item of list) {
                let resultItem = await this._update(item, true);
                if (resultItem.success && resultItem.result) {
                    action.result.push(resultItem.result);
                }
                else {
                    action.errors = [...action.errors, ...resultItem.errors];
                }
            }
            if (action.success) {
                await this.afterUpdateList(action);
            }
        }
        return action;
    }
    ;
    /**
     * Update an item inside ram
     */
    async update(item, ...args) {
        let action = await this.updateWithError(item, args);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    /**
     * Update an item inside ram
     */
    async updateWithError(item, ...args) {
        return await this._update(item, false);
    }
    async _update(item, fromList) {
        item = this.removeWatch(item);
        return this.actionGuard.run(['_update', item], async () => {
            let action = new ResultRamWithError();
            let resultTemp = await this.getIdWithError(item);
            if (resultTemp.success && resultTemp.result !== undefined) {
                let key = resultTemp.result;
                if (this.records.has(key)) {
                    if (this.records.get(key) == item) {
                        console.warn("You are updating the same item. You should clone the object first to avoid weird effect");
                    }
                    await this.beforeUpdateItem(item, fromList, action);
                    if (!action.success) {
                        return action;
                    }
                    if (action.result) {
                        item = action.result;
                    }
                    await this.addOrUpdateData(item, action);
                    if (!action.success) {
                        return action;
                    }
                    await this.afterUpdateItem(action, fromList);
                    if (!action.success) {
                        action.result = undefined;
                    }
                    else if (action.result) {
                        this.publish('updated', action.result);
                    }
                }
                else {
                    action.errors.push(new RamError(RamErrorCode.noItemInsideRam, "can't update the item " + key + " because it wasn't found inside ram"));
                }
            }
            else {
                action.errors = resultTemp.errors;
            }
            return action;
        });
    }
    ;
    /**
     * Trigger before updating a list of items
     */
    async beforeUpdateList(list, result) {
    }
    ;
    /**
    * Trigger before updating an item
    */
    async beforeUpdateItem(item, fromList, result) {
    }
    ;
    /**
     * Trigger after updating an item
     */
    async afterUpdateItem(result, fromList) {
    }
    ;
    /**
     * Trigger after updating a list of items
     */
    async afterUpdateList(result) {
    }
    ;
    /**
     * Delete a list of items inside ram
     */
    async deleteList(list) {
        let result = await this.deleteListWithError(list);
        return result.result ?? [];
    }
    ;
    /**
     * Delete a list of items inside ram
     */
    async deleteListWithError(list) {
        list = this.removeWatch(list);
        let action = new ResultRamWithError();
        action.result = [];
        let deleteResult = new VoidWithError();
        await this.beforeDeleteList(list, deleteResult);
        if (!deleteResult.success) {
            action.errors = deleteResult.errors;
        }
        for (let item of list) {
            let resultItem = await this._delete(item, true);
            if (resultItem.success && resultItem.result) {
                action.result.push(resultItem.result);
            }
            else {
                action.errors = [...action.errors, ...resultItem.errors];
            }
        }
        if (action.success) {
            await this.afterDeleteList(action);
        }
        return action;
    }
    ;
    /**
     * Delete an item inside ram
     */
    async delete(item, ...args) {
        let action = await this.deleteWithError(item, args);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    ;
    /**
    * Delete an item inside ram
    */
    async deleteWithError(item, ...args) {
        return await this._delete(item, false);
    }
    ;
    /**
     * Delete an item by id inside ram
     */
    async deleteById(id) {
        let action = await this.deleteByIdWithError(id);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    /**
    * Delete an item by id inside ram
    */
    async deleteByIdWithError(id) {
        let item = this.records.get(id);
        if (item) {
            return await this._delete(item, false);
        }
        let result = new ResultRamWithError();
        result.errors.push(new RamError(RamErrorCode.noItemInsideRam, "can't delete the item " + id + " because it wasn't found inside ram"));
        return result;
    }
    async _delete(item, fromList) {
        item = this.removeWatch(item);
        return this.actionGuard.run(['_delete', item], async () => {
            let action = new ResultRamWithError();
            let resultTemp = await this.getIdWithError(item);
            if (resultTemp.success && resultTemp.result) {
                let key = resultTemp.result;
                let oldItem = this.records.get(key);
                if (oldItem) {
                    let deleteResult = new VoidWithError();
                    await this.beforeDeleteItem(oldItem, fromList, deleteResult);
                    if (!deleteResult.success) {
                        action.errors = deleteResult.errors;
                        return action;
                    }
                    this.beforeRecordDelete(oldItem);
                    this.records.delete(key);
                    this.afterRecordDelete(oldItem);
                    action.result = oldItem;
                    await this.afterDeleteItem(action, fromList);
                    if (!action.success) {
                        action.result = undefined;
                    }
                    else {
                        this.publish('deleted', action.result);
                    }
                    this.recordsSubscribers.delete(key);
                }
                else {
                    action.errors.push(new RamError(RamErrorCode.noItemInsideRam, "can't delete the item " + key + " because it wasn't found inside ram"));
                }
            }
            else {
                action.errors = resultTemp.errors;
            }
            return action;
        });
    }
    /**
     * Trigger before deleting a list of items
     */
    async beforeDeleteList(list, result) { }
    ;
    /**
     * Trigger before deleting an item
     */
    async beforeDeleteItem(item, fromList, result) { }
    ;
    /**
     * Trigger after deleting an item
     */
    async afterDeleteItem(result, fromList) { }
    ;
    /**
     * Trigger after deleting a list of items
     */
    async afterDeleteList(result) { }
}
GenericRam.Namespace=`Aventus`;
__as1(_, 'GenericRam', GenericRam);

let Ram=class Ram extends GenericRam {
}
Ram.Namespace=`Aventus`;
__as1(_, 'Ram', Ram);

let HttpError=class HttpError extends GenericError {
}
HttpError.Namespace=`Aventus`;
__as1(_, 'HttpError', HttpError);

let HttpRequest=class HttpRequest {
    static options;
    static configure(options) {
        this.options = options;
    }
    request;
    url;
    methodSpoofing = false;
    constructor(url, method = HttpMethod.GET, body, methodSpoofing = false) {
        this.url = url;
        this.request = {};
        this.methodSpoofing = methodSpoofing;
        this.setMethod(method);
        this.prepareBody(body);
    }
    setUrl(url) {
        this.url = url;
    }
    toString() {
        return this.url + " : " + JSON.stringify(this.request);
    }
    setBody(body) {
        this.prepareBody(body);
    }
    setMethod(method) {
        this.request.method = method;
    }
    /**
     * Replace method Put/Delete by _method:"put" inside a form
     */
    enableMethodSpoofing() {
        this.methodSpoofing = true;
    }
    objectToFormData(obj, formData, parentKey) {
        formData = formData || new FormData();
        let byPass = obj;
        if (byPass.__isProxy) {
            obj = byPass.getTarget();
        }
        const keys = obj.toJSON ? Object.keys(obj.toJSON()) : Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let value = obj[key];
            const newKey = parentKey ? `${parentKey}[${key}]` : key;
            if (value instanceof Date) {
                formData.append(newKey, DateConverter.converter.toString(value));
            }
            else if (typeof value === 'object' &&
                value !== null &&
                !(value instanceof File)) {
                if (Array.isArray(value)) {
                    for (let j = 0; j < value.length; j++) {
                        const arrayKey = `${newKey}[${j}]`;
                        this.objectToFormData({ [arrayKey]: value[j] }, formData);
                    }
                }
                else {
                    this.objectToFormData(value, formData, newKey);
                }
            }
            else {
                if (value === undefined || value === null) {
                    value = "";
                }
                else if (Watcher.is(value)) {
                    value = Watcher.extract(value);
                }
                formData.append(newKey, value);
            }
        }
        return formData;
    }
    jsonReplacer(key, value) {
        if (this[key] instanceof Date) {
            return DateConverter.converter.toString(this[key]);
        }
        return value;
    }
    prepareBody(data) {
        if (!data) {
            return;
        }
        else if (data instanceof FormData) {
            this.request.body = data;
        }
        else {
            let useFormData = false;
            const analyseFormData = (obj) => {
                for (let key in obj) {
                    if (obj[key] instanceof File) {
                        useFormData = true;
                        break;
                    }
                    else if (Array.isArray(obj[key]) && obj[key].length > 0 && obj[key][0] instanceof File) {
                        useFormData = true;
                        break;
                    }
                    else if (typeof obj[key] == 'object' && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
                        analyseFormData(obj[key]);
                        if (useFormData) {
                            break;
                        }
                    }
                }
            };
            analyseFormData(data);
            if (useFormData) {
                this.request.body = this.objectToFormData(data);
            }
            else {
                this.request.body = JSON.stringify(data, this.jsonReplacer);
                this.setHeader("Content-Type", "Application/json");
            }
        }
        if (this.methodSpoofing) {
            if (this.request.method?.toLowerCase() == Aventus.HttpMethod.PUT) {
                if (this.request.body instanceof FormData) {
                    this.request.body.append("_method", Aventus.HttpMethod.PUT);
                    this.request.method = Aventus.HttpMethod.POST;
                }
            }
            else if (this.request.method?.toLowerCase() == Aventus.HttpMethod.DELETE) {
                if (this.request.body instanceof FormData) {
                    this.request.body.append("_method", Aventus.HttpMethod.DELETE);
                    this.request.method = Aventus.HttpMethod.POST;
                }
            }
        }
    }
    setHeader(name, value) {
        if (!this.request.headers) {
            this.request.headers = [];
        }
        this.request.headers.push([name, value]);
    }
    setCredentials(credentials) {
        this.request.credentials = credentials;
    }
    async _query(router) {
        let result = new ResultWithError();
        try {
            const isFull = this.url.match("https?://");
            if (!this.url.startsWith("/") && !isFull) {
                this.url = "/" + this.url;
            }
            if (HttpRequest.options?.beforeSend) {
                const beforeSendResult = await HttpRequest.options.beforeSend(this);
                result.errors = beforeSendResult.errors;
            }
            const fullUrl = isFull ? this.url : router ? router.options.url + this.url : this.url;
            result.result = await fetch(fullUrl, this.request);
        }
        catch (e) {
            result.errors.push(new HttpError(HttpErrorCode.unknow, e));
        }
        return result;
    }
    async query(router) {
        let result = await this._query(router);
        if (HttpRequest.options?.responseMiddleware) {
            result = await HttpRequest.options.responseMiddleware(result, this);
        }
        return result;
    }
    async queryVoid(router) {
        let resultTemp = await this.query(router);
        let result = new VoidWithError();
        if (!resultTemp.success) {
            result.errors = resultTemp.errors;
            return result;
        }
        try {
            if (!resultTemp.result) {
                return result;
            }
            if (resultTemp.result.status != 204) {
                let tempResult = Converter.transform(await resultTemp.result.json());
                if (tempResult instanceof VoidWithError) {
                    for (let error of tempResult.errors) {
                        result.errors.push(error);
                    }
                }
            }
        }
        catch (e) {
        }
        return result;
    }
    async queryJSON(router) {
        let resultTemp = await this.query(router);
        let result = new ResultWithError();
        if (!resultTemp.success) {
            result.errors = resultTemp.errors;
            return result;
        }
        try {
            if (!resultTemp.result) {
                return result;
            }
            let tempResult = Converter.transform(await resultTemp.result.json());
            if (tempResult instanceof VoidWithError) {
                for (let error of tempResult.errors) {
                    result.errors.push(error);
                }
                if (tempResult instanceof ResultWithError) {
                    result.result = tempResult.result;
                }
            }
            else {
                result.result = tempResult;
            }
        }
        catch (e) {
            result.errors.push(new HttpError(HttpErrorCode.unknow, e));
        }
        return result;
    }
    async queryTxt(router) {
        let resultTemp = await this.query(router);
        let result = new ResultWithError();
        if (!resultTemp.success) {
            result.errors = resultTemp.errors;
            return result;
        }
        try {
            if (!resultTemp.result) {
                return result;
            }
            result.result = await resultTemp.result.text();
        }
        catch (e) {
            result.errors.push(new HttpError(HttpErrorCode.unknow, e));
        }
        return result;
    }
    async queryBlob(router) {
        let resultTemp = await this.query(router);
        let result = new ResultWithError();
        if (!resultTemp.success) {
            result.errors = resultTemp.errors;
            return result;
        }
        try {
            if (!resultTemp.result) {
                return result;
            }
            result.result = await resultTemp.result.blob();
        }
        catch (e) {
            result.errors.push(new HttpError(HttpErrorCode.unknow, e));
        }
        return result;
    }
}
HttpRequest.Namespace=`Aventus`;
__as1(_, 'HttpRequest', HttpRequest);

let HttpRouter=class HttpRouter {
    options;
    constructor() {
        this.options = this.defineOptions(this.defaultOptionsValue());
    }
    defaultOptionsValue() {
        return {
            url: location.protocol + "//" + location.host
        };
    }
    defineOptions(options) {
        return options;
    }
    async get(url) {
        return await new HttpRequest(url).queryJSON(this);
    }
    async post(url, data) {
        return await new HttpRequest(url, HttpMethod.POST, data).queryJSON(this);
    }
    async put(url, data) {
        return await new HttpRequest(url, HttpMethod.PUT, data).queryJSON(this);
    }
    async delete(url, data) {
        return await new HttpRequest(url, HttpMethod.DELETE, data).queryJSON(this);
    }
    async option(url, data) {
        return await new HttpRequest(url, HttpMethod.OPTION, data).queryJSON(this);
    }
}
HttpRouter.Namespace=`Aventus`;
__as1(_, 'HttpRouter', HttpRouter);

let HttpRoute=class HttpRoute {
    router;
    constructor(router) {
        this.router = router ?? new HttpRouter();
    }
    getPrefix() {
        return "";
    }
}
HttpRoute.Namespace=`Aventus`;
__as1(_, 'HttpRoute', HttpRoute);


for(let key in _) { Aventus[key] = _[key] }
})(Aventus);

var MaterialIcon;
(MaterialIcon||(MaterialIcon = {}));
(function (MaterialIcon) {
const __as1 = (o, k, c) => { if (o[k] !== undefined) for (let w in o[k]) { c[w] = o[k][w] } o[k] = c; }
const moduleName = `MaterialIcon`;
const _ = {};


let _n;
const Icon = class Icon extends Aventus.WebComponent {
    static get observedAttributes() {return ["icon", "type", "fill"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'is_hidden'() { return this.getBoolAttr('is_hidden') }
    set 'is_hidden'(val) { this.setBoolAttr('is_hidden', val) }get 'no_check'() { return this.getBoolAttr('no_check') }
    set 'no_check'(val) { this.setBoolAttr('no_check', val) }    get 'icon'() { return this.getStringProp('icon') }
    set 'icon'(val) { this.setStringAttr('icon', val) }get 'type'() { return this.getStringProp('type') }
    set 'type'(val) { this.setStringAttr('type', val) }get 'fill'() { return this.getBoolProp('fill') }
    set 'fill'(val) { this.setBoolAttr('fill', val) }    static defaultType = 'outlined';
    __registerPropertiesActions() { super.__registerPropertiesActions(); this.__addPropertyActions("icon", ((target) => {
    if (target.isReady) {
        target.init();
    }
}));this.__addPropertyActions("type", ((target) => {
    if (target.isReady)
        target.loadFont();
}));this.__addPropertyActions("fill", ((target) => {
    if (target.isReady)
        target.loadFont();
})); }
    static __style = `:host{--_material-icon-animation-duration: var(--material-icon-animation-duration, 1.75s)}:host{direction:ltr;display:inline-block;font-family:"Material Symbols Outlined";-moz-font-feature-settings:"liga";font-size:24px;-moz-osx-font-smoothing:grayscale;font-style:normal;font-weight:normal;letter-spacing:normal;line-height:1;text-transform:none;white-space:nowrap;word-wrap:normal}:host .icon{direction:inherit;display:inline-block;font-family:inherit;-moz-font-feature-settings:inherit;font-size:inherit;-moz-osx-font-smoothing:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;text-transform:inherit;white-space:inherit;word-wrap:inherit}:host([is_hidden]){opacity:0}:host([type=sharp]){font-family:"Material Symbols Sharp"}:host([type=rounded]){font-family:"Material Symbols Rounded"}:host([type=outlined]){font-family:"Material Symbols Outlined"}:host([fill]){font-variation-settings:"FILL" 1}:host([spin]){animation:spin var(--_material-icon-animation-duration) linear infinite}:host([reverse_spin]){animation:reverse-spin var(--_material-icon-animation-duration) linear infinite}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes reverse-spin{0%{transform:rotate(360deg)}100%{transform:rotate(0deg)}}`;
    __getStatic() {
        return Icon;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Icon.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="icon" _id="icon_0"></div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "iconEl",
      "ids": [
        "icon_0"
      ]
    }
  ]
}); }
    getClassName() {
        return "Icon";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('is_hidden')) {this.setAttribute('is_hidden' ,'true'); }if(!this.hasAttribute('no_check')) { this.attributeChangedCallback('no_check', false, false); }if(!this.hasAttribute('icon')){ this['icon'] = "check_box_outline_blank"; }if(!this.hasAttribute('type')){ this['type'] = Icon.defaultType; }if(!this.hasAttribute('fill')) { this.attributeChangedCallback('fill', false, false); } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('is_hidden');this.__upgradeProperty('no_check');this.__upgradeProperty('icon');this.__upgradeProperty('type');this.__upgradeProperty('fill'); }
    __listBoolProps() { return ["is_hidden","no_check","fill"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    async loadFont() {
        if (!this.type)
            return;
        const name = this.type.charAt(0).toUpperCase() + this.type.slice(1);
        let fontsName = [
            'Material Symbols ' + name,
            '"Material Symbols ' + name + '"',
        ];
        const check = () => {
            for (let font of document.fonts) {
                if (fontsName.includes(font.family)) {
                    this.is_hidden = false;
                    return true;
                }
            }
            return false;
        };
        if (check()) {
            return;
        }
        const cb = (e) => {
            check();
            document.fonts.removeEventListener("loadingdone", cb);
        };
        document.fonts.addEventListener("loadingdone", cb);
        let url = 'https://fonts.googleapis.com/css2?family=Material+Symbols+' + name + ":FILL@0..1";
        await Aventus.ResourceLoader.loadInHead({
            type: "css",
            url: url
        });
        setTimeout(() => {
            check();
        }, 100);
    }
    async init() {
        if (!this.no_check) {
            await this.loadFont();
        }
        else {
            this.is_hidden = false;
        }
        this.iconEl.innerHTML = this.icon;
    }
    postCreation() {
        this.init();
    }
}
Icon.Namespace=`MaterialIcon`;
Icon.Tag=`mi-icon`;
__as1(_, 'Icon', Icon);
if(!window.customElements.get('mi-icon')){window.customElements.define('mi-icon', Icon);Aventus.WebComponentInstance.registerDefinition(Icon);}


for(let key in _) { MaterialIcon[key] = _[key] }
})(MaterialIcon);

var AventusPhp;
(AventusPhp||(AventusPhp = {}));
(function (AventusPhp) {
const __as1 = (o, k, c) => { if (o[k] !== undefined) for (let w in o[k]) { c[w] = o[k][w] } o[k] = c; }
const moduleName = `AventusPhp`;
const _ = {};


let _n;
let AventusError=class AventusError extends Aventus.GenericError {
    static get Fullname() { return "Aventus.Laraventus.Helpers.AventusError"; }
}
AventusError.Namespace=`AventusPhp`;
AventusError.$schema={...(Aventus.GenericError?.$schema ?? {}), };
Aventus.Converter.register(AventusError.Fullname, AventusError);
__as1(_, 'AventusError', AventusError);

let LaravelResult=class LaravelResult extends Aventus.ResultWithError {
    static get Fullname() { return "Aventus.Laraventus.Helpers.LaravelResult"; }
}
LaravelResult.Namespace=`AventusPhp`;
LaravelResult.$schema={...(Aventus.ResultWithError?.$schema ?? {}), };
Aventus.Converter.register(LaravelResult.Fullname, LaravelResult);
__as1(_, 'LaravelResult', LaravelResult);

let IdsManyRequest=class IdsManyRequest {
    ids = [];
}
IdsManyRequest.Namespace=`AventusPhp`;
__as1(_, 'IdsManyRequest', IdsManyRequest);

let ItemsManyRequest=class ItemsManyRequest {
    items;
}
ItemsManyRequest.Namespace=`AventusPhp`;
__as1(_, 'ItemsManyRequest', ItemsManyRequest);

let AventusFile=class AventusFile {
    static get Fullname() { return "Aventus.Laraventus.Models.AventusFile"; }
    uri;
    upload;
    /**
     * Get the unique type for the data. Define it as the namespace + class name
     */
    get $type() {
        return this.constructor['Fullname'];
    }
    /**
     * @inerhit
     */
    toJSON() {
        let toAvoid = ['className', 'namespace'];
        return Aventus.Json.classToJson(this, {
            isValidKey: (key) => !toAvoid.includes(key),
            beforeEnd: (result) => {
                let resultTemp = {};
                if (result.$type) {
                    resultTemp.$type = result.$type;
                    for (let key in result) {
                        if (key != '$type') {
                            resultTemp[key] = result[key];
                        }
                    }
                    return resultTemp;
                }
                return result;
            }
        });
    }
}
AventusFile.Namespace=`AventusPhp`;
__as1(_, 'AventusFile', AventusFile);

let AventusImage=class AventusImage extends AventusFile {
    static get Fullname() { return "Aventus.Laraventus.Models.AventusImage"; }
}
AventusImage.Namespace=`AventusPhp`;
__as1(_, 'AventusImage', AventusImage);

let ModelController=class ModelController extends Aventus.HttpRoute {
    constructor(router) {
        super(router);
        this.index = this.index.bind(this);
        this.store = this.store.bind(this);
        this.storeMany = this.storeMany.bind(this);
        this.show = this.show.bind(this);
        this.showMany = this.showMany.bind(this);
        this.update = this.update.bind(this);
        this.updateMany = this.updateMany.bind(this);
        this.destroy = this.destroy.bind(this);
        this.destroyMany = this.destroyMany.bind(this);
    }
    getResourceDetails() {
        return undefined;
    }
    async index() {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/${this.getUri()}`, Aventus.HttpMethod.GET);
        return await request.queryJSON(this.router);
    }
    async store(body) {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/${this.getUri()}`, Aventus.HttpMethod.POST);
        request.setBody(body);
        return await request.queryJSON(this.router);
    }
    async storeMany(body) {
        const requestBody = new ItemsManyRequest();
        requestBody.items = body;
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/${this.getUri()}/many`, Aventus.HttpMethod.POST);
        request.setBody(requestBody);
        return await request.queryJSON(this.router);
    }
    async show(id) {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/${this.getUri()}/${id}`, Aventus.HttpMethod.GET);
        return await request.queryJSON(this.router);
    }
    async showMany(ids) {
        const requestBody = new IdsManyRequest();
        requestBody.ids = ids;
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/${this.getUri()}/show_many`, Aventus.HttpMethod.POST);
        request.setBody(requestBody);
        return await request.queryJSON(this.router);
    }
    async update(id, body) {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/${this.getUri()}/${id}`, Aventus.HttpMethod.PUT);
        request.enableMethodSpoofing();
        request.setBody(body);
        return await request.queryJSON(this.router);
    }
    async updateMany(body) {
        const requestBody = new ItemsManyRequest();
        requestBody.items = body;
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/${this.getUri()}/many`, Aventus.HttpMethod.PUT);
        request.enableMethodSpoofing();
        request.setBody(requestBody);
        return await request.queryJSON(this.router);
    }
    async destroy(id) {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/${this.getUri()}/${id}`, Aventus.HttpMethod.DELETE);
        return await request.queryJSON(this.router);
    }
    async destroyMany(ids) {
        const requestBody = new IdsManyRequest();
        requestBody.ids = ids;
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/${this.getUri()}/many`, Aventus.HttpMethod.DELETE);
        request.enableMethodSpoofing();
        request.setBody(requestBody);
        return await request.queryJSON(this.router);
    }
    toRequest(resource) {
        const Request = this.getRequest();
        const result = new Request();
        const resourceClone = Aventus.clone(resource);
        Aventus.Json.classFromJson(result, resourceClone, {
            replaceUndefined: true
        });
        return result;
    }
}
ModelController.Namespace=`AventusPhp`;
__as1(_, 'ModelController', ModelController);

let GenericRamHttp=class GenericRamHttp {
    /**
     * The current namespace
     */
    static Namespace = "";
    // public static get Namespace(): string { return ""; }
    /**
     * Get the unique type for the data. Define it as the namespace + class name
     */
    static get Fullname() { return this.Namespace + "." + this.name; }
    subscribers = {
        created: [],
        updated: [],
        deleted: [],
    };
    recordsSubscribers = new Map();
    /**
     * List of stored item by index key
     */
    records = new Map();
    actionGuard = new Aventus.ActionGuard();
    routes;
    getAllDone = false;
    getByIdDone = [];
    hasDetails;
    ramMapping = {};
    constructor() {
        if (this.constructor == Aventus.GenericRam) {
            throw "can't instanciate an abstract class";
        }
        this.routes = this.defineRoutes();
        if (!this.routes.getResourceDetails()) {
            this.hasDetails = false;
        }
        else {
            this.hasDetails = this.routes.getResourceDetails() != this.routes.getResource();
        }
        this.getIdWithError = this.getIdWithError.bind(this);
        this.getId = this.getId.bind(this);
        this.save = this.save.bind(this);
        this.saveWithError = this.saveWithError.bind(this);
        this.onCreated = this.onCreated.bind(this);
        this.offCreated = this.offCreated.bind(this);
        this.onUpdated = this.onUpdated.bind(this);
        this.offUpdated = this.offUpdated.bind(this);
        this.onDeleted = this.onDeleted.bind(this);
        this.offDeleted = this.offDeleted.bind(this);
        this.get = this.get.bind(this);
        this.getWithError = this.getWithError.bind(this);
        this.getById = this.getById.bind(this);
        this.getByIdWithError = this.getByIdWithError.bind(this);
        this.getByIds = this.getByIds.bind(this);
        this.getByIdsWithError = this.getByIdsWithError.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getAllWithError = this.getAllWithError.bind(this);
        this.getList = this.getList.bind(this);
        this.getListWithError = this.getListWithError.bind(this);
        this.createList = this.createList.bind(this);
        this.createListWithError = this.createListWithError.bind(this);
        this.create = this.create.bind(this);
        this.createWithError = this.createWithError.bind(this);
        this.updateList = this.updateList.bind(this);
        this.updateListWithError = this.updateListWithError.bind(this);
        this.update = this.update.bind(this);
        this.updateWithError = this.updateWithError.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.deleteListWithError = this.deleteListWithError.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteWithError = this.deleteWithError.bind(this);
        this.deleteById = this.deleteById.bind(this);
        this.deleteByIdWithError = this.deleteByIdWithError.bind(this);
    }
    /**
    * Define all the types you ram is capable of
    */
    ramForTypes() {
        return [this.getTypeForData({})];
    }
    /**
     * Get item id
     */
    getIdWithError(item) {
        let action = new Aventus.ResultRamWithError();
        let idTemp = item[this.defineIndexKey()];
        if (idTemp !== undefined) {
            action.result = idTemp;
        }
        else {
            action.errors.push(new Aventus.RamError(Aventus.RamErrorCode.noId, "no key found for item"));
        }
        return action;
    }
    /**
     * Get item id
     */
    getId(item) {
        let result = this.getIdWithError(item);
        if (result.success) {
            return result.result;
        }
        throw 'no key found for item';
    }
    isResource(item) {
        const ResourceType = this.routes.getResource();
        const ResourceDetailsType = this.routes.getResourceDetails();
        if (item instanceof ResourceType) {
            return true;
        }
        if (ResourceDetailsType) {
            return item instanceof ResourceDetailsType;
        }
        return false;
    }
    toRequest(resource) {
        return this.routes.toRequest(resource);
    }
    /**
     * Prevent adding Watch element
     */
    removeWatch(element) {
        let byPass = element;
        if (byPass.__isProxy) {
            return byPass.getTarget();
        }
        return element;
    }
    /**
     * Add function update, onUpdate, offUpdate, delete, onDelete, offDelete
     */
    addRamAction(Base) {
        let that = this;
        return class ActionClass extends Base {
            static get className() {
                return Base.className || Base.name;
            }
            get className() {
                return Base.className || Base.name;
            }
            async update(newData) {
                let id = that.getId(this);
                let oldData = that.records.get(id);
                if (oldData) {
                    let result = await that.update(newData);
                    return result;
                }
                return undefined;
            }
            async updateWithError(newData) {
                const result = new Aventus.ResultRamWithError();
                let queryId = that.getIdWithError(this);
                if (!queryId.success || !queryId.result) {
                    result.errors = queryId.errors;
                    return result;
                }
                let oldData = that.records.get(queryId.result);
                if (oldData) {
                    let result = await that.updateWithError(newData);
                    return result;
                }
                result.errors.push(new Aventus.RamError(Aventus.RamErrorCode.noItemInsideRam, "Can't find this item inside the ram"));
                return result;
            }
            onUpdate(callback) {
                let id = that.getId(this);
                if (!that.recordsSubscribers.has(id)) {
                    that.recordsSubscribers.set(id, {
                        created: [],
                        updated: [],
                        deleted: []
                    });
                }
                let sub = that.recordsSubscribers.get(id);
                if (sub && !sub.updated.includes(callback)) {
                    sub.updated.push(callback);
                }
            }
            offUpdate(callback) {
                let id = that.getId(this);
                let sub = that.recordsSubscribers.get(id);
                if (sub) {
                    let index = sub.updated.indexOf(callback);
                    if (index != -1) {
                        sub.updated.splice(index, 1);
                    }
                }
            }
            async delete() {
                let id = that.getId(this);
                await that.deleteById(id);
            }
            async deleteWithError() {
                const result = new Aventus.VoidRamWithError();
                let queryId = that.getIdWithError(this);
                if (!queryId.success || !queryId.result) {
                    result.errors = queryId.errors;
                    return result;
                }
                const queryDelete = await that.deleteByIdWithError(queryId.result);
                result.errors = queryDelete.errors;
                return result;
            }
            onDelete(callback) {
                let id = that.getId(this);
                if (!that.recordsSubscribers.has(id)) {
                    that.recordsSubscribers.set(id, {
                        created: [],
                        updated: [],
                        deleted: []
                    });
                }
                let sub = that.recordsSubscribers.get(id);
                if (sub && !sub.deleted.includes(callback)) {
                    sub.deleted.push(callback);
                }
            }
            offDelete(callback) {
                let id = that.getId(this);
                let sub = that.recordsSubscribers.get(id);
                if (sub) {
                    let index = sub.deleted.indexOf(callback);
                    if (index != -1) {
                        sub.deleted.splice(index, 1);
                    }
                }
            }
        };
    }
    getTypeForData(objJson) {
        return this.routes.getResourceDetails() ?? this.routes.getResource();
    }
    /**
     * Transform the object into the object stored inside Ram
     */
    getObjectForRam(objJson) {
        let T = this.addRamAction(this.getTypeForData(objJson));
        let item = new T();
        this.mergeObject(item, objJson);
        return item;
    }
    /**
     * Add element inside Ram or update it. The instance inside the ram is unique and ll never be replaced
     */
    async addOrUpdateData(item, result, options) {
        let resultTemp = null;
        try {
            let idWithError = this.getIdWithError(item);
            if (idWithError.success && idWithError.result !== undefined) {
                let id = idWithError.result;
                if (this.records.has(id)) {
                    let uniqueRecord = this.records.get(id);
                    await this.beforeRecordSet(uniqueRecord);
                    this.mergeObject(uniqueRecord, item, options);
                    await this.afterRecordSet(uniqueRecord);
                    resultTemp = 'updated';
                }
                else {
                    let realObject = this.getObjectForRam(item);
                    await this.beforeRecordSet(realObject);
                    this.records.set(id, realObject);
                    await this.afterRecordSet(realObject);
                    resultTemp = 'created';
                }
                result.result = this.records.get(id);
            }
            else {
                result.errors = [...result.errors, ...idWithError.errors];
                resultTemp = null;
            }
        }
        catch (e) {
            result.errors.push(new Aventus.RamError(Aventus.RamErrorCode.unknow, e));
            resultTemp = null;
        }
        return resultTemp;
    }
    /**
     * Merge object and create real instance of class
     */
    mergeObject(item, objJson, options) {
        if (!item) {
            return;
        }
        if (!options) {
            options = {
                replaceUndefined: true
            };
        }
        Aventus.Json.classFromJson(item, objJson, options);
    }
    /**
     * Create or update the item
     */
    async save(item, ...args) {
        let action = await this.saveWithError(item, ...args);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    /**
     * Create or update the item
     */
    async saveWithError(item, ...args) {
        let action = new Aventus.ResultRamWithError();
        let resultTemp = await this.getIdWithError(item);
        if (resultTemp.success && resultTemp.result !== undefined) {
            if (resultTemp.result) {
                return this.updateWithError(item, ...args);
            }
            else {
                return this.createWithError(item, ...args);
            }
        }
        else {
            action.errors = resultTemp.errors;
        }
        return action;
    }
    async beforeRecordSet(item) { }
    async afterRecordSet(item) { }
    async beforeRecordDelete(item) { }
    async afterRecordDelete(item) { }
    publish(type, data) {
        let callbacks = [...this.subscribers[type]];
        for (let callback of callbacks) {
            callback(data);
        }
        let sub = this.recordsSubscribers.get(this.getId(data));
        if (sub) {
            let localCallbacks = [...sub[type]];
            for (let localCallback of localCallbacks) {
                localCallback(data);
            }
        }
    }
    subscribe(type, cb) {
        if (!this.subscribers[type].includes(cb)) {
            this.subscribers[type].push(cb);
        }
    }
    unsubscribe(type, cb) {
        let index = this.subscribers[type].indexOf(cb);
        if (index != -1) {
            this.subscribers[type].splice(index, 1);
        }
    }
    /**
    * Add a callback that ll be triggered when a new item is stored
    */
    onCreated(cb) {
        this.subscribe('created', cb);
    }
    /**
     * Remove a created callback
     */
    offCreated(cb) {
        this.unsubscribe('created', cb);
    }
    /**
     * Add a callback that ll be triggered when an item is updated
     */
    onUpdated(cb) {
        this.subscribe('updated', cb);
    }
    /**
     * Remove an updated callback
     */
    offUpdated(cb) {
        this.unsubscribe('updated', cb);
    }
    /**
     * Add a callback that ll be triggered when an item is deleted
     */
    onDeleted(cb) {
        this.subscribe('deleted', cb);
    }
    /**
     * Remove an deleted callback
     */
    offDeleted(cb) {
        this.unsubscribe('deleted', cb);
    }
    /**
     * Get an item by id if exist (alias for getById)
     */
    async get(id) {
        return await this.getById(id);
    }
    ;
    /**
     * Get an item by id if exist (alias for getById)
     */
    async getWithError(id) {
        return await this.getByIdWithError(id);
    }
    ;
    /**
     * Get an item by id if exist
     */
    async getById(id) {
        let action = await this.getByIdWithError(id);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    /**
     * Get an item by id if exist
     */
    async getByIdWithError(id) {
        return this.actionGuard.run(['getByIdWithError', id], async () => {
            let action = new Aventus.ResultRamWithError();
            await this.beforeGetById(id, action);
            await this.queryGetById(id, action);
            if (action.success) {
                if (this.records.has(id)) {
                    action.result = this.records.get(id);
                    await this.afterGetById(action);
                }
                else {
                    action.errors.push(new Aventus.RamError(Aventus.RamErrorCode.noItemInsideRam, "can't find the item " + id + " inside ram"));
                }
            }
            return action;
        });
    }
    async queryGetById(id, result) {
        if (!this.hasDetails && this.records.has(id)) {
            return;
        }
        if (this.hasDetails && this.getByIdDone.includes(id)) {
            return;
        }
        else {
            let response = await this.routes.show(id);
            if (response.success && response.result) {
                let resultTemp = new Aventus.ResultRamWithError();
                await this.addOrUpdateData(response.result, resultTemp);
                if (!resultTemp.success) {
                    result.errors = [...result.errors, ...resultTemp.errors];
                }
                else {
                    result.result = resultTemp.result;
                    if (this.hasDetails) {
                        this.getByIdDone.push(id);
                    }
                }
            }
            else {
                result.errors = [...result.errors, ...response.errors];
            }
        }
    }
    /**
     * Trigger before getting an item by id
     */
    async beforeGetById(id, result) { }
    ;
    /**
     * Trigger after getting an item by id
     */
    async afterGetById(result) { }
    ;
    /**
     * Get multiple items by ids
     */
    async getByIds(ids) {
        let result = await this.getByIdsWithError(ids);
        if (result.success) {
            return result.result ?? [];
        }
        return [];
    }
    /**
     * Get multiple items by ids
     */
    async getByIdsWithError(ids) {
        return this.actionGuard.run(['getByIdsWithError', ids], async () => {
            let action = new Aventus.ResultRamWithError();
            action.result = [];
            await this.queryGetByIds(ids, action);
            await this.beforeGetByIds(ids, action);
            if (action.success) {
                action.result = [];
                for (let id of ids) {
                    let rec = this.records.get(id);
                    if (rec) {
                        action.result.push(rec);
                    }
                    else {
                        action.errors.push(new Aventus.RamError(Aventus.RamErrorCode.noItemInsideRam, "can't find the item " + id + " inside ram"));
                    }
                }
                if (action.success) {
                    await this.afterGetByIds(action);
                }
            }
            return action;
        });
    }
    async queryGetByIds(ids, result) {
        let missingIds = [];
        if (this.hasDetails) {
            for (let id of ids) {
                if (!this.getByIdDone.includes(id)) {
                    missingIds.push(id);
                }
            }
        }
        else {
            for (let id of ids) {
                if (!this.records.has(id)) {
                    missingIds.push(id);
                }
            }
        }
        if (missingIds.length > 0) {
            result.result = [];
            let response = await this.routes.showMany(missingIds);
            if (response.success && response.result) {
                for (let item of response.result) {
                    let resultTemp = new Aventus.ResultRamWithError();
                    await this.addOrUpdateData(item, resultTemp);
                    if (!resultTemp.success || !resultTemp.result) {
                        result.errors = [...result.errors, ...resultTemp.errors];
                    }
                    else if (!result.result.includes(resultTemp.result)) {
                        result.result.push(resultTemp.result);
                    }
                }
                if (this.hasDetails) {
                    for (let item of result.result) {
                        this.getByIdDone.push(this.getId(item));
                    }
                }
            }
            else {
                result.errors = [...result.errors, ...response.errors];
            }
        }
    }
    /**
     * Trigger before getting a list of items by id
     */
    async beforeGetByIds(ids, result) { }
    ;
    /**
     * Trigger after getting a list of items by id
     */
    async afterGetByIds(result) { }
    ;
    /**
     * Get all elements inside the Ram
     */
    async getAll() {
        let result = await this.getAllWithError();
        if (result.success) {
            return result.result ?? new Map();
        }
        return new Map();
    }
    /**
     * Get all elements inside the Ram
     */
    async getAllWithError() {
        return this.actionGuard.run(['getAllWithError'], async () => {
            let action = new Aventus.ResultRamWithError();
            action.result = new Map();
            await this.beforeGetAll(action);
            await this.queryGetAll(action);
            if (action.success) {
                action.result = this.records;
                await this.afterGetAll(action);
            }
            return action;
        });
    }
    async queryGetAll(result) {
        if (!this.getAllDone) {
            let response = await this.routes.index();
            if (response.success && response.result) {
                for (let item of response.result) {
                    let resultTemp = new Aventus.ResultRamWithError();
                    await this.addOrUpdateData(item, resultTemp, { replaceUndefined: false });
                    if (!resultTemp.success) {
                        result.errors = [...result.errors, ...resultTemp.errors];
                    }
                }
                this.getAllDone = true;
            }
            else {
                result.errors = [...result.errors, ...response.errors];
            }
        }
    }
    /**
     * Trigger before getting all items inside Ram
     */
    async beforeGetAll(result) { }
    ;
    /**
     * Trigger after getting all items inside Ram
     */
    async afterGetAll(result) { }
    ;
    /**
     * Get all elements inside the Ram
     */
    async getList() {
        let data = await this.getAll();
        return Array.from(data.values());
    }
    ;
    /**
     * Get all elements inside the Ram
     */
    async getListWithError() {
        let action = new Aventus.ResultRamWithError();
        action.result = [];
        let result = await this.getAllWithError();
        if (result.success) {
            if (result.result) {
                action.result = Array.from(result.result.values());
            }
            else {
                action.result = [];
            }
        }
        else {
            action.errors = result.errors;
        }
        return action;
    }
    /**
     * Create a list of items inside ram
     */
    async createList(list) {
        let result = await this.createListWithError(list);
        return result.result ?? [];
    }
    /**
     * Create a list of items inside ram
     */
    async createListWithError(list) {
        list = this.removeWatch(list);
        let actionTemp = new Aventus.ResultRamWithError();
        actionTemp.result = [];
        await this.beforeCreateList(list, actionTemp);
        let action = await this.queryCreateList(list, actionTemp);
        if (!action.result) {
            action.result = [];
        }
        if (action.success && action.result.length > 0) {
            const resources = action.result;
            action.result = [];
            for (let resource of resources) {
                let resultItem = await this._create(resource, true);
                if (resultItem.success && resultItem.result) {
                    action.result.push(resultItem.result);
                }
                else {
                    action.errors = [...action.errors, ...resultItem.errors];
                }
            }
            if (action.success) {
                await this.afterCreateList(action);
            }
        }
        return action;
    }
    /**
     * Create an item inside ram
     */
    async create(item, ...args) {
        let action = await this.createWithError(item, args);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    /**
     * Create an item inside ram
     */
    async createWithError(item, ...args) {
        return await this._create(item, false);
    }
    async _create(item, fromList) {
        item = this.removeWatch(item);
        return this.actionGuard.run(['_create', item], async () => {
            let actionTemp = new Aventus.ResultRamWithError();
            let action;
            await this.beforeCreateItem(item, fromList, actionTemp);
            if (this.isResource(item)) {
                action = new Aventus.ResultRamWithError();
                action.errors = actionTemp.errors;
            }
            else {
                action = await this.queryCreateItem(item, fromList, actionTemp);
            }
            if (action.success && action.result) {
                const resource = action.result;
                let resultTemp = this.getIdWithError(resource);
                if (resultTemp.success) {
                    await this.addOrUpdateData(resource, action);
                    if (!action.success) {
                        return action;
                    }
                    await this.afterCreateItem(action, fromList);
                    if (!action.success) {
                        action.result = undefined;
                    }
                    else if (action.result) {
                        this.publish('created', resource);
                    }
                }
                else {
                    action.errors = resultTemp.errors;
                }
            }
            return action;
        });
    }
    async queryCreateList(list, resultTemp) {
        const result = new Aventus.ResultRamWithError();
        let response = await this.routes.storeMany(list);
        if (response.success && response.result) {
            result.result = [];
            for (let element of response.result) {
                result.result.push(this.getObjectForRam(element));
            }
            if (this.hasDetails) {
                for (let element of result.result) {
                    const id = this.getId(element);
                    if (!this.getByIdDone.includes(id)) {
                        this.getByIdDone.push(id);
                    }
                }
            }
        }
        else {
            result.errors = [...result.errors, ...response.errors];
        }
        return result;
    }
    /**
     * Trigger before creating a list of items
     */
    async beforeCreateList(list, result) {
    }
    async queryCreateItem(item, fromList, resultTemp) {
        const result = new Aventus.ResultRamWithError();
        result.errors = resultTemp.errors;
        if (fromList) {
            return result;
        }
        let response = await this.routes.store(item);
        if (response.success && response.result) {
            result.result = this.getObjectForRam(response.result);
            if (this.hasDetails && result.result) {
                const id = this.getId(result.result);
                if (!this.getByIdDone.includes(id)) {
                    this.getByIdDone.push(id);
                }
            }
        }
        else {
            result.errors = [...result.errors, ...response.errors];
        }
        return result;
    }
    /**
     * Trigger before creating an item
     */
    async beforeCreateItem(item, fromList, result) {
    }
    /**
     * Trigger after creating an item
     */
    async afterCreateItem(result, fromList) {
    }
    /**
     * Trigger after creating a list of items
     */
    async afterCreateList(result) {
    }
    /**
     * Update a list of items inside ram
     */
    async updateList(list) {
        let result = await this.updateListWithError(list);
        return result.result ?? [];
    }
    ;
    /**
     * Update a list of items inside ram
     */
    async updateListWithError(list) {
        list = this.removeWatch(list);
        let actionTemp = new Aventus.ResultRamWithError();
        actionTemp.result = [];
        await this.beforeUpdateList(list, actionTemp);
        let action = await this.queryUpdateList(list, actionTemp);
        if (!action.result) {
            action.result = [];
        }
        if (action.success && action.result.length > 0) {
            const resources = action.result;
            action.result = [];
            for (let resource of resources) {
                let resultItem = await this._update(resource, true);
                if (resultItem.success && resultItem.result) {
                    action.result.push(resultItem.result);
                }
                else {
                    action.errors = [...action.errors, ...resultItem.errors];
                }
            }
            if (action.success) {
                await this.afterUpdateList(action);
            }
        }
        return action;
    }
    ;
    /**
     * Update an item inside ram
     */
    async update(item, ...args) {
        let action = await this.updateWithError(item, args);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    /**
     * Update an item inside ram
     */
    async updateWithError(item, ...args) {
        return await this._update(item, false);
    }
    async _update(item, fromList) {
        item = this.removeWatch(item);
        return this.actionGuard.run(['_update', item], async () => {
            let actionTemp = new Aventus.ResultRamWithError();
            let resultTemp = await this.getIdWithError(item);
            let actionError = new Aventus.ResultRamWithError();
            if (resultTemp.success && resultTemp.result !== undefined) {
                let key = resultTemp.result;
                if (this.records.has(key)) {
                    if (this.records.get(key) == item) {
                        console.warn("You are updating the same item. You should clone the object first to avoid weird effect");
                    }
                    await this.beforeUpdateItem(item, fromList, actionTemp);
                    let action;
                    if (this.isResource(item)) {
                        action = new Aventus.ResultRamWithError();
                        action.errors = actionTemp.errors;
                    }
                    else {
                        action = await this.queryUpdateItem(item, fromList, actionTemp);
                    }
                    if (!action.success) {
                        return action;
                    }
                    if (action.result) {
                        const resource = action.result;
                        await this.addOrUpdateData(resource, action);
                        if (!action.success) {
                            return action;
                        }
                        await this.afterUpdateItem(action, fromList);
                        if (!action.success) {
                            action.result = undefined;
                        }
                        else if (action.result) {
                            this.publish('updated', action.result);
                        }
                    }
                    return action;
                }
                else {
                    actionError.errors.push(new Aventus.RamError(Aventus.RamErrorCode.noItemInsideRam, "can't update the item " + key + " because it wasn't found inside ram"));
                }
            }
            else {
                actionError.errors = resultTemp.errors;
            }
            return actionError;
        });
    }
    async queryUpdateList(list, resultTemp) {
        const result = new Aventus.ResultRamWithError();
        result.errors = resultTemp.errors;
        let response = await this.routes.updateMany(list);
        if (response.success && response.result) {
            result.result = [];
            for (let element of response.result) {
                result.result.push(this.getObjectForRam(element));
            }
            if (this.hasDetails) {
                for (let element of result.result) {
                    const id = this.getId(element);
                    if (!this.getByIdDone.includes(id)) {
                        this.getByIdDone.push(id);
                    }
                }
            }
        }
        else {
            result.errors = [...result.errors, ...response.errors];
        }
        return result;
    }
    /**
     * Trigger before updating a list of items
     */
    async beforeUpdateList(list, result) {
    }
    async queryUpdateItem(item, fromList, resultTemp) {
        const result = new Aventus.ResultRamWithError();
        result.errors = resultTemp.errors;
        if (fromList) {
            return result;
        }
        let response = await this.routes.update(item.id, item);
        if (response.success && response.result) {
            result.result = this.getObjectForRam(response.result);
            if (this.hasDetails && result.result) {
                const id = this.getId(result.result);
                if (!this.getByIdDone.includes(id)) {
                    this.getByIdDone.push(id);
                }
            }
        }
        else {
            result.errors = [...result.errors, ...response.errors];
        }
        return result;
    }
    /**
    * Trigger before updating an item
    */
    async beforeUpdateItem(item, fromList, result) {
    }
    /**
     * Trigger after updating an item
     */
    async afterUpdateItem(result, fromList) {
    }
    /**
     * Trigger after updating a list of items
     */
    async afterUpdateList(result) {
    }
    /**
     * Delete a list of items inside ram
     */
    async deleteList(list) {
        let result = await this.deleteListWithError(list);
        return result.result ?? [];
    }
    ;
    /**
     * Delete a list of items inside ram
     */
    async deleteListWithError(list) {
        list = this.removeWatch(list);
        let action = new Aventus.ResultRamWithError();
        action.result = [];
        let deleteResult = new Aventus.VoidWithError();
        await this.beforeDeleteList(list, deleteResult);
        await this.queryDeleteList(list, deleteResult);
        if (!deleteResult.success) {
            action.errors = deleteResult.errors;
        }
        for (let item of list) {
            let resultItem = await this._delete(item, true);
            if (resultItem.success && resultItem.result) {
                action.result.push(resultItem.result);
            }
            else {
                action.errors = [...action.errors, ...resultItem.errors];
            }
        }
        if (action.success) {
            await this.afterDeleteList(action);
        }
        return action;
    }
    ;
    /**
     * Delete an item inside ram
     */
    async delete(item, ...args) {
        let action = await this.deleteWithError(item, args);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    ;
    /**
    * Delete an item inside ram
    */
    async deleteWithError(item, ...args) {
        return await this._delete(item, false);
    }
    ;
    /**
     * Delete an item by id inside ram
     */
    async deleteById(id) {
        let action = await this.deleteByIdWithError(id);
        if (action.success) {
            return action.result;
        }
        return undefined;
    }
    /**
    * Delete an item by id inside ram
    */
    async deleteByIdWithError(id) {
        let item = this.records.get(id);
        if (item) {
            return await this._delete(item, false);
        }
        let result = new Aventus.ResultRamWithError();
        result.errors.push(new Aventus.RamError(Aventus.RamErrorCode.noItemInsideRam, "can't delete the item " + id + " because it wasn't found inside ram"));
        return result;
    }
    async _delete(item, fromList) {
        item = this.removeWatch(item);
        return this.actionGuard.run(['_delete', item], async () => {
            let action = new Aventus.ResultRamWithError();
            let resultTemp = await this.getIdWithError(item);
            if (resultTemp.success && resultTemp.result) {
                let key = resultTemp.result;
                let oldItem = this.records.get(key);
                if (oldItem) {
                    let deleteResult = new Aventus.VoidWithError();
                    await this.beforeDeleteItem(oldItem, fromList, deleteResult);
                    if (!deleteResult.success) {
                        action.errors = deleteResult.errors;
                        return action;
                    }
                    await this.queryDeleteItem(oldItem, fromList, deleteResult);
                    this.beforeRecordDelete(oldItem);
                    this.records.delete(key);
                    this.afterRecordDelete(oldItem);
                    action.result = oldItem;
                    await this.afterDeleteItem(action, fromList);
                    if (!action.success) {
                        action.result = undefined;
                    }
                    else {
                        this.publish('deleted', action.result);
                    }
                    this.recordsSubscribers.delete(key);
                }
                else {
                    action.errors.push(new Aventus.RamError(Aventus.RamErrorCode.noItemInsideRam, "can't delete the item " + key + " because it wasn't found inside ram"));
                }
            }
            else {
                action.errors = resultTemp.errors;
            }
            return action;
        });
    }
    async queryDeleteList(list, result) {
        let response = await this.routes.destroyMany(list.map(t => t.id));
        if (!response.success) {
            result.errors = [...result.errors, ...response.errors];
        }
        else if (this.hasDetails) {
            for (let item of list) {
                const id = this.getId(item);
                const index = this.getByIdDone.indexOf(id);
                if (index != -1) {
                    this.getByIdDone.splice(index, 1);
                }
            }
        }
    }
    /**
     * Trigger before deleting a list of items
     */
    async beforeDeleteList(list, result) { }
    async queryDeleteItem(item, fromList, result) {
        if (fromList) {
            return;
        }
        let response = await this.routes.destroy(item.id);
        if (!response.success) {
            result.errors = [...result.errors, ...response.errors];
        }
        else if (this.hasDetails) {
            const id = this.getId(item);
            const index = this.getByIdDone.indexOf(id);
            if (index != -1) {
                this.getByIdDone.splice(index, 1);
            }
        }
    }
    /**
     * Trigger before deleting an item
     */
    async beforeDeleteItem(item, fromList, result) { }
    /**
     * Trigger after deleting an item
     */
    async afterDeleteItem(result, fromList) { }
    /**
     * Trigger after deleting a list of items
     */
    async afterDeleteList(result) { }
}
GenericRamHttp.Namespace=`AventusPhp`;
__as1(_, 'GenericRamHttp', GenericRamHttp);

let RamHttp=class RamHttp extends GenericRamHttp {
}
RamHttp.Namespace=`AventusPhp`;
__as1(_, 'RamHttp', RamHttp);


for(let key in _) { AventusPhp[key] = _[key] }
})(AventusPhp);

var Aventus;
(Aventus||(Aventus = {}));
(function (Aventus) {
const __as1 = (o, k, c) => { if (o[k] !== undefined) for (let w in o[k]) { c[w] = o[k][w] } o[k] = c; }
const moduleName = `Aventus`;
const _ = {};

let Layout = {};
_.Layout = Aventus.Layout ?? {};
let Toast = {};
_.Toast = Aventus.Toast ?? {};
let Lib = {};
_.Lib = Aventus.Lib ?? {};
let Navigation = {};
_.Navigation = Aventus.Navigation ?? {};
let Form = {};
_.Form = Aventus.Form ?? {};
Form.Validators = {};
_.Form.Validators = Aventus.Form?.Validators ?? {};
let Modal = {};
_.Modal = Aventus.Modal ?? {};
let _n;
Layout.Row = class Row extends Aventus.WebComponent {
    static __style = `:host{--_col-gap: var(--col-gap, 0px)}:host{container-name:row;container-type:inline-size;display:flex;flex-direction:row;flex-wrap:wrap;gap:var(--_col-gap);width:100%}`;
    constructor() {
        super();
        this.style.containerName = "row";
        this.style.containerType = "inline-size";
    }
    __getStatic() {
        return Row;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Row.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "Row";
    }
}
Layout.Row.Namespace=`Aventus.Layout`;
Layout.Row.Tag=`av-row`;
__as1(_.Layout, 'Row', Layout.Row);
if(!window.customElements.get('av-row')){window.customElements.define('av-row', Layout.Row);Aventus.WebComponentInstance.registerDefinition(Layout.Row);}

Toast.ToastElement = class ToastElement extends Aventus.WebComponent {
    get 'position'() { return this.getStringAttr('position') }
    set 'position'(val) { this.setStringAttr('position', val) }get 'delay'() { return this.getNumberAttr('delay') }
    set 'delay'(val) { this.setNumberAttr('delay', val) }get 'is_active'() { return this.getBoolAttr('is_active') }
    set 'is_active'(val) { this.setBoolAttr('is_active', val) }    showAsked = false;
    onHideCallback = () => { };
    timeout = 0;
    isTransition = false;
    waitTransitionCbs = [];
    static __style = `:host{position:absolute}:host(:not([is_active])){opacity:0;visibility:hidden}:host([position="bottom left"]){bottom:var(--_toast-space-bottom);left:0px}:host([position="top left"]){left:var(--_toast-space-left);top:var(--_toast-space-top)}:host([position="bottom right"]){bottom:var(--_toast-space-bottom);right:var(--_toast-space-right)}:host([position="top right"]){right:var(--_toast-space-right);top:var(--_toast-space-top)}:host([position=top]){left:50%;top:var(--_toast-space-top);transform:translateX(-50%)}:host([position=bottom]){bottom:var(--_toast-space-bottom);left:50%;transform:translateX(-50%)}`;
    constructor() {
        super();
        if (this.constructor == ToastElement) {
            throw "can't instanciate an abstract class";
        }
    }
    __getStatic() {
        return ToastElement;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(ToastElement.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "ToastElement";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('position')){ this['position'] = _.Toast.ToastManager.defaultPosition; }if(!this.hasAttribute('delay')){ this['delay'] = _.Toast.ToastManager.defaultDelay; }if(!this.hasAttribute('is_active')) { this.attributeChangedCallback('is_active', false, false); } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('position');this.__upgradeProperty('delay');this.__upgradeProperty('is_active'); }
    __listBoolProps() { return ["is_active"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    _setOptions(options) {
        if (options.position !== undefined)
            this.position = options.position;
        if (options.delay !== undefined)
            this.delay = options.delay;
        return this.setOptions(options);
    }
    show(onHideCallback) {
        this.onHideCallback = onHideCallback;
        if (this.isReady) {
            this.is_active = true;
            this.startDelay();
        }
        else {
            this.showAsked = true;
        }
    }
    startDelay() {
        if (this.delay > 0) {
            this.timeout = setTimeout(() => {
                this.close();
            }, this.delay);
        }
    }
    async close() {
        if (this.onHideCallback) {
            this.is_active = false;
            this.onHideCallback(false);
            this.remove();
        }
    }
    addTransition() {
        this.addEventListener("transitionStart", (e) => {
            this.isTransition = true;
        });
        this.addEventListener("transitionEnd", () => {
            this.isTransition = false;
            let cbs = [...this.waitTransitionCbs];
            this.waitTransitionCbs = [];
            for (let cb of cbs) {
                cb();
            }
        });
    }
    waitTransition() {
        if (this.isTransition) {
            return new Promise((resolve) => {
                this.waitTransitionCbs.push(resolve);
            });
        }
        return new Promise((resolve) => {
            resolve();
        });
    }
    postCreation() {
        if (this.showAsked) {
            this.is_active = true;
            this.startDelay();
        }
    }
    static add(options) {
        return _.Toast.ToastManager.add(options);
    }
}
Toast.ToastElement.Namespace=`Aventus.Toast`;
__as1(_.Toast, 'ToastElement', Toast.ToastElement);

(function (SpecialTouch) {
    SpecialTouch[SpecialTouch["Backspace"] = 0] = "Backspace";
    SpecialTouch[SpecialTouch["Insert"] = 1] = "Insert";
    SpecialTouch[SpecialTouch["End"] = 2] = "End";
    SpecialTouch[SpecialTouch["PageDown"] = 3] = "PageDown";
    SpecialTouch[SpecialTouch["PageUp"] = 4] = "PageUp";
    SpecialTouch[SpecialTouch["Escape"] = 5] = "Escape";
    SpecialTouch[SpecialTouch["AltGraph"] = 6] = "AltGraph";
    SpecialTouch[SpecialTouch["Control"] = 7] = "Control";
    SpecialTouch[SpecialTouch["Alt"] = 8] = "Alt";
    SpecialTouch[SpecialTouch["Shift"] = 9] = "Shift";
    SpecialTouch[SpecialTouch["CapsLock"] = 10] = "CapsLock";
    SpecialTouch[SpecialTouch["Tab"] = 11] = "Tab";
    SpecialTouch[SpecialTouch["Delete"] = 12] = "Delete";
    SpecialTouch[SpecialTouch["ArrowRight"] = 13] = "ArrowRight";
    SpecialTouch[SpecialTouch["ArrowLeft"] = 14] = "ArrowLeft";
    SpecialTouch[SpecialTouch["ArrowUp"] = 15] = "ArrowUp";
    SpecialTouch[SpecialTouch["ArrowDown"] = 16] = "ArrowDown";
    SpecialTouch[SpecialTouch["Enter"] = 17] = "Enter";
})(Lib.SpecialTouch || (Lib.SpecialTouch = {}));
__as1(_.Lib, 'SpecialTouch', Lib.SpecialTouch);

let Tracker=class Tracker {
    velocityMultiplier = window.devicePixelRatio;
    updateTime = Date.now();
    delta = { x: 0, y: 0 };
    velocity = { x: 0, y: 0 };
    lastPosition = { x: 0, y: 0 };
    constructor(touch) {
        this.lastPosition = this.getPosition(touch);
    }
    update(touch) {
        const { velocity, updateTime, lastPosition, } = this;
        const now = Date.now();
        const position = this.getPosition(touch);
        const delta = {
            x: -(position.x - lastPosition.x),
            y: -(position.y - lastPosition.y),
        };
        const duration = (now - updateTime) || 16.7;
        const vx = delta.x / duration * 16.7;
        const vy = delta.y / duration * 16.7;
        velocity.x = vx * this.velocityMultiplier;
        velocity.y = vy * this.velocityMultiplier;
        this.delta = delta;
        this.updateTime = now;
        this.lastPosition = position;
    }
    getPointerData(evt) {
        return evt.touches ? evt.touches[evt.touches.length - 1] : evt;
    }
    getPosition(evt) {
        const data = this.getPointerData(evt);
        return {
            x: data.clientX,
            y: data.clientY,
        };
    }
}
Tracker.Namespace=`Aventus`;
__as1(_, 'Tracker', Tracker);

const Img = class Img extends Aventus.WebComponent {
    static get observedAttributes() {return ["src", "mode"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'cache'() { return this.getBoolAttr('cache') }
    set 'cache'(val) { this.setBoolAttr('cache', val) }    get 'src'() { return this.getStringProp('src') }
    set 'src'(val) { this.setStringAttr('src', val) }get 'mode'() { return this.getStringProp('mode') }
    set 'mode'(val) { this.setStringAttr('mode', val) }    isCalculing;
    maxCalculateSize = 10;
    ratio = 1;
    resizeObserver;
    __registerPropertiesActions() { super.__registerPropertiesActions(); this.__addPropertyActions("src", ((target) => {
    target.onSrcChanged();
}));this.__addPropertyActions("mode", ((target) => {
    if (target.src != "") {
        target.calculateSize();
    }
})); }
    static __style = `:host{--internal-img-color: var(--img-color);--internal-img-stroke-color: var(--img-stroke-color, var(--internal-img-color));--internal-img-fill-color: var(--img-fill-color, var(--internal-img-color));--internal-img-color-transition: var(--img-color-transition, none)}:host{display:inline-block;overflow:hidden;font-size:0}:host *{box-sizing:border-box}:host img{opacity:0;transition:filter .3s linear}:host .svg{display:none;height:100%;width:100%}:host .svg svg{height:100%;width:100%}:host([src$=".svg"]) img{display:none}:host([src$=".svg"]) .svg{display:flex}:host([src$=".svg"]) .svg svg{transition:var(--internal-img-color-transition);stroke:var(--internal-img-stroke-color);fill:var(--internal-img-fill-color)}:host([display_bigger]) img{cursor:pointer}:host([display_bigger]) img:hover{filter:brightness(50%)}`;
    __getStatic() {
        return Img;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Img.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<img _id="img_0" /><div class="svg" _id="img_1"></div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "imgEl",
      "ids": [
        "img_0"
      ]
    },
    {
      "name": "svgEl",
      "ids": [
        "img_1"
      ]
    }
  ]
}); }
    getClassName() {
        return "Img";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('cache')) { this.attributeChangedCallback('cache', false, false); }if(!this.hasAttribute('src')){ this['src'] = undefined; }if(!this.hasAttribute('mode')){ this['mode'] = "contains"; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('cache');this.__upgradeProperty('src');this.__upgradeProperty('mode'); }
    __listBoolProps() { return ["cache"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    calculateSize(attempt = 0) {
        if (this.isCalculing || !this.imgEl || !this.svgEl) {
            return;
        }
        if (this.src == "") {
            return;
        }
        this.isCalculing = true;
        if (getComputedStyle(this).display == 'none') {
            return;
        }
        if (attempt == this.maxCalculateSize) {
            this.isCalculing = false;
            return;
        }
        let element = this.imgEl;
        if (this.src?.endsWith(".svg")) {
            element = this.svgEl;
        }
        this.style.width = '';
        this.style.height = '';
        element.style.width = '';
        element.style.height = '';
        if (element.offsetWidth == 0 && element.offsetHeight == 0) {
            setTimeout(() => {
                this.isCalculing = false;
                this.calculateSize(attempt + 1);
            }, 100);
            return;
        }
        let style = getComputedStyle(this);
        let addedY = Number(style.paddingTop.replace("px", "")) + Number(style.paddingBottom.replace("px", "")) + Number(style.borderTopWidth.replace("px", "")) + Number(style.borderBottomWidth.replace("px", ""));
        let addedX = Number(style.paddingLeft.replace("px", "")) + Number(style.paddingRight.replace("px", "")) + Number(style.borderLeftWidth.replace("px", "")) + Number(style.borderRightWidth.replace("px", ""));
        let availableHeight = this.offsetHeight - addedY;
        let availableWidth = this.offsetWidth - addedX;
        let sameWidth = (element.offsetWidth == availableWidth);
        let sameHeight = (element.offsetHeight == availableHeight);
        this.ratio = element.offsetWidth / element.offsetHeight;
        if (sameWidth && !sameHeight) {
            // height is set
            element.style.width = (availableHeight * this.ratio) + 'px';
            element.style.height = availableHeight + 'px';
        }
        else if (!sameWidth && sameHeight) {
            // width is set
            element.style.width = availableWidth + 'px';
            element.style.height = (availableWidth / this.ratio) + 'px';
        }
        else if (!sameWidth && !sameHeight) {
            if (this.mode == "stretch") {
                element.style.width = '100%';
                element.style.height = '100%';
            }
            else if (this.mode == "contains") {
                // suppose this height is max
                let newWidth = (availableHeight * this.ratio);
                if (newWidth <= availableWidth) {
                    //we can apply this value
                    element.style.width = newWidth + 'px';
                    element.style.height = availableHeight + 'px';
                }
                else {
                    element.style.width = availableWidth + 'px';
                    element.style.height = (availableWidth / this.ratio) + 'px';
                }
            }
            else if (this.mode == "cover") {
                // suppose this height is min
                let newWidth = (availableHeight * this.ratio);
                if (newWidth >= availableWidth) {
                    //we can apply this value
                    element.style.width = newWidth + 'px';
                    element.style.height = availableHeight + 'px';
                }
                else {
                    element.style.width = availableWidth + 'px';
                    element.style.height = (availableWidth / this.ratio) + 'px';
                }
            }
        }
        //center img
        let diffTop = (this.offsetHeight - element.offsetHeight - addedY) / 2;
        let diffLeft = (this.offsetWidth - element.offsetWidth - addedX) / 2;
        element.style.transform = "translate(" + diffLeft + "px, " + diffTop + "px)";
        element.style.opacity = '1';
        this.isCalculing = false;
    }
    async onSrcChanged() {
        if (!this.src || !this.svgEl || !this.imgEl) {
            return;
        }
        if (this.src.endsWith(".svg")) {
            let svgContent = await Aventus.ResourceLoader.load(this.src);
            this.svgEl.innerHTML = svgContent;
            this.calculateSize();
        }
        else if (this.cache) {
            let base64 = await Aventus.ResourceLoader.load({
                url: this.src,
                type: 'img'
            });
            this.imgEl.setAttribute("src", base64);
            this.calculateSize();
        }
        else {
            this.imgEl.setAttribute("src", this.src);
            this.calculateSize();
        }
    }
    postDestruction() {
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
    }
    postCreation() {
        this.resizeObserver = new Aventus.ResizeObserver({
            fps: 10,
            callback: () => {
                this.calculateSize();
            }
        });
        this.resizeObserver.observe(this);
    }
}
Img.Namespace=`Aventus`;
Img.Tag=`av-img`;
__as1(_, 'Img', Img);
if(!window.customElements.get('av-img')){window.customElements.define('av-img', Img);Aventus.WebComponentInstance.registerDefinition(Img);}

let RouterStateManager=class RouterStateManager extends Aventus.StateManager {
    static getInstance() {
        return Aventus.Instance.get(RouterStateManager);
    }
}
RouterStateManager.Namespace=`Aventus`;
__as1(_, 'RouterStateManager', RouterStateManager);

Navigation.Link = class Link extends Aventus.WebComponent {
    get 'to'() { return this.getStringAttr('to') }
    set 'to'(val) { this.setStringAttr('to', val) }get 'active_pattern'() { return this.getStringAttr('active_pattern') }
    set 'active_pattern'(val) { this.setStringAttr('active_pattern', val) }    onActiveChange = new Aventus.Callback();
    static __style = `:host{display:contents}:host a{color:inherit;display:contents;text-decoration:none}`;
    __getStatic() {
        return Link;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Link.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<a _id="link_0"><slot></slot></a>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "link_0°href": {
      "fct": (c) => `${c.print(c.comp.__7e4c6c9fe944acd9b1174c61347fdcb6method0())}`,
      "once": true
    }
  },
  "events": [
    {
      "eventName": "click",
      "id": "link_0",
      "fct": (e, c) => c.comp.prevent(e)
    }
  ]
}); }
    getClassName() {
        return "Link";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('to')){ this['to'] = undefined; }if(!this.hasAttribute('active_pattern')){ this['active_pattern'] = undefined; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('to');this.__upgradeProperty('active_pattern'); }
    addClickEvent() {
        new Aventus.PressManager({
            element: this,
            onPress: () => {
                if (this.to === undefined)
                    return false;
                let to = this.to;
                if (this.to.startsWith(".")) {
                    to = Aventus.Instance.get(RouterStateManager).getState()?.name ?? "";
                    if (!to.endsWith("/")) {
                        to += "/";
                    }
                    to += this.to;
                    to = Aventus.Uri.normalize(to);
                }
                Aventus.State.activate(to, Aventus.Instance.get(RouterStateManager));
                return true;
            }
        });
    }
    registerActivetoListener() {
        let activeto = this.to;
        if (this.active_pattern) {
            activeto = this.active_pattern;
        }
        if (activeto === undefined)
            return;
        Aventus.Instance.get(RouterStateManager).subscribe(activeto, {
            active: () => {
                this.classList.add("active");
                this.onActiveChange.trigger(true);
            },
            inactive: () => {
                this.classList.remove("active");
                this.onActiveChange.trigger(false);
            }
        });
    }
    prevent(e) {
        e.preventDefault();
    }
    postCreation() {
        this.registerActivetoListener();
        this.addClickEvent();
    }
    __7e4c6c9fe944acd9b1174c61347fdcb6method0() {
        return this.to;
    }
}
Navigation.Link.Namespace=`Aventus.Navigation`;
Navigation.Link.Tag=`av-link`;
__as1(_.Navigation, 'Link', Navigation.Link);
if(!window.customElements.get('av-link')){window.customElements.define('av-link', Navigation.Link);Aventus.WebComponentInstance.registerDefinition(Navigation.Link);}

Navigation.Page = class Page extends Aventus.WebComponent {
    static get observedAttributes() {return ["visible"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'visible'() { return this.getBoolProp('visible') }
    set 'visible'(val) { this.setBoolAttr('visible', val) }    router;
    state;
    __registerPropertiesActions() { super.__registerPropertiesActions(); this.__addPropertyActions("visible", ((target) => {
    if (target.visible) {
        target.onShow();
    }
    else {
        target.onHide();
    }
})); }
    static __style = `:host{display:block}:host(:not([visible])){display:none}`;
    constructor() {
        super();
        if (this.constructor == Page) {
            throw "can't instanciate an abstract class";
        }
    }
    __getStatic() {
        return Page;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Page.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "Page";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('visible')) { this.attributeChangedCallback('visible', false, false); } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('visible'); }
    __listBoolProps() { return ["visible"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    async show(state) {
        this.state = state;
        this.visible = true;
    }
    async hide() {
        this.visible = false;
        this.state = undefined;
    }
    onShow() {
    }
    onHide() {
    }
    isAllowed(state, pattern, router) {
        return true;
    }
}
Navigation.Page.Namespace=`Aventus.Navigation`;
__as1(_.Navigation, 'Page', Navigation.Page);

Navigation.Default404 = class Default404 extends Navigation.Page {
    static __style = `:host{align-items:center;height:100%;justify-content:center;width:100%}:host h1{font-size:48px;text-align:center}:host([visible]){display:flex}`;
    __getStatic() {
        return Default404;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Default404.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<h1>Error 404</h1>` }
    });
}
    getClassName() {
        return "Default404";
    }
    configure() {
        return {
            destroy: true
        };
    }
}
Navigation.Default404.Namespace=`Aventus.Navigation`;
Navigation.Default404.Tag=`av-default-404`;
__as1(_.Navigation, 'Default404', Navigation.Default404);
if(!window.customElements.get('av-default-404')){window.customElements.define('av-default-404', Navigation.Default404);Aventus.WebComponentInstance.registerDefinition(Navigation.Default404);}

Toast.ToastManager = class ToastManager extends Aventus.WebComponent {
    get 'gap'() { return this.getNumberAttr('gap') }
    set 'gap'(val) { this.setNumberAttr('gap', val) }get 'not_main'() { return this.getBoolAttr('not_main') }
    set 'not_main'(val) { this.setBoolAttr('not_main', val) }    static defaultToast;
    static defaultToastManager;
    static defaultPosition = 'top right';
    static defaultDelay = 5000;
    static heightLimitPercent = 100;
    static instance;
    activeToasts = {
        top: [],
        'top left': [],
        'bottom left': [],
        bottom: [],
        'bottom right': [],
        'top right': [],
    };
    waitingToasts = {
        top: [],
        'top left': [],
        'bottom left': [],
        bottom: [],
        'bottom right': [],
        'top right': [],
    };
    get containerHeight() {
        return this.offsetHeight;
    }
    get heightLimit() {
        return this.containerHeight * Toast.ToastManager.heightLimitPercent / 100;
    }
    mutex = new Aventus.Mutex();
    static __style = `:host{--_toast-space-bottom: var(--toast-space-bottom, 20px);--_toast-space-top: var(--toast-space-top, 20px);--_toast-space-right: var(--toast-space-right, 10px);--_toast-space-left: var(--toast-space-left, 10px)}:host{inset:0;overflow:hidden;pointer-events:none;position:fixed;z-index:50}:host ::slotted(*){pointer-events:auto}`;
    __getStatic() {
        return ToastManager;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(ToastManager.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "ToastManager";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('gap')){ this['gap'] = 10; }if(!this.hasAttribute('not_main')) { this.attributeChangedCallback('not_main', false, false); } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('containerHeight');this.__correctGetter('heightLimit');this.__upgradeProperty('gap');this.__upgradeProperty('not_main'); }
    __listBoolProps() { return ["not_main"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    async add(toast) {
        await this.mutex.waitOne();
        let realToast;
        if (toast instanceof _.Toast.ToastElement) {
            realToast = toast;
        }
        else {
            if (!Toast.ToastManager.defaultToast)
                throw "No default toast. Try ToastManager.configure()";
            realToast = new Toast.ToastManager.defaultToast();
            await realToast._setOptions(toast);
        }
        this.appendChild(realToast);
        if (realToast.position == "bottom") {
            return this._notifyBottom(realToast, true);
        }
        else if (realToast.position == "bottom left") {
            return this._notifyBottomLeft(realToast, true);
        }
        else if (realToast.position == "top left") {
            return this._notifyTopLeft(realToast, true);
        }
        else if (realToast.position == "bottom right") {
            return this._notifyBottomRight(realToast, true);
        }
        else if (realToast.position == "top right") {
            return this._notifyTopRight(realToast, true);
        }
        else if (realToast.position == "top") {
            return this._notifyTop(realToast, true);
        }
        return false;
    }
    _calculateBottom(toast, firstTime, position, from) {
        return new Promise((resolve) => {
            let height = toast.offsetHeight;
            let containerHeight = this.containerHeight;
            const _remove = (result) => {
                let index = this.activeToasts[position].indexOf(toast);
                if (index > -1) {
                    this.activeToasts[position].splice(index, 1);
                }
                if (this.waitingToasts[position].length > 0) {
                    let nextNotif = this.waitingToasts[position].splice(0, 1)[0];
                    this._calculateBottom(nextNotif, false, position, index);
                }
                else {
                    let containerHeight = this.containerHeight;
                    for (let i = 0; i < index; i++) {
                        let notif = this.activeToasts[position][i];
                        let bottom = containerHeight - (notif.offsetTop + notif.offsetHeight);
                        notif.style.bottom = bottom - height - this.gap + 'px';
                    }
                }
                resolve(result);
            };
            let length = this.activeToasts[position].length;
            if (length == 0) {
                this.activeToasts[position].push(toast);
                toast.show(_remove);
            }
            else {
                let totHeight = 0;
                for (let t of this.activeToasts[position]) {
                    totHeight += t.offsetHeight + this.gap;
                }
                if (totHeight + height < this.heightLimit) {
                    for (let i = from; i < this.activeToasts[position].length; i++) {
                        let t = this.activeToasts[position][i];
                        let bottom = containerHeight - (t.offsetTop + t.offsetHeight);
                        t.style.bottom = bottom + height + this.gap + 'px';
                    }
                    this.activeToasts[position].push(toast);
                    toast.show(_remove);
                }
                else if (firstTime) {
                    this.waitingToasts[position].push(toast);
                }
            }
        });
    }
    _calculateTop(toast, firstTime, position, from) {
        return new Promise(async (resolve) => {
            let height = toast.offsetHeight;
            const _remove = (result) => {
                let index = this.activeToasts[position].indexOf(toast);
                if (index > -1) {
                    this.activeToasts[position].splice(index, 1);
                }
                if (this.waitingToasts[position].length > 0) {
                    let nextNotif = this.waitingToasts[position].splice(0, 1)[0];
                    this._calculateTop(nextNotif, false, position, index);
                }
                else {
                    for (let i = 0; i < index; i++) {
                        let notif = this.activeToasts[position][i];
                        let top = (notif.offsetTop - height - this.gap);
                        notif.style.top = top + 'px';
                    }
                }
                resolve(result);
            };
            let length = this.activeToasts[position].length;
            if (length == 0) {
                this.activeToasts[position].push(toast);
                toast.show(_remove);
            }
            else {
                let totHeight = 0;
                for (let notif of this.activeToasts[position]) {
                    await notif.waitTransition();
                    totHeight += notif.offsetHeight + this.gap;
                }
                if (totHeight + height < this.heightLimit) {
                    for (let i = from; i < this.activeToasts[position].length; i++) {
                        let notif = this.activeToasts[position][i];
                        await notif.waitTransition();
                        let top = (notif.offsetTop + notif.offsetHeight);
                        notif.style.top = top + this.gap + 'px';
                    }
                    this.activeToasts[position].push(toast);
                    toast.show(_remove);
                }
                else if (firstTime) {
                    this.waitingToasts[position].push(toast);
                }
            }
            this.mutex.release();
            return;
        });
    }
    async _notifyBottomRight(toast, firstTime) {
        return await this._calculateBottom(toast, firstTime, "bottom right", 0);
    }
    async _notifyTopRight(toast, firstTime) {
        return await this._calculateTop(toast, firstTime, "top right", 0);
    }
    async _notifyBottomLeft(toast, firstTime) {
        return await this._calculateBottom(toast, firstTime, "bottom left", 0);
    }
    async _notifyTopLeft(toast, firstTime) {
        return await this._calculateTop(toast, firstTime, "top left", 0);
    }
    async _notifyTop(toast, firstTime, from = 0) {
        return await this._calculateTop(toast, firstTime, "top", 0);
    }
    async _notifyBottom(toast, firstTime, from = 0) {
        return await this._calculateBottom(toast, firstTime, "bottom", from);
    }
    postConnect() {
        super.postConnect();
        if (!Toast.ToastManager.instance && !this.not_main) {
            Toast.ToastManager.instance = this;
        }
    }
    postDisonnect() {
        if (Toast.ToastManager.instance == this) {
            Toast.ToastManager.instance = undefined;
        }
    }
    static add(toast) {
        if (!this.instance) {
            this.instance = this.defaultToastManager ? new this.defaultToastManager() : new Toast.ToastManager();
            document.body.appendChild(this.instance);
        }
        return this.instance.add(toast);
    }
    static configure(options) {
        for (let key in options) {
            if (options[key] !== undefined)
                this[key] = options[key];
        }
    }
}
Toast.ToastManager.Namespace=`Aventus.Toast`;
Toast.ToastManager.Tag=`av-toast-manager`;
__as1(_.Toast, 'ToastManager', Toast.ToastManager);
if(!window.customElements.get('av-toast-manager')){window.customElements.define('av-toast-manager', Toast.ToastManager);Aventus.WebComponentInstance.registerDefinition(Toast.ToastManager);}

Form.FormElement = class FormElement extends Aventus.WebComponent {
    static get observedAttributes() {return ["disabled"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'has_errors'() { return this.getBoolAttr('has_errors') }
    set 'has_errors'(val) { this.setBoolAttr('has_errors', val) }    get 'disabled'() { return this.getBoolProp('disabled') }
    set 'disabled'(val) { this.setBoolAttr('disabled', val) }    get 'value'() {
						return this.__watch["value"];
					}
					set 'value'(val) {
						this.__watch["value"] = val;
					}get 'errors'() {
						return this.__watch["errors"];
					}
					set 'errors'(val) {
						this.__watch["errors"] = val;
					}    static get formAssociated() { return true; }
    _form;
    get form() {
        return this._form;
    }
    set form(value) {
        this.unlinkFormPart();
        this._form = value;
        this.linkFormPart();
    }
    internals;
    canLinkValueToForm = false;
    handler = undefined;
    onChange = new Aventus.Callback();
    __registerWatchesActions() {
    this.__addWatchesActions("value", ((target) => {
    target.onValueChange(target.value);
}));this.__addWatchesActions("errors", ((target) => {
    target.onErrorsChange();
}));    super.__registerWatchesActions();
}
    static __style = ``;
    constructor() {
        super();
        this.internals = this.attachInternals();
        if (this.constructor == FormElement) {
            throw "can't instanciate an abstract class";
        }
        this.refreshValueFromForm = this.refreshValueFromForm.bind(this);
        this.onFormValidation = this.onFormValidation.bind(this);
    }
    __getStatic() {
        return FormElement;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(FormElement.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "FormElement";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('has_errors')) { this.attributeChangedCallback('has_errors', false, false); }if(!this.hasAttribute('disabled')) { this.attributeChangedCallback('disabled', false, false); } }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["value"] = undefined;w["errors"] = []; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('form');this.__upgradeProperty('has_errors');this.__upgradeProperty('disabled');this.__correctGetter('value');this.__correctGetter('errors'); }
    __listBoolProps() { return ["has_errors","disabled"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    refreshValueFromForm() {
        if (this._form) {
            this.errors = [];
            this.value = this._form.value.get();
        }
    }
    unlinkFormPart() {
        if (this._form) {
            this._form.unregister(this);
            this._form.onValueChange.remove(this.refreshValueFromForm);
            this._form.onValidation.remove(this.onFormValidation);
        }
    }
    linkFormPart() {
        if (this._form) {
            this._form.register(this);
            this._form.onValueChange.add(this.refreshValueFromForm);
            this._form.onValidation.add(this.onFormValidation);
            this.refreshValueFromForm();
        }
        else {
            this.value = undefined;
        }
    }
    async onFormValidation(errors) {
        let _errors = await this.validation();
        if (_errors.length == 0) {
            _errors = errors;
        }
        else if (errors.length > 0) {
            for (let error of errors) {
                if (!_errors.includes(error)) {
                    _errors.push(error);
                }
            }
        }
        this.errors = _errors;
        return this.errors;
    }
    async validate() {
        if (!this.form) {
            this.errors = await this.validation();
            return this.errors.length == 0;
        }
        return await this.form.test();
    }
    async validation() {
        return [];
    }
    clearErrors() {
        this.errors = [];
    }
    triggerChange(value) {
        this.value = value;
        this.onChange.trigger(this.value);
        if (this.form) {
            this.form.value.set(this.value);
        }
    }
    onValueChange(value) {
        this.linkValueToForm();
    }
    onErrorsChange() {
        this.has_errors = this.errors.length > 0;
        this.linkErrorToForm();
    }
    linkErrorToForm() {
        if (!this.canLinkValueToForm)
            return;
        if (this.has_errors) {
            this.internals.setValidity({
                customError: true
            }, this.errors.join(' & '));
        }
        else {
            this.internals.setValidity({});
        }
    }
    linkValueToForm() {
        if (!this.canLinkValueToForm)
            return;
        if (this.value === undefined) {
            this.internals.setFormValue(null);
        }
        else {
            this.internals.setFormValue(this.value + '');
        }
    }
    formAssociatedCallback(form) {
        this.canLinkValueToForm = true;
        this.linkValueToForm();
        this.linkErrorToForm();
        this.validate();
    }
    formDisabledCallback(disabled) {
        this.disabled = disabled;
    }
    postCreation() {
        super.postCreation();
        let handler = this.findParentByType(_.Form.Form.formElements)?.registerElement(this);
    }
    postDestruction() {
        super.postDestruction();
        this.unlinkFormPart();
    }
}
Form.FormElement.Namespace=`Aventus.Form`;
__as1(_.Form, 'FormElement', Form.FormElement);

Form.Form = class Form extends Aventus.WebComponent {
    static get defaultConfig() {
        return _.Form.FormHandler._globalConfig;
    }
    static set formElements(value) {
        _.Form.FormHandler._IFormElements = value;
    }
    static get formElements() {
        return _.Form.FormHandler._IFormElements;
    }
    form;
    request;
    elements = [];
    btns = [];
    onSubmit = new Aventus.Callback();
    static __style = ``;
    constructor() {
        super();
        this.checkEnter = this.checkEnter.bind(this);
    }
    __getStatic() {
        return Form;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Form.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "Form";
    }
    checkEnter(e) {
        if (e.key == "Enter") {
            this.requestSubmit();
        }
    }
    registerElement(element) {
        if (this.elements.length > 0) {
            this.elements[this.elements.length - 1].removeEventListener("keyup", this.checkEnter);
        }
        this.elements.push(element);
        element.addEventListener("keyup", this.checkEnter);
        return this;
    }
    registerSubmit(element) {
        this.btns.push(element);
        return this;
    }
    async requestSubmit() {
        if (!this.form) {
            for (let element of this.elements) {
                this.form = element.form?.handler;
                if (this.form)
                    break;
            }
        }
        if (this.form) {
            if (this.request) {
                this.form.submit(this.request);
            }
            else if (await this.form.validate()) {
                this.onSubmit.trigger();
            }
        }
    }
    static create(schema, config) {
        let form = new _.Form.FormHandler(schema, config);
        return form;
    }
    static configure(value) {
        _.Form.FormHandler._globalConfig = value;
    }
}
Form.Form.Namespace=`Aventus.Form`;
Form.Form.Tag=`av-form`;
__as1(_.Form, 'Form', Form.Form);
if(!window.customElements.get('av-form')){window.customElements.define('av-form', Form.Form);Aventus.WebComponentInstance.registerDefinition(Form.Form);}

Form.Validator=class Validator {
    constructor() { this.validate = this.validate.bind(this); }
    static async Test(validators, value, name, globalValidation) {
        if (!Array.isArray(validators)) {
            validators = [validators];
        }
        let result = [];
        for (let validator of validators) {
            let resultTemp = new validator();
            const temp = await resultTemp.validate(value, name, globalValidation);
            if (temp === false) {
                result.push('Le champs n\'est pas valide');
            }
            else if (Array.isArray(temp)) {
                for (let error of temp) {
                    result.push(error);
                }
            }
            else if (typeof temp == 'string') {
                result.push(temp);
            }
        }
        return result.length == 0 ? undefined : result;
    }
}
Form.Validator.Namespace=`Aventus.Form`;
__as1(_.Form, 'Validator', Form.Validator);

Form.Validators.Required=class Required extends _.Form.Validator {
    static msg = "Le champs {name} est requis";
    _msg;
    constructor(msg) {
        super();
        this._msg = msg ?? Form.Validators.Required.msg;
    }
    /**
     * @inheritdoc
     */
    validate(value, name, globalValidation) {
        const txt = this._msg.replace(/\{ *name *\}/g, name);
        if (value === undefined || value === null) {
            return txt;
        }
        if (typeof value == 'string' && value.trim() == "") {
            return txt;
        }
        return true;
    }
}
Form.Validators.Required.Namespace=`Aventus.Form.Validators`;
__as1(_.Form.Validators, 'Required', Form.Validators.Required);

Navigation.PageForm = class PageForm extends Navigation.Page {
    _form;
    get form() { return this._form; }
    elements = [];
    btns = [];
    static __style = ``;
    constructor() {
        super();
        this._form = new Form.FormHandler(this.formSchema(), this.formConfig());
        if (this.constructor == PageForm) {
            throw "can't instanciate an abstract class";
        }
        this.checkEnter = this.checkEnter.bind(this);
    }
    __getStatic() {
        return PageForm;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(PageForm.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "PageForm";
    }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('form'); }
    formConfig() {
        return {};
    }
    pageConfig() {
        return {
            submitWithEnter: true,
            autoLoading: true
        };
    }
    async submit() {
        this.setLoading(true);
        const result = await this.defineSubmit((fct) => this.form.submit(fct));
        this.setLoading(false);
        return result;
    }
    setLoading(isLoading) {
        const autoLoading = this.pageConfig().autoLoading;
        if (autoLoading) {
            for (let btn of this.btns) {
                if ("loading" in btn) {
                    btn.loading = isLoading;
                }
            }
        }
    }
    checkEnter(e) {
        if (e.key == "Enter") {
            this.submit();
        }
    }
    registerElement(element) {
        const submitWithEnter = this.pageConfig().submitWithEnter;
        if (this.elements.length > 0) {
            if (submitWithEnter)
                this.elements[this.elements.length - 1].removeEventListener("keyup", this.checkEnter);
        }
        this.elements.push(element);
        if (submitWithEnter)
            element.addEventListener("keyup", this.checkEnter);
        return this;
    }
    registerSubmit(element) {
        this.btns.push(element);
        return this;
    }
    async requestSubmit() {
        await this.submit();
    }
}
Navigation.PageForm.Namespace=`Aventus.Navigation`;
__as1(_.Navigation, 'PageForm', Navigation.PageForm);

Form.FormHandler=class FormHandler {
    static _globalConfig;
    static _IFormElements = [Form.Form, Navigation.PageForm];
    __watcher;
    get item() {
        return this.__watcher.item;
    }
    set item(item) {
        this.__watcher.item = item;
    }
    get parts() {
        return this.__watcher.form;
    }
    _elements = {};
    get elements() {
        return { ...this._elements };
    }
    _globalValidation;
    _validateOnChange = false;
    _handleValidateNoInputError;
    _handleExecuteNoInputError;
    defaultValues;
    onItemChange = new Aventus.Callback();
    constructor(schema, config, defaultValues) {
        this.writeValidationIntoConsole = this.writeValidationIntoConsole.bind(this);
        this.writeErrorIntoConsole = this.writeErrorIntoConsole.bind(this);
        this._globalValidation = config?.validate ?? Form.FormHandler._globalConfig?.validate;
        this._validateOnChange = config?.validateOnChange ?? Form.FormHandler._globalConfig?.validateOnChange ?? false;
        this._handleValidateNoInputError = config?.handleValidateNoInputError ?? Form.FormHandler._globalConfig?.handleValidateNoInputError ?? this.writeValidationIntoConsole;
        this._handleExecuteNoInputError = config?.handleExecuteNoInputError ?? Form.FormHandler._globalConfig?.handleExecuteNoInputError ?? this.writeErrorIntoConsole;
        this.defaultValues = defaultValues ?? {};
        this.onWatcherChanged = this.onWatcherChanged.bind(this);
        this.__watcher = Aventus.Watcher.get({
            form: {},
            item: this.defaultValues
        }, this.onWatcherChanged);
        this.__watcher.form = this.transformForm(schema);
    }
    writeValidationIntoConsole(errors) {
        for (let name in errors) {
            if (!errors[name])
                continue;
            for (let error of errors[name]) {
                console.log(name + ": " + error);
            }
        }
    }
    writeErrorIntoConsole(errors) {
        for (let error in errors) {
            console.log(error);
        }
    }
    transformForm(form) {
        const result = form;
        const normalizePart = (part) => {
            let needTransform = true;
            if (typeof part == 'object' && !Array.isArray(part)) {
                const keys = Object.keys(part);
                const keysAllows = ['validate', 'validateOnChange'];
                let isValid = true;
                for (let i = 0; i < keys.length; i++) {
                    const allows = keysAllows;
                    if (!allows.includes(keys[i])) {
                        isValid = false;
                        break;
                    }
                }
                if (isValid) {
                    needTransform = false;
                }
            }
            if (needTransform) {
                return {
                    validate: part
                };
            }
            return part;
        };
        const createKey = (key) => {
            form[key] = normalizePart(form[key]);
            this.transformFormPart(key, form[key]);
        };
        for (let key in result) {
            createKey(key);
        }
        return result;
    }
    transformFormPart(key, part) {
        if (!part)
            return;
        const realPart = part;
        realPart.onValidation = new Aventus.Callback();
        realPart.onValueChange = new Aventus.Callback();
        realPart.handler = this;
        if (part.validate) {
            const isConstructor = (validate) => {
                return Aventus.isClass(validate);
            };
            let validate;
            if (Array.isArray(part.validate)) {
                const fcts = [];
                for (let temp of part.validate) {
                    if (temp instanceof _.Form.Validator) {
                        fcts.push(temp.validate);
                    }
                    else {
                        let resultTemp = new temp();
                        fcts.push(resultTemp.validate);
                    }
                }
                validate = async (value, name, globalFct) => {
                    let result = [];
                    for (let fct of fcts) {
                        const temp = await fct(value, name, globalFct);
                        if (temp === false) {
                            result.push('Le champs n\'est pas valide');
                        }
                        else if (Array.isArray(temp)) {
                            for (let error of temp) {
                                result.push(error);
                            }
                        }
                        else if (typeof temp == 'string') {
                            result.push(temp);
                        }
                    }
                    return result.length == 0 ? undefined : result;
                };
            }
            else if (part.validate instanceof _.Form.Validator) {
                validate = part.validate.validate;
            }
            else if (isConstructor(part.validate)) {
                let cst = part.validate;
                let resultTemp = new cst();
                validate = resultTemp.validate;
            }
            else {
                validate = part.validate;
            }
            realPart.validate = validate;
        }
        realPart.test = async () => {
            const result = await this.validate(key);
            return result;
        };
        if (!this._elements[key]) {
            this._elements[key] = [];
        }
        realPart.register = (el) => {
            if (this._elements[key] && !this._elements[key].includes(el)) {
                this._elements[key].push(el);
            }
        };
        realPart.unregister = (el) => {
            if (!this._elements[key])
                return;
            const index = this._elements[key].indexOf(el);
            if (index != -1) {
                this._elements[key].splice(index, 1);
            }
        };
        realPart.value = {
            get: () => {
                return Aventus.getValueFromObject(key, this.item);
            },
            set: (value) => {
                return Aventus.setValueToObject(key, this.item, value);
            }
        };
        return;
    }
    async onWatcherChanged(action, path, value) {
        if (!this.parts)
            return;
        if (path == "item") {
            for (let key in this.parts) {
                let formPart = this.parts[key];
                formPart.onValueChange.trigger();
            }
        }
        else if (path.startsWith("item.")) {
            let key = path.substring("item.".length);
            if (this.parts[key]) {
                let formPart = this.parts[key];
                formPart.onValueChange.trigger();
                const validateOnChange = formPart.validateOnChange === undefined ? this._validateOnChange : formPart.validateOnChange;
                if (validateOnChange) {
                    this.validate(key);
                }
            }
            this.onItemChange.trigger(action, key, value);
        }
    }
    async _validate(key) {
        try {
            if (!this.parts)
                return { "@general": ["Aucun formulaire trouvé"] };
            if (key !== undefined) {
                let errorsForm = [];
                if (this.parts[key]) {
                    let formPart = this.parts[key];
                    let value = formPart.value.get();
                    const resultToError = (result) => {
                        if (result === false) {
                            errorsForm.push('Le champs n\'est pas valide');
                        }
                        else if (typeof result == 'string' && result !== "") {
                            errorsForm.push(result);
                        }
                        else if (Array.isArray(result)) {
                            errorsForm = [...errorsForm, ...result];
                        }
                    };
                    if (formPart.validate) {
                        const global = async () => {
                            if (this._globalValidation) {
                                const result = await this._globalValidation(key, value);
                                resultToError(result);
                            }
                        };
                        let result = await formPart.validate(value, key, global);
                        resultToError(result);
                    }
                    else if (this._globalValidation) {
                        const result = await this._globalValidation(key, value);
                        resultToError(result);
                    }
                    const proms = formPart.onValidation.trigger(errorsForm);
                    const errors2d = await Promise.all(proms);
                    const errors = [];
                    for (let errorsTemp of errors2d) {
                        for (let errorTemp of errorsTemp) {
                            if (!errors.includes(errorTemp)) {
                                errors.push(errorTemp);
                            }
                        }
                    }
                    errorsForm = errors;
                }
                return errorsForm.length == 0 ? {} : { [key]: errorsForm };
            }
            let errors = {};
            for (let key in this.parts) {
                errors = { ...errors, ...await this._validate(key) };
            }
            return errors;
        }
        catch (e) {
            return { "@general": [e + ""] };
        }
    }
    async validate(key) {
        const result = await this._validate(key);
        const unhandle = {};
        let triggerUnhandle = false;
        for (let key in result) {
            if (!this._elements[key] || this._elements[key].length == 0) {
                triggerUnhandle = true;
                unhandle[key] = result[key];
            }
        }
        if (triggerUnhandle && this._handleValidateNoInputError) {
            this._handleValidateNoInputError(unhandle);
        }
        return Object.keys(result).length == 0;
    }
    async submit(query) {
        const result = await this.validate();
        if (!result) {
            return null;
        }
        return this.execute(query);
    }
    async execute(query) {
        if (typeof query == "function") {
            if (!this.item) {
                const result = new Aventus.VoidWithError();
                result.errors.push(new Aventus.GenericError(404, "No item inside the form"));
                return result;
            }
            query = query(this.item);
        }
        let queryResult = await query;
        if (queryResult.errors.length > 0) {
            queryResult.errors = this.parseErrors(queryResult);
            if (queryResult.errors.length > 0 && this._handleExecuteNoInputError) {
                this._handleExecuteNoInputError(queryResult.errors);
            }
        }
        return queryResult;
    }
    parseErrors(queryResult) {
        let noPrintErrors = [];
        const elements = this.elements;
        for (let error of queryResult.errors) {
            if (error.details) {
                if (Array.isArray(error.details)) {
                    let found = false;
                    for (let detail of error.details) {
                        if (Object.hasOwn(detail, "Name")) {
                            if (elements[detail.Name]) {
                                for (const element of elements[detail.Name]) {
                                    element.errors.push(error.message);
                                }
                                found = true;
                                break;
                            }
                        }
                    }
                    if (found) {
                        continue;
                    }
                }
                else {
                    let found = false;
                    for (let key in error.details) {
                        if (elements[key]) {
                            if (Array.isArray(error.details[key])) {
                                for (const element of elements[key]) {
                                    for (let detail of error.details[key]) {
                                        element.errors.push(detail);
                                    }
                                }
                                found = true;
                            }
                            else {
                                for (const element of elements[key]) {
                                    element.errors.push(error.details[key]);
                                }
                                found = true;
                            }
                        }
                    }
                    if (found) {
                        continue;
                    }
                }
            }
            noPrintErrors.push(error);
        }
        return noPrintErrors;
    }
    reset() {
        this.item = this.defaultValues;
    }
}
Form.FormHandler.Namespace=`Aventus.Form`;
__as1(_.Form, 'FormHandler', Form.FormHandler);

Form.ButtonElement = class ButtonElement extends Aventus.WebComponent {
    static get observedAttributes() {return ["type"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'type'() { return this.getStringProp('type') }
    set 'type'(val) { this.setStringAttr('type', val) }    static get formAssociated() { return true; }
    internals;
    handler = undefined;
    static __style = ``;
    constructor() {
        super();
        this.internals = this.attachInternals();
        if (this.constructor == ButtonElement) {
            throw "can't instanciate an abstract class";
        }
    }
    __getStatic() {
        return ButtonElement;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(ButtonElement.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "ButtonElement";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('type')){ this['type'] = 'button'; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('type'); }
    async triggerSubmit() {
        if (this.type == "submit") {
            if ("loading" in this) {
                if (this.loading)
                    return;
                this.loading = true;
            }
            if (this.internals.form) {
                this.internals.form.requestSubmit();
            }
            else if (this.handler) {
                await this.handler.requestSubmit();
                if ("loading" in this) {
                    this.loading = false;
                }
            }
        }
    }
    postCreation() {
        super.postCreation();
        this.handler = this.findParentByType(_.Form.Form.formElements)?.registerSubmit(this);
        if (this.type == "submit") {
            new Aventus.PressManager({
                element: this,
                onPress: () => {
                    this.triggerSubmit();
                }
            });
            this.addEventListener("keyup", (e) => {
                if (e.key == 'Enter') {
                    this.triggerSubmit();
                }
            });
        }
    }
}
Form.ButtonElement.Namespace=`Aventus.Form`;
__as1(_.Form, 'ButtonElement', Form.ButtonElement);

let TouchRecord=class TouchRecord {
    _activeTouchID;
    _touchList = {};
    get _primitiveValue() {
        return { x: 0, y: 0 };
    }
    isActive() {
        return this._activeTouchID !== undefined;
    }
    getDelta() {
        const tracker = this._getActiveTracker();
        if (!tracker) {
            return this._primitiveValue;
        }
        return { ...tracker.delta };
    }
    getVelocity() {
        const tracker = this._getActiveTracker();
        if (!tracker) {
            return this._primitiveValue;
        }
        return { ...tracker.velocity };
    }
    getNbOfTouches() {
        return Object.values(this._touchList).length;
    }
    getTouches() {
        return Object.values(this._touchList);
    }
    getEasingDistance(damping) {
        const deAcceleration = 1 - damping;
        let distance = {
            x: 0,
            y: 0,
        };
        const vel = this.getVelocity();
        Object.keys(vel).forEach(dir => {
            let v = Math.abs(vel[dir]) <= 10 ? 0 : vel[dir];
            while (v !== 0) {
                distance[dir] += v;
                v = (v * deAcceleration) | 0;
            }
        });
        return distance;
    }
    track(evt) {
        if ('TouchEvent' in window && evt instanceof TouchEvent) {
            const { targetTouches, } = evt;
            Array.from(targetTouches).forEach(touch => {
                this._add(touch);
            });
        }
        else {
            this._add(evt);
        }
        return this._touchList;
    }
    update(evt) {
        if ('TouchEvent' in window && evt instanceof TouchEvent) {
            const { touches, changedTouches, } = evt;
            Array.from(touches).forEach(touch => {
                this._renew(touch);
            });
            this._setActiveID(changedTouches);
        }
        else if (evt instanceof PointerEvent) {
            this._renew(evt);
            this._setActiveID(evt);
        }
        return this._touchList;
    }
    release(evt) {
        if ('TouchEvent' in window && evt instanceof TouchEvent) {
            Array.from(evt.changedTouches).forEach(touch => {
                this._delete(touch);
            });
        }
        else {
            this._delete(evt);
        }
    }
    _getIdentifier(touch) {
        if ('Touch' in window && touch instanceof Touch)
            return touch.identifier;
        if (touch instanceof PointerEvent)
            return touch.pointerId;
        return touch.button;
    }
    _add(touch) {
        if (this._has(touch)) {
            this._delete(touch);
        }
        const tracker = new Tracker(touch);
        const identifier = this._getIdentifier(touch);
        this._touchList[identifier] = tracker;
    }
    _renew(touch) {
        if (!this._has(touch)) {
            return;
        }
        const identifier = this._getIdentifier(touch);
        const tracker = this._touchList[identifier];
        tracker.update(touch);
    }
    _delete(touch) {
        const identifier = this._getIdentifier(touch);
        delete this._touchList[identifier];
        if (this._activeTouchID == identifier) {
            this._activeTouchID = undefined;
        }
    }
    _has(touch) {
        const identifier = this._getIdentifier(touch);
        return this._touchList.hasOwnProperty(identifier);
    }
    _setActiveID(touches) {
        if (touches instanceof PointerEvent || touches instanceof MouseEvent) {
            this._activeTouchID = this._getIdentifier(touches);
        }
        else {
            this._activeTouchID = touches[touches.length - 1].identifier;
        }
    }
    _getActiveTracker() {
        const { _touchList, _activeTouchID, } = this;
        if (_activeTouchID !== undefined) {
            return _touchList[_activeTouchID];
        }
        return undefined;
    }
}
TouchRecord.Namespace=`Aventus`;
__as1(_, 'TouchRecord', TouchRecord);

Layout.Scrollable = class Scrollable extends Aventus.WebComponent {
    static get observedAttributes() {return ["zoom"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'min_zoom'() { return this.getNumberAttr('min_zoom') }
    set 'min_zoom'(val) { this.setNumberAttr('min_zoom', val) }get 'max_zoom'() { return this.getNumberAttr('max_zoom') }
    set 'max_zoom'(val) { this.setNumberAttr('max_zoom', val) }get 'y_scroll_visible'() { return this.getBoolAttr('y_scroll_visible') }
    set 'y_scroll_visible'(val) { this.setBoolAttr('y_scroll_visible', val) }get 'x_scroll_visible'() { return this.getBoolAttr('x_scroll_visible') }
    set 'x_scroll_visible'(val) { this.setBoolAttr('x_scroll_visible', val) }get 'floating_scroll'() { return this.getBoolAttr('floating_scroll') }
    set 'floating_scroll'(val) { this.setBoolAttr('floating_scroll', val) }get 'x_scroll'() { return this.getBoolAttr('x_scroll') }
    set 'x_scroll'(val) { this.setBoolAttr('x_scroll', val) }get 'y_scroll'() { return this.getBoolAttr('y_scroll') }
    set 'y_scroll'(val) { this.setBoolAttr('y_scroll', val) }get 'auto_hide'() { return this.getBoolAttr('auto_hide') }
    set 'auto_hide'(val) { this.setBoolAttr('auto_hide', val) }get 'break'() { return this.getNumberAttr('break') }
    set 'break'(val) { this.setNumberAttr('break', val) }get 'disable'() { return this.getBoolAttr('disable') }
    set 'disable'(val) { this.setBoolAttr('disable', val) }get 'no_user_select'() { return this.getBoolAttr('no_user_select') }
    set 'no_user_select'(val) { this.setBoolAttr('no_user_select', val) }get 'mouse_drag'() { return this.getBoolAttr('mouse_drag') }
    set 'mouse_drag'(val) { this.setBoolAttr('mouse_drag', val) }get 'pinch'() { return this.getBoolAttr('pinch') }
    set 'pinch'(val) { this.setBoolAttr('pinch', val) }    get 'zoom'() { return this.getNumberProp('zoom') }
    set 'zoom'(val) { this.setNumberAttr('zoom', val) }    observer;
    display = { x: 0, y: 0 };
    max = {
        x: 0,
        y: 0
    };
    margin = {
        x: 0,
        y: 0
    };
    position = {
        x: 0,
        y: 0
    };
    momentum = { x: 0, y: 0 };
    contentWrapperSize = { x: 0, y: 0 };
    scroller = {
        x: () => {
            if (!this.horizontalScroller) {
                throw 'can\'t find the horizontalScroller';
            }
            return this.horizontalScroller;
        },
        y: () => {
            if (!this.verticalScroller) {
                throw 'can\'t find the verticalScroller';
            }
            return this.verticalScroller;
        }
    };
    scrollerContainer = {
        x: () => {
            if (!this.horizontalScrollerContainer) {
                throw 'can\'t find the horizontalScrollerContainer';
            }
            return this.horizontalScrollerContainer;
        },
        y: () => {
            if (!this.verticalScrollerContainer) {
                throw 'can\'t find the verticalScrollerContainer';
            }
            return this.verticalScrollerContainer;
        }
    };
    hideDelay = { x: 0, y: 0 };
    touchRecord;
    pointerCount = 0;
    loadedOnce = false;
    savedPercent;
    isDragScroller = false;
    cachedSvg;
    previousMidPoint;
    previousDistance;
    startTranslate = { x: 0, y: 0 };
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
    get xMax() {
        return this.max.x;
    }
    get yMax() {
        return this.max.y;
    }
    onScrollChange = new Aventus.Callback();
    onZoomChange = new Aventus.Callback();
    renderAnimation;
    autoScrollInterval = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };
    autoScrollSpeed = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };
    pressManager;
    __registerPropertiesActions() { super.__registerPropertiesActions(); this.__addPropertyActions("zoom", ((target) => {
    target.changeZoom();
})); }
    static __style = `:host{--internal-scrollbar-container-color: var(--scrollbar-container-color, transparent);--internal-scrollbar-color: var(--scrollbar-color, #757575);--internal-scrollbar-active-color: var(--scrollbar-active-color, #858585);--internal-scroller-width: var(--scroller-width, 6px);--internal-scroller-top: var(--scroller-top, 3px);--internal-scroller-bottom: var(--scroller-bottom, 3px);--internal-scroller-right: var(--scroller-right, 3px);--internal-scroller-left: var(--scroller-left, 3px);--_scrollbar-content-padding: var(--scrollbar-content-padding, 0);--_scrollbar-container-display: var(--scrollbar-container-display, inline-block)}:host{display:block;height:100%;min-height:inherit;min-width:inherit;overflow:clip;position:relative;-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;-o-user-drag:none;width:100%}:host .scroll-main-container{display:block;height:100%;min-height:inherit;min-width:inherit;position:relative;width:100%}:host .scroll-main-container .content-zoom{display:block;height:100%;min-height:inherit;min-width:inherit;position:relative;transform-origin:0 0;width:100%;z-index:4}:host .scroll-main-container .content-zoom .content-hidder{display:block;height:100%;min-height:inherit;min-width:inherit;overflow:clip;position:relative;width:100%}:host .scroll-main-container .content-zoom .content-hidder .content-wrapper{display:var(--_scrollbar-container-display);height:100%;min-height:inherit;min-width:inherit;padding:var(--_scrollbar-content-padding);position:relative;width:100%}:host .scroll-main-container .scroller-wrapper .container-scroller{display:none;overflow:hidden;position:absolute;transition:transform .2s linear;z-index:5}:host .scroll-main-container .scroller-wrapper .container-scroller .shadow-scroller{background-color:var(--internal-scrollbar-container-color);border-radius:5px}:host .scroll-main-container .scroller-wrapper .container-scroller .shadow-scroller .scroller{background-color:var(--internal-scrollbar-color);border-radius:5px;cursor:pointer;position:absolute;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;z-index:5}:host .scroll-main-container .scroller-wrapper .container-scroller .scroller.active{background-color:var(--internal-scrollbar-active-color)}:host .scroll-main-container .scroller-wrapper .container-scroller.vertical{height:calc(100% - var(--internal-scroller-bottom)*2 - var(--internal-scroller-width));padding-left:var(--internal-scroller-left);right:var(--internal-scroller-right);top:var(--internal-scroller-bottom);transform:0;width:calc(var(--internal-scroller-width) + var(--internal-scroller-left))}:host .scroll-main-container .scroller-wrapper .container-scroller.vertical.hide{transform:translateX(calc(var(--internal-scroller-width) + var(--internal-scroller-left)))}:host .scroll-main-container .scroller-wrapper .container-scroller.vertical .shadow-scroller{height:100%}:host .scroll-main-container .scroller-wrapper .container-scroller.vertical .shadow-scroller .scroller{width:calc(100% - var(--internal-scroller-left))}:host .scroll-main-container .scroller-wrapper .container-scroller.horizontal{bottom:var(--internal-scroller-bottom);height:calc(var(--internal-scroller-width) + var(--internal-scroller-top));left:var(--internal-scroller-right);padding-top:var(--internal-scroller-top);transform:0;width:calc(100% - var(--internal-scroller-right)*2 - var(--internal-scroller-width))}:host .scroll-main-container .scroller-wrapper .container-scroller.horizontal.hide{transform:translateY(calc(var(--internal-scroller-width) + var(--internal-scroller-top)))}:host .scroll-main-container .scroller-wrapper .container-scroller.horizontal .shadow-scroller{height:100%}:host .scroll-main-container .scroller-wrapper .container-scroller.horizontal .shadow-scroller .scroller{height:calc(100% - var(--internal-scroller-top))}:host([y_scroll]) .scroll-main-container .content-zoom .content-hidder .content-wrapper{height:auto}:host([x_scroll]) .scroll-main-container .content-zoom .content-hidder .content-wrapper{width:auto}:host([y_scroll_visible]) .scroll-main-container .scroller-wrapper .container-scroller.vertical{display:block}:host([x_scroll_visible]) .scroll-main-container .scroller-wrapper .container-scroller.horizontal{display:block}:host([no_user_select]) .content-wrapper *{user-select:none}:host([no_user_select]) ::slotted{user-select:none}`;
    constructor() {
        super();
        this.renderAnimation = this.createAnimation();
        this.onWheel = this.onWheel.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMovePointer = this.onTouchMovePointer.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchMovePointer = this.onTouchMovePointer.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchEndPointer = this.onTouchEndPointer.bind(this);
        this.touchRecord = new TouchRecord();
    }
    __getStatic() {
        return Scrollable;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Scrollable.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<div class="scroll-main-container" _id="scrollable_0">    <div class="content-zoom" _id="scrollable_1">        <div class="content-hidder" _id="scrollable_2">            <div class="content-wrapper" part="content-wrapper" _id="scrollable_3">                <slot></slot>            </div>        </div>    </div>    <div class="scroller-wrapper">        <div class="container-scroller vertical" _id="scrollable_4">            <div class="shadow-scroller">                <div class="scroller" _id="scrollable_5"></div>            </div>        </div>        <div class="container-scroller horizontal" _id="scrollable_6">            <div class="shadow-scroller">                <div class="scroller" _id="scrollable_7"></div>            </div>        </div>    </div></div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "mainContainer",
      "ids": [
        "scrollable_0"
      ]
    },
    {
      "name": "contentZoom",
      "ids": [
        "scrollable_1"
      ]
    },
    {
      "name": "contentHidder",
      "ids": [
        "scrollable_2"
      ]
    },
    {
      "name": "contentWrapper",
      "ids": [
        "scrollable_3"
      ]
    },
    {
      "name": "verticalScrollerContainer",
      "ids": [
        "scrollable_4"
      ]
    },
    {
      "name": "verticalScroller",
      "ids": [
        "scrollable_5"
      ]
    },
    {
      "name": "horizontalScrollerContainer",
      "ids": [
        "scrollable_6"
      ]
    },
    {
      "name": "horizontalScroller",
      "ids": [
        "scrollable_7"
      ]
    }
  ]
}); }
    getClassName() {
        return "Scrollable";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('min_zoom')){ this['min_zoom'] = 1; }if(!this.hasAttribute('max_zoom')){ this['max_zoom'] = undefined; }if(!this.hasAttribute('y_scroll_visible')) { this.attributeChangedCallback('y_scroll_visible', false, false); }if(!this.hasAttribute('x_scroll_visible')) { this.attributeChangedCallback('x_scroll_visible', false, false); }if(!this.hasAttribute('floating_scroll')) { this.attributeChangedCallback('floating_scroll', false, false); }if(!this.hasAttribute('x_scroll')) { this.attributeChangedCallback('x_scroll', false, false); }if(!this.hasAttribute('y_scroll')) {this.setAttribute('y_scroll' ,'true'); }if(!this.hasAttribute('auto_hide')) { this.attributeChangedCallback('auto_hide', false, false); }if(!this.hasAttribute('break')){ this['break'] = 0.1; }if(!this.hasAttribute('disable')) { this.attributeChangedCallback('disable', false, false); }if(!this.hasAttribute('no_user_select')) { this.attributeChangedCallback('no_user_select', false, false); }if(!this.hasAttribute('mouse_drag')) { this.attributeChangedCallback('mouse_drag', false, false); }if(!this.hasAttribute('pinch')) { this.attributeChangedCallback('pinch', false, false); }if(!this.hasAttribute('zoom')){ this['zoom'] = 1; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('x');this.__correctGetter('y');this.__correctGetter('xMax');this.__correctGetter('yMax');this.__upgradeProperty('min_zoom');this.__upgradeProperty('max_zoom');this.__upgradeProperty('y_scroll_visible');this.__upgradeProperty('x_scroll_visible');this.__upgradeProperty('floating_scroll');this.__upgradeProperty('x_scroll');this.__upgradeProperty('y_scroll');this.__upgradeProperty('auto_hide');this.__upgradeProperty('break');this.__upgradeProperty('disable');this.__upgradeProperty('no_user_select');this.__upgradeProperty('mouse_drag');this.__upgradeProperty('pinch');this.__upgradeProperty('zoom'); }
    __listBoolProps() { return ["y_scroll_visible","x_scroll_visible","floating_scroll","x_scroll","y_scroll","auto_hide","disable","no_user_select","mouse_drag","pinch"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    createAnimation() {
        return new Aventus.Animation({
            fps: 60,
            animate: () => {
                const nextX = this.nextPosition('x');
                const nextY = this.nextPosition('y');
                this.momentum.x = nextX.momentum;
                this.momentum.y = nextY.momentum;
                this.scrollDirection('x', nextX.position);
                this.scrollDirection('y', nextY.position);
                if (!this.momentum.x && !this.momentum.y) {
                    this.renderAnimation.stop();
                }
            },
            stopped: () => {
                if (this.momentum.x || this.momentum.y) {
                    this.renderAnimation.start();
                }
            }
        });
    }
    nextPosition(direction) {
        const current = this.position[direction];
        const remain = this.momentum[direction];
        let result = {
            momentum: 0,
            position: 0,
        };
        if (Math.abs(remain) <= 0.1) {
            result.position = current + remain;
        }
        else {
            const _break = this.pointerCount > 0 ? 0.5 : this.break;
            let nextMomentum = remain * (1 - _break);
            nextMomentum |= 0;
            result.momentum = nextMomentum;
            result.position = current + remain - nextMomentum;
        }
        let correctPosition = this.correctScrollValue(result.position, direction);
        if (correctPosition != result.position) {
            result.position = correctPosition;
            result.momentum = 0;
        }
        return result;
    }
    scrollDirection(direction, value) {
        const max = this.max[direction];
        if (max != 0) {
            this.position[direction] = this.correctScrollValue(value, direction);
        }
        else {
            this.position[direction] = 0;
        }
        let container = this.scrollerContainer[direction]();
        let scroller = this.scroller[direction]();
        if (this.auto_hide) {
            container.classList.remove("hide");
            clearTimeout(this.hideDelay[direction]);
            this.hideDelay[direction] = setTimeout(() => {
                container.classList.add("hide");
            }, 1000);
        }
        let containerSize = direction == 'y' ? container.offsetHeight : container.offsetWidth;
        if (this.contentWrapperSize[direction] != 0) {
            let scrollPosition = this.position[direction] / this.contentWrapperSize[direction] * containerSize;
            scroller.style.transform = `translate${direction.toUpperCase()}(${scrollPosition}px)`;
            this.contentWrapper.style.transform = `translate3d(${-1 * this.x}px, ${-1 * this.y}px, 0)`;
        }
        this.triggerScrollChange();
    }
    scrollDirectionPercent(direction, percent) {
        const max = this.max[direction];
        this.scrollDirection(direction, max * percent / 100);
    }
    correctScrollValue(value, direction) {
        if (value < 0) {
            value = 0;
        }
        else if (value > this.max[direction]) {
            value = this.max[direction];
        }
        return value;
    }
    triggerScrollChange() {
        this.onScrollChange.trigger(this.x, this.y);
    }
    scrollToPosition(x, y) {
        this.scrollDirection('x', x);
        this.scrollDirection('y', y);
    }
    scrollX(x) {
        this.scrollDirection('x', x);
    }
    scrollXPercent(x) {
        this.scrollDirectionPercent('x', x);
    }
    scrollY(y) {
        this.scrollDirection('y', y);
    }
    scrollYPercent(y) {
        this.scrollDirectionPercent('y', y);
    }
    startAutoScrollRight() {
        if (!this.autoScrollInterval.right) {
            this.stopAutoScrollLeft();
            this.autoScrollInterval.right = setInterval(() => {
                if (this.x == this.max.x) {
                    this.stopAutoScrollRight();
                    return;
                }
                this.addDelta({
                    x: this.autoScrollSpeed.right,
                    y: 0
                });
            }, 100);
        }
    }
    autoScrollRight(percent = 50) {
        let slow = this.max.x * 1 / 100;
        let fast = this.max.x * 10 / 100;
        this.autoScrollSpeed.right = (fast - slow) * (percent / 100) + slow;
        this.startAutoScrollRight();
    }
    stopAutoScrollRight() {
        if (this.autoScrollInterval.right) {
            clearInterval(this.autoScrollInterval.right);
            this.autoScrollInterval.right = 0;
        }
    }
    startAutoScrollLeft() {
        if (!this.autoScrollInterval.left) {
            this.stopAutoScrollRight();
            this.autoScrollInterval.left = setInterval(() => {
                if (this.x == 0) {
                    this.stopAutoScrollLeft();
                    return;
                }
                this.addDelta({
                    x: this.autoScrollSpeed.left * -1,
                    y: 0
                });
            }, 100);
        }
    }
    autoScrollLeft(percent = 50) {
        let slow = this.max.x * 1 / 100;
        let fast = this.max.x * 10 / 100;
        this.autoScrollSpeed.left = (fast - slow) * (percent / 100) + slow;
        this.startAutoScrollLeft();
    }
    stopAutoScrollLeft() {
        if (this.autoScrollInterval.left) {
            clearInterval(this.autoScrollInterval.left);
            this.autoScrollInterval.left = 0;
        }
    }
    startAutoScrollTop() {
        if (!this.autoScrollInterval.top) {
            this.stopAutoScrollBottom();
            this.autoScrollInterval.top = setInterval(() => {
                if (this.y == 0) {
                    this.stopAutoScrollTop();
                    return;
                }
                this.addDelta({
                    x: 0,
                    y: this.autoScrollSpeed.top * -1
                });
            }, 100);
        }
    }
    autoScrollTop(percent = 50) {
        let slow = this.max.y * 1 / 100;
        let fast = this.max.y * 10 / 100;
        this.autoScrollSpeed.top = (fast - slow) * (percent / 100) + slow;
        this.startAutoScrollTop();
    }
    stopAutoScrollTop() {
        if (this.autoScrollInterval.top) {
            clearInterval(this.autoScrollInterval.top);
            this.autoScrollInterval.top = 0;
        }
    }
    startAutoScrollBottom() {
        if (!this.autoScrollInterval.bottom) {
            this.stopAutoScrollTop();
            this.autoScrollInterval.bottom = setInterval(() => {
                if (this.y == this.max.y) {
                    this.stopAutoScrollBottom();
                    return;
                }
                this.addDelta({
                    x: 0,
                    y: this.autoScrollSpeed.bottom
                });
            }, 100);
        }
    }
    autoScrollBottom(percent = 50) {
        let slow = this.max.y * 1 / 100;
        let fast = this.max.y * 10 / 100;
        this.autoScrollSpeed.bottom = (fast - slow) * (percent / 100) + slow;
        this.startAutoScrollBottom();
    }
    stopAutoScrollBottom() {
        if (this.autoScrollInterval.bottom) {
            clearInterval(this.autoScrollInterval.bottom);
            this.autoScrollInterval.bottom = 0;
        }
    }
    createMatrix() {
        if (!this.cachedSvg) {
            this.cachedSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        }
        return this.cachedSvg.createSVGMatrix();
    }
    getMidPoint(a, b) {
        return {
            x: (a.lastPosition.x + b.lastPosition.x) / 2,
            y: (a.lastPosition.y + b.lastPosition.y) / 2,
        };
    }
    getDistance(a, b) {
        return Math.sqrt((b.lastPosition.x - a.lastPosition.x) ** 2 + (b.lastPosition.y - a.lastPosition.y) ** 2);
    }
    zoomOnPoint(clientX, clientY, newZoom) {
        let targetCoordinates = this.getBoundingClientRect();
        let mousePositionRelativeToTarget = {
            x: targetCoordinates.x - clientX,
            y: targetCoordinates.y - clientY
        };
        let oldScale = this.zoom;
        let newScale;
        if (this.max_zoom > 0) {
            newScale = Math.max(this.min_zoom, Math.min(this.max_zoom, newZoom));
        }
        else {
            newScale = Math.max(this.min_zoom, newZoom);
        }
        let scaleDiff = newScale / oldScale;
        const matrix = this.createMatrix()
            .translate(this.x, this.y)
            .translate(mousePositionRelativeToTarget.x, mousePositionRelativeToTarget.y)
            .scale(scaleDiff)
            .translate(-mousePositionRelativeToTarget.x, -mousePositionRelativeToTarget.y)
            .scale(this.zoom);
        const newZoomFinal = matrix.a || 1;
        const newX = matrix.e || 0;
        const newY = matrix.f || 0;
        this.zoom = newZoomFinal;
        this.onZoomChange.trigger(newZoomFinal);
        this.scrollDirection('x', newX);
        this.scrollDirection('y', newY);
    }
    pinchAction() {
        const touches = this.touchRecord.getTouches();
        if (touches.length == 2) {
            const newMidpoint = this.getMidPoint(touches[0], touches[1]);
            const prevMidpoint = this.previousMidPoint ?? newMidpoint;
            const positioningElRect = this.getBoundingClientRect();
            const originX = (positioningElRect.left + this.x - this.startTranslate.x) - prevMidpoint.x;
            const originY = (positioningElRect.top + this.y - this.startTranslate.y) - prevMidpoint.y;
            const newDistance = this.getDistance(touches[0], touches[1]);
            const prevDistance = this.previousDistance;
            let scaleDiff = prevDistance ? newDistance / prevDistance : 1;
            const panX = prevMidpoint.x - newMidpoint.x;
            const panY = prevMidpoint.y - newMidpoint.y;
            let oldScale = this.zoom;
            let newScale;
            if (this.max_zoom > 0) {
                newScale = Math.max(this.min_zoom, Math.min(this.max_zoom, oldScale * scaleDiff));
            }
            else {
                newScale = Math.max(this.min_zoom, oldScale * scaleDiff);
            }
            scaleDiff = newScale / oldScale;
            const matrix = this.createMatrix()
                .translate(panX, panY)
                .translate(originX, originY)
                .translate(this.x, this.y)
                .scale(scaleDiff)
                .translate(-originX, -originY)
                .scale(this.zoom);
            const newZoom = matrix.a || 1;
            const newX = matrix.e || 0;
            const newY = matrix.f || 0;
            this.zoom = newZoom;
            this.onZoomChange.trigger(newZoom);
            this.scrollDirection('x', newX);
            this.scrollDirection('y', newY);
            this.previousMidPoint = newMidpoint;
            this.previousDistance = newDistance;
        }
        return null;
    }
    addAction() {
        this.addEventListener("wheel", this.onWheel, { passive: false });
        this.pressManager = new Aventus.PressManager({
            element: this,
            offsetDrag: 0,
            onPressStart: (e) => {
                this.touchRecord.track(e.event);
                this.pointerCount = this.touchRecord.getNbOfTouches();
            },
            onPressEnd: (e) => {
                this.touchRecord.release(e.event);
                this.pointerCount = this.touchRecord.getNbOfTouches();
            },
            onDragStart: (e) => {
                if (!this.pinch && !this.x_scroll_visible && !this.y_scroll_visible) {
                    return false;
                }
                return this.onTouchStartPointer(e);
            },
            onDrag: (e) => {
                this.onTouchMovePointer(e);
            },
            onDragEnd: (e) => {
                this.onTouchEndPointer(e);
            }
        });
        // this.addEventListener("touchstart", this.onTouchStart);
        // this.addEventListener("trigger_pointer_pressstart", this.onTouchStartPointer);
        if (this.mouse_drag) {
            // this.addEventListener("mousedown", this.onTouchStart);
        }
        this.addScrollDrag('x');
        this.addScrollDrag('y');
    }
    addActionMove() {
        // document.body.addEventListener("touchmove", this.onTouchMove);
        // document.body.addEventListener("trigger_pointer_pressmove", this.onTouchMovePointer);
        // document.body.addEventListener("touchcancel", this.onTouchEnd);
        // document.body.addEventListener("touchend", this.onTouchEnd);
        // document.body.addEventListener("trigger_pointer_pressend", this.onTouchEndPointer);
        if (this.mouse_drag) {
            // document.body.addEventListener("mousemove", this.onTouchMove);
            // document.body.addEventListener("mouseup", this.onTouchEnd);
        }
    }
    removeActionMove() {
        // document.body.removeEventListener("touchmove", this.onTouchMove);
        // document.body.removeEventListener("trigger_pointer_pressmove", this.onTouchMovePointer);
        // document.body.removeEventListener("touchcancel", this.onTouchEnd);
        // document.body.removeEventListener("touchend", this.onTouchEnd);
        // document.body.removeEventListener("trigger_pointer_pressend", this.onTouchEndPointer);
        // document.body.removeEventListener("mousemove", this.onTouchMove);
        // document.body.removeEventListener("mouseup", this.onTouchEnd);
    }
    addScrollDrag(direction) {
        let scroller = this.scroller[direction]();
        let startPosition = 0;
        new Aventus.DragAndDrop({
            element: scroller,
            applyDrag: false,
            usePercent: true,
            offsetDrag: 0,
            isDragEnable: () => !this.disable,
            onStart: (e) => {
                this.isDragScroller = true;
                this.no_user_select = true;
                scroller.classList.add("active");
                startPosition = this.position[direction];
            },
            onMove: (e, position) => {
                let delta = position[direction] / 100 * this.contentWrapperSize[direction];
                let value = startPosition + delta;
                this.scrollDirection(direction, value);
            },
            onStop: () => {
                this.no_user_select = false;
                scroller.classList.remove("active");
                this.isDragScroller = false;
            }
        });
    }
    shouldStopPropagation(e, delta) {
        if (!this.y_scroll && this.x_scroll) {
            if ((delta.x > 0 && this.x != this.max.x) ||
                (delta.x <= 0 && this.x != 0)) {
                e.stopPropagation();
            }
        }
        else {
            if ((delta.y > 0 && this.y != this.max.y) ||
                (delta.y <= 0 && this.y != 0)) {
                e.stopPropagation();
            }
        }
    }
    addDelta(delta) {
        if (this.disable) {
            return;
        }
        this.momentum.x += delta.x;
        this.momentum.y += delta.y;
        this.renderAnimation?.start();
    }
    onWheel(e) {
        if (e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            if (this.pinch) {
                let factor = 0.9;
                if (e.deltaY < 0) {
                    factor = 1.1;
                }
                this.zoomOnPoint(e.clientX, e.clientY, this.zoom * factor);
            }
            return;
        }
        const DELTA_MODE = [1.0, 28.0, 500.0];
        const mode = DELTA_MODE[e.deltaMode] || DELTA_MODE[0];
        let newValue = {
            x: 0,
            y: e.deltaY * mode,
        };
        if (!this.y_scroll && this.x_scroll) {
            newValue = {
                x: e.deltaY * mode,
                y: 0,
            };
        }
        else if (this.x_scroll && e.altKey) {
            newValue = {
                x: e.deltaY * mode,
                y: 0,
            };
        }
        this.shouldStopPropagation(e, newValue);
        this.addDelta(newValue);
    }
    onTouchStartPointer(e) {
        const ev = e.event;
        if ('TouchEvent' in window && ev instanceof TouchEvent) {
            this.onTouchStart(ev);
            return true;
        }
        else if (ev instanceof PointerEvent) {
            if (this.mouse_drag || ev.pointerType == "touch") {
                this.onTouchStart(ev);
                return true;
            }
        }
        return false;
    }
    onTouchStart(e) {
        if (this.isDragScroller)
            return;
        this.touchRecord.track(e);
        this.momentum = {
            x: 0,
            y: 0
        };
        if (this.pointerCount === 0) {
            this.addActionMove();
        }
        this.pointerCount = this.touchRecord.getNbOfTouches();
        if (this.pinch && this.pointerCount == 2) {
            this.startTranslate = { x: this.x, y: this.y };
        }
    }
    onTouchMovePointer(e) {
        const ev = e.event;
        if ('TouchEvent' in window && ev instanceof TouchEvent) {
            this.onTouchMove(ev);
        }
        else if (ev instanceof PointerEvent) {
            if (this.mouse_drag || ev.pointerType == "touch") {
                this.onTouchMove(ev);
            }
        }
    }
    onTouchMove(e) {
        if (this.isDragScroller)
            return;
        this.touchRecord.update(e);
        if (this.pinch && this.pointerCount == 2) {
            // zoom
            e.stopPropagation();
            this.renderAnimation?.stop();
            this.pinchAction();
        }
        else {
            const delta = this.touchRecord.getDelta();
            this.shouldStopPropagation(e, delta);
            this.addDelta(delta);
        }
    }
    onTouchEndPointer(e) {
        const ev = e.event;
        if ('TouchEvent' in window && ev instanceof TouchEvent) {
            this.onTouchEnd(ev);
        }
        else if (ev instanceof PointerEvent) {
            if (this.mouse_drag || ev.pointerType == "touch") {
                this.onTouchEnd(ev);
            }
        }
    }
    onTouchEnd(e) {
        if (this.isDragScroller)
            return;
        const delta = this.touchRecord.getEasingDistance(this.break);
        this.shouldStopPropagation(e, delta);
        this.addDelta(delta);
        this.touchRecord.release(e);
        this.pointerCount = this.touchRecord.getNbOfTouches();
        if (this.pointerCount === 0) {
            this.removeActionMove();
        }
        if (this.pointerCount < 2) {
            this.previousMidPoint = undefined;
            this.previousDistance = undefined;
        }
    }
    calculateRealSize() {
        if (!this.contentZoom || !this.mainContainer || !this.contentWrapper) {
            return false;
        }
        const currentOffsetWidth = this.contentZoom.offsetWidth;
        const currentOffsetHeight = this.contentZoom.offsetHeight;
        let hasChanged = false;
        if (this.contentWrapper.offsetWidth != this.contentWrapperSize.x || this.contentWrapper.offsetHeight != this.contentWrapperSize.y)
            hasChanged = true;
        this.contentWrapperSize.x = this.contentWrapper.offsetWidth;
        this.contentWrapperSize.y = this.contentWrapper.offsetHeight;
        if (this.zoom < 1) {
            // scale the container for zoom
            this.contentZoom.style.width = this.mainContainer.offsetWidth / this.zoom + 'px';
            this.contentZoom.style.height = this.mainContainer.offsetHeight / this.zoom + 'px';
            this.contentZoom.style.maxHeight = this.mainContainer.offsetHeight / this.zoom + 'px';
            if (currentOffsetHeight != this.display.y || currentOffsetWidth != this.display.x)
                hasChanged = true;
            this.display.y = currentOffsetHeight;
            this.display.x = currentOffsetWidth;
        }
        else {
            const newX = currentOffsetWidth / this.zoom;
            const newY = currentOffsetHeight / this.zoom;
            if (newY != this.display.y || newX != this.display.x)
                hasChanged = true;
            this.display.y = newY;
            this.display.x = newX;
            this.contentZoom.style.width = '';
            this.contentZoom.style.height = '';
            this.contentZoom.style.maxHeight = '';
        }
        return hasChanged;
    }
    calculatePositionScrollerContainer(direction) {
        if (direction == 'y') {
            this.calculatePositionScrollerContainerY();
        }
        else {
            this.calculatePositionScrollerContainerX();
        }
    }
    calculatePositionScrollerContainerY() {
        const leftMissing = this.mainContainer.offsetWidth - this.verticalScrollerContainer.offsetLeft;
        if (leftMissing > 0 && this.y_scroll_visible && !this.floating_scroll) {
            this.contentHidder.style.width = 'calc(100% - ' + leftMissing + 'px)';
            this.contentHidder.style.marginRight = leftMissing + 'px';
            this.margin.x = leftMissing;
        }
        else {
            this.contentHidder.style.width = '';
            this.contentHidder.style.marginRight = '';
            this.margin.x = 0;
        }
    }
    calculatePositionScrollerContainerX() {
        const topMissing = this.mainContainer.offsetHeight - this.horizontalScrollerContainer.offsetTop;
        if (topMissing > 0 && this.x_scroll_visible && !this.floating_scroll) {
            this.contentHidder.style.height = 'calc(100% - ' + topMissing + 'px)';
            this.contentHidder.style.marginBottom = topMissing + 'px';
            this.margin.y = topMissing;
        }
        else {
            this.contentHidder.style.height = '';
            this.contentHidder.style.marginBottom = '';
            this.margin.y = 0;
        }
    }
    calculateSizeScroller(direction) {
        const scrollerSize = ((this.display[direction] - this.margin[direction]) / this.contentWrapperSize[direction] * 100);
        if (direction == "y") {
            this.scroller[direction]().style.height = scrollerSize + '%';
        }
        else {
            this.scroller[direction]().style.width = scrollerSize + '%';
        }
        let maxScrollContent = this.contentWrapperSize[direction] - this.display[direction];
        if (maxScrollContent < 0) {
            maxScrollContent = 0;
        }
        this.max[direction] = maxScrollContent + this.margin[direction];
    }
    changeZoom() {
        this.contentZoom.style.transform = 'scale(' + this.zoom + ')';
        this.dimensionRefreshed(true);
    }
    dimensionRefreshed(force = false) {
        if (this.contentWrapper.offsetHeight > 0 && this.contentWrapper.offsetWidth > 0) {
            this.loadedOnce = true;
            if (this.savedPercent) {
                this.position.x = this.contentWrapper.offsetWidth * this.savedPercent.x;
                this.position.y = this.contentWrapper.offsetHeight * this.savedPercent.y;
                this.savedPercent = undefined;
            }
        }
        else if (this.loadedOnce) {
            this.savedPercent = {
                x: this.position.x / this.contentWrapperSize.x,
                y: this.position.y / this.contentWrapperSize.y
            };
        }
        if (!this.calculateRealSize() && !force) {
            return;
        }
        if (this.contentWrapperSize.y - this.display.y > 0) {
            if (!this.y_scroll_visible) {
                this.y_scroll_visible = true;
                this.calculatePositionScrollerContainer('y');
            }
            this.calculateSizeScroller('y');
            this.scrollDirection('y', this.y);
        }
        else if (this.y_scroll_visible) {
            this.y_scroll_visible = false;
            this.calculatePositionScrollerContainer('y');
            this.calculateSizeScroller('y');
            this.scrollDirection('y', 0);
        }
        if (this.contentWrapperSize.x - this.display.x > 0) {
            if (!this.x_scroll_visible) {
                this.x_scroll_visible = true;
                this.calculatePositionScrollerContainer('x');
            }
            this.calculateSizeScroller('x');
            this.scrollDirection('x', this.x);
        }
        else if (this.x_scroll_visible) {
            this.x_scroll_visible = false;
            this.calculatePositionScrollerContainer('x');
            this.calculateSizeScroller('x');
            this.scrollDirection('x', 0);
        }
    }
    createResizeObserver() {
        let inProgress = false;
        return new Aventus.ResizeObserver({
            callback: entries => {
                if (inProgress) {
                    return;
                }
                inProgress = true;
                this.dimensionRefreshed();
                inProgress = false;
            },
            fps: 30
        });
    }
    addResizeObserver() {
        if (this.observer == undefined) {
            this.observer = this.createResizeObserver();
        }
        this.observer.observe(this.contentWrapper);
        this.observer.observe(this);
    }
    postCreation() {
        this.dimensionRefreshed();
        this.addResizeObserver();
        this.addAction();
    }
    static lock(element) {
        const container = element.findParentByType(Layout.Scrollable);
        if (container) {
            container.disable = true;
        }
    }
    static unlock(element) {
        const container = element.findParentByType(Layout.Scrollable);
        if (container) {
            container.disable = false;
        }
    }
}
Layout.Scrollable.Namespace=`Aventus.Layout`;
Layout.Scrollable.Tag=`av-scrollable`;
__as1(_.Layout, 'Scrollable', Layout.Scrollable);
if(!window.customElements.get('av-scrollable')){window.customElements.define('av-scrollable', Layout.Scrollable);Aventus.WebComponentInstance.registerDefinition(Layout.Scrollable);}

let Process=class Process {
    static handleErrors;
    static configure(config) {
        this.handleErrors = config.handleErrors;
    }
    static async execute(prom) {
        const queryResult = await prom;
        return await this.parseErrors(queryResult);
    }
    static async parseErrors(result) {
        if (result.errors.length > 0) {
            if (this.handleErrors) {
                let msg = result.errors.map(p => p.message.replace(/\n/g, '<br/>')).join("<br/>");
                this.handleErrors(msg, result.errors);
            }
            return undefined;
        }
        if (result instanceof Aventus.ResultWithError)
            return result.result;
        return undefined;
    }
}
Process.Namespace=`Aventus`;
__as1(_, 'Process', Process);

Lib.ShortcutManager=class ShortcutManager {
    static memory = {};
    static autoPrevents = [];
    static isInit = false;
    static arrayKeys = [];
    static options = new Map();
    static replacingMemory = {};
    static isTxt(touch) {
        return touch.match(/[a-zA-Z0-9_\+\-]/g);
    }
    static getText(combinaison) {
        let allTouches = [];
        for (let touch of combinaison) {
            let realTouch = "";
            if (typeof touch == "number" && Lib.SpecialTouch[touch] !== undefined) {
                realTouch = Lib.SpecialTouch[touch];
            }
            else if (this.isTxt(touch)) {
                realTouch = touch;
            }
            else {
                throw "I can't use " + touch + " to add a shortcut";
            }
            allTouches.push(realTouch);
        }
        allTouches.sort();
        return allTouches.join("+");
    }
    static subscribe(combinaison, cb, options) {
        if (!Array.isArray(combinaison)) {
            combinaison = [combinaison];
        }
        let key = this.getText(combinaison);
        if (options?.replaceTemp) {
            if (Lib.ShortcutManager.memory[key]) {
                if (!this.replacingMemory[key]) {
                    this.replacingMemory[key] = [];
                }
                this.replacingMemory[key].push(Lib.ShortcutManager.memory[key]);
                delete Lib.ShortcutManager.memory[key];
            }
        }
        if (!Lib.ShortcutManager.memory[key]) {
            Lib.ShortcutManager.memory[key] = [];
        }
        if (!Lib.ShortcutManager.memory[key].includes(cb)) {
            Lib.ShortcutManager.memory[key].push(cb);
            if (options) {
                this.options.set(cb, options);
            }
        }
        if (!Lib.ShortcutManager.isInit) {
            Lib.ShortcutManager.init();
        }
    }
    static unsubscribe(combinaison, cb) {
        if (!Array.isArray(combinaison)) {
            combinaison = [combinaison];
        }
        let key = this.getText(combinaison);
        if (Lib.ShortcutManager.memory[key]) {
            let index = Lib.ShortcutManager.memory[key].indexOf(cb);
            if (index != -1) {
                Lib.ShortcutManager.memory[key].splice(index, 1);
                let options = this.options.get(cb);
                if (options) {
                    this.options.delete(cb);
                }
                if (Lib.ShortcutManager.memory[key].length == 0) {
                    delete Lib.ShortcutManager.memory[key];
                    if (options?.replaceTemp) {
                        if (this.replacingMemory[key]) {
                            if (this.replacingMemory[key].length > 0) {
                                Lib.ShortcutManager.memory[key] = this.replacingMemory[key].pop();
                                if (this.replacingMemory[key].length == 0) {
                                    delete this.replacingMemory[key];
                                }
                            }
                            else {
                                delete this.replacingMemory[key];
                            }
                        }
                    }
                }
                if (Object.keys(Lib.ShortcutManager.memory).length == 0 && Lib.ShortcutManager.isInit) {
                    //ShortcutManager.uninit();
                }
            }
        }
    }
    static onKeyDown(e) {
        if (e.ctrlKey) {
            let txt = Lib.SpecialTouch[Lib.SpecialTouch.Control];
            if (!this.arrayKeys.includes(txt)) {
                this.arrayKeys.push(txt);
            }
        }
        if (e.altKey) {
            let txt = Lib.SpecialTouch[Lib.SpecialTouch.Alt];
            if (!this.arrayKeys.includes(txt)) {
                this.arrayKeys.push(txt);
            }
        }
        if (e.shiftKey) {
            let txt = Lib.SpecialTouch[Lib.SpecialTouch.Shift];
            if (!this.arrayKeys.includes(txt)) {
                this.arrayKeys.push(txt);
            }
        }
        if (this.isTxt(e.key) && !this.arrayKeys.includes(e.key)) {
            this.arrayKeys.push(e.key);
        }
        else if (Lib.SpecialTouch[e.key] !== undefined && !this.arrayKeys.includes(e.key)) {
            this.arrayKeys.push(e.key);
        }
        this.arrayKeys.sort();
        let key = this.arrayKeys.join("+");
        if (Lib.ShortcutManager.memory[key]) {
            let preventDefault = true;
            for (let cb of Lib.ShortcutManager.memory[key]) {
                let options = this.options.get(cb);
                if (options && options.preventDefault === false) {
                    preventDefault = false;
                }
            }
            this.arrayKeys = [];
            for (let cb of Lib.ShortcutManager.memory[key]) {
                const result = cb();
                if (result === false) {
                    preventDefault = result;
                }
            }
            if (preventDefault) {
                e.preventDefault();
            }
        }
        else if (Lib.ShortcutManager.autoPrevents.includes(key)) {
            e.preventDefault();
        }
    }
    static onKeyUp(e) {
        let index = this.arrayKeys.indexOf(e.key);
        if (index != -1) {
            this.arrayKeys.splice(index, 1);
        }
    }
    static init() {
        if (Lib.ShortcutManager.isInit)
            return;
        Lib.ShortcutManager.isInit = true;
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        Lib.ShortcutManager.autoPrevents = [
            this.getText([Lib.SpecialTouch.Control, "s"]),
            this.getText([Lib.SpecialTouch.Control, "p"]),
            this.getText([Lib.SpecialTouch.Control, "l"]),
            this.getText([Lib.SpecialTouch.Control, "k"]),
            this.getText([Lib.SpecialTouch.Control, "j"]),
            this.getText([Lib.SpecialTouch.Control, "h"]),
            this.getText([Lib.SpecialTouch.Control, "g"]),
            this.getText([Lib.SpecialTouch.Control, "f"]),
            this.getText([Lib.SpecialTouch.Control, "d"]),
            this.getText([Lib.SpecialTouch.Control, "o"]),
            this.getText([Lib.SpecialTouch.Control, "u"]),
            this.getText([Lib.SpecialTouch.Control, "e"]),
        ];
        window.addEventListener("blur", () => {
            this.arrayKeys = [];
        });
        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("keyup", this.onKeyUp);
    }
    static uninit() {
        document.body.removeEventListener("keydown", this.onKeyDown);
        document.body.removeEventListener("keyup", this.onKeyUp);
        this.arrayKeys = [];
        Lib.ShortcutManager.isInit = false;
    }
}
Lib.ShortcutManager.Namespace=`Aventus.Lib`;
__as1(_.Lib, 'ShortcutManager', Lib.ShortcutManager);

Modal.ModalElement = class ModalElement extends Aventus.WebComponent {
    get 'options'() {
						return this.__watch["options"];
					}
					set 'options'(val) {
						this.__watch["options"] = val;
					}    static defaultCloseWithEsc = true;
    static defaultCloseWithClick = true;
    static defaultRejectValue = null;
    cb;
    pressManagerClickClose;
    pressManagerPrevent;
    __registerWatchesActions() {
    this.__addWatchesActions("options", ((target, action, path, value) => {
    target.onOptionsChanged();
}));    super.__registerWatchesActions();
}
    static __style = `:host{align-items:center;display:flex;inset:0;justify-content:center;position:fixed;z-index:60}:host .modal{background-color:#fff;padding:1.5rem;position:relative}`;
    constructor() {
        super();
        this.options = this.configure();
        if (this.options.closeWithClick === undefined)
            this.options.closeWithClick = Modal.ModalElement.defaultCloseWithClick;
        if (this.options.closeWithEsc === undefined)
            this.options.closeWithEsc = Modal.ModalElement.defaultCloseWithEsc;
        if (!Object.hasOwn(this.options, "rejectValue")) {
            this.options.rejectValue = Modal.ModalElement.defaultRejectValue;
        }
        if (this.constructor == ModalElement) {
            throw "can't instanciate an abstract class";
        }
        this.close = this.close.bind(this);
        this.reject = this.reject.bind(this);
        this.resolve = this.resolve.bind(this);
    }
    __getStatic() {
        return ModalElement;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(ModalElement.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<div class="modal" _id="modalelement_0">	<slot></slot></div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "modalEl",
      "ids": [
        "modalelement_0"
      ]
    }
  ]
}); }
    getClassName() {
        return "ModalElement";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["options"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('options'); }
    onOptionsChanged() { }
    init(cb) {
        this.cb = cb;
        if (this.options.closeWithEsc) {
            Lib.ShortcutManager.subscribe(Lib.SpecialTouch.Escape, this.reject, { replaceTemp: true });
        }
        if (this.options.closeWithClick) {
            this.pressManagerClickClose = new Aventus.PressManager({
                element: this,
                onPress: () => {
                    this.reject();
                }
            });
            this.pressManagerPrevent = new Aventus.PressManager({
                element: this.modalEl,
                onPress: () => { }
            });
        }
    }
    show(element) {
        return Modal.ModalElement._show(this, element);
    }
    close() {
        Lib.ShortcutManager.unsubscribe(Lib.SpecialTouch.Escape, this.reject);
        this.pressManagerClickClose?.destroy();
        this.pressManagerPrevent?.destroy();
        this.remove();
    }
    reject(no_close) {
        if (this.cb) {
            this.cb(this.options.rejectValue ?? null);
        }
        if (no_close !== true) {
            this.close();
        }
    }
    resolve(response, no_close) {
        if (this.cb) {
            this.cb(response);
        }
        if (no_close !== true) {
            this.close();
        }
    }
    static configure(options) {
        if (options.closeWithClick !== undefined)
            this.defaultCloseWithClick = options.closeWithClick;
        if (options.closeWithEsc !== undefined)
            this.defaultCloseWithEsc = options.closeWithEsc;
        if (!Object.hasOwn(options, "rejectValue")) {
            this.defaultRejectValue = options.rejectValue;
        }
    }
    static _show(modal, element) {
        return new Promise((resolve) => {
            modal.init((response) => {
                resolve(response);
            });
            if (!element) {
                element = document.body;
            }
            element.appendChild(modal);
        });
    }
}
Modal.ModalElement.Namespace=`Aventus.Modal`;
__as1(_.Modal, 'ModalElement', Modal.ModalElement);

Navigation.Router = class Router extends Aventus.WebComponent {
    static page404 = _.Navigation.Default404;
    static destroyPage = false;
    oldPage;
    allRoutes = {};
    activePath = "";
    activeState;
    oneStateActive = false;
    showPageMutex = new Aventus.Mutex();
    isReplace = false;
    get stateManager() {
        return Aventus.Instance.get(RouterStateManager);
    }
    page404;
    static __style = `:host{display:block}`;
    constructor() {
        super();
        this.validError404 = this.validError404.bind(this);
        this.canChangeState = this.canChangeState.bind(this);
        this.stateManager.canChangeState(this.canChangeState);
        if (this.constructor == Router) {
            throw "can't instanciate an abstract class";
        }
    }
    __getStatic() {
        return Router;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Router.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'before':`<slot name="before"></slot>`,'after':`<slot name="after"></slot>` }, 
        blocks: { 'default':`<slot name="before"></slot><div class="content" _id="router_0"></div><slot name="after"></slot>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "contentEl",
      "ids": [
        "router_0"
      ]
    }
  ]
}); }
    getClassName() {
        return "Router";
    }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('stateManager'); }
    addRouteAsync(options) {
        this.allRoutes[options.route] = options;
    }
    addRoute(route, elementCtr) {
        this.allRoutes[route] = {
            route: route,
            scriptUrl: '',
            render: () => elementCtr
        };
    }
    register() {
        try {
            this.defineRoutes();
            this.stateManager.onAfterStateChanged(this.validError404);
            for (let key in this.allRoutes) {
                this.initRoute(key);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    initRoute(path) {
        let element = undefined;
        let allRoutes = this.allRoutes;
        this.stateManager.subscribe(path, {
            active: (currentState) => {
                this.oneStateActive = true;
                this.showPageMutex.safeRunLastAsync(async () => {
                    let isNew = false;
                    if (!element || !element.parentElement) {
                        let options = allRoutes[path];
                        if (options.scriptUrl != "") {
                            await Aventus.ResourceLoader.loadInHead(options.scriptUrl);
                        }
                        let cst = options.render();
                        element = new cst;
                        element.router = this;
                        isNew = true;
                    }
                    const canResult = await element.isAllowed(currentState, path, this);
                    if (canResult !== true) {
                        if (canResult === false) {
                            return;
                        }
                        this.navigate(canResult, { replace: true });
                        return;
                    }
                    if (isNew)
                        this.contentEl.appendChild(element);
                    if (this.oldPage && this.oldPage != element) {
                        await this.oldPage.hide();
                        const { destroy } = await this.oldPage.configure();
                        if (destroy === undefined && this.shouldDestroyFrame(this.oldPage)) {
                            this.oldPage.remove();
                        }
                        else if (destroy === true) {
                            this.oldPage.remove();
                        }
                    }
                    let oldPage = this.oldPage;
                    let oldUrl = this.activePath;
                    this.oldPage = element;
                    this.activePath = path;
                    this.activeState = currentState;
                    await element.show(currentState);
                    const { title, description, keywords } = await element.configure();
                    if (title !== undefined)
                        document.title = title;
                    if (keywords !== undefined) {
                        let meta = document.querySelector('meta[name="keywords"]');
                        if (!meta) {
                            meta = document.createElement('meta');
                        }
                        meta.setAttribute("content", keywords.join(", "));
                    }
                    if (description !== undefined) {
                        let meta = document.querySelector('meta[name="description"]');
                        if (!meta) {
                            meta = document.createElement('meta');
                        }
                        meta.setAttribute("content", description);
                    }
                    if (this.bindToUrl() && window.location.pathname != currentState.name) {
                        let newUrl = window.location.origin + currentState.name;
                        if (this.isReplace) {
                            window.history.replaceState({}, title ?? "", newUrl);
                        }
                        else {
                            window.history.pushState({}, title ?? "", newUrl);
                        }
                    }
                    this.onNewPage(oldUrl, oldPage, path, element);
                });
            },
            inactive: () => {
                this.oneStateActive = false;
            }
        });
    }
    async validError404() {
        if (!this.oneStateActive) {
            let Page404 = this.error404(this.stateManager.getState()) ?? Navigation.Router.page404;
            if (Page404) {
                if (!this.page404 || !this.page404.parentElement) {
                    this.page404 = new Page404();
                    this.page404.router = this;
                    this.contentEl.appendChild(this.page404);
                }
                if (this.oldPage && this.oldPage != this.page404) {
                    await this.oldPage.hide();
                }
                if (this.bindToUrl()) {
                    const currentState = this.stateManager.getState();
                    if (currentState && window.location.pathname != currentState.name) {
                        let newUrl = window.location.origin + currentState.name;
                        if (this.isReplace) {
                            window.history.replaceState({}, "Not found", newUrl);
                        }
                        else {
                            window.history.pushState({}, "Not found", newUrl);
                        }
                    }
                }
                this.activeState = undefined;
                this.oldPage = this.page404;
                this.activePath = '';
                await this.page404.show(this.activeState);
            }
        }
    }
    error404(state) {
        return null;
    }
    onNewPage(oldUrl, oldPage, newUrl, newPage) {
    }
    getSlugs() {
        return this.stateManager.getStateSlugs(this.activePath);
    }
    async canChangeState(newState) {
        return true;
    }
    async navigate(state, options) {
        if (options?.replace) {
            this.isReplace = true;
        }
        const result = await this.stateManager.setState(state);
        if (options?.replace) {
            this.isReplace = false;
        }
        return result;
    }
    bindToUrl() {
        return true;
    }
    defaultUrl() {
        return "/";
    }
    shouldDestroyFrame(page) {
        return Navigation.Router.destroyPage;
    }
    postCreation() {
        this.register();
        let oldUrl = window.localStorage.getItem("navigation_url");
        if (oldUrl !== null) {
            Aventus.State.activate(oldUrl, this.stateManager);
            window.localStorage.removeItem("navigation_url");
        }
        else if (this.bindToUrl()) {
            Aventus.State.activate(window.location.pathname, this.stateManager);
        }
        else {
            let defaultUrl = this.defaultUrl();
            if (defaultUrl) {
                Aventus.State.activate(defaultUrl, this.stateManager);
            }
        }
        if (this.bindToUrl()) {
            window.onpopstate = (e) => {
                if (window.location.pathname != this.stateManager.getState()?.name) {
                    Aventus.State.activate(window.location.pathname, this.stateManager);
                }
            };
        }
    }
    static configure(options) {
        if (options.page404 !== undefined)
            this.page404 = options.page404;
        if (options.destroyPage !== undefined)
            this.destroyPage = options.destroyPage;
    }
}
Navigation.Router.Namespace=`Aventus.Navigation`;
__as1(_.Navigation, 'Router', Navigation.Router);

Layout.Col = class Col extends Aventus.WebComponent {
    get 'use_container'() { return this.getBoolAttr('use_container') }
    set 'use_container'(val) { this.setBoolAttr('use_container', val) }get 'size'() { return this.getNumberAttr('size') }
    set 'size'(val) { this.setNumberAttr('size', val) }get 'size_xs'() { return this.getNumberAttr('size_xs') }
    set 'size_xs'(val) { this.setNumberAttr('size_xs', val) }get 'size_sm'() { return this.getNumberAttr('size_sm') }
    set 'size_sm'(val) { this.setNumberAttr('size_sm', val) }get 'size_md'() { return this.getNumberAttr('size_md') }
    set 'size_md'(val) { this.setNumberAttr('size_md', val) }get 'size_lg'() { return this.getNumberAttr('size_lg') }
    set 'size_lg'(val) { this.setNumberAttr('size_lg', val) }get 'size_xl'() { return this.getNumberAttr('size_xl') }
    set 'size_xl'(val) { this.setNumberAttr('size_xl', val) }get 'offset'() { return this.getNumberAttr('offset') }
    set 'offset'(val) { this.setNumberAttr('offset', val) }get 'offset_xs'() { return this.getNumberAttr('offset_xs') }
    set 'offset_xs'(val) { this.setNumberAttr('offset_xs', val) }get 'offset_sm'() { return this.getNumberAttr('offset_sm') }
    set 'offset_sm'(val) { this.setNumberAttr('offset_sm', val) }get 'offset_md'() { return this.getNumberAttr('offset_md') }
    set 'offset_md'(val) { this.setNumberAttr('offset_md', val) }get 'offset_lg'() { return this.getNumberAttr('offset_lg') }
    set 'offset_lg'(val) { this.setNumberAttr('offset_lg', val) }get 'offset_xl'() { return this.getNumberAttr('offset_xl') }
    set 'offset_xl'(val) { this.setNumberAttr('offset_xl', val) }get 'offset_right'() { return this.getNumberAttr('offset_right') }
    set 'offset_right'(val) { this.setNumberAttr('offset_right', val) }get 'offset_right_xs'() { return this.getNumberAttr('offset_right_xs') }
    set 'offset_right_xs'(val) { this.setNumberAttr('offset_right_xs', val) }get 'offset_right_sm'() { return this.getNumberAttr('offset_right_sm') }
    set 'offset_right_sm'(val) { this.setNumberAttr('offset_right_sm', val) }get 'offset_right_md'() { return this.getNumberAttr('offset_right_md') }
    set 'offset_right_md'(val) { this.setNumberAttr('offset_right_md', val) }get 'offset_right_lg'() { return this.getNumberAttr('offset_right_lg') }
    set 'offset_right_lg'(val) { this.setNumberAttr('offset_right_lg', val) }get 'offset_right_xl'() { return this.getNumberAttr('offset_right_xl') }
    set 'offset_right_xl'(val) { this.setNumberAttr('offset_right_xl', val) }get 'center'() { return this.getBoolAttr('center') }
    set 'center'(val) { this.setBoolAttr('center', val) }    static use_container = false;
    static __style = `:host{--_col-padding: var(--col-padding, 8px);--_col-gap: var(--col-gap, 0px)}:host{display:flex;padding:var(--internal-col-padding)}:host([center]){justify-content:center}:host([size="0"]){width:0}:host([offset="0"]){margin-left:0}:host([offset_right="0"]){margin-right:0}:host([size="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([offset="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([offset_right="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([size="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([offset="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([offset_right="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([size="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([offset="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([offset_right="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([size="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([offset="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([offset_right="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([size="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([offset="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([offset_right="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([size="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([offset="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([offset_right="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([size="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([offset="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([offset_right="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([size="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([offset="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([offset_right="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([size="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([offset="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([offset_right="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([size="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([offset="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([offset_right="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([size="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([offset="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([offset_right="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([size="12"]){width:100%}:host([offset="12"]){margin-left:100%}:host([offset_right="12"]){margin-right:100%}@container row (min-width: 300px){:host([use_container][size_xs="0"]){width:0}:host([use_container][offset_xs="0"]){margin-left:0}:host([use_container][offset_right_xs="0"]){margin-right:0}:host([use_container][size_xs="0"]){display:none}:host([use_container][size_xs="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][offset_xs="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][offset_right_xs="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][size_xs="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][offset_xs="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][offset_right_xs="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][size_xs="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][offset_xs="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][offset_right_xs="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][size_xs="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][offset_xs="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][offset_right_xs="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][size_xs="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][offset_xs="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][offset_right_xs="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][size_xs="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][offset_xs="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][offset_right_xs="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][size_xs="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][offset_xs="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][offset_right_xs="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][size_xs="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][offset_xs="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][offset_right_xs="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][size_xs="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][offset_xs="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][offset_right_xs="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][size_xs="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][offset_xs="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][offset_right_xs="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][size_xs="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][offset_xs="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][offset_right_xs="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][size_xs="12"]){width:100%}:host([use_container][offset_xs="12"]){margin-left:100%}:host([use_container][offset_right_xs="12"]){margin-right:100%}}@media screen and (min-width: 300px){:host(:not([use_container])[size_xs="0"]){width:0}:host(:not([use_container])[offset_xs="0"]){margin-left:0}:host(:not([use_container])[offset_right_xs="0"]){margin-right:0}:host(:not([use_container])[size_xs="0"]){display:none}:host(:not([use_container])[size_xs="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[offset_xs="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[offset_right_xs="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[size_xs="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[offset_xs="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[offset_right_xs="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[size_xs="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[offset_xs="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[offset_right_xs="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[size_xs="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[offset_xs="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[offset_right_xs="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[size_xs="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[offset_xs="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[offset_right_xs="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[size_xs="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[offset_xs="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[offset_right_xs="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[size_xs="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[offset_xs="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[offset_right_xs="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[size_xs="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[offset_xs="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[offset_right_xs="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[size_xs="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[offset_xs="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[offset_right_xs="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[size_xs="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[offset_xs="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[offset_right_xs="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[size_xs="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[offset_xs="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[offset_right_xs="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[size_xs="12"]){width:100%}:host(:not([use_container])[offset_xs="12"]){margin-left:100%}:host(:not([use_container])[offset_right_xs="12"]){margin-right:100%}}@container row (min-width: 540px){:host([use_container][size_sm="0"]){width:0}:host([use_container][offset_sm="0"]){margin-left:0}:host([use_container][offset_right_sm="0"]){margin-right:0}:host([use_container][size_sm="0"]){display:none}:host([use_container][size_sm="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][offset_sm="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][offset_right_sm="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][size_sm="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][offset_sm="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][offset_right_sm="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][size_sm="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][offset_sm="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][offset_right_sm="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][size_sm="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][offset_sm="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][offset_right_sm="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][size_sm="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][offset_sm="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][offset_right_sm="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][size_sm="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][offset_sm="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][offset_right_sm="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][size_sm="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][offset_sm="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][offset_right_sm="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][size_sm="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][offset_sm="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][offset_right_sm="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][size_sm="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][offset_sm="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][offset_right_sm="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][size_sm="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][offset_sm="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][offset_right_sm="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][size_sm="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][offset_sm="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][offset_right_sm="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][size_sm="12"]){width:100%}:host([use_container][offset_sm="12"]){margin-left:100%}:host([use_container][offset_right_sm="12"]){margin-right:100%}}@media screen and (min-width: 540px){:host(:not([use_container])[size_sm="0"]){width:0}:host(:not([use_container])[offset_sm="0"]){margin-left:0}:host(:not([use_container])[offset_right_sm="0"]){margin-right:0}:host(:not([use_container])[size_sm="0"]){display:none}:host(:not([use_container])[size_sm="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[offset_sm="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[offset_right_sm="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[size_sm="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[offset_sm="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[offset_right_sm="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[size_sm="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[offset_sm="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[offset_right_sm="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[size_sm="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[offset_sm="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[offset_right_sm="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[size_sm="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[offset_sm="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[offset_right_sm="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[size_sm="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[offset_sm="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[offset_right_sm="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[size_sm="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[offset_sm="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[offset_right_sm="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[size_sm="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[offset_sm="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[offset_right_sm="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[size_sm="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[offset_sm="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[offset_right_sm="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[size_sm="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[offset_sm="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[offset_right_sm="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[size_sm="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[offset_sm="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[offset_right_sm="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[size_sm="12"]){width:100%}:host(:not([use_container])[offset_sm="12"]){margin-left:100%}:host(:not([use_container])[offset_right_sm="12"]){margin-right:100%}}@container row (min-width: 720px){:host([use_container][size_md="0"]){width:0}:host([use_container][offset_md="0"]){margin-left:0}:host([use_container][offset_right_md="0"]){margin-right:0}:host([use_container][size_md="0"]){display:none}:host([use_container][size_md="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][offset_md="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][offset_right_md="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][size_md="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][offset_md="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][offset_right_md="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][size_md="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][offset_md="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][offset_right_md="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][size_md="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][offset_md="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][offset_right_md="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][size_md="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][offset_md="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][offset_right_md="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][size_md="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][offset_md="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][offset_right_md="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][size_md="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][offset_md="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][offset_right_md="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][size_md="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][offset_md="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][offset_right_md="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][size_md="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][offset_md="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][offset_right_md="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][size_md="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][offset_md="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][offset_right_md="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][size_md="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][offset_md="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][offset_right_md="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][size_md="12"]){width:100%}:host([use_container][offset_md="12"]){margin-left:100%}:host([use_container][offset_right_md="12"]){margin-right:100%}}@media screen and (min-width: 720px){:host(:not([use_container])[size_md="0"]){width:0}:host(:not([use_container])[offset_md="0"]){margin-left:0}:host(:not([use_container])[offset_right_md="0"]){margin-right:0}:host(:not([use_container])[size_md="0"]){display:none}:host(:not([use_container])[size_md="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[offset_md="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[offset_right_md="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[size_md="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[offset_md="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[offset_right_md="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[size_md="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[offset_md="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[offset_right_md="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[size_md="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[offset_md="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[offset_right_md="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[size_md="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[offset_md="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[offset_right_md="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[size_md="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[offset_md="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[offset_right_md="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[size_md="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[offset_md="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[offset_right_md="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[size_md="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[offset_md="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[offset_right_md="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[size_md="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[offset_md="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[offset_right_md="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[size_md="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[offset_md="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[offset_right_md="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[size_md="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[offset_md="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[offset_right_md="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[size_md="12"]){width:100%}:host(:not([use_container])[offset_md="12"]){margin-left:100%}:host(:not([use_container])[offset_right_md="12"]){margin-right:100%}}@container row (min-width: 960px){:host([use_container][size_lg="0"]){width:0}:host([use_container][offset_lg="0"]){margin-left:0}:host([use_container][offset_right_lg="0"]){margin-right:0}:host([use_container][size_lg="0"]){display:none}:host([use_container][size_lg="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][offset_lg="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][offset_right_lg="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][size_lg="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][offset_lg="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][offset_right_lg="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][size_lg="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][offset_lg="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][offset_right_lg="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][size_lg="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][offset_lg="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][offset_right_lg="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][size_lg="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][offset_lg="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][offset_right_lg="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][size_lg="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][offset_lg="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][offset_right_lg="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][size_lg="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][offset_lg="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][offset_right_lg="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][size_lg="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][offset_lg="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][offset_right_lg="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][size_lg="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][offset_lg="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][offset_right_lg="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][size_lg="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][offset_lg="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][offset_right_lg="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][size_lg="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][offset_lg="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][offset_right_lg="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][size_lg="12"]){width:100%}:host([use_container][offset_lg="12"]){margin-left:100%}:host([use_container][offset_right_lg="12"]){margin-right:100%}}@media screen and (min-width: 960px){:host(:not([use_container])[size_lg="0"]){width:0}:host(:not([use_container])[offset_lg="0"]){margin-left:0}:host(:not([use_container])[offset_right_lg="0"]){margin-right:0}:host(:not([use_container])[size_lg="0"]){display:none}:host(:not([use_container])[size_lg="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[offset_lg="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[offset_right_lg="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[size_lg="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[offset_lg="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[offset_right_lg="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[size_lg="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[offset_lg="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[offset_right_lg="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[size_lg="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[offset_lg="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[offset_right_lg="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[size_lg="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[offset_lg="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[offset_right_lg="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[size_lg="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[offset_lg="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[offset_right_lg="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[size_lg="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[offset_lg="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[offset_right_lg="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[size_lg="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[offset_lg="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[offset_right_lg="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[size_lg="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[offset_lg="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[offset_right_lg="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[size_lg="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[offset_lg="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[offset_right_lg="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[size_lg="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[offset_lg="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[offset_right_lg="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[size_lg="12"]){width:100%}:host(:not([use_container])[offset_lg="12"]){margin-left:100%}:host(:not([use_container])[offset_right_lg="12"]){margin-right:100%}}@container row (min-width: 1140px){:host([use_container][size_xl="0"]){width:0}:host([use_container][offset_xl="0"]){margin-left:0}:host([use_container][offset_right_xl="0"]){margin-right:0}:host([use_container][size_xl="0"]){display:none}:host([use_container][size_xl="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][offset_xl="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][offset_right_xl="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host([use_container][size_xl="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][offset_xl="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][offset_right_xl="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host([use_container][size_xl="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][offset_xl="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][offset_right_xl="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host([use_container][size_xl="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][offset_xl="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][offset_right_xl="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host([use_container][size_xl="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][offset_xl="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][offset_right_xl="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host([use_container][size_xl="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][offset_xl="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][offset_right_xl="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host([use_container][size_xl="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][offset_xl="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][offset_right_xl="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host([use_container][size_xl="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][offset_xl="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][offset_right_xl="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host([use_container][size_xl="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][offset_xl="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][offset_right_xl="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host([use_container][size_xl="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][offset_xl="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][offset_right_xl="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host([use_container][size_xl="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][offset_xl="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][offset_right_xl="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host([use_container][size_xl="12"]){width:100%}:host([use_container][offset_xl="12"]){margin-left:100%}:host([use_container][offset_right_xl="12"]){margin-right:100%}}@media screen and (min-width: 1140px){:host(:not([use_container])[size_xl="0"]){width:0}:host(:not([use_container])[offset_xl="0"]){margin-left:0}:host(:not([use_container])[offset_right_xl="0"]){margin-right:0}:host(:not([use_container])[size_xl="0"]){display:none}:host(:not([use_container])[size_xl="1"]){width:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[offset_xl="1"]){margin-left:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[offset_right_xl="1"]){margin-right:calc(8.3333333333% - (var(--_col-gap, 0px) * 11 / 12))}:host(:not([use_container])[size_xl="2"]){width:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[offset_xl="2"]){margin-left:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[offset_right_xl="2"]){margin-right:calc(16.6666666667% - (var(--_col-gap, 0px) * 5 / 6))}:host(:not([use_container])[size_xl="3"]){width:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[offset_xl="3"]){margin-left:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[offset_right_xl="3"]){margin-right:calc(25% - (var(--_col-gap, 0px) * 3 / 4))}:host(:not([use_container])[size_xl="4"]){width:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[offset_xl="4"]){margin-left:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[offset_right_xl="4"]){margin-right:calc(33.3333333333% - (var(--_col-gap, 0px) * 2 / 3))}:host(:not([use_container])[size_xl="5"]){width:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[offset_xl="5"]){margin-left:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[offset_right_xl="5"]){margin-right:calc(41.6666666667% - (var(--_col-gap, 0px) * 1.4 / 2.4))}:host(:not([use_container])[size_xl="6"]){width:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[offset_xl="6"]){margin-left:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[offset_right_xl="6"]){margin-right:calc(50% - (var(--_col-gap, 0px) * 1 / 2))}:host(:not([use_container])[size_xl="7"]){width:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[offset_xl="7"]){margin-left:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[offset_right_xl="7"]){margin-right:calc(58.3333333333% - (var(--_col-gap, 0px) * 0.7142857143 / 1.7142857143))}:host(:not([use_container])[size_xl="8"]){width:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[offset_xl="8"]){margin-left:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[offset_right_xl="8"]){margin-right:calc(66.6666666667% - (var(--_col-gap, 0px) * 0.5 / 1.5))}:host(:not([use_container])[size_xl="9"]){width:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[offset_xl="9"]){margin-left:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[offset_right_xl="9"]){margin-right:calc(75% - (var(--_col-gap, 0px) * 0.3333333333 / 1.3333333333))}:host(:not([use_container])[size_xl="10"]){width:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[offset_xl="10"]){margin-left:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[offset_right_xl="10"]){margin-right:calc(83.3333333333% - (var(--_col-gap, 0px) * 0.2 / 1.2))}:host(:not([use_container])[size_xl="11"]){width:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[offset_xl="11"]){margin-left:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[offset_right_xl="11"]){margin-right:calc(91.6666666667% - (var(--_col-gap, 0px) * 0.0909090909 / 1.0909090909))}:host(:not([use_container])[size_xl="12"]){width:100%}:host(:not([use_container])[offset_xl="12"]){margin-left:100%}:host(:not([use_container])[offset_right_xl="12"]){margin-right:100%}}`;
    __getStatic() {
        return Col;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Col.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "Col";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('use_container')) {this.setAttribute('use_container' ,'true'); }if(!this.hasAttribute('size')){ this['size'] = undefined; }if(!this.hasAttribute('size_xs')){ this['size_xs'] = undefined; }if(!this.hasAttribute('size_sm')){ this['size_sm'] = undefined; }if(!this.hasAttribute('size_md')){ this['size_md'] = undefined; }if(!this.hasAttribute('size_lg')){ this['size_lg'] = undefined; }if(!this.hasAttribute('size_xl')){ this['size_xl'] = undefined; }if(!this.hasAttribute('offset')){ this['offset'] = undefined; }if(!this.hasAttribute('offset_xs')){ this['offset_xs'] = undefined; }if(!this.hasAttribute('offset_sm')){ this['offset_sm'] = undefined; }if(!this.hasAttribute('offset_md')){ this['offset_md'] = undefined; }if(!this.hasAttribute('offset_lg')){ this['offset_lg'] = undefined; }if(!this.hasAttribute('offset_xl')){ this['offset_xl'] = undefined; }if(!this.hasAttribute('offset_right')){ this['offset_right'] = undefined; }if(!this.hasAttribute('offset_right_xs')){ this['offset_right_xs'] = undefined; }if(!this.hasAttribute('offset_right_sm')){ this['offset_right_sm'] = undefined; }if(!this.hasAttribute('offset_right_md')){ this['offset_right_md'] = undefined; }if(!this.hasAttribute('offset_right_lg')){ this['offset_right_lg'] = undefined; }if(!this.hasAttribute('offset_right_xl')){ this['offset_right_xl'] = undefined; }if(!this.hasAttribute('center')) { this.attributeChangedCallback('center', false, false); } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('use_container');this.__upgradeProperty('size');this.__upgradeProperty('size_xs');this.__upgradeProperty('size_sm');this.__upgradeProperty('size_md');this.__upgradeProperty('size_lg');this.__upgradeProperty('size_xl');this.__upgradeProperty('offset');this.__upgradeProperty('offset_xs');this.__upgradeProperty('offset_sm');this.__upgradeProperty('offset_md');this.__upgradeProperty('offset_lg');this.__upgradeProperty('offset_xl');this.__upgradeProperty('offset_right');this.__upgradeProperty('offset_right_xs');this.__upgradeProperty('offset_right_sm');this.__upgradeProperty('offset_right_md');this.__upgradeProperty('offset_right_lg');this.__upgradeProperty('offset_right_xl');this.__upgradeProperty('center'); }
    __listBoolProps() { return ["use_container","center"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    static configure(options) {
        if (options.use_container !== undefined)
            this.use_container = options.use_container;
    }
}
Layout.Col.Namespace=`Aventus.Layout`;
Layout.Col.Tag=`av-col`;
__as1(_.Layout, 'Col', Layout.Col);
if(!window.customElements.get('av-col')){window.customElements.define('av-col', Layout.Col);Aventus.WebComponentInstance.registerDefinition(Layout.Col);}

Navigation.PageFormRoute = class PageFormRoute extends Navigation.PageForm {
    static __style = ``;
    constructor() {
        super();
        if (this.constructor == PageFormRoute) {
            throw "can't instanciate an abstract class";
        }
    }
    __getStatic() {
        return PageFormRoute;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(PageFormRoute.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "PageFormRoute";
    }
    async defineSubmit(submit) {
        await this.beforeSubmit();
        const info = this.route();
        let router;
        let key = "";
        if (Array.isArray(info)) {
            router = new info[0];
            key = info[1];
        }
        else {
            router = new info;
            const fcts = Object.getOwnPropertyNames(info.prototype).filter(m => m !== "constructor");
            if (fcts.length == 1) {
                key = fcts[0];
            }
            else {
                const result = new Aventus.VoidWithError();
                result.errors.push(new Aventus.GenericError(500, "More than one fonction is defined"));
                return result;
            }
        }
        const result = await submit(router[key]);
        this.onResult(result);
        return result;
    }
    beforeSubmit() { }
}
Navigation.PageFormRoute.Namespace=`Aventus.Navigation`;
__as1(_.Navigation, 'PageFormRoute', Navigation.PageFormRoute);


for(let key in _) { Aventus[key] = _[key] }
})(Aventus);

var Inventaire;
(Inventaire||(Inventaire = {}));
(function (Inventaire) {
const __as1 = (o, k, c) => { if (o[k] !== undefined) for (let w in o[k]) { c[w] = o[k][w] } o[k] = c; }
const moduleName = `Inventaire`;
const _ = {};
Aventus.Style.store("@default", `:host{box-sizing:border-box;display:inline-block;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);font-size:16px}:host *{box-sizing:border-box;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.neutral{background-color:var(--color-neutral)}.content-neutral{color:var(--color-neutral-content)}.primary{background-color:var(--color-primary)}.content-primary{color:var(--color-primary-content)}.secondary{background-color:var(--color-secondary)}.content-secondary{color:var(--color-secondary-content)}.accent{background-color:var(--color-accent)}.content-accent{color:var(--color-accent-content)}.info{background-color:var(--color-info)}.content-info{color:var(--color-info-content)}.success{background-color:var(--color-success)}.content-success{color:var(--color-success-content)}.warning{background-color:var(--color-warning)}.content-warning{color:var(--color-warning-content)}.error{background-color:var(--color-error)}.content-error{color:var(--color-error-content)}`)
let App = {};
_.App = Inventaire.App ?? {};
App.Http = {};
_.App.Http = Inventaire.App?.Http ?? {};
App.Http.Controllers = {};
_.App.Http.Controllers = Inventaire.App?.Http?.Controllers ?? {};
App.Http.Controllers.User = {};
_.App.Http.Controllers.User = Inventaire.App?.Http?.Controllers?.User ?? {};
App.Models = {};
_.App.Models = Inventaire.App?.Models ?? {};
App.Http.Controllers.Materiel = {};
_.App.Http.Controllers.Materiel = Inventaire.App?.Http?.Controllers?.Materiel ?? {};
App.Http.Controllers.Materiel.GetInventaire = {};
_.App.Http.Controllers.Materiel.GetInventaire = Inventaire.App?.Http?.Controllers?.Materiel?.GetInventaire ?? {};
App.Http.Controllers.Inventaire = {};
_.App.Http.Controllers.Inventaire = Inventaire.App?.Http?.Controllers?.Inventaire ?? {};
App.Http.Controllers.Inventaire.Update = {};
_.App.Http.Controllers.Inventaire.Update = Inventaire.App?.Http?.Controllers?.Inventaire?.Update ?? {};
App.Http.Controllers.Inventaire.Historique = {};
_.App.Http.Controllers.Inventaire.Historique = Inventaire.App?.Http?.Controllers?.Inventaire?.Historique ?? {};
App.Http.Controllers.Equipe = {};
_.App.Http.Controllers.Equipe = Inventaire.App?.Http?.Controllers?.Equipe ?? {};
App.Http.Controllers.Equipe.Materiel = {};
_.App.Http.Controllers.Equipe.Materiel = Inventaire.App?.Http?.Controllers?.Equipe?.Materiel ?? {};
App.Http.Controllers.Equipe.GetInventaire = {};
_.App.Http.Controllers.Equipe.GetInventaire = Inventaire.App?.Http?.Controllers?.Equipe?.GetInventaire ?? {};
App.Http.Controllers.Auth = {};
_.App.Http.Controllers.Auth = Inventaire.App?.Http?.Controllers?.Auth ?? {};
App.Http.Controllers.Auth.Login = {};
_.App.Http.Controllers.Auth.Login = Inventaire.App?.Http?.Controllers?.Auth?.Login ?? {};
App.Http.Controllers.Auth.Logout = {};
_.App.Http.Controllers.Auth.Logout = Inventaire.App?.Http?.Controllers?.Auth?.Logout ?? {};
let _n;
let StringTools=class StringTools {
    static removeAccents(value) {
        return value
            .replace(/[áàãâä]/gi, "a")
            .replace(/[éè¨ê]/gi, "e")
            .replace(/[íìïî]/gi, "i")
            .replace(/[óòöôõ]/gi, "o")
            .replace(/[úùüû]/gi, "u")
            .replace(/[ç]/gi, "c")
            .replace(/[ñ]/gi, "n")
            .replace(/[^a-zA-Z0-9]/g, " ");
    }
    static contains(src, search) {
        if (src === undefined)
            return false;
        const _src = this.removeAccents((src + '').toLowerCase());
        const _search = this.removeAccents((search + '').toLowerCase());
        return _src.includes(_search);
    }
    static firstLetterUpper(txt) {
        return txt.slice(0, 1).toUpperCase() + txt.slice(1);
    }
}
StringTools.Namespace=`Inventaire`;
__as1(_, 'StringTools', StringTools);

let Colors= [
    'neutral',
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'error'
];
__as1(_, 'Colors', Colors);

App.Http.Controllers.User.UserResource=class UserResource extends Aventus.Data {
    static get Fullname() { return "App.Http.Controllers.User.UserResource"; }
    id;
    nom;
    prenom;
    nom_utilisateur;
}
App.Http.Controllers.User.UserResource.Namespace=`Inventaire.App.Http.Controllers.User`;
App.Http.Controllers.User.UserResource.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","nom":"string","prenom":"string","nom_utilisateur":"string"};
Aventus.Converter.register(App.Http.Controllers.User.UserResource.Fullname, App.Http.Controllers.User.UserResource);
__as1(_.App.Http.Controllers.User, 'UserResource', App.Http.Controllers.User.UserResource);

App.Http.Controllers.User.UserRequest=class UserRequest {
    id = undefined;
    nom;
    prenom;
    nom_utilisateur;
    mot_passe = undefined;
}
App.Http.Controllers.User.UserRequest.Namespace=`Inventaire.App.Http.Controllers.User`;
__as1(_.App.Http.Controllers.User, 'UserRequest', App.Http.Controllers.User.UserRequest);

App.Models.User=class User extends Aventus.Data {
    static get Fullname() { return "App.Models.User"; }
    id;
    nom;
    prenom;
    nom_utilisateur;
    mot_passe;
}
App.Models.User.Namespace=`Inventaire.App.Models`;
App.Models.User.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","nom":"string","prenom":"string","nom_utilisateur":"string","mot_passe":"string"};
Aventus.Converter.register(App.Models.User.Fullname, App.Models.User);
__as1(_.App.Models, 'User', App.Models.User);

App.Http.Controllers.Materiel.MaterielImageResource=class MaterielImageResource extends Aventus.Data {
    static get Fullname() { return "App.Http.Controllers.Materiel.MaterielImageResource"; }
    uri;
}
App.Http.Controllers.Materiel.MaterielImageResource.Namespace=`Inventaire.App.Http.Controllers.Materiel`;
App.Http.Controllers.Materiel.MaterielImageResource.$schema={...(Aventus.Data?.$schema ?? {}), "uri":"number"};
Aventus.Converter.register(App.Http.Controllers.Materiel.MaterielImageResource.Fullname, App.Http.Controllers.Materiel.MaterielImageResource);
__as1(_.App.Http.Controllers.Materiel, 'MaterielImageResource', App.Http.Controllers.Materiel.MaterielImageResource);

App.Http.Controllers.Materiel.GetInventaire.Request=class Request {
    id_materiel;
}
App.Http.Controllers.Materiel.GetInventaire.Request.Namespace=`Inventaire.App.Http.Controllers.Materiel.GetInventaire`;
__as1(_.App.Http.Controllers.Materiel.GetInventaire, 'Request', App.Http.Controllers.Materiel.GetInventaire.Request);

App.Http.Controllers.Inventaire.Update.Request=class Request {
    id = undefined;
    quantite;
    id_materiel;
    id_equipe;
    id_variation = undefined;
}
App.Http.Controllers.Inventaire.Update.Request.Namespace=`Inventaire.App.Http.Controllers.Inventaire.Update`;
__as1(_.App.Http.Controllers.Inventaire.Update, 'Request', App.Http.Controllers.Inventaire.Update.Request);

App.Models.InventaireHistorique=class InventaireHistorique extends Aventus.Data {
    static get Fullname() { return "App.Models.InventaireHistorique"; }
    id;
    id_equipe;
    id_materiel;
    id_variation = undefined;
    quantite;
    last_update;
    last_update_by;
}
App.Models.InventaireHistorique.Namespace=`Inventaire.App.Models`;
App.Models.InventaireHistorique.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","id_equipe":"number","id_materiel":"number","id_variation":"number","quantite":"number","last_update":"Date","last_update_by":"string"};
Aventus.Converter.register(App.Models.InventaireHistorique.Fullname, App.Models.InventaireHistorique);
__as1(_.App.Models, 'InventaireHistorique', App.Models.InventaireHistorique);

App.Http.Controllers.Inventaire.Historique.Request=class Request {
    id_materiel;
    id_equipe;
    id_variation = undefined;
    page;
}
App.Http.Controllers.Inventaire.Historique.Request.Namespace=`Inventaire.App.Http.Controllers.Inventaire.Historique`;
__as1(_.App.Http.Controllers.Inventaire.Historique, 'Request', App.Http.Controllers.Inventaire.Historique.Request);

App.Http.Controllers.Equipe.Materiel.Response=class Response extends Aventus.Data {
    static get Fullname() { return "App.Http.Controllers.Equipe.Materiel.Response"; }
}
App.Http.Controllers.Equipe.Materiel.Response.Namespace=`Inventaire.App.Http.Controllers.Equipe.Materiel`;
App.Http.Controllers.Equipe.Materiel.Response.$schema={...(Aventus.Data?.$schema ?? {}), };
Aventus.Converter.register(App.Http.Controllers.Equipe.Materiel.Response.Fullname, App.Http.Controllers.Equipe.Materiel.Response);
__as1(_.App.Http.Controllers.Equipe.Materiel, 'Response', App.Http.Controllers.Equipe.Materiel.Response);

App.Http.Controllers.Equipe.Materiel.Request=class Request {
    id_equipe;
}
App.Http.Controllers.Equipe.Materiel.Request.Namespace=`Inventaire.App.Http.Controllers.Equipe.Materiel`;
__as1(_.App.Http.Controllers.Equipe.Materiel, 'Request', App.Http.Controllers.Equipe.Materiel.Request);

App.Models.MaterielImage=class MaterielImage extends AventusPhp.AventusImage {
    static get Fullname() { return "App.Models.MaterielImage"; }
}
App.Models.MaterielImage.Namespace=`Inventaire.App.Models`;
App.Models.MaterielImage.$schema={...(AventusPhp.AventusImage?.$schema ?? {}), };
Aventus.Converter.register(App.Models.MaterielImage.Fullname, App.Models.MaterielImage);
__as1(_.App.Models, 'MaterielImage', App.Models.MaterielImage);

App.Models.Variation=class Variation extends Aventus.Data {
    static get Fullname() { return "App.Models.Variation"; }
    id;
    id_materiel;
    nom;
}
App.Models.Variation.Namespace=`Inventaire.App.Models`;
App.Models.Variation.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","id_materiel":"number","nom":"string"};
Aventus.Converter.register(App.Models.Variation.Fullname, App.Models.Variation);
__as1(_.App.Models, 'Variation', App.Models.Variation);

App.Http.Controllers.Equipe.GetInventaire.Request=class Request {
    id_equipe;
}
App.Http.Controllers.Equipe.GetInventaire.Request.Namespace=`Inventaire.App.Http.Controllers.Equipe.GetInventaire`;
__as1(_.App.Http.Controllers.Equipe.GetInventaire, 'Request', App.Http.Controllers.Equipe.GetInventaire.Request);

App.Http.Controllers.Equipe.EquipeResource=class EquipeResource extends Aventus.Data {
    static get Fullname() { return "App.Http.Controllers.Equipe.EquipeResource"; }
    id;
    nom;
}
App.Http.Controllers.Equipe.EquipeResource.Namespace=`Inventaire.App.Http.Controllers.Equipe`;
App.Http.Controllers.Equipe.EquipeResource.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","nom":"string"};
Aventus.Converter.register(App.Http.Controllers.Equipe.EquipeResource.Fullname, App.Http.Controllers.Equipe.EquipeResource);
__as1(_.App.Http.Controllers.Equipe, 'EquipeResource', App.Http.Controllers.Equipe.EquipeResource);

const EquipeItem = class EquipeItem extends Aventus.WebComponent {
    get 'visible'() { return this.getBoolAttr('visible') }
    set 'visible'(val) { this.setBoolAttr('visible', val) }    get 'item'() {
						return this.__watch["item"];
					}
					set 'item'(val) {
						this.__watch["item"] = val;
					}    __registerWatchesActions() {
    this.__addWatchesActions("item");    super.__registerWatchesActions();
}
    static __style = `:host{align-items:center;border-top:1px solid var(--color-base-300);display:flex;height:50px;padding:0 16px}:host .name{flex-grow:1}:host .actions{display:flex;flex-shrink:0;gap:5px}:host(:first-child){border-top:none}:host(:not([visible])){display:none}`;
    __getStatic() {
        return EquipeItem;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(EquipeItem.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<av-link _id="equipeitem_0">
    <div class="name" _id="equipeitem_1"></div>
    <div class="actions">
        <mi-icon icon="chevron_right"></mi-icon>
    </div>
</av-link>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "equipeitem_0°to": {
      "fct": (c) => `/equipes/${c.print(c.comp.__ac165b03bc0cf79d4fe5d09354dcdc36method0())}`,
      "once": true
    },
    "equipeitem_1°@HTML": {
      "fct": (c) => `${c.print(c.comp.__ac165b03bc0cf79d4fe5d09354dcdc36method1())}`,
      "once": true
    }
  }
}); }
    getClassName() {
        return "EquipeItem";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('visible')) { this.attributeChangedCallback('visible', false, false); } }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["item"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('visible');this.__correctGetter('item'); }
    __listBoolProps() { return ["visible"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    __ac165b03bc0cf79d4fe5d09354dcdc36method0() {
        return this.item.id;
    }
    __ac165b03bc0cf79d4fe5d09354dcdc36method1() {
        return this.item.nom;
    }
}
EquipeItem.Namespace=`Inventaire`;
EquipeItem.Tag=`av-equipe-item`;
__as1(_, 'EquipeItem', EquipeItem);
if(!window.customElements.get('av-equipe-item')){window.customElements.define('av-equipe-item', EquipeItem);Aventus.WebComponentInstance.registerDefinition(EquipeItem);}

App.Http.Controllers.Materiel.GetInventaire.Response=class Response extends Aventus.Data {
    static get Fullname() { return "App.Http.Controllers.Materiel.GetInventaire.Response"; }
    id;
    equipe;
    variation = undefined;
    quantite;
    last_update;
    last_update_by;
}
App.Http.Controllers.Materiel.GetInventaire.Response.Namespace=`Inventaire.App.Http.Controllers.Materiel.GetInventaire`;
App.Http.Controllers.Materiel.GetInventaire.Response.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","equipe":"Inventaire.App.Http.Controllers.Equipe.EquipeResource","variation":"Inventaire.App.Models.Variation","quantite":"number","last_update":"Date","last_update_by":"string"};
Aventus.Converter.register(App.Http.Controllers.Materiel.GetInventaire.Response.Fullname, App.Http.Controllers.Materiel.GetInventaire.Response);
__as1(_.App.Http.Controllers.Materiel.GetInventaire, 'Response', App.Http.Controllers.Materiel.GetInventaire.Response);

App.Http.Controllers.Materiel.MaterielEquipeResource=class MaterielEquipeResource extends Aventus.Data {
    static get Fullname() { return "App.Http.Controllers.Materiel.MaterielEquipeResource"; }
    id_equipe;
    equipe;
}
App.Http.Controllers.Materiel.MaterielEquipeResource.Namespace=`Inventaire.App.Http.Controllers.Materiel`;
App.Http.Controllers.Materiel.MaterielEquipeResource.$schema={...(Aventus.Data?.$schema ?? {}), "id_equipe":"number","equipe":"Inventaire.App.Http.Controllers.Equipe.EquipeResource"};
Aventus.Converter.register(App.Http.Controllers.Materiel.MaterielEquipeResource.Fullname, App.Http.Controllers.Materiel.MaterielEquipeResource);
__as1(_.App.Http.Controllers.Materiel, 'MaterielEquipeResource', App.Http.Controllers.Materiel.MaterielEquipeResource);

App.Http.Controllers.Equipe.EquipeRequest=class EquipeRequest {
    id = undefined;
    nom;
}
App.Http.Controllers.Equipe.EquipeRequest.Namespace=`Inventaire.App.Http.Controllers.Equipe`;
__as1(_.App.Http.Controllers.Equipe, 'EquipeRequest', App.Http.Controllers.Equipe.EquipeRequest);

App.Models.Equipe=class Equipe extends Aventus.Data {
    static get Fullname() { return "App.Models.Equipe"; }
    id;
    nom;
}
App.Models.Equipe.Namespace=`Inventaire.App.Models`;
App.Models.Equipe.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","nom":"string"};
Aventus.Converter.register(App.Models.Equipe.Fullname, App.Models.Equipe);
__as1(_.App.Models, 'Equipe', App.Models.Equipe);

App.Models.MaterielEquipe=class MaterielEquipe extends Aventus.Data {
    static get Fullname() { return "App.Models.MaterielEquipe"; }
    id;
    id_materiel;
    id_equipe;
    equipe;
    materiel;
}
App.Models.MaterielEquipe.Namespace=`Inventaire.App.Models`;
App.Models.MaterielEquipe.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","id_materiel":"number","id_equipe":"number","equipe":"Inventaire.App.Models.Equipe","materiel":"Inventaire.App.Models.Materiel"};
Aventus.Converter.register(App.Models.MaterielEquipe.Fullname, App.Models.MaterielEquipe);
__as1(_.App.Models, 'MaterielEquipe', App.Models.MaterielEquipe);

App.Http.Controllers.Materiel.MaterielRequest=class MaterielRequest {
    variations;
    equipes;
    id = undefined;
    nom;
    image = undefined;
    tout_monde;
}
App.Http.Controllers.Materiel.MaterielRequest.Namespace=`Inventaire.App.Http.Controllers.Materiel`;
__as1(_.App.Http.Controllers.Materiel, 'MaterielRequest', App.Http.Controllers.Materiel.MaterielRequest);

App.Http.Controllers.Auth.Login.Response=class Response extends Aventus.Data {
    static get Fullname() { return "App.Http.Controllers.Auth.Login.Response"; }
}
App.Http.Controllers.Auth.Login.Response.Namespace=`Inventaire.App.Http.Controllers.Auth.Login`;
App.Http.Controllers.Auth.Login.Response.$schema={...(Aventus.Data?.$schema ?? {}), };
Aventus.Converter.register(App.Http.Controllers.Auth.Login.Response.Fullname, App.Http.Controllers.Auth.Login.Response);
__as1(_.App.Http.Controllers.Auth.Login, 'Response', App.Http.Controllers.Auth.Login.Response);

App.Http.Controllers.Auth.Login.Request=class Request {
    nom_utilisateur;
    mot_passe;
}
App.Http.Controllers.Auth.Login.Request.Namespace=`Inventaire.App.Http.Controllers.Auth.Login`;
__as1(_.App.Http.Controllers.Auth.Login, 'Request', App.Http.Controllers.Auth.Login.Request);

const PageFull = class PageFull extends Aventus.Navigation.Page {
    static __style = `:host{display:flex;height:100%;justify-content:center;width:100%}:host .content{display:flex;flex-direction:column;height:100%;justify-content:space-between;max-width:1200px;padding:32px;padding-bottom:16px;width:100%}`;
    constructor() {
        super();
        if (this.constructor == PageFull) {
            throw "can't instanciate an abstract class";
        }
    }
    __getStatic() {
        return PageFull;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(PageFull.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<div class="content">
    <slot></slot>
</div>` }
    });
}
    getClassName() {
        return "PageFull";
    }
}
PageFull.Namespace=`Inventaire`;
__as1(_, 'PageFull', PageFull);

const Page = class Page extends Aventus.Navigation.Page {
    static __style = `:host{height:100%;width:100%}:host .page-scroll{height:100%;width:100%}:host .content{display:flex;flex-direction:column;height:100%;justify-content:space-between;margin:auto;max-width:1200px;padding:32px;padding-bottom:16px;width:100%}`;
    constructor() {
        super();
        if (this.constructor == Page) {
            throw "can't instanciate an abstract class";
        }
    }
    __getStatic() {
        return Page;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Page.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<av-scrollable class="page-scroll">
    <div class="content">
        <slot></slot>
    </div>
</av-scrollable>` }
    });
}
    getClassName() {
        return "Page";
    }
}
Page.Namespace=`Inventaire`;
__as1(_, 'Page', Page);

const PwaPromptIos = class PwaPromptIos extends Aventus.WebComponent {
    get 'visible'() { return this.getBoolAttr('visible') }
    set 'visible'(val) { this.setBoolAttr('visible', val) }    static get isStandalone() {
        if ("standalone" in window.navigator && window.navigator.standalone) {
            return true;
        }
        return false;
    }
    static get isiOS() {
        let test1 = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
        let test2 = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
        return test1 || test2;
    }
    static get isAvailable() {
        return this.isiOS && !this.isStandalone;
    }
    static __style = `:host .noScroll{overflow:hidden}:host .pwaPromptOverlay{background-color:rgba(0,0,0,.8);left:0;min-height:100vh;min-height:-webkit-fill-available;opacity:0;pointer-events:none;position:fixed;top:0;touch-action:none;transition:opacity .2s ease-in;visibility:hidden;width:100vw;z-index:999999}:host .pwaPromptOverlay.modern{background:rgba(10,10,10,.5);color:rgba(235,235,245,.6)}:host .pwaPrompt{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);background-color:rgba(250,250,250,.8);border-radius:var(--radius-box);bottom:0;color:#000;filter:brightness(1.1);left:0;margin:0 8px 10px;overflow:hidden;pointer-events:none;position:fixed;touch-action:none;transform:translateY(calc(100% + 10px));transition:transform .4s cubic-bezier(0.4, 0.24, 0.3, 1);width:calc(100vw - 16px);z-index:999999}:host .pwaPrompt.modern{background:rgba(65,65,65,.7);filter:brightness(1.1)}:host .pwaPromptHeader{align-items:center;border-bottom:1px solid rgba(0,0,0,.1);border-left:0px;border-right:0px;border-top:0px;border-width:.5px;display:flex;flex-flow:row nowrap;justify-content:space-between;padding:13px 16px}:host .modern .pwaPromptHeader{border-color:rgba(140,140,140,.7)}:host .pwaPromptHeader .pwaPromptTitle{color:#333;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:18px;font-weight:500;line-height:1.125;margin:0;padding:0}:host .modern .pwaPromptHeader .pwaPromptTitle{color:#fff}:host .pwaPromptHeader .pwaPromptCancel{background:rgba(0,0,0,0);border:0;color:#2d7cf6;font-size:16px;margin:0;padding:0}:host .modern .pwaPromptHeader .pwaPromptCancel{color:#0984ff}:host .pwaPromptBody{display:flex;width:100%}:host .pwaPromptBody .pwaPromptDescription{border-bottom:1px solid rgba(0,0,0,.1);border-left:0px;border-right:0px;border-top:0px;border-width:.5px;color:inherit;margin:0 16px;padding:16px;width:100%}:host .modern .pwaPromptBody .pwaPromptDescription{border-color:rgba(140,140,140,.7)}:host .pwaPromptCopy{color:#7b7b7a;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:13px;line-height:17px;margin:0;padding:0}:host .pwaPromptCopy.bold{font-weight:600}:host .modern .pwaPromptCopy{border-color:rgba(235,235,245,.6);color:rgba(235,235,245,.6)}:host .pwaPromptInstruction{color:inherit;margin:0 16px;padding:16px}:host .pwaPromptInstruction .pwaPromptInstructionStep{align-items:center;display:flex;flex-flow:row nowrap;justify-content:flex-start;margin-bottom:16px;text-align:left}:host .pwaPromptInstruction .pwaPromptInstructionStep:last-of-type{margin-bottom:0}:host .pwaPromptInstruction .pwaPromptShareIcon,:host .pwaPromptInstruction .pwaPromptHomeIcon{flex:0 0 auto;height:30px;margin-right:32px;width:25px}:host .pwaPromptInstruction .pwaPromptHomeIcon{color:#2d7cf6}:host .modern .pwaPromptInstruction .pwaPromptHomeIcon{color:#fff;fill:#fff}:host .pwaPromptInstruction .pwaPromptShareIcon{color:#2d7cf6;fill:#2d7cf6}:host .modern .pwaPromptInstruction .pwaPromptShareIcon{color:#0984ff;fill:#0984ff}:host([visible]) .pwaPromptOverlay{display:block;opacity:1;pointer-events:initial;touch-action:none;visibility:visible}:host([visible]) .pwaPrompt{display:block;pointer-events:initial;touch-action:none;transform:translateY(0)}`;
    __getStatic() {
        return PwaPromptIos;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(PwaPromptIos.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div aria-label="Close" role="button" class="pwaPromptOverlay modern iOSPWA-overlay" _id="pwapromptios_0"></div><div class="pwaPrompt iOSPWA-container modern" aria-describedby="description" aria-labelledby="homescreen" role="dialog" _id="pwapromptios_1">    <div class="pwaPromptHeader iOSPWA-header">        <p class="pwaPromptTitle iOSPWA-title">            Ajouter à la page d'accueil        </p>        <button class="pwaPromptCancel iOSPWA-cancel" _id="pwapromptios_2">            Fermer        </button>    </div>    <div class="pwaPromptBody iOSPWA-body">        <div class="pwaPromptDescription iOSPWA-description">            <p class="pwaPromptCopy iOSPWA-description-copy">                Ce site web est doté d'une fonctionnalité d'application. Ajoutez-le à votre écran d'accueil pour l'utiliser en plein écran            </p>        </div>    </div>    <div class="pwaPromptInstruction iOSPWA-steps">        <div class="pwaPromptInstructionStep iOSPWA-step1">            <svg class="pwaPromptShareIcon iOSPWA-step1-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 566 670">                <path d="M255 12c4-4 10-8 16-8s12 3 16 8l94 89c3 4 6 7 8 12 2 6 0 14-5 19-7 8-20 9-28 2l-7-7-57-60 2 54v276c0 12-10 22-22 22-12 1-24-10-23-22V110l1-43-60 65c-5 5-13 8-21 6a19 19 0 0 1-16-17c-1-7 2-13 7-18l95-91z"></path>                <path d="M43 207c16-17 40-23 63-23h83v46h-79c-12 0-25 3-33 13-8 9-10 21-10 33v260c0 13 0 27 6 38 5 12 18 18 30 19l14 1h302c14 0 28 0 40-8 11-7 16-21 16-34V276c0-11-2-24-9-33-8-10-22-13-34-13h-78v-46h75c13 0 25 1 37 4 16 4 31 13 41 27 11 17 14 37 14 57v280c0 20-3 41-15 58a71 71 0 0 1-45 27c-11 2-23 3-34 3H109c-19-1-40-4-56-15-14-9-23-23-27-38-4-12-5-25-5-38V270c1-22 6-47 22-63z"></path>            </svg>            <p class="pwaPromptCopy bold iOSPWA-step1-copy">                1) Appuyez sur le bouton "Partager" dans la barre de menu.            </p>        </div>        <div class="pwaPromptInstructionStep iOSPWA-step2">            <svg class="pwaPromptHomeIcon iOSPWA-step2-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 578 584">                <path d="M101 35l19-1h333c12 0 23 0 35 3 17 3 34 12 44 27 13 16 16 38 16 58v329c0 19 0 39-8 57a65 65 0 0 1-37 37c-18 7-38 7-57 7H130c-21 1-44 0-63-10-14-7-25-20-30-34-6-15-8-30-8-45V121c1-21 5-44 19-61 13-16 33-23 53-25m7 46c-10 1-19 6-24 14-7 8-9 20-9 31v334c0 12 2 25 10 34 9 10 23 12 35 12h336c14 1 30-3 38-15 6-9 8-20 8-31V125c0-12-2-24-10-33-9-9-22-12-35-12H121l-13 1z"></path>                <path d="M271 161c9-11 31-10 38 4 3 5 3 11 3 17v87h88c7 0 16 1 21 7 6 6 7 14 6 22a21 21 0 0 1-10 14c-5 4-11 5-17 5h-88v82c0 7-1 15-6 20-10 10-29 10-37-2-3-6-4-13-4-19v-81h-87c-8-1-17-3-23-9-5-6-6-15-4-22a21 21 0 0 1 11-14c6-3 13-3 19-3h84v-88c0-7 1-14 6-20z"></path>            </svg>            <p class="pwaPromptCopy bold iOSPWA-step2-copy">                2) Appuyez sur "Ajouter à l'écran d'accueil".            </p>        </div>    </div></div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "overlay",
      "ids": [
        "pwapromptios_0"
      ]
    },
    {
      "name": "prompt",
      "ids": [
        "pwapromptios_1"
      ]
    }
  ],
  "pressEvents": [
    {
      "id": "pwapromptios_2",
      "onPress": (e, pressInstance, c) => { c.comp.close(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "PwaPromptIos";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('visible')) { this.attributeChangedCallback('visible', false, false); } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('visible'); }
    __listBoolProps() { return ["visible"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    close() {
        this.addEventListener("transitionend", () => {
            this.remove();
        });
        this.visible = false;
    }
    postCreation() {
        this.visible = true;
    }
}
PwaPromptIos.Namespace=`Inventaire`;
PwaPromptIos.Tag=`av-pwa-prompt-ios`;
__as1(_, 'PwaPromptIos', PwaPromptIos);
if(!window.customElements.get('av-pwa-prompt-ios')){window.customElements.define('av-pwa-prompt-ios', PwaPromptIos);Aventus.WebComponentInstance.registerDefinition(PwaPromptIos);}

App.Http.Controllers.Auth.Logout.AuthLogoutController=class AuthLogoutController extends Aventus.HttpRoute {
    constructor(router) {
        super(router);
        this.request = this.request.bind(this);
    }
    async request() {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/logout`, Aventus.HttpMethod.POST);
        return await request.queryVoid(this.router);
    }
}
App.Http.Controllers.Auth.Logout.AuthLogoutController.Namespace=`Inventaire.App.Http.Controllers.Auth.Logout`;
__as1(_.App.Http.Controllers.Auth.Logout, 'AuthLogoutController', App.Http.Controllers.Auth.Logout.AuthLogoutController);

const Footer = class Footer extends Aventus.WebComponent {
    static __style = `:host{align-items:center;background-color:var(--color-base-100);display:flex;flex-shrink:0;height:30px;justify-content:center;width:100%;box-shadow:var(--elevation-2);z-index:2}:host .content{align-items:center;color:var(--color-base-content);display:flex;height:100%;justify-content:space-between;max-width:1200px;padding:0 32px;width:100%}`;
    __getStatic() {
        return Footer;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Footer.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "Footer";
    }
}
Footer.Namespace=`Inventaire`;
Footer.Tag=`av-footer`;
__as1(_, 'Footer', Footer);
if(!window.customElements.get('av-footer')){window.customElements.define('av-footer', Footer);Aventus.WebComponentInstance.registerDefinition(Footer);}

const FlexScroll = class FlexScroll extends Aventus.Layout.Scrollable {
    static __style = `:host{display:flex;flex-direction:column}:host .scroll-main-container{display:flex;flex-direction:column}:host .scroll-main-container .content-zoom{display:flex;flex-direction:column}`;
    __getStatic() {
        return FlexScroll;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(FlexScroll.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "FlexScroll";
    }
}
FlexScroll.Namespace=`Inventaire`;
FlexScroll.Tag=`av-flex-scroll`;
__as1(_, 'FlexScroll', FlexScroll);
if(!window.customElements.get('av-flex-scroll')){window.customElements.define('av-flex-scroll', FlexScroll);Aventus.WebComponentInstance.registerDefinition(FlexScroll);}

const Modal = class Modal extends Aventus.Modal.ModalElement {
    static __style = `:host{align-items:center;background-color:rgba(30,30,30,.3);display:flex;inset:0;justify-content:center;position:fixed;z-index:60}:host .modal{background-color:var(--color-base-100);border:1px solid var(--color-base-300);border-radius:.75rem;box-shadow:var(--elevation-3);margin:16px;max-width:32rem;padding:1.5rem;position:relative;text-align:left;transform:translateZ(0);transition:all .2s ease-in-out;width:100%}`;
    constructor() {
        super();
        if (this.constructor == Modal) {
            throw "can't instanciate an abstract class";
        }
    }
    __getStatic() {
        return Modal;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Modal.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "Modal";
    }
}
Modal.Namespace=`Inventaire`;
__as1(_, 'Modal', Modal);

const Confirm = class Confirm extends Modal {
    static __style = `:host .title{font-size:var(--font-size-md);margin-bottom:16px}:host .footer{display:flex;justify-content:flex-end;margin-top:2rem;gap:.5rem}`;
    __getStatic() {
        return Confirm;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Confirm.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="title" _id="confirm_0"></div><div class="content" _id="confirm_1"></div><div class="footer">
    <av-button _id="confirm_2"></av-button>
    <av-button color="primary" _id="confirm_3"></av-button>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "confirm_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__6cf8206cb977ff2700b027c7f6a800dbmethod0())}`,
      "once": true
    },
    "confirm_1°@HTML": {
      "fct": (c) => `${c.print(c.comp.__6cf8206cb977ff2700b027c7f6a800dbmethod1())}`,
      "once": true
    },
    "confirm_2°@HTML": {
      "fct": (c) => `${c.print(c.comp.__6cf8206cb977ff2700b027c7f6a800dbmethod2())}`,
      "once": true
    },
    "confirm_3°@HTML": {
      "fct": (c) => `${c.print(c.comp.__6cf8206cb977ff2700b027c7f6a800dbmethod3())}`,
      "once": true
    }
  },
  "pressEvents": [
    {
      "id": "confirm_2",
      "onPress": (e, pressInstance, c) => { c.comp.no(e, pressInstance); }
    },
    {
      "id": "confirm_3",
      "onPress": (e, pressInstance, c) => { c.comp.yes(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "Confirm";
    }
    configure() {
        return {
            title: "",
            content: "",
            btnYesTxt: "Oui",
            btnNoTxt: "Non",
            noClose: true
        };
    }
    no() {
        this.resolve(false);
    }
    yes() {
        this.resolve(true);
    }
    __6cf8206cb977ff2700b027c7f6a800dbmethod0() {
        return this.options.title;
    }
    __6cf8206cb977ff2700b027c7f6a800dbmethod1() {
        return this.options.content;
    }
    __6cf8206cb977ff2700b027c7f6a800dbmethod2() {
        return this.options.btnNoTxt;
    }
    __6cf8206cb977ff2700b027c7f6a800dbmethod3() {
        return this.options.btnYesTxt;
    }
    static async open(options) {
        const alert = new Confirm();
        alert.options = { ...alert.options, ...options };
        return await Confirm._show(alert);
    }
}
Confirm.Namespace=`Inventaire`;
Confirm.Tag=`av-confirm`;
__as1(_, 'Confirm', Confirm);
if(!window.customElements.get('av-confirm')){window.customElements.define('av-confirm', Confirm);Aventus.WebComponentInstance.registerDefinition(Confirm);}

const Toggle = class Toggle extends Aventus.Form.FormElement {
    static get observedAttributes() {return ["checked"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'checked'() { return this.getBoolProp('checked') }
    set 'checked'(val) { this.setBoolAttr('checked', val) }    __registerPropertiesActions() { super.__registerPropertiesActions(); this.__addPropertyActions("checked", ((target) => {
    target.value = target.checked;
})); }
    static __style = `:host{--radius-selector-max: calc(var(--radius-selector) + var(--radius-selector) + var(--radius-selector));--input-color: color-mix(in srgb, var(--color-base-content)50%, #0000);--toggle-p: calc(var(--size)*.125);--size: calc(var(--size-selector, .25rem)*6);display:contents}:host input{-webkit-appearance:none;-moz-appearance:none;appearance:none;border:var(--border) solid currentColor;border-radius:calc(var(--radius-selector) + min(var(--toggle-p),var(--radius-selector-max)) + min(var(--border),var(--radius-selector-max)));box-shadow:0 1px color-mix(in oklab, currentColor calc(var(--depth) * 10%), rgba(0, 0, 0, 0)) inset;color:var(--input-color);cursor:pointer;display:inline-grid;flex-shrink:0;font-feature-settings:inherit;font-variation-settings:inherit;grid-template-columns:0fr 1fr 1fr;height:var(--size);letter-spacing:inherit;margin:0;opacity:1;padding:var(--toggle-p);place-content:center;position:relative;transition:color .3s,grid-template-columns .2s;-webkit-user-select:none;user-select:none;vertical-align:middle;webkit-user-select:none;width:calc(var(--size)*2 - (var(--border) + var(--toggle-p))*2)}:host input:before{--tw-content: "";aspect-ratio:1;background-color:currentColor;background-image:none,var(--fx-noise);background-size:auto,calc(var(--noise)*100%);border:0 solid;border-radius:var(--radius-selector);box-shadow:0 -1px oklch(0% 0 0/calc(var(--depth) * 0.1)) inset,0 8px 0 -4px oklch(100% 0 0/calc(var(--depth) * 0.1)) inset,0 1px color-mix(in oklab, currentColor calc(var(--depth) * 10%), rgba(0, 0, 0, 0));box-sizing:border-box;content:var(--tw-content);grid-column-start:2;grid-row-start:1;height:100%;inset-inline-start:0;margin:0;padding:0;position:relative;transition:background-color .1s,translate .2s,inset-inline-start .2s;translate:0}:host input:checked{--input-color: var(--color-base-content);background-color:var(--color-base-100);grid-template-columns:1fr 1fr 0fr}:host input:checked:before{background-color:currentColor}:host input:focus-visible,:host input:has(:focus-visible){outline:2px solid;outline-offset:2px}:host input:indeterminate{grid-template-columns:.5fr 1fr .5fr}:host input:disabled{cursor:not-allowed;opacity:.3}:host input:disabled:before{background-color:rgba(0,0,0,0);border:var(--border) solid currentColor}:host([disabled]) input{cursor:not-allowed;opacity:.3}:host([disabled]) input:before{background-color:rgba(0,0,0,0);border:var(--border) solid currentColor}@supports(color: color-mix(in lab, red, red)){:host input{--input-color: color-mix(in oklab, var(--color-base-content)50%, #0000)}}@media(forced-colors: active){:host input:before{outline-offset:-1px;outline-style:var(--tw-outline-style);outline-width:1px}}@media print{:host input:before{outline:.25rem solid;outline-offset:-1rem}}`;
    __getStatic() {
        return Toggle;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Toggle.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<input type="checkbox" _id="toggle_0" />` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "inputEl",
      "ids": [
        "toggle_0"
      ]
    }
  ],
  "injection": [
    {
      "id": "toggle_0",
      "injectionName": "disabled",
      "inject": (c) => c.comp.__b00ec36b9fd2aa633151e13d36b20993method0(),
      "once": true
    }
  ],
  "events": [
    {
      "eventName": "change",
      "id": "toggle_0",
      "fct": (e, c) => c.comp.onSwitch(e)
    }
  ]
}); }
    getClassName() {
        return "Toggle";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('checked')) { this.attributeChangedCallback('checked', false, false); } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('checked'); }
    __listBoolProps() { return ["checked"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    onValueChange(value) {
        this.inputEl.checked = value ?? false;
        this.checked = value ?? false;
    }
    onSwitch() {
        this.triggerChange(this.inputEl.checked);
    }
    __b00ec36b9fd2aa633151e13d36b20993method0() {
        return this.disabled;
    }
}
Toggle.Namespace=`Inventaire`;
Toggle.Tag=`av-toggle`;
__as1(_, 'Toggle', Toggle);
if(!window.customElements.get('av-toggle')){window.customElements.define('av-toggle', Toggle);Aventus.WebComponentInstance.registerDefinition(Toggle);}

let Style=class Style {
    static lockVariable(el, prop, source) {
        if (!source) {
            source = el;
        }
        const computed = getComputedStyle(source);
        let value = computed.getPropertyValue(prop.replace("--", "--_"));
        if (!value) {
            value = computed.getPropertyValue(prop);
        }
        el.style.setProperty(prop, value);
    }
    static unlockVariable(el, prop) {
        el.style.removeProperty(prop);
    }
}
Style.Namespace=`Inventaire`;
__as1(_, 'Style', Style);

const InputImage = class InputImage extends Aventus.Form.FormElement {
    static get observedAttributes() {return ["label", "default_preview", "no_default_preview"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'deletable'() { return this.getBoolAttr('deletable') }
    set 'deletable'(val) { this.setBoolAttr('deletable', val) }get 'show_delete'() { return this.getBoolAttr('show_delete') }
    set 'show_delete'(val) { this.setBoolAttr('show_delete', val) }    get 'label'() { return this.getStringProp('label') }
    set 'label'(val) { this.setStringAttr('label', val) }get 'default_preview'() { return this.getStringProp('default_preview') }
    set 'default_preview'(val) { this.setStringAttr('default_preview', val) }get 'no_default_preview'() { return this.getBoolProp('no_default_preview') }
    set 'no_default_preview'(val) { this.setBoolAttr('no_default_preview', val) }    get 'value'() {
						return this.__watch["value"];
					}
					set 'value'(val) {
						this.__watch["value"] = val;
					}get 'previewUri'() {
						return this.__watch["previewUri"];
					}
					set 'previewUri'(val) {
						this.__watch["previewUri"] = val;
					}    __registerWatchesActions() {
    this.__addWatchesActions("value", ((target) => {
    target.setPreview();
}));this.__addWatchesActions("previewUri");    super.__registerWatchesActions();
}
    static __style = `:host{--_input-image-height: var(--input-image-height, 30px)}:host label{cursor:pointer;display:none;font-size:calc(var(--font-size)*.85);margin-bottom:5px;margin-left:3px}:host .input{align-items:center;display:flex;height:var(--_input-image-height);padding:0 10px;width:100%}:host .input .preview{aspect-ratio:1;height:100%;position:relative}:host .input .preview .remove{background-color:var(--color-error);border-radius:50px;box-shadow:var(--elevation-3);color:var(--color-error-content);cursor:pointer;display:none;font-size:var(--font-size-sm);padding:2px;position:absolute;right:0;top:0;transform:translate(50%, -50%)}:host .input .preview av-img{height:100%;width:100%}:host .errors{color:var(--color-error);display:none;font-size:var(--font-size-sm);line-height:1.1;margin:10px;margin-bottom:0px}:host .errors div{margin:5px 0}:host([label]:not([label=""])) label{display:flex}:host([has_errors]) .errors{display:block}:host([show_delete]) .input .preview .remove{display:inline-block}`;
    __getStatic() {
        return InputImage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(InputImage.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<label for="input" _id="inputimage_0"></label><div class="input">
    <div class="preview" _id="inputimage_1">
        <av-img _id="inputimage_2"></av-img>
        <mi-icon icon="close" class="remove" _id="inputimage_3"></mi-icon>
    </div>
    <input id="input" type="file" style="display:none" accept="image/png, image/gif, image/jpeg, image/webp, .svg" _id="inputimage_4" />
</div><div class="errors">
    <template _id="inputimage_5"></template>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "previewEl",
      "ids": [
        "inputimage_1"
      ]
    },
    {
      "name": "inputFileEl",
      "ids": [
        "inputimage_4"
      ]
    }
  ],
  "content": {
    "inputimage_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__20fb5d8b19c82e031f4b31c5973774bemethod1())}`,
      "once": true
    },
    "inputimage_2°src": {
      "fct": (c) => `${c.print(c.comp.__20fb5d8b19c82e031f4b31c5973774bemethod2())}`,
      "once": true
    }
  },
  "events": [
    {
      "eventName": "change",
      "id": "inputimage_4",
      "fct": (e, c) => c.comp.updateFile(e)
    }
  ],
  "pressEvents": [
    {
      "id": "inputimage_1",
      "onPress": (e, pressInstance, c) => { c.comp.clickFile(e, pressInstance); }
    },
    {
      "id": "inputimage_3",
      "onPress": (e, pressInstance, c) => { c.comp.deleteFile(e, pressInstance); }
    }
  ]
});const templ0 = new Aventus.Template(this);templ0.setTemplate(`
        <template _id="inputimage_6"></template>
    `);this.__getStatic().__template.addLoop({
                    anchorId: 'inputimage_5',
                    template: templ0,
                simple:{data: "this.errors",item:"error"}});const templ1 = new Aventus.Template(this);templ1.setTemplate(`
            <div _id="inputimage_7"></div>
        `);templ1.setActions({
  "content": {
    "inputimage_7°@HTML": {
      "fct": (c) => `${c.print(c.comp.__20fb5d8b19c82e031f4b31c5973774bemethod3(c.data.error))}`,
      "once": true
    }
  }
});templ0.addIf({
                    anchorId: 'inputimage_6',
                    parts: [{once: true,
                    condition: (c) => true,
                    template: templ1
                }]
            }); }
    getClassName() {
        return "InputImage";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('deletable')) {this.setAttribute('deletable' ,'true'); }if(!this.hasAttribute('show_delete')) { this.attributeChangedCallback('show_delete', false, false); }if(!this.hasAttribute('label')){ this['label'] = undefined; }if(!this.hasAttribute('default_preview')){ this['default_preview'] = "/img/default_img.svg"; }if(!this.hasAttribute('no_default_preview')) { this.attributeChangedCallback('no_default_preview', false, false); } }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["value"] = undefined;w["previewUri"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('deletable');this.__upgradeProperty('show_delete');this.__upgradeProperty('label');this.__upgradeProperty('default_preview');this.__upgradeProperty('no_default_preview');this.__correctGetter('value');this.__correctGetter('previewUri'); }
    __listBoolProps() { return ["deletable","show_delete","no_default_preview"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    async validation() {
        return [];
    }
    setPreview() {
        if (!this.value?.uri) {
            this.previewUri = this.no_default_preview ? '' : this.default_preview;
            this.show_delete = false;
        }
        else {
            this.previewUri = this.value.uri;
            if (this.deletable) {
                this.show_delete = true;
            }
        }
    }
    updateFile() {
        if (!this.value)
            return;
        this.errors = [];
        if (this.inputFileEl.files && this.inputFileEl.files.length > 0) {
            this.value.upload = this.inputFileEl.files[0];
            this.previewUri = URL.createObjectURL(this.inputFileEl.files[0]);
            if (this.deletable) {
                this.show_delete = true;
            }
        }
        else {
            this.value.upload = undefined;
            this.previewUri = this.default_preview;
            this.show_delete = false;
        }
        this.onChange.trigger(this.value);
        if (this.form) {
            this.form.value.set(this.value);
        }
    }
    deleteFile() {
        this.inputFileEl.value = '';
        if (this.value !== undefined) {
            this.value.uri = "";
            this.onChange.trigger(this.value);
        }
        this.updateFile();
    }
    clickFile() {
        this.errors = [];
        this.inputFileEl.click();
    }
    postCreation() {
        super.postCreation();
        this.setPreview();
    }
    __20fb5d8b19c82e031f4b31c5973774bemethod1() {
        return this.label;
    }
    __20fb5d8b19c82e031f4b31c5973774bemethod2() {
        return this.previewUri;
    }
    __20fb5d8b19c82e031f4b31c5973774bemethod3(error) {
        return error;
    }
}
InputImage.Namespace=`Inventaire`;
InputImage.Tag=`av-input-image`;
__as1(_, 'InputImage', InputImage);
if(!window.customElements.get('av-input-image')){window.customElements.define('av-input-image', InputImage);Aventus.WebComponentInstance.registerDefinition(InputImage);}

const InlineEdit = class InlineEdit extends Aventus.Form.FormElement {
    static __style = `:host span{display:inline-flex;height:100%;min-width:5px}`;
    __getStatic() {
        return InlineEdit;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(InlineEdit.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<span contenteditable="true" _id="inlineedit_0"></span>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "componentEl",
      "ids": [
        "inlineedit_0"
      ]
    }
  ],
  "events": [
    {
      "eventName": "keydown",
      "id": "inlineedit_0",
      "fct": (e, c) => c.comp.checkKey(e)
    },
    {
      "eventName": "keyup",
      "id": "inlineedit_0",
      "fct": (e, c) => c.comp.change(e)
    }
  ]
}); }
    getClassName() {
        return "InlineEdit";
    }
    async validation() {
        return [];
    }
    onValueChange(value) {
        const actualValue = this.decodeHtmlSpecialChars(this.componentEl.innerText);
        if (value !== undefined && actualValue !== value) {
            this.componentEl.innerText = value;
        }
    }
    checkKey(e) {
        if (e.key == 'Enter') {
            e.preventDefault();
        }
    }
    change() {
        const value = this.componentEl?.innerText ? this.decodeHtmlSpecialChars(this.componentEl.innerText) : '';
        this.triggerChange(value);
    }
    decodeHtmlSpecialChars(text) {
        const map = {
            '&nbsp;': ' ',
            '&amp;': '&',
            '&#038;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#039;': "'",
            '&#8217;': '’',
            '&#8216;': '‘',
            '&#8211;': '–',
            '&#8212;': '—',
            '&#8230;': '…',
            '&#8221;': '”',
        };
        return text.replace(/\&[\w\d\#]{2,5}\;/g, (m) => map[m]);
    }
    postCreation() {
        super.postCreation();
        this.addEventListener("focus", () => {
            this.componentEl.focus();
        });
    }
}
InlineEdit.Namespace=`Inventaire`;
InlineEdit.Tag=`av-inline-edit`;
__as1(_, 'InlineEdit', InlineEdit);
if(!window.customElements.get('av-inline-edit')){window.customElements.define('av-inline-edit', InlineEdit);Aventus.WebComponentInstance.registerDefinition(InlineEdit);}

const Toast = class Toast extends Aventus.Toast.ToastElement {
    get 'color'() { return this.getStringAttr('color') }
    set 'color'(val) { this.setStringAttr('color', val) }get 'closing'() { return this.getBoolAttr('closing') }
    set 'closing'(val) { this.setBoolAttr('closing', val) }get 'outline'() { return this.getBoolAttr('outline') }
    set 'outline'(val) { this.setBoolAttr('outline', val) }get 'dash'() { return this.getBoolAttr('dash') }
    set 'dash'(val) { this.setBoolAttr('dash', val) }get 'soft'() { return this.getBoolAttr('soft') }
    set 'soft'(val) { this.setBoolAttr('soft', val) }get 'closable'() { return this.getBoolAttr('closable') }
    set 'closable'(val) { this.setBoolAttr('closable', val) }get 'close_icon'() { return this.getBoolAttr('close_icon') }
    set 'close_icon'(val) { this.setBoolAttr('close_icon', val) }    get 'toastTitle'() {
						return this.__watch["toastTitle"];
					}
					set 'toastTitle'(val) {
						this.__watch["toastTitle"] = val;
					}get 'toastMessage'() {
						return this.__watch["toastMessage"];
					}
					set 'toastMessage'(val) {
						this.__watch["toastMessage"] = val;
					}    icon;
    __registerWatchesActions() {
    this.__addWatchesActions("toastTitle");this.__addWatchesActions("toastMessage");    super.__registerWatchesActions();
}
    static __style = `:host{background-color:var(--alert-color, var(--color-base-200));background-image:none,var(--fx-noise);background-size:auto,calc(var(--noise)*100%);border:var(--border) solid var(--color-base-200);border-radius:var(--radius-box);box-shadow:0 3px 0 -2px oklch(100% 0 0/calc(var(--depth) * 0.08)) inset,0 1px #000,0 4px 3px -2px oklch(0% 0 0/calc(var(--depth) * 0.08));color:var(--color-base-content);cursor:default;max-width:calc(100vw - 2rem);overflow:hidden;pointer-events:auto;transition:top .2s linear,opacity .2s linear,visibility .2s linear}:host .toast-content{display:grid;font-size:.875rem;gap:1rem;grid-auto-flow:column;grid-template-columns:auto;justify-content:start;line-height:1.25rem;padding-block:.75rem;padding-inline:1rem;place-items:center start;text-align:start}:host .toast-flex{align-items:flex-start;display:flex}:host .toast-icon-wrapper{flex-shrink:0}:host .toast-icon{align-items:center;display:flex;font-size:calc(var(--spacing)*6);height:calc(var(--spacing)*6);justify-content:center;width:calc(var(--spacing)*6)}:host .toast-message-wrapper{flex:1;margin-left:1rem;padding-top:.125rem}:host .toast-title{font-size:.875rem;font-weight:500;margin:0}:host .toast-message{font-size:.875rem;margin-bottom:0;margin-top:0}:host .toast-message:nth-child(3){margin-top:.25rem}:host .toast-close-wrapper{flex-shrink:0;margin-left:1rem}:host .toast-close-wrapper .sr-only{border-width:0;clip:rect(0, 0, 0, 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}:host .toast-close-wrapper .toast-close-button{background-color:rgba(0,0,0,0);border:none;color:inherit;cursor:pointer;display:inline-flex;outline:none}:host .toast-close-wrapper .toast-close-icon{align-items:center;display:flex;font-size:calc(var(--spacing)*6);height:calc(var(--spacing)*6);justify-content:center;width:calc(var(--spacing)*6)}:host([color=neutral]){--alert-color: var(--color-neutral);border-color:var(--color-neutral);color:var(--color-neutral-content)}:host([color=primary]){--alert-color: var(--color-primary);border-color:var(--color-primary);color:var(--color-primary-content)}:host([color=secondary]){--alert-color: var(--color-secondary);border-color:var(--color-secondary);color:var(--color-secondary-content)}:host([color=accent]){--alert-color: var(--color-accent);border-color:var(--color-accent);color:var(--color-accent-content)}:host([color=info]){--alert-color: var(--color-info);border-color:var(--color-info);color:var(--color-info-content)}:host([color=success]){--alert-color: var(--color-success);border-color:var(--color-success);color:var(--color-success-content)}:host([color=warning]){--alert-color: var(--color-warning);border-color:var(--color-warning);color:var(--color-warning-content)}:host([color=error]){--alert-color: var(--color-error);border-color:var(--color-error);color:var(--color-error-content)}:host([closing]){opacity:0;visibility:hidden}:host(:not([close_icon])) .toast-close-wrapper{display:none}:host([closable]:not([close_icon])){cursor:pointer}:host([soft]){background:var(--alert-color, var(--color-base-content));background-image:none;border-color:var(--alert-color, var(--color-base-content));box-shadow:none;color:var(--alert-color, var(--color-base-content))}:host([outline]){background-color:rgba(0,0,0,0);background-image:none;box-shadow:none;color:var(--alert-color)}:host([dash]){background-color:rgba(0,0,0,0);background-image:none;border-style:dashed;box-shadow:none;color:var(--alert-color)}@supports(color: color-mix(in lab, red, red)){:host{box-shadow:0 3px 0 -2px oklch(100% 0 0/calc(var(--depth) * 0.08)) inset,0 1px color-mix(in oklab, color-mix(in oklab, #000 20%, var(--alert-color, var(--color-base-200))) calc(var(--depth) * 20%), rgba(0, 0, 0, 0)),0 4px 3px -2px oklch(0% 0 0/calc(var(--depth) * 0.08))}:host([soft]){background:color-mix(in oklab, var(--alert-color, var(--color-base-content)) 8%, var(--color-base-100));border-color:color-mix(in oklab, var(--alert-color, var(--color-base-content)) 10%, var(--color-base-100))}}`;
    __getStatic() {
        return Toast;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Toast.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="toast-content">
    <div class="toast-flex">
        <div class="toast-icon-wrapper">
            <mi-icon class="toast-icon" aria-hidden="true" _id="toast_0"></mi-icon>
        </div>
        <div class="toast-message-wrapper">
            <template _id="toast_1"></template>
            <template _id="toast_3"></template>
        </div>
        <div class="toast-close-wrapper">
            <button class="toast-close-button" _id="toast_5">
                <span class="sr-only">Close</span>
                <mi-icon icon="close" class="toast-close-icon"></mi-icon>
            </button>
        </div>
    </div>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "toast_0°icon": {
      "fct": (c) => `${c.print(c.comp.__8b8b64fb001ad828fd9cd08e5018dbd9method2())}`,
      "once": true
    }
  },
  "events": [
    {
      "eventName": "click",
      "id": "toast_5",
      "fct": (e, c) => c.comp.close(e)
    }
  ]
});const templ0 = new Aventus.Template(this);templ0.setTemplate(`
                <p class="toast-title" _id="toast_2"></p>
            `);templ0.setActions({
  "content": {
    "toast_2°@HTML": {
      "fct": (c) => `${c.print(c.comp.__8b8b64fb001ad828fd9cd08e5018dbd9method3())}`,
      "once": true
    }
  }
});this.__getStatic().__template.addIf({
                    anchorId: 'toast_1',
                    parts: [{once: true,
                    condition: (c) => c.comp.__8b8b64fb001ad828fd9cd08e5018dbd9method0(),
                    template: templ0
                }]
            });const templ1 = new Aventus.Template(this);templ1.setTemplate(`
                <p class="toast-message" _id="toast_4"></p>
            `);templ1.setActions({
  "content": {
    "toast_4°@HTML": {
      "fct": (c) => `${c.print(c.comp.__8b8b64fb001ad828fd9cd08e5018dbd9method4())}`,
      "once": true
    }
  }
});this.__getStatic().__template.addIf({
                    anchorId: 'toast_3',
                    parts: [{once: true,
                    condition: (c) => c.comp.__8b8b64fb001ad828fd9cd08e5018dbd9method1(),
                    template: templ1
                }]
            }); }
    getClassName() {
        return "Toast";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('color')){ this['color'] = undefined; }if(!this.hasAttribute('closing')) { this.attributeChangedCallback('closing', false, false); }if(!this.hasAttribute('outline')) { this.attributeChangedCallback('outline', false, false); }if(!this.hasAttribute('dash')) { this.attributeChangedCallback('dash', false, false); }if(!this.hasAttribute('soft')) { this.attributeChangedCallback('soft', false, false); }if(!this.hasAttribute('closable')) { this.attributeChangedCallback('closable', false, false); }if(!this.hasAttribute('close_icon')) { this.attributeChangedCallback('close_icon', false, false); } }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["toastTitle"] = "";w["toastMessage"] = ""; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('color');this.__upgradeProperty('closing');this.__upgradeProperty('outline');this.__upgradeProperty('dash');this.__upgradeProperty('soft');this.__upgradeProperty('closable');this.__upgradeProperty('close_icon');this.__correctGetter('toastTitle');this.__correctGetter('toastMessage'); }
    __listBoolProps() { return ["closing","outline","dash","soft","closable","close_icon"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    close() {
        if (this.onHideCallback) {
            this.closing = true;
            this.is_active = false;
            this.onHideCallback(false);
            Aventus.sleep(300).then(() => {
                this.remove();
            });
        }
    }
    setOptions(options) {
        if (options.color != undefined)
            this.color = options.color;
        if (options.icon != undefined)
            this.icon = options.icon;
        if (options.title != undefined)
            this.toastTitle = options.title;
        if (options.message != undefined)
            this.toastMessage = options.message;
        if (options.closable != undefined)
            this.closable = options.closable;
        if (options.close_icon != undefined)
            this.close_icon = options.close_icon;
        if (options.outline != undefined)
            this.outline = options.outline;
        if (options.dash != undefined)
            this.dash = options.dash;
        if (options.soft != undefined)
            this.soft = options.soft;
        if (options.message != undefined)
            this.toastMessage = options.message;
    }
    getIcon() {
        if (this.icon !== undefined)
            return this.icon;
        if (this.color == "error")
            return 'error';
        if (this.color == "info")
            return 'info';
        if (this.color == "success")
            return 'check';
        if (this.color == "warning")
            return 'warning';
        return 'error';
    }
    postCreation() {
        super.postCreation();
        if (this.closable && !this.close_icon) {
            new Aventus.PressManager({
                element: this,
                onPress: () => {
                    this.close();
                }
            });
        }
    }
    __8b8b64fb001ad828fd9cd08e5018dbd9method2() {
        return this.getIcon();
    }
    __8b8b64fb001ad828fd9cd08e5018dbd9method3() {
        return this.toastTitle;
    }
    __8b8b64fb001ad828fd9cd08e5018dbd9method4() {
        return this.toastMessage;
    }
    __8b8b64fb001ad828fd9cd08e5018dbd9method0() {
        return this.toastTitle;
    }
    __8b8b64fb001ad828fd9cd08e5018dbd9method1() {
        return this.toastMessage;
    }
    static add(options) {
        return super.add(options);
    }
}
Toast.Namespace=`Inventaire`;
Toast.Tag=`av-toast`;
__as1(_, 'Toast', Toast);
if(!window.customElements.get('av-toast')){window.customElements.define('av-toast', Toast);Aventus.WebComponentInstance.registerDefinition(Toast);}

const Input = class Input extends Aventus.Form.FormElement {
    static get observedAttributes() {return ["name", "label", "value"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'color'() { return this.getStringAttr('color') }
    set 'color'(val) { this.setStringAttr('color', val) }get 'type'() { return this.getStringAttr('type') }
    set 'type'(val) { this.setStringAttr('type', val) }get 'placeholder'() { return this.getStringAttr('placeholder') }
    set 'placeholder'(val) { this.setStringAttr('placeholder', val) }    get 'name'() { return this.getStringProp('name') }
    set 'name'(val) { this.setStringAttr('name', val) }get 'label'() { return this.getStringProp('label') }
    set 'label'(val) { this.setStringAttr('label', val) }get 'value'() { return this.getStringProp('value') }
    set 'value'(val) { this.setStringAttr('value', val) }    focusValue = "";
    __registerPropertiesActions() { super.__registerPropertiesActions(); this.__addPropertyActions("value", ((target) => {
    target.inputEl.value = target.value ?? "";
})); }
    static __style = `:host{--input-color: color-mix(in srgb, var(--color-base-content)20%, #0000);color:var(--color-base-content);width:100%}:host .label{cursor:pointer;display:block;font-size:calc(var(--font-size)*.85);margin-bottom:6px}:host .input{background-color:var(--color-base-100);border:1px solid var(--input-color);border-end-end-radius:var(--join-ee, var(--radius-field));border-end-start-radius:var(--join-es, var(--radius-field));border-start-end-radius:var(--join-se, var(--radius-field));border-start-start-radius:var(--join-ss, var(--radius-field));box-shadow:0 1px color-mix(in oklab, var(--input-color) calc(var(--depth) * 10%), rgba(0, 0, 0, 0)) inset,0 -1px oklch(100% 0 0/calc(var(--depth) * 0.1)) inset;cursor:pointer;display:flex;padding:0 8px;width:100%}:host .input input{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border:none;color:inherit;flex-grow:1;font-size:calc(var(--font-size)*.95);outline:none;outline-style:none;padding:8px 0}:host .input input:-webkit-autofill,:host .input input:-webkit-autofill:hover,:host .input input:-webkit-autofill:focus,:host .input input:-webkit-autofill:active{-webkit-box-shadow:0 0 0 30px var(--color-base-100) inset !important;-webkit-text-fill-color:var(--color-base-content)}:host .input input::placeholder{color:color-mix(in srgb, var(--color-base-content) 20%, transparent)}:host .errors{color:var(--color-error);font-size:calc(var(--font-size)*.8);margin-top:6px}:host(:not([label])) .label,:host([label=""]) .label{display:none}:host(:not([has_errors])) .errors{display:none}:host([disabled]) .input input{background-color:var(--color-base-200);border-color:var(--color-base-200);box-shadow:none;color:color-mix(in srgb, var(--color-base-content) 40%, transparent);cursor:not-allowed}@supports(color: color-mix(in lab, red, red)){:host{--input-color: color-mix(in oklab, var(--color-base-content)20%, #0000)}:host .input input::placeholder{color:color-mix(in oklab, var(--color-base-content) 20%, transparent)}:host([disabled]) .input input{color:color-mix(in oklab, var(--color-base-content) 40%, transparent)}}:host([color=neutral]),:host([color=neutral]):focus,:host([color=neutral]):focus-within{--input-color: var(--color-neutral)}:host([color=primary]),:host([color=primary]):focus,:host([color=primary]):focus-within{--input-color: var(--color-primary)}:host([color=secondary]),:host([color=secondary]):focus,:host([color=secondary]):focus-within{--input-color: var(--color-secondary)}:host([color=accent]),:host([color=accent]):focus,:host([color=accent]):focus-within{--input-color: var(--color-accent)}:host([color=info]),:host([color=info]):focus,:host([color=info]):focus-within{--input-color: var(--color-info)}:host([color=success]),:host([color=success]):focus,:host([color=success]):focus-within{--input-color: var(--color-success)}:host([color=warning]),:host([color=warning]):focus,:host([color=warning]):focus-within{--input-color: var(--color-warning)}:host([color=error]),:host([color=error]):focus,:host([color=error]):focus-within{--input-color: var(--color-error)}`;
    __getStatic() {
        return Input;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Input.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'before':`<slot name="before"></slot>`,'after':`<slot name="after"></slot>` }, 
        blocks: { 'default':`<label class="label" _id="input_0"></label><div class="input">
    <slot name="before"></slot>
    <input _id="input_1" />
    <slot name="after"></slot>
</div><div class="errors">
    <template _id="input_2"></template>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "inputEl",
      "ids": [
        "input_1"
      ]
    }
  ],
  "content": {
    "input_0°for": {
      "fct": (c) => `${c.print(c.comp.__7d3ca2aeff9f73a58c356d3051050ae6method1())}`,
      "once": true
    },
    "input_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__7d3ca2aeff9f73a58c356d3051050ae6method2())}`,
      "once": true
    },
    "input_1°type": {
      "fct": (c) => `${c.print(c.comp.__7d3ca2aeff9f73a58c356d3051050ae6method3())}`,
      "once": true
    },
    "input_1°name": {
      "fct": (c) => `${c.print(c.comp.__7d3ca2aeff9f73a58c356d3051050ae6method1())}`,
      "once": true
    },
    "input_1°id": {
      "fct": (c) => `${c.print(c.comp.__7d3ca2aeff9f73a58c356d3051050ae6method1())}`,
      "once": true
    },
    "input_1°placeholder": {
      "fct": (c) => `${c.print(c.comp.__7d3ca2aeff9f73a58c356d3051050ae6method4())}`,
      "once": true
    }
  },
  "events": [
    {
      "eventName": "focus",
      "id": "input_1",
      "fct": (e, c) => c.comp.onFocus(e)
    },
    {
      "eventName": "blur",
      "id": "input_1",
      "fct": (e, c) => c.comp.onBlur(e)
    },
    {
      "eventName": "input",
      "id": "input_1",
      "fct": (e, c) => c.comp.onInput(e)
    }
  ],
  "pressEvents": [
    {
      "id": "input_0",
      "onPress": (e, pressInstance, c) => { c.comp.focusInput(e, pressInstance); }
    }
  ]
});const templ0 = new Aventus.Template(this);templ0.setTemplate(` 
        <div _id="input_3"></div>
    `);templ0.setActions({
  "content": {
    "input_3°@HTML": {
      "fct": (c) => `${c.print(c.comp.__7d3ca2aeff9f73a58c356d3051050ae6method5(c.data.error))}`,
      "once": true
    }
  }
});this.__getStatic().__template.addLoop({
                    anchorId: 'input_2',
                    template: templ0,
                simple:{data: "this.errors",item:"error"}}); }
    getClassName() {
        return "Input";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('color')){ this['color'] = undefined; }if(!this.hasAttribute('type')){ this['type'] = "text"; }if(!this.hasAttribute('placeholder')){ this['placeholder'] = undefined; }if(!this.hasAttribute('name')){ this['name'] = undefined; }if(!this.hasAttribute('label')){ this['label'] = undefined; }if(!this.hasAttribute('value')){ this['value'] = ""; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('color');this.__upgradeProperty('type');this.__upgradeProperty('placeholder');this.__upgradeProperty('name');this.__upgradeProperty('label');this.__upgradeProperty('value'); }
    focusInput() {
        this.inputEl.focus();
    }
    select() {
        this.inputEl.select();
    }
    onFocus() {
        this.clearErrors();
        this.focusValue = this.inputEl.value;
    }
    onBlur() {
        if (this.inputEl.value == this.focusValue) {
            this.validate();
        }
    }
    onInput() {
        this.triggerChange(this.inputEl.value);
    }
    __7d3ca2aeff9f73a58c356d3051050ae6method1() {
        return this.name;
    }
    __7d3ca2aeff9f73a58c356d3051050ae6method2() {
        return this.label;
    }
    __7d3ca2aeff9f73a58c356d3051050ae6method3() {
        return this.type;
    }
    __7d3ca2aeff9f73a58c356d3051050ae6method4() {
        return this.placeholder;
    }
    __7d3ca2aeff9f73a58c356d3051050ae6method5(error) {
        return error;
    }
}
Input.Namespace=`Inventaire`;
Input.Tag=`av-input`;
__as1(_, 'Input', Input);
if(!window.customElements.get('av-input')){window.customElements.define('av-input', Input);Aventus.WebComponentInstance.registerDefinition(Input);}

const ModalTag = class ModalTag extends Modal {
    get 'name'() {
						return this.__watch["name"];
					}
					set 'name'(val) {
						this.__watch["name"] = val;
					}    __registerWatchesActions() {
    this.__addWatchesActions("name");    super.__registerWatchesActions();
}
    static __style = `:host .title{font-size:var(--font-size-md);margin-bottom:16px}:host .footer{display:flex;justify-content:flex-end;margin-top:2rem;gap:.5rem}`;
    __getStatic() {
        return ModalTag;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(ModalTag.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="title" _id="modaltag_0"></div><div class="content">
    <av-input label="Nom de la variation" _id="modaltag_1"></av-input>
</div><div class="footer">
    <av-button _id="modaltag_2">Annuler</av-button>
    <av-button color="primary" _id="modaltag_3">Enregistrer</av-button>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "inputEl",
      "ids": [
        "modaltag_1"
      ]
    }
  ],
  "content": {
    "modaltag_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__105132b7f1fa65d09c3cc981e16ef0efmethod0())}`,
      "once": true
    }
  },
  "bindings": [
    {
      "id": "modaltag_1",
      "injectionName": "value",
      "eventNames": [
        "onChange"
      ],
      "inject": (c) => c.comp.__105132b7f1fa65d09c3cc981e16ef0efmethod1(),
      "extract": (c, v) => c.comp.__105132b7f1fa65d09c3cc981e16ef0efmethod2(v),
      "once": true,
      "isCallback": true
    }
  ],
  "pressEvents": [
    {
      "id": "modaltag_2",
      "onPress": (e, pressInstance, c) => { c.comp.reject(e, pressInstance); }
    },
    {
      "id": "modaltag_3",
      "onPress": (e, pressInstance, c) => { c.comp.save(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "ModalTag";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["name"] = ""; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('name'); }
    configure() {
        return {
            title: "Edition de variation",
        };
    }
    save() {
        if (!this.name) {
            this.inputEl.errors = ["Il faut un nom pour la variation"];
            return;
        }
        this.resolve(this.name);
    }
    __105132b7f1fa65d09c3cc981e16ef0efmethod0() {
        return this.options.title;
    }
    __105132b7f1fa65d09c3cc981e16ef0efmethod1() {
        return this.name;
    }
    __105132b7f1fa65d09c3cc981e16ef0efmethod2(v) {
        if (this) {
            this.name = v;
        }
    }
}
ModalTag.Namespace=`Inventaire`;
ModalTag.Tag=`av-modal-tag`;
__as1(_, 'ModalTag', ModalTag);
if(!window.customElements.get('av-modal-tag')){window.customElements.define('av-modal-tag', ModalTag);Aventus.WebComponentInstance.registerDefinition(ModalTag);}

const VariationTag = class VariationTag extends Aventus.WebComponent {
    variation;
    onDelete = new Aventus.Callback();
    static __style = `:host av-tag{padding-left:12px}:host av-tag span{display:block;height:100%;min-width:5px}:host av-tag mi-icon{color:var(--color-error);cursor:pointer;font-size:16px;margin-left:6px}:host av-tag mi-icon.edit{color:var(--color-neutral)}`;
    __getStatic() {
        return VariationTag;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(VariationTag.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<av-tag color="accent">
    <span _id="variationtag_0"></span>
    <mi-icon icon="edit" class="edit" _id="variationtag_1"></mi-icon>
    <mi-icon icon="delete" _id="variationtag_2"></mi-icon>
</av-tag>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "componentEl",
      "ids": [
        "variationtag_0"
      ]
    }
  ],
  "pressEvents": [
    {
      "id": "variationtag_1",
      "onPress": (e, pressInstance, c) => { c.comp.triggerEdit(e, pressInstance); }
    },
    {
      "id": "variationtag_2",
      "onPress": (e, pressInstance, c) => { c.comp.triggerDelete(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "VariationTag";
    }
    async triggerEdit() {
        const p = new ModalTag();
        p.name = this.variation.nom;
        const result = await p.show();
        if (result !== null) {
            this.variation.nom = result;
            this.componentEl.innerText = result;
        }
    }
    async triggerDelete() {
        const result = await Confirm.open({
            title: "Êtes-vous sûr de vouloir supprimer la variation " + this.variation.nom + "?"
        });
        if (result) {
            this.onDelete.trigger(this);
        }
    }
    postCreation() {
        super.postCreation();
        this.componentEl.innerText = this.variation.nom;
    }
}
VariationTag.Namespace=`Inventaire`;
VariationTag.Tag=`av-variation-tag`;
__as1(_, 'VariationTag', VariationTag);
if(!window.customElements.get('av-variation-tag')){window.customElements.define('av-variation-tag', VariationTag);Aventus.WebComponentInstance.registerDefinition(VariationTag);}

const VariationTags = class VariationTags extends Aventus.WebComponent {
    variations = [];
    static __style = `:host{display:flex;flex-wrap:wrap;gap:6px}:host .list{display:flex;flex-wrap:wrap;gap:6px}`;
    constructor() {
        super();
        this.onChildDelete = this.onChildDelete.bind(this);
    }
    __getStatic() {
        return VariationTags;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(VariationTags.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="list" _id="variationtags_0">
</div><av-icon-action class="more" icon="add" _id="variationtags_1">Ajouter une variation</av-icon-action>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "listEl",
      "ids": [
        "variationtags_0"
      ]
    }
  ],
  "pressEvents": [
    {
      "id": "variationtags_1",
      "onPress": (e, pressInstance, c) => { c.comp.addVariation(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "VariationTags";
    }
    onChildDelete(el) {
        let children = Array.from(this.listEl.children);
        let index = children.indexOf(el);
        this.variations.splice(index, 1);
        this.listEl.removeChild(el);
    }
    render() {
        this.listEl.innerHTML = "";
        for (let variation of this.variations) {
            let el = new VariationTag();
            el.variation = variation;
            el.onDelete.add(this.onChildDelete);
            this.listEl.appendChild(el);
        }
    }
    async addVariation() {
        const p = new ModalTag();
        const nom = await p.show();
        if (nom === null)
            return;
        const v = new App.Models.Variation();
        v.nom = nom;
        this.variations.push(v);
        let el = new VariationTag();
        el.variation = v;
        el.onDelete.add(this.onChildDelete);
        this.listEl.appendChild(el);
    }
    postCreation() {
        this.render();
    }
}
VariationTags.Namespace=`Inventaire`;
VariationTags.Tag=`av-variation-tags`;
__as1(_, 'VariationTags', VariationTags);
if(!window.customElements.get('av-variation-tags')){window.customElements.define('av-variation-tags', VariationTags);Aventus.WebComponentInstance.registerDefinition(VariationTags);}

const Button = class Button extends Aventus.Form.ButtonElement {
    get 'color'() { return this.getStringAttr('color') }
    set 'color'(val) { this.setStringAttr('color', val) }get 'outline'() { return this.getBoolAttr('outline') }
    set 'outline'(val) { this.setBoolAttr('outline', val) }get 'dash'() { return this.getBoolAttr('dash') }
    set 'dash'(val) { this.setBoolAttr('dash', val) }get 'soft'() { return this.getBoolAttr('soft') }
    set 'soft'(val) { this.setBoolAttr('soft', val) }get 'ghost'() { return this.getBoolAttr('ghost') }
    set 'ghost'(val) { this.setBoolAttr('ghost', val) }get 'link'() { return this.getBoolAttr('link') }
    set 'link'(val) { this.setBoolAttr('link', val) }get 'active'() { return this.getBoolAttr('active') }
    set 'active'(val) { this.setBoolAttr('active', val) }get 'disabled'() { return this.getBoolAttr('disabled') }
    set 'disabled'(val) { this.setBoolAttr('disabled', val) }get 'loading'() { return this.getBoolAttr('loading') }
    set 'loading'(val) { this.setBoolAttr('loading', val) }    static __style = `:host{--tw-prose-links: var(--btn-fg);--size: calc(var(--size-field, .25rem)*10);--btn-bg: var(--btn-color, var(--color-base-200));--btn-fg: var(--color-base-content);--btn-p: 1rem;--btn-border: color-mix(in oklab, var(--btn-bg), #000 calc(var(--depth)*5%));--btn-shadow: 0 3px 2px -2px color-mix(in oklab, var(--btn-bg)calc(var(--depth)*30%), #0000), 0 4px 3px -2px color-mix(in oklab, var(--btn-bg)calc(var(--depth)*30%), #0000);align-items:center;background-color:var(--btn-bg);border-color:var(--btn-border);border-end-end-radius:var(--join-ee, var(--radius-field));border-end-start-radius:var(--join-es, var(--radius-field));border-start-end-radius:var(--join-se, var(--radius-field));border-start-start-radius:var(--join-ss, var(--radius-field));border-style:solid;border-width:var(--border);box-shadow:0 .5px 0 .5px oklch(100% 0 0/calc(var(--depth) * 6%)) inset,var(--btn-shadow);color:var(--btn-fg);cursor:pointer;display:inline-flex;flex-shrink:0;flex-wrap:nowrap;font-size:var(--fontsize, 0.875rem);font-weight:600;gap:.375rem;height:var(--size);justify-content:center;outline-color:var(--btn-color, var(--color-base-content));outline-offset:2px;padding-inline:var(--btn-p);position:relative;text-align:center;text-shadow:0 .5px oklch(100% 0 0/calc(var(--depth) * 0.15));touch-action:manipulation;transition-duration:var(--transition-duration);transition-property:color,background-color,border-color,box-shadow;transition-timing-function:var(--bezier);-webkit-user-select:none;user-select:none;vertical-align:middle;webkit-user-select:none}:host .loader-mask{align-items:center;align-items:stretch;display:none;inset:.5rem 1rem;justify-content:center;position:absolute}:host .loader-mask .loader{animation:rotation 1s linear infinite;aspect-ratio:1;border:2px solid var(--btn-fg);border-bottom-color:rgba(0,0,0,0);border-radius:50000px;display:block;max-height:100%;max-width:100%}:host([loading]) slot{opacity:0;visibility:hidden}:host([loading]) .loader-mask{display:flex}@media(hover: hover){@supports(color: color-mix(in lab, red, red)){:host(:hover){--btn-bg: color-mix(in oklab, var(--btn-color, var(--color-base-200)), #000 7%)}}:host(:hover){--btn-bg: color-mix(in srgb, var(--btn-color, var(--color-base-200)), #000 7%)}}:host(:focus-visible){isolation:isolate;outline-style:solid;outline-width:2px}:host(:active:not([active])){--btn-bg: color-mix(in srgb, var(--btn-color, var(--color-base-200)), #000 5%);--btn-border: color-mix(in srgb, var(--btn-color, var(--color-base-200)), #000 7%);--btn-shadow: 0 0 0 0 oklch(0% 0 0/0), 0 0 0 0 oklch(0% 0 0/0);translate:0 .5px}@supports(color: color-mix(in lab, red, red)){:host(:active:not([active])){--btn-bg: color-mix(in oklab, var(--btn-color, var(--color-base-200)), #000 5%);--btn-border: color-mix(in oklab, var(--btn-color, var(--color-base-200)), #000 7%)}}:host(:disabled),:host([disabled]){--btn-border: #0000;--btn-fg: color-mix(in srgb, var(--color-base-content)20%, #0000);pointer-events:none}:host(:disabled:not([link])),:host(:disabled:not([ghost])),:host([disabled]:not([link])),:host([disabled]:not([ghost])){background-color:color-mix(in srgb, var(--color-base-content) 10%, transparent);box-shadow:none}@supports(color: color-mix(in lab, red, red)){:host(:disabled:not([link])),:host(:disabled:not([ghost])),:host([disabled]:not([link])),:host([disabled]:not([ghost])){background-color:color-mix(in oklab, var(--color-base-content) 10%, transparent)}:host(:disabled),:host([disabled]){--btn-fg: color-mix(in oklch, var(--color-base-content)20%, #0000)}}@media(hover: hover){@supports(color: color-mix(in lab, red, red)){:host(:disabled:hover),:host([disabled]:hover){--btn-fg: color-mix(in oklch, var(--color-base-content)20%, #0000);background-color:color-mix(in oklab, var(--color-neutral) 20%, transparent)}}:host(:disabled:hover),:host([disabled]:hover){--btn-border: #0000;--btn-fg: color-mix(in srgb, var(--color-base-content)20%, #0000);background-color:color-mix(in srgb, var(--color-neutral) 20%, transparent);pointer-events:none}}:host([color=neutral]){--btn-color: var(--color-neutral);--btn-fg: var(--color-neutral-content)}:host([color=primary]){--btn-color: var(--color-primary);--btn-fg: var(--color-primary-content)}:host([color=secondary]){--btn-color: var(--color-secondary);--btn-fg: var(--color-secondary-content)}:host([color=accent]){--btn-color: var(--color-accent);--btn-fg: var(--color-accent-content)}:host([color=info]){--btn-color: var(--color-info);--btn-fg: var(--color-info-content)}:host([color=success]){--btn-color: var(--color-success);--btn-fg: var(--color-success-content)}:host([color=warning]){--btn-color: var(--color-warning);--btn-fg: var(--color-warning-content)}:host([color=error]){--btn-color: var(--color-error);--btn-fg: var(--color-error-content)}:host([active]){--btn-bg: color-mix(in srgb, var(--btn-color, var(--color-base-200)), #000 7%);--btn-shadow: 0 0 0 0 oklch(0% 0 0/0), 0 0 0 0 oklch(0% 0 0/0);isolation:isolate}@supports(color: color-mix(in lab, red, red)){:host([active]){--btn-bg: color-mix(in oklab, var(--btn-color, var(--color-base-200)), #000 7%)}}:host([disabled]),:host(:disabled){--btn-border: #0000;--btn-fg: color-mix(in srgb, var(--color-base-content)20%, #0000);pointer-events:none}:host([disabled]:not([link])),:host([disabled]:not([ghost])),:host(:disabled:not([link])),:host(:disabled:not([ghost])){background-color:color-mix(in srgb, var(--color-base-content) 10%, transparent);box-shadow:none}@supports(color: color-mix(in lab, red, red)){:host([disabled]:not([link])),:host([disabled]:not([ghost])),:host(:disabled:not([link])),:host(:disabled:not([ghost])){background-color:color-mix(in oklab, var(--color-base-content) 10%, transparent)}:host([disabled]),:host([disabled]),:host(:disabled),:host(:disabled){--btn-fg: color-mix(in oklch, var(--color-base-content)20%, #0000)}}@media(hover: hover){@supports(color: color-mix(in lab, red, red)){:host([disabled]:hover),:host([disabled]:hover),:host(:disabled:hover),:host(:disabled:hover){--btn-fg: color-mix(in oklch, var(--color-base-content)20%, #0000);background-color:color-mix(in oklab, var(--color-neutral) 20%, transparent)}}:host([disabled]:hover),:host([disabled]:hover),:host(:disabled:hover),:host(:disabled:hover){--btn-border: #0000;--btn-fg: color-mix(in srgb, var(--color-base-content)20%, #0000);background-color:color-mix(in srgb, var(--color-neutral) 20%, transparent);pointer-events:none}}:host([outline]:not([active])),:host([outline]:not(:hover)),:host([outline]:not(:active:focus)),:host([outline]:not(:focus-visible)),:host([outline]:not(:disabled)),:host([outline]:not([disabled])),:host([outline]:not(:checked)){--btn-shadow: "";--btn-bg: #0000;--btn-fg: var(--btn-color);--btn-border: var(--btn-color)}@media(hover: none){:host([outline]:not([active]):hover),:host([outline]:not(:active:focus):hover),:host([outline]:not(:focus-visible):hover),:host([outline]:not(:disabled):hover),:host([outline]:not([disabled]):hover),:host([outline]:not(:checked):hover){--btn-shadow: "";--btn-bg: #0000;--btn-fg: var(--btn-color);--btn-border: var(--btn-color)}}:host([soft]:not([active])),:host([soft]:not(:hover)),:host([soft]:not(:active:focus)),:host([soft]:not(:focus-visible)),:host([soft]:not(:disabled)),:host([soft]:not([disabled])){--btn-shadow: "";--btn-bg: #0000;--btn-fg: var(--btn-color);--btn-border: var(--btn-color)}@supports(color: color-mix(in lab, red, red)){:host([soft]:not([active])),:host([soft]:not(:hover)),:host([soft]:not(:active:focus)),:host([soft]:not(:focus-visible)),:host([soft]:not(:disabled)),:host([soft]:not([disabled])){--btn-bg: color-mix(in oklab, var(--btn-color, var(--color-base-content))8%, var(--color-base-100));--btn-border: color-mix(in oklab, var(--btn-color, var(--color-base-content))10%, var(--color-base-100))}}@media(hover: none){@supports(color: color-mix(in lab, red, red)){:host([soft]:not([active]):hover),:host([soft]:not(:active:focus):hover),:host([soft]:not(:focus-visible):hover),:host([soft]:not(:disabled):hover),:host([soft]:not([disabled]:hover)){--btn-bg: color-mix(in oklab, var(--btn-color, var(--color-base-content))8%, var(--color-base-100));--btn-border: color-mix(in oklab, var(--btn-color, var(--color-base-content))10%, var(--color-base-100))}}:host([soft]:not([active]):hover),:host([soft]:not(:active:focus):hover),:host([soft]:not(:focus-visible):hover),:host([soft]:not(:disabled):hover),:host([soft]:not([disabled]:hover)){--btn-shadow: "";--btn-fg: var(--btn-color, var(--color-base-content));--btn-bg: color-mix(in oklab, var(--btn-color, var(--color-base-content))8%, var(--color-base-100));--btn-border: color-mix(in oklab, var(--btn-color, var(--color-base-content))10%, var(--color-base-100))}}:host([dash]:not([active])),:host([dash]:not(:hover)),:host([dash]:not(:active:focus)),:host([dash]:not(:focus-visible)),:host([dash]:not(:disabled)),:host([dash]:not([disabled])),:host([dash]:not(:checked)){--btn-shadow: "";--btn-bg: #0000;--btn-fg: var(--btn-color);--btn-border: var(--btn-color);border-style:dashed}@media(hover: none){:host([dash]:not([active]):hover),:host([dash]:not(:active:focus):hover),:host([dash]:not(:focus-visible):hover),:host([dash]:not(:disabled):hover),:host([dash]:not([disabled]):hover),:host([dash]:not(:checked):hover){--btn-shadow: "";--btn-bg: #0000;--btn-fg: var(--btn-color);--btn-border: var(--btn-color);border-style:dashed}}:host([ghost]:not([active])),:host([ghost]:not(:hover)),:host([ghost]:not(:active:focus)),:host([ghost]:not(:focus-visible)){--btn-shadow: "";--btn-bg: #0000;--btn-border: #0000}:host([ghost]:not([active])),:host([ghost]:not(:hover)),:host([ghost]:not(:active:focus)),:host([ghost]:not(:focus-visible)),:host([ghost]:not(:disabled)),:host([ghost]:not([disabled])){--btn-fg: currentColor;outline-color:currentColor}@media(hover: none){:host([ghost]:not([active]):hover),:host([ghost]:not(:active):hover),:host([ghost]:not(:focus-visible):hover),:host([ghost]:not(:disabled):hover),:host([ghost]:not([disabled]):hover){--btn-shadow: "";--btn-bg: #0000;--btn-border: #0000;--btn-fg: currentColor}}:host([link]){--btn-border: #0000;--btn-bg: #0000;--btn-fg: var(--color-primary);--btn-shadow: "";outline-color:currentColor;text-decoration-line:underline}:host([link][active]),:host([link]:hover),:host([link]:active:focus),:host([link]:focus-visible){--btn-border: #0000;--btn-bg: #0000;text-decoration-line:underline}@media(hover: none){:host([link][active]:hover),:host([link]:active:hover),:host([link]:focus-visible:hover),:host([link]:disabled:hover),:host([link][disabled]:hover){text-decoration-line:none}}@keyframes rotation{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`;
    __getStatic() {
        return Button;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Button.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot><div class="loader-mask">
    <div class="loader"></div>
</div>` }
    });
}
    getClassName() {
        return "Button";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('color')){ this['color'] = undefined; }if(!this.hasAttribute('outline')) { this.attributeChangedCallback('outline', false, false); }if(!this.hasAttribute('dash')) { this.attributeChangedCallback('dash', false, false); }if(!this.hasAttribute('soft')) { this.attributeChangedCallback('soft', false, false); }if(!this.hasAttribute('ghost')) { this.attributeChangedCallback('ghost', false, false); }if(!this.hasAttribute('link')) { this.attributeChangedCallback('link', false, false); }if(!this.hasAttribute('active')) { this.attributeChangedCallback('active', false, false); }if(!this.hasAttribute('disabled')) { this.attributeChangedCallback('disabled', false, false); }if(!this.hasAttribute('loading')) { this.attributeChangedCallback('loading', false, false); } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('color');this.__upgradeProperty('outline');this.__upgradeProperty('dash');this.__upgradeProperty('soft');this.__upgradeProperty('ghost');this.__upgradeProperty('link');this.__upgradeProperty('active');this.__upgradeProperty('disabled');this.__upgradeProperty('loading'); }
    __listBoolProps() { return ["outline","dash","soft","ghost","link","active","disabled","loading"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
}
Button.Namespace=`Inventaire`;
Button.Tag=`av-button`;
__as1(_, 'Button', Button);
if(!window.customElements.get('av-button')){window.customElements.define('av-button', Button);Aventus.WebComponentInstance.registerDefinition(Button);}

const Tag = class Tag extends Aventus.WebComponent {
    get 'color'() { return this.getStringAttr('color') }
    set 'color'(val) { this.setStringAttr('color', val) }    static __style = `:host{align-items:center;background-color:var(--color-base-200);color:var(--color-base-content);border-radius:var(--radius-selector);display:flex;font-size:var(--font-size-sm);justify-content:center;padding:4px 8px}:host([color=neutral]){background-color:var(--color-neutral);color:var(--color-neutral-content)}:host([color=primary]){background-color:var(--color-primary);color:var(--color-primary-content)}:host([color=secondary]){background-color:var(--color-secondary);color:var(--color-secondary-content)}:host([color=accent]){background-color:var(--color-accent);color:var(--color-accent-content)}:host([color=info]){background-color:var(--color-info);color:var(--color-info-content)}:host([color=success]){background-color:var(--color-success);color:var(--color-success-content)}:host([color=warning]){background-color:var(--color-warning);color:var(--color-warning-content)}:host([color=error]){background-color:var(--color-error);color:var(--color-error-content)}`;
    __getStatic() {
        return Tag;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Tag.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "Tag";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('color')){ this['color'] = undefined; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('color'); }
}
Tag.Namespace=`Inventaire`;
Tag.Tag=`av-tag`;
__as1(_, 'Tag', Tag);
if(!window.customElements.get('av-tag')){window.customElements.define('av-tag', Tag);Aventus.WebComponentInstance.registerDefinition(Tag);}

const Tooltip = class Tooltip extends Aventus.WebComponent {
    get 'visible'() { return this.getBoolAttr('visible') }
    set 'visible'(val) { this.setBoolAttr('visible', val) }get 'position'() { return this.getStringAttr('position') }
    set 'position'(val) { this.setStringAttr('position', val) }get 'color'() { return this.getStringAttr('color') }
    set 'color'(val) { this.setStringAttr('color', val) }get 'use_absolute'() { return this.getBoolAttr('use_absolute') }
    set 'use_absolute'(val) { this.setBoolAttr('use_absolute', val) }get 'delay'() { return this.getNumberAttr('delay') }
    set 'delay'(val) { this.setNumberAttr('delay', val) }get 'delay_touch'() { return this.getNumberAttr('delay_touch') }
    set 'delay_touch'(val) { this.setNumberAttr('delay_touch', val) }get 'no_caret'() { return this.getBoolAttr('no_caret') }
    set 'no_caret'(val) { this.setBoolAttr('no_caret', val) }    parent = null;
    parentEv = null;
    isDestroyed = false;
    timeoutEnter = false;
    timeout = 0;
    pressManager;
    screenMargin = 10;
    static __style = `:host{--local-tooltip-from-y: 0;--local-tooltip-from-x: 0;--local-tooltip-to-y: 0;--local-tooltip-to-x: 0;--local-offset-carret-x: 0px;--local-offset-carret-y: 0px;--_tooltip-elevation: var(--tooltip-elevation, var(--elevation-4))}:host{border-radius:var(--radius-box);box-shadow:var(--elevation-4);opacity:0;padding:5px 15px;pointer-events:none;position:absolute;transition:.5s opacity var(--bezier),.5s visibility var(--bezier),.5s top var(--bezier),.5s bottom var(--bezier),.5s right var(--bezier),.5s left var(--bezier),.5s transform var(--bezier);visibility:hidden;width:max-content;z-index:1}:host::after{content:"";position:absolute}:host([no_caret])::after{display:none}:host([visible]){opacity:1;visibility:visible}:host([position=bottom]){transform:translateX(-50%)}:host([position=bottom])::after{border-bottom:9px solid var(--_tooltip-background-color);border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);left:calc(50% + var(--local-offset-carret-x));top:-8px;transform:translateX(-50%)}:host([use_absolute][position=bottom]){left:var(--local-tooltip-from-x);max-height:calc(100% - var(--local-tooltip-to-y) - 10px);top:var(--local-tooltip-from-y)}:host([use_absolute][visible][position=bottom]){top:var(--local-tooltip-to-y)}:host([position=bottom]:not([use_absolute])){bottom:0px;left:50%;transform:translateX(-50%) translateY(calc(100% - 10px))}:host([position=bottom][visible]:not([use_absolute])){transform:translateX(-50%) translateY(calc(100% + 10px))}:host([no_caret][use_absolute][position=bottom]){top:calc(var(--local-tooltip-from-y) - 8px)}:host([no_caret][use_absolute][visible][position=bottom]){top:calc(var(--local-tooltip-to-y) - 8px)}:host([position=top]){transform:translateX(-50%)}:host([position=top])::after{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:9px solid var(--_tooltip-background-color);bottom:-8px;left:calc(50% + var(--local-offset-carret-x));transform:translateX(-50%)}:host([use_absolute][position=top]){bottom:var(--local-tooltip-from-y);left:var(--local-tooltip-from-x);max-height:calc(100% - var(--local-tooltip-to-y) - 10px)}:host([use_absolute][visible][position=top]){bottom:var(--local-tooltip-to-y)}:host([position=top]:not([use_absolute])){left:50%;top:0px;transform:translateX(-50%) translateY(calc(-100% + 10px))}:host([position=top][visible]:not([use_absolute])){transform:translateX(-50%) translateY(calc(-100% - 10px))}:host([no_caret][use_absolute][position=top]){bottom:calc(var(--local-tooltip-from-y) - 6px)}:host([no_caret][use_absolute][visible][position=top]){bottom:calc(var(--local-tooltip-to-y) - 6px)}:host([position=right]){transform:translateY(-50%)}:host([position=right])::after{border-bottom:6px solid rgba(0,0,0,0);border-right:9px solid var(--_tooltip-background-color);border-top:6px solid rgba(0,0,0,0);left:-8px;top:calc(50% + var(--local-offset-carret-y));transform:translateY(-50%)}:host([use_absolute][position=right]){left:var(--local-tooltip-from-x);max-width:calc(100% - var(--local-tooltip-to-x) - 10px);top:var(--local-tooltip-from-y)}:host([use_absolute][visible][position=right]){left:var(--local-tooltip-to-x)}:host([position=right]:not([use_absolute])){right:0;top:50%;transform:translateX(calc(100% - 10px)) translateY(-50%)}:host([visible][position=right]:not([use_absolute])){transform:translateX(calc(100% + 10px)) translateY(-50%)}:host([no_caret][use_absolute][position=right]){left:calc(var(--local-tooltip-from-x) - 6px)}:host([no_caret][use_absolute][visible][position=right]){left:calc(var(--local-tooltip-to-x) - 6px)}:host([position=left]){right:var(--local-tooltip-from-x);top:var(--local-tooltip-from-y);transform:translateY(-50%)}:host([position=left])::after{border-bottom:6px solid rgba(0,0,0,0);border-left:9px solid var(--_tooltip-background-color);border-top:6px solid rgba(0,0,0,0);right:-8px;top:calc(50% + var(--local-offset-carret-y));transform:translateY(-50%)}:host([use_absolute][position=left]){max-width:calc(100% - var(--local-tooltip-to-x) - 10px);right:var(--local-tooltip-from-x);top:var(--local-tooltip-from-y)}:host([use_absolute][visible][position=left]){right:var(--local-tooltip-to-x)}:host([position=left]:not([use_absolute])){left:0;top:50%;transform:translateX(calc(-100% + 10px)) translateY(-50%)}:host([visible][position=left]:not([use_absolute])){transform:translateX(calc(-100% - 10px)) translateY(-50%)}:host([no_caret][use_absolute][position=left]){right:calc(var(--local-tooltip-from-x) - 6px)}:host([no_caret][use_absolute][visible][position=left]){right:calc(var(--local-tooltip-to-x) - 6px)}:host([color=neutral]){--_tooltip-background-color: var(--color-neutral);--_tooltip-color: var(--color-neutral-content)}:host([color=primary]){--_tooltip-background-color: var(--color-primary);--_tooltip-color: var(--color-primary-content)}:host([color=secondary]){--_tooltip-background-color: var(--color-secondary);--_tooltip-color: var(--color-secondary-content)}:host([color=accent]){--_tooltip-background-color: var(--color-accent);--_tooltip-color: var(--color-accent-content)}:host([color=info]){--_tooltip-background-color: var(--color-info);--_tooltip-color: var(--color-info-content)}:host([color=success]){--_tooltip-background-color: var(--color-success);--_tooltip-color: var(--color-success-content)}:host([color=warning]){--_tooltip-background-color: var(--color-warning);--_tooltip-color: var(--color-warning-content)}:host([color=error]){--_tooltip-background-color: var(--color-error);--_tooltip-color: var(--color-error-content)}`;
    constructor() {
        super();
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onTransitionEnd = this.onTransitionEnd.bind(this);
    }
    __getStatic() {
        return Tooltip;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Tooltip.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "Tooltip";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('visible')) { this.attributeChangedCallback('visible', false, false); }if(!this.hasAttribute('position')){ this['position'] = 'top'; }if(!this.hasAttribute('color')){ this['color'] = undefined; }if(!this.hasAttribute('use_absolute')) { this.attributeChangedCallback('use_absolute', false, false); }if(!this.hasAttribute('delay')){ this['delay'] = 50; }if(!this.hasAttribute('delay_touch')){ this['delay_touch'] = 500; }if(!this.hasAttribute('no_caret')) { this.attributeChangedCallback('no_caret', false, false); } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('visible');this.__upgradeProperty('position');this.__upgradeProperty('color');this.__upgradeProperty('use_absolute');this.__upgradeProperty('delay');this.__upgradeProperty('delay_touch');this.__upgradeProperty('no_caret'); }
    __listBoolProps() { return ["visible","use_absolute","no_caret"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    calculatePosition() {
        if (!this.parentEv || !this.use_absolute)
            return;
        let rect = this.parentEv.getBoundingClientRect();
        let center = {
            x: rect.left + rect.width / 2,
            y: rect.y + rect.height / 2
        };
        if (this.use_absolute) {
            const diffMinX = center.x - this.offsetWidth / 2;
            const diffMaxX = center.x + this.offsetWidth / 2;
            const maxX = document.body.offsetWidth - this.screenMargin;
            const minX = this.screenMargin;
            if (diffMinX < minX) {
                center.x += minX - diffMinX;
                this.style.setProperty("--local-offset-carret-x", diffMinX - minX + 'px');
            }
            else if (diffMaxX > maxX) {
                center.x += maxX - diffMaxX;
                this.style.setProperty("--local-offset-carret-x", diffMaxX - maxX + 'px');
            }
            const diffMinY = center.y - this.offsetHeight / 2;
            const diffMaxY = center.y + this.offsetHeight / 2;
            const maxY = document.body.offsetHeight - this.screenMargin;
            const minY = this.screenMargin;
            if (diffMinY < minY) {
                center.y += minY - diffMinY;
                this.style.setProperty("--local-offset-carret-y", diffMinY - minY + 'px');
            }
            else if (diffMaxY > maxY) {
                center.y += maxY - diffMaxY;
                this.style.setProperty("--local-offset-carret-y", diffMaxY - maxY + 'px');
            }
        }
        if (this.position == 'bottom') {
            let bottom = rect.y + rect.height;
            this.style.setProperty("--local-tooltip-from-y", bottom - 10 + 'px');
            this.style.setProperty("--local-tooltip-from-x", center.x + 'px');
            this.style.setProperty("--local-tooltip-to-x", center.x + 'px');
            this.style.setProperty("--local-tooltip-to-y", bottom + 10 + 'px');
        }
        else if (this.position == 'top') {
            let bottom = document.body.offsetHeight - rect.top;
            this.style.setProperty("--local-tooltip-from-y", bottom - 10 + 'px');
            this.style.setProperty("--local-tooltip-from-x", center.x + 'px');
            this.style.setProperty("--local-tooltip-to-x", center.x + 'px');
            this.style.setProperty("--local-tooltip-to-y", bottom + 10 + 'px');
        }
        else if (this.position == 'right') {
            let left = rect.x + rect.width;
            this.style.setProperty("--local-tooltip-from-y", center.y + 'px');
            this.style.setProperty("--local-tooltip-from-x", left - 10 + 'px');
            this.style.setProperty("--local-tooltip-to-x", left + 10 + 'px');
            this.style.setProperty("--local-tooltip-to-y", center.y + 10 + 'px');
        }
        else if (this.position == 'left') {
            let left = document.body.offsetWidth - rect.left;
            this.style.setProperty("--local-tooltip-from-y", center.y + 'px');
            this.style.setProperty("--local-tooltip-from-x", left - 10 + 'px');
            this.style.setProperty("--local-tooltip-to-x", left + 10 + 'px');
            this.style.setProperty("--local-tooltip-to-y", center.y + 'px');
        }
    }
    onMouseEnter() {
        this.calculatePosition();
        let delay = this.delay == 0 ? 50 : this.delay;
        if (this.use_absolute) {
            document.body.appendChild(this);
            this.timeoutEnter = false;
            this.timeout = setTimeout(() => {
                this.timeoutEnter = true;
                this.visible = true;
            }, delay);
        }
        else {
            if (delay == 0) {
                this.visible = true;
            }
            else {
                this.timeoutEnter = false;
                this.timeout = setTimeout(() => {
                    this.timeoutEnter = true;
                    this.visible = true;
                }, delay);
            }
        }
    }
    onMouseLeave() {
        this.visible = false;
        if (this.use_absolute) {
            if (!this.timeoutEnter) {
                clearTimeout(this.timeout);
                this.onTransitionEnd();
            }
        }
        else if (this.delay != 0) {
            if (!this.timeoutEnter) {
                clearTimeout(this.timeout);
                this.onTransitionEnd();
            }
        }
    }
    onTransitionEnd() {
        if (!this.use_absolute || this.visible)
            return;
        if (this.parent && !this.isDestroyed)
            this.parent?.appendChild(this);
        else
            this.remove();
    }
    onLongPress() {
        this.calculatePosition();
        if (this.use_absolute) {
            document.body.appendChild(this);
            this.timeoutEnter = false;
            this.timeout = setTimeout(() => {
                this.timeoutEnter = true;
                this.visible = true;
            }, 50);
        }
        else {
            this.visible = true;
        }
    }
    registerAction() {
        if (!this.parentEv)
            return;
        // if(Platform.device != "pc") {
        //     this.pressManager = new Aventus.PressManager({
        //         element: this.parentEv,
        //         onLongPress: () => {
        //             this.onLongPress();
        //         },
        //         onPressEnd: () => {
        //             this.onMouseLeave();
        //         },
        //         delayLongPress: this.delay_touch
        //     });
        // }
        // else {
        this.parentEv.addEventListener("mouseenter", this.onMouseEnter);
        this.parentEv.addEventListener("mouseleave", this.onMouseLeave);
        this.parentEv.addEventListener("click", this.onMouseLeave);
        // }
        this.addEventListener("transitionend", this.onTransitionEnd);
    }
    postCreation() {
        let parentEv = this.parentNode;
        if (parentEv instanceof ShadowRoot) {
            parentEv = parentEv.host;
        }
        if (parentEv instanceof HTMLElement) {
            this.parentEv = parentEv;
        }
        this.parent = this.parentNode;
        this.registerAction();
    }
    postDestruction() {
        this.isDestroyed = true;
        super.postDestruction();
        if (!this.parentEv)
            return;
        this.parentEv.removeEventListener("mouseenter", this.onMouseEnter);
        this.parentEv.removeEventListener("mouseleave", this.onMouseLeave);
        this.parentEv.removeEventListener("click", this.onMouseLeave);
    }
}
Tooltip.Namespace=`Inventaire`;
Tooltip.Tag=`av-tooltip`;
__as1(_, 'Tooltip', Tooltip);
if(!window.customElements.get('av-tooltip')){window.customElements.define('av-tooltip', Tooltip);Aventus.WebComponentInstance.registerDefinition(Tooltip);}

const IconAction = class IconAction extends MaterialIcon.Icon {
    static get observedAttributes() {return ["icon", "position", "delay", "delay_touch"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'color'() { return this.getStringAttr('color') }
    set 'color'(val) { this.setStringAttr('color', val) }    get 'icon'() { return this.getStringProp('icon') }
    set 'icon'(val) { this.setStringAttr('icon', val) }get 'position'() { return this.getStringProp('position') }
    set 'position'(val) { this.setStringAttr('position', val) }get 'delay'() { return this.getNumberProp('delay') }
    set 'delay'(val) { this.setNumberAttr('delay', val) }get 'delay_touch'() { return this.getNumberProp('delay_touch') }
    set 'delay_touch'(val) { this.setNumberAttr('delay_touch', val) }    tooltip;
    __registerPropertiesActions() { super.__registerPropertiesActions(); this.__addPropertyActions("position", ((target) => {
    if (target.tooltip) {
        target.tooltip.position = target.position;
    }
}));this.__addPropertyActions("delay", ((target) => {
    if (target.tooltip) {
        target.tooltip.delay = target.delay;
    }
}));this.__addPropertyActions("delay_touch", ((target) => {
    if (target.tooltip) {
        target.tooltip.delay_touch = target.delay_touch;
    }
})); }
    static __style = `:host{border-radius:4px;color:var(--color-base-content);cursor:pointer;font-size:var(--font-size-md);padding:3px;position:relative;transition:background-color var(--transition-duration) var(--bezier)}:host .hidden{display:none}:host([color=neutral]){background-color:rgba(0,0,0,0);color:var(--color-neutral)}:host([color=neutral]:hover){background-color:var(--color-neutral);color:var(--color-neutral-content)}:host([color=primary]){background-color:rgba(0,0,0,0);color:var(--color-primary)}:host([color=primary]:hover){background-color:var(--color-primary);color:var(--color-primary-content)}:host([color=secondary]){background-color:rgba(0,0,0,0);color:var(--color-secondary)}:host([color=secondary]:hover){background-color:var(--color-secondary);color:var(--color-secondary-content)}:host([color=accent]){background-color:rgba(0,0,0,0);color:var(--color-accent)}:host([color=accent]:hover){background-color:var(--color-accent);color:var(--color-accent-content)}:host([color=info]){background-color:rgba(0,0,0,0);color:var(--color-info)}:host([color=info]:hover){background-color:var(--color-info);color:var(--color-info-content)}:host([color=success]){background-color:rgba(0,0,0,0);color:var(--color-success)}:host([color=success]:hover){background-color:var(--color-success);color:var(--color-success-content)}:host([color=warning]){background-color:rgba(0,0,0,0);color:var(--color-warning)}:host([color=warning]:hover){background-color:var(--color-warning);color:var(--color-warning-content)}:host([color=error]){background-color:rgba(0,0,0,0);color:var(--color-error)}:host([color=error]:hover){background-color:var(--color-error);color:var(--color-error-content)}`;
    __getStatic() {
        return IconAction;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(IconAction.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot _id="iconaction_1"></slot>` }, 
        blocks: { 'default':`<div class="icon" _id="iconaction_0"></div><div class="hidden">
    <slot _id="iconaction_1"></slot>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "iconEl",
      "ids": [
        "iconaction_0"
      ]
    }
  ],
  "events": [
    {
      "eventName": "slotchange",
      "id": "iconaction_1",
      "fct": (e, c) => c.comp.onSlotChange(e)
    }
  ]
}); }
    getClassName() {
        return "IconAction";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('color')){ this['color'] = undefined; }if(!this.hasAttribute('icon')){ this['icon'] = "square"; }if(!this.hasAttribute('position')){ this['position'] = 'top'; }if(!this.hasAttribute('delay')){ this['delay'] = 700; }if(!this.hasAttribute('delay_touch')){ this['delay_touch'] = 700; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('color');this.__upgradeProperty('icon');this.__upgradeProperty('position');this.__upgradeProperty('delay');this.__upgradeProperty('delay_touch'); }
    onSlotChange() {
        const content = this.innerHTML.trim();
        if (content == "") {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = undefined;
            }
        }
        else {
            if (!this.tooltip) {
                this.tooltip = new Tooltip();
                this.tooltip.position = this.position;
                this.tooltip.delay = this.delay;
                this.tooltip.delay_touch = this.delay_touch;
                this.tooltip.use_absolute = true;
                this.tooltip.no_caret = true;
                this.tooltip.style.fontSize = "var(--font-size-sm)";
                this.tooltip.style.color = "#efefef";
                this.tooltip.style.backgroundColor = "#757575";
                this.shadowRoot.appendChild(this.tooltip);
            }
            this.tooltip.innerHTML = content;
        }
    }
    postCreation() {
        super.postCreation();
        this.onSlotChange();
    }
}
IconAction.Namespace=`Inventaire`;
IconAction.Tag=`av-icon-action`;
__as1(_, 'IconAction', IconAction);
if(!window.customElements.get('av-icon-action')){window.customElements.define('av-icon-action', IconAction);Aventus.WebComponentInstance.registerDefinition(IconAction);}

const OptionsContainer = class OptionsContainer extends Aventus.WebComponent {
    get 'open'() { return this.getBoolAttr('open') }
    set 'open'(val) { this.setBoolAttr('open', val) }    select;
    onOpen = new Aventus.Callback();
    isAnimating = false;
    firstOpen = true;
    static __style = `:host{--_options-container-background: var(--options-container-background, var(--form-element-background, white));--_options-container-border-radius: var(--options-container-border-radius, var(--form-element-border-radius, 0));--_options-container-box-shadow: var(--options-container-box-shadow, var(--elevation-2))}:host{background-color:var(--color-base-100);border:var(--border) solid var(--color-base-200);border-radius:var(--radius-box);box-shadow:0 2px calc(var(--depth)*3px) -2px rgba(0,0,0,.2);box-shadow:0 20px 25px -5px rgb(0, 0, 0, calc(var(--depth) * 0.1)),0 8px 10px -6px rgb(0, 0, 0, calc(var(--depth) * 0.1));color:var(--color-base-content);display:grid;grid-template-rows:0fr;left:0;max-height:min(24rem,70dvh);overflow:hidden;padding:.5rem;position:absolute;top:0;transition:.2s ease-in-out grid-template-rows;z-index:800}:host av-scrollable .container{display:flex;flex-direction:column}:host([open]){grid-template-rows:1fr}`;
    __getStatic() {
        return OptionsContainer;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(OptionsContainer.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<av-scrollable floating_scroll>
    <div class="container">
        <slot></slot>
    </div>
</av-scrollable>` }
    });
}
    getClassName() {
        return "OptionsContainer";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('open')) { this.attributeChangedCallback('open', false, false); } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('open'); }
    __listBoolProps() { return ["open"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    init(select) {
        this.select = select;
    }
    async show(container) {
        if (!container) {
            container = document.body;
        }
        if (this.firstOpen) {
            Style.lockVariable(this, "--options-container-background");
        }
        let box = this.select.getBoundingClientRect();
        let boxInput = this.select.inputEl.getBoundingClientRect();
        let contBox = container.getBoundingClientRect();
        let newTop = boxInput.top + boxInput.height + 2;
        let maxHeight = contBox.height - newTop - 10;
        this.style.width = box.width + 'px';
        this.style.top = newTop + 'px';
        this.style.left = box.left + 'px';
        this.style.maxHeight = maxHeight + 'px';
        container.appendChild(this);
        await Aventus.sleep(10);
        this.open = true;
        this.onOpen.trigger(true);
    }
    hide() {
        this.open = false;
        this.onOpen.trigger(false);
    }
    addAnimationEnd() {
        this.addEventListener("transitionstart", (event) => {
            this.isAnimating = true;
        });
        this.addEventListener("transitionend", (event) => {
            this.isAnimating = false;
            if (!this.open) {
                this.parentElement?.removeChild(this);
            }
        });
    }
    postCreation() {
        this.addAnimationEnd();
        this.setAttribute("tabindex", "-1");
    }
}
OptionsContainer.Namespace=`Inventaire`;
OptionsContainer.Tag=`av-options-container`;
__as1(_, 'OptionsContainer', OptionsContainer);
if(!window.customElements.get('av-options-container')){window.customElements.define('av-options-container', OptionsContainer);Aventus.WebComponentInstance.registerDefinition(OptionsContainer);}

const GenericSelect = class GenericSelect extends Aventus.Form.FormElement {
    static get observedAttributes() {return ["label", "placeholder", "icon", "searchable"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'open'() { return this.getBoolAttr('open') }
    set 'open'(val) { this.setBoolAttr('open', val) }    get 'label'() { return this.getStringProp('label') }
    set 'label'(val) { this.setStringAttr('label', val) }get 'placeholder'() { return this.getStringProp('placeholder') }
    set 'placeholder'(val) { this.setStringAttr('placeholder', val) }get 'icon'() { return this.getStringProp('icon') }
    set 'icon'(val) { this.setStringAttr('icon', val) }get 'searchable'() { return this.getBoolProp('searchable') }
    set 'searchable'(val) { this.setBoolAttr('searchable', val) }    get 'displayValue'() {
						return this.__watch["displayValue"];
					}
					set 'displayValue'(val) {
						this.__watch["displayValue"] = val;
					}get 'value'() {
						return this.__watch["value"];
					}
					set 'value'(val) {
						this.__watch["value"] = val;
					}    selectedOption;
    options = [];
    optionsInited = false;
    __registerWatchesActions() {
    this.__addWatchesActions("displayValue", ((target, action, path, value) => {
    target.inputEl.value = target.displayValue;
}));this.__addWatchesActions("value", ((target) => {
    target.onInternalValueChanged();
}));    super.__registerWatchesActions();
}
    __registerPropertiesActions() { super.__registerPropertiesActions(); this.__addPropertyActions("searchable", ((target) => {
    if (target.searchable) {
        target.inputEl.removeAttribute("disabled");
    }
    else {
        target.inputEl.setAttribute("disabled", "disabled");
    }
})); }
    static __style = `:host{--input-color: color-mix(in srgb, var(--color-base-content)20%, #0000);color:var(--color-base-content);min-width:100px;width:100%;width:100%}:host label{cursor:pointer;display:block;font-size:calc(var(--font-size)*.85);margin-bottom:6px}:host .input{align-items:center;background-color:var(--color-base-100);border:1px solid var(--input-color);border-end-end-radius:var(--join-ee, var(--radius-field));border-end-start-radius:var(--join-es, var(--radius-field));border-start-end-radius:var(--join-se, var(--radius-field));border-start-start-radius:var(--join-ss, var(--radius-field));box-shadow:0 1px color-mix(in oklab, var(--input-color) calc(var(--depth) * 10%), rgba(0, 0, 0, 0)) inset,0 -1px oklch(100% 0 0/calc(var(--depth) * 0.1)) inset;cursor:pointer;display:flex;padding:0 8px;width:100%}:host .input .icon{display:none;height:calc(var(--font-size)*.95);margin-right:10px}:host .input av-img.caret{--img-fill-color: var(--color-base-content);--img-stroke-width: 0;aspect-ratio:1;flex-grow:0;flex-shrink:0;height:calc(var(--font-size)*.95);transform:rotate(-90deg);transition:transform .5s ease-in-out}:host .input input{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border:none;color:inherit;flex-grow:1;font-size:calc(var(--font-size)*.95);outline:none;outline-style:none;padding:8px 0}:host .input input:-webkit-autofill,:host .input input:-webkit-autofill:hover,:host .input input:-webkit-autofill:focus,:host .input input:-webkit-autofill:active{-webkit-box-shadow:0 0 0 30px var(--color-base-100) inset !important;-webkit-text-fill-color:var(--color-base-content)}:host .input input::placeholder{color:color-mix(in srgb, var(--color-base-content) 20%, transparent)}:host .errors{color:var(--color-error);font-size:calc(var(--font-size)*.8);margin-top:6px}:host .hidden{display:none}:host(:not([label])) .label,:host([label=""]) .label{display:none}:host(:not([has_errors])) .errors{display:none}:host([disabled]) .input input{background-color:var(--color-base-200);border-color:var(--color-base-200);box-shadow:none;color:color-mix(in srgb, var(--color-base-content) 40%, transparent);cursor:not-allowed}:host([icon]:not([icon=""])) .input .icon{display:block}:host([open]) .input .caret{transform:rotate(-270deg)}@supports(color: color-mix(in lab, red, red)){:host{--input-color: color-mix(in oklab, var(--color-base-content)20%, #0000)}:host .input input::placeholder{color:color-mix(in oklab, var(--color-base-content) 20%, transparent)}:host([disabled]) .input input{color:color-mix(in oklab, var(--color-base-content) 40%, transparent)}}:host([color=neutral]),:host([color=neutral]):focus,:host([color=neutral]):focus-within{--input-color: var(--color-neutral)}:host([color=primary]),:host([color=primary]):focus,:host([color=primary]):focus-within{--input-color: var(--color-primary)}:host([color=secondary]),:host([color=secondary]):focus,:host([color=secondary]):focus-within{--input-color: var(--color-secondary)}:host([color=accent]),:host([color=accent]):focus,:host([color=accent]):focus-within{--input-color: var(--color-accent)}:host([color=info]),:host([color=info]):focus,:host([color=info]):focus-within{--input-color: var(--color-info)}:host([color=success]),:host([color=success]):focus,:host([color=success]):focus-within{--input-color: var(--color-success)}:host([color=warning]),:host([color=warning]):focus,:host([color=warning]):focus-within{--input-color: var(--color-warning)}:host([color=error]),:host([color=error]):focus,:host([color=error]):focus-within{--input-color: var(--color-error)}`;
    constructor() {
        super();
        if (this.constructor == GenericSelect) {
            throw "can't instanciate an abstract class";
        }
    }
    __getStatic() {
        return GenericSelect;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(GenericSelect.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'prepend':`<slot name="prepend">
        <av-img class="icon" _id="genericselect_2"></av-img>
    </slot>`,'append':`<slot name="append"></slot>`,'default':`<slot></slot>` }, 
        blocks: { 'default':`<label for="input" _id="genericselect_0"></label><div class="input" _id="genericselect_1">
    <slot name="prepend">
        <av-img class="icon" _id="genericselect_2"></av-img>
    </slot>
    <input id="input" autocomplete="off" _id="genericselect_3" />
    <slot name="append"></slot>
    <av-img src="/img/angle-left.svg" class="caret"></av-img>
</div><div class="errors">
    <template _id="genericselect_4"></template>
</div><div class="hidden">
    <slot></slot>
</div><av-options-container class="options-container" _id="genericselect_6"></av-options-container>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "inputEl",
      "ids": [
        "genericselect_3"
      ]
    },
    {
      "name": "optionsContainer",
      "ids": [
        "genericselect_6"
      ]
    }
  ],
  "content": {
    "genericselect_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__355bb3ba36f1d9f73b205609b2c794f0method1())}`,
      "once": true
    },
    "genericselect_2°src": {
      "fct": (c) => `${c.print(c.comp.__355bb3ba36f1d9f73b205609b2c794f0method2())}`,
      "once": true
    },
    "genericselect_3°placeholder": {
      "fct": (c) => `${c.print(c.comp.__355bb3ba36f1d9f73b205609b2c794f0method3())}`,
      "once": true
    }
  },
  "events": [
    {
      "eventName": "input",
      "id": "genericselect_3",
      "fct": (e, c) => c.comp.filter(e)
    },
    {
      "eventName": "onOpen",
      "id": "genericselect_6",
      "fct": (c, ...args) => c.comp.syncCaret.apply(c.comp, ...args),
      "isCallback": true
    }
  ],
  "pressEvents": [
    {
      "id": "genericselect_0",
      "onPress": (e, pressInstance, c) => { c.comp.showOptions(e, pressInstance); }
    },
    {
      "id": "genericselect_1",
      "onPress": (e, pressInstance, c) => { c.comp.showOptions(e, pressInstance); }
    }
  ]
});const templ0 = new Aventus.Template(this);templ0.setTemplate(` 
        <div _id="genericselect_5"></div>
    `);templ0.setActions({
  "content": {
    "genericselect_5°@HTML": {
      "fct": (c) => `${c.print(c.comp.__355bb3ba36f1d9f73b205609b2c794f0method4(c.data.error))}`,
      "once": true
    }
  }
});this.__getStatic().__template.addLoop({
                    anchorId: 'genericselect_4',
                    template: templ0,
                simple:{data: "this.errors",item:"error"}}); }
    getClassName() {
        return "GenericSelect";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('open')) { this.attributeChangedCallback('open', false, false); }if(!this.hasAttribute('label')){ this['label'] = undefined; }if(!this.hasAttribute('placeholder')){ this['placeholder'] = undefined; }if(!this.hasAttribute('icon')){ this['icon'] = undefined; }if(!this.hasAttribute('searchable')) { this.attributeChangedCallback('searchable', false, false); } }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["displayValue"] = "";w["value"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('open');this.__upgradeProperty('label');this.__upgradeProperty('placeholder');this.__upgradeProperty('icon');this.__upgradeProperty('searchable');this.__correctGetter('displayValue');this.__correctGetter('value'); }
    __listBoolProps() { return ["open","searchable"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    compare(item1, item2) {
        return item1 == item2;
    }
    onInternalValueChanged() {
        if (!this.optionsInited)
            return;
        let found = false;
        for (let option of this.options) {
            if (this.compare(option.value, this.value)) {
                found = true;
                this.selectedOption = option;
                this.displayValue = this.itemToText(option);
                this.filter();
                break;
            }
        }
        if (!found) {
            this.selectedOption = undefined;
            this.displayValue = this.placeholder ?? '';
            this.filter();
        }
    }
    setValueFromOption(option) {
        this.selectedOption = option;
        this.value = option.value;
        this.displayValue = this.itemToText(option);
        this.hideOptions();
        this.onChange.trigger(this.value);
        this.filter();
        if (this.form) {
            this.form.value.set(this.value);
        }
    }
    removeErrors() {
        this.errors = [];
    }
    loadElementsFromSlot() {
        let elements = this.getElementsInSlot();
        for (let element of elements) {
            if (element instanceof GenericOption) {
                this.options.push(element);
                element.init(this);
                this.optionsContainer.appendChild(element);
            }
        }
    }
    showOptions() {
        if (!this.open) {
            this.removeErrors();
            this.optionsContainer.show();
        }
        if (!this.searchable) {
            setTimeout(() => {
                this.optionsContainer.focus({ preventScroll: true });
            }, 100);
        }
    }
    hideOptions() {
        setTimeout(() => {
            this.optionsContainer.blur();
        }, 50);
    }
    syncCaret(open) {
        this.open = open;
    }
    filter() {
        if (this.searchable) {
            let value = this.inputEl.value.toLowerCase();
            for (let option of this.options) {
                option.filter(value);
            }
        }
    }
    manageFocus() {
        let blurTimeout = 0;
        ;
        let blur = () => {
            blurTimeout = setTimeout(() => {
                this.optionsContainer.hide();
            }, 50);
        };
        this.inputEl.addEventListener("blur", () => {
            blur();
        });
        this.optionsContainer.addEventListener("blur", () => {
            blur();
        });
        this.inputEl.addEventListener("focus", () => {
            clearTimeout(blurTimeout);
            this.inputEl.select();
        });
        this.optionsContainer.addEventListener("focus", () => {
            clearTimeout(blurTimeout);
        });
    }
    postDestruction() {
        super.postDestruction();
        this.optionsContainer.remove();
    }
    postCreation() {
        super.postCreation();
        this.manageFocus();
        this.optionsContainer.init(this);
        this.loadElementsFromSlot();
        this.optionsInited = true;
        this.onInternalValueChanged();
        this.shadowRoot.removeChild(this.optionsContainer);
    }
    __355bb3ba36f1d9f73b205609b2c794f0method1() {
        return this.label;
    }
    __355bb3ba36f1d9f73b205609b2c794f0method2() {
        return this.icon;
    }
    __355bb3ba36f1d9f73b205609b2c794f0method3() {
        return this.placeholder;
    }
    __355bb3ba36f1d9f73b205609b2c794f0method4(error) {
        return error;
    }
}
GenericSelect.Namespace=`Inventaire`;
__as1(_, 'GenericSelect', GenericSelect);

const GenericOption = class GenericOption extends Aventus.WebComponent {
    value;
    select;
    static __style = `:host{border-radius:var(--radius-field);color:inherit;font-size:.875rem;padding-block:.375rem;padding-inline:.75rem;transition-duration:.2s;transition-property:color,background-color;transition-timing-function:cubic-bezier(0, 0, 0.2, 1);white-space:normal;cursor:pointer}:host(:hover){background-color:var(--color-base-content)}@supports(color: color-mix(in lab, red, red)){:host(:hover){background-color:color-mix(in oklab, var(--color-base-content) 10%, transparent)}}`;
    __getStatic() {
        return GenericOption;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(GenericOption.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "GenericOption";
    }
    init(select) {
        this.select = select;
    }
    filter(text) {
        if (this.innerText.toLowerCase().includes(text)) {
            this.style.display = "";
        }
        else {
            this.style.display = "none";
        }
    }
    postCreation() {
        new Aventus.PressManager({
            element: this,
            onPress: () => {
                this.select.setValueFromOption(this);
            }
        });
    }
}
GenericOption.Namespace=`Inventaire`;
GenericOption.Tag=`av-generic-option`;
__as1(_, 'GenericOption', GenericOption);
if(!window.customElements.get('av-generic-option')){window.customElements.define('av-generic-option', GenericOption);Aventus.WebComponentInstance.registerDefinition(GenericOption);}

const OptionEnum = class OptionEnum extends GenericOption {
    value = undefined;
    static __style = ``;
    __getStatic() {
        return OptionEnum;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(OptionEnum.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "OptionEnum";
    }
}
OptionEnum.Namespace=`Inventaire`;
OptionEnum.Tag=`av-option-enum`;
__as1(_, 'OptionEnum', OptionEnum);
if(!window.customElements.get('av-option-enum')){window.customElements.define('av-option-enum', OptionEnum);Aventus.WebComponentInstance.registerDefinition(OptionEnum);}

const SelectEnum = class SelectEnum extends GenericSelect {
    get 'txt_undefined'() { return this.getStringAttr('txt_undefined') }
    set 'txt_undefined'(val) { this.setStringAttr('txt_undefined', val) }    enumEl;
    static __style = ``;
    constructor() {
        super();
        this.enumEl = this.defineEnum();
        this.createOptions();
        if (this.constructor == SelectEnum) {
            throw "can't instanciate an abstract class";
        }
    }
    __getStatic() {
        return SelectEnum;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(SelectEnum.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "SelectEnum";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('txt_undefined')){ this['txt_undefined'] = undefined; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('txt_undefined'); }
    itemToText(option) {
        return option.innerHTML;
    }
    getEnumName(value) {
        return this.enumEl[value];
    }
    createOptions() {
        if (this.txt_undefined !== undefined) {
            let option = new OptionEnum();
            option.value = undefined;
            option.innerHTML = this.txt_undefined === "" ? "&nbsp;" : this.txt_undefined;
            this.appendChild(option);
        }
        let _enum = this.defineEnum();
        for (let key in _enum) {
            if (!key.match(/^\d*$/)) {
                let val = _enum[key];
                let option = new OptionEnum();
                option.value = val;
                option.innerHTML = this.getEnumName(val);
                this.appendChild(option);
            }
        }
    }
    postCreation() {
        super.postCreation();
    }
}
SelectEnum.Namespace=`Inventaire`;
__as1(_, 'SelectEnum', SelectEnum);

const Option = class Option extends GenericOption {
    static get observedAttributes() {return ["value"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'value'() { return this.getStringProp('value') }
    set 'value'(val) { this.setStringAttr('value', val) }    static __style = ``;
    __getStatic() {
        return Option;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Option.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "Option";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('value')){ this['value'] = undefined; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('value'); }
}
Option.Namespace=`Inventaire`;
Option.Tag=`av-option`;
__as1(_, 'Option', Option);
if(!window.customElements.get('av-option')){window.customElements.define('av-option', Option);Aventus.WebComponentInstance.registerDefinition(Option);}

const Select = class Select extends GenericSelect {
    static get observedAttributes() {return ["value"].concat(super.observedAttributes).filter((v, i, a) => a.indexOf(v) === i);}
    get 'value'() { return this.getStringProp('value') }
    set 'value'(val) { this.setStringAttr('value', val) }    __registerPropertiesActions() { super.__registerPropertiesActions(); this.__addPropertyActions("value", ((target) => {
    target.onInternalValueChanged();
})); }
    static __style = ``;
    __getStatic() {
        return Select;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Select.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "Select";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('value')){ this['value'] = ""; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('value'); }
    itemToText(option) {
        // if(option.value !== undefined) {
        //     return option.value
        // }
        return option.innerHTML.replace(/&nbsp;/g, " ");
    }
}
Select.Namespace=`Inventaire`;
Select.Tag=`av-select`;
__as1(_, 'Select', Select);
if(!window.customElements.get('av-select')){window.customElements.define('av-select', Select);Aventus.WebComponentInstance.registerDefinition(Select);}

const SelectData = class SelectData extends GenericSelect {
    get 'loading'() { return this.getBoolAttr('loading') }
    set 'loading'(val) { this.setBoolAttr('loading', val) }get 'txt_undefined'() { return this.getStringAttr('txt_undefined') }
    set 'txt_undefined'(val) { this.setStringAttr('txt_undefined', val) }    data = [];
    isInit = false;
    static __style = ``;
    constructor() {
        super();
        if (this.constructor == SelectData) {
            throw "can't instanciate an abstract class";
        }
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.onCreated = this.onCreated.bind(this);
        this.onDeleted = this.onDeleted.bind(this);
        this.onUpdated = this.onUpdated.bind(this);
    }
    __getStatic() {
        return SelectData;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(SelectData.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "SelectData";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('loading')) { this.attributeChangedCallback('loading', false, false); }if(!this.hasAttribute('txt_undefined')){ this['txt_undefined'] = undefined; } }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('loading');this.__upgradeProperty('txt_undefined'); }
    __listBoolProps() { return ["loading"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    compare(item1, item2) {
        if (item1 === undefined && item2 === undefined) {
            return true;
        }
        if (item1 === undefined || item2 === undefined) {
            return false;
        }
        if (typeof item1 == 'number' || typeof item2 == 'number') {
            return item1 == item2;
        }
        const key1 = this.defineRam().getId(item1);
        const key2 = this.defineRam().getId(item2);
        return key1 == key2;
    }
    itemToText(option) {
        return option.getText();
    }
    defineOption() {
        return OptionData;
    }
    getOption() {
        const cst = this.defineOption();
        let option = new cst();
        option.init(this);
        return option;
    }
    async createOptions() {
        this.loading = true;
        this.data = await this.loadData();
        for (let child of this.children) {
            child.remove();
        }
        if (this.txt_undefined !== undefined) {
            let option = this.getOption();
            await option.setItem(undefined);
            if (this.compare(option.value, this.value)) {
                this.selectedOption = option;
                this.displayValue = this.itemToText(option);
                this.filter();
            }
            option.innerHTML = this.txt_undefined === "" ? "&nbsp;" : this.txt_undefined;
            this.appendChild(option);
        }
        for (let item of this.data) {
            let option = this.getOption();
            await option.setItem(item);
            if (this.compare(option.value, this.value)) {
                this.selectedOption = option;
                this.displayValue = this.itemToText(option);
                this.filter();
            }
            this.appendChild(option);
        }
        this.loading = false;
        this.init();
    }
    async loadData() {
        const result = await Aventus.Process.execute(this.defineRam().getListWithError()) ?? [];
        return result;
    }
    subscribe() {
        this.defineRam().onCreated(this.onCreated);
        this.defineRam().onUpdated(this.onUpdated);
        this.defineRam().onDeleted(this.onDeleted);
    }
    unsubscribe() {
        this.defineRam().offCreated(this.onCreated);
        this.defineRam().offUpdated(this.onUpdated);
        this.defineRam().offDeleted(this.onDeleted);
    }
    async onCreated(item) {
        this.data.push(item);
        let option = this.getOption();
        await option.setItem(item);
        this.appendChild(option);
        this.loadElementsFromSlot();
    }
    async onDeleted(item) {
        for (let i = 0; i < this.options.length; i++) {
            let option = this.options[i];
            let value = await this.optionValue(item);
            if (this.compare(option.value, value)) {
                this.options.splice(i, 1);
                option.remove();
                if (this.compare(this.value, value)) {
                    this.value = undefined;
                }
            }
        }
    }
    async onUpdated(item) {
        for (let i = 0; i < this.options.length; i++) {
            let option = this.options[i];
            if (this.compare(option.value, await this.optionValue(item))) {
                option.innerHTML = await this.optionText(item);
            }
        }
    }
    async init() {
        if (!this.isConnected)
            return;
        if (this.isInit)
            return;
        this.isInit = true;
        await this.createOptions();
        super.postCreation();
        this.subscribe();
    }
    postDestruction() {
        super.postDestruction();
        this.unsubscribe();
    }
    postConnect() {
    }
    postCreation() {
        this.init();
    }
}
SelectData.Namespace=`Inventaire`;
__as1(_, 'SelectData', SelectData);

const OptionData = class OptionData extends GenericOption {
    static __style = ``;
    __getStatic() {
        return OptionData;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(OptionData.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "OptionData";
    }
    getText() {
        return this.innerHTML;
    }
    async setItem(item) {
        let select = this.select;
        if (!item) {
            this.value = undefined;
            this.innerHTML = '';
        }
        else {
            this.value = await select.optionValue(item);
            this.innerHTML = await select.optionText(item);
        }
    }
}
OptionData.Namespace=`Inventaire`;
OptionData.Tag=`av-option-data`;
__as1(_, 'OptionData', OptionData);
if(!window.customElements.get('av-option-data')){window.customElements.define('av-option-data', OptionData);Aventus.WebComponentInstance.registerDefinition(OptionData);}

const Alert = class Alert extends Modal {
    static __style = `:host .content{line-break:anywhere}:host .footer{display:flex;justify-content:flex-end;margin-top:1rem}`;
    __getStatic() {
        return Alert;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Alert.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="content" _id="alert_0"></div><div class="footer">
    <av-button _id="alert_1"></av-button>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "alert_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__365421458088c2544dd3bfc22b56e4c8method0())}`,
      "once": true
    },
    "alert_1°@HTML": {
      "fct": (c) => `${c.print(c.comp.__365421458088c2544dd3bfc22b56e4c8method1())}`,
      "once": true
    }
  },
  "pressEvents": [
    {
      "id": "alert_1",
      "onPress": (e, pressInstance, c) => { c.comp.ok(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "Alert";
    }
    configure() {
        return {
            title: "I'm an alert",
            content: "lorem",
            btnTxt: "Ok",
            noClose: true
        };
    }
    ok() {
        this.resolve();
    }
    __365421458088c2544dd3bfc22b56e4c8method0() {
        return this.options.content;
    }
    __365421458088c2544dd3bfc22b56e4c8method1() {
        return this.options.btnTxt;
    }
    static async open(options) {
        const alert = new Alert();
        alert.options = { ...alert.options, ...options };
        return await Alert._show(alert);
    }
}
Alert.Namespace=`Inventaire`;
Alert.Tag=`av-alert`;
__as1(_, 'Alert', Alert);
if(!window.customElements.get('av-alert')){window.customElements.define('av-alert', Alert);Aventus.WebComponentInstance.registerDefinition(Alert);}

let Platform=class Platform {
    static onScreenChange = new Aventus.Callback();
    static init() {
        let currentDevice = this.device;
        let screenObserver = new Aventus.ResizeObserver(() => {
            let newDevice = this.device;
            if (currentDevice != newDevice) {
                currentDevice = newDevice;
                this.onScreenChange.trigger(newDevice);
            }
        });
        screenObserver.observe(document.body);
    }
    static onScreenChangeAndRun(cb) {
        this.onScreenChange.add(cb);
        cb(this.device);
    }
    static get device() {
        if (document.body.offsetWidth > 1224) {
            return "pc";
        }
        else if (document.body.offsetWidth > 768) {
            return "tablet";
        }
        return "mobile";
    }
    static get isStandalone() {
        if ("standalone" in window.navigator && window.navigator.standalone) {
            return true;
        }
        else if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }
        return false;
    }
    static get isiOS() {
        let test1 = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
        let test2 = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
        return test1 || test2;
    }
    static getRatio(element) {
        return element.offsetWidth + " / " + element.offsetHeight;
    }
}
Platform.Namespace=`Inventaire`;
__as1(_, 'Platform', Platform);

let PWA=class PWA {
    static get isAvailable() {
        if (window['deferredPrompt']) {
            return true;
        }
        return false;
    }
    static get isAvailableIOS() {
        return Platform.isiOS && !Platform.isStandalone;
    }
    static e;
    static isInit = false;
    static startInstall;
    static onInit = new Aventus.Callback();
    static onDownloading = new Aventus.Callback();
    static onDownloaded = new Aventus.Callback();
    static async init() {
        if (this.isInit) {
            return;
        }
        if (!this.e && PWA.isAvailable) {
            this.e = window['deferredPrompt'];
            let result = this.onInit.trigger();
            this.isInit = true;
        }
        else if (PWA.isAvailableIOS) {
            let result = this.onInit.trigger();
            this.isInit = true;
        }
        // if(Platform.isStandalone && Platform.device == "pc") {
        //     const notification = Notification.create({
        //     })
        //     Os.instance.notify(notification);
        if (this.isInit) {
            window.addEventListener('appinstalled', async (evt) => {
                let now = new Date();
                let start = this.startInstall ?? new Date();
                let diffMs = now.getTime() - start.getTime();
                if (diffMs < 3000) {
                    await Aventus.sleep(3000 - diffMs);
                }
                this.onDownloaded.trigger();
            });
        }
    }
    static addOnInit(cb) {
        if (this.isInit) {
            cb();
        }
        else {
            this.onInit.add(cb);
        }
    }
    static async download() {
        if (this.isAvailable && this.e) {
            this.e.prompt();
            const choiceResult = await this.e.userChoice;
            if (choiceResult.outcome === 'accepted') {
                this.startInstall = new Date();
                this.onDownloading.trigger();
            }
        }
        else if (this.isAvailableIOS) {
            let pwaios = new PwaPromptIos();
            document.body.appendChild(pwaios);
        }
    }
}
PWA.Namespace=`Inventaire`;
__as1(_, 'PWA', PWA);

const PwaPromptInstall = class PwaPromptInstall extends Modal {
    get 'installing'() {
						return this.__watch["installing"];
					}
					set 'installing'(val) {
						this.__watch["installing"] = val;
					}    __registerWatchesActions() {
    this.__addWatchesActions("installing");    super.__registerWatchesActions();
}
    static __style = `:host .title{font-size:var(--font-size-md);margin-bottom:16px}:host .footer{display:flex;justify-content:flex-end;margin-top:2rem;gap:.5rem}`;
    __getStatic() {
        return PwaPromptInstall;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(PwaPromptInstall.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="title" _id="pwapromptinstall_0"></div><div class="content">    <p>Ce site web est doté d'une fonctionnalité d'application. Ajoutez-le à votre écran d'accueil pour l'utiliser en        plein écran</p></div><div class="footer">    <av-button _id="pwapromptinstall_1">Annuler</av-button>    <av-button color="primary" _id="pwapromptinstall_2">Installer</av-button></div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "pwapromptinstall_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__e2ea24e42183334f5104d32b6a78e8ffmethod0())}`,
      "once": true
    },
    "pwapromptinstall_2°loading": {
      "fct": (c) => `${c.print(c.comp.__e2ea24e42183334f5104d32b6a78e8ffmethod1())}`,
      "once": true
    }
  },
  "pressEvents": [
    {
      "id": "pwapromptinstall_1",
      "onPress": (e, pressInstance, c) => { c.comp.cancel(e, pressInstance); }
    },
    {
      "id": "pwapromptinstall_2",
      "onPress": (e, pressInstance, c) => { c.comp.install(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "PwaPromptInstall";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["installing"] = false; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('installing'); }
    configure() {
        return {
            title: "Installation de l'application",
            closeWithEsc: false,
            closeWithClick: false
        };
    }
    cancel() {
        this.reject();
    }
    async install() {
        if (this.installing)
            return;
        this.installing = true;
        await PWA.download();
        this.resolve();
        this.installing = false;
    }
    __e2ea24e42183334f5104d32b6a78e8ffmethod0() {
        return this.options.title;
    }
    __e2ea24e42183334f5104d32b6a78e8ffmethod1() {
        return this.installing;
    }
}
PwaPromptInstall.Namespace=`Inventaire`;
PwaPromptInstall.Tag=`av-pwa-prompt-install`;
__as1(_, 'PwaPromptInstall', PwaPromptInstall);
if(!window.customElements.get('av-pwa-prompt-install')){window.customElements.define('av-pwa-prompt-install', PwaPromptInstall);Aventus.WebComponentInstance.registerDefinition(PwaPromptInstall);}

const Header = class Header extends Aventus.WebComponent {
    get 'open_menu'() { return this.getBoolAttr('open_menu') }
    set 'open_menu'(val) { this.setBoolAttr('open_menu', val) }    get 'hasInstall'() {
						return this.__watch["hasInstall"];
					}
					set 'hasInstall'(val) {
						this.__watch["hasInstall"] = val;
					}    __registerWatchesActions() {
    this.__addWatchesActions("hasInstall");    super.__registerWatchesActions();
}
    static __style = `:host{align-items:center;background-color:var(--color-base-100);box-shadow:var(--elevation-3);display:flex;flex-shrink:0;height:50px;justify-content:center;position:relative;width:100%;z-index:2}:host .content{align-items:center;color:var(--color-base-content);display:flex;height:100%;justify-content:space-between;max-width:1200px;padding:0 32px;width:100%}:host .content .logo,:host .content .logo-menu{font-size:var(--font-size-md)}:host .content .logo-menu{display:none;padding:20px 0}:host .content .logo-icon{display:none;height:100%;padding:10px 0}:host .content .logo-icon img{height:100%}:host .content .menu-icon{align-items:center;display:none}:host .content .menu-hidden{display:none;height:100vh;inset:0;position:absolute}:host .content .menu{align-items:center;display:flex;height:100%}:host .content .menu .item{align-items:center;cursor:pointer;display:flex;height:100%;padding:0 16px;transition-duration:var(--transition-duration);transition-property:background-color,color;transition-timing-function:var(--bezier)}:host .content .menu .item mi-icon{font-size:20px}:host .content .menu .item:hover,:host .content .menu .item.active{background-color:var(--color-neutral);color:var(--color-neutral-content)}:host .content .menu .item.install{display:none}@media screen and (max-width: 700px){:host .content .logo{display:none}:host .content .logo-icon{display:block}:host .content .menu-icon{display:flex}:host .content .menu{background-color:var(--color-base-100);box-shadow:var(--elevation-3);flex-direction:column;height:100vh;position:absolute;right:-320px;top:0;transition:right .2s ease-in-out;width:300px;z-index:1}:host .content .menu .logo-menu{display:block}:host .content .menu .item{height:fit-content;padding:8px 16px;width:100%}:host .content .menu .logout{justify-content:center;margin-top:10px}:host .content .menu .item.install{display:flex}:host([open_menu]) .menu{right:0}:host([open_menu]) .menu-hidden{display:block;z-index:1}}`;
    __getStatic() {
        return Header;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Header.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="content">
    <div class="logo">Inventaire FC Vétroz</div>
    <div class="logo-icon">
        <img src="/img/logo.png" alt="" />
    </div>
    <div class="menu-icon">
        <mi-icon icon="menu" _id="header_0"></mi-icon>
    </div>
    <div class="menu-hidden" _id="header_1"></div>
    <div class="menu">
        <div class="logo-menu">Inventaire FC Vétroz</div>
        <av-link class="item" to="/" active_pattern="/equipes/*|/" _id="header_2">Equipe</av-link>
        <av-link class="item" to="/materiel" active_pattern="/materiel*" _id="header_3">Matériel</av-link>
        <av-link class="item" to="/utilisateurs" _id="header_4">Utilisateur</av-link>
        <template _id="header_5"></template>
        <div class="item logout">
            <mi-icon icon="power_settings_new" _id="header_7"></mi-icon>
        </div>
    </div>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "events": [
    {
      "eventName": "click",
      "id": "header_2",
      "fct": (e, c) => c.comp.closeMenu(e)
    },
    {
      "eventName": "click",
      "id": "header_3",
      "fct": (e, c) => c.comp.closeMenu(e)
    },
    {
      "eventName": "click",
      "id": "header_4",
      "fct": (e, c) => c.comp.closeMenu(e)
    }
  ],
  "pressEvents": [
    {
      "id": "header_0",
      "onPress": (e, pressInstance, c) => { c.comp.openMenu(e, pressInstance); }
    },
    {
      "id": "header_1",
      "onPress": (e, pressInstance, c) => { c.comp.closeMenu(e, pressInstance); }
    },
    {
      "id": "header_7",
      "onPress": (e, pressInstance, c) => { c.comp.logout(e, pressInstance); }
    }
  ]
});const templ0 = new Aventus.Template(this);templ0.setTemplate(`
            <div class="item install" _id="header_6">Installer l'application</div>
        `);templ0.setActions({
  "pressEvents": [
    {
      "id": "header_6",
      "onPress": (e, pressInstance, c) => { c.comp.installApp(e, pressInstance); }
    }
  ]
});this.__getStatic().__template.addIf({
                    anchorId: 'header_5',
                    parts: [{once: true,
                    condition: (c) => c.comp.__8a18ff9f2f6d8c68ca20d6555a280111method0(),
                    template: templ0
                }]
            }); }
    getClassName() {
        return "Header";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('open_menu')) { this.attributeChangedCallback('open_menu', false, false); } }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["hasInstall"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('open_menu');this.__correctGetter('hasInstall'); }
    __listBoolProps() { return ["open_menu"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    openMenu() {
        this.open_menu = true;
    }
    closeMenu() {
        this.open_menu = false;
    }
    async logout() {
        await Aventus.Process.execute(new App.Http.Controllers.Auth.Logout.AuthLogoutController().request());
        location.reload();
    }
    async installApp() {
        PWA.onDownloaded.add(async () => {
            this.hasInstall = false;
        });
        await PWA.download();
    }
    postCreation() {
        super.postCreation();
        PWA.addOnInit(async () => {
            this.hasInstall = Platform.device != 'pc';
        });
    }
    __8a18ff9f2f6d8c68ca20d6555a280111method0() {
        return this.hasInstall;
    }
}
Header.Namespace=`Inventaire`;
Header.Tag=`av-header`;
__as1(_, 'Header', Header);
if(!window.customElements.get('av-header')){window.customElements.define('av-header', Header);Aventus.WebComponentInstance.registerDefinition(Header);}

App.Http.Controllers.Auth.Login.AuthLoginController=class AuthLoginController extends Aventus.HttpRoute {
    constructor(router) {
        super(router);
        this.request = this.request.bind(this);
    }
    async request(body) {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/login`, Aventus.HttpMethod.POST);
        request.setBody(body);
        return await request.queryJSON(this.router);
    }
}
App.Http.Controllers.Auth.Login.AuthLoginController.Namespace=`Inventaire.App.Http.Controllers.Auth.Login`;
__as1(_.App.Http.Controllers.Auth.Login, 'AuthLoginController', App.Http.Controllers.Auth.Login.AuthLoginController);

const LoginPage = class LoginPage extends Aventus.Navigation.PageFormRoute {
    get 'error'() {
						return this.__watch["error"];
					}
					set 'error'(val) {
						this.__watch["error"] = val;
					}    __registerWatchesActions() {
    this.__addWatchesActions("error");    super.__registerWatchesActions();
}
    static __style = `:host{align-items:center;display:flex;height:100%;justify-content:center;width:100%}:host .card{background-color:var(--color-base-100);border-radius:var(--radius-box);box-shadow:var(--elevation-3);display:flex;justify-content:stretch;max-width:700px;overflow:hidden;width:calc(100% - 40px)}:host .card .img{background-image:url("/img/background-foot.jpg");background-position:center center;background-size:cover;flex-shrink:0;width:300px}:host .card .content{padding:24px}:host .card .title{font-size:var(--font-size-lg);margin-bottom:24px}:host .card av-input{margin-bottom:12px}:host .card .right{display:flex;justify-content:flex-end;margin-top:8px}:host .card .form-error{color:var(--color-danger);font-size:.875rem;color:var(--color-error)}:host(:not([visible])){display:flex}@media screen and (max-width: 800px){:host .card{flex-direction:column;max-width:500px}:host .card .img{height:200px;width:100%}}`;
    __getStatic() {
        return LoginPage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(LoginPage.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="card">
    <div class="img"></div>
    <div class="content">
        <div class="title">Inventaire FC Vétroz</div>
        <av-input label="Nom d'utilisateur" name="username" _id="loginpage_0"></av-input>
        <av-input label="Mot de passe" name="password" type="password" _id="loginpage_1"></av-input>
        <template _id="loginpage_2"></template>
        <div class="right">
            <av-button type="submit" color="neutral">Login</av-button>
        </div>
    </div>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "injection": [
    {
      "id": "loginpage_0",
      "injectionName": "form",
      "inject": (c) => c.comp.__32893ce09ff9e4944d5fa5903c489fc0method1(),
      "once": true
    },
    {
      "id": "loginpage_1",
      "injectionName": "form",
      "inject": (c) => c.comp.__32893ce09ff9e4944d5fa5903c489fc0method2(),
      "once": true
    }
  ],
  "events": [
    {
      "eventName": "focus",
      "id": "loginpage_0",
      "fct": (e, c) => c.comp.clearError(e)
    },
    {
      "eventName": "focus",
      "id": "loginpage_1",
      "fct": (e, c) => c.comp.clearError(e)
    }
  ]
});const templ0 = new Aventus.Template(this);templ0.setTemplate(`
            <div class="form-error">
                <div _id="loginpage_3"></div>
            </div>
        `);templ0.setActions({
  "content": {
    "loginpage_3°@HTML": {
      "fct": (c) => `${c.print(c.comp.__32893ce09ff9e4944d5fa5903c489fc0method3())}`,
      "once": true
    }
  }
});this.__getStatic().__template.addIf({
                    anchorId: 'loginpage_2',
                    parts: [{once: true,
                    condition: (c) => c.comp.__32893ce09ff9e4944d5fa5903c489fc0method0(),
                    template: templ0
                }]
            }); }
    getClassName() {
        return "LoginPage";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["error"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('error'); }
    route() {
        return App.Http.Controllers.Auth.Login.AuthLoginController;
    }
    onResult(result) {
        if (result?.result) {
            window.location.href = "/";
        }
    }
    formSchema() {
        return {
            nom_utilisateur: new Aventus.Form.Validators.Required("Le nom d'utilisateur est requis"),
            mot_passe: new Aventus.Form.Validators.Required("Le mot de passe est requis"),
        };
    }
    configure() {
        return {};
    }
    formConfig() {
        return {
            handleExecuteNoInputError: (errors) => {
                if (errors.some(p => p.code == 422)) {
                    this.error = "Informations non valides";
                }
                else {
                    let msg = errors.map(p => p.message.replace(/\n/g, '<br/>')).join("<br/>");
                    Alert.open({
                        title: "Erreur",
                        content: msg,
                    });
                }
            }
        };
    }
    clearError() {
        this.error = undefined;
    }
    __32893ce09ff9e4944d5fa5903c489fc0method3() {
        return this.error;
    }
    __32893ce09ff9e4944d5fa5903c489fc0method0() {
        return this.error;
    }
    __32893ce09ff9e4944d5fa5903c489fc0method1() {
        return this.form.parts.nom_utilisateur;
    }
    __32893ce09ff9e4944d5fa5903c489fc0method2() {
        return this.form.parts.mot_passe;
    }
}
LoginPage.Namespace=`Inventaire`;
LoginPage.Tag=`av-login-page`;
__as1(_, 'LoginPage', LoginPage);
if(!window.customElements.get('av-login-page')){window.customElements.define('av-login-page', LoginPage);Aventus.WebComponentInstance.registerDefinition(LoginPage);}

App.Http.Controllers.Equipe.EquipeController=class EquipeController extends AventusPhp.ModelController {
    getRequest() { return _.App.Http.Controllers.Equipe.EquipeRequest; }
    getResource() { return _.App.Http.Controllers.Equipe.EquipeResource; }
    getUri() { return "data/equipe"; }
}
App.Http.Controllers.Equipe.EquipeController.Namespace=`Inventaire.App.Http.Controllers.Equipe`;
__as1(_.App.Http.Controllers.Equipe, 'EquipeController', App.Http.Controllers.Equipe.EquipeController);

let EquipeRAM=class EquipeRAM extends AventusPhp.RamHttp {
    /**
     * @inheritdoc
     */
    defineRoutes() {
        return new App.Http.Controllers.Equipe.EquipeController();
    }
    /**
     * Create a singleton to store data
     */
    static getInstance() {
        return Aventus.Instance.get(EquipeRAM);
    }
    /**
     * @inheritdoc
     */
    defineIndexKey() {
        return 'id';
    }
}
EquipeRAM.Namespace=`Inventaire`;
__as1(_, 'EquipeRAM', EquipeRAM);

const EquipeTag = class EquipeTag extends Aventus.WebComponent {
    get 'equipe_id'() {
						return this.__watch["equipe_id"];
					}
					set 'equipe_id'(val) {
						this.__watch["equipe_id"] = val;
					}get 'equipe'() {
						return this.__watch["equipe"];
					}
					set 'equipe'(val) {
						this.__watch["equipe"] = val;
					}    onDelete = new Aventus.Callback();
    __registerWatchesActions() {
    this.__addWatchesActions("equipe_id", ((target) => {
    target.loadData();
}));this.__addWatchesActions("equipe");    super.__registerWatchesActions();
}
    static __style = `:host av-tag{padding-left:12px}:host av-tag span{display:block;height:100%;min-width:5px}:host av-tag mi-icon{color:var(--color-error);cursor:pointer;font-size:16px;margin-left:6px}`;
    __getStatic() {
        return EquipeTag;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(EquipeTag.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<av-tag color="accent">
    <span _id="equipetag_0"></span>
    <mi-icon icon="delete" _id="equipetag_1"></mi-icon>
</av-tag>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "equipetag_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__6e6550e7a452d01b39466da4997f8b4dmethod0())}`,
      "once": true
    }
  },
  "pressEvents": [
    {
      "id": "equipetag_1",
      "onPress": (e, pressInstance, c) => { c.comp.triggerDelete(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "EquipeTag";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["equipe_id"] = undefined;w["equipe"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('equipe_id');this.__correctGetter('equipe'); }
    async triggerDelete() {
        const result = await Confirm.open({
            title: "Êtes-vous sûr de vouloir supprimer l'équipe " + this.equipe.nom + "?"
        });
        if (result) {
            this.onDelete.trigger(this);
        }
    }
    async loadData() {
        const r = await EquipeRAM.getInstance().getById(this.equipe_id);
        if (r) {
            this.equipe = r;
        }
    }
    postCreation() {
        super.postCreation();
    }
    __6e6550e7a452d01b39466da4997f8b4dmethod0() {
        return this.equipe.nom;
    }
}
EquipeTag.Namespace=`Inventaire`;
EquipeTag.Tag=`av-equipe-tag`;
__as1(_, 'EquipeTag', EquipeTag);
if(!window.customElements.get('av-equipe-tag')){window.customElements.define('av-equipe-tag', EquipeTag);Aventus.WebComponentInstance.registerDefinition(EquipeTag);}

const EquipeSelect = class EquipeSelect extends SelectData {
    static __style = ``;
    __getStatic() {
        return EquipeSelect;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(EquipeSelect.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        slots: { 'default':`<slot></slot>` }, 
        blocks: { 'default':`<slot></slot>` }
    });
}
    getClassName() {
        return "EquipeSelect";
    }
    defineRam() {
        return EquipeRAM.getInstance();
    }
    optionText(item) {
        return item.nom;
    }
    optionValue(item) {
        return item;
    }
}
EquipeSelect.Namespace=`Inventaire`;
EquipeSelect.Tag=`av-equipe-select`;
__as1(_, 'EquipeSelect', EquipeSelect);
if(!window.customElements.get('av-equipe-select')){window.customElements.define('av-equipe-select', EquipeSelect);Aventus.WebComponentInstance.registerDefinition(EquipeSelect);}

const ModalEquipe = class ModalEquipe extends Modal {
    get 'equipe'() {
						return this.__watch["equipe"];
					}
					set 'equipe'(val) {
						this.__watch["equipe"] = val;
					}    __registerWatchesActions() {
    this.__addWatchesActions("equipe");    super.__registerWatchesActions();
}
    static __style = `:host .title{font-size:var(--font-size-md);margin-bottom:16px}:host .footer{display:flex;justify-content:flex-end;margin-top:2rem;gap:.5rem}`;
    __getStatic() {
        return ModalEquipe;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(ModalEquipe.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="title" _id="modalequipe_0"></div><div class="content">
    <av-equipe-select label="Choix de l'équipe" searchable _id="modalequipe_1"></av-equipe-select>
</div><div class="footer">
    <av-button _id="modalequipe_2">Annuler</av-button>
    <av-button color="primary" _id="modalequipe_3">Enregistrer</av-button>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "inputEl",
      "ids": [
        "modalequipe_1"
      ]
    }
  ],
  "content": {
    "modalequipe_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__392051980c1cd9dd7440f855fabdee56method0())}`,
      "once": true
    }
  },
  "bindings": [
    {
      "id": "modalequipe_1",
      "injectionName": "value",
      "eventNames": [
        "onChange"
      ],
      "inject": (c) => c.comp.__392051980c1cd9dd7440f855fabdee56method1(),
      "extract": (c, v) => c.comp.__392051980c1cd9dd7440f855fabdee56method2(v),
      "once": true,
      "isCallback": true
    }
  ],
  "pressEvents": [
    {
      "id": "modalequipe_2",
      "onPress": (e, pressInstance, c) => { c.comp.reject(e, pressInstance); }
    },
    {
      "id": "modalequipe_3",
      "onPress": (e, pressInstance, c) => { c.comp.save(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "ModalEquipe";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["equipe"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('equipe'); }
    configure() {
        return {
            title: "Ajout d'une équipe",
        };
    }
    save() {
        if (!this.equipe) {
            this.inputEl.errors = ["Il faut choisir une équipe"];
            return;
        }
        this.resolve(this.equipe);
    }
    __392051980c1cd9dd7440f855fabdee56method0() {
        return this.options.title;
    }
    __392051980c1cd9dd7440f855fabdee56method1() {
        return this.equipe;
    }
    __392051980c1cd9dd7440f855fabdee56method2(v) {
        if (this) {
            this.equipe = v;
        }
    }
}
ModalEquipe.Namespace=`Inventaire`;
ModalEquipe.Tag=`av-modal-equipe`;
__as1(_, 'ModalEquipe', ModalEquipe);
if(!window.customElements.get('av-modal-equipe')){window.customElements.define('av-modal-equipe', ModalEquipe);Aventus.WebComponentInstance.registerDefinition(ModalEquipe);}

App.Http.Controllers.Materiel.MaterielResource=class MaterielResource extends Aventus.Data {
    static get Fullname() { return "App.Http.Controllers.Materiel.MaterielResource"; }
    variations;
    equipes;
    id;
    nom;
    image = new _.App.Models.MaterielImage();
    tout_monde;
}
App.Http.Controllers.Materiel.MaterielResource.Namespace=`Inventaire.App.Http.Controllers.Materiel`;
App.Http.Controllers.Materiel.MaterielResource.$schema={...(Aventus.Data?.$schema ?? {}), "variations":"Inventaire.App.Models.Variation[]","equipes":"Inventaire.App.Http.Controllers.Materiel.MaterielEquipeResource[]","id":"number","nom":"string","image":"Inventaire.App.Models.MaterielImage","tout_monde":"boolean"};
Aventus.Converter.register(App.Http.Controllers.Materiel.MaterielResource.Fullname, App.Http.Controllers.Materiel.MaterielResource);
__as1(_.App.Http.Controllers.Materiel, 'MaterielResource', App.Http.Controllers.Materiel.MaterielResource);

const MaterielCard = class MaterielCard extends Aventus.WebComponent {
    get 'visible'() { return this.getBoolAttr('visible') }
    set 'visible'(val) { this.setBoolAttr('visible', val) }    get 'equipes'() {
						return this.__watch["equipes"];
					}
					set 'equipes'(val) {
						this.__watch["equipes"] = val;
					}    get 'item'() {
						return this.__signals["item"].value;
					}
					set 'item'(val) {
						this.__signals["item"].value = val;
					}    __registerWatchesActions() {
    this.__addWatchesActions("equipes");    super.__registerWatchesActions();
}
    __registerSignalsActions() { this.__signals["item"] = null; super.__registerSignalsActions(); this.__addSignalActions("item", ((target) => {
    target.loadEquipes();
})); }
    static __style = `:host{display:contents}:host av-col{background-color:var(--color-base-100);border:1px solid var(--color-base-300);border-radius:var(--radius-box);box-shadow:var(--elevation-2);display:flex;flex-direction:column;justify-content:stretch;overflow:hidden}:host av-col .img{max-height:250px;width:100%;flex-shrink:0}:host av-col .img av-img{aspect-ratio:1;max-height:250px;width:100%}:host av-col .info{background-color:rgba(0,0,0,0);display:flex;flex-direction:column;flex-grow:1;padding:16px;padding-top:0}:host av-col .info .title{flex-shrink:0;font-size:var(--font-size-md);margin-top:8px}:host av-col .info .variations{display:flex;flex-grow:1;gap:6px;margin-bottom:12px;margin-top:12px}:host av-col .info .variations .tag{align-items:center;background-color:var(--color-tag);border-radius:50px;display:flex;font-size:var(--font-size-sm);justify-content:center;padding:4px 8px}:host av-col .info .visible{align-items:center;display:flex;flex-shrink:0;min-height:30px;flex-wrap:wrap}:host av-col .info .visible .visible-label{width:100%}:host av-col .info .visible .everybody{display:flex;font-size:var(--font-size-sm);gap:6px;margin-left:6px;margin-top:3px}:host av-col .info .visible .visible-for{display:flex;font-size:var(--font-size-sm);gap:6px;margin-left:6px;margin-top:6px}:host av-col .info .visible .visible-for div{align-items:center;background-color:var(--color-tag);border-radius:50px;display:flex;font-size:var(--font-size-sm);justify-content:center;padding:4px 8px}:host(:hover){box-shadow:var(--elevation-2)}:host(:not([visible])){display:none}`;
    __getStatic() {
        return MaterielCard;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(MaterielCard.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<av-col size="12" size_sm="4" size_md="3">
    <av-link _id="materielcard_0">
        <div class="img">
            <av-img mode="cover" _id="materielcard_1"></av-img>
        </div>
        <div class="info">
            <div class="title" _id="materielcard_2"></div>
            <div class="variations">
                <template _id="materielcard_3"></template>
            </div>
            <div class="visible">
                <div class="visible-label">Visible pour :</div>
                <template _id="materielcard_5"></template>
            </div>
        </div>
    </av-link>
</av-col>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "materielcard_0°to": {
      "fct": (c) => `/materiel/${c.print(c.comp.__98d262679bf6afafa524060227ae1154method3())}`,
      "once": true
    },
    "materielcard_1°src": {
      "fct": (c) => `${c.print(c.comp.__98d262679bf6afafa524060227ae1154method4())}`,
      "once": true
    },
    "materielcard_2°@HTML": {
      "fct": (c) => `${c.print(c.comp.__98d262679bf6afafa524060227ae1154method5())}`,
      "once": true
    }
  }
});const templ0 = new Aventus.Template(this);templ0.setTemplate(` 
                    <av-tag color="accent" _id="materielcard_4"></av-tag>
                `);templ0.setActions({
  "content": {
    "materielcard_4°@HTML": {
      "fct": (c) => `${c.print(c.comp.__98d262679bf6afafa524060227ae1154method6(c.data.variation))}`,
      "once": true
    }
  }
});this.__getStatic().__template.addLoop({
                    anchorId: 'materielcard_3',
                    template: templ0,
                simple:{data: "this.item.variations",item:"variation"}});const templ1 = new Aventus.Template(this);templ1.setTemplate(`
                    <div class="everybody">Tout le monde</div>
                `);const templ2 = new Aventus.Template(this);templ2.setTemplate(`
                    <div class="visible-for">
                        <template _id="materielcard_6"></template>
                    </div>
                `);const templ3 = new Aventus.Template(this);templ3.setTemplate(` 
                            <av-tag color="accent" _id="materielcard_7"></av-tag>
                        `);templ3.setActions({
  "content": {
    "materielcard_7°@HTML": {
      "fct": (c) => `${c.print(c.comp.__98d262679bf6afafa524060227ae1154method7(c.data.equipe))}`,
      "once": true
    }
  }
});templ2.addLoop({
                    anchorId: 'materielcard_6',
                    template: templ3,
                simple:{data: "this.equipes",item:"equipe"}});this.__getStatic().__template.addIf({
                    anchorId: 'materielcard_5',
                    parts: [{once: true,
                    condition: (c) => c.comp.__98d262679bf6afafa524060227ae1154method1(),
                    template: templ1
                },{once: true,
                    condition: (c) => true,
                    template: templ2
                }]
            }); }
    getClassName() {
        return "MaterielCard";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('visible')) { this.attributeChangedCallback('visible', false, false); } }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["equipes"] = []; }
    __defaultValuesSignal(s) { super.__defaultValuesSignal(s); s["item"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('visible');this.__correctGetter('item');this.__correctGetter('equipes'); }
    __listBoolProps() { return ["visible"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    async loadEquipes() {
        const equipeIds = this.item.equipes.map(p => p.id_equipe);
        this.equipes = (await EquipeRAM.getInstance().getByIds(equipeIds));
    }
    getSrc() {
        if (this.item.image?.uri) {
            return this.item.image?.uri;
        }
        return "/img/default_img.svg";
    }
    __98d262679bf6afafa524060227ae1154method3() {
        return this.item.id;
    }
    __98d262679bf6afafa524060227ae1154method4() {
        return this.getSrc();
    }
    __98d262679bf6afafa524060227ae1154method5() {
        return this.item.nom;
    }
    __98d262679bf6afafa524060227ae1154method6(variation) {
        return variation.nom;
    }
    __98d262679bf6afafa524060227ae1154method7(equipe) {
        return equipe.nom;
    }
    __98d262679bf6afafa524060227ae1154method1() {
        return this.item.tout_monde;
    }
}
MaterielCard.Namespace=`Inventaire`;
MaterielCard.Tag=`av-materiel-card`;
__as1(_, 'MaterielCard', MaterielCard);
if(!window.customElements.get('av-materiel-card')){window.customElements.define('av-materiel-card', MaterielCard);Aventus.WebComponentInstance.registerDefinition(MaterielCard);}

const ModalInventaireUpdate = class ModalInventaireUpdate extends Modal {
    get 'materiel'() {
						return this.__signals["materiel"].value;
					}
					set 'materiel'(val) {
						this.__signals["materiel"].value = val;
					}get 'variation'() {
						return this.__signals["variation"].value;
					}
					set 'variation'(val) {
						this.__signals["variation"].value = val;
					}get 'equipe'() {
						return this.__signals["equipe"].value;
					}
					set 'equipe'(val) {
						this.__signals["equipe"].value = val;
					}get 'nb'() {
						return this.__signals["nb"].value;
					}
					set 'nb'(val) {
						this.__signals["nb"].value = val;
					}    __registerSignalsActions() { this.__signals["materiel"] = null;this.__signals["variation"] = null;this.__signals["equipe"] = null;this.__signals["nb"] = null; super.__registerSignalsActions();  }
    static __style = `:host .title{font-size:var(--font-size-md);margin-bottom:16px}:host .footer{display:flex;justify-content:flex-end;margin-top:2rem;gap:.5rem}`;
    __getStatic() {
        return ModalInventaireUpdate;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(ModalInventaireUpdate.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="title" _id="modalinventaireupdate_0"></div><av-input type="number" label="Quantité" _id="modalinventaireupdate_1"></av-input><div class="footer">    <av-button _id="modalinventaireupdate_2">Annuler</av-button>    <av-button color="primary" _id="modalinventaireupdate_3">Enregistrer</av-button></div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "inputEl",
      "ids": [
        "modalinventaireupdate_1"
      ]
    }
  ],
  "content": {
    "modalinventaireupdate_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__b1342dd6d9991aa98e016ec58cde09f1method0())}`,
      "once": true
    }
  },
  "bindings": [
    {
      "id": "modalinventaireupdate_1",
      "injectionName": "value",
      "eventNames": [
        "onChange"
      ],
      "inject": (c) => c.comp.__b1342dd6d9991aa98e016ec58cde09f1method1(),
      "extract": (c, v) => c.comp.__b1342dd6d9991aa98e016ec58cde09f1method2(v),
      "once": true,
      "isCallback": true
    }
  ],
  "events": [
    {
      "eventName": "focus",
      "id": "modalinventaireupdate_1",
      "fct": (e, c) => c.comp.select(e)
    }
  ],
  "pressEvents": [
    {
      "id": "modalinventaireupdate_2",
      "onPress": (e, pressInstance, c) => { c.comp.reject(e, pressInstance); }
    },
    {
      "id": "modalinventaireupdate_3",
      "onPress": (e, pressInstance, c) => { c.comp.save(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "ModalInventaireUpdate";
    }
    __defaultValuesSignal(s) { super.__defaultValuesSignal(s); s["materiel"] = undefined;s["variation"] = undefined;s["equipe"] = undefined;s["nb"] = 0; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('materiel');this.__correctGetter('variation');this.__correctGetter('equipe');this.__correctGetter('nb'); }
    configure() {
        return {
            title: "Mise à jour de l'inventaire"
        };
    }
    save() {
        if (typeof this.nb == 'number') {
            this.resolve(this.nb);
        }
        else {
            const nbTxt = this.nb;
            if (nbTxt.trim() == '') {
                this.inputEl.errors = ["Merci de saisir un nombre"];
                return;
            }
            const nb2 = Number(nbTxt);
            if (isNaN(nb2)) {
                this.inputEl.errors = ["Merci de saisir un nombre"];
                return;
            }
            this.resolve(nb2);
        }
    }
    select() {
        this.inputEl.select();
    }
    getTitle() {
        return `Mise à jour de ${this.materiel.nom} ${this.variation?.nom} pour ${this.equipe.nom}`;
    }
    postCreation() {
        super.postCreation();
    }
    __b1342dd6d9991aa98e016ec58cde09f1method0() {
        return this.getTitle();
    }
    __b1342dd6d9991aa98e016ec58cde09f1method1() {
        return this.nb;
    }
    __b1342dd6d9991aa98e016ec58cde09f1method2(v) {
        if (this) {
            this.nb = v;
        }
    }
}
ModalInventaireUpdate.Namespace=`Inventaire`;
ModalInventaireUpdate.Tag=`av-modal-inventaire-update`;
__as1(_, 'ModalInventaireUpdate', ModalInventaireUpdate);
if(!window.customElements.get('av-modal-inventaire-update')){window.customElements.define('av-modal-inventaire-update', ModalInventaireUpdate);Aventus.WebComponentInstance.registerDefinition(ModalInventaireUpdate);}

App.Http.Controllers.Equipe.GetInventaire.Response=class Response extends Aventus.Data {
    static get Fullname() { return "App.Http.Controllers.Equipe.GetInventaire.Response"; }
    id;
    materiel;
    variation = undefined;
    quantite;
    last_update;
    last_update_by;
}
App.Http.Controllers.Equipe.GetInventaire.Response.Namespace=`Inventaire.App.Http.Controllers.Equipe.GetInventaire`;
App.Http.Controllers.Equipe.GetInventaire.Response.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","materiel":"Inventaire.App.Http.Controllers.Materiel.MaterielResource","variation":"Inventaire.App.Models.Variation","quantite":"number","last_update":"Date","last_update_by":"string"};
Aventus.Converter.register(App.Http.Controllers.Equipe.GetInventaire.Response.Fullname, App.Http.Controllers.Equipe.GetInventaire.Response);
__as1(_.App.Http.Controllers.Equipe.GetInventaire, 'Response', App.Http.Controllers.Equipe.GetInventaire.Response);

App.Http.Controllers.Equipe.GetInventaire.EquipeGetInventaireController=class EquipeGetInventaireController extends Aventus.HttpRoute {
    constructor(router) {
        super(router);
        this.request = this.request.bind(this);
    }
    async request(body) {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/data/equipe/inventaire`, Aventus.HttpMethod.POST);
        request.setBody(body);
        return await request.queryJSON(this.router);
    }
}
App.Http.Controllers.Equipe.GetInventaire.EquipeGetInventaireController.Namespace=`Inventaire.App.Http.Controllers.Equipe.GetInventaire`;
__as1(_.App.Http.Controllers.Equipe.GetInventaire, 'EquipeGetInventaireController', App.Http.Controllers.Equipe.GetInventaire.EquipeGetInventaireController);

App.Http.Controllers.Equipe.Materiel.EquipeMaterielController=class EquipeMaterielController extends Aventus.HttpRoute {
    constructor(router) {
        super(router);
        this.request = this.request.bind(this);
    }
    async request(body) {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/data/equipe/materiel`, Aventus.HttpMethod.POST);
        request.setBody(body);
        return await request.queryJSON(this.router);
    }
}
App.Http.Controllers.Equipe.Materiel.EquipeMaterielController.Namespace=`Inventaire.App.Http.Controllers.Equipe.Materiel`;
__as1(_.App.Http.Controllers.Equipe.Materiel, 'EquipeMaterielController', App.Http.Controllers.Equipe.Materiel.EquipeMaterielController);

App.Http.Controllers.Inventaire.Historique.Response=class Response extends Aventus.Data {
    static get Fullname() { return "App.Http.Controllers.Inventaire.Historique.Response"; }
    historique;
}
App.Http.Controllers.Inventaire.Historique.Response.Namespace=`Inventaire.App.Http.Controllers.Inventaire.Historique`;
App.Http.Controllers.Inventaire.Historique.Response.$schema={...(Aventus.Data?.$schema ?? {}), "historique":"Inventaire.App.Models.InventaireHistorique[]"};
Aventus.Converter.register(App.Http.Controllers.Inventaire.Historique.Response.Fullname, App.Http.Controllers.Inventaire.Historique.Response);
__as1(_.App.Http.Controllers.Inventaire.Historique, 'Response', App.Http.Controllers.Inventaire.Historique.Response);

App.Http.Controllers.Inventaire.Historique.InventaireHistoriqueController=class InventaireHistoriqueController extends Aventus.HttpRoute {
    constructor(router) {
        super(router);
        this.request = this.request.bind(this);
    }
    async request(body) {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/data/inventaire/historique`, Aventus.HttpMethod.POST);
        request.setBody(body);
        return await request.queryJSON(this.router);
    }
}
App.Http.Controllers.Inventaire.Historique.InventaireHistoriqueController.Namespace=`Inventaire.App.Http.Controllers.Inventaire.Historique`;
__as1(_.App.Http.Controllers.Inventaire.Historique, 'InventaireHistoriqueController', App.Http.Controllers.Inventaire.Historique.InventaireHistoriqueController);

const ModalHistorique = class ModalHistorique extends Modal {
    get 'historiques'() {
						return this.__watch["historiques"];
					}
					set 'historiques'(val) {
						this.__watch["historiques"] = val;
					}    get 'materiel'() {
						return this.__signals["materiel"].value;
					}
					set 'materiel'(val) {
						this.__signals["materiel"].value = val;
					}get 'equipe'() {
						return this.__signals["equipe"].value;
					}
					set 'equipe'(val) {
						this.__signals["equipe"].value = val;
					}get 'variation'() {
						return this.__signals["variation"].value;
					}
					set 'variation'(val) {
						this.__signals["variation"].value = val;
					}    isLoading = false;
    page = 0;
    canLoadMore = true;
    __registerWatchesActions() {
    this.__addWatchesActions("historiques");    super.__registerWatchesActions();
}
    __registerSignalsActions() { this.__signals["materiel"] = null;this.__signals["equipe"] = null;this.__signals["variation"] = null; super.__registerSignalsActions();  }
    static __style = `:host .modal{display:flex;flex-direction:column;max-height:calc(100% - 40px);max-width:min(100% - 40px,700px);min-height:0;overflow:hidden}:host .title{flex-shrink:0;font-size:var(--font-size-md);margin-bottom:16px}:host .content{border:1px solid var(--color-base-300);border-radius:var(--radius-field);display:flex;flex-direction:column;flex-grow:1;min-height:0;width:100%}:host .content .line{border-top:1px solid var(--color-base-300);display:flex;gap:20px;padding:8px 16px}:host .content .line .quantite{flex-shrink:0;width:75px}:host .content .line .par{flex-grow:1}:host .content .line .modification{flex-shrink:0;width:200px}:host .content .key{display:none;width:120px}:host .content .value{display:inline-block}:host .content .line:first-child{border-top:none}:host .footer{display:flex;flex-shrink:0;gap:.5rem;justify-content:flex-end;margin-top:1rem}@media screen and (max-width: 600px){:host .content .line{flex-direction:column;gap:10px}:host .content .line .quantite,:host .content .line .par,:host .content .line .modification{width:100%;display:flex}:host .content .line .quantite .key,:host .content .line .par .key,:host .content .line .modification .key{display:inline-block;flex-shrink:0}}`;
    __getStatic() {
        return ModalHistorique;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(ModalHistorique.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="title" _id="modalhistorique_0"></div><div class="content">    <av-flex-scroll floating_scroll _id="modalhistorique_1">        <template _id="modalhistorique_2"></template>    </av-flex-scroll></div><div class="footer">    <av-button _id="modalhistorique_6">Fermer</av-button></div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "scrollEl",
      "ids": [
        "modalhistorique_1"
      ]
    }
  ],
  "content": {
    "modalhistorique_0°@HTML": {
      "fct": (c) => `Historique pour ${c.print(c.comp.__96088c3823f02341204bbb7914b84118method1())} ${c.print(c.comp.__96088c3823f02341204bbb7914b84118method2())} pour ${c.print(c.comp.__96088c3823f02341204bbb7914b84118method3())}`
    }
  },
  "events": [
    {
      "eventName": "onScrollChange",
      "id": "modalhistorique_1",
      "fct": (c, ...args) => c.comp.loadData.apply(c.comp, ...args),
      "isCallback": true
    }
  ],
  "pressEvents": [
    {
      "id": "modalhistorique_6",
      "onPress": (e, pressInstance, c) => { c.comp.reject(e, pressInstance); }
    }
  ]
});const templ0 = new Aventus.Template(this);templ0.setTemplate(`            <div class="line">                <div class="quantite">                    <span class="key">Quantité : </span>                    <span class="value" _id="modalhistorique_3"></span>                </div>                <div class="par">                    <span class="key">Modifié par : </span>                    <span class="value" _id="modalhistorique_4"></span>                </div>                <div class="modification">                    <span class="key">Modifié le : </span>                    <span class="value" _id="modalhistorique_5"></span>                </div>            </div>        `);templ0.setActions({
  "content": {
    "modalhistorique_3°@HTML": {
      "fct": (c) => `${c.print(c.comp.__96088c3823f02341204bbb7914b84118method4(c.data.historique))}`,
      "once": true
    },
    "modalhistorique_4°@HTML": {
      "fct": (c) => `${c.print(c.comp.__96088c3823f02341204bbb7914b84118method5(c.data.historique))}`,
      "once": true
    },
    "modalhistorique_5°@HTML": {
      "fct": (c) => `${c.print(c.comp.__96088c3823f02341204bbb7914b84118method6(c.data.historique))}`,
      "once": true
    }
  }
});this.__getStatic().__template.addLoop({
                    anchorId: 'modalhistorique_2',
                    template: templ0,
                simple:{data: "this.historiques",item:"historique"}}); }
    getClassName() {
        return "ModalHistorique";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["historiques"] = []; }
    __defaultValuesSignal(s) { super.__defaultValuesSignal(s); s["materiel"] = undefined;s["equipe"] = undefined;s["variation"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('materiel');this.__correctGetter('equipe');this.__correctGetter('variation');this.__correctGetter('historiques'); }
    configure() {
        return {
            title: ""
        };
    }
    async loadMoreData() {
        if (this.scrollEl.y + 200 > this.scrollEl.yMax) {
            this.loadData(this.page + 1);
        }
    }
    async loadData(page) {
        if (!this.canLoadMore)
            return;
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const data = await Aventus.Process.execute(new App.Http.Controllers.Inventaire.Historique.InventaireHistoriqueController().request({
            id_equipe: this.equipe.id,
            id_materiel: this.materiel.id,
            id_variation: this.variation?.id,
            page: page
        }));
        if (data) {
            this.page = page;
            if (this.page == 0) {
                this.historiques = data.historique;
            }
            else {
                this.historiques.splice(this.historiques.length - 1, 0, ...data.historique);
            }
            if (data.historique.length < 20) {
                this.canLoadMore = false;
            }
        }
        else {
            this.reject();
        }
        this.isLoading = false;
    }
    getLastUpdate(inventaire) {
        return inventaire.last_update.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }
    postCreation() {
        super.postCreation();
        this.loadData(0);
    }
    __96088c3823f02341204bbb7914b84118method1() {
        return this.materiel.nom;
    }
    __96088c3823f02341204bbb7914b84118method2() {
        return this.variation?.nom;
    }
    __96088c3823f02341204bbb7914b84118method3() {
        return this.equipe.nom;
    }
    __96088c3823f02341204bbb7914b84118method4(historique) {
        return historique.quantite;
    }
    __96088c3823f02341204bbb7914b84118method5(historique) {
        return historique.last_update_by;
    }
    __96088c3823f02341204bbb7914b84118method6(historique) {
        return this.getLastUpdate(historique);
    }
}
ModalHistorique.Namespace=`Inventaire`;
ModalHistorique.Tag=`av-modal-historique`;
__as1(_, 'ModalHistorique', ModalHistorique);
if(!window.customElements.get('av-modal-historique')){window.customElements.define('av-modal-historique', ModalHistorique);Aventus.WebComponentInstance.registerDefinition(ModalHistorique);}

App.Models.Materiel=class Materiel extends Aventus.Data {
    static get Fullname() { return "App.Models.Materiel"; }
    id;
    nom;
    image = undefined;
    variations;
    tout_monde;
    equipes;
}
App.Models.Materiel.Namespace=`Inventaire.App.Models`;
App.Models.Materiel.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","nom":"string","image":"Inventaire.App.Models.MaterielImage","variations":"Inventaire.App.Models.Variation[]","tout_monde":"boolean","equipes":"Inventaire.App.Models.MaterielEquipe[]"};
Aventus.Converter.register(App.Models.Materiel.Fullname, App.Models.Materiel);
__as1(_.App.Models, 'Materiel', App.Models.Materiel);

App.Models.Inventaire=class Inventaire extends Aventus.Data {
    static get Fullname() { return "App.Models.Inventaire"; }
    id;
    id_equipe;
    id_materiel;
    id_variation = undefined;
    quantite;
    last_update;
    last_update_by;
    equipe;
    materiel;
    variation = undefined;
}
App.Models.Inventaire.Namespace=`Inventaire.App.Models`;
App.Models.Inventaire.$schema={...(Aventus.Data?.$schema ?? {}), "id":"number","id_equipe":"number","id_materiel":"number","id_variation":"number","quantite":"number","last_update":"Date","last_update_by":"string","equipe":"Inventaire.App.Models.Equipe","materiel":"Inventaire.App.Models.Materiel","variation":"Inventaire.App.Models.Variation"};
Aventus.Converter.register(App.Models.Inventaire.Fullname, App.Models.Inventaire);
__as1(_.App.Models, 'Inventaire', App.Models.Inventaire);

App.Http.Controllers.Inventaire.Update.InventaireUpdateController=class InventaireUpdateController extends Aventus.HttpRoute {
    constructor(router) {
        super(router);
        this.request = this.request.bind(this);
    }
    async request(body) {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/data/inventaire/update`, Aventus.HttpMethod.POST);
        request.setBody(body);
        return await request.queryJSON(this.router);
    }
}
App.Http.Controllers.Inventaire.Update.InventaireUpdateController.Namespace=`Inventaire.App.Http.Controllers.Inventaire.Update`;
__as1(_.App.Http.Controllers.Inventaire.Update, 'InventaireUpdateController', App.Http.Controllers.Inventaire.Update.InventaireUpdateController);

const InventaireListItem = class InventaireListItem extends Aventus.WebComponent {
    get 'inventaire'() {
						return this.__watch["inventaire"];
					}
					set 'inventaire'(val) {
						this.__watch["inventaire"] = val;
					}    materiel;
    __registerWatchesActions() {
    this.__addWatchesActions("inventaire");    super.__registerWatchesActions();
}
    static __style = `:host{border-top:1px solid var(--color-base-300);padding:8px 16px;position:relative}:host .line .main{align-items:center;display:flex;gap:20px}:host .line .main .nom,:host .line .main .variation,:host .line .main .quantite{flex-grow:1;transform:translateY(7px);width:33%}:host .line .main .key{display:none;width:100px}:host .line .main .modification{display:flex;justify-content:flex-end;width:60px}:host .line .main .modification .actions{display:flex}:host .line .main .modification av-icon-action{width:fit-content}:host .line .last-update{font-size:var(--font-size-sm);text-align:right;transform:translateY(5px);white-space:nowrap}:host .line:not(.exist) .main .nom{transform:translateY(0px)}:host .line:not(.exist) .main .variation{transform:translateY(0px)}:host .line:not(.exist) .main .quantite{transform:translateY(0px)}:host .line:not(.exist) .main .modification .actions .historique{display:none}:host .line:not(.exist) .last-update{display:none}:host(:first-child){border-top:none}@media screen and (max-width: 700px){:host{padding:16px 16px}:host .line .main{display:block;margin-bottom:5px;padding-right:30px;width:fit-content}:host .line .main .nom,:host .line .main .variation,:host .line .main .quantite{flex-grow:0;margin-top:5px;transform:translateY(0px);width:100%}:host .line .main .key{display:inline-block}:host .line .main .modification{position:absolute;right:10px;top:10px}:host .line .main .modification .actions{flex-direction:column;gap:14px}:host .line .last-update{transform:translateY(0px);white-space:wrap}}`;
    __getStatic() {
        return InventaireListItem;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(InventaireListItem.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div _id="inventairelistitem_0">    <div class="main">        <div class="nom">            <span class="key">Nom :</span>            <span class="value" _id="inventairelistitem_1"></span>        </div>        <div class="variation">            <span class="key">Variation : </span>            <span class="value" _id="inventairelistitem_2"></span>        </div>        <div class="quantite">            <span class="key">Quantité : </span>            <span class="value" _id="inventairelistitem_3"></span>        </div>        <div class="modification">            <div class="actions">                <av-icon-action color="neutral" icon="edit" _id="inventairelistitem_4">Modifier</av-icon-action>                <av-icon-action class="historique" color="info" icon="history" _id="inventairelistitem_5">Historique</av-icon-action>            </div>        </div>    </div>    <div class="last-update" _id="inventairelistitem_6"></div></div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "inventairelistitem_0°class": {
      "fct": (c) => `line ${c.print(c.comp.__a95c8f763743275e162a27eb63a3f98emethod0())}`
    },
    "inventairelistitem_1°@HTML": {
      "fct": (c) => `${c.print(c.comp.__a95c8f763743275e162a27eb63a3f98emethod1())}`,
      "once": true
    },
    "inventairelistitem_2°@HTML": {
      "fct": (c) => `${c.print(c.comp.__a95c8f763743275e162a27eb63a3f98emethod2())}`
    },
    "inventairelistitem_3°@HTML": {
      "fct": (c) => `\r\n                ${c.print(c.comp.__a95c8f763743275e162a27eb63a3f98emethod3())}\r\n            `
    },
    "inventairelistitem_6°@HTML": {
      "fct": (c) => `${c.print(c.comp.__a95c8f763743275e162a27eb63a3f98emethod4())}`,
      "once": true
    }
  },
  "pressEvents": [
    {
      "id": "inventairelistitem_4",
      "onPress": (e, pressInstance, c) => { c.comp.edit(e, pressInstance); }
    },
    {
      "id": "inventairelistitem_5",
      "onPress": (e, pressInstance, c) => { c.comp.historique(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "InventaireListItem";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["inventaire"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('inventaire'); }
    getLastUpdate() {
        if (this.inventaire.last_update) {
            return this.inventaire.last_update_by + ", le " + this.inventaire.last_update.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
        return "";
    }
    async edit() {
        const modal = new ModalInventaireUpdate();
        modal.variation = this.inventaire.variation;
        modal.equipe = this.inventaire.equipe;
        modal.materiel = this.materiel;
        modal.nb = this.inventaire.quantite;
        const result = await modal.show();
        if (result) {
            const save = await Aventus.Process.execute(new App.Http.Controllers.Inventaire.Update.InventaireUpdateController().request({
                id: this.inventaire.id,
                id_equipe: this.inventaire.equipe.id,
                id_materiel: this.materiel.id,
                id_variation: this.inventaire.variation?.id,
                quantite: result
            }));
            if (save) {
                this.inventaire.id = save.id;
                this.inventaire.last_update_by = save.last_update_by;
                this.inventaire.last_update = save.last_update;
                this.inventaire.quantite = save.quantite;
                Toast.add({
                    message: "Inventaire enregistré",
                    color: "success",
                    closable: true
                });
            }
        }
    }
    async historique() {
        const modal = new ModalHistorique();
        modal.materiel = this.materiel;
        modal.equipe = this.inventaire.equipe;
        modal.variation = this.inventaire.variation;
        await modal.show();
    }
    __a95c8f763743275e162a27eb63a3f98emethod0() {
        return this.inventaire.id > 0 ? 'exist' : '';
    }
    __a95c8f763743275e162a27eb63a3f98emethod1() {
        return this.inventaire.equipe.nom;
    }
    __a95c8f763743275e162a27eb63a3f98emethod2() {
        return this.inventaire.variation?.nom;
    }
    __a95c8f763743275e162a27eb63a3f98emethod3() {
        return this.inventaire.quantite ?? '-';
    }
    __a95c8f763743275e162a27eb63a3f98emethod4() {
        return this.getLastUpdate();
    }
}
InventaireListItem.Namespace=`Inventaire`;
InventaireListItem.Tag=`av-inventaire-list-item`;
__as1(_, 'InventaireListItem', InventaireListItem);
if(!window.customElements.get('av-inventaire-list-item')){window.customElements.define('av-inventaire-list-item', InventaireListItem);Aventus.WebComponentInstance.registerDefinition(InventaireListItem);}

App.Http.Controllers.Materiel.GetInventaire.MaterielGetInventaireController=class MaterielGetInventaireController extends Aventus.HttpRoute {
    constructor(router) {
        super(router);
        this.request = this.request.bind(this);
    }
    async request(body) {
        const request = new Aventus.HttpRequest(`${this.getPrefix()}/data/materiel/inventaire`, Aventus.HttpMethod.POST);
        request.setBody(body);
        return await request.queryJSON(this.router);
    }
}
App.Http.Controllers.Materiel.GetInventaire.MaterielGetInventaireController.Namespace=`Inventaire.App.Http.Controllers.Materiel.GetInventaire`;
__as1(_.App.Http.Controllers.Materiel.GetInventaire, 'MaterielGetInventaireController', App.Http.Controllers.Materiel.GetInventaire.MaterielGetInventaireController);

App.Http.Controllers.Materiel.MaterielController=class MaterielController extends AventusPhp.ModelController {
    getRequest() { return _.App.Http.Controllers.Materiel.MaterielRequest; }
    getResource() { return _.App.Http.Controllers.Materiel.MaterielResource; }
    getUri() { return "data/materiel"; }
}
App.Http.Controllers.Materiel.MaterielController.Namespace=`Inventaire.App.Http.Controllers.Materiel`;
__as1(_.App.Http.Controllers.Materiel, 'MaterielController', App.Http.Controllers.Materiel.MaterielController);

let MaterielRAM=class MaterielRAM extends AventusPhp.RamHttp {
    /**
     * @inheritdoc
     */
    defineRoutes() {
        return new App.Http.Controllers.Materiel.MaterielController();
    }
    /**
     * Create a singleton to store data
     */
    static getInstance() {
        return Aventus.Instance.get(MaterielRAM);
    }
    /**
     * @inheritdoc
     */
    defineIndexKey() {
        return 'id';
    }
}
MaterielRAM.Namespace=`Inventaire`;
__as1(_, 'MaterielRAM', MaterielRAM);

App.Http.Controllers.User.UserController=class UserController extends AventusPhp.ModelController {
    getRequest() { return _.App.Http.Controllers.User.UserRequest; }
    getResource() { return _.App.Http.Controllers.User.UserResource; }
    getUri() { return "data/user"; }
}
App.Http.Controllers.User.UserController.Namespace=`Inventaire.App.Http.Controllers.User`;
__as1(_.App.Http.Controllers.User, 'UserController', App.Http.Controllers.User.UserController);

let UserRAM=class UserRAM extends AventusPhp.RamHttp {
    /**
     * @inheritdoc
     */
    defineRoutes() {
        return new App.Http.Controllers.User.UserController();
    }
    /**
     * Create a singleton to store data
     */
    static getInstance() {
        return Aventus.Instance.get(UserRAM);
    }
    /**
     * @inheritdoc
     */
    defineIndexKey() {
        return 'id';
    }
}
UserRAM.Namespace=`Inventaire`;
__as1(_, 'UserRAM', UserRAM);

const EquipeEditModal = class EquipeEditModal extends Modal {
    form;
    static __style = `:host{--col-gap: 12px}:host .title{font-size:var(--font-size-md);margin-bottom:16px}:host av-input{margin-bottom:12px}:host .actions{display:flex;gap:8px;justify-content:center}`;
    constructor() {
        super();
        this.form = Aventus.Form.Form.create({
            nom: new Aventus.Form.Validators.Required("Le nom est requis"),
        });
    }
    __getStatic() {
        return EquipeEditModal;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(EquipeEditModal.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="title" _id="equipeeditmodal_0"></div><av-input label="Nom" _id="equipeeditmodal_1"></av-input><div class="actions">
    <av-button _id="equipeeditmodal_2">Annuler</av-button>
    <av-button color="primary" _id="equipeeditmodal_3">Enregistrer</av-button>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "equipeeditmodal_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__96d74d247ad5518bea626dc8edc60f69method0())}`,
      "once": true
    }
  },
  "injection": [
    {
      "id": "equipeeditmodal_1",
      "injectionName": "form",
      "inject": (c) => c.comp.__96d74d247ad5518bea626dc8edc60f69method1(),
      "once": true
    }
  ],
  "pressEvents": [
    {
      "id": "equipeeditmodal_2",
      "onPress": (e, pressInstance, c) => { c.comp.reject(e, pressInstance); }
    },
    {
      "id": "equipeeditmodal_3",
      "onPress": (e, pressInstance, c) => { c.comp.submit(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "EquipeEditModal";
    }
    configure() {
        return { title: "" };
    }
    async submit() {
        const result = await this.form.submit(EquipeRAM.getInstance().saveWithError);
        if (result?.result) {
            this.resolve(result.result);
        }
    }
    __96d74d247ad5518bea626dc8edc60f69method0() {
        return this.options.title;
    }
    __96d74d247ad5518bea626dc8edc60f69method1() {
        return this.form.parts.nom;
    }
    static async open(item) {
        const modal = new EquipeEditModal();
        modal.options.title = item ? "Edition d'une équipe" : "Création d'une équipe";
        const clone = item ? item.clone() : new App.Http.Controllers.Equipe.EquipeResource();
        if (!clone.id) {
            clone.id = 0;
        }
        modal.form.item = EquipeRAM.getInstance().toRequest(clone);
        return await EquipeEditModal._show(modal);
    }
}
EquipeEditModal.Namespace=`Inventaire`;
EquipeEditModal.Tag=`av-equipe-edit-modal`;
__as1(_, 'EquipeEditModal', EquipeEditModal);
if(!window.customElements.get('av-equipe-edit-modal')){window.customElements.define('av-equipe-edit-modal', EquipeEditModal);Aventus.WebComponentInstance.registerDefinition(EquipeEditModal);}

const EquipesPage = class EquipesPage extends PageFull {
    list = [];
    static __style = `:host .card{background-color:var(--color-base-100);border-radius:var(--radius-box);box-shadow:var(--elevation-2);display:flex;flex-direction:column;max-height:100%;padding:24px;width:100%}:host .card .header{align-items:center;display:flex;flex-shrink:0;gap:24px;height:50px;justify-content:space-between;margin-bottom:24px}:host .card .header .title{font-size:var(--font-size-md)}:host .card .header .actions{align-items:center;display:flex;gap:24px}:host .card .header .actions av-input{max-width:300px}:host .card .body{flex-grow:1;min-height:0;width:100%}:host .card .body .list{border:1px solid var(--color-base-300);border-radius:var(--radius-field);width:100%}@media screen and (max-width: 600px){:host .card{position:relative}:host .card .header{flex-wrap:wrap;height:auto}:host .card .header .title{width:100%}:host .card .header .actions{width:100%}:host .card .header .actions av-input{max-width:none;width:100%}:host .card .header .actions av-button{position:absolute;right:16px;top:16px}}`;
    constructor() {
        super();
        this.onNewData = this.onNewData.bind(this);
        this.onRemoveData = this.onRemoveData.bind(this);
    }
    __getStatic() {
        return EquipesPage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(EquipesPage.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="card">
    <div class="header">
        <div class="title">Liste des équipes</div>
        <div class="actions">
            <av-input placeholder="Recherche" _id="equipespage_0"></av-input>
            <av-button color="primary" _id="equipespage_1">Ajouter</av-button>
        </div>
    </div>
    <av-scrollable class="body" floating_scroll auto_hide>
        <div class="list" _id="equipespage_2">
        </div>
    </av-scrollable>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "searchEl",
      "ids": [
        "equipespage_0"
      ]
    },
    {
      "name": "listEl",
      "ids": [
        "equipespage_2"
      ]
    }
  ],
  "events": [
    {
      "eventName": "onChange",
      "id": "equipespage_0",
      "fct": (c, ...args) => c.comp.search.apply(c.comp, ...args),
      "isCallback": true
    }
  ],
  "pressEvents": [
    {
      "id": "equipespage_1",
      "onPress": (e, pressInstance, c) => { c.comp.add(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "EquipesPage";
    }
    configure() {
        return {};
    }
    search() {
        if (this.searchEl.value) {
            for (let item of this.list) {
                item.visible = StringTools.contains(item.item.nom, this.searchEl.value);
            }
        }
        else {
            for (let item of this.list) {
                item.visible = true;
            }
        }
    }
    async add() {
        await EquipeEditModal.open();
    }
    async bindData() {
        let list = await EquipeRAM.getInstance().getList();
        list.sort((a, b) => a.nom.localeCompare(a.nom));
        for (let item of list) {
            let el = new EquipeItem();
            el.item = item;
            el.visible = this.searchEl.value ? StringTools.contains(item.nom, this.searchEl.value) : true;
            this.listEl.appendChild(el);
            this.list.push(el);
        }
        EquipeRAM.getInstance().onCreated(this.onNewData);
        EquipeRAM.getInstance().onUpdated(this.onNewData);
        EquipeRAM.getInstance().onDeleted(this.onRemoveData);
    }
    onNewData(newData) {
        let itemBefore = undefined;
        for (let item of this.list) {
            if (itemBefore == null && newData.nom.localeCompare(item.item.nom) < 0) {
                itemBefore = item;
            }
            if (item.item.id == newData.id) {
                item.item = newData;
                Aventus.Watcher.trigger("UPDATED", item.item);
                return;
            }
        }
        let el = new EquipeItem();
        el.item = newData;
        el.visible = this.searchEl.value ? StringTools.contains(newData.nom, this.searchEl.value) : true;
        if (itemBefore) {
            let index = this.list.indexOf(itemBefore);
            this.list.splice(index, 0, el);
            this.listEl.insertBefore(el, itemBefore);
        }
        else {
            this.list.push(el);
            this.listEl.appendChild(el);
        }
    }
    onRemoveData(App, Models, Equipe) {
        for (let item of this.list) {
            if (item.item.id == App.Models.Equipe.id) {
                item.remove();
                let index = this.list.indexOf(item);
                this.list.splice(index, 1);
                return;
            }
        }
    }
    postCreation() {
        super.postCreation();
        this.bindData();
    }
}
EquipesPage.Namespace=`Inventaire`;
EquipesPage.Tag=`av-equipes-page`;
__as1(_, 'EquipesPage', EquipesPage);
if(!window.customElements.get('av-equipes-page')){window.customElements.define('av-equipes-page', EquipesPage);Aventus.WebComponentInstance.registerDefinition(EquipesPage);}

const InventaireEquipeListItem = class InventaireEquipeListItem extends Aventus.WebComponent {
    get 'inventaire'() {
						return this.__watch["inventaire"];
					}
					set 'inventaire'(val) {
						this.__watch["inventaire"] = val;
					}    equipe;
    __registerWatchesActions() {
    this.__addWatchesActions("inventaire");    super.__registerWatchesActions();
}
    static __style = `:host{border-top:1px solid var(--color-base-300);padding:8px 16px;position:relative}:host .line .main{align-items:center;display:flex;gap:20px}:host .line .main .img{background-image:url("https://placeholderimage.eu/api/800/600");background-position:center;background-size:cover;flex-shrink:0;height:34px;transform:translateY(7px);width:34px}:host .line .main .nom,:host .line .main .variation,:host .line .main .quantite{flex-grow:1;transform:translateY(7px);width:33%}:host .line .main .key{display:none;width:100px}:host .line .main .modification{display:flex;justify-content:flex-end;width:60px}:host .line .main .modification .actions{display:flex}:host .line .main .modification av-icon-action{width:fit-content}:host .line .last-update{font-size:var(--font-size-sm);text-align:right;transform:translateY(5px);white-space:nowrap}:host .line:not(.exist) .main .nom,:host .line:not(.exist) .main .variation,:host .line:not(.exist) .main .quantite,:host .line:not(.exist) .main .img{transform:translateY(0px)}:host .line:not(.exist) .main .modification .actions .historique{display:none}:host .line:not(.exist) .last-update{display:none}:host(:first-child){border-top:none}@media screen and (max-width: 700px){:host{padding:16px 16px}:host .line .main{display:block;margin-bottom:5px;padding-right:30px;width:fit-content}:host .line .main .nom,:host .line .main .variation,:host .line .main .quantite,:host .line .main .img{flex-grow:0;margin-top:5px;transform:translateY(0px);width:100%}:host .line .main .img{height:100px;width:100px;margin-top:0}:host .line .main .key{display:inline-block}:host .line .main .modification{position:absolute;right:10px;top:10px}:host .line .main .modification .actions{flex-direction:column;gap:14px}:host .line .last-update{transform:translateY(0px);white-space:wrap}}`;
    __getStatic() {
        return InventaireEquipeListItem;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(InventaireEquipeListItem.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div _id="inventaireequipelistitem_0">
    <div class="main">
        <div class="img" _id="inventaireequipelistitem_1"></div>
         <div class="nom">
            <span class="key">Nom :</span>
            <span class="value" _id="inventaireequipelistitem_2"></span>
        </div>
        <div class="variation">
            <span class="key">Variation : </span>
            <span class="value" _id="inventaireequipelistitem_3"></span>
        </div>
        <div class="quantite">
            <span class="key">Quantité : </span>
            <span class="value" _id="inventaireequipelistitem_4"></span>
        </div>
        <div class="modification">
            <div class="actions">
                <av-icon-action color="neutral" icon="edit" _id="inventaireequipelistitem_5">Modifier</av-icon-action>
                <av-icon-action class="historique" color="info" icon="history" _id="inventaireequipelistitem_6">Historique</av-icon-action>
            </div>
        </div>
    </div>
    <div class="last-update" _id="inventaireequipelistitem_7"></div>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "inventaireequipelistitem_0°class": {
      "fct": (c) => `line ${c.print(c.comp.__a2ec46d163f7617d318fc452e85fb3c8method0())}`
    },
    "inventaireequipelistitem_1°style": {
      "fct": (c) => `background-image: url(${c.print(c.comp.__a2ec46d163f7617d318fc452e85fb3c8method1())});`,
      "once": true
    },
    "inventaireequipelistitem_2°@HTML": {
      "fct": (c) => `${c.print(c.comp.__a2ec46d163f7617d318fc452e85fb3c8method2())}`,
      "once": true
    },
    "inventaireequipelistitem_3°@HTML": {
      "fct": (c) => `${c.print(c.comp.__a2ec46d163f7617d318fc452e85fb3c8method3())}`
    },
    "inventaireequipelistitem_4°@HTML": {
      "fct": (c) => `\n                ${c.print(c.comp.__a2ec46d163f7617d318fc452e85fb3c8method4())}\n            `
    },
    "inventaireequipelistitem_7°@HTML": {
      "fct": (c) => `${c.print(c.comp.__a2ec46d163f7617d318fc452e85fb3c8method5())}`,
      "once": true
    }
  },
  "pressEvents": [
    {
      "id": "inventaireequipelistitem_5",
      "onPress": (e, pressInstance, c) => { c.comp.edit(e, pressInstance); }
    },
    {
      "id": "inventaireequipelistitem_6",
      "onPress": (e, pressInstance, c) => { c.comp.historique(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "InventaireEquipeListItem";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["inventaire"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('inventaire'); }
    getLastUpdate() {
        if (this.inventaire.last_update) {
            return this.inventaire.last_update_by + ", le " + this.inventaire.last_update.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
        return "";
    }
    getPicture() {
        if (this.inventaire.materiel.image.uri) {
            return this.inventaire.materiel.image.uri;
        }
        return "/img/default_img.svg";
    }
    async edit() {
        const modal = new ModalInventaireUpdate();
        modal.variation = this.inventaire.variation;
        modal.equipe = this.equipe;
        modal.materiel = this.inventaire.materiel;
        modal.nb = this.inventaire.quantite;
        const result = await modal.show();
        if (result) {
            const save = await Aventus.Process.execute(new App.Http.Controllers.Inventaire.Update.InventaireUpdateController().request({
                id: this.inventaire.id,
                id_equipe: this.equipe.id,
                id_materiel: this.inventaire.materiel.id,
                id_variation: this.inventaire.variation?.id,
                quantite: result
            }));
            if (save) {
                this.inventaire.id = save.id;
                this.inventaire.last_update_by = save.last_update_by;
                this.inventaire.last_update = save.last_update;
                this.inventaire.quantite = save.quantite;
                Toast.add({
                    message: "Inventaire enregistré",
                    color: "success",
                    closable: true
                });
            }
        }
    }
    async historique() {
        const modal = new ModalHistorique();
        modal.materiel = this.inventaire.materiel;
        modal.equipe = this.equipe;
        modal.variation = this.inventaire.variation;
        await modal.show();
    }
    __a2ec46d163f7617d318fc452e85fb3c8method0() {
        return this.inventaire.id > 0 ? 'exist' : '';
    }
    __a2ec46d163f7617d318fc452e85fb3c8method1() {
        return this.getPicture();
    }
    __a2ec46d163f7617d318fc452e85fb3c8method2() {
        return this.inventaire.materiel.nom;
    }
    __a2ec46d163f7617d318fc452e85fb3c8method3() {
        return this.inventaire.variation?.nom;
    }
    __a2ec46d163f7617d318fc452e85fb3c8method4() {
        return this.inventaire.quantite ?? '-';
    }
    __a2ec46d163f7617d318fc452e85fb3c8method5() {
        return this.getLastUpdate();
    }
}
InventaireEquipeListItem.Namespace=`Inventaire`;
InventaireEquipeListItem.Tag=`av-inventaire-equipe-list-item`;
__as1(_, 'InventaireEquipeListItem', InventaireEquipeListItem);
if(!window.customElements.get('av-inventaire-equipe-list-item')){window.customElements.define('av-inventaire-equipe-list-item', InventaireEquipeListItem);Aventus.WebComponentInstance.registerDefinition(InventaireEquipeListItem);}

const EquipeDetailsPage = class EquipeDetailsPage extends Page {
    get 'item'() {
						return this.__watch["item"];
					}
					set 'item'(val) {
						this.__watch["item"] = val;
					}get 'inventaires'() {
						return this.__watch["inventaires"];
					}
					set 'inventaires'(val) {
						this.__watch["inventaires"] = val;
					}    __registerWatchesActions() {
    this.__addWatchesActions("item");this.__addWatchesActions("inventaires");    super.__registerWatchesActions();
}
    static __style = `:host .content{justify-content:flex-start}:host .card{background-color:var(--color-base-100);border-radius:var(--radius-box);box-shadow:var(--elevation-2);display:flex;flex-direction:column;padding:24px;width:100%}:host .card .header{align-items:center;display:flex;flex-direction:row;flex-shrink:0;height:min-content;justify-content:space-between;margin-bottom:24px;width:100%}:host .card .header .title{font-size:var(--font-size-lg)}:host .card .header .actions{align-items:center;display:flex;gap:8px;justify-content:center}:host .card .body{flex-grow:1;min-height:0}:host .card .body .title{align-items:center;display:flex;flex-shrink:0;gap:16px;justify-content:space-between;margin-bottom:16px}:host .card .body .title av-input{max-width:300px}:host .card .body .list{border:1px solid var(--color-base-300);border-radius:var(--radius-field);display:flex;flex-direction:column;margin-top:8px;width:100%}@media screen and (max-width: 660px){:host .card .body .title{flex-wrap:wrap;width:100%}:host .card .body .title av-input{max-width:none;width:100%}}`;
    __getStatic() {
        return EquipeDetailsPage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(EquipeDetailsPage.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="card">
    <div class="header">
        <div class="title" _id="equipedetailspage_0"></div>
        <div class="actions">
            <av-icon-action color="neutral" icon="edit" _id="equipedetailspage_1">Edition</av-icon-action>
            <av-icon-action color="error" icon="delete" _id="equipedetailspage_2">Suppression</av-icon-action>
        </div>
    </div>
    <div class="body">
        <div class="title">
            <span>Liste de matériel</span>
            <av-input placeholder="Recherche" _id="equipedetailspage_3"></av-input>
        </div>
        <div class="list">
            <template _id="equipedetailspage_4"></template>
        </div>
    </div>
</div>` }
    });
}
    get listItems () { var list = Array.from(this.shadowRoot.querySelectorAll('[_id="equipedetailspage_5"]')); return list; }    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "searchEl",
      "ids": [
        "equipedetailspage_3"
      ]
    }
  ],
  "content": {
    "equipedetailspage_0°@HTML": {
      "fct": (c) => `Equipe : ${c.print(c.comp.__1235ef0c4a20ffaa552fd37f83cb4912method1())}`,
      "once": true
    }
  },
  "events": [
    {
      "eventName": "onChange",
      "id": "equipedetailspage_3",
      "fct": (c, ...args) => c.comp.search.apply(c.comp, ...args),
      "isCallback": true
    }
  ],
  "pressEvents": [
    {
      "id": "equipedetailspage_1",
      "onPress": (e, pressInstance, c) => { c.comp.editItem(e, pressInstance); }
    },
    {
      "id": "equipedetailspage_2",
      "onPress": (e, pressInstance, c) => { c.comp.deleteItem(e, pressInstance); }
    }
  ]
});const templ0 = new Aventus.Template(this);templ0.setTemplate(`
                <av-inventaire-equipe-list-item _id="equipedetailspage_5"></av-inventaire-equipe-list-item>
            `);templ0.setActions({
  "injection": [
    {
      "id": "equipedetailspage_5",
      "injectionName": "inventaire",
      "inject": (c) => c.comp.__1235ef0c4a20ffaa552fd37f83cb4912method2(c.data.inventaire),
      "once": true
    },
    {
      "id": "equipedetailspage_5",
      "injectionName": "equipe",
      "inject": (c) => c.comp.__1235ef0c4a20ffaa552fd37f83cb4912method3(),
      "once": true
    }
  ]
});this.__getStatic().__template.addLoop({
                    anchorId: 'equipedetailspage_4',
                    template: templ0,
                simple:{data: "this.inventaires",item:"inventaire"}}); }
    getClassName() {
        return "EquipeDetailsPage";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["item"] = undefined;w["inventaires"] = []; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('item');this.__correctGetter('inventaires'); }
    async isAllowed(state, pattern) {
        let slugs = Main.instance.getSlugs(pattern);
        if (!slugs || typeof slugs['id'] != "number")
            return "/";
        const equipe = await EquipeRAM.getInstance().getById(slugs['id']);
        if (!equipe)
            return "/";
        this.item = equipe;
        const result = await this.loadInventaire(equipe.id);
        if (!result) {
            return "/";
        }
        return true;
    }
    async loadInventaire(id) {
        const materiels = await Aventus.Process.execute(new App.Http.Controllers.Equipe.Materiel.EquipeMaterielController().request({ id_equipe: id }));
        if (!materiels) {
            return false;
        }
        const connu = await Aventus.Process.execute(new App.Http.Controllers.Equipe.GetInventaire.EquipeGetInventaireController().request({ id_equipe: id }));
        if (!connu) {
            return false;
        }
        materiels.sort((a, b) => a.nom.localeCompare(b.nom));
        const inventaires = [];
        const addInventaire = (materiel, variation) => {
            let el;
            if (variation) {
                el = connu.find(p => p.materiel.id == materiel.id && p.variation?.id == variation.id);
            }
            else {
                el = connu.find(p => p.materiel.id == materiel.id);
            }
            if (el == undefined) {
                el = new App.Http.Controllers.Equipe.GetInventaire.Response();
                el.materiel = materiel;
                el.variation = variation;
                el.quantite = 0;
            }
            inventaires.push(el);
        };
        for (let materiel of materiels) {
            if (materiel.variations.length > 0) {
                for (let variation of materiel.variations) {
                    addInventaire(materiel, variation);
                }
            }
            else {
                addInventaire(materiel);
            }
        }
        this.inventaires = inventaires;
        return true;
    }
    configure() {
        return {};
    }
    async editItem() {
        const result = await EquipeEditModal.open(this.item);
        if (result) {
            Aventus.Watcher.trigger("UPDATED", this.item);
        }
    }
    async deleteItem() {
        const result = await Confirm.open({
            title: "Confirmation de suppression",
            content: "Êtes-vous sûr de vouloir supprimer cette équipe?"
        });
        if (result) {
            await EquipeRAM.getInstance().delete(this.item);
            Main.instance.navigate("/", { replace: true });
        }
    }
    search() {
        const txt = this.searchEl.value;
        for (let item of this.listItems) {
            if (StringTools.contains(item.inventaire.materiel.nom, txt)) {
                item.style.display = "";
            }
            else if (StringTools.contains(item.inventaire.variation?.nom, txt)) {
                item.style.display = "";
            }
            else {
                item.style.display = "none";
            }
        }
    }
    __1235ef0c4a20ffaa552fd37f83cb4912method1() {
        return this.item.nom;
    }
    __1235ef0c4a20ffaa552fd37f83cb4912method2(inventaire) {
        return inventaire;
    }
    __1235ef0c4a20ffaa552fd37f83cb4912method3() {
        return this.item;
    }
}
EquipeDetailsPage.Namespace=`Inventaire`;
EquipeDetailsPage.Tag=`av-equipe-details-page`;
__as1(_, 'EquipeDetailsPage', EquipeDetailsPage);
if(!window.customElements.get('av-equipe-details-page')){window.customElements.define('av-equipe-details-page', EquipeDetailsPage);Aventus.WebComponentInstance.registerDefinition(EquipeDetailsPage);}

const MaterielPage = class MaterielPage extends PageFull {
    list = [];
    static __style = `:host{--col-gap: 16px}:host .card{background-color:var(--color-base-100);border-radius:var(--radius-box);box-shadow:var(--elevation-2);display:flex;flex-direction:column;max-height:100%;padding:24px;width:100%}:host .card .header{align-items:center;display:flex;flex-shrink:0;gap:24px;height:50px;justify-content:space-between;margin-bottom:24px}:host .card .header .title{font-size:var(--font-size-md)}:host .card .header .actions{align-items:center;display:flex;gap:24px}:host .card .header .actions av-input{max-width:300px}:host .card .body{flex-grow:1;min-height:0;width:100%}:host .card .body .list{margin:16px;margin-top:0;width:calc(100% - 32px)}@media screen and (max-width: 620px){:host .card{position:relative}:host .card .header{flex-wrap:wrap;height:auto}:host .card .header .title{width:100%}:host .card .header .actions{width:100%}:host .card .header .actions av-input{max-width:none;width:100%}:host .card .header .actions av-button{position:absolute;right:16px;top:16px}}`;
    constructor() {
        super();
        this.onNewData = this.onNewData.bind(this);
        this.onRemoveData = this.onRemoveData.bind(this);
    }
    __getStatic() {
        return MaterielPage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(MaterielPage.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="card">
    <div class="header">
        <div class="title">Liste du matériel</div>
        <div class="actions">
            <av-input placeholder="Recherche" _id="materielpage_0"></av-input>
            <av-button color="primary" _id="materielpage_1">Ajouter</av-button>
        </div>
    </div>
    <av-scrollable class="body" floating_scroll auto_hide>
        <av-row class="list" _id="materielpage_2">
        </av-row>
    </av-scrollable>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "searchEl",
      "ids": [
        "materielpage_0"
      ]
    },
    {
      "name": "listEl",
      "ids": [
        "materielpage_2"
      ]
    }
  ],
  "events": [
    {
      "eventName": "onChange",
      "id": "materielpage_0",
      "fct": (c, ...args) => c.comp.search.apply(c.comp, ...args),
      "isCallback": true
    }
  ],
  "pressEvents": [
    {
      "id": "materielpage_1",
      "onPress": (e, pressInstance, c) => { c.comp.add(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "MaterielPage";
    }
    configure() {
        return {};
    }
    search() {
        if (this.searchEl.value) {
            for (let item of this.list) {
                item.visible = StringTools.contains(item.item.nom, this.searchEl.value);
            }
        }
        else {
            for (let item of this.list) {
                item.visible = true;
            }
        }
    }
    async add() {
        Main.instance.navigate("/materiel/0");
    }
    async bindData() {
        let list = await Aventus.Process.execute(MaterielRAM.getInstance().getListWithError()) ?? [];
        list.sort((a, b) => a.nom.localeCompare(b.nom));
        for (let item of list) {
            let el = new MaterielCard();
            el.item = item;
            el.visible = this.searchEl.value ? StringTools.contains(item.nom, this.searchEl.value) : true;
            this.listEl.appendChild(el);
            this.list.push(el);
        }
        MaterielRAM.getInstance().onCreated(this.onNewData);
        MaterielRAM.getInstance().onUpdated(this.onNewData);
        MaterielRAM.getInstance().onDeleted(this.onRemoveData);
    }
    onNewData(materiel) {
        let itemBefore = undefined;
        for (let item of this.list) {
            if (itemBefore == null && materiel.nom.localeCompare(item.item.nom) < 0) {
                itemBefore = item;
            }
            if (item.item.id == materiel.id) {
                item.item = materiel;
                Aventus.Watcher.trigger("UPDATED", item.item);
                return;
            }
        }
        let el = new MaterielCard();
        el.item = materiel;
        el.visible = this.searchEl.value ? StringTools.contains(materiel.nom, this.searchEl.value) : true;
        if (itemBefore) {
            let index = this.list.indexOf(itemBefore);
            this.list.splice(index, 0, el);
            this.listEl.insertBefore(el, itemBefore);
        }
        else {
            this.list.push(el);
            this.listEl.appendChild(el);
        }
    }
    onRemoveData(materiel) {
        for (let item of this.list) {
            if (item.item.id == materiel.id) {
                item.remove();
                let index = this.list.indexOf(item);
                this.list.splice(index, 1);
                return;
            }
        }
    }
    postCreation() {
        super.postCreation();
        this.bindData();
    }
}
MaterielPage.Namespace=`Inventaire`;
MaterielPage.Tag=`av-materiel-page`;
__as1(_, 'MaterielPage', MaterielPage);
if(!window.customElements.get('av-materiel-page')){window.customElements.define('av-materiel-page', MaterielPage);Aventus.WebComponentInstance.registerDefinition(MaterielPage);}

const MaterielDetailsPage = class MaterielDetailsPage extends Page {
    get 'inventaires'() {
						return this.__watch["inventaires"];
					}
					set 'inventaires'(val) {
						this.__watch["inventaires"] = val;
					}get 'objName'() {
						return this.__watch["objName"];
					}
					set 'objName'(val) {
						this.__watch["objName"] = val;
					}    form;
    item;
    slugId = 0;
    __registerWatchesActions() {
    this.__addWatchesActions("inventaires");this.__addWatchesActions("objName");    super.__registerWatchesActions();
}
    static __style = `:host{--col-gap: 16px}:host .content{justify-content:flex-start}:host .card{background-color:var(--color-base-100);border-radius:var(--radius-box);box-shadow:var(--elevation-2);display:flex;flex-direction:column;padding:24px;width:100%}:host .card .header{align-items:center;display:flex;flex-shrink:0;gap:24px;min-height:50px;justify-content:space-between;margin-bottom:16px}:host .card .header .title{font-size:var(--font-size-md)}:host .card .header .actions{align-items:center;display:flex;gap:24px}:host .card .header .actions av-input{max-width:300px}:host .card .body{--input-image-height: 150px;width:100%}:host .card .body .contenu{flex-direction:column}:host .card .body .contenu .tags{margin-top:16px}:host .card .body .contenu .tags .label{align-items:center;display:flex;font-size:calc(var(--font-size)*.95);margin-bottom:6px}:host .card .body .contenu .tags .label .toggle{align-items:center;display:flex;gap:6px}:host .card .body .contenu .tags .label .main-label{margin-right:16px}:host .card .body .contenu .tags .label .sub-label{cursor:pointer;font-size:calc(var(--font-size)*.9)}:host .card .body .contenu .tags .liste{display:flex;flex-wrap:wrap;gap:6px}:host .card .body .contenu .tags .liste av-tag{padding-left:12px}:host .card .body .contenu .tags .liste mi-icon{color:var(--color-error);cursor:pointer;font-size:16px;margin-left:6px}:host .by-equipe{margin-top:24px}:host .by-equipe .header{align-items:center;display:flex;gap:24px}:host .by-equipe .header av-input{max-width:300px}:host .by-equipe .list{border:1px solid var(--color-base-300);border-radius:var(--radius-field);display:flex;flex-direction:column;width:100%}@media screen and (max-width: 660px){:host .by-equipe .header{flex-wrap:wrap;width:100%}:host .by-equipe .header av-input{max-width:none;width:100%}}@media screen and (max-width: 500px){:host .label{flex-wrap:wrap}:host .main-label{margin-bottom:6px;width:100%}}`;
    constructor() {
        super();
        this.form = Aventus.Form.Form.create({
            nom: Aventus.Form.Validators.Required,
            variations: {},
            image: {},
            tout_monde: {},
            equipes: {}
        });
    }
    __getStatic() {
        return MaterielDetailsPage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(MaterielDetailsPage.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="card">
    <div class="header">
        <div class="title" _id="materieldetailspage_0"></div>
        <div class="actions">
            <av-icon-action color="error" icon="delete" _id="materieldetailspage_1">Supprimer</av-icon-action>
            <av-icon-action color="success" icon="save" _id="materieldetailspage_2">Enregistrer</av-icon-action>
        </div>
    </div>
    <div class="body">
        <av-row>
            <av-col size="12" size_sm="6">
                <av-input-image label="Image" _id="materieldetailspage_3"></av-input-image>
            </av-col>
            <av-col size="12" size_sm="6" class="contenu">
                <av-input label="Nom du materiel" _id="materieldetailspage_4"></av-input>
                <div class="tags">
                    <div class="label">Variations</div>
                    <av-variation-tags _id="materieldetailspage_5"></av-variation-tags>
                </div>
                <div class="tags">
                    <div class="label pour">
                        <span class="main-label">Pour :</span>
                        <div class="toggle">
                            <span class="sub-label" _id="materieldetailspage_6">Equipe spécifique</span>
                            <av-toggle _id="materieldetailspage_7"></av-toggle>
                            <span class="sub-label" _id="materieldetailspage_8">Tout le monde</span>
                        </div>
                    </div>
                    <template _id="materieldetailspage_9"></template>
                </div>
            </av-col>
        </av-row>
    </div>
</div><template _id="materieldetailspage_11"></template>` }
    });
}
    get searchEl () { return this.shadowRoot.querySelector('[_id="materieldetailspage_12"]'); }get listItems () { var list = Array.from(this.shadowRoot.querySelectorAll('[_id="materieldetailspage_14"]')); return list; }    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "materieldetailspage_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__7aaf46e464a5fd1841ddce2cf63e5dfemethod3())}`,
      "once": true
    }
  },
  "injection": [
    {
      "id": "materieldetailspage_3",
      "injectionName": "form",
      "inject": (c) => c.comp.__7aaf46e464a5fd1841ddce2cf63e5dfemethod4(),
      "once": true
    },
    {
      "id": "materieldetailspage_4",
      "injectionName": "form",
      "inject": (c) => c.comp.__7aaf46e464a5fd1841ddce2cf63e5dfemethod5(),
      "once": true
    },
    {
      "id": "materieldetailspage_5",
      "injectionName": "variations",
      "inject": (c) => c.comp.__7aaf46e464a5fd1841ddce2cf63e5dfemethod6(),
      "once": true
    },
    {
      "id": "materieldetailspage_7",
      "injectionName": "form",
      "inject": (c) => c.comp.__7aaf46e464a5fd1841ddce2cf63e5dfemethod7(),
      "once": true
    }
  ],
  "pressEvents": [
    {
      "id": "materieldetailspage_1",
      "onPress": (e, pressInstance, c) => { c.comp.destroy(e, pressInstance); }
    },
    {
      "id": "materieldetailspage_2",
      "onPress": (e, pressInstance, c) => { c.comp.save(e, pressInstance); }
    },
    {
      "id": "materieldetailspage_6",
      "onPress": (e, pressInstance, c) => { c.comp.unsetToutMonde(e, pressInstance); }
    },
    {
      "id": "materieldetailspage_8",
      "onPress": (e, pressInstance, c) => { c.comp.setToutMonde(e, pressInstance); }
    }
  ]
});const templ0 = new Aventus.Template(this);templ0.setTemplate(`
                        <av-equipe-tags _id="materieldetailspage_10"></av-equipe-tags>
                    `);templ0.setActions({
  "injection": [
    {
      "id": "materieldetailspage_10",
      "injectionName": "equipes",
      "inject": (c) => c.comp.__7aaf46e464a5fd1841ddce2cf63e5dfemethod8(),
      "once": true
    }
  ]
});this.__getStatic().__template.addIf({
                    anchorId: 'materieldetailspage_9',
                    parts: [{once: true,
                    condition: (c) => c.comp.__7aaf46e464a5fd1841ddce2cf63e5dfemethod0(),
                    template: templ0
                }]
            });const templ1 = new Aventus.Template(this);templ1.setTemplate(`
    <div class="card by-equipe">
        <div class="header">
            <div class="title">Liste dans les équipes</div>
            <av-input placeholder="Recherche" _id="materieldetailspage_12"></av-input>
        </div>
        <div class="body">
            <div class="list">
                <template _id="materieldetailspage_13"></template>
            </div>
        </div>
    </div>
`);templ1.setActions({
  "events": [
    {
      "eventName": "onChange",
      "id": "materieldetailspage_12",
      "fct": (c, ...args) => c.comp.search.apply(c.comp, ...args),
      "isCallback": true
    }
  ]
});const templ2 = new Aventus.Template(this);templ2.setTemplate(`
                    <av-inventaire-list-item _id="materieldetailspage_14"></av-inventaire-list-item>
                `);templ2.setActions({
  "injection": [
    {
      "id": "materieldetailspage_14",
      "injectionName": "inventaire",
      "inject": (c) => c.comp.__7aaf46e464a5fd1841ddce2cf63e5dfemethod9(c.data.inventaire),
      "once": true
    },
    {
      "id": "materieldetailspage_14",
      "injectionName": "materiel",
      "inject": (c) => c.comp.__7aaf46e464a5fd1841ddce2cf63e5dfemethod10(),
      "once": true
    }
  ]
});templ1.addLoop({
                    anchorId: 'materieldetailspage_13',
                    template: templ2,
                simple:{data: "this.inventaires",item:"inventaire"}});this.__getStatic().__template.addIf({
                    anchorId: 'materieldetailspage_11',
                    parts: [{
                    condition: (c) => c.comp.__7aaf46e464a5fd1841ddce2cf63e5dfemethod1(),
                    template: templ1
                }]
            }); }
    getClassName() {
        return "MaterielDetailsPage";
    }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["inventaires"] = [];w["objName"] = ""; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__correctGetter('inventaires');this.__correctGetter('objName'); }
    async isAllowed(state, pattern, router) {
        const slugs = router.getSlugs(pattern);
        if (!slugs || typeof slugs['id'] != "number") {
            return "/materiel";
        }
        const id = slugs['id'];
        this.slugId = id;
        if (id == 0) {
            let newItem = new App.Http.Controllers.Materiel.MaterielRequest();
            newItem.id = 0;
            newItem.tout_monde = true;
            newItem.image = new App.Models.MaterielImage();
            newItem.variations = [];
            let v1 = new App.Models.Variation();
            v1.nom = "XS";
            newItem.variations.push(v1);
            let v2 = new App.Models.Variation();
            v2.nom = "S";
            newItem.variations.push(v2);
            newItem.equipes = [];
            this.form.item = newItem;
            this.objName = "Création de matériel";
            this.inventaires = [];
        }
        else {
            const ram = MaterielRAM.getInstance();
            const item = await ram.getById(id);
            if (!item) {
                return "/materiel";
            }
            this.item = item;
            this.form.item = ram.toRequest(item);
            this.objName = this.form.item.nom;
            await this.loadInventaire(id);
        }
        return true;
    }
    async loadInventaire(id) {
        const item = this.item;
        if (!item)
            return;
        const inventaires = [];
        const connu = await Aventus.Process.execute(new App.Http.Controllers.Materiel.GetInventaire.MaterielGetInventaireController().request({ id_materiel: id }));
        if (!connu)
            return;
        let equipes = [];
        if (item.tout_monde) {
            equipes = (await EquipeRAM.getInstance().getList());
        }
        else {
            const equipeIds = item.equipes.map(p => p.id_equipe);
            equipes = (await EquipeRAM.getInstance().getByIds(equipeIds));
        }
        equipes.sort((a, b) => a.nom.localeCompare(b.nom));
        const addInventaire = (equipe, variation) => {
            let el;
            if (variation) {
                el = connu.find(p => p.equipe.id == equipe.id && p.variation?.id == variation.id);
            }
            else {
                el = connu.find(p => p.equipe.id == equipe.id);
            }
            if (el == undefined) {
                el = new App.Http.Controllers.Materiel.GetInventaire.Response();
                el.equipe = equipe;
                el.variation = variation;
                el.quantite = 0;
            }
            inventaires.push(el);
        };
        for (let equipe of equipes) {
            if (item.variations.length > 0) {
                for (let variation of item.variations) {
                    addInventaire(equipe, variation);
                }
            }
            else {
                addInventaire(equipe);
            }
        }
        this.inventaires = inventaires;
    }
    configure() {
        return {};
    }
    async save() {
        const result = await this.form.execute(MaterielRAM.getInstance().saveWithError);
        if (result.result) {
            Toast.add({
                message: "Matériel enregistré",
                color: "success",
                closable: true
            });
            if (this.form.item.id == 0) {
                this.router?.navigate('/materiel/' + result.result.id);
            }
            else {
                const ram = MaterielRAM.getInstance();
                this.item = result.result;
                const request = ram.toRequest(result.result);
                this.form.item = request;
                this.objName = this.form.item.nom;
                await this.loadInventaire(this.item.id);
            }
        }
    }
    async destroy() {
        const result = await Confirm.open({
            title: "Confirmation de suppression",
            content: "Êtes-vous sûr de vouloir supprimer le matériel " + this.objName + "?"
        });
        if (result) {
            const ram = MaterielRAM.getInstance();
            const result = await Aventus.Process.execute(ram.deleteByIdWithError(this.slugId));
            if (result) {
                this.router?.navigate("/materiel");
            }
        }
    }
    setToutMonde() {
        this.form.item.tout_monde = true;
    }
    unsetToutMonde() {
        this.form.item.tout_monde = false;
    }
    search() {
        const txt = this.searchEl.value;
        for (let item of this.listItems) {
            if (StringTools.contains(item.inventaire.equipe.nom, txt)) {
                item.style.display = "";
            }
            else if (StringTools.contains(item.inventaire.variation?.nom, txt)) {
                item.style.display = "";
            }
            else {
                item.style.display = "none";
            }
        }
    }
    __7aaf46e464a5fd1841ddce2cf63e5dfemethod3() {
        return this.objName;
    }
    __7aaf46e464a5fd1841ddce2cf63e5dfemethod0() {
        return !this.form.item.tout_monde;
    }
    __7aaf46e464a5fd1841ddce2cf63e5dfemethod1() {
        return this.form.item?.id;
    }
    __7aaf46e464a5fd1841ddce2cf63e5dfemethod4() {
        return this.form.parts.image;
    }
    __7aaf46e464a5fd1841ddce2cf63e5dfemethod5() {
        return this.form.parts.nom;
    }
    __7aaf46e464a5fd1841ddce2cf63e5dfemethod6() {
        return this.form.item.variations;
    }
    __7aaf46e464a5fd1841ddce2cf63e5dfemethod7() {
        return this.form.parts.tout_monde;
    }
    __7aaf46e464a5fd1841ddce2cf63e5dfemethod8() {
        return this.form.item.equipes;
    }
    __7aaf46e464a5fd1841ddce2cf63e5dfemethod9(inventaire) {
        return inventaire;
    }
    __7aaf46e464a5fd1841ddce2cf63e5dfemethod10() {
        return this.item;
    }
}
MaterielDetailsPage.Namespace=`Inventaire`;
MaterielDetailsPage.Tag=`av-materiel-details-page`;
__as1(_, 'MaterielDetailsPage', MaterielDetailsPage);
if(!window.customElements.get('av-materiel-details-page')){window.customElements.define('av-materiel-details-page', MaterielDetailsPage);Aventus.WebComponentInstance.registerDefinition(MaterielDetailsPage);}

const UserEditModal = class UserEditModal extends Modal {
    form;
    static __style = `:host{--col-gap: 12px}:host .title{font-size:var(--font-size-md);margin-bottom:16px}:host av-input{margin-bottom:12px}:host .actions{display:flex;gap:8px;justify-content:center}@media screen and (max-width: 539px){:host{--col-gap: 0px}}`;
    constructor() {
        super();
        this.form = Aventus.Form.Form.create({
            id: {},
            nom: new Aventus.Form.Validators.Required("Le nom est requis"),
            prenom: new Aventus.Form.Validators.Required("Le prénom est requis"),
            nom_utilisateur: new Aventus.Form.Validators.Required("Le nom d'utilisateur est requis"),
            mot_passe: (value, name, fct) => {
                if (this.form.item?.id) {
                    return true;
                }
                return new Aventus.Form.Validators.Required("Le mot de passe est requis").validate(value, "mot_passe", fct);
            }
        });
    }
    __getStatic() {
        return UserEditModal;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(UserEditModal.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="title" _id="usereditmodal_0"></div><av-row>
    <av-col size="12" size_sm="6" use_container="false">
        <av-input label="Nom" _id="usereditmodal_1"></av-input>
    </av-col>
    <av-col size="12" size_sm="6" use_container="false">
        <av-input label="Prénom" _id="usereditmodal_2"></av-input>
    </av-col>
</av-row><av-input label="Nom d'utilisateur" _id="usereditmodal_3"></av-input><av-input label="Mot de passe" _id="usereditmodal_4"></av-input><div class="actions">
    <av-button _id="usereditmodal_5">Annuler</av-button>
    <av-button color="primary" _id="usereditmodal_6">Enregistrer</av-button>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "usereditmodal_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__6848f700f8ec2cc23ac7557213854d62method0())}`,
      "once": true
    }
  },
  "injection": [
    {
      "id": "usereditmodal_1",
      "injectionName": "form",
      "inject": (c) => c.comp.__6848f700f8ec2cc23ac7557213854d62method1(),
      "once": true
    },
    {
      "id": "usereditmodal_2",
      "injectionName": "form",
      "inject": (c) => c.comp.__6848f700f8ec2cc23ac7557213854d62method2(),
      "once": true
    },
    {
      "id": "usereditmodal_3",
      "injectionName": "form",
      "inject": (c) => c.comp.__6848f700f8ec2cc23ac7557213854d62method3(),
      "once": true
    },
    {
      "id": "usereditmodal_4",
      "injectionName": "form",
      "inject": (c) => c.comp.__6848f700f8ec2cc23ac7557213854d62method4(),
      "once": true
    }
  ],
  "pressEvents": [
    {
      "id": "usereditmodal_5",
      "onPress": (e, pressInstance, c) => { c.comp.reject(e, pressInstance); }
    },
    {
      "id": "usereditmodal_6",
      "onPress": (e, pressInstance, c) => { c.comp.submit(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "UserEditModal";
    }
    configure() {
        return { title: "" };
    }
    async submit() {
        const result = await this.form.submit(UserRAM.getInstance().saveWithError);
        if (result?.result) {
            this.resolve(result.result);
        }
    }
    __6848f700f8ec2cc23ac7557213854d62method0() {
        return this.options.title;
    }
    __6848f700f8ec2cc23ac7557213854d62method1() {
        return this.form.parts.nom;
    }
    __6848f700f8ec2cc23ac7557213854d62method2() {
        return this.form.parts.prenom;
    }
    __6848f700f8ec2cc23ac7557213854d62method3() {
        return this.form.parts.nom_utilisateur;
    }
    __6848f700f8ec2cc23ac7557213854d62method4() {
        return this.form.parts.mot_passe;
    }
    static async open(item) {
        const modal = new UserEditModal();
        const ram = UserRAM.getInstance();
        if (item) {
            modal.options.title = "Edition d'un utilisateur";
            modal.form.item = ram.toRequest(item);
        }
        else {
            modal.options.title = "Création d'un utilisateur";
            item = new App.Models.User();
            item.id = 0;
            modal.form.item = ram.toRequest(item);
        }
        return await UserEditModal._show(modal);
    }
}
UserEditModal.Namespace=`Inventaire`;
UserEditModal.Tag=`av-user-edit-modal`;
__as1(_, 'UserEditModal', UserEditModal);
if(!window.customElements.get('av-user-edit-modal')){window.customElements.define('av-user-edit-modal', UserEditModal);Aventus.WebComponentInstance.registerDefinition(UserEditModal);}

const UserItem = class UserItem extends Aventus.WebComponent {
    get 'visible'() { return this.getBoolAttr('visible') }
    set 'visible'(val) { this.setBoolAttr('visible', val) }    get 'item'() {
						return this.__watch["item"];
					}
					set 'item'(val) {
						this.__watch["item"] = val;
					}    __registerWatchesActions() {
    this.__addWatchesActions("item");    super.__registerWatchesActions();
}
    static __style = `:host{align-items:center;border-top:1px solid var(--color-base-300);display:flex;height:50px;padding:0 16px}:host .name{flex-grow:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .actions{display:flex;flex-shrink:0;gap:5px}:host(:first-child){border-top:none}:host(:not([visible])){display:none}`;
    __getStatic() {
        return UserItem;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(UserItem.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="name" _id="useritem_0"></div><div class="actions">
    <av-icon-action color="neutral" icon="edit" _id="useritem_1">Edition</av-icon-action>
    <av-icon-action color="error" icon="delete" _id="useritem_2">Suppression</av-icon-action>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "content": {
    "useritem_0°@HTML": {
      "fct": (c) => `${c.print(c.comp.__aa7685060d08c91a01589bc6f0dde99dmethod0())} ${c.print(c.comp.__aa7685060d08c91a01589bc6f0dde99dmethod1())}`,
      "once": true
    }
  },
  "pressEvents": [
    {
      "id": "useritem_1",
      "onPress": (e, pressInstance, c) => { c.comp.editItem(e, pressInstance); }
    },
    {
      "id": "useritem_2",
      "onPress": (e, pressInstance, c) => { c.comp.deleteItem(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "UserItem";
    }
    __defaultValues() { super.__defaultValues(); if(!this.hasAttribute('visible')) { this.attributeChangedCallback('visible', false, false); } }
    __defaultValuesWatch(w) { super.__defaultValuesWatch(w); w["item"] = undefined; }
    __upgradeAttributes() { super.__upgradeAttributes(); this.__upgradeProperty('visible');this.__correctGetter('item'); }
    __listBoolProps() { return ["visible"].concat(super.__listBoolProps()).filter((v, i, a) => a.indexOf(v) === i); }
    async editItem() {
        await UserEditModal.open(this.item);
    }
    async deleteItem() {
        const result = await Confirm.open({
            title: "Confirmation de suppression",
            content: "Êtes-vous sûr de vouloir supprimer cet utilisateur?"
        });
        if (result) {
            await UserRAM.getInstance().delete(this.item);
        }
    }
    __aa7685060d08c91a01589bc6f0dde99dmethod0() {
        return this.item.nom;
    }
    __aa7685060d08c91a01589bc6f0dde99dmethod1() {
        return this.item.prenom;
    }
}
UserItem.Namespace=`Inventaire`;
UserItem.Tag=`av-user-item`;
__as1(_, 'UserItem', UserItem);
if(!window.customElements.get('av-user-item')){window.customElements.define('av-user-item', UserItem);Aventus.WebComponentInstance.registerDefinition(UserItem);}

const UsersPage = class UsersPage extends PageFull {
    list = [];
    static __style = `:host .card{background-color:var(--color-base-100);border-radius:var(--radius-box);box-shadow:var(--elevation-2);display:flex;flex-direction:column;max-height:100%;padding:24px;width:100%}:host .card .header{align-items:center;display:flex;flex-shrink:0;gap:24px;height:50px;justify-content:space-between;margin-bottom:24px}:host .card .header .title{font-size:var(--font-size-md)}:host .card .header .actions{align-items:center;display:flex;gap:24px}:host .card .header .actions av-input{max-width:300px}:host .card .body{flex-grow:1;min-height:0;width:100%}:host .card .body .list{border:1px solid var(--color-base-300);border-radius:var(--radius-field);width:100%}@media screen and (max-width: 650px){:host .card{position:relative}:host .card .header{flex-wrap:wrap;height:auto}:host .card .header .title{width:100%}:host .card .header .actions{width:100%}:host .card .header .actions av-input{max-width:none;width:100%}:host .card .header .actions av-button{position:absolute;right:16px;top:16px}}`;
    constructor() {
        super();
        this.onNewData = this.onNewData.bind(this);
        this.onRemoveData = this.onRemoveData.bind(this);
    }
    __getStatic() {
        return UsersPage;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(UsersPage.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="card">
    <div class="header">
        <div class="title">Liste des utilisateurs</div>
        <div class="actions">
            <av-input placeholder="Recherche" _id="userspage_0"></av-input>
            <av-button color="primary" _id="userspage_1">Ajouter</av-button>
        </div>
    </div>
    <av-scrollable class="body" floating_scroll auto_hide>
        <div class="list" _id="userspage_2">
        </div>
    </av-scrollable>
</div>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "searchEl",
      "ids": [
        "userspage_0"
      ]
    },
    {
      "name": "listEl",
      "ids": [
        "userspage_2"
      ]
    }
  ],
  "events": [
    {
      "eventName": "onChange",
      "id": "userspage_0",
      "fct": (c, ...args) => c.comp.search.apply(c.comp, ...args),
      "isCallback": true
    }
  ],
  "pressEvents": [
    {
      "id": "userspage_1",
      "onPress": (e, pressInstance, c) => { c.comp.add(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "UsersPage";
    }
    configure() {
        return {};
    }
    search() {
        if (this.searchEl.value) {
            for (let item of this.list) {
                item.visible = StringTools.contains(item.item.nom_utilisateur, this.searchEl.value);
            }
        }
        else {
            for (let item of this.list) {
                item.visible = true;
            }
        }
    }
    async add() {
        await UserEditModal.open();
    }
    async bindData() {
        let list = await UserRAM.getInstance().getList();
        list.sort((a, b) => a.nom.localeCompare(a.nom));
        for (let item of list) {
            let el = new UserItem();
            el.item = item;
            el.visible = this.searchEl.value ? StringTools.contains(item.nom_utilisateur, this.searchEl.value) : true;
            this.listEl.appendChild(el);
            this.list.push(el);
        }
        UserRAM.getInstance().onCreated(this.onNewData);
        UserRAM.getInstance().onUpdated(this.onNewData);
        UserRAM.getInstance().onDeleted(this.onRemoveData);
    }
    onNewData(user) {
        let itemBefore = undefined;
        for (let item of this.list) {
            if (itemBefore == null && user.nom.localeCompare(item.item.nom) < 0) {
                itemBefore = item;
            }
            if (item.item.id == user.id) {
                item.item = user;
                Aventus.Watcher.trigger("UPDATED", item.item);
                return;
            }
        }
        let el = new UserItem();
        el.item = user;
        el.visible = this.searchEl.value ? StringTools.contains(user.nom_utilisateur, this.searchEl.value) : true;
        if (itemBefore) {
            let index = this.list.indexOf(itemBefore);
            this.list.splice(index, 0, el);
            this.listEl.insertBefore(el, itemBefore);
        }
        else {
            this.list.push(el);
            this.listEl.appendChild(el);
        }
    }
    onRemoveData(user) {
        for (let item of this.list) {
            if (item.item.id == user.id) {
                item.remove();
                let index = this.list.indexOf(item);
                this.list.splice(index, 1);
                return;
            }
        }
    }
    postCreation() {
        super.postCreation();
        this.bindData();
    }
}
UsersPage.Namespace=`Inventaire`;
UsersPage.Tag=`av-users-page`;
__as1(_, 'UsersPage', UsersPage);
if(!window.customElements.get('av-users-page')){window.customElements.define('av-users-page', UsersPage);Aventus.WebComponentInstance.registerDefinition(UsersPage);}

const Main = class Main extends Aventus.Navigation.Router {
    static instance;
    static __style = `:host{display:flex;flex-direction:column;height:100%;width:100%}:host .content{flex-grow:1;min-height:0;position:relative;width:100%;z-index:1}`;
    __getStatic() {
        return Main;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(Main.__style);
        return arrStyle;
    }
    __getHtml() {super.__getHtml();
    this.__getStatic().__template.setHTML({
        blocks: { 'before':`
    <av-header></av-header>
` }
    });
}
    getClassName() {
        return "Main";
    }
    defineRoutes() {
        this.addRoute("/", EquipesPage);
        this.addRoute("/equipes/{id:number}", EquipeDetailsPage);
        this.addRoute("/materiel", MaterielPage);
        this.addRoute("/materiel/{id:number}", MaterielDetailsPage);
        this.addRoute("/utilisateurs", UsersPage);
    }
    getSlugs(pattern) {
        if (!pattern)
            return super.getSlugs();
        return this.stateManager.getStateSlugs(pattern);
    }
    addPWA() {
        PWA.addOnInit(async () => {
            if (Platform.device != "pc") {
                if (localStorage.getItem("pwa_ask_install") == null) {
                    localStorage.setItem("pwa_ask_install", "done");
                    const p = new PwaPromptInstall();
                    p.show();
                }
            }
        });
    }
    postCreation() {
        super.postCreation();
        Main.instance = this;
        Aventus.Toast.ToastManager.configure({
            defaultDelay: 5000,
            defaultPosition: "top right",
            defaultToast: Toast,
            heightLimitPercent: 100,
        });
        Aventus.Modal.ModalElement.configure({
            closeWithClick: false
        });
        Aventus.Form.Form.configure({
            handleExecuteNoInputError: (errors) => {
                if (errors.length > 0) {
                    let msg = errors.map(p => p.message.replace(/\n/g, '<br/>')).join("<br/>");
                    Alert.open({
                        title: "Execution error",
                        content: msg,
                    });
                }
            },
            handleValidateNoInputError: (errors) => {
                const li = [];
                for (let key in errors) {
                    if (errors[key]) {
                        for (let msg of errors[key]) {
                            li.push(`<li>${key} : ${msg}</li>`);
                        }
                    }
                }
                Alert.open({
                    title: "Form validation error",
                    content: `<p>The form can't be validated because of :</p><ul>${li.join("")}</ul>`
                });
            }
        });
        Aventus.HttpRequest.configure({
            beforeSend: (request) => {
                const result = new Aventus.VoidWithError();
                // request.setCredentials("include");
                // if(this.indexResource.user) {
                //     request.setHeader("Authorization", "Bearer " + this.bearer);
                // }
                return result;
            },
            responseMiddleware: (response, request) => {
                if (response.containsCode(401)) {
                    location.reload();
                }
                return response;
            }
        });
        Aventus.Process.configure({
            handleErrors: (msg) => {
                Alert.open({
                    title: "Execution error",
                    content: msg,
                });
            }
        });
        Aventus.Navigation.Router.configure({
            destroyPage: true,
        });
        this.addPWA();
    }
}
Main.Namespace=`Inventaire`;
Main.Tag=`av-main`;
__as1(_, 'Main', Main);
if(!window.customElements.get('av-main')){window.customElements.define('av-main', Main);Aventus.WebComponentInstance.registerDefinition(Main);}

const EquipeTags = class EquipeTags extends Aventus.WebComponent {
    equipes = [];
    static __style = `:host{display:flex;flex-wrap:wrap;gap:6px}:host .list{display:flex;flex-wrap:wrap;gap:6px}`;
    constructor() {
        super();
        this.onChildDelete = this.onChildDelete.bind(this);
    }
    __getStatic() {
        return EquipeTags;
    }
    __getStyle() {
        let arrStyle = super.__getStyle();
        arrStyle.push(EquipeTags.__style);
        return arrStyle;
    }
    __getHtml() {
    this.__getStatic().__template.setHTML({
        blocks: { 'default':`<div class="list" _id="equipetags_0">
</div><av-icon-action class="more" icon="add" _id="equipetags_1">Ajouter une équipe</av-icon-action>` }
    });
}
    __registerTemplateAction() { super.__registerTemplateAction();this.__getStatic().__template.setActions({
  "elements": [
    {
      "name": "listEl",
      "ids": [
        "equipetags_0"
      ]
    }
  ],
  "pressEvents": [
    {
      "id": "equipetags_1",
      "onPress": (e, pressInstance, c) => { c.comp.addEquipe(e, pressInstance); }
    }
  ]
}); }
    getClassName() {
        return "EquipeTags";
    }
    onChildDelete(el) {
        let children = Array.from(this.listEl.children);
        let index = children.indexOf(el);
        this.equipes.splice(index, 1);
        this.listEl.removeChild(el);
    }
    render() {
        this.listEl.innerHTML = "";
        for (let equipe of this.equipes) {
            let el = new EquipeTag();
            el.equipe_id = equipe.id_equipe;
            el.onDelete.add(this.onChildDelete);
            this.listEl.appendChild(el);
        }
    }
    async addEquipe() {
        const p = new ModalEquipe();
        const equipe = await p.show();
        if (equipe !== null) {
            let materielEquipe = new App.Models.MaterielEquipe();
            materielEquipe.id_equipe = equipe.id;
            materielEquipe.equipe = equipe;
            this.equipes.push(materielEquipe);
            let el = new EquipeTag();
            el.equipe_id = materielEquipe.id_equipe;
            el.onDelete.add(this.onChildDelete);
            this.listEl.appendChild(el);
        }
    }
    postCreation() {
        this.render();
    }
}
EquipeTags.Namespace=`Inventaire`;
EquipeTags.Tag=`av-equipe-tags`;
__as1(_, 'EquipeTags', EquipeTags);
if(!window.customElements.get('av-equipe-tags')){window.customElements.define('av-equipe-tags', EquipeTags);Aventus.WebComponentInstance.registerDefinition(EquipeTags);}


for(let key in _) { Inventaire[key] = _[key] }
})(Inventaire);

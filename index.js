import Vue from "vue"

const ConstState = {
    MIX: "mixin"
}
let initState = false;

let shortcut = {
    setPage: null,
    getPage: null,
    sunlib: null,
}

let compManGOLOpts = {
    root: "app",
    methodsLibName: "compManGOL"
}

const created = function () {

    let opts = this.$options, compName = opts.name;

    opts.name && this.$lib_set(compName, this);

    opts.name == compManGOLOpts.root &&   shortcut.setPage(this);

    this.onshow = _show.bind(this);

    this.onleave = _leave.bind(this);

    shortcut.sunlib.tirrgerEvent(compName, this)
}

const _config = {created}

const _show = function () {
    let show = this.$options.onshow
    show && show.apply(this, arguments)
}

const _leave = function () {
    let leave = this.$options.onleave
    leave && leave.apply(this, arguments)
}

const install = $V => $V[ConstState.MIX](_config);

const issueOption = function (options, to) {
    let global = window._getPage();
    if (!global) return;
    let pageOption = options.pageOption; // TODO：页面差异处理
    let globalHookFns = global[compManGOLOpts.methodsLibName]();
    Object.keys(globalHookFns).forEach(key => globalHookFns[key].call(global,to) )
}

const initGlobalLib = ($V) => {
    !window._sunComponentsLib_v1 && (shortcut.sunlib = window._sunComponentsLib_v1 = (() => {
        let componentsLib = {};
        let eventQueue = {};
        return {
            pushEvent: function (page, hook, query) {
                let events = eventQueue[page];
                let hookObj = {hook,query}

                if (!events) {
                    eventQueue[page] = hookObj;
                    return
                }

                if (typeof events == 'object') {
                    eventQueue[page] = [events, hookObj];
                    return
                }

                if (Array.isArray(events)) {
                    events.push(hookObj);
                }

            },
            tirrgerEvent: function (page, currentCom) {
                if (!page) return;
                let events = eventQueue[page];

                if (!events) return;

                if (Array.isArray(events)) {
                    events.forEach(event => currentCom[event.hook] && currentCom[event.hook](event.query));
                    delete eventQueue[page];
                    return
                }

                if (typeof events == 'object') {
                    currentCom[events.hook] && currentCom[events.hook](events.query);
                    delete eventQueue[page];
                    return
                }

            },
            getCom: name => componentsLib[name],
            setCom: (name, component) => componentsLib[name] = component
        }
    })());
    $V.prototype.$lib_set = window._sunComponentsLib_v1.setCom;
    $V.prototype.$lib_get = window._sunComponentsLib_v1.getCom;
    $V.prototype.$getGloabl = () => window._getPage();
}

const _ForEach = router => {
    let routerForEach = router.beforeEach;
    router.beforeEach = function (eachFn) {
        let eachTampFn = function (to, from, next) {
            let metaData = to.matched[0].meta || {}
            let pageOption = {
                pageOption: metaData.pageOption
            }
            let options = Object.assign({}, pageOption)
            next = lib_next(to, from, next, options);
            eachFn.apply(this, [to, from, next])
        }
        routerForEach.call(this, eachTampFn)
    }
}

const createGuard = () => {return {install}}

const lib_next = function (to, from, next, options) {
    return (path, noOpts) => {
        let comTo = window._sunComponentsLib_v1.getCom(to.name);
        let comFrom = window._sunComponentsLib_v1.getCom(from.name);

        if (!comTo) {
            window._sunComponentsLib_v1.pushEvent(to.name, "onshow", to.query);
            comTo = {};
        };

        if (!comFrom) {
            window._sunComponentsLib_v1.pushEvent(to.name, "onleave", to.query);
            comFrom = {};
        }

        comTo.onshow && comTo.onshow(to.query);
        comFrom.onleave && comFrom.onleave(to.name);

        !noOpts && options && issueOption(options, to);

        next(path || undefined);
    }
}

export default function (router) {
    let $V = Vue;
    if (initState) return;
    shortcut.setPage = window._setPage = VMpage => window._global__page = VMpage;
    shortcut.getPage = window._getPage = () => window._global__page;
    initGlobalLib($V)
    $V.use(createGuard());
    initState = true;
    _ForEach(router);
    return {
        config: options => {
            if (!options || options.constructor.name !== "Object") return;
            Object.keys(compManGOLOpts).forEach(key => options[key] && (compManGOLOpts[key] = options[key]))
        }
    }
}

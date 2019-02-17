import Sidebar from 'scanex-sidebar';

let SidebarControl = L.Control.extend({
    includes: L.Evented ? L.Evented.prototype : L.Mixin.Events,
    
    initialize: function(options) {
        L.setOptions(this, options);        
    },

    enable: function (id) {
        this._sidebar.enable (id);
    },

    enabled: function (id) {        
        return this._sidebar.enabled (id);
    },

    disable: function (id) {
        this._sidebar.disable (id);
    },

    getCurrent: function () {
        return this._sidebar.current;
    },

    setCurrent: function (current) { 
        this._sidebar.current = current;
    },

    addTab: function({id, icon, opened, closed, tooltip, enabled}) {
        return this._sidebar.addTab({id, icon, opened, closed, tooltip, enabled});        
    },

    removeTab: function (id) {
        this._sidebar.removeTab (id);
    },

    getPane: function (id) {
	return this._sidebar.getPane(id);
    },

    onAdd: function(map) {
        this._container = L.DomUtil.create('div');
        const stop = L.DomEvent.stopPropagation;
        const fakeStop = L.DomEvent._fakeStop || stop;
        L.DomEvent
         .on(this._container, 'contextmenu', stop)
         .on(this._container, 'click', fakeStop)
         .on(this._container, 'mousedown', stop)
         .on(this._container, 'touchstart', stop)
         .on(this._container, 'dblclick', fakeStop)
         .on(this._container, 'mousewheel', stop)
         .on(this._container, 'MozMousePixelScroll', stop);
        const {position} = this.options;
		this._sidebar = new Sidebar(this._container, {position: (position === 'topleft' || position === 'bottomleft') ? 'left' : 'right' });
        this._sidebar.addEventListener('change', e => {
            this.fire ('change', e);
        });
        return this._container;
    },

    addTo: function(map) {
        L.Control.prototype.addTo.call(this, map);
        if (this.options.addBefore) {
            this.addBefore(this.options.addBefore);
        }
        return this;
    },

    addBefore: function(id) {
        let parentNode = this._parent && this._parent._container;
        if (!parentNode) {
            parentNode = this._map && this._map._controlCorners[this.getPosition()];
        }
        if (!parentNode) {
            this.options.addBefore = id;
        }
        else {
            for (let i = 0, len = parentNode.childNodes.length; i < len; i++) {
                let it = parentNode.childNodes[i];
                if (id === it._id) {
                    parentNode.insertBefore(this._container, it);
                    break;
                }
            }
        }
        return this;
    },    
});

export default SidebarControl;
/*
 * Ext JS Library 2.3.0
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class Ext2.form.Checkbox
 * @extends Ext2.form.Field
 * Single checkbox field.  Can be used as a direct replacement for traditional checkbox fields.
 * @constructor
 * Creates a new Checkbox
 * @param {Object} config Configuration options
 */
Ext2.form.Checkbox = Ext2.extend(Ext2.form.Field,  {
    /**
     * @cfg {String} checkedCls The CSS class to use when the control is checked (defaults to 'x2-form-check-checked').
     * Note that this class applies to both checkboxes and radio buttons and is added to the control's wrapper element.
     */
    checkedCls: 'x2-form-check-checked',
    /**
     * @cfg {String} focusCls The CSS class to use when the control receives input focus (defaults to 'x2-form-check-focus').
     * Note that this class applies to both checkboxes and radio buttons and is added to the control's wrapper element.
     */
    focusCls: 'x2-form-check-focus',
    /**
     * @cfg {String} overCls The CSS class to use when the control is hovered over (defaults to 'x2-form-check-over').
     * Note that this class applies to both checkboxes and radio buttons and is added to the control's wrapper element.
     */
    overCls: 'x2-form-check-over',
    /**
     * @cfg {String} mouseDownCls The CSS class to use when the control is being actively clicked (defaults to 'x2-form-check-down').
     * Note that this class applies to both checkboxes and radio buttons and is added to the control's wrapper element.
     */
    mouseDownCls: 'x2-form-check-down',
    /**
     * @cfg {Number} tabIndex The tabIndex for this field. Note this only applies to fields that are rendered,
     * not those which are built via applyTo (defaults to 0, which allows the browser to manage the tab index).
     */
    tabIndex: 0,
    /**
     * @cfg {Boolean} checked True if the checkbox should render already checked (defaults to false)
     */
    checked: false,
    /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "checkbox", autocomplete: "off"}).
     */
    defaultAutoCreate: {tag: 'input', type: 'checkbox', autocomplete: 'off'},
    /**
     * @cfg {String} boxLabel The text that appears beside the checkbox (defaults to '')
     */
    /**
     * @cfg {String} inputValue The value that should go into the generated input element's value attribute
     * (defaults to undefined, with no value attribute)
     */
    /**
     * @cfg {Function} handler A function called when the {@link #checked} value changes (can be used instead of 
     * handling the check event). The handler is passed the following parameters:
     * <div class="mdetail-params"><ul>
     * <li><b>checkbox</b> : Ext2.form.Checkbox<div class="sub-desc">The Checkbox being toggled.</div></li>
     * <li><b>checked</b> : Boolean<div class="sub-desc">The new checked state of the checkbox.</div></li>
     * </ul></div>
     */
    /**
     * @cfg {Object} scope An object to use as the scope ("this" reference) of the {@link #handler} function
     * (defaults to this Checkbox).
     */

    // private
    actionMode: 'wrap',
    
    // private
    baseCls: 'x2-form-check',

    // private
    initComponent : function(){
        Ext2.form.Checkbox.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event check
             * Fires when the checkbox is checked or unchecked.
             * @param {Ext2.form.Checkbox} this This checkbox
             * @param {Boolean} checked The new checked value
             */
            'check'
        );
    },

    // private
    initEvents : function(){
        Ext2.form.Checkbox.superclass.initEvents.call(this);
        this.initCheckEvents();
    },

    // private
    initCheckEvents : function(){
        this.innerWrap.removeAllListeners();
        this.innerWrap.addClassOnOver(this.overCls);
        this.innerWrap.addClassOnClick(this.mouseDownCls);
        this.innerWrap.on('click', this.onClick, this);
        this.innerWrap.on('keyup', this.onKeyUp, this);
    },

    // private
    onRender : function(ct, position){
        Ext2.form.Checkbox.superclass.onRender.call(this, ct, position);
        if(this.inputValue !== undefined){
            this.el.dom.value = this.inputValue;
        }
        this.el.addClass('x2-hidden');

        this.innerWrap = this.el.wrap({
            tabIndex: this.tabIndex,
            cls: this.baseCls+'-wrap-inner'
        });
        this.wrap = this.innerWrap.wrap({cls: this.baseCls+'-wrap'});

        if(this.boxLabel){
            this.labelEl = this.innerWrap.createChild({
                tag: 'label',
                htmlFor: this.el.id,
                cls: 'x2-form-cb-label',
                html: this.boxLabel
            });
        }

        this.imageEl = this.innerWrap.createChild({
            tag: 'img',
            src: Ext2.BLANK_IMAGE_URL,
            cls: this.baseCls
        }, this.el);

        if(this.checked){
            this.setValue(true);
        }else{
            this.checked = this.el.dom.checked;
        }
        this.originalValue = this.checked;
    },
    
    // private
    afterRender : function(){
        Ext2.form.Checkbox.superclass.afterRender.call(this);
        this.wrap[this.checked? 'addClass' : 'removeClass'](this.checkedCls);
    },

    // private
    onDestroy : function(){
        if(this.rendered){
            Ext2.destroy(this.imageEl, this.labelEl, this.innerWrap, this.wrap);
        }
        Ext2.form.Checkbox.superclass.onDestroy.call(this);
    },

    // private
    onFocus: function(e) {
        Ext2.form.Checkbox.superclass.onFocus.call(this, e);
        this.el.addClass(this.focusCls);
    },

    // private
    onBlur: function(e) {
        Ext2.form.Checkbox.superclass.onBlur.call(this, e);
        this.el.removeClass(this.focusCls);
    },

    // private
    onResize : function(){
        Ext2.form.Checkbox.superclass.onResize.apply(this, arguments);
        if(!this.boxLabel && !this.fieldLabel){
            this.el.alignTo(this.wrap, 'c-c');
        }
    },

    // private
    onKeyUp : function(e){
        if(e.getKey() == Ext2.EventObject.SPACE){
            this.onClick(e);
        }
    },

    // private
    onClick : function(e){
        if (!this.disabled && !this.readOnly) {
            this.toggleValue();
        }
        e.stopEvent();
    },

    // private
    onEnable : function(){
        Ext2.form.Checkbox.superclass.onEnable.call(this);
        this.initCheckEvents();
    },

    // private
    onDisable : function(){
        Ext2.form.Checkbox.superclass.onDisable.call(this);
        this.innerWrap.removeAllListeners();
    },

    toggleValue : function(){
        this.setValue(!this.checked);
    },

    // private
    getResizeEl : function(){
        if(!this.resizeEl){
            this.resizeEl = Ext2.isWebKit ? this.wrap : (this.wrap.up('.x2-form-element', 5) || this.wrap);
        }
        return this.resizeEl;
    },

    // private
    getPositionEl : function(){
        return this.wrap;
    },

    /**
     * Overridden and disabled. The editor element does not support standard valid/invalid marking. @hide
     * @method
     */
    markInvalid : Ext2.emptyFn,
    /**
     * Overridden and disabled. The editor element does not support standard valid/invalid marking. @hide
     * @method
     */
    clearInvalid : Ext2.emptyFn,

    // private
    initValue: function(){
        this.originalValue = this.getValue();
    },

    /**
     * Returns the checked state of the checkbox.
     * @return {Boolean} True if checked, else false
     */
    getValue : function(){
        if(this.rendered){
            return this.el.dom.checked;
        }
        return this.checked;
    },

    /**
     * Sets the checked state of the checkbox.
     * @param {Boolean/String} checked True, 'true', '1', or 'on' to check the checkbox, any other value will uncheck it.
     */
    setValue : function(v) {
        var checked = this.checked;
        this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() == 'on');
        
        if(this.rendered){
            this.el.dom.checked = this.checked;
            this.el.dom.defaultChecked = this.checked;
            this.wrap[this.checked? 'addClass' : 'removeClass'](this.checkedCls);
        }

        if(checked != this.checked){
            this.fireEvent("check", this, this.checked);
            if(this.handler){
                this.handler.call(this.scope || this, this, this.checked);
            }
        }
    }

    /**
     * @cfg {Mixed} value
     * @hide
     */
    /**
     * @cfg {String} disabledClass
     * @hide
     */
    /**
     * @cfg {String} focusClass
     * @hide
     */
});
Ext2.reg('checkbox', Ext2.form.Checkbox);

/*
 * Ext JS Library 2.3.0
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class Ext2.layout.FormLayout
 * @extends Ext2.layout.AnchorLayout
 * <p>This layout manager is specifically designed for rendering and managing child Components of forms.
 * It is responsible for rendering the labels of {@link Ext2.form.Field Field}s.</p>
 * <p>This layout manager is used when a Container is configured with the layout:'form' {@link Ext2.Container#layout layout} config,
 * and should generally not need to be created directly via the new keyword. In an application,
 * it will usually be preferrable to use a {@link Ext2.form.FormPanel FormPanel} (which automatically uses FormLayout as its layout
 * class) since it also provides built-in functionality for loading, validating and submitting the form.</p>
 * <p>Note that when creating a layout via config, the layout-specific config properties must be passed in via
 * the {@link Ext2.Container#layoutConfig layoutConfig} object which will then be applied internally to the layout.</p>
 * <p>The {@link Ext2.Container Container} <i>using</i> the FormLayout can also accept the following layout-specific config
 * properties:
 * <div class="mdetail-params"><ul>
 * <li><b>hideLabels</b>: (Boolean)<div class="sub-desc">True to hide field labels by default (defaults to false)</div></li>
 * <li><b>labelAlign</b>: (String)<div class="sub-desc">The default label alignment.  The default value is empty string ''
 * for left alignment, but specifying 'top' will align the labels above the fields.</div></li>
 * <li><b>labelPad</b>: (Number)<div class="sub-desc">The default padding in pixels for field labels (defaults to 5).  labelPad only
 * applies if labelWidth is also specified, otherwise it will be ignored.</div></li>
 * <li><b>labelWidth</b>: (Number)<div class="sub-desc">The default width in pixels of field labels (defaults to 100)</div></li>
 * </ul></div></p>
 * <p>Any type of components can be added to a FormLayout, but items that inherit from {@link Ext2.form.Field}
 * can also supply the following field-specific config properties:
 * <div class="mdetail-params"><ul>
 * <li><b>clearCls</b>: (String)<div class="sub-desc">The CSS class to apply to the special clearing div rendered directly after each
 * form field wrapper (defaults to 'x2-form-clear-left')</div></li>
 * <li><b>fieldLabel</b>: (String)<div class="sub-desc">The text to display as the label for this field (defaults to '')</div></li>
 * <li><b>hideLabel</b>: (Boolean)<div class="sub-desc">True to hide the label and separator for this field (defaults to false).</div></li>
 * <li><b>itemCls</b>: (String)<div class="sub-desc">A CSS class to add to the div wrapper that contains this field label
 * and field element (the default class is 'x2-form-item' and itemCls will be added to that).  If supplied,
 * itemCls at the field level will override the default itemCls supplied at the container level.</div></li>
 * <li><b>labelSeparator</b>: (String)<div class="sub-desc">The separator to display after the text of the label for this field
 * (defaults to a colon ':' or the layout's value for {@link #labelSeparator}).  To hide the separator use empty string ''.</div></li>
 * <li><b>labelStyle</b>: (String)<div class="sub-desc">A CSS style specification string to add to the field label for this field
 * (defaults to '' or the layout's value for {@link #labelStyle}).</div></li>
 * </ul></div></p>
 * Example usage:</p>
 * <pre><code>
// Required if showing validation messages
Ext2.QuickTips.init();

// While you can create a basic Panel with layout:'form', practically
// you should usually use a FormPanel to also get its form functionality
// since it already creates a FormLayout internally.
var form = new Ext2.form.FormPanel({
    labelWidth: 75,
    title: 'Form Layout',
    bodyStyle:'padding:15px',
    width: 350,
    labelPad: 10,
    defaultType: 'textfield',
    defaults: {
        // applied to each contained item
        width: 230,
        msgTarget: 'side'
    },
    layoutConfig: {
        // layout-specific configs go here
        labelSeparator: ''
    },
    items: [{
            fieldLabel: 'First Name',
            name: 'first',
            allowBlank: false
        },{
            fieldLabel: 'Last Name',
            name: 'last'
        },{
            fieldLabel: 'Company',
            name: 'company'
        },{
            fieldLabel: 'Email',
            name: 'email',
            vtype:'email'
        }
    ],
    buttons: [{
        text: 'Save'
    },{
        text: 'Cancel'
    }]
});
</code></pre>
 */
Ext2.layout.FormLayout = Ext2.extend(Ext2.layout.AnchorLayout, {
    /**
     * @cfg {String} labelSeparator
     * The standard separator to display after the text of each form label (defaults to a colon ':').  To turn off
     * separators for all fields in this layout by default specify empty string '' (if the labelSeparator value is
     * explicitly set at the field level, those will still be displayed).
     */
    labelSeparator : ':',

    // private
    getAnchorViewSize : function(ct, target){
        return (ct.body||ct.el).getStyleSize();
    },

    // private
    setContainer : function(ct){
        Ext2.layout.FormLayout.superclass.setContainer.call(this, ct);

        if(ct.labelAlign){
            ct.addClass('x2-form-label-'+ct.labelAlign);
        }

        if(ct.hideLabels){
            this.labelStyle = "display:none";
            this.elementStyle = "padding-left:0;";
            this.labelAdjust = 0;
        }else{
            this.labelSeparator = ct.labelSeparator || this.labelSeparator;
            ct.labelWidth = ct.labelWidth || 100;
            if(typeof ct.labelWidth == 'number'){
                var pad = (typeof ct.labelPad == 'number' ? ct.labelPad : 5);
                this.labelAdjust = ct.labelWidth+pad;
                this.labelStyle = "width:"+ct.labelWidth+"px;";
                this.elementStyle = "padding-left:"+(ct.labelWidth+pad)+'px';
            }
            if(ct.labelAlign == 'top'){
                this.labelStyle = "width:auto;";
                this.labelAdjust = 0;
                this.elementStyle = "padding-left:0;";
            }
        }

        if(!this.fieldTpl){
            // the default field template used by all form layouts
            var t = new Ext2.Template(
                '<div class="x2-form-item {5}" tabIndex="-1">',
                    '<label for="{0}" style="{2}" class="x2-form-item-label">{1}{4}</label>',
                    '<div class="x2-form-element" id="x2-form-el-{0}" style="{3}">',
                    '</div><div class="{6}"></div>',
                '</div>'
            );
            t.disableFormats = true;
            t.compile();
            Ext2.layout.FormLayout.prototype.fieldTpl = t;
        }
    },
    
    //private
    getLabelStyle: function(s){
        var ls = '', items = [this.labelStyle, s];
        for (var i = 0, len = items.length; i < len; ++i){
            if (items[i]){
                ls += items[i];
                if (ls.substr(-1, 1) != ';'){
                    ls += ';'
                }
            }
        }
        return ls;
    },

    // private
    renderItem : function(c, position, target){
        if(c && !c.rendered && c.isFormField && c.inputType != 'hidden'){
            var args = [
                   c.id, c.fieldLabel,
                   this.getLabelStyle(c.labelStyle),
                   this.elementStyle||'',
                   typeof c.labelSeparator == 'undefined' ? this.labelSeparator : c.labelSeparator,
                   (c.itemCls||this.container.itemCls||'') + (c.hideLabel ? ' x2-hide-label' : ''),
                   c.clearCls || 'x2-form-clear-left' 
            ];
            if(typeof position == 'number'){
                position = target.dom.childNodes[position] || null;
            }
            if(position){
                this.fieldTpl.insertBefore(position, args);
            }else{
                this.fieldTpl.append(target, args);
            }
            c.render('x2-form-el-'+c.id);
        }else {
            Ext2.layout.FormLayout.superclass.renderItem.apply(this, arguments);
        }
    },

    // private
    adjustWidthAnchor : function(value, comp){
        return value - (comp.isFormField  ? (comp.hideLabel ? 0 : this.labelAdjust) : 0);
    },

    // private
    isValidParent : function(c, target){
        return true;
    }

    /**
     * @property activeItem
     * @hide
     */
});

Ext2.Container.LAYOUTS['form'] = Ext2.layout.FormLayout;

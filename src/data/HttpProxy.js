/*
 * Ext JS Library 2.3.0
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class Ext2.data.HttpProxy
 * @extends Ext2.data.DataProxy
 * An implementation of {@link Ext2.data.DataProxy} that reads a data object from a {@link Ext2.data.Connection Connection} object
 * configured to reference a certain URL.<br>
 * <p>
 * <b>Note that this class cannot be used to retrieve data from a domain other than the domain
 * from which the running page was served.<br>
 * <p>
 * For cross-domain access to remote data, use a {@link Ext2.data.ScriptTagProxy ScriptTagProxy}.</b><br>
 * <p>
 * Be aware that to enable the browser to parse an XML document, the server must set
 * the Content-Type header in the HTTP response to "text/xml".
 * @constructor
 * @param {Object} conn an {@link Ext2.data.Connection} object, or options parameter to {@link Ext2.Ajax#request}.
 * If an options parameter is passed, the singleton {@link Ext2.Ajax} object will be used to make the request.
 */
Ext2.data.HttpProxy = function(conn){
    Ext2.data.HttpProxy.superclass.constructor.call(this);
    /**
     * The Connection object (Or options parameter to {@link Ext2.Ajax#request}) which this HttpProxy uses to make requests to the server.
     * Properties of this object may be changed dynamically to change the way data is requested.
     * @property
     */
    this.conn = conn;
    this.useAjax = !conn || !conn.events;

    /**
     * @event loadexception
     * Fires if an exception occurs in the Proxy during data loading.  This event can be fired for one of two reasons:
     * <ul><li><b>The load call returned success: false.</b>  This means the server logic returned a failure
     * status and there is no data to read.  In this case, this event will be raised and the
     * fourth parameter (read error) will be null.</li>
     * <li><b>The load succeeded but the reader could not read the response.</b>  This means the server returned
     * data, but the configured Reader threw an error while reading the data.  In this case, this event will be 
     * raised and the caught error will be passed along as the fourth parameter of this event.</li></ul>
     * Note that this event is also relayed through {@link Ext2.data.Store}, so you can listen for it directly
     * on any Store instance.
     * @param {Object} this
     * @param {Object} options The loading options that were specified (see {@link #load} for details)
     * @param {Object} response The XMLHttpRequest object containing the response data
     * @param {Error} e The JavaScript Error object caught if the configured Reader could not read the data.
     * If the load call returned success: false, this parameter will be null.
     */
};

Ext2.extend(Ext2.data.HttpProxy, Ext2.data.DataProxy, {
    /**
     * Return the {@link Ext2.data.Connection} object being used by this Proxy.
     * @return {Connection} The Connection object. This object may be used to subscribe to events on
     * a finer-grained basis than the DataProxy events.
     */
    getConnection : function(){
        return this.useAjax ? Ext2.Ajax : this.conn;
    },

    /**
     * Load data from the configured {@link Ext2.data.Connection}, read the data object into
     * a block of Ext2.data.Records using the passed {@link Ext2.data.DataReader} implementation, and
     * process that block using the passed callback.
     * @param {Object} params An object containing properties which are to be used as HTTP parameters
     * for the request to the remote server.
     * @param {Ext2.data.DataReader} reader The Reader object which converts the data
     * object into a block of Ext2.data.Records.
     * @param {Function} callback The function into which to pass the block of Ext2.data.Records.
     * The function must be passed <ul>
     * <li>The Record block object</li>
     * <li>The "arg" argument from the load function</li>
     * <li>A boolean success indicator</li>
     * </ul>
     * @param {Object} scope The scope in which to call the callback
     * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
     */
    load : function(params, reader, callback, scope, arg){
        if(this.fireEvent("beforeload", this, params) !== false){
            var  o = {
                params : params || {},
                request: {
                    callback : callback,
                    scope : scope,
                    arg : arg
                },
                reader: reader,
                callback : this.loadResponse,
                scope: this
            };
            if(this.useAjax){
                Ext2.applyIf(o, this.conn);
                if(this.activeRequest){
                    Ext2.Ajax.abort(this.activeRequest);
                }
                this.activeRequest = Ext2.Ajax.request(o);
            }else{
                this.conn.request(o);
            }
        }else{
            callback.call(scope||this, null, arg, false);
        }
    },

    // private
    loadResponse : function(o, success, response){
        delete this.activeRequest;
        if(!success){
            this.fireEvent("loadexception", this, o, response);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        var result;
        try {
            result = o.reader.read(response);
        }catch(e){
            this.fireEvent("loadexception", this, o, response, e);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        this.fireEvent("load", this, o, o.request.arg);
        o.request.callback.call(o.request.scope, result, o.request.arg, true);
    },
    
    // private
    update : function(dataSet){
        
    },
    
    // private
    updateResponse : function(dataSet){
        
    },
    
    // inherit docs
    destroy: function(){
        if(!this.useAjax){
            this.conn.abort();
        }else if(this.activeRequest){
            Ext2.Ajax.abort(this.activeRequest);
        }
        Ext2.data.HttpProxy.superclass.destroy.call(this);
    }
});
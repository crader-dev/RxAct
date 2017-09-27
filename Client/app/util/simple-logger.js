'use strict';

var Logger = {
    DEBUG: {rank: 0, text: 'DEBUG',   handler: console.debug},
    INFO:  {rank: 1, text: 'INFO',    handler: console.info},
    WARN:  {rank: 2, text: 'WARNING', handler: console.warn},
    ERROR: {rank: 3, text: 'ERROR',   handler: console.error},

    minLevel: this.DEBUG,

    setLevel: function(level) {
        this.validateLevel(level) ? 
            this.minLevel = level : 
            this.warn('Tried to set invalid log level: ' + level.text);
            
        return this;
    },

    logMessage: function(level, msg) {
        if(this.validateLevel(level)) {
            if (level.rank >= this.minLevel.rank) {
                level.handler(level.text + ': ' + msg);
            }
        } else {
            this.warn('Tried logging with invalid log level: ' + level.text);
        }

        return this;
    },

    debug: function(msg) {
        return this.logMessage(this.DEBUG, msg)
    },

    info:function(msg) {
        return this.logMessage(this.INFO,  msg)
    },

    warn: function(msg) {
        return this.logMessage(this.WARN,  msg)
    },

    error: function(msg) {
        return this.logMessage(this.ERROR, msg)
    },

    validateLevel: function(level) {
        return (level == this.DEBUG || level == this.INFO || 
                level == this.WARN  || level == this.ERROR);
    }
};
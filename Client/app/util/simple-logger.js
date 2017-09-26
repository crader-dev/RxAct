'use strict';

var Logger = {
    DEBUG: {rank: 0, text: 'DEBUG'},
    INFO:  {rank: 1, text: 'INFO'},
    WARN:  {rank: 2, text: 'WARNING'},
    ERROR: {rank: 3, text: 'ERROR'},

    minLevel: DEBUG,

    setLevel: function(level) {
        validateLevel(level) ? 
            this.level = level : 
            this.warn('Tried to set invalid log level: ' + level);
            
        return this;
    },

    logMessage: function(level, msg) {
        if(validateLevel(level)) {
            if (level.rank >= this.minLevel.rank) {
                console.log(severity + ': ' + msg);
            }
        } else {
            this.warn('Tried logging with invalud log level: ' + level);
        }

        return this;
    },

    debug: (msg) => {return this.logMessage(this.DEBUG, msg)},

    info: (msg) =>  {return this.logMessage(this.INFO,  msg)},

    warn: (msg) =>  {return this.logMessage(this.WARN,  msg)},

    error: (msg) => {return this.logMessage(this.ERROR, msg)},

    validateLevel: function(level) {
        return (level == DEBUG || level == INFO || 
                level == WARN  || level == ERROR);
    }

};
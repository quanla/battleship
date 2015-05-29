var ObjectUtil = ObjectUtil || {};

ObjectUtil.clone = function(obj) {
    if (obj == null
        || typeof obj != "object"
    ) {
        return obj;
    } else if (obj.length == null) {
        var ret = {};
        for ( var i in obj) {
            if (obj.hasOwnProperty(i)) {
                ret[i] = ObjectUtil.clone(obj[i]);
            }
        }
        return ret;
    } else {
        var ret = [];
        for (var i = 0; i < obj.length; i++) {
            ret[i] = ObjectUtil.clone(obj[i]);
        }
        return ret;
    }
};

var Cols = Cols || {};
Cols.remove = function(e, col) {
    var i = col.indexOf(e);
    if (i == -1) {
        return false;
    }
    col.splice(i, 1);
    return true;
};

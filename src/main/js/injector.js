function Injector() {
    this.factories = {};
    this.objects = {};
}

Injector.prototype = {
    get: function(name) {
        var object = this.objects[name];
        if (object != null) {
            return object;
        }

        // Creating it
        var factory = this.factories[name];
        if (factory == null) {
            throw "Can not find factory function of [" + name + "]";
        }
        var listStr = factory.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '');
        var deps = listStr === '' ? [] : listStr.split(',');

        var args = [];
        for (var i = 0; i < deps.length; i++) {
            var objName = deps[i];
            args.push(this.get(objName));
        }
        var object = factory.apply(null, args);

        this.objects[name] = object;
        return object;
    },
    factory: function(name, factory) {
        this.factories[name] = factory;
    }
};

var battleship = new Injector();

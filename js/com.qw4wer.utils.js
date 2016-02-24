/**
 * Created by qw4wer on 2016/2/17.
 */
/*
 * 执行方法
 *
 * */
function executeFn(fn, fnArg) {

    if (fn != "" && typeof fn == "function") {

        if (fnArg != undefined && fnArg.length > 0) {

            var argLength = fnArg.length;
            var arr = new Array([argLength]);
            $(fnArg).each(function (index) {
                arr[index] = fnArg[index];
            });
            return fn.apply(fn, arr);
        } else {

            return fn();
        }
    }
}

/*
 * js实现环绕切面
 */
function section(options) {
    var defaults = {
        object: window,
        methodName: '',
        preposition: '',
        prepositionArg: [],
        postposition: '',
        postpositionArg: [],
        hasRuturn: false,

    };
    options = $.extend(defaults, options);


    var exist = options.object[options.methodName];
    var previous = function () {
        return exist.apply(options.object, arguments);
    };
    var advised = function advice() {
        var res = undefined;
        if (options.preposition != '' && typeof(options.preposition) == 'function') {
            options.prepositionArg.unshift(arguments[0]);
            if (executeFn(options.preposition, options.prepositionArg)) {
                console.log('stop');
                return;
            }
        }
        res = previous.apply(this, arguments);
        if (options.postposition != '' && typeof(options.postposition) == 'function') {
            options.postpositionArg.unshift(arguments[0]);
            executeFn(options.postposition, options.postpositionArg);
        }
        return options.hasRuturn === true ? res : undefined;
    }
    options.object[options.methodName] = function () {
        return advised ? advised.apply(options.object, arguments) : previous.apply(options.object, arguments);
    };

    return {
        remove: function () {
            advised = null;
            advice = null;
        }
    }


}
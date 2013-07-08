var CountryStateUpdater = function(options){
    options = options || {};
    var countryElem = getElem(options.countryElem);
    var stateElem = getElem(options.stateElem);
    var noCountriesOption = options.noCountriesOption || 'None / Not Applicable';
    var defaultCountry = options.defaultCountry !== undefined ? options.defaultCountry : null;
    var defaultState = options.defaultState || null;
    var requiredClass = options.requiredClass || null;
    var countries = options.countries || (CountryStateUpdaterData && CountryStateUpdaterData.countries ? CountryStateUpdaterData.countries : {});
    var states = options.states || (CountryStateUpdaterData && CountryStateUpdaterData.states ? CountryStateUpdaterData.states : {});

    init();
    
    function init() {
        if (!countryElem || !stateElem) {
            return;
        }

        for (var countryCode in countries) {
           var optionElem = document.createElement('option');
           optionElem.value = countryCode;
           optionElem.innerHTML = countries[countryCode];
           countryElem.appendChild(optionElem);
        }

        if (defaultCountry && countries[defaultCountry]) {
            countryElem.value = defaultCountry;
            updateStates();

            if (defaultState && states[defaultCountry][defaultState]) {
                stateElem.value = defaultState;
            }
        }

        if (requiredClass) {
            addClass(countryElem, requiredClass);
        }

        addEvent(countryElem, 'change', updateStates);
    }

    function updateStates() {
        for (var i = stateElem.options.length-1; i >= 0; i--) {
            if (i > 0 || stateElem.options[i].value) {
                stateElem.remove(i);
            }
        }

        var hasStates = countryElem.value && states && states[countryElem.value];
        var newStates = hasStates ? states[countryElem.value] : {'':noCountriesOption};
        for (var stateCode in newStates) {
            var optionElem = document.createElement('option');
            optionElem.value = stateCode;
            optionElem.innerHTML = newStates[stateCode];
            stateElem.appendChild(optionElem);
        }

        if (requiredClass) {
            if (hasStates) {
                addClass(stateElem, requiredClass);
            } else {
                removeClass(stateElem, requiredClass);
            }
        }
    }

    function getElem(x) {
        if (!x) {
            return null;
        } else if (typeof x === 'string') {
            return document.getElementById(x);
        }

        return x;
    }

    function addClass(elem, className) {
        if (!elem.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
            elem.className += ' ' + className;
        }
    }

    function removeClass(elem, className) {
        elem.className = elem.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), '');
    }

    // From John Resig: http://ejohn.org/blog/flexible-javascript-events/
    function addEvent(obj, type, fn) {
        if (obj.attachEvent) {
            obj['e'+type+fn] = fn;
            obj[type+fn] = function(){
                obj['e'+type+fn](window.event);
            };
            obj.attachEvent('on'+type, obj[type+fn]);
        } else {
            obj.addEventListener(type, fn, false);
        }
    }
};

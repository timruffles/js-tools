setupObjectSystem();



function main() {
  var items = initialData();
  
  var listWidj = new FilterableListWidget({
    items: items
  });
  document.body.appendChild(listWidj.el)
}


var events = {
  on: function(evt,fn,ctx) {
    this._listeners = this._listeners || {};
    var listeners = this._listeners[evt] =
         this._listeners[evt] || [];
    listeners.push(fn.bind(ctx));
  },
  fire: function(evt,data) {
    var listeners = this._listeners[evt] || [];
    _.each(listeners,function(listener) {
      listener(data)
    });
  }
};

function ListWidget(opts) {
  opts = opts || {};
  this.items = opts.items || [];
  this.el = opts.el || document.createElement("ul");
  this._filteredItems = memoize(filterItems,function(filter) {
    return filter; // the filter
  })
}

ListWidget.mixin(events);
mixin(ListWidget,{
  render: function() {
    var newContents = "";
    var items = this._filteredItems(this._filter,this.items);
    for(var i = 0; i < items.length; i++) {
      newContents += "<li>" + items[i];
    }
    this.el.innerHTML = newContents;
  },
  setFilter: function(to) {
    this._filter = to;
    this.render();
  }
})

function filterItems(filter,items) {
  if(filter == null) return items;
  return _.filter(items,function(item) {
    return item.indexOf(filter) !== -1;
  });
}


function FilterWidget(opts) {
  this.el = opts.el || document.createElement("form");
  //this._oninput = debounce(this._oninput.bind(this),100);
  this.el.addEventListener("input",this._oninput.bind(this));
}

FilterWidget.mixin(events);
mixin(FilterWidget,{
  render: function() {
    this.el.innerHTML = "<input type=search>";
  },
  _oninput: function() {
    this.fire("filtered",this.el.querySelector("input").value)
  }
});


function FilterableListWidget(opts) {
  opts = opts || {};
  this.el = opts.el || document.createElement("div");
  
  var listWidj = new ListWidget({
    items: opts.items
  });
  listWidj.render();
  
  var filterWidj = new FilterWidget({
  });
  filterWidj.render();
  
  filterWidj.on("filtered",listWidj.setFilter.bind(listWidj));
  
  this.el.appendChild(filterWidj.el)
  this.el.appendChild(listWidj.el)
}










function setupObjectSystem() {
  Function.prototype.inherits = function(superType) {
    inherits(this,superType);
  };

  Function.prototype.mixin = function(mixin) {
    for(var prop in mixin) {
      this.prototype[prop] = mixin[prop];
    }
  };
}


function inherits(subType,superType) {
  subType.prototype = Object.create(superType.prototype);
  subType.prototype.constructor = subType;
  subType.prototype.super = superType.prototype;
  subType.prototype.superConstructor = superType;
}

function mixin(subType,mixin) {
  for(var prop in mixin) {
    subType.prototype[prop] = mixin[prop];
  }
}


function memoize(fn,keyer) {
  var storedResults = {};
  keyer = keyer || function(firstArg) { return firstArg };
  return function() {
    var key = keyer.apply(null,arguments);
    if(key in storedResults) {
      return storedResults[key];
    } else {
      var val = fn.apply(null,arguments); 
      storedResults[key] = val;
      return val;
    }
  }
}

// take a function A, and return a new
// function B that will invoke A only
// after it hasn't been called for N 
// milliseconds
function debounce(A,N) {
  var timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      A();
    },N);
  }
}


function initialData() {
  return ["Afghanistan","Åland Islands","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia, Plurinational State of","Bonaire, Sint Eustatius and Saba","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","British Indian Ocean Territory","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cabo Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo","Congo, the Democratic Republic of the","Cook Islands","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Curaçao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands (Malvinas)","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and McDonald Islands","Holy See (Vatican City State)","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran, Islamic Republic of","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Korea, Democratic People's Republic of","Korea, Republic of","Kuwait","Kyrgyzstan","Lao People's Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macao","Macedonia, the former Yugoslav Republic of","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia, Federated States of","Moldova, Republic of","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestine, State of","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Réunion","Romania","Russian Federation","Rwanda","Saint Barthélemy","Saint Helena, Ascension and Tristan da Cunha","Saint Kitts and Nevis","Saint Lucia","Saint Martin (French part)","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Sint Maarten (Dutch part)","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the South Sandwich Islands","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Svalbard and Jan Mayen","Swaziland","Sweden","Switzerland","Syrian Arab Republic","Taiwan, Province of China","Tajikistan","Tanzania, United Republic of","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu","Venezuela, Bolivarian Republic of","Viet Nam","Virgin Islands, British","Virgin Islands, U.S.","Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe"];
}


main();
(function() {
  var Collections, Component, Continuum, ContinuumView, HasParent, HasProperties, InteractiveContext, InteractiveContextView, InteractiveContexts, Table, TableView, Tables, get_collections, logger, resolve_ref, safebind,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (this.Continuum) {
    Continuum = this.Continuum;
  } else {
    Continuum = {};
    this.Continuum = Continuum;
  }

  Collections = {};

  Continuum.Collections = Collections;

  Continuum.register_collection = function(key, value) {
    Collections[key] = value;
    return value.bokeh_key = key;
  };

  Continuum.load_models = function(modelspecs) {
    var attrs, coll, coll_attrs, model, newspecs, oldspecs, _i, _j, _k, _l, _len, _len2, _len3, _len4, _results;
    newspecs = [];
    oldspecs = [];
    for (_i = 0, _len = modelspecs.length; _i < _len; _i++) {
      model = modelspecs[_i];
      coll = get_collections(model['collections'])[model['type']];
      attrs = model['attributes'];
      if (coll.get(attrs['id'])) {
        oldspecs.push([coll, attrs]);
      } else {
        newspecs.push([coll, attrs]);
      }
    }
    console.log('LOADING', newspecs);
    for (_j = 0, _len2 = newspecs.length; _j < _len2; _j++) {
      coll_attrs = newspecs[_j];
      coll = coll_attrs[0], attrs = coll_attrs[1];
      coll.add(attrs);
    }
    console.log('dinit', newspecs);
    for (_k = 0, _len3 = newspecs.length; _k < _len3; _k++) {
      coll_attrs = newspecs[_k];
      coll = coll_attrs[0], attrs = coll_attrs[1];
      coll.get(attrs['id']).dinitialize(attrs);
    }
    console.log('updating', oldspecs);
    _results = [];
    for (_l = 0, _len4 = oldspecs.length; _l < _len4; _l++) {
      coll_attrs = oldspecs[_l];
      coll = coll_attrs[0], attrs = coll_attrs[1];
      _results.push(coll.get(attrs['id']).set(attrs));
    }
    return _results;
  };

  Continuum.submodels = function(ws_conn_string, topic) {
    var s;
    try {
      s = new WebSocket(ws_conn_string);
    } catch (error) {
      s = new MozWebSocket(ws_conn_string);
    }
    s.onopen = function() {
      return s.send(JSON.stringify({
        msgtype: 'subscribe',
        topic: topic
      }));
    };
    s.onmessage = function(msg) {
      var msgobj;
      console.log(msg.data);
      msgobj = JSON.parse(msg.data);
      if (msgobj['msgtype'] === 'modelpush') {
        return Continuum.load_models(msgobj['modelspecs']);
      }
    };
    return s;
  };

  window.logger = new Backbone.Model();

  window.logger.on('all', function() {
    var msg;
    msg = 'LOGGER:' + JSON.stringify(arguments[1][0]);
    return console.log(msg);
  });

  Continuum.logger = window.logger;

  logger = Continuum.logger;

  logger.log = function() {
    return logger.trigger('LOG', arguments);
  };

  "continuum refrence system\n  reference : {'type' : type name, 'id' : object id}\n  each class has a collections class var, and type class var.\n  references are resolved by looking up collections[type] to get a collection\n  and then retrieving the correct id.  The one exception is that an object\n  can resolve a reference to itself even if it has not yet been added to\n  any collections.\n\nour property system\n1. Has Properties\n  we support python style computed properties, with getters as well as setters.\n  we also support caching of these properties, and notifications of property\n  changes\n\n  @register_property(name, dependencies, getter, use_cache, setter)\n\n  dependencies:\n    ['height', {'ref' : objectreference, 'fields' : ['first', 'second']}\n    for dependencies, strings are interpreted as backbone attrs\n    on the current object.\n    an object of the form {'ref' : ref, 'fields' :[a,b,c]}\n    specifies that this property is dependent on backbone attrs a,b,c on\n    object that you can get via ref\n  getter:\n    function which takes no arguments, but is called with the object that has\n    the property as the context, so getter.call(this)\n  setter:\n    function whch takes the value being set, called with the object as the\n    context\n    setter.call(this, val)\n2.  defaults vs display_defaults\n  backbone already has a system for attribute defaults, however we wanted to\n  impose a secondary inheritance system for attributes based on GUI hierarchies\n  the idea being that you generally want to inherit UI attributes from\n  your container/parent.  Here is how we do this.\n  HasParent models can have a parent attribute, which is our\n  continuum reference.  when we try to get an attribute, first we try to\n  get the attribute via super (so try properties, and if not that, normal\n  backbone resolution) if that results in something which is undefined,\n  then try to grab the attribute from the parent.\n\n  the reason why we need to segregate display_defaults into a separate object\n  form backbones normal default is because backbone defaults are automatically\n  set on the object, so you have no way of knowing whether the attr exists\n  because it was a default, or whether it was intentionally set.  In the\n  parent case, we want to try parent settings BEFORE we rely on\n  display defaults.";

  get_collections = function(names) {
    var last, n, _i, _len;
    last = window;
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      n = names[_i];
      last = last[n];
    }
    return last;
  };

  resolve_ref = function(collections, type, id) {
    if (_.isArray(collections)) collections = get_collections(collections);
    return collections[type].get(id);
  };

  Continuum.resolve_ref = resolve_ref;

  Continuum.get_collections = get_collections;

  safebind = function(binder, target, event, callback) {
    var _this = this;
    if (!_.has(binder, 'eventers')) binder['eventers'] = {};
    binder['eventers'][target.id] = target;
    target.on(event, callback, binder);
    return target.on('destroy', function() {
      return delete binder['eventers'][target];
    }, binder);
  };

  HasProperties = (function(_super) {

    __extends(HasProperties, _super);

    function HasProperties() {
      HasProperties.__super__.constructor.apply(this, arguments);
    }

    HasProperties.prototype.collections = Collections;

    HasProperties.prototype.destroy = function() {
      var target, val, _ref;
      if (_.has(this, 'eventers')) {
        _ref = this.eventers;
        for (target in _ref) {
          if (!__hasProp.call(_ref, target)) continue;
          val = _ref[target];
          val.off(null, null, this);
        }
      }
      return HasProperties.__super__.destroy.call(this);
    };

    HasProperties.prototype.initialize = function(attrs, options) {
      var _this = this;
      HasProperties.__super__.initialize.call(this, attrs, options);
      this.properties = {};
      this.property_cache = {};
      if (!_.has(attrs, 'id')) {
        this.id = _.uniqueId(this.type);
        this.attributes['id'] = this.id;
      }
      return _.defer(function() {
        if (!_this.inited) return _this.dinitialize(attrs, options);
      });
    };

    HasProperties.prototype.dinitialize = function(attrs, options) {
      return this.inited = true;
    };

    HasProperties.prototype.set = function(key, value, options) {
      var attrs, toremove, val, _i, _len;
      if (_.isObject(key) || key === null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }
      toremove = [];
      for (key in attrs) {
        if (!__hasProp.call(attrs, key)) continue;
        val = attrs[key];
        if (_.has(this, 'properties') && _.has(this.properties, key) && this.properties[key]['setter']) {
          this.properties[key]['setter'].call(this, val);
        }
      }
      for (_i = 0, _len = toremove.length; _i < _len; _i++) {
        key = toremove[_i];
        delete attrs[key];
      }
      if (!_.isEmpty(attrs)) {
        return HasProperties.__super__.set.call(this, attrs, options);
      }
    };

    HasProperties.prototype.structure_dependencies = function(dependencies) {
      var deps, local_deps, other_deps, x;
      other_deps = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = dependencies.length; _i < _len; _i++) {
          x = dependencies[_i];
          if (_.isObject(x)) _results.push(x);
        }
        return _results;
      })();
      local_deps = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = dependencies.length; _i < _len; _i++) {
          x = dependencies[_i];
          if (!_.isObject(x)) _results.push(x);
        }
        return _results;
      })();
      if (local_deps.length > 0) {
        deps = [
          {
            'ref': this.ref(),
            'fields': local_deps
          }
        ];
        deps = deps.concat(other_deps);
      } else {
        deps = other_deps;
      }
      return deps;
    };

    HasProperties.prototype.register_property = function(prop_name, dependencies, getter, use_cache, setter) {
      var dep, fld, obj, prop_spec, _i, _j, _len, _len2, _ref,
        _this = this;
      if (_.has(this.properties, prop_name)) this.remove_property(prop_name);
      dependencies = this.structure_dependencies(dependencies);
      prop_spec = {
        'getter': getter,
        'dependencies': dependencies,
        'use_cache': use_cache,
        'setter': setter,
        'callbacks': {
          'changedep': function() {
            return _this.trigger('changedep:' + prop_name);
          },
          'propchange': function() {
            var firechange, new_val, old_val;
            firechange = true;
            if (prop_spec['use_cache']) {
              old_val = _this.get_cache(prop_name);
              _this.clear_cache(prop_name);
              new_val = _this.get(prop_name);
              firechange = new_val !== old_val;
            }
            if (firechange) {
              _this.trigger('change:' + prop_name, _this, _this.get(prop_name));
              return _this.trigger('change', _this);
            }
          }
        }
      };
      this.properties[prop_name] = prop_spec;
      for (_i = 0, _len = dependencies.length; _i < _len; _i++) {
        dep = dependencies[_i];
        obj = this.resolve_ref(dep['ref']);
        _ref = dep['fields'];
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          fld = _ref[_j];
          safebind(this, obj, "change:" + fld, prop_spec['callbacks']['changedep']);
        }
      }
      safebind(this, this, "changedep:" + prop_name, prop_spec['callbacks']['propchange']);
      return prop_spec;
    };

    HasProperties.prototype.remove_property = function(prop_name) {
      var dep, dependencies, fld, obj, prop_spec, _i, _j, _len, _len2, _ref;
      prop_spec = this.properties[prop_name];
      dependencies = prop_spec.dependencies;
      for (_i = 0, _len = dependencies.length; _i < _len; _i++) {
        dep = dependencies[_i];
        obj = this.resolve_ref(dep['ref']);
        _ref = dep['fields'];
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          fld = _ref[_j];
          obj.off('change:' + fld, prop_spec['callbacks']['changedep'], this);
        }
      }
      this.off("changedep:" + dep);
      delete this.properties[prop_name];
      if (prop_spec.use_cache) return this.clear_cache(prop_name);
    };

    HasProperties.prototype.has_cache = function(prop_name) {
      return _.has(this.property_cache, prop_name);
    };

    HasProperties.prototype.add_cache = function(prop_name, val) {
      return this.property_cache[prop_name] = val;
    };

    HasProperties.prototype.clear_cache = function(prop_name, val) {
      return delete this.property_cache[prop_name];
    };

    HasProperties.prototype.get_cache = function(prop_name) {
      return this.property_cache[prop_name];
    };

    HasProperties.prototype.get = function(prop_name) {
      var computed, getter, prop_spec;
      if (_.has(this.properties, prop_name)) {
        prop_spec = this.properties[prop_name];
        if (prop_spec.use_cache && this.has_cache(prop_name)) {
          return this.property_cache[prop_name];
        } else {
          getter = prop_spec.getter;
          computed = getter.apply(this, this);
          if (this.properties[prop_name].use_cache) {
            this.add_cache(prop_name, computed);
          }
          return computed;
        }
      } else {
        return HasProperties.__super__.get.call(this, prop_name);
      }
    };

    HasProperties.prototype.ref = function() {
      return {
        'type': this.type,
        'id': this.id
      };
    };

    HasProperties.prototype.resolve_ref = function(ref) {
      if (!ref) console.log('ERROR, null reference');
      if (ref['type'] === this.type && ref['id'] === this.id) {
        return this;
      } else {
        return resolve_ref(this.collections, ref['type'], ref['id']);
      }
    };

    HasProperties.prototype.get_ref = function(ref_name) {
      var ref;
      ref = this.get(ref_name);
      if (ref) return this.resolve_ref(ref);
    };

    HasProperties.prototype.url = function() {
      var base;
      base = "/bb/" + window.topic + "/" + this.type + "/";
      if (this.isNew()) return base;
      return base + this.get('id');
    };

    return HasProperties;

  })(Backbone.Model);

  ContinuumView = (function(_super) {

    __extends(ContinuumView, _super);

    function ContinuumView() {
      ContinuumView.__super__.constructor.apply(this, arguments);
    }

    ContinuumView.prototype.initialize = function(options) {
      if (!_.has(options, 'id')) return this.id = _.uniqueId('ContinuumView');
    };

    ContinuumView.prototype.remove = function() {
      var target, val, _ref;
      if (_.has(this, 'eventers')) {
        _ref = this.eventers;
        for (target in _ref) {
          if (!__hasProp.call(_ref, target)) continue;
          val = _ref[target];
          val.off(null, null, this);
        }
      }
      return ContinuumView.__super__.remove.call(this);
    };

    ContinuumView.prototype.tag_selector = function(tag, id) {
      return "#" + this.tag_id(tag, id);
    };

    ContinuumView.prototype.tag_id = function(tag, id) {
      if (!id) id = this.id;
      return tag + "-" + id;
    };

    ContinuumView.prototype.tag_el = function(tag, id) {
      return this.$el.find("#" + this.tag_id(tag, id));
    };

    ContinuumView.prototype.tag_d3 = function(tag, id) {
      var val;
      val = d3.select(this.el).select("#" + this.tag_id(tag, id));
      if (val[0][0] === null) {
        return null;
      } else {
        return val;
      }
    };

    ContinuumView.prototype.mget = function(fld) {
      return this.model.get(fld);
    };

    ContinuumView.prototype.mget_ref = function(fld) {
      return this.model.get_ref(fld);
    };

    ContinuumView.prototype.add_dialog = function() {
      var position,
        _this = this;
      this.$el.dialog({
        width: this.mget('outerwidth') + 50,
        maxHeight: $(window).height(),
        close: function() {
          return _this.remove();
        },
        dragStop: function(event, ui) {
          var left, top, xoff, yoff;
          top = parseInt(_this.$el.dialog('widget').css('top').split('px')[0]);
          left = parseInt(_this.$el.dialog('widget').css('left').split('px')[0]);
          xoff = _this.model.reverse_position_x(left);
          yoff = _this.model.reverse_position_y(top);
          _this.model.set({
            'offset': [xoff, yoff]
          });
          return _this.model.save();
        }
      });
      _.defer(function() {
        return _this.$el.dialog('option', 'height', _this.mget('outerheight') + 70);
      });
      position = function() {
        return _this.$el.dialog('widget').css({
          'top': _this.model.position_y() + "px",
          'left': _this.model.position_x() + "px"
        });
      };
      position();
      safebind(this, this.model, 'change:offset', position);
      safebind(this, this.model, 'change:outerwidth', function() {
        return this.$el.dialog('option', 'width', this.mget('outerwidth'));
      });
      return safebind(this, this.model, 'change:outerheight', function() {
        return this.$el.dialog('option', 'height', this.mget('outerheight'));
      });
    };

    return ContinuumView;

  })(Backbone.View);

  HasParent = (function(_super) {

    __extends(HasParent, _super);

    function HasParent() {
      HasParent.__super__.constructor.apply(this, arguments);
    }

    HasParent.prototype.get_fallback = function(attr) {
      var attrs, retval;
      if (this.get_ref('parent') && _.indexOf(this.get_ref('parent').parent_properties, attr) >= 0 && !_.isUndefined(this.get_ref('parent').get(attr))) {
        return this.get_ref('parent').get(attr);
      } else {
        retval = this.display_defaults[attr];
        if (_.isObject(retval) && _.has(retval, 'type')) {
          attrs = _.has(retval, 'attrs') ? retval['attrs'] : {};
          retval = this.collections[retval['type']].create(attrs).ref();
          this.set(attr, retval);
          this.save();
        }
        return retval;
      }
    };

    HasParent.prototype.get = function(attr) {
      var normalval;
      normalval = HasParent.__super__.get.call(this, attr);
      if (!_.isUndefined(normalval)) {
        return normalval;
      } else if (!(attr === 'parent')) {
        return this.get_fallback(attr);
      }
    };

    HasParent.prototype.display_defaults = {};

    return HasParent;

  })(HasProperties);

  Component = (function(_super) {

    __extends(Component, _super);

    function Component() {
      Component.__super__.constructor.apply(this, arguments);
    }

    Component.prototype.collections = Collections;

    Component.prototype.xpos = function(x) {
      return x;
    };

    Component.prototype.ypos = function(y) {
      return this.get('height') - y;
    };

    Component.prototype.child_position_to_offset_x = function(child, position) {
      var offset;
      offset = position;
      return offset;
    };

    Component.prototype.child_position_to_offset_y = function(child, position) {
      var offset, ypos;
      ypos = position + child.get('outerheight');
      offset = this.get('height') - ypos;
      return offset;
    };

    Component.prototype.position_child_x = function(child, offset) {
      return this.xpos(offset);
    };

    Component.prototype.position_child_y = function(child, offset) {
      return this.ypos(offset) - child.get('outerheight');
    };

    Component.prototype.position_x = function() {
      var parent;
      parent = this.get_ref('parent');
      if (!parent) return 0;
      return parent.position_child_x(this, this.get('offset')[0]);
    };

    Component.prototype.position_y = function() {
      var parent, val;
      parent = this.get_ref('parent');
      if (!parent) return 0;
      val = parent.position_child_y(this, this.get('offset')[1]);
      return val;
    };

    Component.prototype.reverse_position_x = function(input) {
      var parent;
      parent = this.get_ref('parent');
      if (!parent) return 0;
      return parent.child_position_to_offset_x(this, input);
    };

    Component.prototype.reverse_position_y = function(input) {
      var parent;
      parent = this.get_ref('parent');
      if (!parent) return 0;
      return parent.child_position_to_offset_y(this, input);
    };

    Component.prototype.dinitialize = function(attrs, options) {
      Component.__super__.dinitialize.call(this, attrs, options);
      this.register_property('outerwidth', ['width', 'border_space'], function() {
        return this.get('width') + 2 * this.get('border_space');
      }, false);
      return this.register_property('outerheight', ['height', 'border_space'], function() {
        return this.get('height') + 2 * this.get('border_space');
      }, false);
    };

    Component.prototype.defaults = {
      parent: null
    };

    Component.prototype.display_defaults = {
      width: 200,
      height: 200,
      position: 0,
      offset: [0, 0],
      border_space: 20
    };

    Component.prototype.default_view = null;

    return Component;

  })(HasParent);

  TableView = (function(_super) {

    __extends(TableView, _super);

    function TableView() {
      TableView.__super__.constructor.apply(this, arguments);
    }

    TableView.prototype.delegateEvents = function() {
      safebind(this, this.model, 'destroy', this.remove);
      return safebind(this, this.model, 'change', this.render);
    };

    TableView.prototype.render = function() {
      var column, data, elem, headerrow, idx, row, row_elem, rownum, _i, _len, _len2, _len3, _ref, _ref2, _ref3;
      this.$el.empty();
      this.$el.append("<table></table>");
      this.$el.find('table').append("<tr></tr>");
      headerrow = $(this.$el.find('table').find('tr')[0]);
      _ref = ['row'].concat(this.mget('columns'));
      for (idx = 0, _len = _ref.length; idx < _len; idx++) {
        column = _ref[idx];
        elem = $(_.template('<th class="tableelem tableheader">{{ name }}</th>', {
          'name': column
        }));
        headerrow.append(elem);
      }
      _ref2 = this.mget('data');
      for (idx = 0, _len2 = _ref2.length; idx < _len2; idx++) {
        row = _ref2[idx];
        row_elem = $("<tr class='tablerow'></tr>");
        rownum = idx + this.mget('data_slice')[0];
        _ref3 = [rownum].concat(row);
        for (_i = 0, _len3 = _ref3.length; _i < _len3; _i++) {
          data = _ref3[_i];
          elem = $(_.template("<td class='tableelem'>{{val}}</td>", {
            'val': data
          }));
          row_elem.append(elem);
        }
        this.$el.find('table').append(row_elem);
      }
      this.render_pagination();
      if (this.mget('usedialog') && !this.$el.is(":visible")) {
        return this.add_dialog();
      }
    };

    TableView.prototype.render_pagination = function() {
      var maxoffset, node,
        _this = this;
      if (this.mget('offset') > 0) {
        node = $("<button>first</button>").css({
          'cursor': 'pointer'
        });
        this.$el.append(node);
        node.click(function() {
          _this.model.load(0);
          return false;
        });
        node = $("<button>previous</button>").css({
          'cursor': 'pointer'
        });
        this.$el.append(node);
        node.click(function() {
          _this.model.load(_.max([_this.mget('offset') - _this.mget('chunksize'), 0]));
          return false;
        });
      }
      maxoffset = this.mget('total_rows') - this.mget('chunksize');
      if (this.mget('offset') < maxoffset) {
        node = $("<button>next</button>").css({
          'cursor': 'pointer'
        });
        this.$el.append(node);
        node.click(function() {
          _this.model.load(_.min([_this.mget('offset') + _this.mget('chunksize'), maxoffset]));
          return false;
        });
        node = $("<button>last</button>").css({
          'cursor': 'pointer'
        });
        this.$el.append(node);
        return node.click(function() {
          _this.model.load(maxoffset);
          return false;
        });
      }
    };

    return TableView;

  })(ContinuumView);

  Table = (function(_super) {

    __extends(Table, _super);

    function Table() {
      Table.__super__.constructor.apply(this, arguments);
    }

    Table.prototype.type = 'Table';

    Table.prototype.dinitialize = function(attrs, options) {
      Table.__super__.dinitialize.call(this, attrs, options);
      this.register_property('offset', ['data_slice'], function() {
        return this.get('data_slice')[0];
      }, false);
      return this.register_property('chunksize', ['data_slice'], function() {
        return this.get('data_slice')[1] - this.get('data_slice')[0];
      }, false);
    };

    Table.prototype.defaults = {
      url: "",
      columns: [],
      data: [[]],
      data_slice: [0, 100],
      total_rows: 0
    };

    Table.prototype.default_view = TableView;

    Table.prototype.load = function(offset) {
      var _this = this;
      return $.get(this.get('url'), {
        'data_slice': JSON.stringify(this.get('data_slice'))
      }, function(data) {
        _this.set('data_slice', [offset, offset + _this.get('chunksize')], {
          silent: true
        });
        return _this.set({
          'data': JSON.parse(data)['data']
        });
      });
    };

    return Table;

  })(Component);

  Tables = (function(_super) {

    __extends(Tables, _super);

    function Tables() {
      Tables.__super__.constructor.apply(this, arguments);
    }

    Tables.prototype.model = Table;

    Tables.prototype.url = "/bb";

    return Tables;

  })(Backbone.Collection);

  InteractiveContextView = (function(_super) {

    __extends(InteractiveContextView, _super);

    function InteractiveContextView() {
      InteractiveContextView.__super__.constructor.apply(this, arguments);
    }

    InteractiveContextView.prototype.initialize = function(options) {
      InteractiveContextView.__super__.initialize.call(this, options);
      return this.views = {};
    };

    InteractiveContextView.prototype.delegateEvents = function() {
      safebind(this, this.model, 'destroy', this.remove);
      return safebind(this, this.model, 'change', this.render);
    };

    InteractiveContextView.prototype.render = function() {
      var model, spec, view, _i, _len, _ref;
      _ref = this.mget('children');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        spec = _ref[_i];
        model = this.model.resolve_ref(spec);
        model.set({
          'usedialog': true
        });
        model.save();
        if (this.views[model.id]) {
          view = this.views[model.id];
        } else {
          view = new model.default_view({
            'model': model
          });
          this.views[model.id] = view;
        }
        view.render();
      }
      return null;
    };

    return InteractiveContextView;

  })(ContinuumView);

  InteractiveContext = (function(_super) {

    __extends(InteractiveContext, _super);

    function InteractiveContext() {
      InteractiveContext.__super__.constructor.apply(this, arguments);
    }

    InteractiveContext.prototype.type = 'InteractiveContext';

    InteractiveContext.prototype.default_view = InteractiveContextView;

    InteractiveContext.prototype.defaults = {
      children: [],
      width: $(window).width(),
      height: $(window).height()
    };

    return InteractiveContext;

  })(Component);

  InteractiveContexts = (function(_super) {

    __extends(InteractiveContexts, _super);

    function InteractiveContexts() {
      InteractiveContexts.__super__.constructor.apply(this, arguments);
    }

    InteractiveContexts.prototype.model = InteractiveContext;

    return InteractiveContexts;

  })(Backbone.Collection);

  Continuum.register_collection('Table', new Tables());

  Continuum.register_collection('InteractiveContext', new InteractiveContexts());

  Continuum.ContinuumView = ContinuumView;

  Continuum.HasProperties = HasProperties;

  Continuum.HasParent = HasParent;

  Continuum.Component = Component;

  Continuum.safebind = safebind;

}).call(this);

(function() {
  var Bokeh, BokehView, Collections, Component, D3LinearAxes, D3LinearAxis, D3LinearAxisView, DataFactorRange, DataFactorRanges, DataRange1d, DataRange1ds, DiscreteColorMapper, DiscreteColorMappers, FactorRange, FactorRanges, GridPlotContainer, GridPlotContainerView, GridPlotContainers, HasProperties, LineRenderer, LineRendererView, LineRenderers, LinearMapper, LinearMappers, Mapper, ObjectArrayDataSource, ObjectArrayDataSources, Plot, PlotRange1d, PlotRange1ds, PlotView, Plots, Range1d, Range1ds, Renderer, ScatterRenderer, ScatterRendererView, ScatterRenderers, build_views, safebind,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (this.Bokeh) {
    Bokeh = this.Bokeh;
  } else {
    Bokeh = {};
    this.Bokeh = Bokeh;
  }

  Collections = Continuum.Collections;

  Bokeh.register_collection = function(key, value) {
    Collections[key] = value;
    return value.bokeh_key = key;
  };

  "MAIN BOKEH CLASSES";

  safebind = Continuum.safebind;

  Component = Continuum.Component;

  BokehView = Continuum.ContinuumView;

  HasProperties = Continuum.HasProperties;

  Renderer = (function(_super) {

    __extends(Renderer, _super);

    function Renderer() {
      Renderer.__super__.constructor.apply(this, arguments);
    }

    Renderer.prototype.initialize = function(options) {
      this.plot_id = options.plot_id;
      this.plot_model = options.plot_model;
      return Renderer.__super__.initialize.call(this, options);
    };

    return Renderer;

  })(BokehView);

  "Utility Classes for vis";

  Range1d = (function(_super) {

    __extends(Range1d, _super);

    function Range1d() {
      Range1d.__super__.constructor.apply(this, arguments);
    }

    Range1d.prototype.type = 'Range1d';

    Range1d.prototype.defaults = {
      start: 0,
      end: 1
    };

    return Range1d;

  })(HasProperties);

  Range1ds = (function(_super) {

    __extends(Range1ds, _super);

    function Range1ds() {
      Range1ds.__super__.constructor.apply(this, arguments);
    }

    Range1ds.prototype.model = Range1d;

    return Range1ds;

  })(Backbone.Collection);

  PlotRange1d = (function(_super) {

    __extends(PlotRange1d, _super);

    function PlotRange1d() {
      PlotRange1d.__super__.constructor.apply(this, arguments);
    }

    PlotRange1d.prototype.type = 'PlotRange1d';

    PlotRange1d.prototype.defaults = {
      start: 0,
      end: 200,
      plot: null,
      attribute: 'width'
    };

    PlotRange1d.prototype.dinitialize = function(attrs, options) {
      PlotRange1d.__super__.dinitialize.call(this, attrs, options);
      this.register_property('end', [
        {
          'ref': this.get('plot'),
          'fields': [this.get('attribute')]
        }
      ], function() {
        return this.get_ref('plot').get(this.get('attribute'));
      }, true);
      return this;
    };

    return PlotRange1d;

  })(Range1d);

  PlotRange1ds = (function(_super) {

    __extends(PlotRange1ds, _super);

    function PlotRange1ds() {
      PlotRange1ds.__super__.constructor.apply(this, arguments);
    }

    PlotRange1ds.prototype.model = PlotRange1d;

    return PlotRange1ds;

  })(Backbone.Collection);

  DataRange1d = (function(_super) {

    __extends(DataRange1d, _super);

    function DataRange1d() {
      DataRange1d.__super__.constructor.apply(this, arguments);
    }

    DataRange1d.prototype.type = 'DataRange1d';

    DataRange1d.prototype.defaults = {
      data_source: null,
      columns: [],
      rangepadding: 0.1
    };

    DataRange1d.prototype.dinitialize = function(attrs, options) {
      DataRange1d.__super__.dinitialize.call(this, attrs, options);
      this.register_property('minmax', [
        'data_source', 'columns', 'padding', {
          'ref': this.get('data_source'),
          'fields': ['data']
        }
      ], function() {
        var center, columns, max, min, span, x, _ref, _ref2;
        columns = (function() {
          var _i, _len, _ref, _results;
          _ref = this.get('columns');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            _results.push(this.get_ref('data_source').getcolumn(x));
          }
          return _results;
        }).call(this);
        columns = _.reduce(columns, function(x, y) {
          return x.concat(y);
        });
        _ref = [_.min(columns), _.max(columns)], min = _ref[0], max = _ref[1];
        span = (max - min) * (1 + this.get('rangepadding'));
        center = (max + min) / 2.0;
        _ref2 = [center - span / 2.0, center + span / 2.0], min = _ref2[0], max = _ref2[1];
        return [min, max];
      }, true);
      this.register_property('start', ['minmax'], (function() {
        return this.get('minmax')[0];
      }), true);
      return this.register_property('end', ['minmax'], (function() {
        return this.get('minmax')[1];
      }), true);
    };

    return DataRange1d;

  })(Range1d);

  DataRange1ds = (function(_super) {

    __extends(DataRange1ds, _super);

    function DataRange1ds() {
      DataRange1ds.__super__.constructor.apply(this, arguments);
    }

    DataRange1ds.prototype.model = DataRange1d;

    return DataRange1ds;

  })(Backbone.Collection);

  Range1ds = (function(_super) {

    __extends(Range1ds, _super);

    function Range1ds() {
      Range1ds.__super__.constructor.apply(this, arguments);
    }

    Range1ds.prototype.model = Range1d;

    return Range1ds;

  })(Backbone.Collection);

  FactorRange = (function(_super) {

    __extends(FactorRange, _super);

    function FactorRange() {
      FactorRange.__super__.constructor.apply(this, arguments);
    }

    FactorRange.prototype.type = 'FactorRange';

    FactorRange.prototype.defaults = {
      values: []
    };

    return FactorRange;

  })(HasProperties);

  DataFactorRange = (function(_super) {

    __extends(DataFactorRange, _super);

    function DataFactorRange() {
      DataFactorRange.__super__.constructor.apply(this, arguments);
    }

    DataFactorRange.prototype.type = 'DataFactorRange';

    DataFactorRange.prototype.defaults = {
      values: [],
      columns: [],
      data_source: null
    };

    DataFactorRange.prototype.dinitialize = function(attrs, options) {
      DataFactorRange.__super__.dinitialize.call(this, attrs, options);
      return this.register_property('values', [
        'data_source', 'columns', {
          'ref': this.get('data_source'),
          'fields': ['data']
        }
      ], function() {
        var columns, temp, uniques, val, x, _i, _len;
        columns = (function() {
          var _i, _len, _ref, _results;
          _ref = this.get('columns');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            _results.push(this.get_ref('data_source').getcolumn(x));
          }
          return _results;
        }).call(this);
        columns = _.reduce(columns, function(x, y) {
          return x.concat(y);
        });
        temp = {};
        for (_i = 0, _len = columns.length; _i < _len; _i++) {
          val = columns[_i];
          temp[val] = true;
        }
        uniques = _.keys(temp);
        uniques = _.sortBy(uniques, (function(x) {
          return x;
        }));
        return uniques;
      }, true);
    };

    return DataFactorRange;

  })(FactorRange);

  DataFactorRanges = (function(_super) {

    __extends(DataFactorRanges, _super);

    function DataFactorRanges() {
      DataFactorRanges.__super__.constructor.apply(this, arguments);
    }

    DataFactorRanges.prototype.model = DataFactorRange;

    return DataFactorRanges;

  })(Backbone.Collection);

  FactorRanges = (function(_super) {

    __extends(FactorRanges, _super);

    function FactorRanges() {
      FactorRanges.__super__.constructor.apply(this, arguments);
    }

    FactorRanges.prototype.model = FactorRange;

    return FactorRanges;

  })(Backbone.Collection);

  Mapper = (function(_super) {

    __extends(Mapper, _super);

    function Mapper() {
      Mapper.__super__.constructor.apply(this, arguments);
    }

    Mapper.prototype.type = 'Mapper';

    Mapper.prototype.defaults = {};

    Mapper.prototype.display_defaults = {};

    Mapper.prototype.map_screen = function(data) {};

    return Mapper;

  })(HasProperties);

  "LinearMapper";

  LinearMapper = (function(_super) {

    __extends(LinearMapper, _super);

    function LinearMapper() {
      LinearMapper.__super__.constructor.apply(this, arguments);
    }

    LinearMapper.prototype.type = 'LinearMapper';

    LinearMapper.prototype.defaults = {
      data_range: null,
      screen_range: null
    };

    LinearMapper.prototype.calc_scale = function() {
      var domain, range;
      domain = [this.get_ref('data_range').get('start'), this.get_ref('data_range').get('end')];
      range = [this.get_ref('screen_range').get('start'), this.get_ref('screen_range').get('end')];
      return d3.scale.linear().domain(domain).range(range);
    };

    LinearMapper.prototype.dinitialize = function(attrs, options) {
      LinearMapper.__super__.dinitialize.call(this, attrs, options);
      return this.register_property('scale', [
        'data_range', 'screen_range', {
          'ref': this.get_ref('data_range'),
          'fields': ['start', 'end']
        }, {
          'ref': this.get_ref('screen_range'),
          'fields': ['start', 'end']
        }
      ], function() {
        return this.calc_scale();
      }, true);
    };

    LinearMapper.prototype.map_screen = function(data) {
      return this.get('scale')(data);
    };

    return LinearMapper;

  })(Mapper);

  LinearMappers = (function(_super) {

    __extends(LinearMappers, _super);

    function LinearMappers() {
      LinearMappers.__super__.constructor.apply(this, arguments);
    }

    LinearMappers.prototype.model = LinearMapper;

    return LinearMappers;

  })(Backbone.Collection);

  "Discrete Color Mapper";

  DiscreteColorMapper = (function(_super) {

    __extends(DiscreteColorMapper, _super);

    function DiscreteColorMapper() {
      DiscreteColorMapper.__super__.constructor.apply(this, arguments);
    }

    DiscreteColorMapper.prototype.type = 'DiscreteColorMapper';

    DiscreteColorMapper.prototype.defaults = {
      colors: ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"],
      data_range: null
    };

    DiscreteColorMapper.prototype.dinitialize = function(attrs, options) {
      DiscreteColorMapper.__super__.dinitialize.call(this, attrs, options);
      this.register_property('factor_map', ['data_range'], function() {
        var domain_map, index, val, _len, _ref;
        domain_map = {};
        _ref = this.get('data_range').get('values');
        for (index = 0, _len = _ref.length; index < _len; index++) {
          val = _ref[index];
          domain_map[val] = index;
        }
        return domain_map;
      }, true);
      return this.register_property('scale', ['colors', 'factor_map'], function() {
        return d3.scale.ordinal().domain(_.values(this.get('factor_map'))).range(this.get('colors'));
      }, true);
    };

    DiscreteColorMapper.prototype.map_screen = function(data) {
      return this.get('scale')(this.get('factor_map')[data]);
    };

    return DiscreteColorMapper;

  })(HasProperties);

  DiscreteColorMappers = (function(_super) {

    __extends(DiscreteColorMappers, _super);

    function DiscreteColorMappers() {
      DiscreteColorMappers.__super__.constructor.apply(this, arguments);
    }

    DiscreteColorMappers.prototype.model = DiscreteColorMapper;

    return DiscreteColorMappers;

  })(Backbone.Collection);

  "Data Sources";

  ObjectArrayDataSource = (function(_super) {

    __extends(ObjectArrayDataSource, _super);

    function ObjectArrayDataSource() {
      ObjectArrayDataSource.__super__.constructor.apply(this, arguments);
    }

    ObjectArrayDataSource.prototype.type = 'ObjectArrayDataSource';

    ObjectArrayDataSource.prototype.defaults = {
      data: [{}],
      name: 'data'
    };

    ObjectArrayDataSource.prototype.initialize = function(attrs, options) {
      ObjectArrayDataSource.__super__.initialize.call(this, attrs, options);
      this.cont_ranges = {};
      return this.discrete_ranges = {};
    };

    ObjectArrayDataSource.prototype.getcolumn = function(colname) {
      var x;
      return (function() {
        var _i, _len, _ref, _results;
        _ref = this.get('data');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(x[colname]);
        }
        return _results;
      }).call(this);
    };

    ObjectArrayDataSource.prototype.compute_cont_range = function(field) {
      var max, min, x;
      max = _.max((function() {
        var _i, _len, _ref, _results;
        _ref = this.get('data');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(x[field]);
        }
        return _results;
      }).call(this));
      min = _.min((function() {
        var _i, _len, _ref, _results;
        _ref = this.get('data');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(x[field]);
        }
        return _results;
      }).call(this));
      return [min, max];
    };

    ObjectArrayDataSource.prototype.compute_discrete_factor = function(field) {
      var temp, uniques, val, x, _i, _len, _ref;
      temp = {};
      _ref = (function() {
        var _j, _len, _ref, _results;
        _ref = this.get('data');
        _results = [];
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          x = _ref[_j];
          _results.push(x[field]);
        }
        return _results;
      }).call(this);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        val = _ref[_i];
        temp[val] = true;
      }
      uniques = _.keys(temp);
      return uniques = _.sortBy(uniques, (function(x) {
        return x;
      }));
    };

    ObjectArrayDataSource.prototype.get_cont_range = function(field, padding) {
      var center, max, min, span, _ref, _ref2,
        _this = this;
      if (_.isUndefined(padding)) padding = 1.0;
      if (!_.has(this.cont_ranges, field)) {
        _ref = this.compute_cont_range(field), min = _ref[0], max = _ref[1];
        span = (max - min) * (1 + padding);
        center = (max + min) / 2.0;
        _ref2 = [center - span / 2.0, center + span / 2.0], min = _ref2[0], max = _ref2[1];
        this.cont_ranges[field] = Collections['Range1d'].create({
          'start': min,
          'end': max
        });
        this.on('change:data', function() {
          var _ref3;
          _ref3 = _this.compute_cont_range(field), max = _ref3[0], min = _ref3[1];
          _this.cont_ranges[field].set('start', min);
          return _this.cont_ranges[field].set('end', max);
        });
      }
      return this.cont_ranges[field];
    };

    ObjectArrayDataSource.prototype.get_discrete_range = function(field) {
      var factors,
        _this = this;
      if (!_.has(this.discrete_ranges, field)) {
        factors = this.compute_discrete_factor(field);
        this.discrete_ranges[field] = Collections['FactorRange'].create({
          values: factors
        });
        this.on('change:data', function() {
          factors = _this.compute_discrete_factor(field);
          return _this.discrete_ranges[field] = Collections['FactorRange'].set('values', factors);
        });
      }
      return this.discrete_ranges[field];
    };

    return ObjectArrayDataSource;

  })(HasProperties);

  ObjectArrayDataSources = (function(_super) {

    __extends(ObjectArrayDataSources, _super);

    function ObjectArrayDataSources() {
      ObjectArrayDataSources.__super__.constructor.apply(this, arguments);
    }

    ObjectArrayDataSources.prototype.model = ObjectArrayDataSource;

    return ObjectArrayDataSources;

  })(Backbone.Collection);

  "Individual Components below.\nwe first define the default view for a component,\nthe model for the component, and the collection";

  "Plot Container";

  GridPlotContainerView = (function(_super) {

    __extends(GridPlotContainerView, _super);

    function GridPlotContainerView() {
      GridPlotContainerView.__super__.constructor.apply(this, arguments);
    }

    GridPlotContainerView.prototype.initialize = function(options) {
      GridPlotContainerView.__super__.initialize.call(this, options);
      this.childviews = {};
      this.build_children();
      this.model.on('change:children', this.build_children, this);
      return this.model.on('change', this.render, this);
    };

    GridPlotContainerView.prototype.build_children = function() {
      var childspecs, node, row, x, _i, _j, _len, _len2, _ref;
      node = this.build_node();
      childspecs = [];
      _ref = this.mget('children');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        for (_j = 0, _len2 = row.length; _j < _len2; _j++) {
          x = row[_j];
          childspecs.push(x);
        }
      }
      return build_views(this.model, this.childviews, childspecs, {
        'el': this.tag_d3('plot')[0][0]
      });
    };

    GridPlotContainerView.prototype.build_node = function() {
      var node;
      node = this.tag_d3('mainsvg');
      if (node === null) {
        node = d3.select(this.el).append('svg').attr('id', this.tag_id('mainsvg'));
        node.append('g').attr('id', this.tag_id('plot'));
      }
      return node;
    };

    GridPlotContainerView.prototype.render = function() {
      var cidx, col_widths, node, plot, plotspec, ridx, row, row_heights, x_coords, y_coords, _len, _len2, _ref;
      node = this.build_node();
      this.tag_d3('plot').attr('transform', _.template('translate({{s}}, {{s}})', {
        's': this.mget('border_space')
      }));
      node.attr('width', this.mget('outerwidth')).attr('height', this.mget('outerheight')).attr('x', this.model.position_x()).attr('y', this.model.position_y());
      row_heights = this.model.layout_heights();
      col_widths = this.model.layout_widths();
      y_coords = [0];
      _.reduceRight(row_heights.slice(1), function(x, y) {
        var val;
        val = x + y;
        y_coords.push(val);
        return val;
      }, 0);
      y_coords.reverse();
      x_coords = [0];
      _.reduce(col_widths.slice(0), function(x, y) {
        var val;
        val = x + y;
        x_coords.push(val);
        return val;
      }, 0);
      _ref = this.mget('children');
      for (ridx = 0, _len = _ref.length; ridx < _len; ridx++) {
        row = _ref[ridx];
        for (cidx = 0, _len2 = row.length; cidx < _len2; cidx++) {
          plotspec = row[cidx];
          plot = this.model.resolve_ref(plotspec);
          this.childviews[plot.id].render();
          plot.set({
            'offset': [x_coords[cidx], y_coords[ridx]],
            'usedialog': false
          });
        }
      }
      if (this.mget('usedialog') && !this.$el.is(":visible")) {
        return this.add_dialog();
      }
    };

    return GridPlotContainerView;

  })(BokehView);

  GridPlotContainer = (function(_super) {

    __extends(GridPlotContainer, _super);

    function GridPlotContainer() {
      this.maxdim = __bind(this.maxdim, this);
      GridPlotContainer.__super__.constructor.apply(this, arguments);
    }

    GridPlotContainer.prototype.type = 'GridPlotContainer';

    GridPlotContainer.prototype.default_view = GridPlotContainerView;

    GridPlotContainer.prototype.setup_layout_property = function() {
      var child, dependencies, row, _i, _j, _len, _len2, _ref;
      dependencies = [];
      _ref = this.get('children');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        for (_j = 0, _len2 = row.length; _j < _len2; _j++) {
          child = row[_j];
          dependencies.push({
            'ref': child,
            'fields': ['outerheight', 'outerwidth']
          });
        }
      }
      return this.register_property('layout', dependencies, function() {
        return [this.layout_heights(), this.layout_widths()];
      }, true);
    };

    GridPlotContainer.prototype.dinitialize = function(attrs, options) {
      GridPlotContainer.__super__.dinitialize.call(this, attrs, options);
      this.setup_layout_property();
      safebind(this, this, 'change:children', function() {
        this.remove_property('layout');
        this.setup_layout_property();
        return this.trigger('change:layout', this, this.get('layout'));
      });
      this.register_property('height', ['layout'], function() {
        return _.reduce(this.get('layout')[0], (function(x, y) {
          return x + y;
        }), 0);
      }, true);
      return this.register_property('width', ['layout'], function() {
        return _.reduce(this.get('layout')[1], (function(x, y) {
          return x + y;
        }), 0);
      }, true);
    };

    GridPlotContainer.prototype.maxdim = function(dim, row) {
      var x;
      if (row.length === 0) {
        return 0;
      } else {
        return _.max((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = row.length; _i < _len; _i++) {
            x = row[_i];
            _results.push(this.resolve_ref(x).get(dim));
          }
          return _results;
        }).call(this));
      }
    };

    GridPlotContainer.prototype.layout_heights = function() {
      var row, row_heights;
      row_heights = (function() {
        var _i, _len, _ref, _results;
        _ref = this.get('children');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          row = _ref[_i];
          _results.push(this.maxdim('outerheight', row));
        }
        return _results;
      }).call(this);
      return row_heights;
    };

    GridPlotContainer.prototype.layout_widths = function() {
      var col, col_widths, columns, maxdim, n, num_cols, row,
        _this = this;
      maxdim = function(dim, row) {
        var x;
        return _.max((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = row.length; _i < _len; _i++) {
            x = row[_i];
            _results.push(this.resolve_ref(x).get(dim));
          }
          return _results;
        }).call(_this));
      };
      num_cols = this.get('children')[0].length;
      columns = (function() {
        var _i, _len, _ref, _results;
        _ref = _.range(num_cols);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          _results.push((function() {
            var _j, _len2, _ref2, _results2;
            _ref2 = this.get('children');
            _results2 = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              row = _ref2[_j];
              _results2.push(row[n]);
            }
            return _results2;
          }).call(this));
        }
        return _results;
      }).call(this);
      col_widths = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = columns.length; _i < _len; _i++) {
          col = columns[_i];
          _results.push(this.maxdim('outerwidth', col));
        }
        return _results;
      }).call(this);
      return col_widths;
    };

    return GridPlotContainer;

  })(Component);

  GridPlotContainer.prototype.defaults = _.clone(GridPlotContainer.prototype.defaults);

  _.extend(GridPlotContainer.prototype.defaults, {
    resize_children: false,
    children: [[]],
    usedialog: false,
    border_space: 0
  });

  GridPlotContainers = (function(_super) {

    __extends(GridPlotContainers, _super);

    function GridPlotContainers() {
      GridPlotContainers.__super__.constructor.apply(this, arguments);
    }

    GridPlotContainers.prototype.model = GridPlotContainer;

    return GridPlotContainers;

  })(Backbone.Collection);

  PlotView = (function(_super) {

    __extends(PlotView, _super);

    function PlotView() {
      PlotView.__super__.constructor.apply(this, arguments);
    }

    PlotView.prototype.initialize = function(options) {
      PlotView.__super__.initialize.call(this, options);
      this.renderers = {};
      this.axes = {};
      this.build_renderers();
      this.build_axes();
      this.render();
      safebind(this, this.model, 'change:renderers', this.build_renderers);
      safebind(this, this.model, 'change:axes', this.build_axes);
      return safebind(this, this.model, 'change', this.render);
    };

    PlotView.prototype.build_renderers = function() {
      return build_views(this.model, this.renderers, this.mget('renderers'), {
        'el': this.el,
        'plot_id': this.id,
        'plot_model': this.model
      });
    };

    PlotView.prototype.build_axes = function() {
      return build_views(this.model, this.axes, this.mget('axes'), {
        'el': this.el,
        'plot_id': this.id,
        'plot_model': this.model
      });
    };

    PlotView.prototype.render_mainsvg = function() {
      var node;
      node = this.tag_d3('mainsvg');
      if (node === null) {
        node = d3.select(this.el).append('svg').attr('id', this.tag_id('mainsvg'));
        node.append('g').attr('id', this.tag_id('plot'));
      }
      if (!this.mget('usedialog')) {
        node.attr('x', this.model.position_x()).attr('y', this.model.position_y());
      }
      node.attr('width', this.mget('outerwidth')).attr("height", this.mget('outerheight'));
      return this.tag_d3('plot').attr('transform', _.template('translate({{s}}, {{s}})', {
        's': this.mget('border_space')
      }));
    };

    PlotView.prototype.render_frame = function() {
      var innernode;
      innernode = this.tag_d3('innerbox');
      if (innernode === null) {
        innernode = this.tag_d3('plot').append('rect').attr('id', this.tag_id('innerbox'));
      }
      return innernode.attr('fill', this.mget('background_color')).attr('stroke', this.model.get('foreground_color')).attr('width', this.mget('width')).attr("height", this.mget('height'));
    };

    PlotView.prototype.render = function() {
      var key, view, _ref, _ref2;
      this.render_mainsvg();
      this.render_frame();
      _ref = this.axes;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        view = _ref[key];
        view.render();
      }
      _ref2 = this.renderers;
      for (key in _ref2) {
        if (!__hasProp.call(_ref2, key)) continue;
        view = _ref2[key];
        view.render();
      }
      if (this.mget('usedialog') && !this.$el.is(":visible")) {
        return this.add_dialog();
      }
    };

    return PlotView;

  })(BokehView);

  build_views = function(mainmodel, view_storage, view_specs, options) {
    var found, key, model, spec, value, _i, _len, _len2, _results;
    found = {};
    for (_i = 0, _len = view_specs.length; _i < _len; _i++) {
      spec = view_specs[_i];
      model = mainmodel.resolve_ref(spec);
      found[model.id] = true;
      if (view_storage[model.id]) continue;
      options = _.extend({}, spec.options, options, {
        'model': model
      });
      view_storage[model.id] = new model.default_view(options);
    }
    _results = [];
    for (value = 0, _len2 = view_storage.length; value < _len2; value++) {
      key = view_storage[value];
      if (!_.has(found, key)) {
        value.remove();
        _results.push(delete view_storage[key]);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Plot = (function(_super) {

    __extends(Plot, _super);

    function Plot() {
      Plot.__super__.constructor.apply(this, arguments);
    }

    Plot.prototype.type = 'Plot';

    Plot.prototype.default_view = PlotView;

    Plot.prototype.parent_properties = ['background_color', 'foreground_color', 'width', 'height', 'border_space'];

    return Plot;

  })(Component);

  Plot.prototype.defaults = _.clone(Plot.prototype.defaults);

  _.extend(Plot.prototype.defaults, {
    'data_sources': {},
    'renderers': [],
    'axes': [],
    'legends': [],
    'tools': [],
    'overlays': [],
    'usedialog': false
  });

  Plot.prototype.display_defaults = _.clone(Plot.prototype.display_defaults);

  _.extend(Plot.prototype.display_defaults, {
    'background_color': "#ddd",
    'foreground_color': "#333",
    'width': 200,
    'height': 200
  });

  Plots = (function(_super) {

    __extends(Plots, _super);

    function Plots() {
      Plots.__super__.constructor.apply(this, arguments);
    }

    Plots.prototype.model = Plot;

    return Plots;

  })(Backbone.Collection);

  "D3LinearAxisView";

  D3LinearAxisView = (function(_super) {

    __extends(D3LinearAxisView, _super);

    function D3LinearAxisView() {
      D3LinearAxisView.__super__.constructor.apply(this, arguments);
    }

    D3LinearAxisView.prototype.get_offsets = function(orientation) {
      var offsets;
      offsets = {
        'x': 0,
        'y': 0
      };
      if (orientation === 'bottom') offsets['y'] += this.plot_model.get('height');
      return offsets;
    };

    D3LinearAxisView.prototype.get_tick_size = function(orientation) {
      if (!_.isNull(this.mget('tickSize'))) {
        return this.mget('tickSize');
      } else {
        if (orientation === 'bottom') {
          return -this.plot_model.get('height');
        } else {
          return -this.plot_model.get('width');
        }
      }
    };

    D3LinearAxisView.prototype.convert_scale = function(scale) {
      var domain, func, range, _ref;
      if (!scale) console.log('sdfasdf');
      domain = scale.domain();
      range = scale.range();
      if ((_ref = this.mget('orientation')) === 'bottom' || _ref === 'top') {
        func = 'xpos';
      } else {
        func = 'ypos';
      }
      range = [this.plot_model[func](range[0]), this.plot_model[func](range[1])];
      scale = d3.scale.linear().domain(domain).range(range);
      return scale;
    };

    D3LinearAxisView.prototype.render = function() {
      var axis, base, node, offsets, scale_converted, temp, ticksize;
      base = this.tag_d3('plot', this.plot_id);
      node = this.tag_d3('axis');
      if (!node) {
        node = base.append('g', this.tag_selector('plot', this.plot_id)).attr('id', this.tag_id('axis')).attr('class', 'D3LinearAxisView').attr('stroke', this.mget('foreground_color'));
      }
      offsets = this.get_offsets(this.mget('orientation'));
      offsets['h'] = this.plot_model.get('height');
      node.attr('transform', _.template('translate({{x}}, {{y}})', offsets));
      axis = d3.svg.axis();
      ticksize = this.get_tick_size(this.mget('orientation'));
      scale_converted = this.convert_scale(this.mget_ref('mapper').get('scale'));
      temp = axis.scale(scale_converted);
      temp.orient(this.mget('orientation')).ticks(this.mget('ticks')).tickSubdivide(this.mget('tickSubdivide')).tickSize(ticksize).tickPadding(this.mget('tickPadding'));
      node.call(axis);
      return node.selectAll('.tick').attr('stroke', this.mget('tick_color'));
    };

    return D3LinearAxisView;

  })(Renderer);

  D3LinearAxis = (function(_super) {

    __extends(D3LinearAxis, _super);

    function D3LinearAxis() {
      D3LinearAxis.__super__.constructor.apply(this, arguments);
    }

    D3LinearAxis.prototype.type = 'D3LinearAxis';

    D3LinearAxis.prototype.default_view = D3LinearAxisView;

    D3LinearAxis.prototype.defaults = {
      mapper: null,
      orientation: 'bottom',
      ticks: 10,
      ticksSubdivide: 1,
      tickSize: null,
      tickPadding: 3
    };

    D3LinearAxis.prototype.display_defaults = {
      tick_color: '#fff'
    };

    return D3LinearAxis;

  })(Component);

  D3LinearAxes = (function(_super) {

    __extends(D3LinearAxes, _super);

    function D3LinearAxes() {
      D3LinearAxes.__super__.constructor.apply(this, arguments);
    }

    D3LinearAxes.prototype.model = D3LinearAxis;

    return D3LinearAxes;

  })(Backbone.Collection);

  LineRendererView = (function(_super) {

    __extends(LineRendererView, _super);

    function LineRendererView() {
      LineRendererView.__super__.constructor.apply(this, arguments);
    }

    LineRendererView.prototype.render_line = function(node) {
      var line, xfield, xmapper, yfield, ymapper,
        _this = this;
      xmapper = this.model.get_ref('xmapper');
      ymapper = this.model.get_ref('ymapper');
      xfield = this.model.get('xfield');
      yfield = this.model.get('yfield');
      line = d3.svg.line().x(function(d) {
        var pos;
        pos = xmapper.map_screen(d[xfield]);
        return _this.model.xpos(pos);
      }).y(function(d) {
        var pos;
        pos = ymapper.map_screen(d[yfield]);
        return _this.model.ypos(pos);
      });
      node.attr('stroke', this.mget('color')).attr('d', line);
      return node.attr('fill', 'none');
    };

    LineRendererView.prototype.render = function() {
      var node, path, plot;
      plot = this.tag_d3('plot', this.plot_id);
      node = this.tag_d3('line');
      if (!node) node = plot.append('g').attr('id', this.tag_id('line'));
      path = node.selectAll('path').data([this.model.get_ref('data_source').get('data')]);
      this.render_line(path);
      return this.render_line(path.enter().append('path'));
    };

    return LineRendererView;

  })(Renderer);

  LineRenderer = (function(_super) {

    __extends(LineRenderer, _super);

    function LineRenderer() {
      LineRenderer.__super__.constructor.apply(this, arguments);
    }

    LineRenderer.prototype.type = 'LineRenderer';

    LineRenderer.prototype.default_view = LineRendererView;

    return LineRenderer;

  })(Component);

  LineRenderer.prototype.defaults = _.clone(LineRenderer.prototype.defaults);

  _.extend(LineRenderer.prototype.defaults, {
    xmapper: null,
    ymapper: null,
    xfield: null,
    yfield: null,
    color: "#000"
  });

  LineRenderers = (function(_super) {

    __extends(LineRenderers, _super);

    function LineRenderers() {
      LineRenderers.__super__.constructor.apply(this, arguments);
    }

    LineRenderers.prototype.model = LineRenderer;

    return LineRenderers;

  })(Backbone.Collection);

  ScatterRendererView = (function(_super) {

    __extends(ScatterRendererView, _super);

    function ScatterRendererView() {
      ScatterRendererView.__super__.constructor.apply(this, arguments);
    }

    ScatterRendererView.prototype.render_marks = function(marks) {
      var xfield, xmapper, yfield, ymapper,
        _this = this;
      xmapper = this.model.get_ref('xmapper');
      ymapper = this.model.get_ref('ymapper');
      xfield = this.model.get('xfield');
      yfield = this.model.get('yfield');
      return marks.attr('cx', function(d) {
        var pos;
        pos = xmapper.map_screen(d[xfield]);
        return _this.model.xpos(pos);
      }).attr('cy', function(d) {
        var pos;
        pos = ymapper.map_screen(d[yfield]);
        return _this.model.ypos(pos);
      }).attr('r', this.model.get('radius')).attr('fill', function(d) {
        if (_this.model.get('color_field')) {
          return _this.model.get_ref('color_mapper').map_screen(d[_this.model.get('color_field')]);
        } else {
          return _this.model.get('foreground_color');
        }
      });
    };

    ScatterRendererView.prototype.render = function() {
      var circles, node, plot;
      plot = this.tag_d3('plot', this.plot_id);
      node = this.tag_d3('scatter');
      if (!node) node = plot.append('g').attr('id', this.tag_id('scatter'));
      circles = node.selectAll(this.model.get('mark')).data(this.model.get_ref('data_source').get('data'));
      this.render_marks(circles);
      this.render_marks(circles.enter().append(this.model.get('mark')));
      return circles.exit().remove();
    };

    return ScatterRendererView;

  })(Renderer);

  ScatterRenderer = (function(_super) {

    __extends(ScatterRenderer, _super);

    function ScatterRenderer() {
      ScatterRenderer.__super__.constructor.apply(this, arguments);
    }

    ScatterRenderer.prototype.type = 'ScatterRenderer';

    ScatterRenderer.prototype.default_view = ScatterRendererView;

    return ScatterRenderer;

  })(Component);

  ScatterRenderer.prototype.defaults = _.clone(ScatterRenderer.prototype.defaults);

  _.extend(ScatterRenderer.prototype.defaults, {
    data_source: null,
    xmapper: null,
    ymapper: null,
    xfield: null,
    yfield: null,
    colormapper: null,
    colorfield: null,
    mark: 'circle'
  });

  ScatterRenderer.prototype.display_defaults = _.clone(ScatterRenderer.prototype.display_defaults);

  _.extend(ScatterRenderer.prototype.display_defaults, {
    radius: 3
  });

  ScatterRenderers = (function(_super) {

    __extends(ScatterRenderers, _super);

    function ScatterRenderers() {
      ScatterRenderers.__super__.constructor.apply(this, arguments);
    }

    ScatterRenderers.prototype.model = ScatterRenderer;

    return ScatterRenderers;

  })(Backbone.Collection);

  "Convenience plotting functions";

  Bokeh.scatter_plot = function(parent, data_source, xfield, yfield, color_field, mark, colormapper) {
    var color_mapper, plot_model, scatter_plot, source_name, xaxis, xmapper, xr, yaxis, ymapper, yr;
    if (_.isUndefined(mark)) mark = 'circle';
    if (_.isUndefined(color_field)) color_field = null;
    if (_.isUndefined(color_mapper) && color_field) {
      color_mapper = Collections['DiscreteColorMapper'].create({
        data_range: Collections['DataFactorRange'].create({
          data_source: data_source.ref(),
          columns: ['x']
        })
      });
    }
    source_name = data_source.get('name');
    plot_model = Collections['Plot'].create({
      data_sources: {
        source_name: data_source.ref()
      },
      parent: parent
    });
    xr = Collections['PlotRange1d'].create({
      'plot': plot_model.ref(),
      'attribute': 'width'
    });
    yr = Collections['PlotRange1d'].create({
      'plot': plot_model.ref(),
      'attribute': 'height'
    });
    xmapper = Collections['LinearMapper'].create({
      data_range: Collections['DataRange1d'].create({
        'data_source': data_source.ref(),
        'columns': ['x']
      }),
      screen_range: xr.ref()
    });
    ymapper = Collections['LinearMapper'].create({
      data_range: Collections['DataRange1d'].create({
        'data_source': data_source.ref(),
        'columns': ['y']
      }),
      screen_range: yr.ref()
    });
    scatter_plot = Collections["ScatterRenderer"].create({
      data_source: data_source.ref(),
      xfield: xfield,
      yfield: yfield,
      color_field: color_field,
      color_mapper: color_mapper,
      mark: mark,
      xmapper: xmapper.ref(),
      ymapper: ymapper.ref(),
      parent: plot_model.ref()
    });
    xaxis = Collections['D3LinearAxis'].create({
      'orientation': 'bottom',
      'mapper': xmapper.ref(),
      'parent': plot_model.ref()
    });
    yaxis = Collections['D3LinearAxis'].create({
      'orientation': 'left',
      'mapper': ymapper.ref(),
      'parent': plot_model.ref()
    });
    return plot_model.set({
      'renderers': [scatter_plot.ref()],
      'axes': [xaxis.ref(), yaxis.ref()]
    });
  };

  Bokeh.line_plot = function(parent, data_source, xfield, yfield) {
    var line_plot, plot_model, source_name, xaxis, xmapper, xr, yaxis, ymapper, yr;
    source_name = data_source.get('name');
    plot_model = Collections['Plot'].create({
      data_sources: {
        source_name: data_source.ref()
      },
      parent: parent
    });
    xr = Collections['PlotRange1d'].create({
      'plot': plot_model.ref(),
      'attribute': 'width'
    });
    yr = Collections['PlotRange1d'].create({
      'plot': plot_model.ref(),
      'attribute': 'height'
    });
    xmapper = Collections['LinearMapper'].create({
      data_range: data_source.get_cont_range(xfield, 0.1),
      screen_range: xr.ref()
    });
    ymapper = Collections['LinearMapper'].create({
      data_range: data_source.get_cont_range(yfield, 0.1),
      screen_range: yr.ref()
    });
    line_plot = Collections["LineRenderer"].create({
      data_source: data_source.ref(),
      xfield: xfield,
      yfield: yfield,
      xmapper: xmapper.ref(),
      ymapper: ymapper.ref(),
      parent: plot_model.ref()
    });
    xaxis = Collections['D3LinearAxis'].create({
      'orientation': 'bottom',
      'mapper': xmapper.ref(),
      'parent': plot_model.ref()
    });
    yaxis = Collections['D3LinearAxis'].create({
      'orientation': 'left',
      'mapper': ymapper.ref(),
      'parent': plot_model.ref()
    });
    return plot_model.set({
      'renderers': [line_plot.ref()],
      'axes': [xaxis.ref(), yaxis.ref()]
    });
  };

  Bokeh.register_collection('Plot', new Plots);

  Bokeh.register_collection('ScatterRenderer', new ScatterRenderers);

  Bokeh.register_collection('LineRenderer', new LineRenderers);

  Bokeh.register_collection('ObjectArrayDataSource', new ObjectArrayDataSources);

  Bokeh.register_collection('Range1d', new Range1ds);

  Bokeh.register_collection('PlotRange1d', new PlotRange1ds);

  Bokeh.register_collection('LinearMapper', new LinearMappers);

  Bokeh.register_collection('D3LinearAxis', new D3LinearAxes);

  Bokeh.register_collection('DiscreteColorMapper', new DiscreteColorMappers);

  Bokeh.register_collection('FactorRange', new FactorRanges);

  Bokeh.register_collection('GridPlotContainer', new GridPlotContainers);

  Bokeh.register_collection('DataRange1d', new DataRange1ds);

  Bokeh.register_collection('DataFactorRange', new DataFactorRanges);

  Bokeh.Collections = Collections;

  Bokeh.HasProperties = HasProperties;

  Bokeh.ObjectArrayDataSource = ObjectArrayDataSource;

  Bokeh.Plot = Plot;

  Bokeh.Component = Component;

  Bokeh.ScatterRenderer = ScatterRenderer;

  Bokeh.BokehView = BokehView;

  Bokeh.PlotView = PlotView;

  Bokeh.ScatterRendererView = ScatterRendererView;

  Bokeh.D3LinearAxis = D3LinearAxis;

  Bokeh.LineRendererView = LineRendererView;

  Bokeh.LineRenderers = LineRenderers;

  Bokeh.LineRenderer = LineRenderer;

  Bokeh.GridPlotContainerView = GridPlotContainerView;

  Bokeh.GridPlotContainers = GridPlotContainers;

  Bokeh.GridPlotContainer = GridPlotContainer;

}).call(this);

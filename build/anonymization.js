/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var $GH					= __webpack_require__(1);
	var $CSV	 			= __webpack_require__(3);
	var $Sangreea 	= __webpack_require__(4);


	var out = typeof window !== 'undefined' ? window : global;


	out.Anonymity = {
		GenHierarchy:	{
			String		: $GH.StringGenHierarchy,
			Category	: $GH.ContGenHierarchy
		},
		Input: {
			CSV			 		: $CSV.CSV
		},
		Algorithms: {
			Sangreea		: $Sangreea.SaNGreeA
		}
	};

	module.exports = {
		$G : out.$G
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(2);
	var StringGenHierarchy = (function () {
	    function StringGenHierarchy(filePath) {
	        this.filePath = filePath;
	        this._entries = {};
	        this._nr_levels = 0;
	        var json = JSON.parse(fs.readFileSync(filePath).toString());
	        this._name = json.name;
	        this.readFromJson(json);
	    }
	    StringGenHierarchy.prototype.readFromJson = function (json) {
	        var level_1s = 0;
	        for (var entry_idx in json.entries) {
	            var json_entry = json.entries[entry_idx];
	            var level = +json_entry.level;
	            if (level === 0) {
	                level_1s++;
	            }
	            if (level > this._nr_levels) {
	                this._nr_levels = level;
	            }
	            var entry = ({
	                "name": json_entry.name,
	                "gen": json_entry.gen,
	                "level": json_entry.level
	            });
	            this._entries[entry_idx] = entry;
	        }
	        if (level_1s !== 1) {
	            throw new Error("JSON invalid. Level 0 must contain exactly 1 entry.");
	        }
	    };
	    StringGenHierarchy.prototype.nrLevels = function () {
	        return this._nr_levels;
	    };
	    StringGenHierarchy.prototype.getEntries = function () {
	        return this._entries;
	    };
	    StringGenHierarchy.prototype.getLevelEntry = function (key) {
	        return this._entries[key] ? this._entries[key].level : undefined;
	    };
	    StringGenHierarchy.prototype.getGeneralizationOf = function (key) {
	        return this._entries[key] ? this._entries[key].gen : undefined;
	    };
	    StringGenHierarchy.prototype.getName = function (key) {
	        return this._entries[key].name;
	    };
	    return StringGenHierarchy;
	}());
	exports.StringGenHierarchy = StringGenHierarchy;
	var ContGenHierarchy = (function () {
	    function ContGenHierarchy(_name, _min, _max) {
	        this._name = _name;
	        this._min = _min;
	        this._max = _max;
	        if (_min > _max) {
	            throw new Error('Range invalid. Min greater than Max.');
	        }
	        if (_min === _max) {
	            throw new Error('Range invalid. Min equals Max.');
	        }
	    }
	    ContGenHierarchy.prototype.genCostOfRange = function (from, to) {
	        if (from > to) {
	            throw new Error('Cannot generalize to negative range.');
	        }
	        if (from < this._min) {
	            throw new Error('Cannot generalize span. From parameter less than range min.');
	        }
	        if (to > this._max) {
	            throw new Error('Cannot generalize span. To parameter greater than range max.');
	        }
	        return ((to - from) / (this._max - this._min));
	    };
	    return ContGenHierarchy;
	}());
	exports.ContGenHierarchy = ContGenHierarchy;


/***/ },
/* 2 */
/***/ function(module, exports) {

	

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var CSV = (function () {
	    function CSV(_sep) {
	        if (_sep === void 0) { _sep = ","; }
	        this._sep = _sep;
	    }
	    CSV.prototype.readCSV = function () {
	    };
	    return CSV;
	}());
	exports.CSV = CSV;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(2);
	var $GH = __webpack_require__(1);
	var $C = __webpack_require__(5);
	var $G = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"graphinius\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	(function (HierarchyType) {
	    HierarchyType[HierarchyType["CONTINUOUS"] = 0] = "CONTINUOUS";
	    HierarchyType[HierarchyType["CATEGORICAL"] = 1] = "CATEGORICAL";
	})(exports.HierarchyType || (exports.HierarchyType = {}));
	var HierarchyType = exports.HierarchyType;
	var SaNGreeA = (function () {
	    function SaNGreeA(_name, config) {
	        if (_name === void 0) { _name = "default"; }
	        this._name = _name;
	        this.config = config;
	        this._cont_hierarchies = {};
	        this._cat_hierarchies = {};
	        this._range_hierarchy_indices = {};
	        this._categorical_hierarchy_indices = {};
	        this._config = config || $C.CONFIG;
	        if (this._config.INPUT_FILE === "") {
	            throw new Error('Input file cannot be an empty string');
	        }
	        if (this._config.NR_DRAWS < 0) {
	            throw new Error('Options invalid. Nr_draws can not be negative.');
	        }
	        if (this._config.EDGE_MIN < 0) {
	            throw new Error('Options invalid. Edge_min can not be negative.');
	        }
	        if (this._config.EDGE_MAX < 0) {
	            throw new Error('Options invalid. Edge_max can not be negative.');
	        }
	        if (this._config.EDGE_MAX < this._config.EDGE_MIN) {
	            throw new Error('Options invalid. Edge_min cannot exceed edge_max.');
	        }
	        this._graph = new $G.core.BaseGraph(this._name);
	    }
	    SaNGreeA.prototype.getConfig = function () {
	        return this._config;
	    };
	    SaNGreeA.prototype.getContHierarchies = function () {
	        return this._cont_hierarchies;
	    };
	    SaNGreeA.prototype.getCatHierarchies = function () {
	        return this._cat_hierarchies;
	    };
	    SaNGreeA.prototype.getContHierarchy = function (name) {
	        return this._cont_hierarchies[name];
	    };
	    SaNGreeA.prototype.getCatHierarchy = function (name) {
	        return this._cat_hierarchies[name];
	    };
	    SaNGreeA.prototype.setContHierarchy = function (name, genh) {
	        this._cont_hierarchies[name] = genh;
	    };
	    SaNGreeA.prototype.setCatHierarchy = function (name, genh) {
	        this._cat_hierarchies[name] = genh;
	    };
	    SaNGreeA.prototype.instantiateGraph = function (createEdges) {
	        if (createEdges === void 0) { createEdges = true; }
	        this.instantiateRangeHierarchies(this._config.INPUT_FILE);
	        this.readCSV(this._config.INPUT_FILE, this._graph);
	        if (createEdges === true) {
	            this._graph.createRandomEdgesSpan(this._config.EDGE_MIN, this._config.EDGE_MAX, false);
	        }
	    };
	    SaNGreeA.prototype.instantiateCategoricalHierarchies = function () {
	    };
	    SaNGreeA.prototype.instantiateRangeHierarchies = function (file) {
	        var _this = this;
	        var cont_hierarchies = Object.keys(this._cont_hierarchies);
	        var ranges = Object.keys(this._config.GEN_WEIGHT_VECTORS[this._config.VECTOR]['range']);
	        if (ranges.length < 1) {
	            return;
	        }
	        var str_input = fs.readFileSync(file).toString().split('\n');
	        var str_cols = str_input.shift().replace(/\s+/g, '').split(',');
	        str_cols.forEach(function (col, idx) {
	            if (ranges.indexOf(col) !== -1) {
	                _this._range_hierarchy_indices[col] = idx;
	            }
	        });
	        var min_max_struct = {};
	        ranges.forEach(function (range) {
	            min_max_struct[range] = {
	                'min': Number.POSITIVE_INFINITY,
	                'max': Number.NEGATIVE_INFINITY
	            };
	        });
	        var current_value = NaN;
	        str_input.forEach(function (line_string, idx) {
	            var line = line_string.replace(/\s+/g, '').split(',');
	            ranges.forEach(function (range) {
	                current_value = parseFloat(line[_this._range_hierarchy_indices[range]]);
	                if (current_value < min_max_struct[range]['min']) {
	                    min_max_struct[range]['min'] = current_value;
	                }
	                if (current_value > min_max_struct[range]['max']) {
	                    min_max_struct[range]['max'] = current_value;
	                }
	            });
	        });
	        ranges.forEach(function (range) {
	            var range_hierarchy = new $GH.ContGenHierarchy(range, min_max_struct[range]['min'], min_max_struct[range]['max']);
	            _this.setContHierarchy(range_hierarchy._name, range_hierarchy);
	        });
	    };
	    SaNGreeA.prototype.readCSV = function (file, graph) {
	        this.instantiateRangeHierarchies(file);
	        var str_input = fs.readFileSync(file).toString().split('\n');
	        var str_cols = str_input.shift().replace(/\s+/g, '').split(',');
	        var cont_hierarchies = Object.keys(this._cont_hierarchies);
	        var cat_hierarchies = Object.keys(this._cat_hierarchies);
	        var cont_feat_idx_select = {};
	        str_cols.forEach(function (col, idx) {
	            if (cont_hierarchies.indexOf(col) !== -1) {
	                cont_feat_idx_select[idx] = col;
	            }
	        });
	        var cat_feat_idx_select = {};
	        str_cols.forEach(function (col, idx) {
	            if (cat_hierarchies.indexOf(col) !== -1) {
	                cat_feat_idx_select[idx] = col;
	            }
	        });
	        var draw = this._config.NR_DRAWS;
	        for (var i = 0; i < draw; i++) {
	            if (!str_input[i]) {
	                continue;
	            }
	            var line = str_input[i].replace(/\s+/g, '').split(',');
	            var line_valid = true;
	            for (var idx in cat_feat_idx_select) {
	                var cat_hierarchy = this.getCatHierarchy(cat_feat_idx_select[idx]);
	                if (cat_hierarchy && !cat_hierarchy.getLevelEntry(line[idx])) {
	                    line_valid = false;
	                }
	            }
	            for (var idx in cont_feat_idx_select) {
	                var cont_hierarchy = this.getContHierarchy(cont_feat_idx_select[idx]);
	                if (+line[idx] !== +line[idx]) {
	                    line_valid = false;
	                }
	            }
	            if (!line_valid) {
	                draw++;
	                continue;
	            }
	            var node = this._graph.addNode("" + i);
	            for (var idx in cat_feat_idx_select) {
	                node.setFeature(cat_feat_idx_select[idx], line[idx]);
	            }
	            for (var idx in cont_feat_idx_select) {
	                node.setFeature(cont_feat_idx_select[idx], +line[idx]);
	            }
	            node.setFeature("income", line[line.length - 1]);
	        }
	    };
	    SaNGreeA.prototype.outputPreprocCSV = function (outfile, skip) {
	        var outstring = "", nodes = this._graph.getNodes(), node = null, feature = null;
	        var rows_eliminated = 0;
	        Object.keys(this._cont_hierarchies).forEach(function (range_hierarchy) {
	            outstring += range_hierarchy + ", ";
	        });
	        Object.keys(this._cat_hierarchies).forEach(function (cat_hierarchy) {
	            outstring += cat_hierarchy + ", ";
	        });
	        outstring += "income \n";
	        for (var node_key in this._graph.getNodes()) {
	            node = nodes[node_key];
	            skip = skip || {};
	            var prob = parseFloat(skip['prob']), feat = skip['feat'], value = skip['value'];
	            if (prob != null && feat != null && value != null) {
	                if (parseFloat(value) !== parseFloat(value)) {
	                    if (Math.random() < prob && node.getFeature(feat) === value) {
	                        rows_eliminated++;
	                        continue;
	                    }
	                }
	                else if (Math.random() < prob && node.getFeature(feat) > value) {
	                    rows_eliminated++;
	                    continue;
	                }
	            }
	            Object.keys(this._cont_hierarchies).forEach(function (range_hierarchy) {
	                outstring += node.getFeature(range_hierarchy) + ', ';
	            });
	            Object.keys(this._cat_hierarchies).forEach(function (cat_hierarchy) {
	                outstring += node.getFeature(cat_hierarchy) + ', ';
	            });
	            outstring += node.getFeature('income');
	            outstring += '\n';
	        }
	        console.log("Eliminated " + rows_eliminated + " rows from a DS of " + this._graph.nrNodes() + " rows.");
	        fs.writeFileSync("./test/io/test_output/" + outfile + ".csv", outstring);
	    };
	    SaNGreeA.prototype.outputAnonymizedCSV = function (outfile) {
	        var _this = this;
	        var outstring = "";
	        Object.keys(this._cont_hierarchies).forEach(function (range_hierarchy) {
	            outstring += range_hierarchy + ", ";
	        });
	        Object.keys(this._cat_hierarchies).forEach(function (cat_hierarchy) {
	            outstring += cat_hierarchy + ", ";
	        });
	        outstring += "income \n";
	        for (var cl_idx in this._clusters) {
	            var cluster = this._clusters[cl_idx], nodes = cluster.nodes;
	            for (var node_id in nodes) {
	                Object.keys(this._cont_hierarchies).forEach(function (range_hierarchy) {
	                    var range = cluster.gen_ranges[range_hierarchy];
	                    if (range[0] === range[1]) {
	                        outstring += range[0] + ", ";
	                    }
	                    else if (_this._config.AVERAGE_OUTPUT_RANGES) {
	                        var avg_age = (range[0] + range[1]) / 2.0;
	                        outstring += avg_age + ", ";
	                    }
	                    else {
	                        outstring += "[" + range[0] + " - " + range[1] + "], ";
	                    }
	                });
	                Object.keys(this._cat_hierarchies).forEach(function (cat_hierarchy) {
	                    var gen_Hierarchy = _this._cat_hierarchies[cat_hierarchy];
	                    outstring += gen_Hierarchy.getName(cluster.gen_feat[cat_hierarchy]) + ", ";
	                });
	                outstring += nodes[node_id].getFeature('income');
	                outstring += "\n";
	            }
	        }
	        fs.writeFileSync("./test/io/test_output/" + outfile + ".csv", outstring);
	    };
	    SaNGreeA.prototype.anonymizeGraph = function () {
	        var _this = this;
	        var S = [], nodes = this._graph.getNodes(), keys = Object.keys(nodes), current_node, candidate, current_best, added = {}, nr_open = Object.keys(nodes).length, cont_costs, cat_costs, GIL, SIL, total_costs, best_costs, i, j;
	        for (i = 0; i < keys.length; i++) {
	            current_node = nodes[keys[i]];
	            if (added[current_node.getID()]) {
	                continue;
	            }
	            var Cl = {
	                nodes: {},
	                gen_feat: {},
	                gen_ranges: {}
	            };
	            Object.keys(this._cat_hierarchies).forEach(function (cat) {
	                Cl.gen_feat[cat] = current_node.getFeature(cat);
	            });
	            Object.keys(this._cont_hierarchies).forEach(function (range) {
	                Cl.gen_ranges[range] = [current_node.getFeature(range), current_node.getFeature(range)];
	            });
	            Cl.nodes[current_node.getID()] = current_node;
	            added[current_node.getID()] = true;
	            nr_open--;
	            while (Object.keys(Cl.nodes).length < this._config.K_FACTOR && nr_open) {
	                best_costs = Number.POSITIVE_INFINITY;
	                for (j = i + 1; j < keys.length; j++) {
	                    candidate = nodes[keys[j]];
	                    if (added[candidate.getID()]) {
	                        continue;
	                    }
	                    cat_costs = this.calculateCatCosts(Cl, candidate);
	                    cont_costs = this.calculateContCosts(Cl, candidate);
	                    GIL = cat_costs + cont_costs;
	                    SIL = this._config.BETA > 0 ? this.calculateSIL(Cl, candidate) : 0;
	                    total_costs = this._config.ALPHA * GIL + this._config.BETA * SIL;
	                    if (total_costs < best_costs) {
	                        best_costs = total_costs;
	                        current_best = candidate;
	                    }
	                }
	                Cl.nodes[current_best.getID()] = current_best;
	                this.updateLevels(Cl, current_best);
	                Object.keys(this._cont_hierarchies).forEach(function (range) {
	                    _this.updateRange(Cl.gen_ranges[range], current_best.getFeature(range));
	                });
	                added[current_best.getID()] = true;
	                nr_open--;
	            }
	            S.push(Cl);
	        }
	        console.log("Built " + S.length + " clusters.");
	        this._clusters = S;
	    };
	    SaNGreeA.prototype.calculateSIL = function (Cl, candidate) {
	        var population_size = this._graph.nrNodes() - 2;
	        var dists = [];
	        var candidate_neighbors = candidate.reachNodes().map(function (ne) { return ne.node.getID(); });
	        for (var cl_node in Cl.nodes) {
	            var dist = population_size;
	            var cl_node_neighbors = Cl.nodes[cl_node].reachNodes().map(function (ne) { return ne.node.getID(); });
	            for (var idx in cl_node_neighbors) {
	                var neighbor = cl_node_neighbors[idx];
	                if (neighbor !== candidate.getID() && candidate_neighbors.indexOf(neighbor) !== -1) {
	                    --dist;
	                }
	            }
	            dists.push(dist / population_size);
	        }
	        return dists.reduce(function (a, b) { return a + b; }, 0) / dists.length;
	    };
	    SaNGreeA.prototype.updateLevels = function (Cl, Y) {
	        for (var feat in this._cat_hierarchies) {
	            var cat_gh = this.getCatHierarchy(feat);
	            var Cl_feat = Cl.gen_feat[feat];
	            var Y_feat = Y.getFeature(feat);
	            var Cl_level = cat_gh.getLevelEntry(Cl_feat);
	            var Y_level = cat_gh.getLevelEntry(Y_feat);
	            while (Cl_feat !== Y_feat) {
	                Y_feat = cat_gh.getGeneralizationOf(Y_feat);
	                Y_level = cat_gh.getLevelEntry(Y_feat);
	                if (Cl_level > Y_level) {
	                    Cl_feat = cat_gh.getGeneralizationOf(Cl_feat);
	                    Cl_level = cat_gh.getLevelEntry(Cl_feat);
	                }
	            }
	            Cl.gen_feat[feat] = Cl_feat;
	        }
	    };
	    SaNGreeA.prototype.calculateCatCosts = function (Cl, Y) {
	        var costs = 0;
	        for (var feat in this._cat_hierarchies) {
	            var cat_gh = this.getCatHierarchy(feat);
	            var Cl_feat = Cl.gen_feat[feat];
	            var Y_feat = Y.getFeature(feat);
	            var Cl_level = cat_gh.getLevelEntry(Cl_feat);
	            var Y_level = cat_gh.getLevelEntry(Y_feat);
	            while (Cl_feat !== Y_feat) {
	                Y_feat = cat_gh.getGeneralizationOf(Y_feat);
	                Y_level = cat_gh.getLevelEntry(Y_feat);
	                if (Cl_level > Y_level) {
	                    Cl_feat = cat_gh.getGeneralizationOf(Cl_feat);
	                    Cl_level = cat_gh.getLevelEntry(Cl_feat);
	                }
	            }
	            var cat_weights = this._config.GEN_WEIGHT_VECTORS[this._config.VECTOR]['categorical'];
	            costs += cat_weights[feat] * ((cat_gh.nrLevels() - Cl_level) / cat_gh.nrLevels());
	        }
	        return costs / Object.keys(this._cat_hierarchies).length;
	    };
	    SaNGreeA.prototype.calculateContCosts = function (Cl, Y) {
	        var _this = this;
	        var range_costs = 0;
	        var range_weights = this._config.GEN_WEIGHT_VECTORS[this._config.VECTOR]['range'];
	        Object.keys(this._cont_hierarchies).forEach(function (range) {
	            var range_hierarchy = _this.getContHierarchy(range);
	            var current_range = Cl.gen_ranges[range];
	            var extended_range = _this.expandRange(current_range, Y.getFeature(range));
	            var extension_cost = range_hierarchy instanceof $GH.ContGenHierarchy ? range_hierarchy.genCostOfRange(extended_range[0], extended_range[1]) : 0;
	            range_costs += range_weights[range] + extension_cost;
	        });
	        return range_costs;
	    };
	    SaNGreeA.prototype.expandRange = function (range, nr) {
	        var min = nr < range[0] ? nr : range[0];
	        var max = nr > range[1] ? nr : range[1];
	        return [min, max];
	    };
	    SaNGreeA.prototype.updateRange = function (range, nr) {
	        range[0] < range[0] ? nr : range[0];
	        range[1] = nr > range[1] ? nr : range[1];
	    };
	    return SaNGreeA;
	}());
	exports.SaNGreeA = SaNGreeA;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var CONFIG = {
	    'INPUT_FILE': './test/io/test_input/adult_data.csv',
	    'TARGET_COLUMNS': [
	        'income'
	    ],
	    'AVERAGE_OUTPUT_RANGES': true,
	    'NR_DRAWS': 300,
	    'RANDOM_DRAWS': false,
	    'EDGE_MIN': 3,
	    'EDGE_MAX': 10,
	    'K_FACTOR': 19,
	    'ALPHA': 1,
	    'BETA': 0,
	    'GEN_WEIGHT_VECTORS': {
	        'equal': {
	            'categorical': {
	                'workclass': 1.0 / 13.0,
	                'native-country': 1.0 / 13.0,
	                'sex': 1.0 / 13.0,
	                'race': 1.0 / 13.0,
	                'marital-status': 1.0 / 13.0,
	                'relationship': 1.0 / 13.0,
	                'occupation': 1.0 / 13.0,
	            },
	            'range': {
	                'age': 1.0 / 13.0,
	                'fnlwgt': 1.0 / 13.0,
	                'education-num': 1.0 / 13.0,
	                'capital-gain': 1.0 / 13.0,
	                'capital-loss': 1.0 / 13.0,
	                'hours-per-week': 1.0 / 13.0
	            }
	        },
	        'emph_race': {
	            'categorical': {
	                'workclass': 0.01,
	                'native-country': 0.01,
	                'sex': 0.01,
	                'race': 0.88,
	                'marital-status': 0.01,
	                'relationship': 0.01,
	                'occupation': 0.01
	            },
	            'range': {
	                'age': 0.01,
	                'fnlwgt': 0.01,
	                'education-num': 0.01,
	                'capital-gain': 0.01,
	                'capital-loss': 0.01,
	                'hours-per-week': 0.01,
	            }
	        },
	        'emph_age': {
	            'categorical': {
	                'workclass': 0.01,
	                'native-country': 0.01,
	                'sex': 0.01,
	                'race': 0.01,
	                'marital-status': 0.01,
	                'relationship': 0.01,
	                'occupation': 0.01
	            },
	            'range': {
	                'age': 0.88,
	                'fnlwgt': 0.01,
	                'education-num': 0.01,
	                'capital-gain': 0.01,
	                'capital-loss': 0.01,
	                'hours-per-week': 0.01,
	            }
	        }
	    },
	    'VECTOR': 'equal'
	};
	exports.CONFIG = CONFIG;


/***/ }
/******/ ]);
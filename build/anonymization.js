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
			Csv			 		: $CSV.CSV
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
	var $G = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"graphinius\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).$G;
	console.log($G);
	(function (HierarchyType) {
	    HierarchyType[HierarchyType["CONTINUOUS"] = 0] = "CONTINUOUS";
	    HierarchyType[HierarchyType["CATEGORICAL"] = 1] = "CATEGORICAL";
	})(exports.HierarchyType || (exports.HierarchyType = {}));
	var HierarchyType = exports.HierarchyType;
	var SaNGreeA = (function () {
	    function SaNGreeA(_name, _input_file, opts, weights) {
	        if (_name === void 0) { _name = "default"; }
	        this._name = _name;
	        this._input_file = _input_file;
	        this._cont_hierarchies = {};
	        this._cat_hierarchies = {};
	        this._weights = weights || {
	            'age': 1 / 6,
	            'workclass': 1 / 6,
	            'native-country': 1 / 6,
	            'sex': 1 / 6,
	            'race': 1 / 6,
	            'marital-status': 1 / 6
	        };
	        if (_input_file === "") {
	            throw new Error('Input file cannot be an empty string');
	        }
	        this._options = opts || {
	            nr_draws: 300,
	            edge_min: 1,
	            edge_max: 10
	        };
	        if (this._options.nr_draws < 0) {
	            throw new Error('Options invalid. Nr_draws can not be negative.');
	        }
	        if (this._options.edge_min < 0) {
	            throw new Error('Options invalid. Edge_min can not be negative.');
	        }
	        if (this._options.edge_max < 0) {
	            throw new Error('Options invalid. Edge_max can not be negative.');
	        }
	        if (this._options.edge_max < this._options.edge_min) {
	            throw new Error('Options invalid. Edge_max cannot exceed edge_min.');
	        }
	    }
	    SaNGreeA.prototype.getOptions = function () {
	        return this._options;
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
	    SaNGreeA.prototype.instantiateGraph = function (name) {
	        if (name === void 0) { name = "default"; }
	        this._graph = new $G.core.Graph("adults");
	        this.readCSV(this._input_file, this._graph);
	        this._graph.createRandomEdgesSpan(this._options.edge_min, this._options.edge_max, false);
	    };
	    SaNGreeA.prototype.readCSV = function (file, graph) {
	        var str_input = fs.readFileSync(file).toString().split('\n');
	        var str_cols = str_input.shift().replace(/\s+/g, '').split(',');
	        var cont_hierarchies = Object.keys(this._cont_hierarchies);
	        var cat_hierarchies = Object.keys(this._cat_hierarchies);
	        var min_age = Number.POSITIVE_INFINITY;
	        var max_age = Number.NEGATIVE_INFINITY;
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
	        var draw = 300;
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
	            var node = this._graph.addNode(i);
	            for (var idx in cat_feat_idx_select) {
	                node.setFeature(cat_feat_idx_select[idx], line[idx]);
	            }
	            for (var idx in cont_feat_idx_select) {
	                node.setFeature(cont_feat_idx_select[idx], +line[idx]);
	            }
	            var age = parseInt(line[0]);
	            min_age = age < min_age ? age : min_age;
	            max_age = age > max_age ? age : max_age;
	            node.setFeature('age', parseInt(line[0]));
	        }
	        var age_hierarchy = new $GH.ContGenHierarchy('age', min_age, max_age);
	        this.setContHierarchy('age', age_hierarchy);
	    };
	    SaNGreeA.prototype.outputPreprocCSV = function (outfile) {
	        var outstring = "", nodes = this._graph.getNodes(), node = null, feature = null;
	        for (var node_key in this._graph.getNodes()) {
	            node = nodes[node_key];
	            outstring += node.getID() + ",";
	            outstring += node.getFeature('age') + ",";
	            outstring += node.getFeature('workclass') + ",";
	            outstring += node.getFeature('native-country') + ",";
	            outstring += node.getFeature('sex') + ",";
	            outstring += node.getFeature('race') + ",";
	            outstring += node.getFeature('marital-status');
	            outstring += "\n";
	        }
	        var first_line = "nodeID, age, workclass, native-country, sex, race, marital-status \n";
	        outstring = first_line + outstring;
	        fs.writeFileSync("./test/io/test_output/" + outfile + ".csv", outstring);
	    };
	    SaNGreeA.prototype.outputAnonymizedCSV = function (outfile) {
	        var outstring = "";
	        for (var cl_idx in this._clusters) {
	            var cluster = this._clusters[cl_idx];
	            for (var count in cluster.nodes) {
	                var age_range = cluster.gen_ranges['age'];
	                if (age_range[0] === age_range[1]) {
	                    outstring += age_range[0] + ", ";
	                }
	                else {
	                    outstring += "[" + age_range[0] + " - " + age_range[1] + "], ";
	                }
	                for (var hi in this._cat_hierarchies) {
	                    var h = this._cat_hierarchies[hi];
	                    outstring += h.getName(cluster.gen_feat[hi]) + ", ";
	                }
	                outstring = outstring.slice(0, -2) + "\n";
	            }
	        }
	        var first_line = "age, workclass, native-country, sex, race, marital-status \n";
	        outstring = first_line + outstring;
	        fs.writeFileSync("./test/io/test_output/" + outfile + ".csv", outstring);
	    };
	    SaNGreeA.prototype.anonymizeGraph = function (k, alpha, beta) {
	        if (alpha === void 0) { alpha = 1; }
	        if (beta === void 0) { beta = 0; }
	        var S = [], nodes = this._graph.getNodes(), keys = Object.keys(nodes), current_node, candidate, current_best, added = {}, nr_open = Object.keys(nodes).length, cont_costs, cat_costs, best_costs, i, j;
	        for (i = 0; i < keys.length; i++) {
	            current_node = nodes[keys[i]];
	            if (added[current_node.getID()]) {
	                continue;
	            }
	            var Cl = {
	                nodes: {},
	                gen_feat: {
	                    'workclass': current_node.getFeature('workclass'),
	                    'native-country': current_node.getFeature('native-country'),
	                    'marital-status': current_node.getFeature('marital-status'),
	                    'sex': current_node.getFeature('sex'),
	                    'race': current_node.getFeature('race')
	                },
	                gen_ranges: {
	                    'age': [current_node.getFeature('age'), current_node.getFeature('age')]
	                }
	            };
	            Cl.nodes[current_node.getID()] = current_node;
	            added[current_node.getID()] = true;
	            nr_open--;
	            while (Object.keys(Cl.nodes).length < k && nr_open) {
	                best_costs = Number.POSITIVE_INFINITY;
	                for (j = i + 1; j < keys.length; j++) {
	                    candidate = nodes[keys[j]];
	                    if (added[candidate.getID()]) {
	                        continue;
	                    }
	                    cat_costs = this.calculateCatCosts(Cl, candidate);
	                    cont_costs = this.calculateContCosts(Cl, candidate);
	                    if ((cat_costs + cont_costs) < best_costs) {
	                        best_costs = (cat_costs + cont_costs);
	                        current_best = candidate;
	                    }
	                }
	                Cl.nodes[current_best.getID()] = current_best;
	                this.updateRange(Cl.gen_ranges['age'], current_best.getFeature('age'));
	                this.updateLevels(Cl, current_best);
	                added[current_best.getID()] = true;
	                nr_open--;
	            }
	            S.push(Cl);
	        }
	        console.log("Built " + S.length + " clusters.");
	        this._clusters = S;
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
	            costs += this._weights[feat] * ((cat_gh.nrLevels() - Cl_level) / cat_gh.nrLevels());
	        }
	        return costs / Object.keys(this._cat_hierarchies).length;
	    };
	    SaNGreeA.prototype.calculateContCosts = function (Cl, Y) {
	        var age_range = Cl.gen_ranges['age'];
	        var new_range = this.expandRange(age_range, Y.getFeature('age'));
	        var age_hierarchy = this.getContHierarchy('age');
	        var cost = age_hierarchy instanceof $GH.ContGenHierarchy ? age_hierarchy.genCostOfRange(new_range[0], new_range[1]) : 0;
	        return this._weights['age'] * cost;
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


/***/ }
/******/ ]);
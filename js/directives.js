'use strict';

/* Directives */


angular.module('pkb.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive('commonGroup', function() {
        return {
            require: 'ngModel',
            restrict: 'E',
            controller: 'CommonGroupController',
            templateUrl: 'partials/common_group.html',
            scope: {
                taxon: '='
            }
        }
    })
    .directive('taxonName', function() {
        return {
            require: 'ngModel',
            restrict: 'E',
            controller: 'TaxonNameController',
            templateUrl: 'partials/taxon_name.html',
            scope: {
                iri: '='
            }
        }
    })
    .directive('termName', function() {
        return {
            require: 'ngModel',
            restrict: 'E',
            controller: 'TermNameController',
            templateUrl: 'partials/term_name.html',
            scope: {
                iri: '='
            }
        }
    })
    .directive('characterDescriptionAnnotation', function() {
        return {
            require: 'ngModel',
            restrict: 'E',
            controller: 'CharacterDescriptionAnnotationController',
            templateUrl: 'partials/character_description_annotation.html',
            scope: {
                iri: '='
            }
        }
    })
    .directive('countedPhenotypesForTaxon', function() {
        return {
            require: 'ngModel',
            restrict: 'E',
            controller: 'CountedPhenotypesForTaxonController',
            templateUrl: 'partials/count.html',
            scope: {
                taxon: '=',
                entity: '=',
                quality: '='
            }
        }
    })
    .directive('countedPresenceOrAbsenceForTaxon', function() {
        return {
            require: 'ngModel',
            restrict: 'E',
            controller: 'CountedPresenceOrAbsenceForTaxonController',
            templateUrl: 'partials/count.html',
            scope: {
                taxon: '=',
                entity: '=',
                kind: '@'
            }
        }
    })
    .directive('termSearchList', function() {
        return {
            require: 'ngModel',
            restrict: 'E',
            templateUrl: 'partials/term_search_list.html',
            scope: {
                terms: '=',
                query: '=',
                placeholder: '@'
            }
        }
    })
    .directive('queryPanel', function() {
        return {
            restrict: 'E',
            controller: 'QueryPanelController',
            templateUrl: 'partials/query_panel.html',
            scope: {
                parameters: '=',
                applyQuery: '=',
                configuration: '@',
                options: '='
            }
        }
    })
    .directive('geneSimilarityView', function() {
        return {
            restrict: 'E',
            controller: 'SimilarityViewController',
            templateUrl: 'partials/similarity_view.html',
            scope: {
                subject: '=',
                corpusGraph: '@',
                queryGraph: '@'
            }
        }
    })
    .directive('taxonSimilarityView', function() {
        return {
            restrict: 'E',
            controller: 'SimilarityViewController',
            templateUrl: 'partials/taxon_similarity_view.html',
            scope: {
                subject: '=',
                corpusGraph: '@',
                queryGraph: '@'
            }
        }
    })
    .directive('annotatedText', function($compile, $sce) {
        var link = function(scope, element, attrs) {
            var render = function() {
                scope.popups = [];
                var html = jQuery('<div>' + scope.content + '</div>');
                html.find('.sciCrunchAnnotation').each(function(i, el) {
                    var annotations = jQuery(el).data('scigraph').split('|');
                    var prefixes = [];
                    var links = _.map(annotations, function(annotation) {
                        var components = annotation.split(",")
                        var label = components[0];
                        var termID = components[1];
                        var prefix = termID.split(":")[0];
                        prefixes.push(prefix);
                        return '<p><a class="annotation-link annotation-prefix-' + prefix + '" target="_blank" href="http://purl.obolibrary.org/obo/' + termID.replace(':', '_') + '">' + label + '</a><span class="annotation-termid">' + termID + '</span</p>';
                    });
                    var uniquePrefixes = _.uniq(prefixes);
                    if (uniquePrefixes.length == 1) {
                        jQuery(el).addClass('annotation-prefix-' + uniquePrefixes[0]);
                    } else {
                        jQuery(el).addClass('annotation-prefix-multiple');
                    }
                    scope.popups.push($sce.trustAsHtml(links.join(' ')));
                    jQuery(el).attr('uib-popover-html', 'popups[' + i + ']');
                    jQuery(el).attr('popover-trigger', 'focus');
                    jQuery(el).attr('tabindex', '0');
                    $compile(el)(scope);
                });
                element.html(html);
            };
            scope.$watch('content', function(newValue, oldValue) {
                render();
            });
            render();
        };
        return {
            restrict: 'E',
            link: link,
            scope: {
                content: '='
            }
        }
    })
    .directive('classification', function() {
        return {
            restrict: 'E',
            controller: 'ClassificationController',
            templateUrl: 'partials/classification.html',
            scope: {
                iri: '=',
                definedBy: '@',
                linkFilter: '@'
            }
        };
    })
    .directive('taxonClassification', function() {
        return {
            restrict: 'E',
            controller: 'ClassificationController',
            templateUrl: 'partials/taxon_classification.html',
            scope: {
                iri: '=',
                definedBy: '@',
                linkFilter: '@'
            }
        };
    })
    .directive('demoChart', function() {
        return {
            restrict: 'E',
            replace: false,
            link: function(scope, element, attrs) {
                /**-------------------------Variables-------------------------------**/
                //Taxa base case data 
                var data = {
                    'Hagfishes': [3, 'http://purl.obolibrary.org/obo/VTO_0058701', 'Myxiniformes'],
                    'Lampreys': [6, 'http://purl.obolibrary.org/obo/VTO_0058622', 'Petromyzontiformes'],
                    'Placodermi': [24, 'http://purl.obolibrary.org/obo/VTO_9012172', ''],
                    'Acanthodii': [31, 'http://purl.obolibrary.org/obo/VTO_9011043', ''],
                    'Agnatha': [37, 'http://purl.obolibrary.org/obo/VTO_9032758', ''],
                    'Cartilaginous fishes': [177, 'http://purl.obolibrary.org/obo/VTO_0000009', 'Chondrichthyes'],
                    'Ray-finned fishes': [3741, 'http://purl.obolibrary.org/obo/VTO_0033622', 'Actinopterygii'],
                    'Sarcopterygii': [1078, 'http://purl.obolibrary.org/obo/VTO_0001464', '']
                };

                //Anatomy base case data
                var data_Anat = {
                    'integumental system': [3649, 'http://purl.obolibrary.org/obo/UBERON_0002416'],
                    'neurocranium': [3230, 'http://purl.obolibrary.org/obo/UBERON_0001703'],
                    'hindlimb skeleton': [814, 'http://purl.obolibrary.org/obo/UBERON_0001441'],
                    'jaw region': [3105, 'http://purl.obolibrary.org/obo/UBERON_0011595'],
                    'hyoid arch skeleton': [3417, 'http://purl.obolibrary.org/obo/UBERON_0005884'],
                    'forelimb skeleton': [878, 'http://purl.obolibrary.org/obo/UBERON_0001440'],
                    'fin skeleton': [3662, 'http://purl.obolibrary.org/obo/UBERON_0012353'],
                    'dermatocranium': [3750, 'http://purl.obolibrary.org/obo/UBERON_0003113'],
                    'pectoral girdle skeleton': [4216, 'http://purl.obolibrary.org/obo/UBERON_0007831'],
                    'pelvic girdle skeleton': [2928, 'http://purl.obolibrary.org/obo/UBERON_0007832'],
                    'ventral hyoid arch skeleton': [2927, 'http://purl.obolibrary.org/obo/UBERON_0011153'],
                    'post-cranial axial skeletal system': [4263, 'http://purl.obolibrary.org/obo/UBERON_0011138']
                };

                //loading bar 
                var opts = {
                    lines: 13 // The number of lines to draw
                        ,
                    length: 28 // The length of each line
                        ,
                    width: 14 // The line thickness
                        ,
                    radius: 42 // The radius of the inner circle
                        ,
                    scale: 1 // Scales overall size of the spinner
                        ,
                    corners: 1 // Corner roundness (0..1)
                        ,
                    color: '#000' // #rgb or #rrggbb or array of colors
                        ,
                    opacity: 0.25 // Opacity of the lines
                        ,
                    rotate: 0 // The rotation offset
                        ,
                    direction: 1 // 1: clockwise, -1: counterclockwise
                        ,
                    speed: 1 // Rounds per second
                        ,
                    trail: 60 // Afterglow percentage
                        ,
                    fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                        ,
                    zIndex: 2e9 // The z-index (defaults to 2000000000)
                        ,
                    className: 'spinner' // The CSS class to assign to the spinner
                        ,
                    top: '100%' // Top position relative to parent
                        ,
                    left: '50%' // Left position relative to parent
                        ,
                    shadow: false // Whether to render a shadow
                        ,
                    hwaccel: false // Whether to use hardware acceleration
                        //,
                        //position: 'absolute' // Element positioning
                }

                var phenoBlue = d3.rgb(66, 139, 202); //main color

                var stack = new Array(); // stores taxa path to be able to go back
                var stack_Anat = new Array(); // stores anatomy path to be able to go back

                var margin = {
                        top: 50,
                        right: 100,
                        bottom: 200,
                        left: 100
                    },
                    width = 960 - margin.left - margin.right,
                    height = 600 - margin.top - margin.bottom;

                /**-----------------------------HTML element creation--------------------------**/
                function createBackButton(id_name, graph_name) {
                    var btn = document.createElement("BUTTON");
                    btn.setAttribute("id", id_name);
                    var t = document.createTextNode("Go back on " + graph_name + " graph");
                    btn.appendChild(t);
                    //document.body.appendChild(btn);
                    element[0].appendChild(btn)
                }

                function createGraphArea(id_name) {
                    var div = document.createElement("div");
                    div.setAttribute("id", id_name);
                    //document.body.appendChild(div);
                    element[0].appendChild(div)
                }

                /**-----------------------------Taxa Graph API functions-----------------------**/
                //function that gets total annotated taxa count
                function get_total(url, callback) {
                    var urlBase = 'http://kb.phenoscape.org/api/taxon/annotated_taxa_count?in_taxon=';
                    var url = urlBase + url;
                    $.getJSON(url, function(json) {
                        var count = json.total;
                        callback(count);
                    });
                }

                //function for getTaxaInRank using classification
                //@parameter VTO is the url 
                function getTaxaInRank(VTO, callback) {
                    var allTaxa = [];
                    var urlBase = 'http://kb.phenoscape.org/api/term/classification?iri=' + VTO
                    $.getJSON(urlBase, function(json) {
                        for (var i = 0; i < json.superClassOf.length; i++) {
                            var child = json.superClassOf[i]['@id'];
                            allTaxa.push(child);
                        }
                        callback(allTaxa);
                    });
                }

                //get common English name (if available) and Latin name
                function getName(VTOurl, callback) {
                    var url = 'http://kb.phenoscape.org/api/taxon?iri=' + VTOurl
                    $.getJSON(url, function(json) {
                        if (json.common_name == null) {
                            callback(json.label, "");
                        } else {
                            callback(json.common_name, json.label);
                        }
                    });
                }

                /**-----------------------------Anatomy Graph API functions------------------------**/

                function type(d) {
                    d.value = +d.value;
                    return d;
                }

                //@uberon: uberon number
                function get_total_Anat(uberon, callback) {
                    var urlBase = 'http://kb.phenoscape.org/api/taxon/with_phenotype?entity=%3Chttp://purl.obolibrary.org/obo/BFO_0000050%3E%20some%20%3Chttp://purl.obolibrary.org/obo/UBERON_' + uberon + '%3E&total=true';
                    //var urlBase = 'http://kb.phenoscape.org/api/taxon/with_phenotype?entity=%3Chttp:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_' + uberon + '%3E&total=true';
                    $.getJSON(urlBase, function(json) {
                        var count = json.total;
                        callback(count);
                    });
                }

                //@purlURL: uberon url
                function getUberon(purlUrl) {

                    var uberon = purlUrl.substr(purlUrl.length - 7);
                    return uberon;
                }

                /**
                Returns array of all of the immediate parts of a specific anatomy 
                identified by uberon
                **/
                function getPartOf(uberonURL, callback) {
                    var children = [];
                    var urlBase = 'http://kb.phenoscape.org/api/term/property_neighbors/object?term=' + uberonURL + '&property=http://purl.obolibrary.org/obo/BFO_0000050'
                        //console.log("urlbase"+urlBase);
                    $.getJSON(urlBase, function(json) {
                        for (var i = 0; i < json.results.length; i++) {
                            var child = json.results[i]['@id'];
                            if (child.length > 5 && child.length < 100) {
                                children.push(child);
                            }
                        }

                        callback(children);
                    });
                }

                //get name of anatomy using the purl URL
                function getName_Anat(purlURL, callback) {
                    var url = 'http://kb.phenoscape.org/api/term?iri=' + purlURL
                    $.getJSON(url, function(json) {
                        //console.log(json.label);
                        callback(json.label);
                    });
                }

                /**-------------------------------General graphing functions------------------------------------**/
                //@data is an object
                function getMax(data) {
                    var max = 0;
                    for (var key in data) {
                        if (data[key][0] > max) {
                            max = data[key][0];
                        }
                    }
                    return max;

                }


                function sortDescending(data) {
                    return d3.entries(data).sort(function(a, b) {
                        return d3.values(b)[1][0] - d3.values(a)[1][0];
                    });
                }

                /**
                Removes all elements of graph
                @tip: tooltip object
                @div_id: div id of the html element
                **/

                function removeEverything(tip, div_id) {
                    tip.hide();
                    //d3.select("svg1").remove();
                    d3.select("#" + div_id).select("svg").remove();
                    d3.select("#" + div_id).select("tip").remove();
                }

                //Wrap the text
                function wrap(text, width) {
                    text.each(function() {
                        var text = d3.select(this),
                            words = text.text().split(/\s+/).reverse(),
                            word,
                            line = [],
                            lineNumber = 0,
                            lineHeight = 1.1, // ems
                            y = text.attr("y"),
                            dy = parseFloat(text.attr("dy")),
                            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                        while (word = words.pop()) {
                            line.push(word);
                            tspan.text(line.join(" "));
                            if (tspan.node().getComputedTextLength() > width) {
                                line.pop();
                                tspan.text(line.join(" "));
                                line = [word];
                                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                            }
                        }
                    });
                }

                var insertLinebreaks = function(t, d, width) {
                    var el = d3.select(t);
                    var p = d3.select(t.parentNode);
                    p.append("foreignObject")
                        .attr('x', -width / 2)
                        .attr("width", width)
                        .attr("height", 200)
                        .append("xhtml:p")
                        .attr('style', 'word-wrap: break-word; text-align:center;')
                        .html(d);

                    el.remove();

                };

                /**-----------------------Actual graphing functions-----------------------------**/

                //taxa graphing function
                function drawGraph(data) {
                    stack.push(data);

                    var target = document.getElementById('target_taxa')

                    var x = d3.scale.ordinal()
                        .rangeRoundBands([0, width], .1)
                        .domain(sortDescending(data).map(function(d) {
                            return d.key
                        }));

                    var y = d3.scale.linear()
                        .domain([0, getMax(data)])
                        .range([height, 0]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .ticks(10);

                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                            if (d3.values(d)[1][2] != "") {
                                return d.key + "<br/>(" + d3.values(d)[1][2] + ")<br/>Annotated Taxa Count: " + d3.values(d)[1][0];
                            } else {
                                return d.key + "<br/>Annotated Taxa Count: " + d3.values(d)[1][0];
                            }

                        })

                    var svg = d3.select("#taxa").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    svg.call(tip);

                    //x axis label
                    svg.append("text")
                        .attr("class", "x label")
                        .attr("text-anchor", "end")
                        .attr("x", width / 2)
                        .attr("y", height + 30)
                        //.text("Taxa")

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis); //Creates x axis label

                    svg.selectAll("text")
                        .call(wrap, x.rangeBand())
                        .attr("y", 0)
                        .attr("x", 50)
                        .attr("transform", "rotate(45)")
                        .style("text-anchor", "start");

                    //hyperlink the x axis labels
                    d3.select('#taxa').selectAll("text")
                        .filter(function(d) {
                            return typeof(d) == "string";
                        })
                        .style("cursor", "pointer")
                        .on("mouseover", function(d) {
                            d3.select(this).style("fill", "blue");
                        })
                        .on("mouseout", function(d) {
                            d3.select(this).style("fill", "black");
                        })
                        .on("click", function(d) {
                            document.location.href = "http://kb.phenoscape.org/#/taxon/" + data[d][1];
                        });

                    var yLine = svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", -70)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Annotated Taxa Count");

                    var bars = svg.selectAll(".bar")
                        .data(d3.entries(data))
                        .enter().append("rect")
                        .attr("fill", phenoBlue)
                        .attr("class", "bar")
                        .attr("x", function(d) {
                            return x(d.key);
                        })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) {
                            return y(d3.values(d)[1][0]);
                        })
                        .attr("height", function(d) {
                            return height - y(d3.values(d)[1][0]);
                        })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)

                    //to go back on graph
                    var svg = d3.select('#taxa_button').on('click', function() {
                        if (stack.length == 1) {
                            alert("Can't go back anymore");
                        } else {
                            removeEverything(tip, "taxa");
                            console.log(stack.pop());
                            drawGraph(stack.pop());
                        }
                    });

                    //update to get sub anatomies based on click
                    bars.on('click', function(d, i) {
                        var spinner = new Spinner(opts).spin(target); //create loading spinner

                        var promise = new Promise(function(resolve, reject) {
                            var dataset = [];
                            var VTOurl = d3.values(d)[1][1];
                            getTaxaInRank(VTOurl, function(d) {
                                for (var i in d) { //iterate through array of subtaxa
                                    if (d.length == 0) {
                                        reject(Error("No more descending possible"));
                                    }
                                    get_total(d[i], function(i, total) {
                                        getName(d[i], function(name, latin) {
                                            dataset[name] = [total, d[i], latin];
                                            if (Object.keys(dataset).length == d.length) {
                                                resolve(dataset); //new data to graph
                                            }
                                        })
                                    }.bind(null, i));
                                }
                            })
                            setTimeout(reject.bind(null, data), 10000);
                        });

                        promise.then(function(result) {
                            removeEverything(tip, "taxa");
                            spinner.stop()
                            drawGraph(result);
                        }, function(err) {
                            alert("No more descending possible");
                            spinner.stop();
                            console.log("No more descending possible", err);
                        })

                    });

                }

                //anatomy graphing function
                function drawGraph_Anat(data) {
                    stack_Anat.push(data);
                    var target = document.getElementById('target_anat')

                    var x_Anat = d3.scale.ordinal()
                        .rangeRoundBands([0, width], .1)
                        .domain(sortDescending(data).map(function(d) {
                            return d.key;
                        }));

                    var y_Anat = d3.scale.linear()
                        .domain([0, getMax(data)])
                        .range([height, 0]);

                    var xAxis_Anat = d3.svg.axis()
                        .scale(x_Anat)
                        .orient("bottom");

                    var yAxis_Anat = d3.svg.axis()
                        .scale(y_Anat)
                        .orient("left")
                        .ticks(10);

                    var tip_Anat = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                            return d.key + "<br/>" + "Annotated Taxa Count: " + d3.values(d)[1][0];
                        })

                    var svg1 = d3.select("#anatomy").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    svg1.call(tip_Anat);

                    svg1.append("text")
                        .attr("class", "x label")
                        .attr("text-anchor", "end")
                        .attr("x", width / 2)
                        .attr("y", height + 30)


                    svg1.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis_Anat);

                    svg1.selectAll("text")
                        //.call(wrap, x_Anat.rangeBand())
                        .attr("y", 10)
                        .attr("x", 50)
                        .attr("dx", "-2.8em")
                        .attr("dy", ".70em")
                        .attr("transform", "rotate(45)")
                        .style("text-anchor", "start");

                    //hyperlink the x axis labels
                    d3.select("#anatomy").selectAll("text")
                        .filter(function(d) {
                            return typeof(d) == "string";
                        })
                        .style("cursor", "pointer")
                        .on("mouseover", function(d) {
                            d3.select(this).style("fill", "blue");
                        })
                        .on("mouseout", function(d) {
                            d3.select(this).style("fill", "black");
                        })
                        .on("click", function(d) {
                            document.location.href = "http://kb.phenoscape.org/#/entity/" + data[d][1];
                        });

                    var yLine_Anat = svg1.append("g") //HERE KEEP ADDING _ANAT'S
                        .attr("class", "y axis")
                        .call(yAxis_Anat)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", -70)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Annotated Taxa Count");

                    var bars_Anat = svg1.selectAll(".bar")
                        .data(d3.entries(data))
                        .enter().append("rect")
                        .attr("fill", phenoBlue)
                        .attr("class", "bar")
                        .attr("x", function(d) {
                            return x_Anat(d.key);
                        })
                        .attr("width", x_Anat.rangeBand())
                        .attr("y", function(d) {
                            return y_Anat(d3.values(d)[1][0]);
                        })
                        .attr("height", function(d) {
                            return height - y_Anat(d3.values(d)[1][0]);
                        })
                        .on('mouseover', tip_Anat.show)
                        .on('mouseout', tip_Anat.hide)

                    //to go back on graph
                    var svg1 = d3.select('#anatomy_button').on('click', function() {
                        //console.log(stack.length);
                        if (stack_Anat.length == 1) {
                            alert("Can't go back anymore");
                        } else {
                            removeEverything(tip_Anat, "anatomy");
                            console.log(stack_Anat.pop());
                            drawGraph_Anat(stack_Anat.pop());
                        }
                    });
                    //update to get sub anatomies based on click
                    bars_Anat.on('click', function(d, i) {
                        var spinner = new Spinner(opts).spin(target); //create loading spinner

                        var promise = new Promise(function(resolve, reject) {
                            var dataset_Anat = [];
                            var uberonURL = d3.values(d)[1][1];
                            getPartOf(uberonURL, function(d) { //get parts
                                if (d.length == 0) {
                                    reject(Error("No more descending possible"));
                                }
                                for (var i in d) {
                                    get_total_Anat(getUberon(d[i]), function(i, total) {
                                        getName_Anat(d[i], function(name) {
                                            dataset_Anat[name] = [total, d[i]];
                                            if (Object.keys(dataset_Anat).length == d.length) {
                                                resolve(dataset_Anat);
                                            }
                                        })
                                    }.bind(null, i));
                                }
                            })

                            setTimeout(resolve.bind(null, data), 10000);
                        });

                        promise.then(function(result) {
                            removeEverything(tip_Anat, "anatomy");
                            spinner.stop()
                            drawGraph_Anat(result);
                        }, function(err) {
                            spinner.stop()
                            alert("No more descending possible");
                            console.log("Failed!", err);
                        })

                    });

                }

                //call the functions
                createGraphArea("target_taxa")
                createBackButton("taxa_button", "taxa");
                createGraphArea("taxa");
                drawGraph(data);

                //createGraphArea("target")

                createBackButton("anatomy_button", "anatomy");
                createGraphArea("target_anat")
                createGraphArea("anatomy");
                drawGraph_Anat(data_Anat);
            }
        };
    });
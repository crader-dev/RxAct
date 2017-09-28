'use strict';

var InteractionGraph = {
    svgElem: null,
    width: null,
    height: null,
    nodeGroup: null,
    linkGroup: null,

    simulation: null,
    nodes: new Map(),
    links: [],

    init: function(svgTargetId) {
        this.svgElem = d3.select('#' + svgTargetId);
        this.width = parseInt(this.svgElem.style('width'));
        this.height = parseInt(this.svgElem.style('height'));

        this.simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(-20))   
            .force('link', d3.forceLink(this.links).distance(200))
            //.force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .alphaTarget(1);
        
        let g = this.svgElem.append("g").attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")")

        this.nodeGroup = g.append('g')
                                .attr('class', 'nodes')
                            .selectAll('circle')
                            .data(Array.from(this.nodes.values()))
                            .enter().append('circle') // Temp below, use CSS for these attrs:
                                .attr('r', 20);

        this.nodeGroup.append('title').text((node) => {return node.id});

        this.linkGroup = g.append('g')
                                .attr('class', 'links')
                            .selectAll('line')
                            .data(this.links)
                                .enter().append('line');

        this.simulation
                .nodes(this.nodes)
                .on('tick', function() {
                    this.nodeGroup.attr("cx", function(d) { return d.x; })
                                  .attr("cy", function(d) { return d.y; });

                    this.linkGroup.attr("x1", function(d) { return d.source.x; })
                                  .attr("y1", function(d) { return d.source.y; })
                                  .attr("x2", function(d) { return d.target.x; })
                                  .attr("y2", function(d) { return d.target.y; });
                }.bind(this));

        this.simulation.force('link')
                .links(this.links);
    },

    addNode: function(name) {
        // Nodes are simple for now, but we can add more attributes here later
        let node = {
            id: name
        };
        this.nodes.set(name, node);

        return node;
    },

    addLink: function(source, target, description) {
        let link = {
            source: source,
            target: target,
            description: description
        };
        this.links.push(link);

        return link;
    },

    loadData: function(interactions) {
        // We have no guarantees about the current state of the data, clear it.
        this.clearData();

        interactions.forEach(function(interaction) {
            let sourceName = interaction.fromDrug.name;
            let targetName = interaction.toDrug.name;

            let source = this.nodes.get(sourceName) || this.addNode(sourceName);
            let target = this.nodes.get(targetName) || this.addNode(targetName);

            this.addLink(source, target, interaction.description);
        }, this);

        this.update();
    },
    
    clearData: function() {
        this.nodes = new Map();
        this.links = [];
    },
    
    update: function() {
        let nodeValues = Array.from(this.nodes.values());
        // Apply the d3 update pattern to nodes
        this.nodeGroup = this.nodeGroup.data(nodeValues, function(d) { return d.id;});
        this.nodeGroup.exit().remove();
        this.nodeGroup = this.nodeGroup.enter()
                                .append('circle') // Temp below, use CSS for these attrs:
                                    .attr('r', 20)
                                .merge(this.nodeGroup);
                            // fill?
        this.nodeGroup.append('title').text((node) => {return node.id});

        // Apply the d3 update pattern to links
        this.linkGroup = this.linkGroup.data(this.links, function(d) { return d.source.id + "-" + d.target.id; });
        this.linkGroup.exit().remove();
        this.linkGroup = this.linkGroup.enter()
                                .append('line')
                                .merge(this.linkGroup);

        // Update & restart simulation
        this.simulation.nodes(nodeValues);
        this.simulation.force('link').links(this.links);
        this.simulation.alpha(1).restart();

    },
};
// define(['chroma'], function(chroma) {
define([], function() {
    // class globals closure variables
    var DISCRETE = 'Discrete';
    var SEQUENTIAL = 'Sequential';
    var DIVERGING = 'Diverging';
    var HEADER = 'Hearder';
    /**
     * creates chroma.brewer.
     */

    var ColorHandler = {};

    ColorHandler.createSelect = function() {
        // the container for the select
        var container = document.createElement('label');
        container.classList.add('select-container');

        // make select initially hidden. Expect behavior is for the select to
        // become visible after user chooses to color
        var select = document.createElement('select');
        container.appendChild(select);

        // define map variable outside of loop so it does not created every loop
        // iteration
        var map = null;
        var opt = null;
        for (var i = 0; i < this.Colormaps_.length; i++) {
            map = this.Colormaps_[i];
            opt = document.createElement('option');
            opt.innerHTML = map.name;
            opt.value = map.id;

            if (map.type == HEADER) {
                opt.disabled = true;
            }
            select.appendChild(opt);
        }

        container.getColor = function() {
            // TODO: return chroma.brewer
            return select.options[select.selectedIndex].value;
        };

        container.onchange = function(func) {
            select.onchange = func;
        };

        return container;
    };

    // Used to create color select option and chroma.brewer
    //Modified from:
    //https://github.com/biocore/emperor/blob/
    //     027aa16f1dcf9536cd2dd9c9800ece5fc359ecbc/emperor/
    //     support_files/js/color-view-controller.js#L573-L613
    ColorHandler.Colormaps_ = [
        {name: '-- Discrete --', type: HEADER},
        {id: 'discrete-coloring-qiime', name: 'Classic QIIME Colors',
         type: DISCRETE},
        {id: 'Paired', name: 'Paired', type: DISCRETE},
        {id: 'Accent', name: 'Accent', type: DISCRETE},
        {id: 'Dark2', name: 'Dark', type: DISCRETE},
        {id: 'Set1', name: 'Set1', type: DISCRETE},
        {id: 'Set2', name: 'Set2', type: DISCRETE},
        {id: 'Set3', name: 'Set3', type: DISCRETE},
        {id: 'Pastel1', name: 'Pastel1', type: DISCRETE},
        {id: 'Pastel2', name: 'Pastel2', type: DISCRETE},

        {name: '-- Sequential --', type: HEADER},
        {id: 'Viridis', name: 'Viridis', type: SEQUENTIAL},
        {id: 'Reds', name: 'Reds', type: SEQUENTIAL},
        {id: 'RdPu', name: 'Red-Purple', type: SEQUENTIAL},
        {id: 'Oranges', name: 'Oranges', type: SEQUENTIAL},
        {id: 'OrRd', name: 'Orange-Red', type: SEQUENTIAL},
        {id: 'YlOrBr', name: 'Yellow-Orange-Brown', type: SEQUENTIAL},
        {id: 'YlOrRd', name: 'Yellow-Orange-Red', type: SEQUENTIAL},
        {id: 'YlGn', name: 'Yellow-Green', type: SEQUENTIAL},
        {id: 'YlGnBu', name: 'Yellow-Green-Blue', type: SEQUENTIAL},
        {id: 'Greens', name: 'Greens', type: SEQUENTIAL},
        {id: 'GnBu', name: 'Green-Blue', type: SEQUENTIAL},
        {id: 'Blues', name: 'Blues', type: SEQUENTIAL},
        {id: 'BuGn', name: 'Blue-Green', type: SEQUENTIAL},
        {id: 'BuPu', name: 'Blue-Purple', type: SEQUENTIAL},
        {id: 'Purples', name: 'Purples', type: SEQUENTIAL},
        {id: 'PuRd', name: 'Purple-Red', type: SEQUENTIAL},
        {id: 'PuBuGn', name: 'Purple-Blue-Green', type: SEQUENTIAL},
        {id: 'Greys', name: 'Greys', type: SEQUENTIAL},

        {name: '-- Divergin --', type: HEADER},
        {id: 'Spectral', name: 'Spectral', type: DIVERGING},
        {id: 'RdBu', name: 'Red-Blue', type: DIVERGING},
        {id: 'RdYlGn', name: 'Red-Yellow-Green', type: DIVERGING},
        {id: 'RdYlBu', name: 'Red-Yellow-Blue', type: DIVERGING},
        {id: 'RdGy', name: 'Red-Grey', type: DIVERGING},
        {id: 'PiYG', name: 'Pink-Yellow-Green', type: DIVERGING},
        {id: 'BrBG', name: 'Brown-Blue-Green', type: DIVERGING},
        {id: 'PuOr', name: 'Purple-Orange', type: DIVERGING},
        {id: 'PRGn', name: 'Purple-Green', type: DIVERGING}
    ];

    // taken from the qiime/colors.py module; a total of 24 colors
    /** @private */
    ColorHandler.qiimeDiscrete_ = [
        '#ff0000', '#0000ff', '#f27304', '#008000', '#91278d', '#ffff00',
        '#7cecf4', '#f49ac2', '#5da09e', '#6b440b', '#808080', '#f79679',
        '#7da9d8', '#fcc688', '#80c99b', '#a287bf', '#fff899', '#c49c6b',
        '#c0c0c0', '#ed008a', '#00b6ff', '#a54700', '#808000', '#008080'
    ];

    return ColorHandler;
})
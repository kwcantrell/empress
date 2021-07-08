define(["underscore", "AlphaSelectLayer", "MetadataSelectPanel"], function (
    _,
    AlphaSelectLayer,
    MetadataSelectPanel
) {
    /**
     * @class FeatureAlphaAdjuster
     */
    function FeatureAlphaAdjuster(empress, fCols, container) {
        // call MetadataSelectPanel constructor
        MetadataSelectPanel.call(
            this,
            empress,
            container,
            fCols,
            AlphaSelectLayer
        );

        // update abstract labels to reflect FeatureAlphaAdjuster
        this.metadataSelectLabel.innerText = "Adjust by...";
        this.metadataSelectAddLabel.innerText = "Add layer";

        // note the following p are being added to front of
        // this.metadataSelectContainer to place the before the select menu and
        // add button. There are also being added in reverse order to preserve
        // the original order

        // add description of shear
        var p = document.createElement("p");
        p.classList.add("side-panel-notes");
        p.innerText = "Adjust the darkness of tree branches using feature " +
                      "metadtata";
        this.metadataSelectContainer.prepend(p);

        // create container for slider/slider label
        // insert above the add layer button
        var p = document.createElement("p")
        this.addLayerButton.parentElement.insertAdjacentElement(
            "beforebegin", p
        );
        
        // create slider label
        var sliderId = "alpha-adjuster-slider";
        var label = p.appendChild(
            document.createElement("label")
        );
        label.setAttribute("for", sliderId);
        label.innerText = "Set branch darkness"

        // create slider
        var div = p.appendChild(
            document.createElement("div")
        );
        this.slider = div.appendChild(
            document.createElement("input")
        );
        this.slider.setAttribute("type", "range");
        this.slider.setAttribute("min", 1);
        this.slider.setAttribute("max", 100);
        this.slider.setAttribute("value", 50);
        this.slider.id = "alpha-adjuster-slider";
        var sliderTxt = div.appendChild(
            document.createElement("label")
        );
        sliderTxt.innerText = "50%"

        var scope = this;
        var setSliderLabel = () => {
            sliderTxt.innerText = "" + scope.slider.value + "%";            
        }
        this.slider.oninput = function() {
            setSliderLabel();
            scope.notify();
        }

        // set initial slide label text
        setSliderLabel();

    }

    // inherit MetadataSelectPanel functions
    FeatureAlphaAdjuster.prototype = Object.create(MetadataSelectPanel.prototype);
    FeatureAlphaAdjuster.prototype.constructor = FeatureAlphaAdjuster;

    /**
     * Notifies all observers whenever the model has changed.
     * 
     * Implements an abstract function
     */
    FeatureAlphaAdjuster.prototype.notify = function () {
        this.updateEmpressAlpha();
        _.each(this.observers, function (obs) {
            obs.shearUpdate();
        });
    };

    FeatureAlphaAdjuster.prototype.updateEmpressAlpha = function() {
        this.empress.resetAlphaStatus();
        this.empress.setAlphaStatus(
            this.getMetadataSelectValues(),
            this.slider.value
        );
        this.empress.drawTree();
    }

    FeatureAlphaAdjuster.prototype.shearUpdate = function() {
        this.updateEmpressAlpha();
    }

    return FeatureAlphaAdjuster;
});

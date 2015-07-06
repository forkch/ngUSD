SVG.extend(SVG.Element, {

    isSelected: false,
    selectOptions: {rotationPoint: false},

    selectToggle: function() {
        this.isSelected = !this.isSelected;
        this.select(this.isSelected, this.selectOptions);

        this.draggable(this.isSelected);
        if (!this.isSelected) {
            this.resize('stop');
        } else {
            this.resize();
        }

        return this;
    },

    unSelect: function() {
        this.isSelected = false;
        this.select(false);

        this.draggable(false);
        this.resize('stop');
        // this.showText();
    }

});
$(function() {
    let darr = null;

    $("#generate").click(() => {
        darr = new DynamicArray(5);
        for (let i = 0; i < 5; i++) {
            darr.add(Math.floor(Math.random() * 100 % 100));
        }
    });

    $("#remove").click(() => {
        if (darr) {
            darr.remove();
        }
    });

    $("#removeat").click(() => {
        if (darr) {
            let index = parseInt($("#toRemoveIndex").val());
            darr.removeAt(index);
        }
    });

    // $("#create").click(() => {
    //     darr = new DynamicArray();
    // });

    $("#add").click(() => {
        if (darr) {
            let val = parseInt($("#toAdd").val())
            darr.add(val);
        }
    });

    $("#addAt").click(() => {
        if (darr) {
            let index = parseInt($("#toAddIndex").val());
            let value = parseInt($("#newValue").val());
            darr.addAt(index, value);
        }
    });

    // $("#clear").click(() => {
    //     if (darr) {
    //         darr._clearColors();
    //     }
    // });

    $("#check").click(() => {
        if (darr) {
            let val = parseInt($("#toCheck").val());
            darr.contains(val);
        }
    });

    $("#set").click(() => {
        if (darr) {
            let index = parseInt($("#toUpdateIndex").val());
            let value = parseInt($("#setValue").val());
            darr.set(index, value);
        }
    });

    $("#get").click(() => {
        if (darr) {
            let index = parseInt($("#toGet").val());
            darr.get(index);
        }
    });

    $("#getI").click(() => {
        if (darr) {
            let element = parseInt($("#toGetIndex").val());
            darr.indexOf(element);
        }
    });
});

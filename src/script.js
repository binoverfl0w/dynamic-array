class DynamicArray {
    #DEFAULT_SIZE = 10;
    #maxSize = 0;
    #array = null;
    #size = 0;

    tl = gsap.timeline();

    constructor(...params) {
        if (params.length == 1) {
            // If one parameter is given when a dynamic array was initialized
            // use the given parameter as the size of the dynamiz array
            this.#maxSize = params[0];
        } else if (params.length == 0) {
            // If no parameter is given use the default size
            this.#maxSize = this.#DEFAULT_SIZE;
        }
        // Initialize the array
        this.#array = new Array(this.#maxSize);
        
        // Visualize the allocation in memory
        this._allocateArrayDiv("array", this.#maxSize);
    }

    get maxSize() {
        // The number of cells for each we have allocated memory
        return this.#maxSize;
    }

    get size() {
        // The number of cells which we are actually using
        return this.#size;
    }

    get toArray() {
        // Get the array itself
        return this.#array;
    }

    add(element) {
        // Check if there is no space left in the array
        if (this.#maxSize == this.#size) {
            // If not, grow the array
            this.grow();
            // Add the element to the new grown array
            this.#array[this.#size] = element;

            // Visualize this process
            this._copyDivToDiv(0,this.#size-2,"array",0, "temp-array");
            this._replaceDiv("array","temp-array");
            this.tl.add(() => this._setInDiv("array",this.#size-1, element));
            return;
        }
        // If there is space left, just insert the element at the end and increment size
        this.#array[this.#size++] = element;

        // Change the value visually too
        this._setInDiv("array",this.#size-1, element);
    }

    addAt(index, element) {
        // Check f index is valid
        if (index >= 0 && index < this.size) {
            // Check if there is no space left in the array
            if (this.#maxSize == this.#size) {
                // If not, grow the array
                this.grow();
                // The new array is arr[0:index] + [new element] + arr[index:this.#size]
                this.#array = Array.prototype.concat(this.#array.slice(0,index),element,this.#array.slice(index,this.#size));
                // Visualize this process
                this._copyDivToDiv(0,index-1,"array",0, "temp-array");    
                this._copyDivToDiv(index,this.#size-2,"array",index+1, "temp-array");  
                this._replaceDiv("array","temp-array");
                this.tl.add(() => this._setInDiv("array",index, element));
                return;
            }
            // If there is space left
            // The new array is arr[0:index] + [new element] + arr[index:this.#size]
            this.#array = Array.prototype.concat(this.#array.slice(0,index),element,this.#array.slice(index,this.#size));
            // Increase the size since we are adding a new element
            ++this.#size;
            
            // Visually shifting all elements to the right to make room for the new element
            this._shiftByOneRight(index);
            this._setInDiv("array",index, element);
        }
    }

    set(index, element) {
        // If index is valid
        if (index >= 0 && index < this.#size) {
            // Set the new value at that index
            this.#array[index] = element;

            // Visually setting the new value
            this._setInDiv("array", index, element);
        }
    }

    removeAt(index) {
        // Check if index is valid
        if (index >= 0 && index < this.#size && this.#size > 0) {
            // if the index is not the last element
            if ((this.#size -= 1) > index) {
                // Shift the array by one place at the left
                for (let i = index; i < this.#size; i++) {
                    this.#array[i] = this.#array[i+1];
                }
                this._shiftByOneLeft(index);
            }
            // Set the value at the end to null
            this.#array[this.#size] = null;

            // Visually do the same process
            this._remove(this.#size);
        }
    }

    remove() {
        // Remove the last element
        this.removeAt(this.#size-1);
    }

    contains(element) {
        // Iterate through the array
        for (let i = 0; i < this.#size; i++) {
            // If the element is found
            if (this.#array[i] == element) {
                // Search visually
                this._searchFromTo(0, i, true);
                this.tl.add(() => $("#checkResult").text("True"));
                this.tl.add(() => this._clearColors());
                return true;
            }
        }
        // Search visually
        this._searchFromTo(0, this.#size - 1, false);
        this.tl.add(() => $("#checkResult").text("False"));
        this.tl.add(() => this._clearColors());
        // If the element is not found
        return false;
    }

    get(index) {
        // Check if the index is valid
        if (index >= 0 && index < this.#size) {
            // Highlight and show the element at that index
            this._highlight(index);
            this.tl.add(() => $("#getElement").text(this.#array[index]));
            this.tl.add(() => this._clearColors());

            // Get the element at that index
            return this.#array[index];
        }
    }

    indexOf(element) {
        let index = 0, found = false;
        // Iterate through the array
        for (; index < this.#size; index++) {
            // If the element is found, break
            if (this.#array[index] == element) {
                found = true;
                break;
            }
        }

        // Search visually and show the index
        this._searchFromTo(0, index, found);
        this.tl.add(() => this._clearColors());
        this.tl.add(() => $("#getIndex").text(found == true ? index : ''));

        return found ? index : -1;
    }
    
    grow() {
        // Increase the new maximum size 
        this.#maxSize = ++this.#size;
        // Allocate memory for our new array
        let newArray = new Array(this.#maxSize);
        // Copy the existing array to our new array
        for (let i = 0; i < this.#size - 1; i++) {
            newArray[i] = this.#array[i];
        }
        // Allocate the array visually
        this._allocateArrayDiv("temp-array");
        // Replace the array with the new bigger one
        this.#array = newArray;
    }
}

DynamicArray.prototype._allocateArrayDiv = function(arrayDiv) {
    $("." + arrayDiv + ".container").html("");
    for (let i = 0; i < this.maxSize; i++) {
        $("." + arrayDiv + ".container").append("<div class='box' style='opacity: 0;' id='"+i+"'><span id='value'></span><i>"+i+"</i></div>");
        let box = $("." + arrayDiv + " div#" + i + ".box");
        this.tl.to(box, {opacity: 1, ease: "slow", duration: 0.2}, ">");
    }
}

DynamicArray.prototype._setInDiv = function(arrayDiv, index, element) {
    //$("." + arrayDiv + "div#" + index + ".box").empty().append("<span id='value'>" + "</span>");
    let box = $("." + arrayDiv + " div#" + index + ".box");
    let span = $("." + arrayDiv + " div#" + index + ".box" + " span");
    this.tl.to(box, {
        duration: 0.3,
        backgroundColor: "#FA8072"
    });
    this.tl.swapText(span,{text: element, duration: 0.2, delay: 0.1});
    this.tl.to(box, {
        duration: 0.5,
        ease: "slow",
        backgroundColor: "#FFFFFF"
    },">");
}

DynamicArray.prototype._updateArrayDiv = function(arrayDiv) {
    for (let i = 0; i < this.toArray.length; i++) {
        this._setInDiv(arrayDiv, i, this.toArray[i] == null ? 'null' : this.toArray[i]);
    }
}

DynamicArray.prototype._copyDivToDiv = function(from, to, arrayDiv, start, tempArrayDiv) {
    for (let i = from; i <= to; i++) {
        let oldVal = $("." + arrayDiv + " div#" + i + ".box");
        this.tl.to(oldVal, {
            duration: 0.2, 
            ease: "expo",
            backgroundColor: "#DC143C"
        }, "<");
        let oldSpan = $("." + arrayDiv + " div#" + i + ".box span");
        this._setInDiv(tempArrayDiv,start++,parseInt(oldSpan.text()));
    }
}

DynamicArray.prototype._replaceDiv = function(arrayDiv, tempArrayDiv) {
    let array = $("." + arrayDiv);
    let temp = $("." + tempArrayDiv);
    this.tl.to(array, {opacity: 0, duration: 0.2});
    this.tl.add(() => array.html(temp.html()));
    this.tl.to(array, {opacity: 1, duration: 0.5});
    this.tl.to(temp, {opacity: 0, ease: "slow", duration: 0.5}, ">");
    this.tl.add(() => {temp.empty(); this.tl.set(temp, {opacity: 1})});
}

DynamicArray.prototype._searchFromTo = function(from, to, found) {
    for (let i = from; i <= to; i++) {
        let box = $("div#" + i + ".box");
        this.tl.to(box, {
            duration: 0.3,
            backgroundColor: i == to && found ? "#228b22" : "#FA8072"
        });
    }
}

DynamicArray.prototype._highlight = function(index) {
    let box = $("div#" + index + ".box");
    this.tl.to(box, {
        duration: 0.5,
        ease: "slow",
        backgroundColor: "#228b22"
    });
}

DynamicArray.prototype._clearColors = function() {
    for (let i = 0; i < this.toArray.length; i++) {
        gsap.set($("div#" + i + ".box"), {backgroundColor : "#FFFFFF"});
    }
}

DynamicArray.prototype._remove = function(index) {
    let box = $("div#" + index + ".box");
    let span = $("div#" + index + ".box" + " span");
    this.tl.to(box, {
        duration: 0.5,
        ease: "expo",
        backgroundColor: "#FA8072"
    });
    this.tl.swapText(span, {text: "null", duration: 0.8});
    this.tl.to(box, {
        duration: 0.5,
        ease: "slow",
        backgroundColor: "#FFFFFF"
    },">");
}

DynamicArray.prototype._shiftByOneLeft = function(index) {
    let i;
    for (i = index; i < this.size; i++) {
        let current = $("div#" + i + ".box");
        let next = $("div#" + (i + 1) + ".box");
        this.tl.to(current, {
            duration: 0.3,
            ease: "expo",
            backgroundColor: "#FA8072"
        });
        this.tl.to(next, {
            duration: 0.6, 
            ease: "expo",
            backgroundColor: "#DC143C"
        }, "<");
        let currentSpan = $("div#" + i + ".box" + " span");
        let nextSpan = $("div#" + (i + 1) + ".box" + " span");
        this.tl.swapText(currentSpan, {text: nextSpan.text(), duration: 0.3}, "+=0.2");
        this.tl.to(current, {
            duration: 0.3,
            ease: "expo",
            backgroundColor: "#FFFFFF"
        }, "+=0.2");
    }
}

DynamicArray.prototype._shiftByOneRight = function(index) {
    let i;
    for (i = this.size-1; i > index; i--) {
        let current = $("div#" + (i) + ".box");
        let next = $("div#" + (i-1) + ".box");
        this.tl.to(current, {
            duration: 0.3,
            ease: "expo",
            backgroundColor: "#FA8072"
        });
        this.tl.to(next, {
            duration: 0.6, 
            ease: "expo",
            backgroundColor: "#DC143C"
        }, "<");
        let currentSpan = $("div#" + (i) + ".box" + " span");
        let nextSpan = $("div#" + (i-1) + ".box" + " span");
        this.tl.swapText(currentSpan, {text: nextSpan.text(), duration: 0.3}, "+=0.2");
        this.tl.to(current, {
            duration: 0.3,
            ease: "expo",
            backgroundColor: "#FFFFFF"
        }, "+=0.2");
    }
}

gsap.registerEffect({
    name: "swapText",
    effect: (targets, config) => {
      let tl = gsap.timeline({delay: config.delay});
      tl.to(targets, {opacity: 0, ease: "slow", duration: config.duration / 2});
      tl.add(() => targets[0].innerText = config.text);
      tl.to(targets, {opacity: 1, ease: "slow", duration: config.duration});
      return tl;
    },
    defaults: {duration: 1}, 
    extendTimeline: true
});
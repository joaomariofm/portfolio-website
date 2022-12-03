"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    var canvas;
    var context;
    // Building canvas
    canvas = document.querySelector('#canvas-tag');
    if (canvas == null)
        return console.log("could not build canvas element!");
    //Setting up canvas dimensions
    if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        const resizeObserver = new ResizeObserver((entries) => {
            if (canvas) {
                canvas.width = entries[0].borderBoxSize[0].inlineSize;
                canvas.height = entries[0].borderBoxSize[0].blockSize;
            }
        });
        resizeObserver.observe(canvas.parentElement);
    }
    else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    console.log("width:", canvas.width, "height:", canvas.height);
    // Building context
    context = canvas.getContext("2d");
    if (context == null)
        return console.log("could not build context element!");
    // Setting up the background color
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Setting up the letters
    var letters = '!@#$%¨&*()_+-=/?123456789ABCDEFGHIJKLMNOPQRSTUVWYXZ';
    // Setting up the columns and lines
    var fontSize = 12;
    var columns = Math.floor(canvas.width / fontSize);
    var lines = canvas.height / fontSize;
    context.font = `${fontSize}px Arial`;
    const dropsLength = 50;
    const dropsSpeeds = [50, 60, 70, 80, 90];
    var drops;
    drops = [];
    function delay(time) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => {
                return setTimeout(resolve, time);
            });
        });
    }
    function setDrops() {
        for (var i = 0; i < columns; i++) {
            var drop = {
                isDropping: false,
                currentX: -1,
                elements: [],
                speed: 0
            };
            drops.push(drop);
        }
    }
    function thereIsAvailableDropSpaces() {
        for (var i = 0; i < drops.length; i++) {
            if (!drops[i].isDropping)
                return true;
        }
        return false;
    }
    function columnIsInUse(column) {
        if (drops[column].isDropping)
            return true;
        return false;
    }
    function createDrop(column, elements) {
        drops[column] = { isDropping: true, elements, currentX: 1, speed: dropsSpeeds[Math.floor(Math.random() * dropsSpeeds.length)] };
    }
    function createDroptemp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!thereIsAvailableDropSpaces())
                return;
            var column = 0;
            do {
                column = Math.floor(Math.random() * columns);
            } while (columnIsInUse(column));
            var elements;
            elements = [];
            // Randomly populate the elements array
            for (var i = 0; i < lines; i++) {
                elements.push(letters[Math.floor(Math.random() * letters.length)]);
            }
            createDrop(column, elements);
            startDrop(drops[column], column);
        });
    }
    function startDrop(drop, column) {
        return __awaiter(this, void 0, void 0, function* () {
            for (var i = 0; i < drop.elements.length + dropsLength; i++) {
                yield delay(drop.speed);
                drop.currentX++;
            }
            //remover drop do array de drops
            drops[column].isDropping = false;
            return;
        });
    }
    function renderDrop(drop, column) {
        for (var i = 1; i < drop.elements.length; i++) {
            if (context) {
                if (i > drop.currentX - dropsLength) {
                    context.fillStyle = 'rgba(109, 40, 217, 1)';
                    if (i === drop.currentX) {
                        context.fillStyle = `rgba(221, 214, 254, 1)`;
                    }
                    if (i < (drop.currentX - dropsLength / 2) && i > drop.currentX - (dropsLength - (dropsLength / 10 * 4))) {
                        context.fillStyle = 'rgba(109, 40, 217, 0.8)';
                    }
                    if (i <= drop.currentX - (dropsLength - (dropsLength / 10 * 4)) && i > drop.currentX - (dropsLength - (dropsLength / 10 * 3))) {
                        context.fillStyle = 'rgba(109, 40, 217, 0.6)';
                    }
                    if (i <= drop.currentX - (dropsLength - (dropsLength / 10 * 3)) && i > drop.currentX - (dropsLength - (dropsLength / 10 * 2))) {
                        context.fillStyle = 'rgba(109, 40, 217, 0.4)';
                    }
                    if (i <= drop.currentX - (dropsLength - (dropsLength / 10 * 2)) && i > drop.currentX - (dropsLength - (dropsLength / 10 * 1))) {
                        context.fillStyle = 'rgba(109, 40, 217, 0.2)';
                    }
                    if (i <= drop.currentX - (dropsLength - (dropsLength / 10 * 1))) {
                        context.fillStyle = 'rgba(109, 40, 217, 0.01)';
                    }
                    context.fillText(drop.elements[i], column * fontSize, i * fontSize);
                }
                if (i === drop.currentX)
                    break;
            }
        }
    }
    function renderScreen() {
        if (context && canvas) {
            context.fillStyle = '#000000';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        for (var i = 0; i < drops.length; i++) {
            if (drops[i].isDropping) {
                renderDrop(drops[i], i);
            }
        }
    }
    function matrix() {
        createDroptemp();
    }
    setDrops();
    setInterval(matrix, 60);
    setInterval(renderScreen, 10);
});

import { KEYS } from "./constant.js";
import { cleanTerminal, catchArrows, writeTerminal } from "./terminal.js";
const defaultOptionsMenu = {
    title: "",
    options: [],
    markedOption: 1,
    colorTitle: "green",
    colorOption: "white",
    bgColorOption: "",
    colorOptionHover: "red",
    bgColorOptionHover: "bgYellow"
};
export default class Menu {
    x = 0;
    y = 0;
    isTemp = false;
    title;
    options = [];
    markedOption = 0;
    colorTitle;
    colorOption;
    bgColorOption;
    colorOptionHover;
    bgColorOptionHover;
    constructor(optionsMenu) {
        const { title, options, markedOption, colorTitle, colorOption, bgColorOption, colorOptionHover, bgColorOptionHover, } = Object.assign(defaultOptionsMenu, optionsMenu);
        this.title = title;
        this.options = options;
        this.markedOption = markedOption;
        this.colorTitle = colorTitle;
        this.colorOption = colorOption;
        this.bgColorOption = bgColorOption;
        this.colorOptionHover = colorOptionHover;
        this.bgColorOptionHover = bgColorOptionHover;
    }
    position(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    addOption(option) {
        this.options.push(option);
    }
    changeTitle(title) {
        this.title = title;
    }
    head(title) {
        this.isTemp = true;
        this.title = title;
        return this;
    }
    item(option, defaultOption = false) {
        this.options.push(option);
        if (defaultOption) {
            this.markedOption = this.options.length - 1;
        }
        return this;
    }
    async render(waitEnter = true) {
        let isReturn = false;
        let isArrow = false;
        let option = this.markedOption + 1;
        if (this.options.length === 0)
            return 0;
        do {
            cleanTerminal();
            await this.renderMenu(option);
            const response = await catchArrows();
            cleanTerminal();
            isArrow = response.isArrow;
            isReturn = response.name === KEYS.RETURN;
            if (response.name === KEYS.UP) {
                option = option === 1 ? this.options.length : option - 1;
            }
            if (response.name === KEYS.DOWN) {
                option = option === this.options.length ? 1 : option + 1;
            }
        } while (isArrow || waitEnter && !isReturn);
        if (this.isTemp) {
            this.isTemp = false;
            this.title = "";
            this.options = [];
        }
        return option;
    }
    async renderMenu(option) {
        const bgColorOptionHover = this.bgColorOptionHover;
        const colorOptionHover = this.colorOptionHover;
        const bgColorOption = this.bgColorOption;
        const colorOption = this.colorOption;
        const colorTitle = this.colorTitle;
        function colored(bgColor, color, opt) {
            if (bgColor === '')
                return `[${color}]${opt}[/${color}]`;
            return `[${bgColor}][${color}]${opt}[/${color}][/${bgColor}]`;
        }
        const optionsText = this.options
            .map((opt, index) => index === option - 1 ?
            colored(bgColorOptionHover, colorOptionHover, opt) :
            opt)
            .join('\n');
        await writeTerminal(`[${colorTitle}]${this.title}[/${colorTitle}]\n${colored(bgColorOption, colorOption, optionsText)}\n`, this.x, this.y);
        return this;
    }
    async json2menu(json) {
        if (json.title)
            this.title = json.title;
        if (json.colorTitle)
            this.colorTitle = json.colorTitle;
        if (json.colorOption)
            this.colorOption = json.colorOption;
        if (json.bgColorOption)
            this.bgColorOption = json.bgColorOption;
        if (json.colorOptionHover)
            this.colorOptionHover = json.colorOptionHover;
        if (json.bgColorOptionHover)
            this.bgColorOptionHover = json.bgColorOptionHover;
        if (json.options)
            this.options = json.options;
        if (json.markedOption)
            this.markedOption = json.markedOption;
        return this;
    }
    async file2json(file) {
        return new Promise((resolve, reject) => {
            try {
                const fs = require('fs');
                fs.readFile(file, 'utf8', (err, data) => {
                    if (err)
                        reject(err);
                    resolve(JSON.parse(data));
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}

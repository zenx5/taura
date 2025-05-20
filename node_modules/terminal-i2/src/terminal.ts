import readline from "node:readline"
import chalk from "chalk"

type colorName = 'black' |
'red' |
'green' |
'yellow' |
'blue' |
'magenta' |
'cyan' |
'white' |
'gray' |
'grey' |
'blackBright' |
'redBright' |
'greenBright' |
'yellowBright' |
'blueBright' |
'magentaBright' |
'cyanBright' |
'whiteBright';

type colorBgName = 'bgBlack' |
'bgRed' |
'bgGreen' |
'bgYellow' |
'bgBlue' |
'bgMagenta' |
'bgCyan' |
'bgWhite' |
'bgGray' |
'bgGrey' |
'bgBlackBright' |
'bgRedBright' |
'bgGreenBright' |
'bgYellowBright' |
'bgBlueBright' |
'bgMagentaBright' |
'bgCyanBright' |
'bgWhiteBright';

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "",
    historySize: 0,
})

export const catchArrows = async () => {
    return new Promise((resolve, reject)=>{
        try{
            process.stdin.setMaxListeners(100)
            process.stdin.on('keypress', function (character, key) {
                if (key && key.ctrl && key.name == 'c') {
                    process.stdin.pause();
                    reject('exit')
                }
                if( ['up', 'down', 'left', 'right'].includes(key.name) ){
                    resolve({ isArrow: true, name:key.name })
                }
                else {
                    resolve({ isArrow: false, name:key.name })
                }
            });
        }catch(e){
            reject(e)
        }
    })
}



export const readTerminal = async (prompt:string, close?:boolean) => {
    return new Promise((resolve, reject)=>{
        try{
            cleanTerminal()
            terminal.question(colorize(prompt), (response)=>{
                if( close ) terminal.close()
                resolve(response)
            })
        }catch(e){
            reject(e)
        }
    })
}

export const writeTerminal = (message:string, x:number = 0, y:number = 0) => {
    cleanTerminal()
    for(let i=0; i<y; i++) terminal.write('\n')
    for(let i=0; i<x; i++) terminal.write(' ')
    const messageMoved = message.replace(/\n/g, `\n${' '.repeat(x)}`)
    terminal.write(colorize(messageMoved as string))
}

export const cleanTerminal = (x:number = 0, y:number = 0) => {
    terminal.write('\x1b[2J\x1b[' + x + ';' + y + 'H');
}

export const colorizeWith = (message:string, color:colorName, bgColor:colorBgName|'' = 'bgBlack') => {
    try{
        if( typeof message !== 'string' ) return message
        if( bgColor!== '' ) return chalk[color][bgColor](message)
        return chalk[color](message)
    }
    catch(e){
        return message
    }
}

export const replaceColorTag = (message:string) => {
    const regex = /\[([a-zA-Z]+)]|\[\/([a-zA-Z]+)]|([^\[]+)/g;
    let match;
    let currentColor = ['white'];
    let currentBgColor = [''];
    const stack = [];
    const result = [];
    while ((match = regex.exec(message)) !== null) {
        const jump = match[0].substring(0,1) === '\n'
        if (match[1]) { // Opening tag (e.g., [red])
            stack.push(match[1]);
            if( match[1]?.includes('bg') ) currentBgColor.push( match[1] )
            else currentColor.push( match[1] )
        } else if (match[2]) { // Closing tag (e.g., [/red])
            stack.pop();
            if( match[2]?.includes('bg') ) currentBgColor.pop()
            else currentColor.pop()
        } else if (match[3]) { // Text content
            result.push({
                text: match[3],
                color: currentColor.at(-1),
                bgColor: currentBgColor.at(-1),
                jump
            });
        }
    }

    return result.map(({ text, color, bgColor, jump }) => {
        return color ? colorizeWith(text, (color ?? 'white') as colorName, bgColor as colorBgName) : text
    }).join("");

}

export const colorize = (message:string) => {
    try{
        if( typeof message !== 'string' ) return message
        return replaceColorTag(message)
    }catch(e){
        return message
    }
}
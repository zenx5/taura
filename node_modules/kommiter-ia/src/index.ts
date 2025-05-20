import process from "node:process";
import { generateAction, menuConfig, help, fromFile, renderListModels, selectGlobal, selectModel, setKey } from "./actions";
import { flags } from "./constants";

export type typeModel = {
    name:       string
    provider:   string
    key:        string
}


(async function(){
    const arg = process.argv.slice(2)
    const ACTIONS = {
        GENERATE: arg.length === 0,
        HELP: arg.includes( flags.help ),
        FILE: arg.includes( flags.file ),
        CONFIG: arg.includes( flags.config ),
        LIST: arg.includes( flags.list ),
        SET_KEY: arg.includes( flags.setKey ),
        SELECT_MODEL: arg.includes( flags.selectModel ),
        SELECT_GLOBAL: arg.includes( flags.selectGlobal ),
    }
    if( ACTIONS.GENERATE ) await generateAction()
    else if( ACTIONS.HELP ) await help()
    else if( ACTIONS.FILE ) await fromFile( getNameFile(arg) )
    else if( ACTIONS.CONFIG ) await menuConfig()
    else if( ACTIONS.LIST ) await renderListModels()
    else if( ACTIONS.SET_KEY ) await setKey()
    else if( ACTIONS.SELECT_MODEL ) await selectModel()
    else if( ACTIONS.SELECT_GLOBAL ) await selectGlobal()
    else {
        console.log("Invalid command")
        process.exit(1)
    }
    process.exit(0)
})()

function getNameFile(arg:string[]) {
    if( arg.includes( flags.fileName ) ) {
        const index = arg.indexOf( flags.fileName )
        return arg[ index + 1] ?? process.env.AI_MODEL_FILENAME_DEFAULT as string
    }
    return process.env.AI_MODEL_FILENAME_DEFAULT as string
}
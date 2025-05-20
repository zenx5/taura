import { readFileSync } from "node:fs";
import { cleanTerminal, readTerminal, writeTerminal } from "./terminal.js";
import { createMenu } from "terminal-i2";
import { createCommitMessageFile, createModel, deleteCommitMessageFile, generateCommitMessage, openEditor, readCommitMessageFile, setGlobal, setPath } from "./commands.js";
import { commit, push } from "./git-command.js";
import { COMMIT_AND_PUSH, EDIT_MESSAGE, NOT_ERROR, ONLY_COMMIT, YES_GLOBAL, models } from "./constants.js";
import { listModels } from "./ia-action.js";
const configMenu = {
    colorTitle: 'red',
    bgColorOption: '',
    colorOption: 'white',
    bgColorOptionHover: 'bgYellow',
    colorOptionHover: 'red',
};
export const generateAction = async (defaultMessage = null, model) => {
    const { message: messageNotFormat, code } = await generateCommitMessage(defaultMessage, model);
    const message = new String(messageNotFormat).replace(/`/gm, "'").replace(/"/gm, "'");
    if (code === NOT_ERROR) {
        const menu = new createMenu(configMenu);
        const response = await menu
            .head(`[white]...:::Kommiter IA:::...[/white]\n¿Desea hacer commit con este mensaje?\n[green]${message}[/green]`)
            .item("Hacer commit", true)
            .item("Hacer commit y push")
            .item("Editar mensaje")
            .item("Cancelar")
            .render();
        try {
            if (response === ONLY_COMMIT) {
                const { error: errorCommit, message: messageCommit } = await commit(message);
                if (errorCommit)
                    throw new Error(messageCommit);
            }
            else if (response === COMMIT_AND_PUSH) {
                const { error: errorCommit, message: messageCommit } = await commit(message);
                if (errorCommit)
                    throw new Error(messageCommit);
                const { error: errorPush, message: messagePush } = await push();
                if (errorPush)
                    throw new Error(messagePush);
            }
            else if (response === EDIT_MESSAGE) {
                const filePath = await createCommitMessageFile(message);
                const result = await openEditor(filePath);
                if (!result)
                    throw new Error("Error al editar el commit");
                const newMessage = await readCommitMessageFile(filePath);
                await deleteCommitMessageFile(filePath);
                cleanTerminal();
                await generateAction(newMessage);
            }
            else {
                cleanTerminal();
                process.exit(0);
            }
            cleanTerminal();
            writeTerminal("Commit realizado con éxito.\n");
        }
        catch (e) {
            cleanTerminal();
            if (e instanceof Error)
                writeTerminal(`Error al realizar el commit: ${e.message}\n`);
            else
                writeTerminal(e);
        }
    }
    else {
        console.log(message);
    }
};
export const fromFile = async (fileName) => {
    try {
        const response = await readFileSync(fileName);
        const { name, provider, key } = JSON.parse(response.toString());
        if (!name || !provider || !key)
            throw new Error("Modelo no definido.");
        await generateAction(null, { name, provider, key });
    }
    catch (e) {
        console.log(e.message);
    }
};
export const menuConfig = async () => {
    const notEndProcess = true;
    let option = 0;
    while (option !== 4) {
        const menu = new createMenu({
            ...configMenu,
            markedOption: 0,
            title: `[white]...:::Kommiter IA:::...\nConfiguración[/white]`,
            options: [
                ' > Configurar clave de API',
                ' > Seleccionar modelo para la carpeta actual',
                ' > Seleccionar modelo global',
                ' > Cancelar'
            ]
        });
        option = await menu.render();
        if (option === 1)
            await setKey(notEndProcess);
        else if (option === 2)
            await selectModel(notEndProcess);
        else if (option === 3)
            await selectGlobal(notEndProcess);
    }
};
export const setKey = async (notEndProcess = false) => {
    const modelOptions = Object.keys(models).map((model, index) => ` > ${model}`);
    const firstMenu = new createMenu({
        ...configMenu,
        markedOption: 0,
        title: `[white]...:::Kommiter IA:::...\nSelecciona proveedor de IA[/white]`,
        options: [...modelOptions, ' > Cancelar']
    });
    const indexProvider = await firstMenu.render();
    if (indexProvider === modelOptions.length + 1) {
        if (notEndProcess)
            return;
        else
            process.exit(0);
    }
    const provider = Object.keys(models)[Number(indexProvider) - 1];
    const messageModels = models[provider].reduce((acc, model, index) => {
        return [...acc, ` > ${model}`];
    }, []);
    const secondMenu = new createMenu({
        ...configMenu,
        markedOption: 0,
        title: `[white]...:::Kommiter IA:::...\nSelecciona modelo de ${provider}:[/white]`,
        options: [...messageModels, ' > Cancelar']
    });
    const indexModel = await secondMenu.render();
    if (indexModel === messageModels.length + 1) {
        if (notEndProcess)
            return;
        else
            process.exit(0);
    }
    const key = await readTerminal("Ingresa tu clave de API: ");
    const thirdMenu = new createMenu({
        ...configMenu,
        markedOption: 0,
        title: `[white]...:::Kommiter IA:::...\nScope de la Key:[/white]`,
        options: [' > Global', ' > Carpeta actual', ' > Cancelar']
    });
    const isGlobal = await thirdMenu.render();
    if (isGlobal === 3) {
        if (notEndProcess)
            return;
        else
            process.exit(0);
    }
    const model = await createModel(models[provider][parseInt(indexModel) - 1], provider, key, isGlobal === YES_GLOBAL);
    if (isGlobal !== YES_GLOBAL) {
        const path = process.cwd();
        await setPath(model.id, path);
    }
};
export const selectModel = async (notEndProcess = true) => {
    const path = process.cwd();
    const models = await listModels({ directory: true });
    const messageModels = models.reduce((acc, model, index) => {
        const directory = model.directory?.find((dir) => dir.path === path);
        if (!directory)
            return [...acc, ` ${index + 1}) ${model.name}`];
        return [...acc, ` > ${model.name} (current)`];
    }, []);
    const menu = new createMenu({
        ...configMenu,
        markedOption: 0,
        title: `[white]...:::Kommiter IA:::...\nSelecciona modelo:[/white]`,
        options: [...messageModels, ' > Cancelar']
    });
    const indexModel = await menu.render();
    if (indexModel === messageModels.length + 1) {
        if (notEndProcess)
            return;
        else
            process.exit(0);
    }
    const model = models[parseInt(indexModel) - 1];
    await setPath(model.id, path);
};
export const selectGlobal = async (notEndProcess = false) => {
    const models = await listModels();
    const messageModels = models.reduce((acc, model, index) => {
        return [...acc, ` > ${model.name} ${model.isGlobal && '(Global)'}`];
    }, []);
    const menu = new createMenu({
        ...configMenu,
        markedOption: 0,
        title: `[white]...:::Kommiter IA:::...\nSelecciona modelo:[/white]`,
        options: [...messageModels, ' > Cancelar']
    });
    const indexModel = await menu.render();
    if (indexModel === messageModels.length + 1) {
        if (notEndProcess)
            return;
        else
            process.exit(0);
    }
    const model = models[parseInt(indexModel) - 1];
    await setGlobal(model.id);
};
export const renderListModels = async () => {
    const models = await listModels();
    const messageModels = models.reduce((acc, model, index) => {
        return [...acc, ` ${index + 1}) ${model.name} ${model.isGlobal && '(Global)'}\n`];
    }, []).join("");
    writeTerminal(` Modelos:\n${messageModels}`);
};
export const help = async () => {
    writeTerminal(`\n  Uso: kommit [opciones]\n  Usa este comando para generar commits para tus cambios en Git\n\n  Opciones:\n    --help
        Muestra esta ayuda\n    --list
        Muestra los modelos disponibles\n    --file
        para proporcionar las credenciales de IA del archivo kommit.json\n    --fileName
        se utiliza para utilizar un nombre de archivo diferente a kommit.json\n    --set-key
        Configura una clave de API\n    --select-model
        Selecciona un modelo para la carpeta actual\n    --select-global
        Selecciona un modelo global\n`);
};

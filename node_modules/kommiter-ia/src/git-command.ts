import { exec } from 'node:child_process'

export const execute = async (command:string) => {
    return new Promise( (resolve, reject) => {
        try{
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject({ error:true, message:error.message });
                    return;
                }
                if (stderr) {
                    resolve({ error:false, message:stderr });
                    return;
                }
                resolve({ error:false, message:stdout });
            });
        }catch(e){
            reject({ error:true, message:e });
        }
    })
}

// execute bash command with nodejs
export const getLastChanges = async () => {
    return await execute("git diff --cached")
}

export const getStatus = async () => {
    return await execute("git status")
}

export const commit = async (message:string) => {
    return await execute( new String('git commit -m "').concat(message,'\n[by Kommiter]"') )
}

export const push = async () => {
    return await execute(`git push`)
}
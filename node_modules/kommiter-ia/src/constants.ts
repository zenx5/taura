export const NOT_ERROR = 0
export const NOT_GLOBAL = 0
export const YES_GLOBAL = 1
export const CANCEL = 0

export const models = {
    "google": [
        "models/gemini-1.5-flash-latest",
        "models/gemini-1.5-pro-latest"
    ],
    "openai": [
        "gpt-4",
        "gpt-4-turbo",
        "gpt-4o-mini",
        "gpt-4o"
    ]
}

export const prefix = [
    'feat: Una nueva característica para el usuario',
    'fix: Arregla un bug que afecta al usuario',
    'perf: Cambios que mejoran el rendimiento del sitio.',
    'build: Cambios en el sistema de build, tareas de despliegue o instalación',
    'ci: Cambios en la integración continua',
    'docs: Cambios en la documentación',
    'refactor: Refactorización del código como cambios de nombre de variables o funciones',
    'style: Cambios de formato, tabulaciones, espacios o puntos y coma, etc; no afectan al usuario',
    'test: Añade tests o refactoriza uno existente'
]

export const ONLY_COMMIT = 1
export const COMMIT_AND_PUSH = 2
export const EDIT_MESSAGE = 3

export const optionsResponse = [
    "Hacer commit",
    "Hacer commit y push",
    "Editar mensaje",
    "Cancelar",
].map( (option, index) => `${index+1}) ${option}`)

export const flags = {
    help:           '--help',
    file:           '--file',
    config:         '--config',
    list:           '--list',
    setKey:         '--set-key',
    selectModel:    '--select-model',
    selectGlobal:   '--select-global',
    fileName:       '--fileName'
}
# Kommiter IA v1.1.0
AI-powered commit generator based on changes made to files.<br/>
Just select the language model, add your API KEY, and forget about contemplating the universe<br/>
while you come up with what to write in your commits.<br/><br/>
![image](https://github.com/user-attachments/assets/34fe021e-79bf-4955-9d99-dca44176f5b0)


## Commands
- kommit: create a new commit message
- kommit --help: show the help menu
- kommit --config: open configure menu
- kommit --list: Shows available models
- kommit --file: to provide the AI ​​credentials from the kommit.json file
- kommit --fileName: is used to use a different file name than kommit.json
- kommit --set-key: set the apikey for the IA
- kommit --select-model: select the model for the IA
- kommit --select-global: select the global model for the IA


## File for model credentials
You can run the kommit command using a file to provide your AI model credentials using the `--file` option. The default file should be called `kommit.json` but you can change the name using the `--fileName` option.
The content of the file must be in the following format.
```
{
    "provider": "google",
    "name": "models/gemini-1.5-flash-latest",
    "key": "***********************************"
}
```

## Quick use
By using the `--file` option, you can run kommit without prior installation using npx, just by correctly configuring the file with the credentials


## Installation
npm install -G kommiter-ia

## GitHub
[https://github.com/zenx5/kommiter-ia](https://github.com/zenx5/kommiter-ia)

## Sponsor it
- Patreon: [https://www.patreon.com/c/Zenx5dev](https://www.patreon.com/c/Zenx5dev)
- Paypal: [https://www.paypal.com/paypalme/omartinez8](https://www.paypal.com/paypalme/omartinez8)

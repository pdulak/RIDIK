## Disclaimer

Hey there! Just wanted to let you know that I'm not really a JS developer, so I'm not exactly an expert when it comes to Electron either. So if you do decide to use it, please keep that in mind and use at your own risk! 

## Installation
1. `npm i`
2. copy `config-sample.json` to `config.json` and fill with proper keys
3. `npm start`

## Todo
- [ ] function to prepare data from other sources - remove HTML tags, excess chars, special chars...
- [ ] handle OpenAI errors: (https://platform.openai.com/docs/guides/error-codes/api-errors)
- [ ] auto-expandable edit field for prompts
- [ ] form that submits on Ctr+Enter for prompts
- [ ] selection of prompt action by buttons or dropdown (auto-searchable?)
- [ ] ability to copy prompt and response using button / shortcut
- [ ] implement general "task result" popup / modal in which the tasks notes and debug info will be displayed instead of putting it in various places like it is now.
- [ ] implement "convert to ColdFusion without explanations" action
- [ ] move requests to OpenAI to Main Process and communicate through IPC
- [ ] move requests to Zadania to Main Process and communicate through IPC
- [ ] use framework such as React or SolidJS
- [ ] "general" panel with predefined tasks that are quickly switched using keyboard shourtuct
- [ ] better way of toggling between dark and light mode
- [ ] add icon 
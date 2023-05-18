## Disclaimer

Hey there! Just wanted to let you know that I'm not really a JS developer, so I'm not exactly an expert when it comes to Electron either. So if you do decide to use it, please keep that in mind and use at your own risk! 

## Installation
1. `npm i`
2. copy `config-sample.json` to `config.json` and fill with proper keys
3. `npx sequelize-cli init`
4. `npx sequelize-cli db:migrate`
3. `npm start`


## Todo
- [X] use Seqelize and connect to sqlite to save some data
  - [ ] table with sample simple "one line" prompts to use, along with command to execute them and keyboard shortcut?
  - [X] table with log of API calls
  - [X] table with system settings
  - [X] table with commands
  - ???
- [ ] ability to stop current conversation
- [ ] better way of handling inforamation about conversation status - is it waiting for response, is it waiting for user to select action, etc.
- [ ] function to prepare data from other sources - remove HTML tags, excess chars, special chars...
- [ ] unfluff parsing of HTML pages
- [ ] library of prompt additions (snippets) such as: `Acknowledge this by just saying "..." and nothing more.` or `Return JSON object, only JSON object and nothing more`
- [ ] library of sources with contents - pages, notes, etc.
- [ ] handle OpenAI errors: (https://platform.openai.com/docs/guides/error-codes/api-errors)
- [ ] selection of prompt action by buttons or dropdown (auto-searchable?)
  - [X] also - using the list of commands stored in the database
- [ ] ability to copy prompt and response using button / shortcut
- [ ] editor for commands - save to DB
- [ ] use framework such as React or SolidJS
- [ ] format response text using code formatter for ``` code parts ```
- [ ] better way of toggling between dark and light mode
- [X] save API calls history in log file / database
- [X] remember conversation steps, give ability to reset conversation
- [X] adjust design of chat window - make it more like a chat window with a sticky prompt at the bottom, conversation that contains questions and answers, etc.
- [X] add icon
- [ ] actions to implement (or save in the database)
  - [X] implement "convert to ColdFusion without explanations" action
  - [X] "act as JS developer..."
  - [X] "act as Python developer..."
  - [X] "act as Spanish teacher"
- [X] "general" panel with predefined tasks that are quickly switched using keyboard shourtuct
- [X] form that submits on Ctr+Enter for prompts
- [X] keyboard shortcut to bring RIDIK window to the top
- [X] implement general "task result" popup / modal in which the tasks notes and debug info will be displayed instead of putting it in various places like it is now.
- [X] auto-expandable edit field for prompts

## Use?
- https://www.npmjs.com/package/unfluff
- https://www.npmjs.com/package/uuid
- https://www.npmjs.com/package/gpt3-tokenizer

### Sample sequelize model creations:

`npx sequelize-cli model:generate --name SysConfig --attributes name:string,value:string`

`npx sequelize-cli model:generate --name Commands --attributes name:string,value:string,description:string`

running seeds:

`npx sequelize-cli db:seed:all`

### Sequelize manual migration
https://dev.to/nedsoft/add-new-fields-to-existing-sequelize-migration-3527

##### Step 1 - Create a new migration
`npx sequelize-cli migration:create --name modify_users_add_new_fields`

##### Step 2 - Edit the migrations to suit the need
```javascript
module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'twitter', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users',
        'linkedin',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users',
        'bio',
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('Users', 'linkedin'),
      queryInterface.removeColumn('Users', 'twitter'),
      queryInterface.removeColumn('Users', 'bio'),
    ]);
  },
};
```

##### Step 3 - run migration
`npx sequelize-cli db:migrate`

## Multi-step task notes

### main database table
- id
- task data
- current status
- task type (defines what steps will be performed)
- is done?

`npx sequelize-cli model:generate --name Task --attributes data:string,status:string,type:string,is_done:boolean`

### task steps
- task id
- step type
- step prompt 
- step results
- step status
- is done?

`npx sequelize-cli model:generate --name TaskStep --attributes task_id:integer,type:string,prompt:string,results:string,status:string,is_done:boolean`

### sample multi-step task: write an article in a given topic
- ask for topic
- generate contents in points
- generate a few sentences for each point
- compile into a single article

### the above multi-step task logic
- is there a task in progress?
  - if yes, is it done?
    - if yes, start a new task
    - if no, continue with the current task
  - if no, start a new task
- first step: ask for topic
- second step: generate contents in points
- third step: generate steps based on contents points
- fourth step: generate a few sentences for each point
- fifth step: compile into a single article


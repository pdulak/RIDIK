## Disclaimer

Hey there! Just wanted to let you know that I'm not really a JS developer, so I'm not exactly an expert when it comes to Electron either. So if you do decide to use it, please keep that in mind and use at your own risk! 

## Installation
1. `npm i`
2. copy `config-sample.json` to `config.json` and fill with proper keys
3. `npx sequelize-cli init`
4. `npx sequelize-cli db:migrate`
3. `npm start`


## Todo
- [ ] save API calls history in log file / database
- [ ] use Seqelize and connect to sqlite to save some data
  - [ ] table with sample simple "one line" prompts to use, along with command to execute them and keyboard shortcut?
  - [ ] table with log of API calls
  - [X] table with system settings
  - ???
- [ ] function to prepare data from other sources - remove HTML tags, excess chars, special chars...
- [ ] unfluff parsing of HTML pages
- [ ] handle OpenAI errors: (https://platform.openai.com/docs/guides/error-codes/api-errors)
- [ ] form that submits on Ctr+Enter for prompts
- [ ] selection of prompt action by buttons or dropdown (auto-searchable?)
  - also - using the list of commands stored in the database
- [ ] ability to copy prompt and response using button / shortcut
- [ ] actions to implement (or save in the database)
  - [ ] implement "convert to ColdFusion without explanations" action
  - [ ] "act as JS developer..."
  - [ ] "act as Python developer..."
  - [ ] "act as Spanish teacher"
- [ ] editor for simple scripts
- [ ] move requests to OpenAI to Main Process and communicate through IPC
- [ ] move requests to Zadania to Main Process and communicate through IPC
- [ ] use framework such as React or SolidJS
- [ ] "general" panel with predefined tasks that are quickly switched using keyboard shourtuct
- [ ] better way of toggling between dark and light mode
- [ ] add icon
- [X] keyboard shortcut to bring RIDIK window to the top
- [X] implement general "task result" popup / modal in which the tasks notes and debug info will be displayed instead of putting it in various places like it is now.
- [X] auto-expandable edit field for prompts

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


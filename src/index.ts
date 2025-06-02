#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { addTask, deleteTask, listTasks } from "./taskManager";

yargs(hideBin(process.argv))
  .command(
    "add [title]",
    "Add a new task",
    (yargs) => {
      return yargs.positional("title", {
        describe: "Task title",
        type: "string",
      });
    },
    async (argv) => {
      let title = argv.title as string;

      if (!title) {
        const answer = await inquirer.prompt({
          type: "input",
          name: "title",
          message: "Task title:",
        });
        title = answer.title;
      }

      addTask(title);
    }
  )
  .command(
    "list",
    "List all tasks",
    () => {},
    () => {
      listTasks();
    }
  )
  .command(
    "delete <id>",
    "Delete a task",
    (yargs) => {
      return yargs.positional("id", {
        describe: "Task ID",
        type: "number",
      });
    },
    (argv) => {
      if (!argv.id) {
        console.log(chalk.red("Task ID is required"));
        return;
      }
      const id = argv.id as number;
      deleteTask(id);
    }
  )
  .command(
    "$0",
    "Interactive mode",
    () => {},
    async () => {
      const { action } = await inquirer.prompt({
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: ["Add Task", "List Tasks", "Delete Task", "Exit"],
      });

      if (action === "Add Task") {
        const { title } = await inquirer.prompt({
          type: "input",
          name: "title",
          message: "Task title:",
        });
        addTask(title);
      } else if (action === "List Tasks") {
        listTasks();
      } else if (action === "Delete Task") {
        const { id } = await inquirer.prompt({
          type: "number",
          name: "id",
          message: "Task ID:",
          validate: (value) => {
            if (value === undefined || isNaN(value)) {
              return "Please enter a valid number";
            }
            return true;
          },
        });
        deleteTask(id);
      } else if (action === "Exit") {
        console.log(chalk.green("Goodbye!"));
        process.exit(0);
      }
    }
  )
  .help()
  .parse();

#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { addTask, deleteTask, listTasks, updateTask } from "./taskManager";

const handleAdd = async ({ title }: { title?: string }) => {
  if (!title) {
    const { title: inputTitle } = await inquirer.prompt({
      type: "input",
      name: "title",
      message: "Task title:",
    });
    title = inputTitle;
  }
  if (title) {
    addTask(title);
  }
};

const handleUpdate = async ({ id, title }: { id?: number; title?: string }) => {
  if (!id || !title) {
    console.log(chalk.red("Task ID and title are required"));
    return;
  }
  updateTask(id, title);
};

const handleDelete = async ({ id }: { id?: number }) => {
  if (!id) {
    console.log(chalk.red("Task ID is required"));
    return;
  }
  deleteTask(id);
};

const handleList = () => {
  listTasks();
};

const handleInteractive = async () => {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What do you want to do?",
    choices: ["Add Task", "Update Task", "List Tasks", "Delete Task", "Exit"],
  });

  const numberValidator = (value: any) => {
    if (value === undefined || isNaN(value)) {
      return "Please enter a valid number";
    }
    return true;
  };

  switch (action) {
    case "Add Task": {
      const { title } = await inquirer.prompt({
        type: "input",
        name: "title",
        message: "Task title:",
      });
      addTask(title);
      break;
    }
    case "Update Task": {
      const { id } = await inquirer.prompt({
        type: "number",
        name: "id",
        message: "Task ID:",
        validate: numberValidator,
      });
      const { title } = await inquirer.prompt({
        type: "input",
        name: "title",
        message: "Task title:",
      });
      updateTask(id, title);
      break;
    }
    case "List Tasks":
      listTasks();
      break;
    case "Delete Task": {
      const { id } = await inquirer.prompt({
        type: "number",
        name: "id",
        message: "Task ID:",
        validate: numberValidator,
      });
      deleteTask(id);
      break;
    }
    case "Exit":
      console.log(chalk.green("Goodbye!"));
      process.exit(0);
  }
};

yargs(hideBin(process.argv))
  .command(
    "add [title]",
    "Add a new task",
    {
      title: {
        describe: "Task title",
        type: "string",
      },
    },
    handleAdd
  )
  .command(
    "update <id> [title]",
    "Update a task",
    {
      id: {
        describe: "Task ID",
        type: "number",
      },
      title: {
        describe: "Task title",
        type: "string",
      },
    },
    handleUpdate
  )
  .command(
    "delete <id>",
    "Delete a task",
    {
      id: {
        describe: "Task ID",
        type: "number",
      },
    },
    handleDelete
  )
  .command("list", "List all tasks", () => {}, handleList)
  .command("$0", "Interactive mode", () => {}, handleInteractive)
  .help()
  .parse();

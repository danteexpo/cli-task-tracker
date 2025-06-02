import chalk from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Task, TaskStatus } from "./types";

const TASKS_FILE = "tasks.json";

export function loadTasks(): Task[] {
  if (!existsSync(TASKS_FILE)) return [];
  return JSON.parse(readFileSync(TASKS_FILE, "utf8"));
}

export function saveTasks(tasks: Task[]) {
  writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

export function addTask(title: string): void {
  const tasks = loadTasks();
  const newTask: Task = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    status: "todo",
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(chalk.green(`Task added: ${title}`));
}

export function updateTask(id: number, title: string): void {
  const tasks = loadTasks();
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.title = title;
    saveTasks(tasks);
    console.log(chalk.green(`Task updated: ${title}`));
  } else {
    console.log(chalk.red(`Task not found: ${id}`));
  }
  saveTasks(tasks);
}

export function deleteTask(id: number): void {
  let tasks = loadTasks();
  const task = tasks.find((task) => task.id === id);
  if (task) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks(tasks);
    console.log(chalk.green(`Task deleted: ${task.title}`));
  } else {
    console.log(chalk.red(`Task not found: ${id}`));
  }
}

export function listTasks(taskStatus?: TaskStatus): void {
  let tasks = loadTasks();
  if (taskStatus) {
    tasks = tasks.filter((task) => task.status === taskStatus);
  }
  tasks.forEach((task) => {
    const status = task.status === "done" ? chalk.green("x") : chalk.gray(" ");
    const id = chalk.blue(task.id);
    const title =
      task.status === "done" ? chalk.gray(task.title) : chalk.white(task.title);
    console.log(`[${status}] ${id}: ${title}`);
  });
}

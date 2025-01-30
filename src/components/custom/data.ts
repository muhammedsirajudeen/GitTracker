import { Priority, Task } from "@/models/TaskManagement";

export const tasks: Task[] = [
  {
    _id: "1",
    ownerId: "user1",
    repositoryId: "repo1",
    taskTitle: "Fix login bug",
    issueId: "issue1",
    description: "Users are unable to log in using their Google accounts",
    priority: Priority.HIGH,
  },
  {
    _id: "2",
    ownerId: "user1",
    repositoryId: "repo1",
    taskTitle: "Implement dark mode",
    issueId: "issue2",
    description: "Add a toggle for dark mode in the user settings",
    priority: Priority.MEDIUM,
  },
  {
    _id: "3",
    ownerId: "user2",
    repositoryId: "repo1",
    taskTitle: "Optimize image loading",
    issueId: "issue3",
    description: "Implement lazy loading for images to improve performance",
    priority: Priority.LOW,
  },
  {
    _id: "4",
    ownerId: "user2",
    repositoryId: "repo2",
    taskTitle: "Update documentation",
    issueId: "issue4",
    description: "Update the API documentation with new endpoints",
    priority: Priority.MEDIUM,
  },
  {
    _id: "5",
    ownerId: "user1",
    repositoryId: "repo2",
    taskTitle: "Fix security vulnerability",
    issueId: "issue5",
    description: "Address the reported XSS vulnerability in the comment system",
    priority: Priority.HIGH,
  },
]


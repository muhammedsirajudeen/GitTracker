import { ITask } from "@/models/TaskManagement";
import TaskRepositoryInstance, { ITaskRepository } from "@/app/repository/TaskRepository";
class TaskService {
    _TaskRepository: ITaskRepository
    constructor(TaskRepository: ITaskRepository) {
        this._TaskRepository = TaskRepository
    }
    async createTask(taskData: Partial<ITask>): Promise<ITask> {
        try {
            return await this._TaskRepository.createTask(taskData);
        } catch (error) {
            const serviceError = error as Error
            throw new Error(`Error creating task: ${serviceError.message}`);
        }
    }

    async getTaskById(taskId: string): Promise<ITask | null> {
        try {
            return await this._TaskRepository.getTaskById(taskId);
        } catch (error) {
            const serviceError = error as Error
            throw new Error(`Error fetching task with ID ${taskId}: ${serviceError.message}`);
        }
    }

    async updateTaskById(taskId: string, updateData: Partial<ITask>): Promise<ITask | null> {
        try {
            return await this._TaskRepository.updateTaskById(taskId, updateData);
        } catch (error) {
            const serviceError = error as Error
            throw new Error(`Error updating task with ID ${taskId}: ${serviceError.message}`);
        }
    }

    async deleteTaskById(taskId: string): Promise<ITask | null> {
        try {
            return await this._TaskRepository.deleteTaskById(taskId);
        } catch (error) {
            const serviceError = error as Error
            throw new Error(`Error deleting task with ID ${taskId}: ${serviceError.message}`);
        }
    }

    async getAllTasks(): Promise<ITask[]> {
        try {
            return await this._TaskRepository.getAllTasks();
        } catch (error) {
            const serviceError = error as Error
            throw new Error(`Error fetching all tasks: ${serviceError.message}`);
        }
    }
    async getTasksByUserandRepo(userid: string, repoid: string) {
        try {
            return await this._TaskRepository.getAllTasksByRepoandUser(userid, repoid);
        } catch (error) {
            const serviceError = error as Error
            throw new Error(`Error fetching tasks by user and repo: ${serviceError.message}`)
        }
    }
}
const TaskServiceInstance = new TaskService(TaskRepositoryInstance)
export default TaskServiceInstance
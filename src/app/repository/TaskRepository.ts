import { Model, Types } from "mongoose";
import BaseRepository from "./BaseRepository";
import TaskManagement, { ITask } from "@/models/TaskManagement";

export interface ITaskRepository {
  createTask(taskData: Partial<ITask>): Promise<ITask>;
  getTaskById(taskId: string): Promise<ITask | null>;
  updateTaskById(taskId: string, updateData: Partial<ITask>): Promise<ITask | null>;
  deleteTaskById(taskId: string): Promise<ITask | null>;
  getAllTasks(): Promise<ITask[]>;
  getAllTasksByRepoandUser:(userid:string,repositoryid:string)=>Promise<ITask[]>
}

class TaskRepository extends BaseRepository implements ITaskRepository {
  private _TaskModel: Model<ITask>;

  constructor(TaskModel: Model<ITask>) {
    super();
    this._TaskModel = TaskModel;
  }

  async createTask(taskData: Partial<ITask>): Promise<ITask> {
    const task = new this._TaskModel(taskData);
    return await task.save();
  }

  async getTaskById(taskId: string): Promise<ITask | null> {
    return await this._TaskModel.findById(taskId).populate([
      { path: 'ownerId', select: 'email avatar_url' },
      { path: 'repositoryId' },
      { path: 'issueId' }
    ]);
  }

  async updateTaskById(taskId: string, updateData: Partial<ITask>): Promise<ITask | null> {
    return await this._TaskModel.findByIdAndUpdate(taskId, updateData, { new: true });
  }

  async deleteTaskById(taskId: string): Promise<ITask | null> {
    return await this._TaskModel.findByIdAndDelete(taskId);
  }

  async getAllTasks(): Promise<ITask[]> {
    return await this._TaskModel.find().populate([
      { path: 'ownerId', select: 'email avatar_url' },
      { path: 'repositoryId' },
      { path: 'issueId' }
    ]);
  }

  async getAllTasksByRepoandUser(userid: string, repositoryid: string): Promise<ITask[]> {
    return await this._TaskModel.find({
      ownerId: new Types.ObjectId(userid),
      repositoryId: new Types.ObjectId(repositoryid)
    }).populate([
      { path: 'ownerId', select: 'email avatar_url' },
      { path: 'repositoryId' },
      { path: 'issueId' }
    ]);
  }
}

const TaskRepositoryInstance = new TaskRepository(TaskManagement);
export default TaskRepositoryInstance;

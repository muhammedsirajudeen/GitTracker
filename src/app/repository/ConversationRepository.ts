import ConversationModel, { Conversation, IConversation } from "@/models/Conversation";
import { Model, Types } from "mongoose";

export interface IConversationRepository{
    getConversationsByFilter:(userId:string,repoId:string)=>Promise<IConversation[]>
    createConversation:(conversation:Conversation)=>Promise<IConversation|null>
}   
class ConversationRepository implements IConversationRepository {
    _ConversationModel:Model<IConversation>
    constructor(ConversationModel:Model<IConversation>){
        this._ConversationModel=ConversationModel
    }
    async getConversationsByFilter(userId:string,repoId:string):Promise<IConversation[]>{
        console.log(userId,repoId)
        return await this._ConversationModel.find({userId:new Types.ObjectId(userId),repositoryId:new Types.ObjectId(repoId)}) as IConversation[]
    }
    async createConversation(conversation:Conversation):Promise<IConversation|null>{
        return await this._ConversationModel.create(conversation)
    }
}

const ConversationRepositoryInstance = new ConversationRepository(ConversationModel);
export default ConversationRepositoryInstance
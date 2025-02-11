import ConversationModel, { Conversation, IConversation } from "@/models/Conversation";
import { Model, Types } from "mongoose";
import BaseRepository from "./BaseRepository";
import RecentActivityServiceInstance from "@/service/RecentActivityService";

export interface IConversationRepository{
    getConversationsByFilter:(userId:string,repoId:string)=>Promise<IConversation[]>
    createConversation:(conversation:Conversation)=>Promise<IConversation|null>
    updateConversation:(conversationId:string,conversation:Partial<Conversation>)=>Promise<IConversation|null>
    deleteConversation:(conversationId:string)=>Promise<boolean>
}   
class ConversationRepository extends BaseRepository implements IConversationRepository {
    _ConversationModel:Model<IConversation>
    constructor(ConversationModel:Model<IConversation>){
        super()
        this._ConversationModel=ConversationModel
    }
    async getConversationsByFilter(userId:string,repoId:string):Promise<IConversation[]>{
        console.log(userId,repoId)
        return await this._ConversationModel.find({userId:new Types.ObjectId(userId),repositoryId:new Types.ObjectId(repoId)}) as IConversation[]
    }
    async createConversation(conversation:Conversation):Promise<IConversation|null>{
        await RecentActivityServiceInstance.createActivity({type:'chat',date:new Date().toDateString(),message:'New conversation created'})
        return await this._ConversationModel.create(conversation)
    }
    async updateConversation(conversationId:string,conversation:Partial<Conversation>):Promise<IConversation|null>{
        try {
            console.log(conversation)
            if(!conversation.chats){
                return null
            }
            const updateConv= await this._ConversationModel.findOneAndUpdate(
                {
                    _id:conversationId
                }
                ,
                {
                    $push: {
                      chats: {
                        $each: [
                            ...conversation.chats
                        ]
                      }
                    }
                  }
                  ,
                {new:true}
            )
            console.log("from repo",updateConv)
            return updateConv
        } catch (error) {
            console.log(error)
            const repoError=error as Error
            this._logger.error(repoError.message)
            return null
        }
    }
    async deleteConversation(coversationId:string){
        try {
            await this._ConversationModel.findByIdAndDelete(coversationId)
            return true
        } catch (error) {
            const repoError=error as Error
            this._logger.error(repoError.message)
            return false
        }
    }
}

const ConversationRepositoryInstance = new ConversationRepository(ConversationModel);
export default ConversationRepositoryInstance